"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PortalHeader,
  Page,
  Stack,
  Cluster,
  Card,
  Button,
  Badge,
  cx
} from "@/components";
import {
  NewsletterViewType,
  NewsletterGenerateRequest,
  NewsletterGenerateResponse,
  generateNewsletter,
  getMailStatus,
  sendMail,
  NewsletterMailStatusResponse,
  NewsletterRecipient,
  getRecipients,
  saveRecipients,
  importCsv
} from "@/features/newsletter";
import { NewsletterForm } from "./NewsletterForm";

type GenerateState = "idle" | "loading" | "error" | "success";

export function NewsletterWorkspace() {
  const [activeView, setActiveView] = useState<NewsletterViewType>("create");

  return (
    <>
      <PortalHeader
        logo={
          <Link href="/" className="text-decoration-none">
            <Cluster className="cluster-center gap-sm">
              <Image
                src="/shared/eduallab-logo.png"
                alt="에듀올랩"
                width={120}
                height={40}
                className="brand__logo"
              />
              <span className="text-title-sm text-default">교육 소식지</span>
            </Cluster>
          </Link>
        }
      >
        <nav className="site-nav" aria-label="주요 메뉴">
          <button
            className={cx("site-nav__item tab", activeView === "create" && "is-active")}
            onClick={() => setActiveView("create")}
            type="button"
          >
            만들기
          </button>
          <button
            className={cx("site-nav__item tab", activeView === "recipients" && "is-active")}
            onClick={() => setActiveView("recipients")}
            type="button"
          >
            수신자
          </button>
          <Link href="/" className="site-nav__item tab">
            워크포탈 홈
          </Link>
        </nav>
      </PortalHeader>

      <Page>
        {activeView === "create" ? <NewsletterCreateView /> : <NewsletterRecipientsView />}
      </Page>
    </>
  );
}

function NewsletterCreateView() {
  const [generateState, setGenerateState] = useState<GenerateState>("idle");
  const [generateResult, setGenerateResult] = useState<NewsletterGenerateResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [mailStatus, setMailStatus] = useState<NewsletterMailStatusResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState("");
  const [sendErrorMsg, setSendErrorMsg] = useState("");

  useEffect(() => {
    getMailStatus()
      .then(setMailStatus)
      .catch(() => setMailStatus(null));
  }, []);

  const handleGenerate = async (data: NewsletterGenerateRequest) => {
    setGenerateState("loading");
    setErrorMessage("");
    setGenerateResult(null);
    setSendSuccessMsg("");
    setSendErrorMsg("");

    try {
      const result = await generateNewsletter(data);
      setGenerateState("success");
      setGenerateResult(result);
    } catch (err: any) {
      setGenerateState("error");
      setErrorMessage(err.message || "생성에 실패했습니다.");
    }
  };

  const handleSendMail = async () => {
    const sendFile = generateResult?.send_html_file || generateResult?.html_file;
    if (!sendFile || !mailStatus?.ready) return;

    const ok = window.confirm(`${mailStatus.sender} 계정으로 ${mailStatus.recipient_count}명에게 BCC 발송합니다.\n\n계속하시겠습니까?`);
    if (!ok) return;

    setIsSending(true);
    setSendSuccessMsg("");
    setSendErrorMsg("");
    try {
      const res = await sendMail({ html_file: sendFile, dry_run: false, groups: null });
      setSendSuccessMsg(`${res.recipient_count}명 발송 완료`);
    } catch (err: any) {
      setSendErrorMsg(err.message || "발송 실패");
    } finally {
      setIsSending(false);
    }
  };

  const mailReadyBadge = mailStatus?.ready ? (
    <Badge variant="success" soft size="sm">발행 가능</Badge>
  ) : mailStatus?.graph_configured === false ? (
    <Badge variant="warning" soft size="sm">Graph 미설정</Badge>
  ) : mailStatus?.recipients_ready === false ? (
    <Badge variant="warning" soft size="sm">수신자 없음</Badge>
  ) : (
    <Badge variant="warning" soft size="sm">준비 중</Badge>
  );

  return (
    <Stack spacing="lg">
      <header className="page-header">
        <h1 className="text-title-lg">뉴스레터 만들기</h1>
        <p className="text-subtitle">네이버 블로그 링크를 붙여넣으면 발송용 HTML을 자동 생성합니다.</p>
      </header>

      {generateState === "error" && (
        <div className="alert alert-error" role="alert">
          {errorMessage || "생성에 실패했습니다."}
        </div>
      )}

      {sendErrorMsg && (
        <div className="alert alert-error" role="alert">
          {sendErrorMsg}
        </div>
      )}

      {generateState === "success" && generateResult && !sendSuccessMsg && (
        <div className="alert alert-success" role="status">
          {generateResult.issue_label} 완료 · 미리보기 {generateResult.size_kb}KB. 확인 후 메일 발행하세요.
        </div>
      )}

      {sendSuccessMsg && (
        <div className="alert alert-success" role="status">
          {sendSuccessMsg}
        </div>
      )}

      <div className="portal-layout">
        <div className="portal-layout__main">
          <Stack spacing="lg">
            <Card variant="default">
              <Card.Header>
                <Card.Title>블로그 링크</Card.Title>
                <Card.Description>한 줄에 URL 하나씩 · 3~8개</Card.Description>
              </Card.Header>
              <Card.Body>
                <NewsletterForm onSubmit={handleGenerate} isLoading={generateState === "loading"} />
              </Card.Body>
            </Card>

            {generateState === "success" && generateResult && (
              <Card variant="default">
                <Card.Header>
                  <Card.Title>생성 완료 요약</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Stack spacing="md">
                    <p className="text-body-sm">
                      <Badge variant="success" soft size="sm">완료</Badge> {generateResult.issue_label} · 카드 {generateResult.urls_used.length}개
                    </p>
                    <ul className="text-body-sm text-muted preview-url-list">
                      {generateResult.urls_used.map((url, i) => (
                        <li key={i}>{url}</li>
                      ))}
                    </ul>
                  </Stack>
                </Card.Body>
              </Card>
            )}

            <Card variant="default">
              <Card.Header>
                <Cluster className="cluster-between">
                  <Card.Title>미리보기</Card.Title>
                  <Cluster className="gap-sm">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={generateState !== "success" || !generateResult?.preview_url}
                      onClick={() => generateResult?.preview_url && window.open(generateResult.preview_url, '_blank')}
                    >새 탭</Button>

                    {generateState === "success" && generateResult?.download_url ? (
                      <a
                        href={generateResult.download_url}
                        download={generateResult.html_file}
                        className="btn btn--secondary btn--sm text-decoration-none text-inherit"
                      >
                        다운로드
                      </a>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>다운로드</Button>
                    )}
                  </Cluster>
                </Cluster>
              </Card.Header>
              <Card.Body>
                {generateState === "success" && generateResult ? (
                  <iframe
                    src={generateResult.preview_url}
                    className="preview-frame"
                    title="뉴스레터 미리보기"
                  />
                ) : (
                  <div className="preview-placeholder">
                    {generateState === "loading" ? (
                      <p>생성 중입니다. 잠시만 기다려주세요...</p>
                    ) : (
                      <p>링크 입력 후<br/>「뉴스레터 만들기」를 누르면<br/>여기에 표시됩니다</p>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Stack>
        </div>

        <aside className="portal-layout__side">
          <Stack spacing="lg">
            <Card variant="soft">
              <Card.Header>
                <Cluster className="cluster-between">
                  <Card.Title className="text-body-lg">메일 발행</Card.Title>
                  {mailReadyBadge}
                </Cluster>
              </Card.Header>
              <Card.Body>
                <Stack spacing="md">
                  <div>
                    <span className="text-caption">발신: </span>
                    <span className="text-body-sm font-semibold">{mailStatus?.sender || "-"}</span>
                  </div>
                  <div>
                    <span className="text-caption">수신: </span>
                    <span className="text-body-sm font-semibold">{mailStatus?.recipient_count || 0}명</span>
                  </div>
                  <p className="text-caption text-muted">
                    {mailStatus?.ready && generateState === "success" ? "미리보기 확인 후 「메일 발행」을 누르면 BCC로 발송됩니다." : "생성 후 미리보기를 확인하고 발행하세요."}
                  </p>
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={generateState !== "success" || !mailStatus?.ready || isSending || !(generateResult?.send_html_file || generateResult?.html_file)}
                    onClick={handleSendMail}
                  >
                    {isSending ? "발송 중..." : "메일 발행"}
                  </Button>
                </Stack>
              </Card.Body>
            </Card>


            <Card variant="soft">
              <Card.Header>
                <Card.Title className="text-body-lg">이번 호 제외 URL</Card.Title>
              </Card.Header>
              <Card.Body>
                <p className="text-caption text-muted">조회 중...</p>
              </Card.Body>
            </Card>
          </Stack>
        </aside>
      </div>
    </Stack>
  );
}

function NewsletterRecipientsView() {
  const [recipients, setRecipients] = useState<NewsletterRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [mergeCsv, setMergeCsv] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadRecipients = async () => {
    setIsLoading(true);
    setAlertMsg(null);
    try {
      const res = await getRecipients();
      setRecipients(res.recipients.length > 0 ? res.recipients : [{ email: "", name: "", active: true, note: "", group: "" }]);
    } catch (err: any) {
      setAlertMsg({ type: "error", text: err.message || "수신자 목록을 불러오지 못했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setAlertMsg(null);
    try {
      const validRecipients = recipients.filter(r => r.email.trim());
      const res = await saveRecipients({ recipients: validRecipients });
      setAlertMsg({ type: "success", text: `저장 완료 · 발송 대상 ${res.active || 0}명 (전체 ${res.total}명)` });
      loadRecipients();
    } catch (err: any) {
      setAlertMsg({ type: "error", text: err.message || "저장 실패" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setAlertMsg({ type: "error", text: "CSV 파일을 선택하세요." });
      return;
    }
    setIsImporting(true);
    setAlertMsg(null);
    try {
      const res = await importCsv(file, mergeCsv);
      setAlertMsg({ type: "success", text: `CSV 반영 · ${res.active}명 (전체 ${res.total}명)` });
      setFile(null);
      loadRecipients();
    } catch (err: any) {
      setAlertMsg({ type: "error", text: err.message || "CSV 가져오기 실패" });
    } finally {
      setIsImporting(false);
    }
  };

  const addRow = () => {
    setRecipients(prev => [...prev, { email: "", name: "", active: true, note: "", group: "" }]);
  };

  const updateRow = (index: number, field: keyof NewsletterRecipient, value: any) => {
    setRecipients(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeRow = (index: number) => {
    if(!window.confirm("이 수신자를 삭제할까요?")) return;
    setRecipients(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack spacing="lg">
      <header className="page-header">
        <h1 className="text-title-lg">수신자 관리</h1>
        <p className="text-subtitle">발송 대상을 추가·수정합니다. 저장 후 「만들기」에서 메일을 발행하세요.</p>
      </header>

      {alertMsg && (
        <div className={`alert alert-${alertMsg.type}`} role={alertMsg.type === "error" ? "alert" : "status"}>
          {alertMsg.text}
        </div>
      )}

      <Card variant="default">
        <Card.Header>
          <Card.Title>CSV 가져오기</Card.Title>
          <Card.Description>1열 그룹 · 2열 이름 · 3열 이메일 (UTF-8 권장)</Card.Description>
        </Card.Header>
        <Card.Body>
          <Cluster className="cluster-center gap-md">
            <input
              type="file"
              accept=".csv,text/csv"
              className="input input-auto"
              onChange={e => setFile(e.target.files?.[0] || null)}
              key={file ? file.name : "empty"} // Reset file input
            />
            <label className="check-wrap">
              <input
                type="checkbox"
                checked={mergeCsv}
                onChange={e => setMergeCsv(e.target.checked)}
              /> 기존 목록에 합치기
            </label>
            <Button
              variant="secondary"
              onClick={handleImport}
              disabled={isImporting || !file}
            >
              {isImporting ? "가져오는 중..." : "CSV 반영"}
            </Button>
          </Cluster>
        </Card.Body>
      </Card>

      <Card variant="default">
        <Card.Header>
          <Cluster className="cluster-between-start">
            <div>
              <Card.Title>수신자 목록</Card.Title>
              <Card.Description>목록에서 그룹을 바꿀 수 있습니다 · 수신 체크 해제 시 발송 제외</Card.Description>
            </div>
            <Cluster className="gap-sm">
              <Button variant="secondary" size="sm" onClick={addRow}>+ 행 추가</Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving || isLoading}>
                {isSaving ? "저장 중..." : "저장"}
              </Button>
            </Cluster>
          </Cluster>
        </Card.Header>
        <Card.Body>
          <div className="table-wrap table-scroll">
            <table className="table-base">
              <thead>
                <tr>
                  <th className="col-check">수신</th>
                  <th>그룹</th>
                  <th>이메일</th>
                  <th>이름</th>
                  <th>비고</th>
                  <th className="col-action"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="cell-empty">
                      불러오는 중...
                    </td>
                  </tr>
                ) : recipients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="cell-empty">
                      수신자가 없습니다. 「+ 행 추가」 또는 위 CSV 가져오기를 사용하세요.
                    </td>
                  </tr>
                ) : (
                  recipients.map((row, idx) => (
                    <tr key={idx}>
                      <td className="col-check text-center">
                        <input
                          type="checkbox"
                          checked={row.active}
                          onChange={(e) => updateRow(idx, "active", e.target.checked)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-auto"
                          value={row.group}
                          onChange={(e) => updateRow(idx, "group", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          className="input input-auto"
                          value={row.email}
                          onChange={(e) => updateRow(idx, "email", e.target.value)}
                          placeholder="email@company.com"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-auto"
                          value={row.name}
                          onChange={(e) => updateRow(idx, "name", e.target.value)}
                          placeholder="이름"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-auto"
                          value={row.note}
                          onChange={(e) => updateRow(idx, "note", e.target.value)}
                        />
                      </td>
                      <td className="col-action text-center">
                        <button type="button" className="btn-icon" onClick={() => removeRow(idx)} aria-label="삭제">
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Stack>
  );
}
