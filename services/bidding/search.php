<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>지원사업 AI 검색</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://portal.platformers.kr/assets/portal-header.css?v=1">
<style>
:root{
  --bg:#f5f7fa;--surface:#fff;--surface2:#f8f9fc;--border:#e4e8ef;
  --accent:#2563eb;--accent-hover:#1d4ed8;--accent-light:#eff6ff;
  --text:#1e293b;--text-muted:#64748b;--text-dim:#94a3b8;
  --red:#dc2626;--green:#059669;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans KR',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;overflow-x:hidden}

/* ── 검색 서브 툴바 ── */
.search-toolbar{max-width:1180px;margin:0 auto;padding:0 24px 10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fff}
.search-toolbar .nav-new-btn{margin-left:auto}
.nav-back{font-size:13px;color:var(--text-muted);text-decoration:none;padding:8px 14px;border-radius:10px;border:1px solid var(--border);transition:all .15s;white-space:nowrap}
.nav-back:hover{background:var(--accent-light);border-color:var(--accent);color:var(--accent)}
.nav-new-btn{padding:8px 14px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);font-size:13px;cursor:pointer;transition:all .15s;white-space:nowrap;font-family:inherit}
.nav-new-btn:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}

/* ── 레이아웃 ── */
.layout{display:flex;margin-top:0;min-height:calc(100vh - 120px)}

/* ── 사이드바 ── */
.sidebar{width:240px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:56px;left:0;bottom:0;overflow-y:auto;transition:transform .25s}
.sidebar-top{padding:14px 12px 8px}
.sidebar-new{width:100%;padding:9px 12px;border-radius:8px;border:1px dashed var(--border);background:transparent;color:var(--text-muted);font-size:13px;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .15s;text-align:left;font-family:inherit}
.sidebar-new:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}
.sidebar-section{padding:12px 14px 4px;font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--text-dim);text-transform:uppercase}
.sidebar-item{padding:9px 12px;border-radius:8px;cursor:pointer;transition:all .15s;margin:2px 8px;display:flex;align-items:flex-start;gap:6px}
.sidebar-item:hover{background:var(--surface2)}
.sidebar-item-body{flex:1;min-width:0}
.sidebar-item-del{flex-shrink:0;width:18px;height:18px;border-radius:4px;border:none;background:transparent;color:var(--text-dim);font-size:13px;cursor:pointer;display:none;align-items:center;justify-content:center;line-height:1;padding:0;margin-top:1px;transition:color .15s,background .15s}
.sidebar-item:hover .sidebar-item-del{display:flex}
.sidebar-item-del:hover{color:var(--red);background:#fee2e2}
.sidebar-item.active{background:var(--accent-light)}
.sidebar-item-query{font-size:12px;color:var(--text-muted);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.sidebar-item.active .sidebar-item-query{color:var(--accent);font-weight:500}
.sidebar-item-time{font-size:10px;color:var(--text-dim);margin-top:3px}
.sidebar-empty{padding:24px 14px;font-size:12px;color:var(--text-dim);text-align:center;line-height:1.7}

/* ── 메인 ── */
.main{margin-left:240px;flex:1;display:flex;flex-direction:column;min-height:calc(100vh - 56px)}

/* ── 히어로 (검색 전) ── */
.hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px 40px}
.hero.hidden{display:none}
.hero-badge{font-size:11px;font-weight:600;color:var(--accent);background:var(--accent-light);border:1px solid #bfdbfe;border-radius:20px;padding:4px 14px;margin-bottom:22px}
.hero-title{font-size:36px;font-weight:700;text-align:center;line-height:1.25;margin-bottom:12px;color:var(--text)}
.hero-title span{color:var(--accent)}
.hero-sub{font-size:15px;color:var(--text-muted);margin-bottom:40px;text-align:center;line-height:1.7}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;justify-content:center}
.chip{padding:6px 14px;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);font-size:12px;cursor:pointer;transition:all .15s;font-family:inherit}
.chip:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}

/* ── 검색창 ── */
.search-wrap{width:100%;max-width:680px;position:relative}
.search-box{width:100%;padding:16px 54px 16px 18px;background:var(--surface);border:1.5px solid var(--border);border-radius:12px;font-size:14px;color:var(--text);outline:none;resize:none;min-height:56px;max-height:160px;line-height:1.5;transition:border-color .2s,box-shadow .2s;font-family:inherit;box-shadow:0 1px 4px rgba(0,0,0,.05)}
.search-box::placeholder{color:var(--text-dim)}
.search-box:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.search-btn{position:absolute;right:10px;bottom:10px;width:36px;height:36px;border-radius:8px;background:var(--accent);border:none;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.search-btn:hover{background:var(--accent-hover)}
.search-btn:disabled{opacity:.4;cursor:not-allowed}

/* ── 결과 영역 ── */
.result-area{display:none;flex:1;padding:28px 32px 0}
.result-area.on{display:block}
.sessions{}
.session-block{margin-bottom:36px}

/* 질문 버블 */
.q-bubble{display:flex;justify-content:flex-end;margin-bottom:20px}
.q-bubble-inner{background:var(--accent);border-radius:16px 16px 4px 16px;padding:11px 16px;font-size:14px;color:#fff;max-width:75%;line-height:1.55;word-break:break-word}

/* AI 답변 + 공고 */
.answer-row{display:grid;grid-template-columns:1fr 340px;gap:32px;margin-bottom:16px}
.panel-label{font-size:11px;font-weight:600;color:var(--text-muted);letter-spacing:.4px;margin-bottom:12px;display:flex;align-items:center;gap:5px}
.panel-label.ai{color:var(--accent)}
.panel-label.cards{color:var(--green)}
.answer-text{font-size:14px;line-height:1.9;color:var(--text);white-space:pre-wrap}
.cursor{display:inline-block;width:2px;height:14px;background:var(--accent);margin-left:1px;vertical-align:middle;animation:blink .65s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* 공고 카드 */
.bid-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:13px 15px;margin-bottom:8px;opacity:0;transform:translateY(10px);transition:opacity .3s,transform .3s,border-color .15s,box-shadow .15s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.bid-card.on{opacity:1;transform:translateY(0)}
.bid-card:hover{border-color:var(--accent);box-shadow:0 2px 8px rgba(37,99,235,.1)}
.bid-card-title{font-size:12px;font-weight:600;color:var(--text);line-height:1.45;display:block;text-decoration:none;margin-bottom:7px;transition:color .15s}
.bid-card-title:hover{color:var(--accent)}
.bid-card-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.bid-source{background:var(--accent-light);color:var(--accent);border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700}
.bid-org{color:var(--text-dim);font-size:11px}
.bid-deadline{color:var(--red);font-size:11px;font-weight:500}
.no-bids{color:var(--text-dim);font-size:13px;padding:12px 0;line-height:1.7}

/* 로딩 */
.typing-row{display:flex;align-items:center;gap:8px;padding:12px 0;color:var(--text-muted);font-size:13px}
.dots span{width:6px;height:6px;border-radius:50%;background:var(--accent);display:inline-block;animation:bounce .9s infinite}
.dots span:nth-child(2){animation-delay:.15s}
.dots span:nth-child(3){animation-delay:.3s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}

/* ── 추가 질문 입력 ── */
.followup-bar{position:sticky;bottom:0;background:linear-gradient(to top,var(--bg) 80%,transparent);padding:16px 0 24px;margin-top:12px}
.followup-wrap{position:relative;max-width:100%}
.followup-box{width:100%;padding:13px 50px 13px 16px;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;font-size:13px;color:var(--text);outline:none;resize:none;min-height:48px;max-height:120px;line-height:1.5;transition:border-color .2s,box-shadow .2s;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.followup-box::placeholder{color:var(--text-dim)}
.followup-box:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.followup-btn{position:absolute;right:10px;bottom:9px;width:30px;height:30px;border-radius:7px;background:var(--accent);border:none;color:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.followup-btn:hover{background:var(--accent-hover)}
.followup-btn:disabled{opacity:.4;cursor:not-allowed}
.followup-hint{font-size:11px;color:var(--text-dim);margin-bottom:8px;text-align:center}

.result-bottom{height:20px}

/* ── 반응형 ── */
@media(max-width:860px){
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .main{margin-left:0}
  .answer-row{grid-template-columns:1fr}
  .hero-title{font-size:26px}
  .nav-menu-btn{display:flex!important}
}
.nav-menu-btn{display:none;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:18px;padding:4px 6px}
</style>
</head>
<body>

<header class="site-header site-header--service">
  <div class="site-header__row">
    <a class="brand" href="https://portal.platformers.kr/">
      <img class="brand__logo" src="https://portal.platformers.kr/assets/eduallab-logo.png" alt="에듀올랩" />
      <span class="brand__sub">공고 매칭</span>
    </a>
    <div class="site-header__spacer"></div>
    <div class="site-header__actions">
      <span class="topbar__user" id="portalHeaderUser" hidden></span>
      <a class="topbar__btn" href="https://portal.platformers.kr/">워크포탈</a>
      <button class="topbar__btn" type="button" id="portalHeaderLogout" hidden>로그아웃</button>
    </div>
  </div>
  <div class="site-header__meta search-toolbar">
    <button class="nav-menu-btn" id="menuBtn" onclick="toggleSidebar()">☰</button>
    <button class="nav-new-btn" onclick="newSearch()">+ 새 검색</button>
    <a href="index.php" class="nav-back">← 공고 목록</a>
  </div>
</header>
<script src="https://portal.platformers.kr/assets/portal-header.js?v=1" defer></script>

<!-- 레이아웃 -->
<div class="layout">

  <!-- 사이드바: 최근 검색 -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-top">
      <button class="sidebar-new" onclick="newSearch()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 검색 시작
      </button>
    </div>
    <div class="sidebar-section">최근 검색</div>
    <div id="historyList"><div class="sidebar-empty">아직 검색 기록이 없습니다</div></div>
  </aside>

  <!-- 메인 -->
  <main class="main">

    <!-- 히어로 -->
    <div class="hero" id="hero">
      <div class="hero-badge">AI 지원사업 추천</div>
      <h1 class="hero-title">지원사업,<br><span>AI에게 물어보세요</span></h1>
      <p class="hero-sub">내 상황을 그대로 입력하면<br>딱 맞는 정부 지원공고를 찾아드립니다</p>
      <div class="search-wrap">
        <textarea class="search-box" id="searchBox" placeholder="예) 서울 대학생인데 AI 앱으로 창업하고 싶어요" rows="1"></textarea>
        <button class="search-btn" id="searchBtn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div class="chips">
        <div class="chip" onclick="focusUrlInput()">🏢 회사 URL로 분석</div>
        <div class="chip" onclick="quick('예비창업자인데 IT·앱 개발 분야로 창업하고 싶어요')">💡 예비창업자 IT</div>
        <div class="chip" onclick="quick('청년 창업자인데 R&D 자금 지원 공고 알려줘')">🔬 청년 R&D</div>
        <div class="chip" onclick="quick('여성 창업자를 위한 지원사업 있나요?')">👩 여성 창업자</div>
        <div class="chip" onclick="quick('AI 스타트업인데 해외진출 지원 받고 싶어요')">🌏 수출바우처</div>
        <div class="chip" onclick="quick('이번 달 마감인 창업 지원 공고 알려줘')">📅 마감 임박</div>
      </div>
    </div>

    <!-- 결과 -->
    <div class="result-area" id="resultArea">
      <div class="sessions" id="sessions"></div>
      <div class="result-bottom"></div>

      <!-- 추가 질문 입력 -->
      <div class="followup-bar" id="followupBar" style="display:none">
        <div class="followup-hint">추가로 궁금한 점을 물어보세요 (예: 이번 달 마감인 것만 / 서울만 / 더 찾아줘)</div>
        <div class="followup-wrap">
          <textarea class="followup-box" id="followupBox" placeholder="추가 질문을 입력하세요..." rows="1"></textarea>
          <button class="followup-btn" id="followupBtn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>

  </main>
</div>

<script>
// ── 상태 ──
const HISTORY_KEY = 'bidai_search_history';
let chatHistory   = [];   // 현재 세션 대화 기록
let lastBids      = [];   // 마지막으로 표시된 공고 목록 (필터링용)
let isBusy        = false;
let activeId      = null; // 현재 선택된 히스토리 ID

// ── DOM ──
const hero       = document.getElementById('hero');
const searchBox  = document.getElementById('searchBox');
const searchBtn  = document.getElementById('searchBtn');
const resultArea = document.getElementById('resultArea');
const sessions   = document.getElementById('sessions');
const followupBar= document.getElementById('followupBar');
const followupBox= document.getElementById('followupBox');
const followupBtn= document.getElementById('followupBtn');

// ── 초기화 ──
renderSidebar();

// ── 이벤트 ──
autoResize(searchBox);
autoResize(followupBox);

searchBox.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); startSearch(); }
});
searchBtn.addEventListener('click', startSearch);

followupBox.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); followup(); }
});
followupBtn.addEventListener('click', followup);

window.quick = text => { searchBox.value = text; startSearch(); };
window.focusUrlInput = () => {
  searchBox.value = 'https://';
  searchBox.focus();
  searchBox.setSelectionRange(searchBox.value.length, searchBox.value.length);
};

// ── 새 검색 ──
function newSearch() {
  chatHistory = [];
  activeId    = null;
  sessions.innerHTML = '';
  hero.classList.remove('hidden');
  resultArea.classList.remove('on');
  followupBar.style.display = 'none';
  searchBox.value = '';
  searchBox.style.height = 'auto';
  searchBox.focus();
  renderSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── 첫 검색 시작 ──
async function startSearch() {
  const q = searchBox.value.trim();
  if (!q || isBusy) return;

  // 히스토리 저장
  activeId = saveToHistory(q);

  // UI 전환
  hero.classList.add('hidden');
  resultArea.classList.add('on');
  sessions.innerHTML = '';
  chatHistory = [];
  lastBids    = [];

  await sendQuery(q);
}

// ── 추가 질문 ──
async function followup() {
  const q = followupBox.value.trim();
  if (!q || isBusy) return;
  followupBox.value = '';
  followupBox.style.height = 'auto';
  await sendQuery(q);
}

// ── 공통 쿼리 전송 ──
async function sendQuery(query) {
  if (isBusy) return;
  isBusy = true;
  setBusy(true);

  appendQBubble(query);
  const loadingEl = appendLoading();
  scrollBottom();

  try {
    const res  = await fetch('api_chat.php', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ message: query, history: chatHistory, lastBids }),
    });
    const data = await res.json();

    loadingEl.remove();

    chatHistory.push({ role: 'user', content: query });
    chatHistory.push({ role: 'assistant', content: data.message || '' });

    // 새 공고가 있으면 lastBids 갱신, 없으면 (필터 결과) 그대로 유지
    if (data.bids && data.bids.length > 0) lastBids = data.bids;

    await appendAnswer(data.message || '', data.bids || []);

    followupBar.style.display = 'block';
    scrollBottom();

  } catch {
    loadingEl.remove();
    appendErrorMsg();
  } finally {
    // 카드까지 모두 렌더된 뒤 저장
    if (activeId) updateHistorySession(activeId);
    isBusy = false;
    setBusy(false);
    renderSidebar();
  }
}

// ── UI 헬퍼 ──
function appendQBubble(text) {
  const row = document.createElement('div');
  row.className = 'q-bubble';
  row.innerHTML = `<div class="q-bubble-inner">${esc(text)}</div>`;
  sessions.appendChild(row);
}

function appendLoading() {
  const el = document.createElement('div');
  el.className = 'typing-row';
  el.innerHTML = `<div class="dots"><span></span><span></span><span></span></div> AI가 분석 중입니다…`;
  sessions.appendChild(el);
  return el;
}

function appendErrorMsg() {
  const el = document.createElement('div');
  el.className = 'typing-row';
  el.style.color = '#dc2626';
  el.textContent = '⚠️ 오류가 발생했습니다. 다시 시도해주세요.';
  sessions.appendChild(el);
}

async function appendAnswer(message, bids) {
  const row = document.createElement('div');
  row.className = 'answer-row';

  // 왼쪽: AI 분석
  const left = document.createElement('div');
  left.innerHTML = `<div class="panel-label ai">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    AI 분석
  </div>
  <div class="answer-text" id="answerText_${Date.now()}"></div>`;

  // 오른쪽: 공고 카드
  const right = document.createElement('div');
  right.innerHTML = `<div class="panel-label cards">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
    관련 공고
  </div>
  <div class="card-list" id="cardList_${Date.now()}"></div>`;

  row.appendChild(left);
  row.appendChild(right);
  sessions.appendChild(row);

  const textEl = left.querySelector('.answer-text');
  const listEl = right.querySelector('.card-list');

  // 타이프라이터
  await typewrite(message, textEl);

  // 공고 카드 — 모두 삽입될 때까지 기다린 뒤 resolve
  if (!bids.length) {
    listEl.innerHTML = '<div class="no-bids">관련 공고를 찾지 못했습니다.<br>조건을 바꿔 추가 질문해보세요.</div>';
  } else {
    await new Promise(resolve => {
      let done = 0;
      bids.forEach((b, i) => {
        setTimeout(() => {
          const card = makeCard(b);
          listEl.appendChild(card);
          requestAnimationFrame(() => setTimeout(() => {
            card.classList.add('on');
            if (++done === bids.length) resolve();
          }, 10));
        }, i * 120);
      });
    });
  }
}

async function typewrite(text, el) {
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);
  for (let i = 0; i < text.length; i++) {
    cursor.insertAdjacentText('beforebegin', text[i]);
    if (i % 3 === 0) scrollBottom();
    await sleep(text[i] === '\n' ? 50 : 12);
  }
  cursor.remove();
}

function makeCard(b) {
  const deadline = b.deadline_date && b.deadline_date !== '1970-01-01'
    ? `<span class="bid-deadline">~${esc(b.deadline_date)}</span>` : '';
  const div = document.createElement('div');
  div.className = 'bid-card';
  div.innerHTML = `
    <a class="bid-card-title" href="${esc(b.url||'#')}" target="_blank" rel="noopener">${esc(b.title)}</a>
    <div class="bid-card-meta">
      <span class="bid-source">${esc(b.source)}</span>
      <span class="bid-org">${esc(b.org_name)}</span>
      ${deadline}
    </div>`;
  return div;
}

function setBusy(on) {
  searchBtn.disabled   = on;
  followupBtn.disabled = on;
}

function scrollBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ── 사이드바: 최근 검색 ──
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

function saveToHistory(query) {
  const list = loadHistory();
  const id   = Date.now().toString();
  list.unshift({ id, query, ts: Date.now(), html: '', msgs: [] });
  if (list.length > 30) list.splice(30);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  return id;
}

function updateHistorySession(id) {
  try {
    const list = loadHistory();
    const item = list.find(x => x.id === id);
    if (!item) return;
    item.html = sessions.innerHTML;
    item.msgs = chatHistory;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch(e) { /* storage 용량 초과 시 무시 */ }
}

function renderSidebar() {
  const list = loadHistory();
  const el   = document.getElementById('historyList');
  if (!list.length) {
    el.innerHTML = '<div class="sidebar-empty">아직 검색 기록이 없습니다</div>';
    return;
  }
  el.innerHTML = list.map(item => `
    <div class="sidebar-item${item.id === activeId ? ' active' : ''}"
         onclick="loadHistory_item('${esc(item.id)}')">
      <div class="sidebar-item-body">
        <div class="sidebar-item-query">${esc(item.query)}</div>
        <div class="sidebar-item-time">${timeAgo(item.ts)}</div>
      </div>
      <button class="sidebar-item-del" title="삭제"
              onclick="event.stopPropagation();deleteHistoryItem('${esc(item.id)}')">×</button>
    </div>
  `).join('');
}

window.loadHistory_item = function(id) {
  const list = loadHistory();
  const item = list.find(x => x.id === id);
  if (!item) return;

  activeId = id;
  hero.classList.add('hidden');
  resultArea.classList.add('on');

  if (item.html) {
    // 저장된 대화 그대로 복원
    sessions.innerHTML = item.html;
    chatHistory = item.msgs || [];
    sessions.querySelectorAll('.bid-card').forEach(c => c.classList.add('on'));
    followupBar.style.display = 'block';
    window.scrollTo({ top: 0 });
  } else {
    // html 없는 구버전 항목 → 재검색 (Q버블부터 새로 생성)
    chatHistory = [];
    sessions.innerHTML = '';
    followupBar.style.display = 'none';
    activeId = saveToHistory(item.query); // 새 id로 재저장
    sendQuery(item.query);
  }

  renderSidebar();
  scrollBottom();
};

window.deleteHistoryItem = function(id) {
  const list = loadHistory().filter(x => x.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  if (activeId === id) newSearch();
  else renderSidebar();
};

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h/24)}일 전`;
}

// ── 모바일 사이드바 토글 ──
window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('open');
};

// ── 유틸 ──
function autoResize(el) {
  el.addEventListener('input', () => {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
</script>
</body>
</html>
