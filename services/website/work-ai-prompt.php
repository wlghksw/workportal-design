<?php
require __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="플랫포머즈 프로젝트 상세: 에듀올랩 AI 에이전트 및 프롬프트 솔루션">
  <title>에듀올랩 AI 프롬프트 — Platformers Work</title>
  <link rel="stylesheet" href="static/css/main.css?v=32">
  <style>
    .work-hero {
      padding: 180px 80px 100px;
      position: relative;
      background: linear-gradient(180deg, rgba(3, 18, 28, 0) 0%, rgba(82, 13, 82, 0.4) 100%);
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
      font-size: clamp(40px, 8vw, 84px);
      line-height: 1.05;
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

    .prompt-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 40px;
    }

    .prompt-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      padding: 32px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .prompt-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--accent2);
      transform: translateY(-5px);
    }

    .prompt-card-icon {
      font-size: 28px;
      margin-bottom: 20px;
      display: block;
    }

    .prompt-card-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 12px;
    }

    .prompt-card-desc {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .work-hero, .work-content { padding: 120px 48px 60px; }
      .work-meta { grid-template-columns: 1fr; gap: 32px; }
      .prompt-grid { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 768px) {
      .work-hero, .work-content { padding: 100px 24px 40px; }
      .prompt-grid { grid-template-columns: 1fr; }
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
        <span class="work-category">Next-Gen AI Business Hub</span>
        <h1 class="work-title">Accelerate Your Business<br>with Expert AI Agents</h1>
        
        <div class="work-meta">
          <div class="meta-item">
            <div class="meta-item-label">Client</div>
            <div class="meta-item-value">EduAllLab (에듀올랩)</div>
          </div>
          <div class="meta-item">
            <div class="meta-item-label">Service</div>
            <div class="meta-item-value">AI Prompt Optimization, Workflow Automation</div>
          </div>
          <div class="meta-item">
            <div class="meta-item-label">Core Tech</div>
            <div class="meta-item-value">GPT-4, Claude 3.5, Zapier/Make</div>
          </div>
        </div>
      </div>
    </header>

    <div class="work-content">
      <div class="work-inner">
        <!-- Visual -->
        <div class="work-image reveal" style="overflow:hidden;">
          <video src="static/assets/ai_prompt_video.mp4" autoplay loop muted playsinline style="width:100%; height:100%; object-fit:cover;"></video>
        </div>

        <!-- Overview -->
        <section class="work-section reveal">
          <h2 class="work-section-title">Project Overview</h2>
          <p class="section-lead" style="max-width: 800px;">
            에듀올랩 AI 프롬프트 플랫폼은 기업의 생산성을 극대화하기 위해 설계된 최첨단 AI 에이전트 허브입니다. 
            단순한 텍스트 생성을 넘어, 업무 프로세스 전체를 지능적으로 설계하고 실행하는 맞춤형 프롬프트 솔루션을 제공합니다.
          </p>
        </section>

        <!-- Features Grid -->
        <section class="work-section reveal">
          <h2 class="work-section-title">Core Solutions</h2>
          <div class="prompt-grid">
            <div class="prompt-card">
              <span class="prompt-card-icon">⚙️</span>
              <h3 class="prompt-card-title">업무 자동화</h3>
              <p class="prompt-card-desc">Zapier/Make 기반으로 사람이 하던 반복적인 워크플로우를 AI가 처리하도록 설계합니다.</p>
            </div>
            <div class="prompt-card">
              <span class="prompt-card-icon">✍️</span>
              <h3 class="prompt-card-title">콘텐츠 제작</h3>
              <p class="prompt-card-desc">브랜드 보이스를 반영한 바이럴 마케팅 콘텐츠와 SNS 기획안을 단 몇 초 만에 생성합니다.</p>
            </div>
            <div class="prompt-card">
              <span class="prompt-card-icon">💰</span>
              <h3 class="prompt-card-title">수익화 전략</h3>
              <p class="prompt-card-desc">비즈니스 모델을 분석하여 매출 레버리지를 일으킬 수 있는 최적의 오퍼를 설계합니다.</p>
            </div>
            <div class="prompt-card">
              <span class="prompt-card-icon">📈</span>
              <h3 class="prompt-card-title">마케팅/성장</h3>
              <p class="prompt-card-desc">그로스 해킹 전략과 타겟 맞춤형 마케팅 메시지를 최적화하여 전환율을 높입니다.</p>
            </div>
            <div class="prompt-card">
              <span class="prompt-card-icon">🔍</span>
              <h3 class="prompt-card-title">리서치/분석</h3>
              <p class="prompt-card-desc">방대한 시장 조사 데이터와 경쟁사 분석을 AI가 수행하여 핵심 인사이트를 도출합니다.</p>
            </div>
            <div class="prompt-card">
              <span class="prompt-card-icon">🚀</span>
              <h3 class="prompt-card-title">업무 생산성</h3>
              <p class="prompt-card-desc">AI 오퍼레이션을 통해 팀의 시간을 절약하고 실질적인 성과에 집중하게 만듭니다.</p>
            </div>
          </div>
        </section>

        <section class="work-section reveal" style="text-align: center; padding: 100px 0;">
            <h2 class="work-section-title" style="margin-bottom: 24px;">AI 도입, 더 이상 고민하지 마세요.</h2>
            <p class="section-lead" style="margin-bottom: 40px;">플랫포머즈가 에듀올랩과 함께 귀사의 비즈니스 성장을 가속화합니다.</p>
            <a href="contact.php" class="btn-primary" style="display: inline-block;">솔루션 상담하기</a>
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
