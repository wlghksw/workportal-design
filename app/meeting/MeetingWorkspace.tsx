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
  cx,
  FormField,
  Input,
  Select
} from "@/components";
import { MeetingTabType, MEETING_TABS } from "@/features/meeting";

export function MeetingWorkspace() {
  const [activeTab, setActiveTab] = useState<MeetingTabType>("record");

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
              <span className="text-title-sm text-default">회의록 자동화</span>
            </Cluster>
          </Link>
        }
      >
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/" className="site-nav__item tab">
            워크포탈 홈
          </Link>
          <Link href="/guide?service=meeting" className="site-nav__item tab">
            이용 가이드
          </Link>
        </nav>
      </PortalHeader>

      <Page>
        <div className="portal-layout">
          {/* 사이드바: 최근 회의 목록 */}
          <aside className="portal-layout__side">
            <Card variant="default" className="meeting-sidebar">
              <Card.Header className="meeting-sidebar__header">
                <Card.Title className="text-caption font-semibold uppercase">최근 회의</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="meeting-history-empty">
                  <p className="text-caption text-muted">저장된 기록이 없습니다.</p>
                </div>
              </Card.Body>
            </Card>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="portal-layout__main">
            <Stack spacing="lg">
              {/* 메타 정보 입력 */}
              <Card variant="default">
                <Card.Body>
                  <div className="meta-grid">
                    <FormField label="회의 제목" htmlFor="title">
                      <Input id="title" placeholder="예: 4월 마케팅 전략 회의" />
                    </FormField>
                    <FormField label="참석자" htmlFor="participants">
                      <Input id="participants" placeholder="예: 김철수, 이영희" />
                    </FormField>
                    <FormField label="Teams 공유 팀" htmlFor="team">
                      <Select id="team" defaultValue="일반업무">
                        <option value="교육개발">교육개발</option>
                        <option value="영업마케팅">영업마케팅</option>
                        <option value="일반업무">일반업무</option>
                      </Select>
                    </FormField>
                    <Cluster className="cluster-center gap-md mt-2">
                      <FormField label="날짜" htmlFor="date">
                        <Input id="date" type="date" />
                      </FormField>
                      <FormField label="장소" htmlFor="location">
                        <Input id="location" placeholder="예: 본사 회의실" />
                      </FormField>
                    </Cluster>
                  </div>
                </Card.Body>
              </Card>

              {/* 입력 방식 탭 */}
              <Stack spacing="md">
                <nav className="tabs" aria-label="입력 방식 선택">
                  {MEETING_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={cx("tab", activeTab === tab.id && "active")}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </nav>

                <Card variant="default" className="meeting-input-zone">
                  <Card.Body>
                    <div className="meeting-input-placeholder">
                      {activeTab === "record" && <p>🎙️ 마이크 권한 허용 후 녹음을 시작하세요.</p>}
                      {activeTab === "upload" && <p>📁 오디오 파일을 드래그하거나 클릭하여 추가하세요.</p>}
                      {activeTab === "live" && <p>⚡ 실시간으로 전사 및 요약을 확인합니다.</p>}
                    </div>
                  </Card.Body>
                </Card>
              </Stack>

              {/* 액션 버튼 */}
              <Button variant="primary" fullWidth size="lg" disabled>
                회의록 생성 & Teams 공유
              </Button>

              {/* 진행 상태 (Hidden by default) */}
              <div className="meeting-progress-wrap" hidden>
                <Card variant="soft">
                  <Card.Body>
                    <Stack spacing="sm">
                      <div className="progress-bar-bg">
                        <div className="progress-bar progress-bar--zero"></div>
                      </div>
                      <p className="text-caption text-center">준비 중...</p>
                    </Stack>
                  </Card.Body>
                </Card>
              </div>

              {/* 결과 영역 (Hidden by default) */}
              <section className="meeting-result-wrap" hidden aria-labelledby="result-title">
                <Card variant="elevated">
                  <Card.Header>
                    <Cluster className="cluster-between">
                      <Card.Title id="result-title">자동 생성된 회의록</Card.Title>
                      <Badge variant="success" soft>Teams 공유 완료</Badge>
                    </Cluster>
                  </Card.Header>
                  <Card.Body>
                    <div className="meeting-result-content">
                      <p className="text-muted">여기에 생성된 회의록 본문이 표시됩니다.</p>
                    </div>
                  </Card.Body>
                </Card>
              </section>
            </Stack>
          </main>
        </div>
      </Page>
    </>
  );
}
