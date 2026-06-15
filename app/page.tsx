import {
  PortalHeader,
  Page,
  Section,
  Grid,
  Card,
  CardBody,
  Badge,
  Button,
  Stack,
  cx,
} from "@/components";
import { SERVICES, ServiceId } from "@/features/portal";
import Image from "next/image";

function ServiceIcon({ id, className }: { id: ServiceId; className?: string }) {
  switch (id) {
    case "bidding":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "meeting":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      );
    case "news":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="16" y2="11" />
        </svg>
      );
    case "newsletter":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "ppt":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      );
    case "crayon":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "fairytale":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          <path d="M5 19c2-2 4-3 7-3s5 1 7 3" />
        </svg>
      );
    default:
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

export default function WorkPortalHomePage() {
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
        search={
          <form className="site-search" id="siteSearch" role="search">
            <input
              type="search"
              id="siteSearchInput"
              placeholder="서비스 검색"
              aria-label="서비스 검색"
              autoComplete="off"
            />
            <button type="submit" className="site-search__btn" aria-label="검색">
              <svg
                className="site-search__icon"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
          </form>
        }
        actions={
          <>
            <Button variant="secondary" size="sm" className="topbar__btn">
              로그인
            </Button>
          </>
        }
      >
        <nav className="site-nav" aria-label="주요 메뉴">
          <button className="site-nav__item is-active tab" type="button">
            홈
          </button>
          <button className="site-nav__item tab" type="button">
            가이드
          </button>
          <button className="site-nav__item tab" type="button">
            사용 이력
          </button>
        </nav>
      </PortalHeader>

      <Page>
        <Stack spacing="lg">
          {/* 히어로 영역 */}
          <section className="portal-hero" aria-label="소개">
            <div className="portal-hero__content">
              <p className="portal-hero__eyebrow">에듀올랩 업무 자동화</p>
              <h1 className="portal-hero__title">통합 업무 포탈</h1>
              <p className="portal-hero__sub">
                한 번의 로그인으로 입찰·회의록·뉴스·제안서·대시보드·e-book 등
                업무 서비스를 이용할 수 있습니다.
              </p>
            </div>
            <div className="portal-hero__deco" aria-hidden="true"></div>
          </section>

          {/* 소식/안내 보드 */}
          <Section>
            <Card variant="default">
              <header className="portal-board__head">
                <div className="portal-board__tabs" role="tablist">
                  <button
                    type="button"
                    className="portal-board__tab is-active"
                    role="tab"
                    aria-selected="true"
                  >
                    최근 사용
                  </button>
                  <button
                    type="button"
                    className="portal-board__tab"
                    role="tab"
                    aria-selected="false"
                  >
                    이용 안내
                  </button>
                </div>
                <button
                  type="button"
                  className="portal-board__more"
                  title="사용 이력 전체 보기"
                >
                  +
                </button>
              </header>
              <CardBody>
                <ul className="portal-notice">
                  <li className="portal-notice__empty">불러오는 중…</li>
                </ul>
              </CardBody>
            </Card>
          </Section>

          {/* 서비스 그리드 및 사이드바 레이아웃 */}
          <div className="portal-layout">
            <header className="portal-layout__title">
              <h2 className="portal-section-title">업무 서비스 바로가기</h2>
            </header>

            <div className="portal-layout__main">
              <Grid cols={3} className="portal-services">
                {SERVICES.map((service) => (
                  <Card
                    key={service.id}
                    variant="clickable"
                    className="portal-tile"
                  >
                    <div
                      className={cx(
                        "portal-tile__icon",
                        `portal-tile__icon--${service.iconType}`
                      )}
                      aria-hidden="true"
                    >
                      <ServiceIcon id={service.iconType} />
                    </div>
                    <div className="portal-tile__body">
                      <div className="portal-tile__head">
                        <h3 className="portal-tile__title">{service.title}</h3>
                        <Badge variant="default" className="badge--muted">
                          확인 중…
                        </Badge>
                      </div>
                      <p className="portal-tile__desc">{service.description}</p>
                      <p className="portal-tile__host">{service.host}</p>
                    </div>
                    <span className="portal-tile__arrow" aria-hidden="true">
                      →
                    </span>
                  </Card>
                ))}
              </Grid>
            </div>

            <aside className="portal-layout__side">
              <Card variant="default" className="portal-sidecard">
                <header className="portal-sidecard__head">
                  <h3>서비스 상태</h3>
                  <span className="portal-sidecard__sub">확인 중…</span>
                </header>
                <ul className="portal-status">
                  <li className="portal-status__item">
                    <span
                      className="portal-notice__empty"
                      style={{ padding: 0 }}
                    >
                      상태를 불러오는 중입니다.
                    </span>
                  </li>
                </ul>
              </Card>
            </aside>
          </div>
        </Stack>
      </Page>
    </>
  );
}
