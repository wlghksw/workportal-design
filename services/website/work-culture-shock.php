<?php
require __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="플랫포머즈 프로젝트 상세: 컬처쇼크 글로벌 문화 교육 플랫폼">
  <title>컬처쇼크 — Platformers Work</title>
  <link rel="stylesheet" href="static/css/main.css?v=32">
  <style>
    .work-hero {
      padding: 180px 80px 100px;
      position: relative;
      background: linear-gradient(180deg, rgba(3, 18, 28, 0) 0%, rgba(13, 82, 53, 0.4) 100%);
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
      background: rgba(13, 82, 53, 0.2);
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

    .btn-visit {
        display: inline-block;
        margin-top: 40px;
        padding: 16px 32px;
        background: var(--accent2);
        color: #000;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s ease;
    }

    .btn-visit:hover {
        background: #fff;
        transform: translateY(-2px);
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
        <span class="work-category">Web Platform & Branding</span>
        <h1 class="work-title">컬처쇼크<br>글로벌 문화 플랫폼</h1>
        
        <div class="work-meta">
          <div class="meta-item">
            <div class="meta-item-label">Client</div>
            <div class="meta-item-value">CultureShock Inc.</div>
          </div>
          <div class="meta-item">
            <div class="meta-item-label">Core Tech</div>
            <div class="meta-item-value">Responsive Web, Interaction Design, CMS</div>
          </div>
          <div class="meta-item">
            <div class="meta-item-label">Duration</div>
            <div class="meta-item-value">6 Weeks</div>
          </div>
        </div>
      </div>
    </header>

    <div class="work-content">
      <div class="work-inner">
        <!-- Visual -->
        <div class="work-image reveal" style="background-image:url('static/assets/cultureshock.png')"></div>

        <!-- Overview -->
        <section class="work-section reveal">
          <h2 class="work-section-title">Project Overview</h2>
          <p class="section-lead" style="max-width: 800px;">
            컬처쇼크는 전 세계의 다양한 문화를 연결하고 교육하는 글로벌 플랫폼입니다. 브랜드의 가치를 시각적으로 전달하고, 전 세계 사용자들이 쉽고 즐겁게 콘텐츠를 소비할 수 있는 사용자 중심의 인터페이스를 구축했습니다.
          </p>
          <a href="https://cultureshock-dev.azurewebsites.net/" target="_blank" rel="noopener noreferrer" class="btn-visit">Visit Website →</a>
        </section>

        <!-- Solution -->
        <section class="work-section reveal">
          <div class="highlight-card">
            <div class="side-before">
              <div class="scenario-label" style="color:var(--accent3);margin-bottom:16px;">Key Challenge</div>
              <h3 class="scenario-title" style="font-size:24px;margin-bottom:16px;">파편화된 브랜드 이미지</h3>
              <p class="scenario-desc" style="font-size:15px;line-height:1.7;">
                글로벌 시장을 타겟으로 함에도 불구하고, 일관되지 않은 디자인 언어와 복잡한 사용자 여정으로 인해 브랜드 신뢰도가 낮은 상태였습니다.
              </p>
            </div>
            <div class="side-after">
              <div class="scenario-label" style="color:var(--accent2);margin-bottom:16px;">Platformers Solution</div>
              <h3 class="scenario-title" style="font-size:24px;margin-bottom:16px;">통합 디자인 시스템 구축</h3>
              <p class="scenario-desc" style="font-size:15px;line-height:1.7;">
                모든 플랫폼에서 일관된 경험을 제공하는 디자인 가이드를 수립하고, 풍부한 인터랙션을 활용해 브랜드 아이덴티티를 강화한 웹 환경을 구현했습니다.
              </p>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="work-section reveal">
          <h2 class="work-section-title">Key Implementation</h2>
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <h3 class="feature-title">감각적인 UI/UX</h3>
              <p class="feature-desc">문화적 다양성을 반영한 컬러 팔레트와 부드러운 애니메이션으로 세련된 사용자 경험을 제공합니다.</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🌍</span>
              <h3 class="feature-title">글로벌 최적화</h3>
              <p class="feature-desc">다국어 대응 및 글로벌 접속 속도를 고려한 퍼포먼스 최적화 작업을 수행했습니다.</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📱</span>
              <h3 class="feature-title">완벽한 반응형</h3>
              <p class="feature-desc">모든 기기에서 정보의 누락 없이 브랜드의 감성이 그대로 전달되도록 설계되었습니다.</p>
            </div>
          </div>
        </section>

        <section class="work-section reveal" style="text-align: center; padding: 100px 0;">
            <h2 class="work-section-title" style="margin-bottom: 24px;">브랜드의 가치를 완성하고 싶으신가요?</h2>
            <p class="section-lead" style="margin-bottom: 40px;">사용자의 눈과 마음을 사로잡는 차세대 웹 플랫폼을 만듭니다.</p>
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
