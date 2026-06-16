"use client";

import { useState } from "react";
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
import { NewsletterViewType } from "@/features/newsletter";
import { NewsletterForm } from "./NewsletterForm";

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
  return (
    <Stack spacing="lg">
      <header className="page-header">
        <h1 className="text-title-lg">뉴스레터 만들기</h1>
        <p className="text-subtitle">네이버 블로그 링크를 붙여넣으면 발송용 HTML을 자동 생성합니다.</p>
      </header>

      <div className="portal-layout">
        <div className="portal-layout__main">
          <Stack spacing="lg">
            <Card variant="default">
              <Card.Header>
                <Card.Title>블로그 링크</Card.Title>
                <Card.Description>한 줄에 URL 하나씩 · 3~8개</Card.Description>
              </Card.Header>
              <Card.Body>
                <NewsletterForm />
              </Card.Body>
            </Card>

            <Card variant="default">
              <Card.Header>
                <Cluster className="cluster-between">
                  <Card.Title>미리보기</Card.Title>
                  <Cluster className="gap-sm">
                    <Button variant="secondary" size="sm" disabled>새 탭</Button>
                    <Button variant="secondary" size="sm" disabled>다운로드</Button>
                  </Cluster>
                </Cluster>
              </Card.Header>
              <Card.Body>
                <div className="preview-placeholder">
                  <p>링크 입력 후<br/>「뉴스레터 만들기」를 누르면<br/>여기에 표시됩니다</p>
                </div>
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
                  <Badge variant="warning" soft size="sm">준비 중</Badge>
                </Cluster>
              </Card.Header>
              <Card.Body>
                <Stack spacing="md">
                  <div>
                    <span className="text-caption">발신: </span>
                    <span className="text-body-sm font-semibold">partner@kidsedutv.co.kr</span>
                  </div>
                  <div>
                    <span className="text-caption">수신: </span>
                    <span className="text-body-sm font-semibold">0명</span>
                  </div>
                  <p className="text-caption text-muted">생성 후 미리보기를 확인하고 발행하세요.</p>
                  <Button variant="primary" fullWidth disabled>메일 발행</Button>
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
  return (
    <Stack spacing="lg">
      <header className="page-header">
        <h1 className="text-title-lg">수신자 관리</h1>
        <p className="text-subtitle">발송 대상을 추가·수정합니다. 저장 후 「만들기」에서 메일을 발행하세요.</p>
      </header>

      <Card variant="default">
        <Card.Header>
          <Card.Title>CSV 가져오기</Card.Title>
          <Card.Description>1열 그룹 · 2열 이름 · 3열 이메일 (UTF-8 권장)</Card.Description>
        </Card.Header>
        <Card.Body>
          <Cluster className="cluster-center gap-md">
            <input type="file" accept=".csv,text/csv" className="input input-auto" />
            <label className="check-wrap">
              <input type="checkbox" /> 기존 목록에 합치기
            </label>
            <Button variant="secondary">CSV 반영</Button>
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
              <Button variant="secondary" size="sm">+ 행 추가</Button>
              <Button variant="primary" size="sm">저장</Button>
            </Cluster>
          </Cluster>
        </Card.Header>
        <Card.Body>
          <div className="table-wrap">
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
                <tr>
                  <td colSpan={6} className="cell-empty">
                    수신자가 없습니다. 「+ 행 추가」 또는 위 CSV 가져오기를 사용하세요.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Stack>
  );
}
