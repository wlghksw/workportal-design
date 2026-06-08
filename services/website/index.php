<?php
require __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="플랫포머즈(Platformers) — Beyond the Solution. Into the Structure. AI 에이전시·자동화 운영·멀티 플랫폼 개발. 입찰·회의록·뉴스레터 등 실제 운영 솔루션을 납품합니다.">
  <title>플랫포머즈(Platformers) — AI 에이전시 · 업무 자동화 · 멀티 플랫폼</title>
  <link rel="stylesheet" href="static/css/main.css?v=37">
  <link rel="stylesheet" href="static/css/home-awwwards.css?v=8">
</head>

<body class="awwwards-theme">

  <div class="grid-bg"></div>
  <div class="cursor" id="cursor"></div>
  <div class="cursor-ring" id="cursorRing"></div>

  <!-- NAV -->
  <nav>
    <a href="index.php" class="nav-logo">
      <img class="nav-logo-icon" src="static/img/logo-icon-v2-transparent.png?v=19" alt="Platformers">
      <img class="nav-logo-wordmark" src="static/img/logo-wordmark-transparent.png?v=19"
        alt="Platformers — 기업용 AI·웹·앱 개발">
    </a>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#philosophy">Philosophy</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#solutions">Solutions</a></li>
      <li><a href="#cases">Cases</a></li>
    </ul>
    <a href="contact.php" class="nav-cta">Contact Us</a>
  </nav>

  <!-- HERO -->
  <section id="hero">
    <div class="hero-canvas-wrapper">
      <canvas id="heroCanvas"></canvas>
    </div>

    <div class="hero-stack">
      <div class="hero-content">
        <div class="hero-tag">AI 에이전시 · 자동화 운영 · 멀티 플랫폼 개발 · <span class="hero-year">2026 Company Profile</span></div>
        <p class="hero-slogan-en">Beyond the Solution. Into the Structure.</p>
        <p class="hero-ko-pitch">솔루션을 파는 것이 아닙니다. 기업의 <strong>업무 구조를 다시 설계</strong>합니다.</p>
        <h1 class="hero-title">
          PLAT<span class="accent-word">FORM</span><span class="line2">ERS</span>
        </h1>
        <p class="hero-sub">
          <span class="hero-sub-line">솔루션을 파는 것이 아닙니다. 기업의 <strong>업무 구조를 다시 설계</strong>하고, 맥락이 축적되는 <strong>자동화 시스템</strong>을 만들어 드립니다.</span>
        </p>
        <div class="hero-buttons">
          <a href="contact.php" class="btn-primary">도입 문의하기</a>
          <a href="#cases" class="btn-secondary">실제 사례 보기</a>
        </div>
      </div>

      <div class="hero-modules" aria-label="핵심 역량: 연결·추론·실행">
        <div class="hero-mod">
          <div class="hero-mod-head"><span class="hero-mod-en">Connect</span><span class="hero-mod-ko">연결</span></div>
          <p class="hero-mod-desc">SaaS·DB·메일 등 <strong>기존 툴과 안전 연결</strong></p>
        </div>
        <div class="hero-mod">
          <div class="hero-mod-head"><span class="hero-mod-en">Reasoning</span><span class="hero-mod-ko">추론</span></div>
          <p class="hero-mod-desc">목표까지 <strong>단계·우선순위 설계</strong></p>
        </div>
        <div class="hero-mod">
          <div class="hero-mod-head"><span class="hero-mod-en">Execute</span><span class="hero-mod-ko">실행</span></div>
          <p class="hero-mod-desc">보고·수집·일정 등 <strong>도구 조작으로 완료</strong></p>
        </div>
      </div>
    </div>

    <div class="scroll-hint" id="scrollHint">
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
      </div>
      <span class="scroll-text">Scroll</span>
    </div>
  </section>

  <!-- PAIN POINTS -->
  <section id="about" class="pain-section">
    <div class="pain-inner">
      <div class="section-header reveal">
        <div>
          <div class="section-tag">이런 상황이라면</div>
          <h2 class="section-title">매일 반복되는 업무가<br>팀을 붙잡고 있습니다</h2>
        </div>
      </div>
      <div class="pain-grid reveal">
        <div class="pain-card">
          <div class="pain-num">01</div>
          <h3 class="pain-title">같은 작업을 매일 합니다</h3>
          <p class="pain-desc">보고서 작성, 데이터 정리, 메일 발송. 어제도 했고 오늘도 하고 내일도 해야 합니다. 이 시간이 정작 중요한 일을 밀어냅니다.</p>
        </div>
        <div class="pain-card">
          <div class="pain-num">02</div>
          <h3 class="pain-title">AI를 써보고 싶지만 막막합니다</h3>
          <p class="pain-desc">ChatGPT도 써봤지만 실제 업무에 어떻게 연결해야 하는지 모릅니다. 어디서부터 시작해야 할지 감이 없습니다.</p>
        </div>
        <div class="pain-card">
          <div class="pain-num">03</div>
          <h3 class="pain-title">사람을 더 쓰기엔 부담스럽습니다</h3>
          <p class="pain-desc">업무량은 늘어나는데 인원을 늘리기는 어렵습니다. 지금 팀이 더 중요한 일에 집중할 수 있어야 합니다.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- (removed) ABOUT PLATFORMERS — company facts block -->

  <!-- STACKING OVER USING -->
  <section id="philosophy" class="cp-section cp-section--dark">
    <div class="cp-inner reveal">
      <div class="section-tag section-tag--on-dark">03 · Technical Core</div>
      <h2 class="section-title section-title--on-dark">Stacking over Using</h2>
      <p class="section-lead section-lead--on-dark">도구를 쓰는 것과, 회사의 맥락을 <strong>축적</strong>하는 것은 완전히 다른 결과를 만듭니다.</p>
      <div class="cp-compare">
        <div class="cp-compare-col cp-compare-col--as">
          <div class="cp-compare-label">AS-IS</div>
          <ul>
            <li>고정된 솔루션 + 사용자 학습 강요</li>
            <li>매번 배경을 새로 설명</li>
            <li>사람이 일일이 수정·검증</li>
          </ul>
        </div>
        <div class="cp-compare-col cp-compare-col--to">
          <div class="cp-compare-label">TO-BE</div>
          <ul>
            <li>기업 맥락 자산화 + 즉시 적용</li>
            <li>AI가 고유 맥락을 학습</li>
            <li>팀 전체의 생산성 향상</li>
          </ul>
        </div>
      </div>
      <p class="cp-quote">"축적이 경쟁력입니다." — 업무 설계와 기술 설계를 한 팀이 일원화합니다.</p>
    </div>
  </section>

  <!-- 30-YEAR PATTERN -->
  <section id="problem" class="cp-section cp-section--alt">
    <div class="cp-inner reveal">
      <div class="section-tag">02 · The Real Problem</div>
      <h2 class="section-title">도구는 바뀌었지만,<br>한계는 30년째 반복됩니다</h2>
      <p class="section-lead">ERP → CRM → SaaS → AI. 이번에도 “이번엔 다르다”고 했지만, 기업 고유 맥락이 시스템에 쌓이지 않으면 효과는 제한적입니다.</p>
      <div class="cp-stats">
        <div class="cp-stat">
          <span class="cp-stat-era">2006 · ERP</span>
          <span class="cp-stat-value">74%</span>
          <span class="cp-stat-desc">보고·업무 간소화 기여 미흡 (KBS, 2006)</span>
        </div>
        <div class="cp-stat">
          <span class="cp-stat-era">2025 · AI</span>
          <span class="cp-stat-value">85.7%</span>
          <span class="cp-stat-desc">업무 시간 단축 효과 미흡 (경총 100대 기업, 2025)</span>
        </div>
        <div class="cp-stat cp-stat--accent">
          <span class="cp-stat-era">플랫포머즈</span>
          <span class="cp-stat-value">설계</span>
          <span class="cp-stat-desc">AI를 파는 것이 아니라, 업무 구조부터 다시 설계합니다.</span>
        </div>
      </div>
      <div class="cp-timeline">
        <span>ERP</span><span>CRM</span><span>SaaS</span><span class="is-active">AI</span>
      </div>
    </div>
  </section>

  <!-- HOW WE WORK -->
  <section class="how-section">
    <div class="how-inner reveal">
      <div class="section-tag">저희가 하는 일</div>
      <h2 class="section-title">먼저 파악하고,<br>만들어서 넘겨드립니다</h2>
      <p class="section-lead">기술을 파는 게 아닙니다. 반복되는 업무를 없애주는 시스템을 만들어 드립니다.</p>
      <div class="how-steps">
        <div class="how-step">
          <div class="how-step-num">01</div>
          <h3 class="how-step-title">어떤 업무인지 먼저 들어봅니다</h3>
          <p class="how-step-desc">어떤 업무가 반복되고 있는지, 어디서 시간이 가장 많이 쓰이는지 파악합니다. 자동화할 수 있는 지점을 함께 찾습니다.</p>
        </div>
        <div class="how-step">
          <div class="how-step-num">02</div>
          <h3 class="how-step-title">회사 상황에 맞게 설계합니다</h3>
          <p class="how-step-desc">지금 쓰는 툴을 바꾸지 않아도 됩니다. 기존 시스템에 맞춰 자동화 방식을 설계합니다.</p>
        </div>
        <div class="how-step">
          <div class="how-step-num">03</div>
          <h3 class="how-step-title">바로 쓸 수 있게 납품합니다</h3>
          <p class="how-step-desc">완성된 자동화 시스템을 넘겨드립니다. 출시 이후에도 결과를 보면서 계속 다듬어 나갑니다.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- IMPACT (AI 효율성 지표) -->
  <section id="impact" class="impact-section">
    <div class="impact-inner reveal">
      <div class="section-header">
        <div>
          <div class="section-tag">Agent Impact</div>
          <h2 class="section-title">AI 도입 전후<br>업무 효율 변화</h2>
          <p class="section-lead">실제 업무에 AI 에이전트를 적용했을 때의 드라마틱한 변화를 수치로 확인하세요.</p>
        </div>
        <div class="impact-total-badge">
          <span class="impact-total-label">종합 효율성 향상</span>
          <span class="impact-total-value">30~50%</span>
        </div>
      </div>

      <div class="impact-grid">
        <!-- Task 1: Market Intelligence -->
        <div class="impact-card">
          <div class="impact-card-head">
            <span class="impact-card-icon">📊</span>
            <h3 class="impact-card-title">데이터 수집 및 모니터링</h3>
          </div>
          <div class="impact-comparison">
            <div class="comp-item before">
              <div class="comp-label">Before (Manual)</div>
              <div class="comp-bar-wrapper">
                <div class="comp-bar" style="--target-width: 100%"></div>
                <span class="comp-value">15.0h</span>
              </div>
            </div>
            <div class="comp-item after">
              <div class="comp-label">After (AI Agent)</div>
              <div class="comp-bar-wrapper">
                <div class="comp-bar" style="--target-width: 10%"></div>
                <span class="comp-value">1.5h</span>
              </div>
            </div>
          </div>
          <p class="impact-card-desc">웹사이트 모니터링 및 뉴스레터 초안 작성 업무</p>
        </div>

        <!-- Task 2: Reporting & Analysis -->
        <div class="impact-card">
          <div class="impact-card-head">
            <span class="impact-card-icon">📈</span>
            <h3 class="impact-card-title">정기 보고서 분석 및 제작</h3>
          </div>
          <div class="impact-comparison">
            <div class="comp-item before">
              <div class="comp-label">Before (Manual)</div>
              <div class="comp-bar-wrapper">
                <div class="comp-bar" style="--target-width: 80%"></div>
                <span class="comp-value">8.0h</span>
              </div>
            </div>
            <div class="comp-item after">
              <div class="comp-label">After (AI Agent)</div>
              <div class="comp-bar-wrapper">
                <div class="comp-bar" style="--target-width: 5%"></div>
                <span class="comp-value">0.4h</span>
              </div>
            </div>
          </div>
          <p class="impact-card-desc">팀별 업무 데이터 수합 및 주간 성과 보고서 자동화</p>
        </div>

        <!-- Task 3: Lead Accuracy -->
        <div class="impact-card">
          <div class="impact-card-head">
            <span class="impact-card-icon">🎯</span>
            <h3 class="impact-card-title">잠재 고객 분류 정확도</h3>
          </div>
          <div class="impact-comparison">
            <div class="comp-item before">
              <div class="comp-label">Manual Sorting</div>
              <div class="comp-bar-wrapper">
                <div class="comp-bar" style="--target-width: 70%"></div>
                <span class="comp-value">72%</span>
              </div>
            </div>
            <div class="comp-item after">
              <div class="comp-label">AI Agent Sorting</div>
              <div class="comp-bar-wrapper">
                <div class="comp-bar" style="--target-width: 95%"></div>
                <span class="comp-value">95%</span>
              </div>
            </div>
          </div>
          <p class="impact-card-desc">기업 맞춤형 필터링 알고리즘 적용 시 정확도 개선</p>
        </div>
      </div>

      <!-- Additional Metrics -->
      <div class="impact-metrics-row reveal">
        <div class="metric-mini-card">
          <div class="metric-mini-label">인건비 절감 효과</div>
          <div class="metric-mini-value">약 42%</div>
        </div>
        <div class="metric-mini-card">
          <div class="metric-mini-label">24/7 무중단 가동</div>
          <div class="metric-mini-value">100%</div>
        </div>
        <div class="metric-mini-card">
          <div class="metric-mini-label">휴먼 에러 감소</div>
          <div class="metric-mini-value">-90%</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ROI CALCULATOR -->
  <section id="roi" class="roi-section roi-section--collapsible">
    <div class="roi-inner reveal">
      <!-- 버튼만 항상 보임 -->
      <div class="roi-trigger-wrap">
        <button class="roi-toggle-btn" id="roiToggleBtn" aria-expanded="false">
          수치로 확인하기 <span class="roi-toggle-icon">＋</span>
        </button>
      </div>

      <!-- 제목 + 계산기 전체: 기본 숨김 -->
      <div class="roi-collapsible" id="roiCollapsible">
        <div class="roi-collapsible-inner">
          <div class="section-tag" style="margin-bottom:12px">ROI Projector</div>
          <h2 class="section-title">비즈니스 가치 시뮬레이션</h2>
          <p class="section-lead" style="margin-bottom:2rem">자동화 도입 시 예상되는 시간·비용 절감 효과를 직접 계산해보세요.</p>
        <div class="roi-container">
          <div class="roi-controls">
            <div class="roi-control-group">
              <div class="roi-label-row">
                <span class="roi-label">도입 예정 팀원 수</span>
                <span class="roi-val-display"><span id="team-size-val">10</span>명</span>
              </div>
              <input type="range" min="1" max="50" value="10" class="roi-slider" id="team-size-slider">
            </div>
            <div class="roi-control-group">
              <div class="roi-label-row">
                <span class="roi-label">인당 주간 반복 업무 시간</span>
                <span class="roi-val-display"><span id="hours-val">8</span>시간</span>
              </div>
              <input type="range" min="1" max="40" value="8" class="roi-slider" id="hours-slider">
            </div>
          </div>
          <div class="roi-result-card">
            <div class="roi-metric">
              <div class="roi-metric-label">연간 예상 절감 시간</div>
              <div class="roi-metric-value" id="roi-hours-saved">0</div>
              <div class="roi-metric-unit">Hours / Year</div>
            </div>
            <div class="roi-metric roi-metric--highlight">
              <div class="roi-metric-label">연간 예상 절감 비용</div>
              <div class="roi-metric-value">₩<span id="roi-cost-saved">0</span></div>
              <div class="roi-metric-unit">Estimated Savings</div>
            </div>
          </div>
        </div>
        </div><!-- /.roi-collapsible-inner -->
      </div><!-- /.roi-collapsible -->
    </div>
  </section>

  <!-- SUCCESS SCENARIOS — Real EduAllLab Cases -->
  <section id="cases" class="scenarios-section">
    <div class="roi-inner reveal">
      <div class="section-tag">Real Cases — 애듀올랩 × Platformers</div>
      <h2 class="section-title">이렇게 바뀌었습니다</h2>
      <p class="section-lead">교육 기업 애듀올랩의 내부 데이터를 수집·분석해 설계한 실제 AI 에이전트 적용 사례입니다.</p>

      <div class="scenarios-grid">
        <!-- Case 1: Meeting Automation -->
        <div class="scenario-card reveal">
          <div class="scenario-side side-before">
            <div class="scenario-label">Before</div>
            <h3 class="scenario-title">회의 후 정리 — 매번 수작업</h3>
            <p class="scenario-desc">녹음을 듣고 메모를 옮기며 회의록을 작성하고, 결정·액션 아이템을 Teams나 메일로 다시 정리했습니다. 회의 1시간 뒤 정리에 30분~1시간이 더 듭니다.</p>
            <div class="scenario-tag-list">
              <span class="scenario-tag">수동 전사·요약</span>
              <span class="scenario-tag">30~60min / 회의</span>
            </div>
          </div>
          <div class="scenario-side side-after">
            <div class="scenario-label">After — 회의록 자동화</div>
            <h3 class="scenario-title">전사 → AI 회의록 → Teams 공유</h3>
            <p class="scenario-desc">녹음·업로드만 하면 STT 전사 후 결정·액션·안건이 구조화된 회의록이 생성됩니다. 회의 중 실시간 초안, 종료 후 최종본·Teams 공유까지 한 흐름으로 처리합니다.</p>
            <div class="scenario-tag-list">
              <span class="scenario-tag">Whisper STT</span>
              <span class="scenario-tag">실시간 노트</span>
              <span class="scenario-tag">Teams 연동</span>
            </div>
          </div>
        </div>

        <!-- Case 2: Newsletter Automation -->
        <div class="scenario-card reveal">
          <div class="scenario-side side-before">
            <div class="scenario-label">Before</div>
            <h3 class="scenario-title">월간 뉴스레터 — 4~6시간 수작업</h3>
            <p class="scenario-desc">블로그 글 링크를 모아 레이아웃을 짜고, HTML을 손으로 맞춘 뒤 메일 발송까지 담당자가 직접 처리했습니다. 매월 반복되는 4~6시간짜리 작업이었습니다.</p>
            <div class="scenario-tag-list">
              <span class="scenario-tag">수동 HTML·발행</span>
              <span class="scenario-tag">4~6h / 월</span>
            </div>
          </div>
          <div class="scenario-side side-after">
            <div class="scenario-label">After — 교육 뉴스레터 자동화</div>
            <h3 class="scenario-title">링크 입력 → HTML 생성 → 메일 발행</h3>
            <p class="scenario-desc">네이버 블로그 URL만 넣으면 발송용 HTML이 자동 생성됩니다. 미리보기·검수 후 Microsoft Graph로 BCC 발행까지 웹에서 완료합니다.</p>
            <div class="scenario-tag-list">
              <span class="scenario-tag">Newsletter Agent</span>
              <span class="scenario-tag">검토 15min / 월</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SERVICES (2026 Company Profile — 3 packages) -->
  <section id="services">
    <div class="section-header reveal">
      <div>
        <div class="section-tag">Our Service</div>
        <h2 class="section-title">3가지<br>서비스 패키지</h2>
        <p class="section-lead section-lead--tight">데이터 컨설팅부터 자동화 운영, 풀스택 개발까지 — 비즈니스 단계에 맞춰 설계합니다.</p>
      </div>
    </div>

    <div class="service-grid reveal">
      <div class="service-card">
        <div class="service-num">01</div>
        <div class="service-name">AI 에이전시</div>
        <p class="service-desc">AI 도입 진단·로드맵, 지식 베이스(RAG) 설계, 프롬프트·에이전트 구축. 반복 업무의 70% 자동화와 맥락 축적(Stacking)을 목표로 합니다.</p>
        <div class="service-tags">
          <span class="service-tag">도입 진단</span>
          <span class="service-tag">RAG · 지식 베이스</span>
          <span class="service-tag">프롬프트 엔지니어링</span>
        </div>
      </div>
      <div class="service-card">
        <div class="service-num">02</div>
        <div class="service-name">자동화 운영</div>
        <p class="service-desc">입찰 모니터링, 회의록·뉴스레터, 교육 뉴스 큐레이션 등 실제 운영 중인 에이전트를 맞춤 구축·운영합니다. Teams·Slack 연동 포함.</p>
        <div class="service-tags">
          <span class="service-tag">입찰·회의록</span>
          <span class="service-tag">뉴스레터·리포트</span>
          <span class="service-tag">24/7 모니터링</span>
        </div>
      </div>
      <div class="service-card">
        <div class="service-num">03</div>
        <div class="service-name">소프트웨어 개발</div>
        <p class="service-desc">웹·앱·관리자 대시보드 풀스택 개발, 레거시 현대화. 업무 설계와 기술 설계를 한 팀이 일원화해 진행합니다.</p>
        <div class="service-tags">
          <span class="service-tag">웹·앱</span>
          <span class="service-tag">대시보드</span>
          <span class="service-tag">통합 워크포탈</span>
        </div>
      </div>
    </div>
  </section>

  <!-- LIVE SOLUTIONS (실제 운영 · portal 연동) -->
  <section id="solutions" class="how-section" style="padding-top:0">
    <div class="how-inner reveal">
      <div class="section-tag">Real Solutions</div>
      <h2 class="section-title">지금 운영 중인<br>자동화 솔루션</h2>
      <p class="section-lead">교육·콘텐츠 기업 현장에서 검증한 모듈입니다. 통합 워크포탈에서 한곳에 접속할 수 있습니다.</p>
      <div class="service-grid" style="margin-top:2rem">
        <div class="service-card">
          <div class="service-num">—</div>
          <div class="service-name">입찰 공고 모니터링</div>
          <p class="service-desc">공공·민간 입찰 공고 수집·점수화·알림. 수동 조회 시간을 줄입니다.</p>
          <div class="service-tags">
            <span class="service-tag">실시간 수집</span>
            <span class="service-tag">키워드 필터</span>
          </div>
        </div>
        <div class="service-card">
          <div class="service-num">—</div>
          <div class="service-name">회의록 자동화</div>
          <p class="service-desc">녹음·전사·AI 회의록·Teams 공유. 회의 중 실시간 노트 지원.</p>
          <div class="service-tags">
            <span class="service-tag">STT</span>
            <span class="service-tag">AI 요약</span>
          </div>
        </div>
        <div class="service-card">
          <div class="service-num">—</div>
          <div class="service-name">교육 뉴스레터</div>
          <p class="service-desc">블로그 링크 → HTML 뉴스레터 → Graph 메일 발행·수신자 관리.</p>
          <div class="service-tags">
            <span class="service-tag">HTML 생성</span>
            <span class="service-tag">BCC 발행</span>
          </div>
        </div>
        <div class="service-card">
          <div class="service-num">—</div>
          <div class="service-name">교육 뉴스 · PPT · 대시보드</div>
          <p class="service-desc">교육 분야 뉴스 수집, 제안서·PPT 자동 생성, 크레용스쿨 대시보드 등 확장 모듈.</p>
          <div class="service-tags">
            <span class="service-tag">뉴스 RSS</span>
            <span class="service-tag">제안서</span>
          </div>
        </div>
      </div>
      <p style="margin-top:1.5rem;text-align:center">
        <a href="https://portal.platformers.kr/" class="btn-secondary">통합 워크포탈에서 보기 →</a>
      </p>
    </div>
  </section>

  <!-- PORTFOLIO (전체 프로젝트, 필터 포함) -->
  <section id="portfolio" class="home-portfolio">
    <div class="section-header reveal">
      <div>
        <div class="section-tag">Work</div>
        <h2 class="section-title">Our<br>Projects</h2>
        <p class="section-lead section-lead--tight">자사 운영 서비스와 공개 가능한 클라이언트 작업 일부입니다.</p>
      </div>
    </div>

    <!-- 카테고리 필터 -->
    <div class="category-nav reveal">
      <div class="filter-buttons">
        <?php foreach ($categories as $category): ?>
          <?php
          $isAll   = ($category === '전체');
          $dataCat = $isAll ? 'all' : $category;
          $btnClass = 'filter-btn' . ($isAll ? ' active' : '');
          ?>
          <button type="button" class="<?php echo htmlspecialchars($btnClass); ?>"
            data-category="<?php echo htmlspecialchars($dataCat); ?>">
            <?php echo htmlspecialchars($category); ?>
          </button>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- 전체 프로젝트 그리드 -->
    <div class="portfolio-grid" id="portfolioGrid">
      <?php foreach ($projects as $project): ?>
        <?php $hasSlides = !empty($project['slides']); ?>
        <div class="project-card reveal portfolio-item"
          data-category="<?php echo htmlspecialchars($project['category']); ?>">
          <div class="project-visual" <?php if (!$hasSlides): ?>style="background-image:url('<?php echo htmlspecialchars($project['thumbnail'], ENT_QUOTES); ?>');background-size:cover;background-position:center top;"<?php endif; ?>>

            <?php if ($hasSlides): ?>
            <div class="card-slider" data-slider>
              <div class="card-slider-track">
                <?php foreach ($project['slides'] as $slide): ?>
                  <?php $sv = @filemtime($slide) ?: time(); ?>
                  <div class="card-slide" style="background-image:url('<?php echo htmlspecialchars($slide); ?>?v=<?php echo $sv; ?>')"></div>
                <?php endforeach; ?>
              </div>
              <div class="card-slider-dots">
                <?php foreach ($project['slides'] as $i => $slide): ?>
                  <span class="slider-dot <?php echo $i === 0 ? 'active' : ''; ?>" data-index="<?php echo $i; ?>"></span>
                <?php endforeach; ?>
              </div>
            </div>
            <?php endif; ?>

            <div class="project-overlay <?php echo (!$hasSlides && $project['id'] == 2) ? 'project-overlay--image' : ''; ?>">
              <a href="<?php echo htmlspecialchars($project['url']); ?>"
                 target="<?php echo (strpos($project['url'], 'http') === 0) ? '_blank' : '_self'; ?>"
                 rel="noopener noreferrer"
                 class="project-overlay-btn <?php echo (!$hasSlides && $project['id'] == 2) ? 'project-overlay-btn--image' : ''; ?>">
                 <?php if (!$hasSlides && $project['id'] == 2): ?>
                    <img src="<?php echo htmlspecialchars($project['thumbnail']); ?>" alt="View Project">
                 <?php else: ?>
                    View Project →
                 <?php endif; ?>
              </a>
            </div>
          </div>
          <div class="project-info">
            <div>
              <div class="project-category"><?php echo htmlspecialchars($project['category']); ?></div>
              <div class="project-name"><?php echo htmlspecialchars($project['title']); ?></div>
            </div>
            <a href="<?php echo htmlspecialchars($project['url']); ?>"
              target="<?php echo (strpos($project['url'], 'http') === 0) ? '_blank' : '_self'; ?>"
              rel="noopener noreferrer" class="project-arrow">↗</a>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- OUR CLIENTS (로고 마퀴) -->
  <section id="marquee" class="corp-marquee" aria-label="함께한 파트너">
    <div class="marquee-label">Our Clients — 함께한 파트너 · 자사 브랜드</div>
    <div class="marquee-overflow">
      <div class="marquee-track" id="marqueeTrack">
        <div class="marquee-item">애듀올랩</div>
        <div class="marquee-item">플랫포머즈</div>
        <div class="marquee-item">어크로스페이스</div>
        <div class="marquee-item">애듀올랩</div>
        <div class="marquee-item">플랫포머즈</div>
        <div class="marquee-item">어크로스페이스</div>
      </div>
    </div>
  </section>

  <!-- PROCESS — 5-Step AI Agent Pipeline -->
  <section id="process" class="pipeline-section">
    <div class="pipeline-inner">

      <div class="section-header reveal">
        <div>
          <div class="section-tag">How We Work</div>
          <h2 class="section-title">데이터에서<br>에이전트까지</h2>
          <p class="section-lead">기업의 내부 데이터를 직접 수집·분석하고, 실제 병목을 진단한 뒤, 목표를 달성하는 멀티 에이전트 시스템을 설계·구축합니다.</p>
        </div>
      </div>

      <!-- 5-Step Pipeline -->
      <div class="pipeline-track">

        <div class="pipe-step reveal" style="--clr:#2f7bff">
          <div class="pipe-step-top">
            <span class="pipe-num">01</span>
            <span class="pipe-en">Collect</span>
          </div>
          
          <h3 class="pipe-title">기업 내부<br>데이터 수집</h3>
          <p class="pipe-desc">사용 중인 시스템과 데이터 소스를 전수 매핑합니다. DB, API, 문서, 메일, 캘린더까지 연결 가능한 모든 소스를 파악합니다.</p>
          <div class="pipe-chips">
            <span>DB / API 연결</span>
            <span>문서·메일</span>
            <span>시스템 현황</span>
          </div>
        </div>

        <div class="pipe-connector" aria-hidden="true"></div>

        <div class="pipe-step reveal" style="--clr:#1e5ee6">
          <div class="pipe-step-top">
            <span class="pipe-num">02</span>
            <span class="pipe-en">Analyze</span>
          </div>
          
          <h3 class="pipe-title">데이터 분석<br>&amp; 병목 진단</h3>
          <p class="pipe-desc">수집된 데이터로 어디서 시간이 낭비되고 오류가 발생하는지 정밀 진단합니다. 자동화 ROI가 가장 높은 지점을 우선 선별합니다.</p>
          <div class="pipe-chips">
            <span>업무 흐름 분석</span>
            <span>병목 식별</span>
            <span>ROI 우선순위</span>
          </div>
        </div>

        <div class="pipe-connector" aria-hidden="true"></div>

        <div class="pipe-step reveal" style="--clr:#3fd1ff">
          <div class="pipe-step-top">
            <span class="pipe-num">03</span>
            <span class="pipe-en">Design</span>
          </div>
          
          <h3 class="pipe-title">요구사항<br>설계 및 정의</h3>
          <p class="pipe-desc">기업 목표를 에이전트가 실행 가능한 태스크로 분해합니다. 어떤 에이전트가 무엇을 해야 하는지, 성공 기준(KPI)을 명확히 정의합니다.</p>
          <div class="pipe-chips">
            <span>목표 → 태스크</span>
            <span>KPI 정의</span>
            <span>역할 설계</span>
          </div>
        </div>

        <div class="pipe-connector" aria-hidden="true"></div>

        <div class="pipe-step reveal" style="--clr:#1a4db8">
          <div class="pipe-step-top">
            <span class="pipe-num">04</span>
            <span class="pipe-en">Build</span>
          </div>
          
          <h3 class="pipe-title">멀티 AI<br>에이전트 구축</h3>
          <p class="pipe-desc">태스크별 전문 에이전트를 개발하고, 오케스트레이터 에이전트가 전체를 조율합니다. 기존 시스템과 API로 완전 연동합니다.</p>
          <div class="pipe-chips">
            <span>전문 에이전트</span>
            <span>오케스트레이터</span>
            <span>API 연동</span>
          </div>
        </div>

        <div class="pipe-connector" aria-hidden="true"></div>

        <div class="pipe-step reveal" style="--clr:#2f7bff">
          <div class="pipe-step-top">
            <span class="pipe-num">05</span>
            <span class="pipe-en">Optimize</span>
          </div>
          
          <h3 class="pipe-title">성과 측정<br>&amp; 지속 최적화</h3>
          <p class="pipe-desc">에이전트 로그와 KPI 데이터 기반으로 지속 개선합니다. 새로운 요구사항이 생기면 에이전트를 추가하거나 재설계해 시스템을 확장합니다.</p>
          <div class="pipe-chips">
            <span>성과 모니터링</span>
            <span>성능 튜닝</span>
            <span>시스템 확장</span>
          </div>
        </div>

      </div><!-- /pipeline-track -->

      <!-- Real Case Study -->
      <div class="pipeline-case reveal">
        <div class="pcase-eyebrow">실제 적용 사례 — Platformers × 애듀올랩</div>
        <div class="pcase-body">
          <div class="pcase-left">
            <h3 class="pcase-client">교육 기업 전사 자동화<br>프로젝트</h3>
            <p class="pcase-desc">교육 기업 내부 데이터를 직접 수집·분석해 입찰 모니터링, 회의록(STT·AI 요약), 교육 뉴스레터 발행, 교육 뉴스·제안서 등 핵심 반복 업무를 통합 워크포탈과 에이전트로 운영 중입니다.</p>
            <a href="work-meeting-automation.php" class="btn-secondary pcase-cta">케이스 상세 보기 →</a>
          </div>
          <div class="pcase-right">
            <div class="pcase-agent-label">투입된 AI 에이전트</div>
            <div class="pcase-agent-grid">
              <div class="pcase-chip"><span class="pcase-chip-icon">🔍</span><span>입찰 공고 모니터링</span></div>
              <div class="pcase-chip"><span class="pcase-chip-icon">🎙️</span><span>회의록 · 실시간 전사</span></div>
              <div class="pcase-chip"><span class="pcase-chip-icon">📧</span><span>교육 뉴스레터 발행</span></div>
              <div class="pcase-chip"><span class="pcase-chip-icon">📰</span><span>교육 뉴스 수집</span></div>
              <div class="pcase-chip"><span class="pcase-chip-icon">📊</span><span>PPT·제안서 · 대시보드</span></div>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /pipeline-inner -->
  </section>

  <!-- FAQ -->
  <section class="faq-section">
    <div class="faq-inner">
      <div class="section-header reveal">
        <div>
          <div class="section-tag">자주 묻는 질문</div>
          <h2 class="section-title">궁금하신 점이<br>있으신가요?</h2>
        </div>
      </div>
      <div class="faq-list reveal">
        <details class="faq-item">
          <summary class="faq-q">자동화하면 뭐가 달라지나요?</summary>
          <p class="faq-a">반복하던 업무를 시스템이 대신합니다. 담당자는 그 시간에 더 중요한 일을 할 수 있습니다. 예를 들어 매일 1시간씩 쓰던 보고서 작성이 없어지면, 연간 250시간이 생깁니다.</p>
        </details>
        <details class="faq-item">
          <summary class="faq-q">기존 툴을 바꿔야 하나요?</summary>
          <p class="faq-a">바꾸지 않아도 됩니다. 지금 쓰고 있는 슬랙, 구글 시트, 노션, 이메일 등에 연결해서 작동하도록 만듭니다. 업무 방식은 그대로입니다.</p>
        </details>
        <details class="faq-item">
          <summary class="faq-q">우리 회사 규모가 작은데 가능한가요?</summary>
          <p class="faq-a">오히려 소규모 팀일수록 효과가 큽니다. 한 명이 하던 반복 작업이 없어지면, 그 사람이 더 중요한 일에 집중할 수 있습니다. 인원이 적을수록 한 사람의 시간이 더 소중합니다.</p>
        </details>
        <details class="faq-item">
          <summary class="faq-q">도입하는 데 얼마나 걸리나요?</summary>
          <p class="faq-a">자동화하는 업무에 따라 다르지만, 단순한 업무는 2~4주 안에 완성됩니다. 첫 미팅에서 업무 범위를 정하고 일정을 함께 잡습니다.</p>
        </details>
        <details class="faq-item">
          <summary class="faq-q">어떤 업무를 자동화해야 할지 모르겠어요</summary>
          <p class="faq-a">모르셔도 됩니다. 지금 팀에서 반복되는 일을 말씀해 주시면, 무엇을 자동화할 수 있는지 저희가 분석해 드립니다. 첫 미팅은 이 분석으로 시작합니다.</p>
        </details>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section id="cta">
    <div class="cta-glow"></div>
    <h2 class="cta-title reveal">
      어떤 업무가<br>
      <span class="highlight">반복</span>되고<br>
      있나요?
    </h2>
    <p class="cta-sub reveal">구체적이지 않아도 됩니다. 지금 상황을 말씀해 주시면 자동화 가능한 범위를 함께 확인합니다.</p>
    <div class="cta-buttons reveal">
      <a href="contact.php" class="btn-primary">무료 첫 상담 신청</a>
      <a href="#cases" class="btn-secondary">실제 사례 보기</a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="footer-logo">Platformers<span style="color:var(--accent2)">.</span></div>
    <ul class="footer-links">
      <li><a href="#about">About</a></li>
      <li><a href="#philosophy">Philosophy</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#solutions">Solutions</a></li>
      <li><a href="contact.php">Contact</a></li>
    </ul>
    <div class="footer-copy">© 2026 Platformers · 충남 천안시 동남구 · <a href="mailto:lead@platformers.kr" style="color:inherit">lead@platformers.kr</a></div>
  </footer>

  <script src="static/js/main.js?v=34"></script>
</body>

</html>