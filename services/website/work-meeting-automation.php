<?php
require __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="플랫포머즈 × 에듀올랩 — 입찰공고 모니터링, 회의 자동화, 뉴스레터 자동 발행 3종 자동화 솔루션">
  <title>업무 자동화 솔루션 — Platformers Work</title>
  <link rel="stylesheet" href="static/css/main.css?v=32">
  <style>

    /* ── Hero ── */
    .work-hero {
      padding: 180px 80px 120px;
      background: linear-gradient(180deg, rgba(47,123,255,0.03) 0%, rgba(47,123,255,0.07) 100%);
    }
    .work-header { max-width: 1200px; margin: 0 auto; }
    .work-category {
      font-family: 'Space Mono', monospace; font-size: 13px;
      color: var(--accent2); letter-spacing: 0.22em;
      text-transform: uppercase; margin-bottom: 24px; display: block;
    }
    .work-title {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(40px,8vw,96px); line-height: 0.95;
      letter-spacing: -0.04em; color: var(--text); margin-bottom: 32px;
    }
    .work-lead {
      font-size: 18px; color: var(--muted); line-height: 1.7;
      max-width: 600px; margin-bottom: 60px;
    }
    .work-meta {
      display: grid; grid-template-columns: repeat(3,1fr);
      gap: 40px; border-top: 1px solid var(--border); padding-top: 40px;
    }
    .meta-label {
      font-family: 'Space Mono', monospace; font-size: 11px;
      color: var(--muted); text-transform: uppercase; margin-bottom: 10px;
    }
    .meta-value { font-size: 16px; color: var(--text); font-weight: 500; }

    /* ── Project index bar ── */
    .project-index {
      background: var(--surface); border-bottom: 1px solid var(--border);
      position: sticky; top: 73px; z-index: 50;
    }
    .project-index-inner {
      max-width: 1200px; margin: 0 auto; padding: 0 80px;
      display: flex; gap: 0;
    }
    .index-item {
      font-family: 'Space Mono', monospace; font-size: 12px;
      color: var(--muted); letter-spacing: 0.1em; text-decoration: none;
      padding: 18px 32px 18px 0; display: flex; align-items: center;
      gap: 10px; transition: color 0.2s; border: none; background: none;
      cursor: pointer;
    }
    .index-item:hover { color: var(--accent); }
    .index-num { color: var(--accent); font-size: 10px; }

    /* ── Project section wrapper ── */
    .project-block {
      padding: 140px 80px;
      border-top: 1px solid var(--border);
    }
    .project-block-inner {
      max-width: 1200px; margin: 0 auto;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 100px; align-items: start;
    }
    .project-block-inner.reverse { direction: rtl; }
    .project-block-inner.reverse > * { direction: ltr; }

    /* ── Project label / number ── */
    .proj-eyebrow {
      display: flex; align-items: center; gap: 16px; margin-bottom: 32px;
    }
    .proj-num {
      font-family: 'Syne', sans-serif; font-size: 80px;
      font-weight: 800; line-height: 1; color: rgba(47,123,255,0.12);
      letter-spacing: -0.04em; user-select: none;
    }
    .proj-tag {
      font-family: 'Space Mono', monospace; font-size: 11px;
      color: var(--accent2); letter-spacing: 0.2em; text-transform: uppercase;
    }
    .proj-title {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(28px,4vw,48px); line-height: 1.1;
      letter-spacing: -0.03em; color: var(--text); margin-bottom: 20px;
    }
    .proj-desc {
      font-size: 15px; color: var(--muted); line-height: 1.75;
      margin-bottom: 24px;
    }

    /* ── 기능 특징 요약 (간략 칩 / 두괄식 도입부) ── */
    .feat-summary {
      display: flex; flex-wrap: wrap; gap: 8px;
      margin: 0 0 32px 0;
    }
    .feat-chip {
      font-size: 12px; font-weight: 600;
      color: var(--accent2);
      background: rgba(47,123,255,0.07);
      border: 1px solid rgba(47,123,255,0.25);
      padding: 7px 14px;
      border-radius: 999px;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }

    /* ── Section sub-header (작은 단계 라벨) ── */
    .proj-step-label {
      font-family: 'Space Mono', monospace; font-size: 10px;
      color: var(--muted); letter-spacing: 0.22em;
      text-transform: uppercase; margin-bottom: 12px; display: block;
    }

    /* ── Numbered features (ivynet style) ── */
    .feat-list { display: flex; flex-direction: column; gap: 0; }
    .feat-item {
      display: flex; gap: 24px; padding: 22px 0;
      border-bottom: 1px solid var(--border);
    }
    .feat-item:first-child { border-top: 1px solid var(--border); }
    .feat-n {
      font-family: 'Space Mono', monospace; font-size: 11px;
      color: var(--accent2); letter-spacing: 0.1em; min-width: 28px;
      padding-top: 2px;
    }
    .feat-body {}
    .feat-title { font-weight: 700; font-size: 15px; color: var(--text); margin-bottom: 4px; }
    .feat-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }

    /* ── Visual column ── */
    .proj-visual { position: sticky; top: 140px; }

    /* Screenshot box */
    .screen-box {
      width: 100%; aspect-ratio: 16/10;
      background-size: cover; background-position: center top;
      border: 1px solid var(--border);
      box-shadow: 0 20px 60px rgba(13,26,45,0.12);
    }

    /* ── Before/After 강조 (기대효과) ── */
    .ba-row {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 0; margin-top: 0;
      border: 1px solid var(--border);
      border-left: 3px solid var(--accent2);
      position: relative;
    }
    .ba-col { padding: 32px 28px; }
    .ba-col-left { border-right: 1px solid var(--border); opacity: 0.78; }
    .ba-col:not(.ba-col-left) {
      background: rgba(47,123,255,0.06);
    }
    .ba-tag {
      font-family: 'Space Mono', monospace; font-size: 10px;
      letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 12px; display: block;
    }
    .ba-title {
      font-size: 20px; font-weight: 700; color: var(--text);
      margin-bottom: 8px; line-height: 1.25; letter-spacing: -0.01em;
    }
    .ba-col:not(.ba-col-left) .ba-title { color: var(--accent2); }
    .ba-text { font-size: 13px; color: var(--muted); line-height: 1.6; }


    /* ── Stats strip ── */
    .stat-strip {
      display: grid; grid-template-columns: repeat(3,1fr);
      border: 1px solid var(--border); margin: 80px 0 0;
    }
    .stat-item { padding: 36px 32px; border-right: 1px solid var(--border); }
    .stat-item:last-child { border-right: none; }
    .stat-num {
      font-family: 'Syne', sans-serif; font-size: clamp(32px,4vw,52px);
      font-weight: 800; color: var(--text); line-height: 1; margin-bottom: 10px;
      letter-spacing: -0.03em;
    }
    .stat-num em { color: var(--accent2); font-style: normal; }
    .stat-label { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; }

    /* ── Section divider ── */
    .section-divider {
      max-width: 1200px; margin: 0 auto;
      border: none; border-top: 1px solid var(--border);
    }

    /* ── CTA ── */
    .work-cta {
      padding: 140px 80px; text-align: center;
      border-top: 1px solid var(--border);
    }
    .work-cta h2 {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(28px,5vw,56px); line-height: 1.1;
      letter-spacing: -0.03em; color: var(--text); margin-bottom: 20px;
    }
    .work-cta p { font-size: 16px; color: var(--muted); margin-bottom: 40px; }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .work-hero, .project-block { padding: 120px 48px 80px; }
      .project-block-inner { grid-template-columns: 1fr; gap: 60px; direction: ltr !important; }
      .project-index-inner { padding: 0 48px; }
      .work-meta { grid-template-columns: 1fr; gap: 28px; }
      .ba-row { grid-template-columns: 1fr; }
      .ba-col-left { border-right: none; border-bottom: 1px solid var(--border); }
      .stat-strip { grid-template-columns: 1fr; }
      .stat-item { border-right: none; border-bottom: 1px solid var(--border); }
      .stat-item:last-child { border-bottom: none; }
      .proj-visual { position: static; }
      .work-cta { padding: 100px 48px; }
    }
    @media (max-width: 768px) {
      .work-hero, .project-block { padding: 100px 24px 60px; }
      .project-index-inner { padding: 0 24px; overflow-x: auto; }
      .index-item { white-space: nowrap; }
      .work-cta { padding: 80px 24px; }
      .proj-num { font-size: 56px; }
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="cursor" id="cursor"></div>
  <div class="cursor-ring" id="cursorRing"></div>

  <nav>
    <a href="index.php" class="nav-logo">
      <img class="nav-logo-icon" src="static/img/logo-icon-v2-transparent.png?v=19" alt="Platformers">
      <img class="nav-logo-wordmark" src="static/img/logo-wordmark-transparent.png?v=19" alt="Platformers">
    </a>
    <ul class="nav-links">
      <li><a href="index.php#about">About</a></li>
      <li><a href="index.php#services">Services</a></li>
      <li><a href="portfolio.php">Work</a></li>
      <li><a href="index.php#process">Process</a></li>
    </ul>
    <a href="contact.php" class="nav-cta">Contact Us</a>
  </nav>

  <main>

    <!-- ══ HERO ══ -->
    <header class="work-hero">
      <div class="work-header reveal">
        <span class="work-category">AI Agent & Automation · Case Study</span>
        <h1 class="work-title">업무 자동화<br>솔루션</h1>
        <p class="work-lead">사람이 반복하던 3가지 핵심 업무를 AI 에이전트로 전환했습니다.</p>
        <div class="work-meta">
          <div>
            <div class="meta-label">Client</div>
            <div class="meta-value">에듀올랩</div>
          </div>
          <div>
            <div class="meta-label">Category</div>
            <div class="meta-value">업무 자동화 · AI 에이전트</div>
          </div>
          <div>
            <div class="meta-label">Projects</div>
            <div class="meta-value">3종 패키지</div>
          </div>
        </div>
      </div>
    </header>

    <!-- ══ INDEX BAR ══ -->
    <div class="project-index">
      <div class="project-index-inner">
        <a href="#proj01" class="index-item"><span class="index-num">01</span> 입찰공고 모니터링</a>
        <a href="#proj02" class="index-item"><span class="index-num">02</span> 회의 자동화</a>
        <a href="#proj03" class="index-item"><span class="index-num">03</span> 뉴스레터 자동 발행</a>
      </div>
    </div>

    <!-- ══ PROJECT 01 — 입찰공고 모니터링 ══ -->
    <section class="project-block" id="proj01">
      <div class="project-block-inner">

        <!-- Left: Content -->
        <div>
          <div class="proj-eyebrow">
            <span class="proj-num">01</span>
            <span class="proj-tag">Bid Monitoring</span>
          </div>
          <h2 class="proj-title">입찰공고<br>모니터링 에이전트</h2>
          <p class="proj-desc">매일 수십 개의 공고 사이트를 직접 돌아보던 업무를 AI 에이전트가 대신합니다. 관련 공고가 올라오면 즉시 알림을 받아 의사결정에만 집중할 수 있습니다.</p>

          <span class="proj-step-label">기능 특징 요약</span>
          <div class="feat-summary">
            <span class="feat-chip">24시간 자동 모니터링</span>
            <span class="feat-chip">AI 맞춤 필터링</span>
            <span class="feat-chip">실시간 채널 알림</span>
            <span class="feat-chip">프로필 기반 매칭</span>
          </div>

          <span class="proj-step-label" style="margin-top:8px;">기대효과</span>
          <div class="ba-row">
            <div class="ba-col ba-col-left">
              <span class="ba-tag" style="color:var(--accent3);">Before</span>
              <div class="ba-title">하루 3시간<br>수동 점검</div>
              <p class="ba-text">10개 이상 사이트를 직접 방문, 수기 정리</p>
            </div>
            <div class="ba-col">
              <span class="ba-tag" style="color:var(--accent2);">After</span>
              <div class="ba-title">실시간 자동 알림</div>
              <p class="ba-text">공고 등록 즉시 요약본이 채널로 전송됨</p>
            </div>
          </div>

          <span class="proj-step-label" style="margin-top:40px;">세부 기능</span>
          <div class="feat-list">
            <div class="feat-item">
              <span class="feat-n">01</span>
              <div class="feat-body">
                <div class="feat-title">다중 채널 실시간 수집</div>
                <div class="feat-desc">나라장터를 포함한 주요 공고 사이트를 24시간 자동 모니터링합니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">02</span>
              <div class="feat-body">
                <div class="feat-title">AI 맞춤 필터링</div>
                <div class="feat-desc">단순 키워드 매칭이 아닌 AI가 사업 내용을 이해하여 실제 관련성 높은 공고만 선별합니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">03</span>
              <div class="feat-body">
                <div class="feat-title">3줄 요약 즉시 알림</div>
                <div class="feat-desc">적합한 공고 발견 시 핵심 내용을 요약하여 실시간으로 팀 채널에 전송합니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">04</span>
              <div class="feat-body">
                <div class="feat-title">회사 프로필 기반 매칭</div>
                <div class="feat-desc">지역 요건, 사업 분야, 제외 조건 등 회사 상황에 맞게 설정하여 불필요한 알림을 최소화합니다.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="proj-visual">
          <?php $bmImg = 'static/assets/bidmonitor.png'; $bmVer = @filemtime($bmImg) ?: time(); ?>
          <div class="screen-box" style="background-image:url('<?= $bmImg ?>?v=<?= $bmVer ?>'); background-position: center top;"></div>
        </div>

      </div>
    </section>

    <!-- ══ PROJECT 02 — 회의 자동화 ══ -->
    <section class="project-block" id="proj02">
      <div class="project-block-inner reverse">

        <!-- Left: Content -->
        <div>
          <div class="proj-eyebrow">
            <span class="proj-num">02</span>
            <span class="proj-tag">Meeting Automation</span>
          </div>
          <h2 class="proj-title">회의 자동화<br>솔루션</h2>
          <p class="proj-desc">회의가 끝나면 담당자가 녹음을 다시 듣고 수기로 정리하던 작업을 AI가 대신합니다. 녹음 파일 하나로 구조화된 회의록이 완성됩니다.</p>

          <span class="proj-step-label">기능 특징 요약</span>
          <div class="feat-summary">
            <span class="feat-chip">음성 → 텍스트 변환</span>
            <span class="feat-chip">회의 유형 자동 분류</span>
            <span class="feat-chip">결정·액션 추출</span>
            <span class="feat-chip">Teams 자동 전송</span>
          </div>

          <span class="proj-step-label" style="margin-top:8px;">기대효과</span>
          <div class="ba-row">
            <div class="ba-col ba-col-left">
              <span class="ba-tag" style="color:var(--accent3);">Before</span>
              <div class="ba-title">회의 후 30~60분<br>추가 작업</div>
              <p class="ba-text">녹음 재청취, 포맷 불일치, 누락 위험</p>
            </div>
            <div class="ba-col">
              <span class="ba-tag" style="color:var(--accent2);">After</span>
              <div class="ba-title">종료 5분 내<br>회의록 완성</div>
              <p class="ba-text">파일 업로드 한 번으로 채널 자동 발송까지</p>
            </div>
          </div>

          <span class="proj-step-label" style="margin-top:40px;">세부 기능</span>
          <div class="feat-list">
            <div class="feat-item">
              <span class="feat-n">01</span>
              <div class="feat-body">
                <div class="feat-title">음성 → 텍스트 자동 변환</div>
                <div class="feat-desc">긴 회의 녹음도 빠르게 처리하여 전체 발화를 텍스트로 변환합니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">02</span>
              <div class="feat-body">
                <div class="feat-title">회의 유형 자동 분류</div>
                <div class="feat-desc">브리핑·의사결정·정례회의 중 가장 적합한 포맷을 AI가 스스로 선택합니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">03</span>
              <div class="feat-body">
                <div class="feat-title">결정 사항 & 액션 아이템 분리</div>
                <div class="feat-desc">논의 내용, 결정 사항, 담당자별 할 일이 명확하게 구조화됩니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">04</span>
              <div class="feat-body">
                <div class="feat-title">팀 채널 즉시 전송</div>
                <div class="feat-desc">완성된 회의록이 지정한 MS Teams 채널로 자동 발송됩니다.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="proj-visual">
          <?php $mtImg = 'static/assets/meeting-automation.png'; $mtVer = @filemtime($mtImg) ?: time(); ?>
          <div class="screen-box" style="background-image:url('<?= $mtImg ?>?v=<?= $mtVer ?>'); background-position: center top;"></div>
        </div>

      </div>
    </section>

    <!-- ══ PROJECT 03 — 뉴스레터 자동 발행 ══ -->
    <section class="project-block" id="proj03">
      <div class="project-block-inner">

        <!-- Left: Content -->
        <div>
          <div class="proj-eyebrow">
            <span class="proj-num">03</span>
            <span class="proj-tag">Newsletter Automation</span>
          </div>
          <h2 class="proj-title">월간 교육 뉴스레터<br>자동 발행</h2>
          <p class="proj-desc">교육 분야 뉴스를 매월 자동 수집하고, AI가 뉴스레터 초안을 작성합니다. 담당자는 최종 검토와 승인만 하면 구독자에게 자동 발송됩니다.</p>

          <span class="proj-step-label">기능 특징 요약</span>
          <div class="feat-summary">
            <span class="feat-chip">교육 뉴스 자동 수집</span>
            <span class="feat-chip">AI 초안 생성</span>
            <span class="feat-chip">검토·승인 후 발송</span>
            <span class="feat-chip">월간 자동 스케줄</span>
          </div>

          <span class="proj-step-label" style="margin-top:8px;">기대효과</span>
          <div class="ba-row">
            <div class="ba-col ba-col-left">
              <span class="ba-tag" style="color:var(--accent3);">Before</span>
              <div class="ba-title">매월 뉴스 수집·작성<br>수동 반복</div>
              <p class="ba-text">기사 탐색, 정리, 작성에 하루 이상 소요</p>
            </div>
            <div class="ba-col">
              <span class="ba-tag" style="color:var(--accent2);">After</span>
              <div class="ba-title">검토·승인만으로<br>발송 완료</div>
              <p class="ba-text">수집부터 발송까지 전 과정 자동 처리</p>
            </div>
          </div>

          <span class="proj-step-label" style="margin-top:40px;">세부 기능</span>
          <div class="feat-list">
            <div class="feat-item">
              <span class="feat-n">01</span>
              <div class="feat-body">
                <div class="feat-title">교육 뉴스 자동 수집</div>
                <div class="feat-desc">에듀테크, AI 교육, 정책 등 교육 분야 최신 뉴스를 정기적으로 자동 수집합니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">02</span>
              <div class="feat-body">
                <div class="feat-title">AI 뉴스레터 초안 생성</div>
                <div class="feat-desc">수집된 뉴스를 바탕으로 구독자 맞춤 뉴스레터 본문을 자동으로 작성합니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">03</span>
              <div class="feat-body">
                <div class="feat-title">담당자 승인 후 발송</div>
                <div class="feat-desc">생성된 초안을 담당자가 검토·승인하면 구독자 전원에게 자동 발송됩니다.</div>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-n">04</span>
              <div class="feat-body">
                <div class="feat-title">월간 스케줄 자동화</div>
                <div class="feat-desc">매월 정해진 일정에 수집·생성·승인·발송 전 과정이 자동으로 실행됩니다.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="proj-visual">
          <?php $enImg = 'static/assets/edu-news.png'; $enVer = @filemtime($enImg) ?: time(); ?>
          <div class="screen-box" style="background-image:url('<?= $enImg ?>?v=<?= $enVer ?>'); background-position: center top;"></div>
        </div>

      </div>
    </section>

    <!-- ══ STATS ══ -->
    <div style="padding:0 80px;max-width:1360px;margin:0 auto;">
      <div class="stat-strip reveal">
        <div class="stat-item">
          <div class="stat-num">3<em>가지</em></div>
          <div class="stat-label">자동화된 반복 업무</div>
        </div>
        <div class="stat-item">
          <div class="stat-num"><em>∞</em></div>
          <div class="stat-label">24시간 무중단 운영</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">0<em>번</em></div>
          <div class="stat-label">수동 처리 없이 완성</div>
        </div>
      </div>
    </div>

    <!-- ══ CTA ══ -->
    <div class="work-cta reveal">
      <h2>귀사의 반복 업무도<br>자동화할 수 있습니다</h2>
      <p>어떤 업무든 분석부터 시작합니다. 먼저 이야기 나눠보세요.</p>
      <a href="contact.php" class="btn-primary" style="display:inline-block;">문의하기</a>
    </div>

  </main>

  <footer>
    <div class="footer-logo">Platformers<span style="color:var(--accent2)">.</span></div>
    <ul class="footer-links">
      <li><a href="index.php#about">About</a></li>
      <li><a href="index.php#services">Services</a></li>
      <li><a href="portfolio.php">Work</a></li>
      <li><a href="contact.php">Contact</a></li>
    </ul>
    <div class="footer-copy">© 2026 Platformers. All rights reserved.</div>
  </footer>

  <script src="static/js/main.js?v=32"></script>
</body>
</html>
