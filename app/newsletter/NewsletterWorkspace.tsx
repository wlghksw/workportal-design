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
    <div className="newsletter-app">
      <div className="site-header-group">
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
                <span className="text-title-sm text-body">교육 소식지</span>
              </Cluster>
            </Link>
          }
        >
          <div className="site-header__spacer" />
          <nav className="site-nav" aria-label="메뉴">
            <button
              className={cx("site-nav__item", activeView === "create" && "is-active")}
              onClick={() => setActiveView("create")}
              type="button"
            >
              만들기
            </button>
            <button
              className={cx("site-nav__item", activeView === "recipients" && "is-active")}
              onClick={() => setActiveView("recipients")}
              type="button"
            >
              수신자
            </button>
          </nav>
        </PortalHeader>
      </div>

      <main className="newsletter-page">
        {activeView === "create" ? <NewsletterCreateView /> : <NewsletterRecipientsView />}
      </main>
    </div>
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
    <>
      <header className="newsletter-page-hero">
        <h1 className="newsletter-page-title">뉴스레터 만들기</h1>
        <p className="newsletter-page-subtitle">네이버 블로그 링크를 붙여넣으면 발송용 HTML을 자동 생성합니다</p>
      </header>

      <nav className="newsletter-steps" aria-label="진행 단계">
        <div className={cx("newsletter-step", generateState === "idle" && "active", (generateState === "success" || generateState === "loading") && "done")}>
          <span className="newsletter-step__n">1</span>
          <span className="newsletter-step__label">링크 입력</span>
        </div>
        <div className={cx("newsletter-step", generateState === "loading" && "active", generateState === "success" && "done")}>
          <span className="newsletter-step__n">2</span>
          <span className="newsletter-step__label">자동 생성</span>
        </div>
        <div className={cx("newsletter-step", generateState === "success" && "active")}>
          <span className="newsletter-step__n">3</span>
          <span className="newsletter-step__label">검수 · 발행</span>
        </div>
      </nav>

      {errorMessage && (
        <div className="alert alert--error" role="alert">
          {errorMessage}
        </div>
      )}

      {sendErrorMsg && (
        <div className="alert alert--error" role="alert">
          {sendErrorMsg}
        </div>
      )}

      {generateState === "success" && generateResult && !sendSuccessMsg && (
        <div className="alert alert--success" role="status">
          {generateResult.issue_label} 완료 · 미리보기 {generateResult.size_kb}KB. 확인 후 메일 발행하세요.
        </div>
      )}

      {sendSuccessMsg && (
        <div className="alert alert--success" role="status">
          {sendSuccessMsg}
        </div>
      )}

      <div className="newsletter-grid">
        <div className="newsletter-section">
          <div className="newsletter-card">
            <div className="newsletter-card-title">
              <div className="newsletter-card-title-row">
                <div className="newsletter-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <div>
                  <h2>블로그 링크</h2>
                  <p>한 줄에 URL 하나씩 · 3~8개</p>
                </div>
              </div>
            </div>
            <div className="newsletter-card-body">
              <NewsletterForm onSubmit={handleGenerate} isLoading={generateState === "loading"} />
            </div>
          </div>

          <div className="newsletter-card">
            <div className="newsletter-card-title">
              <div className="newsletter-card-title-row">
                <div className="newsletter-card-icon newsletter-card-icon--eye">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h2>미리보기</h2>
              </div>
              <div className="btn-row">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={generateState !== "success" || !generateResult?.preview_url}
                  onClick={() => generateResult?.preview_url && window.open(generateResult.preview_url, '_blank')}
                  aria-label="새 창에서 미리보기 열기"
                  className="btn-ghost"
                >새 탭</Button>

                {generateState === "success" && generateResult?.download_url ? (
                  <a
                    href={generateResult.download_url}
                    download={generateResult.html_file}
                    className="btn btn-ghost btn--sm text-decoration-none text-inherit"
                    aria-label="뉴스레터 HTML 파일 다운로드"
                  >
                    다운로드
                  </a>
                ) : (
                  <Button variant="ghost" size="sm" disabled className="btn-ghost">다운로드</Button>
                )}
              </div>
            </div>
            <div className="newsletter-preview-wrap">
              {generateState === "success" && generateResult ? (
                <iframe
                  src={generateResult.preview_url}
                  className="preview-frame"
                  title="뉴스레터 미리보기"
                />
              ) : (
                <div className="newsletter-preview-empty">
                  <div className="newsletter-preview-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </div>
                  {generateState === "loading" ? (
                    <p>생성 중입니다. 잠시만 기다려주세요...</p>
                  ) : (
                    <p>링크 입력 후<br/>「뉴스레터 만들기」를 누르면<br/>여기에 표시됩니다</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {generateState === "success" && generateResult && (
            <div className="newsletter-card">
              <div className="newsletter-card-title">
                <div className="newsletter-card-title-row">
                  <div className="newsletter-card-icon newsletter-card-icon--green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h2>생성 완료</h2>
                </div>
              </div>
              <div className="newsletter-card-body">
                <p className="text-body-sm">
                  <Badge variant="success" soft size="sm" className="badge-ok">완료</Badge> {generateResult.issue_label} · 카드 {generateResult.urls_used.length}개
                </p>
                <ul className="result-list">
                  {generateResult.urls_used.map((url, i) => (
                    <li key={i}>{url}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <aside className="newsletter-sidebar">
          <div className="newsletter-side-card newsletter-mail-card">
            <div className="newsletter-side-card-head">
              <span className="newsletter-side-card-title">메일 발행</span>
              <span className={cx("cnt-pill", mailStatus?.ready ? "cnt-pill--ok" : "cnt-pill--warn")}>
                {mailStatus?.ready ? "발행 가능" : "확인 중"}
              </span>
            </div>
            <div className="newsletter-side-card-body">
              <div className="newsletter-mail-from">
                <span className="newsletter-mail-from__label">발신</span>
                <span className="newsletter-mail-from__addr">{mailStatus?.sender || "-"}</span>
              </div>
              <div className="newsletter-mail-from">
                <span className="newsletter-mail-from__label">수신</span>
                <span className="newsletter-mail-from__addr">{mailStatus?.recipient_count || 0}명</span>
              </div>
              <div className="newsletter-mail-hint">
                {mailStatus?.ready && generateState === "success" ? "미리보기 확인 후 「메일 발행」을 누르면 BCC로 발송됩니다." : "생성 후 미리보기를 확인하고 발행하세요."}
              </div>
              <Button
                variant="primary"
                fullWidth
                disabled={generateState !== "success" || !mailStatus?.ready || isSending || !(generateResult?.send_html_file || generateResult?.html_file)}
                onClick={handleSendMail}
                className="btn-send btn--block"
              >
                {isSending ? "발송 중..." : "메일 발행"}
              </Button>
            </div>
          </div>

          <div className="newsletter-side-card">
            <div className="newsletter-side-card-head">
              <span className="newsletter-side-card-title">발행 흐름</span>
            </div>
            <div className="newsletter-side-card-body">
              <div className="newsletter-flow-item">
                <div className="newsletter-flow-n">1</div>
                <div className="flow-text"><b>링크 입력</b> 후 생성</div>
              </div>
              <div className="newsletter-flow-item">
                <div className="newsletter-flow-n">2</div>
                <div className="flow-text"><b>미리보기</b> 검수</div>
              </div>
              <div className="newsletter-flow-item">
                <div className="newsletter-flow-n">3</div>
                <div className="flow-text"><b>메일 발행</b> (BCC)</div>
              </div>
            </div>
          </div>

          <div className="newsletter-side-card">
            <div className="newsletter-side-card-head">
              <span className="newsletter-side-card-title">이번 호 제외 URL</span>
              <span className="cnt-pill">...</span>
            </div>
            <div className="newsletter-side-card-body">
              <p className="text-caption text-muted">조회 중...</p>
            </div>
          </div>
        </aside>
      </div>
    </>
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
    <div className="newsletter-section">
      <header className="newsletter-page-hero">
        <h1 className="newsletter-page-title">수신자 관리</h1>
        <p className="newsletter-page-subtitle">발송 대상을 추가·수정합니다. 저장 후 「만들기」에서 메일을 발행하세요.</p>
      </header>

      {alertMsg && (
        <div className={`alert alert--${alertMsg.type}`} role={alertMsg.type === "error" ? "alert" : "status"}>
          {alertMsg.text}
        </div>
      )}

      <div className="newsletter-card">
        <div className="newsletter-card-title">
          <div>
            <h2>CSV 가져오기</h2>
            <p>1열 <strong>그룹</strong> · 2열 <strong>이름</strong> · 3열 <strong>이메일</strong> (UTF-8 권장)</p>
          </div>
        </div>
        <div className="newsletter-card-body">
          <div className="csv-import-row">
            <input
              type="file"
              accept=".csv,text/csv"
              className="input input-auto"
              onChange={e => setFile(e.target.files?.[0] || null)}
              key={file ? file.name : "empty"}
              aria-label="수신자 목록 CSV 파일 선택"
            />
            <label className="check-wrap">
              <input
                type="checkbox"
                checked={mergeCsv}
                onChange={e => setMergeCsv(e.target.checked)}
              /> 기존 목록에 합치기
            </label>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={isImporting || !file}
              className="btn-primary"
            >
              {isImporting ? "가져오는 중..." : "CSV 반영"}
            </Button>
          </div>
        </div>
      </div>

      <div className="newsletter-card">
        <div className="newsletter-card-title">
          <div className="newsletter-card-title-row">
            <div>
              <h2>수신자 목록</h2>
              <p>목록에서 그룹을 바꿀 수 있습니다 · 수신 체크 해제 시 발송 제외</p>
            </div>
          </div>
          <div className="btn-row">
            <Button variant="ghost" size="sm" onClick={addRow} className="btn-ghost">+ 행 추가</Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving || isLoading} className="btn-primary">
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
        <div className="newsletter-card-body">
          <div className="newsletter-recipient-table-wrap">
            <table className="newsletter-table">
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
                          aria-label={`${row.name || row.email || idx + 1}번 수신 여부`}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-auto"
                          value={row.group}
                          onChange={(e) => updateRow(idx, "group", e.target.value)}
                          aria-label={`${idx + 1}번 그룹`}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          className="input input-auto"
                          value={row.email}
                          onChange={(e) => updateRow(idx, "email", e.target.value)}
                          placeholder="email@company.com"
                          aria-label={`${idx + 1}번 이메일`}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-auto"
                          value={row.name}
                          onChange={(e) => updateRow(idx, "name", e.target.value)}
                          placeholder="이름"
                          aria-label={`${idx + 1}번 이름`}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-auto"
                          value={row.note}
                          onChange={(e) => updateRow(idx, "note", e.target.value)}
                          aria-label={`${idx + 1}번 비고`}
                        />
                      </td>
                      <td className="col-action text-center">
                        <button type="button" className="btn-icon" onClick={() => removeRow(idx)} aria-label={`${row.name || row.email || idx + 1}번 수신자 삭제`}>
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="recipient-foot">
            <Button variant="ghost" size="sm" onClick={addRow} className="btn-ghost">+ 행 추가</Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving || isLoading} className="btn-primary">
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
