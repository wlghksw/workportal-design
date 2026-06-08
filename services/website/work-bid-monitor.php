<?php
require __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="플랫포머즈 프로젝트 상세: 입찰 공고 모니터링 AI 에이전트">
  <title>입찰 공고 모니터링 — Platformers Work</title>
  <link rel="stylesheet" href="static/css/main.css?v=32">
  <style>
    .work-hero {
      padding: 180px 80px 100px;
      position: relative;
      background: linear-gradient(180deg, rgba(3, 18, 28, 0) 0%, rgba(13, 53, 82, 0.4) 100%);
    }

    .work-header {
      max-width: 1200px;
      margin: 0 auto;
    }

    .work-category {
      font-family: 'Space Mono', monospace;
      font-size: 14px;
      color: var(--accent2);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 24px;
      display: block;
    }

    .work-title {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(40px, 8vw, 96px);
      line-height: 0.95;
      letter-spacing: -0.04em;
      margin-bottom: 40px;
      color: var(--text);
    }

    .work-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      border-top: 1px solid var(--border);
      padding-top: 40px;
      margin-top: 60px;
    }

    .meta-item-label {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .meta-item-value {
      font-size: 16px;
      color: var(--text);
      font-weight: 500;
      line-height: 1.6;
    }

    .work-content {
      padding: 100px 80px;
    }

    .work-inner {
      max-width: 1200px;
      margin: 0 auto;
    }

    .work-section {
      margin-bottom: 120px;
    }

    .work-section-title {
      font-family: 'Syne', sans-serif;
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 40px;
      color: var(--text);
    }

    .work-image {
      width: 100%;
      height: auto;
      aspect-ratio: 16/9;
      background-size: cover;
      background-position: center;
      border: 1px solid var(--border);
      margin-bottom: 100px;
    }

    .highlight-card {
      background: rgba(13, 53, 82, 0.3);
      border: 1px solid var(--border);
      padding: 48px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }

    .feature-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .feature-item {
      padding: 32px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.02);
    }

    .feature-icon {
      font-size: 24px;
      margin-bottom: 20px;
      display: block;
    }

    .feature-title {
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 12px;
      color: var(--text);
    }

    .feature-desc {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .work-hero, .work-content { padding: 120px 48px 60px; }
      .work-meta { grid-template-columns: 1fr; gap: 32px; }
      .highlight-card { grid-template-columns: 1fr; gap: 40px; }
      .feature-list { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .work-hero, .work-content { padding: 100px 24px 40px; }
    }
  </style>
</head>

<body>

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
      <li><a href="index.php#about">About</a></li>
      <li><a href="index.php#services">Services</a></li>
      <li><a href="portfolio.php">Work</a></li>
      <li><a href="index.php#process">Process</a></li>
    </ul>
    <a href="contact.php" class="nav-cta">Contact Us</a>
  </nav>

  <main>
    <!-- HERO -->
    <header class="work-hero">
      <div class="work-header reveal">
        <span class="work-category">AI Agent & Automation</span>
        <h1 class="work-title">입찰 공고<br>모니터링 에이전트</h1>
        
        <div class="work-meta">
          <div class="meta-item">
            <div class="meta-item-label">Client</div>
            <div class="meta-item-value">에듀올랩</div>
          </div>
          <div class="meta-item">
            <div class="meta-item-label">Category</div>
            <div class="meta-item-value">업무 자동화 · AI 에이전트</div>
          </div>
          <div class="meta-item">
            <div class="meta-item-label">Duration</div>
            <div class="meta-item-value">4 Weeks</div>
          </div>
        </div>
      </div>
    </header>

    <div class="work-content">
      <div class="work-inner">
        <!-- Visual -->
        <?php $bmImg = 'static/assets/bidmonitor.png'; $bmVer = @filemtime($bmImg) ?: time(); ?>
        <div class="work-image reveal" style="background-image:url('<?= $bmImg ?>?v=<?= $bmVer ?>')"></div>

        <!-- Overview -->
        <section class="work-section reveal">
          <h2 class="work-section-title">The Challenge</h2>
          <p class="section-lead" style="max-width: 800px;">
            수많은 입찰 정보 사이트(나라장터 등)와 관련 뉴스 사이트를 매일 아침 수동으로 모니터링하는 데 영업 팀의 리소스가 너무 많이 소요되었습니다. 필요한 정보를 놓치는 위험과 함께, 단순 반복 작업으로 인한 피로도가 높았습니다.
          </p>
        </section>

        <!-- Solution -->
        <section class="work-section reveal">
          <div class="highlight-card">
            <div class="side-before">
              <div class="scenario-label" style="color:var(--accent3);margin-bottom:16px;">Before</div>
              <h3 class="scenario-title" style="font-size:24px;margin-bottom:16px;">전담 인원 매일 3시간 소요</h3>
              <p class="scenario-desc" style="font-size:15px;line-height:1.7;">
                매일 오전 8시부터 11시까지, 실무자가 10개 이상의 사이트를 직접 방문하여 공고문을 다운로드받고 엑셀에 수기로 정리했습니다.
              </p>
            </div>
            <div class="side-after">
              <div class="scenario-label" style="color:var(--accent2);margin-bottom:16px;">After (Platformers)</div>
              <h3 class="scenario-title" style="font-size:24px;margin-bottom:16px;">실시간 인사이트 자동 전송</h3>
              <p class="scenario-desc" style="font-size:15px;line-height:1.7;">
                AI 에이전트가 5분 단위로 사이트를 감시, 적합한 공고가 확인되면 즉시 핵심 내용을 3줄 요약하여 Slack으로 전송합니다. 보고 후 즉시 의사결정만 하면 됩니다.
              </p>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="work-section reveal">
          <h2 class="work-section-title">Key Implementation</h2>
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">🔗</span>
              <h3 class="feature-title">다차원 소스 연결</h3>
              <p class="feature-desc">나라장터, 공공기관 알림마당, 구글 뉴스 등 산재된 데이터를 하나의 에이전트 엔진으로 통합했습니다.</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🧠</span>
              <h3 class="feature-title">AI 지능형 필터링</h3>
              <p class="feature-desc">단순 키워드가 아닌 AI가 사업 내용을 이해하여, 회사의 핵심 수주 전략과 부합하는 공고만 골라냅니다.</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <h3 class="feature-title">즉시 실행 구조</h3>
              <p class="feature-desc">검토 결과를 즉시 슬랙 및 메일로 공유하여, 경쟁사보다 빠른 대응 체계를 구축했습니다.</p>
            </div>
          </div>
        </section>

        <section class="work-section reveal" style="text-align: center; padding: 100px 0;">
            <h2 class="work-section-title" style="margin-bottom: 24px;">이런 시스템이 필요하신가요?</h2>
            <p class="section-lead" style="margin-bottom: 40px;">귀사의 업무 프로세스에 맞춘 최적화된 AI 에이전트를 설계해 드립니다.</p>
            <a href="contact.php" class="btn-primary" style="display: inline-block;">문의하기</a>
        </section>
      </div>
    </div>
  </main>

  <!-- FOOTER -->
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
