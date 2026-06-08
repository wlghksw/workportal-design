<?php
require __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Platformers - Portfolio</title>
  <link rel="stylesheet" href="static/css/main.css?v=32">
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

  <main style="padding-top:120px;">
    <!-- FILTERS -->
    <section id="marquee">
      <div class="marquee-label">Filter by Category</div>
      <div class="category-nav">
        <div class="filter-buttons">
          <?php foreach ($categories as $category): ?>
            <?php
            $isAll = ($category === '전체');
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
    </section>

    <!-- PORTFOLIO GRID -->
    <section id="portfolio">
      <div class="section-header reveal">
        <div>
          <div class="section-tag">Selected Work</div>
          <h2 class="section-title">All<br>Projects</h2>
        </div>
      </div>

      <div class="portfolio-grid" id="portfolioGrid">
        <?php foreach ($projects as $project): ?>
          <?php $hasSlides = !empty($project['slides']); ?>
          <div class="project-card reveal portfolio-item"
            data-category="<?php echo htmlspecialchars($project['category']); ?>">
            <div class="project-visual" <?php if (!$hasSlides): ?>style="background-image:url('<?php echo htmlspecialchars($project['thumbnail'], ENT_QUOTES); ?>');background-size:cover;background-position:center top;"<?php endif; ?>>

              <?php if ($hasSlides): ?>
              <!-- Slider -->
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
  </main>

  <!-- FOOTER -->
  <footer>
    <div class="footer-logo">Platformers<span style="color:var(--accent2)">.</span></div>
    <ul class="footer-links">
      <li><a href="index.php#services">Services</a></li>
      <li><a href="portfolio.php">Work</a></li>
      <li><a href="index.php#process">Process</a></li>
      <li><a href="contact.php">Contact</a></li>
    </ul>
    <div class="footer-copy">© 2025 Platformers. All rights reserved.</div>
  </footer>

  <script src="static/js/main.js?v=32"></script>
</body>

</html>