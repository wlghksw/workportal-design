// Custom cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('expanded'));
});

// Hero canvas animation
const canvas = document.getElementById('heroCanvas');
let ctx = null;
if (canvas) ctx = canvas.getContext('2d');

// No image — center graphic is pure canvas (neural-network node visualization)

let logW = 0, logH = 0;   // logical (CSS) pixel dimensions — used in all draw fns

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  logW = canvas.offsetWidth;
  logH = canvas.offsetHeight;
  canvas.width  = logW * dpr;
  canvas.height = logH * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale once, no cumulative drift
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particles = [];
let time = 0;
let scrollProgress = 0;

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * (logW || canvas.offsetWidth);
    this.y = Math.random() * (logH || canvas.offsetHeight);
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.4 + 0.05;
    this.color = Math.random() > 0.7 ? '#2f7bff' : Math.random() > 0.5 ? '#3fd1ff' : '#0a4fa8';
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > logW || this.y < 0 || this.y > logH) {
      this.reset();
    }
  }
  draw() {
    if (!ctx) return;
    const alpha = this.life < 20 ? (this.life / 20) * this.opacity :
                  this.life > this.maxLife - 20 ? ((this.maxLife - this.life) / 20) * this.opacity :
                  this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

if (canvas) {
  for (let i = 0; i < 120; i++) particles.push(new Particle());
}

function drawGrid() {
  if (!ctx || !canvas) return;
  ctx.strokeStyle = 'rgba(47,123,255,0.06)';
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < logW; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, logH); ctx.stroke();
  }
  for (let y = 0; y < logH; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(logW, y); ctx.stroke();
  }
}

function drawLogoMark() {
  if (!ctx || !canvas) return;
  const cx = logW * 0.72;
  const cy = logH * 0.5;
  const radius = Math.min(logW, logH) * 0.28;
  const t = time * 0.005;
  const pulse = 1 + Math.sin(t * 2) * 0.02;
  const scrollScale = 1 - scrollProgress * 0.3;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scrollScale, scrollScale);

  for (let i = 0; i < 3; i++) {
    const ringR = radius * (0.8 + i * 0.15);
    const dash = 6 - i;
    const gap = 12 + i * 8;
    ctx.beginPath();
    ctx.arc(0, 0, ringR * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(47,123,255,${0.35 - i * 0.08})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([dash, gap]);
    ctx.lineDashOffset = -t * (20 + i * 10);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  const sq = radius * 0.75 * pulse;
  const bLen = sq * 0.25;
  const corners = [[-sq,-sq],[sq,-sq],[sq,sq],[-sq,sq]];
  const dirs = [[1,0,0,1],[-1,0,0,1],[-1,0,0,-1],[1,0,0,-1]];
  ctx.strokeStyle = 'rgba(47,123,255,0.8)';
  ctx.lineWidth = 1.5;
  corners.forEach(([cx2, cy2], i) => {
    const [dx1, dy1, dx2, dy2] = dirs[i];
    ctx.beginPath();
    ctx.moveTo(cx2 + dx1*bLen, cy2);
    ctx.lineTo(cx2, cy2);
    ctx.lineTo(cx2, cy2 + dy2*bLen);
    ctx.stroke();
  });

  // ── "P" letterform backdrop (canvas text — always crisp, no image) ──────
  {
    const pSize = radius * 1.15 * pulse;
    ctx.save();
    ctx.font = `900 ${pSize}px 'Arial Black', 'Arial', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const pGrad = ctx.createLinearGradient(-pSize * 0.4, -pSize * 0.5, pSize * 0.4, pSize * 0.5);
    pGrad.addColorStop(0, 'rgba(30,77,160,0.55)');
    pGrad.addColorStop(1, 'rgba(47,123,255,0.35)');
    ctx.fillStyle = pGrad;
    ctx.fillText('P', 0, 0);
    ctx.restore();
  }

  // ── Neural-network node visualization (pure canvas, no image) ──────────
  {
    const spd   = t;                   // already time * 0.005
    const innerR = radius * 0.26;
    const outerR = radius * 0.50;
    const INNER  = 6;
    const OUTER  = 9;

    // Pre-compute node positions (slow counter-rotation between rings)
    const inn = Array.from({ length: INNER }, (_, i) => {
      const a = (i * Math.PI * 2 / INNER) + spd * 0.6;
      return { x: Math.cos(a) * innerR, y: Math.sin(a) * innerR, i };
    });
    const out = Array.from({ length: OUTER }, (_, i) => {
      const a = (i * Math.PI * 2 / OUTER) - spd * 0.35;
      return { x: Math.cos(a) * outerR, y: Math.sin(a) * outerR, i };
    });

    // Central aura glow
    const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR * 0.85);
    aura.addColorStop(0,   'rgba(47,123,255,0.13)');
    aura.addColorStop(0.5, 'rgba(47,123,255,0.05)');
    aura.addColorStop(1,   'rgba(47,123,255,0)');
    ctx.beginPath();
    ctx.arc(0, 0, outerR * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = aura;
    ctx.fill();

    // Edges: center → inner nodes
    inn.forEach((n, i) => {
      const a = 0.18 + Math.abs(Math.sin(spd * 2.5 + i * 1.1)) * 0.38;
      ctx.strokeStyle = `rgba(47,123,255,${a})`;
      ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(n.x, n.y); ctx.stroke();
    });

    // Edges: inner → nearest 2 outer nodes
    inn.forEach((n, i) => {
      [0, 1].forEach(off => {
        const j  = (Math.round(i * OUTER / INNER) + off) % OUTER;
        const m  = out[j];
        const a  = 0.08 + Math.abs(Math.sin(spd * 1.8 + i + j * 0.7)) * 0.22;
        ctx.strokeStyle = `rgba(42,95,199,${a})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
      });
    });

    // Outer nodes
    out.forEach(({ x, y, i }) => {
      const r = 2.2 + Math.sin(spd * 3 + i * 0.9) * 0.7;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(47,123,255,0.6)'; ctx.fill();
    });

    // Inner nodes with soft halo
    inn.forEach(({ x, y, i }) => {
      const r = 4.2 + Math.sin(spd * 2.8 + i * 1.3) * 1.1;
      // halo
      const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
      halo.addColorStop(0, 'rgba(47,123,255,0.35)');
      halo.addColorStop(1, 'rgba(47,123,255,0)');
      ctx.beginPath(); ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = halo; ctx.fill();
      // dot
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(42,95,199,0.92)'; ctx.fill();
    });

    // Core node
    const cR = radius * 0.09 * pulse;
    const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, cR * 2.2);
    coreGlow.addColorStop(0,   'rgba(63,209,255,0.95)');
    coreGlow.addColorStop(0.45,'rgba(47,123,255,0.55)');
    coreGlow.addColorStop(1,   'rgba(47,123,255,0)');
    ctx.beginPath(); ctx.arc(0, 0, cR * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = coreGlow; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, cR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(63,209,255,1)'; ctx.fill();
  }
  // ────────────────────────────────────────────────────────────────────────

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.4);
  grad.addColorStop(0, 'rgba(47,123,255,0.1)');
  grad.addColorStop(1, 'rgba(47,123,255,0)');
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  for (let i = 0; i < 5; i++) {
    const angle = t * (0.8 + i * 0.1) + (i * Math.PI * 2 / 5);
    const orbitR = radius * 0.65;
    const dx = Math.cos(angle) * orbitR;
    const dy = Math.sin(angle) * orbitR;
    ctx.beginPath();
    ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(47,123,255,0.85)' : 'rgba(15,63,200,0.85)';
    ctx.fill();
  }

  ctx.restore();
}

function drawScanLine() {
  if (!ctx || !canvas) return;
  const y = ((time * 0.5) % (logH + 40)) - 20;
  const grad = ctx.createLinearGradient(0, y - 40, 0, y + 40);
  grad.addColorStop(0, 'rgba(47,123,255,0)');
  grad.addColorStop(0.5, 'rgba(47,123,255,0.04)');
  grad.addColorStop(1, 'rgba(47,123,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, y - 40, logW, 80);
}

function drawFrame() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, logW, logH);
  drawGrid();
  drawScanLine();
  particles.forEach(p => { p.update(); p.draw(); });
  drawLogoMark();
  time++;
  requestAnimationFrame(drawFrame);
}
if (canvas) drawFrame();

// Scroll interactions
const scrollHint = document.getElementById('scrollHint');

window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  const hero = document.getElementById('hero');
  if (hero) {
    const heroH = hero.offsetHeight;
    scrollProgress = Math.min(scroll / heroH, 1);
  }
  if (scrollHint) {
    scrollHint.style.opacity = Math.max(0, 1 - scroll / 150);
  }
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// Portfolio filter (portfolio 페이지에서 사용)
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      portfolioItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        item.style.display = (cat === 'all' || itemCat === cat) ? '' : 'none';
      });
    });
  });
}

/**
 * ROI Calculator Initialization
 */
function initROICalculator() {
  const teamSlider = document.getElementById('team-size-slider');
  const hoursSlider = document.getElementById('hours-slider');
  const teamDisplay = document.getElementById('team-size-val');
  const hoursDisplay = document.getElementById('hours-val');
  const resultHours = document.getElementById('roi-hours-saved');
  const resultCost = document.getElementById('roi-cost-saved');

  if (!teamSlider || !hoursSlider) return;

  let lastHours = 0;
  let lastCost = 0;

  function formatKrw(val) {
    return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(val);
  }

  function animateValue(obj, start, end, duration, isCurrency = false) {
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * (end - start) + start);
      obj.innerHTML = isCurrency ? formatKrw(current) : Math.floor(current).toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  function updateROI() {
    const teamSize = parseInt(teamSlider.value) || 0;
    const manualHours = parseInt(hoursSlider.value) || 0;

    if (teamDisplay) teamDisplay.innerText = teamSize;
    if (hoursDisplay) hoursDisplay.innerText = manualHours;

    const efficiency = 0.85;
    const hourlyRate = 70000;
    const targetHours = Math.floor(teamSize * manualHours * 52 * efficiency);
    const targetCost = targetHours * hourlyRate;

    animateValue(resultHours, lastHours, targetHours, 400);
    animateValue(resultCost, lastCost, targetCost, 400, true);

    lastHours = targetHours;
    lastCost = targetCost;
  }

  // Attach multiple events for maximum compatibility
  ['input', 'change'].forEach(evt => {
    teamSlider.addEventListener(evt, updateROI);
    hoursSlider.addEventListener(evt, updateROI);
  });

  // Initial calculation
  updateROI();
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initROICalculator);
} else {
  initROICalculator();
}

// ── ROI Section toggle ──────────────────────────────────────────────────
(function() {
  function initRoiToggle() {
    const btn  = document.getElementById('roiToggleBtn');
    const body = document.getElementById('roiCollapsible');
    if (!btn || !body) return;
    btn.addEventListener('click', () => {
      const open = body.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRoiToggle);
  } else {
    initRoiToggle();
  }
})();

// ── Project card sliders (shared by index & portfolio) ──
function initCardSliders() {
  document.querySelectorAll('[data-slider]').forEach(slider => {
    if (slider.dataset.sliderInit === '1') return;
    const track = slider.querySelector('.card-slider-track');
    const dots = slider.querySelectorAll('.slider-dot');
    const total = dots.length;
    if (!track || total === 0) return;
    slider.dataset.sliderInit = '1';

    let current = 0;
    let timer;

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
      timer = setInterval(() => goTo(current + 1), 2500);
    }

    dots.forEach(dot => {
      dot.addEventListener('click', e => {
        e.preventDefault();
        clearInterval(timer);
        goTo(+dot.dataset.index);
        startAuto();
      });
    });

    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', startAuto);

    startAuto();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCardSliders);
} else {
  initCardSliders();
}

