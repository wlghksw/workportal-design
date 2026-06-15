import {
  PortalHeader,
  Page,
  Section,
  Card,
  Stack,
  Cluster,
  FormField,
  Select,
  Button,
  Badge,
} from "@/components";
import Image from "next/image";
import Link from "next/link";

export default function ActivityPage() {
  return (
    <>
      <PortalHeader
        logo={
          <Image
            src="/shared/eduallab-logo.png"
            alt="에듀올랩"
            width={120}
            height={40}
            className="brand__logo"
          />
        }
        title="통합 업무 포탈"
      >
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/" className="site-nav__item tab">
            홈
          </Link>
          <Link href="/#guide" className="site-nav__item tab">
            가이드
          </Link>
          <Link href="/activity" className="site-nav__item tab is-active">
            사용 이력
          </Link>
        </nav>
      </PortalHeader>

      <Page>
        <Stack spacing="lg">
          <Section>
            <div className="page-header">
              <h1 className="text-title-lg">사용 이력</h1>
              <p className="text-subtitle">
                워크포탈 내 주요 기능 사용 기록을 확인할 수 있습니다.
              </p>
            </div>
          </Section>

          <Section>
            <Card variant="default">
              <Card.Header className="panel__head">
                <Card.Title>기능 사용 로그</Card.Title>
                <Badge variant="neutral" soft size="sm">
                  총 0건
                </Badge>
              </Card.Header>

              <Card.Body>
                <Stack spacing="md">
                  {/* 필터 툴바 */}
                  <Cluster className="activity-toolbar">
                    <FormField label="사용자" htmlFor="user-select">
                      <Select id="user-select" defaultValue="">
                        <option value="">전체</option>
                      </Select>
                    </FormField>
                    <FormField label="서비스" htmlFor="service-select">
                      <Select id="service-select" defaultValue="">
                        <option value="">전체</option>
                      </Select>
                    </FormField>
                    <Button variant="secondary" size="sm">
                      ↻ 새로고침
                    </Button>
                  </Cluster>

                  {/* 타임라인 목록 placeholder */}
                  <ul className="activity-timeline">
                    <li className="activity-empty">목록을 불러오는 중입니다.</li>
                  </ul>

                  {/* 페이징 placeholder */}
                  <Cluster
                    className="activity-footer"
                    style={{
                      justifyContent: "center",
                      gap: "var(--space-4)",
                      marginTop: "var(--space-6)",
                    }}
                  >
                    <Button variant="secondary" size="sm" disabled>
                      이전
                    </Button>
                    <span className="text-body-sm">1 / 1</span>
                    <Button variant="secondary" size="sm" disabled>
                      다음
                    </Button>
                  </Cluster>
                </Stack>
              </Card.Body>
            </Card>
          </Section>
        </Stack>
      </Page>
    </>
  );
}
