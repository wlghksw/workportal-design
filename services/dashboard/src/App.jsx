import React, { useEffect, useState } from 'react';
import { platforms } from './data/platforms';
import CrayonSpecView from './components/spec/CrayonSpecView';

const navBtn =
  'w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-all text-left';
const navActive = 'bg-primary-soft text-primary border border-border';
const navIdle = 'text-text-sub hover:text-text-main hover:bg-surface2 border border-transparent';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const currentPlatform = platforms.find((p) => p.id === activeTab);

  useEffect(() => {
    const PORTAL_ACTIVITY_URL = 'https://portal.platformers.kr/api/activity';
    try {
      fetch(PORTAL_ACTIVITY_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'crayon', action: 'view_dashboard', label: '대시보드 조회' }),
      }).catch(() => {});
    } catch (_e) {}
  }, []);

  const getPageTitle = () => {
    if (activeTab === 'dashboard') return '통합 자동화 로드맵';
    if (activeTab === 'spec') return '차세대 기능 내역서';
    return `${currentPlatform.name} 리포트`;
  };

  const getPageSubtitle = () => {
    if (activeTab === 'dashboard') return '6개 핵심 LMS 벤치마킹 기반 크레용스쿨 최적화 전략';
    if (activeTab === 'spec') return '벤치마킹 + DB 분석 기반 크레용스쿨 기능 설계서 v1.0';
    return `${currentPlatform.fullName} 원본 분석 데이터`;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://portal.platformers.kr/assets/portal-header.js?v=1';
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="site-header site-header--service">
        <div className="site-header__row">
          <a className="brand" href="https://portal.platformers.kr/">
            <img
              className="brand__logo"
              src="https://portal.platformers.kr/assets/eduallab-logo.png"
              alt="에듀올랩"
            />
            <span className="brand__sub">크레용스쿨 대시보드</span>
          </a>
          <div className="site-header__spacer" />
          <div className="site-header__actions">
            <span className="topbar__user" id="portalHeaderUser" hidden />
            <a className="topbar__btn" href="https://portal.platformers.kr/">
              워크포탈
            </a>
            <button className="topbar__btn" type="button" id="portalHeaderLogout" hidden>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 max-w-[1400px] w-full mx-auto">
        <aside className="w-64 shrink-0 bg-surface border-r border-border flex flex-col p-4 gap-1 hidden md:flex">
          <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest px-3 pt-2 pb-3">
            메뉴
          </p>
          <nav className="flex-1 space-y-1 overflow-y-auto custom-scroll">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`${navBtn} ${activeTab === 'dashboard' ? navActive : navIdle}`}
            >
              통합 로드맵
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('spec')}
              className={`${navBtn} ${activeTab === 'spec' ? navActive : navIdle}`}
            >
              Crayon Spec
            </button>
            <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest px-3 pt-6 pb-2">
              LMS 벤치마킹
            </p>
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(p.id)}
                className={`${navBtn} ${activeTab === p.id ? navActive : navIdle}`}
              >
                {p.name}
              </button>
            ))}
          </nav>
          <p className="text-[11px] text-text-soft text-center pt-4 border-t border-border mt-2">
            © 2026 Platformers
          </p>
        </aside>

        <main className="flex-1 min-w-0 p-6 md:p-8 flex flex-col h-[calc(100vh-65px)] overflow-hidden">
          <div className="mb-6 shrink-0 md:hidden flex gap-2 overflow-x-auto pb-1 custom-scroll">
            {[
              { id: 'dashboard', label: '로드맵' },
              { id: 'spec', label: 'Spec' },
              ...platforms.map((p) => ({ id: p.id, label: p.name })),
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  activeTab === item.id
                    ? 'bg-primary-soft text-primary border-border'
                    : 'bg-surface text-text-sub border-border'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <header className="mb-6 shrink-0">
            <h1 className="text-2xl font-bold text-text-main tracking-tight mb-1">{getPageTitle()}</h1>
            <p className="text-sm text-text-sub font-medium">{getPageSubtitle()}</p>
          </header>

          <div className="flex-1 overflow-hidden min-h-0">
            {activeTab === 'dashboard' ? (
              <div className="overflow-y-auto h-full pr-1 custom-scroll">
                <DashboardView />
              </div>
            ) : activeTab === 'spec' ? (
              <div className="overflow-y-auto h-full pr-1 custom-scroll">
                <CrayonSpecView />
              </div>
            ) : (
              <div className="flex flex-col h-full space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
                  {currentPlatform.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className="bg-surface p-4 rounded-[14px] border border-border shadow-sm flex justify-between items-center"
                    >
                      <span className="text-[10px] font-bold text-text-soft uppercase tracking-tight">
                        {kpi.label}
                      </span>
                      <span className="text-sm font-bold text-primary">{kpi.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 bg-surface rounded-[14px] border border-border shadow-sm overflow-hidden min-h-0">
                  <iframe
                    src={`/reports/${activeTab}.html`}
                    className="w-full h-full border-none"
                    title={currentPlatform.name}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardView = () => (
  <div className="space-y-6 pb-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface p-6 rounded-[14px] border border-border shadow-sm">
        <div className="text-primary text-3xl font-bold mb-1">0%</div>
        <div className="text-sm font-bold text-text-main">현재 자동화율</div>
        <div className="text-xs text-text-sub mt-1">대부분 수동 행정 업무</div>
      </div>
      <div className="bg-primary p-6 rounded-[14px] shadow-md shadow-blue-500/15 text-white">
        <div className="text-3xl font-bold mb-1">90%</div>
        <div className="text-sm font-bold opacity-95">운영 자동화 목표</div>
        <div className="text-xs opacity-75 mt-1">Phase 1~3 완료 시점</div>
      </div>
      <div className="bg-surface p-6 rounded-[14px] border border-border shadow-sm">
        <div className="text-accent text-3xl font-bold mb-1">2,000+</div>
        <div className="text-sm font-bold text-text-main">도입 레퍼런스 합계</div>
        <div className="text-xs text-text-sub mt-1">벤치마킹 대상사 합산</div>
      </div>
    </div>

    <div className="bg-surface rounded-[14px] border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface2 flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-text-main text-lg tracking-tight">크레용스쿨 통합 자동화 로드맵</h3>
          <p className="text-xs text-text-sub font-semibold mt-1 uppercase tracking-widest">Master Strategy 2026</p>
        </div>
        <span className="px-3 py-1.5 bg-primary-soft text-primary rounded-full text-[10px] font-bold uppercase border border-border">
          In Progress
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-surface2 text-[11px] font-bold text-text-soft uppercase tracking-widest">
              <th className="px-6 py-4">단계</th>
              <th className="px-6 py-4">핵심 목표</th>
              <th className="px-6 py-4">도입 기능 및 벤치마킹 출처</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            <tr className="hover:bg-surface2/80 transition-colors">
              <td className="px-6 py-6">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                  PHASE 1
                </span>
              </td>
              <td className="px-6 py-6 font-bold text-text-main">운영 행정 제로화</td>
              <td className="px-6 py-6 text-text-sub leading-relaxed font-medium">
                • <strong className="text-primary">강사 셀프 정산 신청</strong> (탈잉 Biz)
                <br />• <strong className="text-primary">자동 출결 + 알림톡</strong> (클래스업)
                <br />• <strong className="text-primary">모바일 전자 서명</strong> (온하이)
              </td>
            </tr>
            <tr className="hover:bg-surface2/80 transition-colors">
              <td className="px-6 py-6">
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-100">
                  PHASE 2
                </span>
              </td>
              <td className="px-6 py-6 font-bold text-text-main">물류 및 수익 다각화</td>
              <td className="px-6 py-6 text-text-sub leading-relaxed font-medium">
                • <strong className="text-primary">교구재 키트 배송 연동</strong> (클래스101)
                <br />• <strong className="text-primary">지점별 마이크로 사이트</strong> (이마트)
                <br />• <strong className="text-primary">정부 바우처 결제 연동</strong> (온하이)
              </td>
            </tr>
            <tr className="hover:bg-surface2/80 transition-colors">
              <td className="px-6 py-6">
                <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-[10px] font-bold border border-rose-100">
                  PHASE 3
                </span>
              </td>
              <td className="px-6 py-6 font-bold text-text-main">AI 기반 고객 락인</td>
              <td className="px-6 py-6 text-text-sub leading-relaxed font-medium">
                • <strong className="text-primary">AI 학습 보조 튜터</strong> (클래스팅)
                <br />• <strong className="text-primary">지능형 성취도 리포트</strong> (클래스팅)
                <br />• <strong className="text-primary">실시간 모니터링 캠</strong> (클래스업)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default App;
