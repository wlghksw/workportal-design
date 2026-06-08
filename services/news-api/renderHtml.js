const { escapeHtml } = require("./utils");

const LINK_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

/** RSS 피드 라벨 → 화면용 짧은 이름 */
function prettySource(label) {
  const s = String(label || "").trim();
  if (!s) return "출처 미상";
  if (s.startsWith("GNews_")) {
    const rest = s.slice(6).replace(/_/g, " · ");
    return `구글 뉴스 · ${rest}`;
  }
  return s.replace(/_/g, " · ");
}

function normText(t) {
  return String(t || "")
    .replace(/\s+/g, " ")
    .replace(/[…\.]{2,}/g, "")
    .trim()
    .toLowerCase();
}

/** 제목과 거의 같으면 요약은 숨김 */
function shouldShowSummary(title, summary) {
  const t = normText(title);
  const s = normText(summary);
  if (!s || s.length < 12) return false;
  if (t === s) return false;
  if (s.startsWith(t) || t.startsWith(s)) return false;
  if (t.length > 20 && s.includes(t.slice(0, Math.min(40, t.length)))) return false;
  return true;
}

/** 브라우저용: 읽기 쉬운 뉴스 목록 UI (JS 없이) */
function renderItemsHtml(payload) {
  const items = payload.items || [];

  function prettyDate(iso) {
    if (!iso) return "";
    const ms = Date.parse(iso);
    if (!Number.isFinite(ms)) return "";
    const d = new Date(ms);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}.${mo}.${dd}`;
  }

  const cardsHtml = items
    .map((it, i) => {
      const title = escapeHtml(it.title || "(제목 없음)");
      const href = escapeHtml(it.link || "#");
      const src = escapeHtml(prettySource(it.source));
      const pub = prettyDate(it.published);
      const rawSummary = String(it.summary || "").replace(/\s+/g, " ").trim();
      const showSum = shouldShowSummary(it.title, rawSummary);
      const shortSummary = rawSummary.length > 200 ? `${rawSummary.slice(0, 200).trim()}…` : rawSummary;
      const sum = escapeHtml(shortSummary);
      const num = i + 1;

      return `<article class="item">
  <div class="item__top">
    <span class="item__num">${num}</span>
    <span class="item__source">${src}</span>
    ${pub ? `<time class="item__date">${escapeHtml(pub)}</time>` : ""}
  </div>
  <a class="item__title" href="${href}" target="_blank" rel="noopener noreferrer">${title}</a>
  ${showSum ? `<p class="item__summary">${sum}</p>` : ""}
  <a class="item__go" href="${href}" target="_blank" rel="noopener noreferrer">원문 보기 ${LINK_ICON}</a>
</article>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
  <title>교육 뉴스 · ${payload.count}건</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://portal.platformers.kr/assets/portal-header.css?v=1"/>
  <style>
    :root{
      --bg:#f4f6fb;
      --surface:#fff;
      --surface2:#f8fafc;
      --text:#0f172a;
      --text2:#64748b;
      --muted:#94a3b8;
      --line:#e2e8f0;
      --primary:#2563eb;
      --primary-soft:#eff6ff;
      --news:#7c3aed;
      --news-soft:#f5f3ff;
      --max:1180px;
      --radius:14px;
    }
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      font-family:"Noto Sans KR",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
      color:var(--text);
      background:var(--bg);
      line-height:1.5;
      -webkit-font-smoothing:antialiased;
    }
    .page{max-width:var(--max);margin:0 auto;padding:20px 24px 48px}
    .list{display:grid;gap:12px;grid-template-columns:1fr}
    @media(min-width:768px){.list{grid-template-columns:1fr 1fr;gap:14px}}
    .item{
      background:var(--surface);
      border:1px solid var(--line);
      border-radius:var(--radius);
      padding:16px 18px;
      display:flex;flex-direction:column;gap:8px;
      transition:border-color .15s,box-shadow .15s;
      box-shadow:0 1px 2px rgba(15,23,42,.04);
    }
    .item:hover{border-color:#cbd5e1;box-shadow:0 8px 24px rgba(15,23,42,.06)}
    .item__top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .item__num{
      flex-shrink:0;min-width:26px;height:26px;padding:0 7px;
      border-radius:8px;background:var(--news-soft);color:var(--news);
      border:1px solid #ddd6fe;
      font-size:11px;font-weight:700;
      display:inline-flex;align-items:center;justify-content:center;
    }
    .item__source{
      flex:1;min-width:0;
      font-size:12px;font-weight:600;color:var(--muted);
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }
    .item__date{margin-left:auto;font-size:11px;color:var(--muted);flex-shrink:0}
    .item__title{
      display:block;font-size:15px;font-weight:700;line-height:1.45;
      letter-spacing:-.02em;color:var(--text);text-decoration:none;
      word-break:keep-all;overflow-wrap:anywhere;
    }
    .item__title:hover{color:var(--primary);text-decoration:underline;text-underline-offset:3px}
    .item__summary{
      font-size:13px;line-height:1.6;color:var(--text2);
      display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
    }
    .item__go{
      display:inline-flex;align-items:center;gap:5px;
      margin-top:4px;font-size:12px;font-weight:600;color:var(--primary);text-decoration:none;
    }
    .item__go:hover{text-decoration:underline}
    .item__go svg{opacity:.85}
    .empty{
      padding:40px 20px;text-align:center;color:var(--muted);
      background:var(--surface);border-radius:var(--radius);border:1px dashed var(--line);
    }
    .foot{margin-top:28px;text-align:center;font-size:12px;color:var(--muted)}
  </style>
</head>
<body>
  <header class="site-header site-header--service">
    <div class="site-header__row">
      <a class="brand" href="https://portal.platformers.kr/">
        <img class="brand__logo" src="https://portal.platformers.kr/assets/eduallab-logo.png" alt="에듀올랩"/>
        <span class="brand__sub">교육 뉴스</span>
      </a>
      <div class="site-header__spacer"></div>
      <div class="site-header__actions">
        <span class="topbar__user" id="portalHeaderUser" hidden></span>
        <a class="topbar__btn" href="https://portal.platformers.kr/">워크포탈</a>
        <button class="topbar__btn" type="button" id="portalHeaderLogout" hidden>로그아웃</button>
      </div>
    </div>
  </header>
  <script src="https://portal.platformers.kr/assets/portal-header.js?v=1" defer></script>
  <div class="page">
    ${
      items.length
        ? `<main class="list" aria-label="기사 목록">${cardsHtml}</main>`
        : '<div class="empty">표시할 기사가 없습니다.<br>필터 조건이 너무 강하거나, 이번 주 기사가 적을 수 있어요.</div>'
    }
    <footer class="foot">EduAllLab · news.platformers.kr</footer>
  </div>
</body>
</html>`;
}

module.exports = { renderItemsHtml };
