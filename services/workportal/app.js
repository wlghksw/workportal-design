/**
 * WorkPortal frontend
 *   - 탭 전환 (대시보드 / 설정)
 *   - 카드 = 유일한 진입점 → 새 탭으로 외부 서비스 열기
 *   - 상태 리스트 = 모니터링용 (클릭 비활성)
 *   - 헬스 30초 폴링
 */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    services: [],
    me: null,
    healths: [],
    activity: {
      page: 0,
      pageSize: 30,
      total: 0,
      filters: { user: "", service: "" },
      facetsLoaded: false,
    },
  };

  const SERVICE_LABEL = {
    bidding: "입찰 공고",
    meeting: "회의록",
    news: "뉴스",
    newsletter: "교육 뉴스레터",
    ppt: "PPT·제안서",
    crayon: "크레용스쿨 대시보드",
    fairytale: "e-book",
    portal: "포탈",
  };
  const API_BASE = (window.API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

  const apiFetch = (url, opts = {}) =>
    fetch(API_BASE + url, { credentials: "include", ...opts });

  function fmtDateTime(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  }

  function switchView(view) {
    $$(".tab[data-view]").forEach((t) =>
      t.classList.toggle("is-active", t.dataset.view === view),
    );
    $$(".view").forEach((v) => {
      v.hidden = v.dataset.view !== view;
    });
    if (window.history && window.history.replaceState) {
      window.history.replaceState(
        null,
        "",
        view === "dashboard" ? "/" : `#${view}`,
      );
    }
    if (view === "activity") {
      void showActivityView();
    } else if (view === "dashboard") {
      void loadHomeRecent();
    }
  }

  function go(serviceId, opts = {}) {
    const svc = state.services.find((s) => s.id === serviceId);
    if (!svc || !svc.url) return;
    if (opts.newtab === false) {
      location.href = svc.url;
    } else {
      window.open(svc.url, "_blank", "noopener,noreferrer");
    }
  }

  async function loadServices() {
    try {
      const r = await apiFetch("/api/services");
      state.services = await r.json();
    } catch (e) {
      console.error("services load failed", e);
      state.services = [];
    }
    state.services.forEach((s) => {
      const host = $(`[data-host="${s.id}"]`);
      if (host) {
        try {
          host.textContent = new URL(s.url).host;
        } catch {
          host.textContent = s.url;
        }
      }
    });
  }

  function renderStatusList(healths) {
    const list = $("#statusList");
    if (!list) return;
    list.innerHTML = state.services
      .map((s) => {
        const h = healths.find((x) => x.id === s.id);
        const up = h && h.status === "up";
        const down = h && h.status === "down";
        const cls = up ? "is-up" : down ? "is-down" : "";
        let meta;
        if (!h) meta = "확인 중…";
        else if (up) meta = `정상 · ${h.ms ?? "-"}ms`;
        else if (down) meta = "응답 없음";
        else meta = "확인 불가";
        const host = (() => {
          try {
            return new URL(s.url).host;
          } catch {
            return "";
          }
        })();
        return `<li class="portal-status__item">
          <span class="portal-status__dot ${cls}"></span>
          <div class="portal-status__info">
            <span class="portal-status__name">${escapeHtml(s.name)}</span>
            <span class="portal-status__host">${escapeHtml(host)}</span>
          </div>
          <span class="portal-status__meta">${escapeHtml(meta)}</span>
        </li>`;
      })
      .join("");
  }

  function renderHomeRecent(items) {
    const list = $("#homeRecentList");
    if (!list) return;
    if (!items.length) {
      list.innerHTML =
        '<li class="portal-notice__empty">아직 기록이 없습니다. 입찰·회의록을 사용하면 여기에 표시됩니다.</li>';
      return;
    }
    list.innerHTML = items
      .slice(0, 5)
      .map((row) => {
        const who = row.displayName || row.user || "—";
        const label = row.label || row.action || "기능 사용";
        const svc = row.serviceName || SERVICE_LABEL[row.service] || row.service;
        const detail = row.detail ? ` · ${row.detail}` : "";
        return `<li>
          <button type="button" class="portal-notice__link" data-view-jump="activity">
            <span class="portal-notice__title">${escapeHtml(label)}</span>
            <span class="portal-notice__desc">${escapeHtml(who)} · ${escapeHtml(svc)}${escapeHtml(detail)}</span>
            <time class="portal-notice__date">${escapeHtml(fmtDateTime(row.ts))}</time>
          </button>
        </li>`;
      })
      .join("");
  }

  async function loadHomeRecent() {
    const list = $("#homeRecentList");
    if (!list) return;
    try {
      const r = await apiFetch("/api/activity?limit=5&offset=0");
      if (!r.ok) throw new Error("activity");
      const data = await r.json();
      renderHomeRecent(data.items || []);
    } catch {
      list.innerHTML =
        '<li class="portal-notice__empty">최근 사용 내역을 불러오지 못했습니다.</li>';
    }
  }

  function switchBoardTab(tabId) {
    $$(".portal-board__tab").forEach((t) => {
      const on = t.dataset.boardTab === tabId;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$("[data-board-panel]").forEach((p) => {
      const on = p.dataset.boardPanel === tabId;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }

  function filterServiceTiles(q) {
    const query = String(q || "")
      .trim()
      .toLowerCase();
    $$(".portal-tile").forEach((tile) => {
      if (!query) {
        tile.hidden = false;
        return;
      }
      const text = `${tile.dataset.search || ""} ${tile.textContent || ""}`.toLowerCase();
      tile.hidden = !text.includes(query);
    });
  }

  function renderCardBadges(healths) {
    state.services.forEach((s) => {
      const badge = document.querySelector(`[data-health="${s.id}"]`);
      if (!badge) return;
      const h = healths.find((x) => x.id === s.id);
      badge.classList.remove("badge--ok", "badge--bad", "badge--muted");
      if (!h) {
        badge.classList.add("badge--muted");
        badge.textContent = "확인 중…";
      } else if (h.status === "up") {
        badge.classList.add("badge--ok");
        badge.textContent = "정상";
      } else if (h.status === "down") {
        badge.classList.add("badge--bad");
        badge.textContent = "응답 없음";
      } else {
        badge.classList.add("badge--muted");
        badge.textContent = "확인 불가";
      }
    });
  }

  function fmtTime(d) {
    return d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  async function refreshHealth() {
    try {
      const r = await apiFetch("/api/services/health");
      state.healths = await r.json();
      renderStatusList(state.healths);
      renderCardBadges(state.healths);
      const last = $("#lastSync");
      if (last) last.textContent = `${fmtTime(new Date())} 갱신`;
    } catch (e) {
      console.warn("health failed", e);
    }
  }

  function setHeaderAuthVisible(el, show) {
    if (!el) return;
    el.hidden = !show;
    if (show) el.removeAttribute("aria-hidden");
    else el.setAttribute("aria-hidden", "true");
  }

  function updateHeaderAuth() {
    const logoutBtn = $("#logoutBtn");
    const loginBtn = $("#loginBtn");
    const userBadge = $("#topbarUser");
    const authOn = Boolean(state.me?.authEnabled);
    const loggedIn = Boolean(state.me?.loggedIn);

    if (loggedIn) {
      setHeaderAuthVisible(loginBtn, false);
      setHeaderAuthVisible(logoutBtn, true);
      setHeaderAuthVisible(userBadge, true);
      if (userBadge) {
        userBadge.textContent =
          state.me.user?.displayName || state.me.user?.name || "user";
      }
    } else if (authOn) {
      setHeaderAuthVisible(loginBtn, true);
      setHeaderAuthVisible(logoutBtn, false);
      setHeaderAuthVisible(userBadge, false);
    } else {
      setHeaderAuthVisible(loginBtn, false);
      setHeaderAuthVisible(logoutBtn, false);
      setHeaderAuthVisible(userBadge, false);
    }
  }

  async function loadMe() {
    try {
      const r = await apiFetch("/api/me");
      state.me = await r.json();
      updateHeaderAuth();
    } catch {
      state.me = null;
      updateHeaderAuth();
    }
  }

  function bind() {
    document.addEventListener("click", (ev) => {
      const jump = ev.target.closest("[data-view-jump]");
      if (jump) {
        ev.preventDefault();
        switchView(jump.dataset.viewJump);
        return;
      }
      const boardTab = ev.target.closest("[data-board-tab]");
      if (boardTab) {
        ev.preventDefault();
        switchBoardTab(boardTab.dataset.boardTab);
        return;
      }
      const goEl = ev.target.closest("[data-go]");
      if (goEl) {
        ev.preventDefault();
        go(goEl.dataset.go, { newtab: goEl.dataset.newtab === "1" });
        return;
      }
      const viewEl = ev.target.closest("[data-view]");
      if (viewEl && viewEl.matches(".tab")) {
        ev.preventDefault();
        switchView(viewEl.dataset.view);
      }
    });

    const searchForm = $("#siteSearch");
    const searchInput = $("#siteSearchInput");
    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        filterServiceTiles(searchInput.value);
        const first = $(".portal-tile:not([hidden])");
        if (first && searchInput.value.trim()) {
          first.scrollIntoView({ behavior: "smooth", block: "nearest" });
          first.focus();
        }
      });
      searchInput.addEventListener("input", () => {
        filterServiceTiles(searchInput.value);
      });
    }

    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      const goEl = ev.target.closest("[data-go]");
      if (!goEl) return;
      ev.preventDefault();
      go(goEl.dataset.go, { newtab: goEl.dataset.newtab === "1" });
    });

    const logoutBtn = $("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        const authOn = state.me && state.me.authEnabled;
        try {
          await apiFetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
          console.warn("logout failed", e);
        }
        state.me = {
          ...(state.me || {}),
          authEnabled: authOn,
          loggedIn: false,
          user: null,
          authenticated: !authOn,
        };
        updateHeaderAuth();
        if (authOn) {
          location.replace("/login");
        }
      });
    }

  }

  // ─────────────────────────────────────────────
  // 사용 이력 (기능 사용)
  // ─────────────────────────────────────────────
  function renderActivityTimeline(items) {
    const list = $("#activityTimeline");
    if (!list) return;
    if (!items.length) {
      list.innerHTML =
        '<li class="activity-empty">아직 기록된 기능 사용이 없습니다.<br><span class="muted">입찰 공고에서 AI 요약 등을 사용하면 여기에 표시됩니다.</span></li>';
      return;
    }
    list.innerHTML = items
      .map((row) => {
        const who = row.displayName || row.user || "알 수 없음";
        const svc = row.serviceName || SERVICE_LABEL[row.service] || row.service;
        const detail = row.detail
          ? `<p class="activity-item__detail">${escapeHtml(row.detail)}</p>`
          : "";
        return `<li class="activity-item">
          <div class="activity-item__top">
            <span class="activity-item__who">${escapeHtml(who)}</span>
            <time class="activity-item__time">${escapeHtml(fmtDateTime(row.ts))}</time>
          </div>
          <div class="activity-item__action">
            <span class="activity-item__service">${escapeHtml(svc)}</span>
            <span class="activity-item__label">${escapeHtml(row.label || row.action)}</span>
          </div>
          ${detail}
        </li>`;
      })
      .join("");
  }

  function renderActivityPager() {
    const pager = $("#activityPager");
    const prev = $("#activityPrev");
    const next = $("#activityNext");
    const meta = $("#activityMeta");
    const { page, pageSize, total } = state.activity;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (pager) pager.textContent = `${page + 1} / ${totalPages}`;
    if (prev) prev.disabled = page <= 0;
    if (next) next.disabled = page >= totalPages - 1;
    if (meta) {
      meta.textContent =
        total > 0 ? `총 ${total.toLocaleString()}건` : "기록 없음";
    }
  }

  async function loadActivityFacets() {
    if (state.activity.facetsLoaded) return;
    try {
      const r = await apiFetch("/api/activity/facets");
      if (!r.ok) return;
      const data = await r.json();
      const userSel = $("#activityUser");
      const svcSel = $("#activityService");
      if (userSel) {
        const cur = state.activity.filters.user;
        userSel.innerHTML =
          '<option value="">전체</option>' +
          (data.users || [])
            .map((u) => `<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`)
            .join("");
        userSel.value = cur;
      }
      if (svcSel) {
        const cur = state.activity.filters.service;
        svcSel.innerHTML =
          '<option value="">전체</option>' +
          (data.services || [])
            .map(
              (s) =>
                `<option value="${escapeHtml(s)}">${escapeHtml(SERVICE_LABEL[s] || s)}</option>`,
            )
            .join("");
        svcSel.value = cur;
      }
      state.activity.facetsLoaded = true;
    } catch (e) {
      console.warn("activity facets failed", e);
    }
  }

  async function refreshActivity() {
    const list = $("#activityTimeline");
    if (list) {
      list.innerHTML = '<li class="activity-empty">불러오는 중…</li>';
    }
    const { page, pageSize, filters } = state.activity;
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String(page * pageSize),
    });
    if (filters.user) params.set("user", filters.user);
    if (filters.service) params.set("service", filters.service);
    try {
      const r = await apiFetch(`/api/activity?${params.toString()}`);
      if (r.status === 401) {
        location.href =
          "/login?return=" + encodeURIComponent(location.pathname + "#activity");
        return;
      }
      if (!r.ok) throw new Error("activity fetch failed");
      const data = await r.json();
      state.activity.total = data.total || 0;
      renderActivityTimeline(data.items || []);
      renderActivityPager();
    } catch (e) {
      console.warn("activity failed", e);
      if (list) {
        list.innerHTML =
          '<li class="activity-empty">불러오지 못했습니다.</li>';
      }
    }
  }

  function bindActivity() {
    const userSel = $("#activityUser");
    const svcSel = $("#activityService");
    const refresh = $("#activityRefresh");
    const prev = $("#activityPrev");
    const next = $("#activityNext");
    const onFilterChange = () => {
      state.activity.filters.user = userSel ? userSel.value : "";
      state.activity.filters.service = svcSel ? svcSel.value : "";
      state.activity.page = 0;
      refreshActivity();
    };
    userSel && userSel.addEventListener("change", onFilterChange);
    svcSel && svcSel.addEventListener("change", onFilterChange);
    refresh &&
      refresh.addEventListener("click", () => {
        state.activity.facetsLoaded = false;
        loadActivityFacets();
        refreshActivity();
      });
    prev &&
      prev.addEventListener("click", () => {
        if (state.activity.page > 0) {
          state.activity.page -= 1;
          refreshActivity();
        }
      });
    next &&
      next.addEventListener("click", () => {
        const totalPages = Math.max(
          1,
          Math.ceil(state.activity.total / state.activity.pageSize),
        );
        if (state.activity.page < totalPages - 1) {
          state.activity.page += 1;
          refreshActivity();
        }
      });
  }

  async function showActivityView() {
    await refreshActivity();
    void loadActivityFacets();
  }

  async function boot() {
    bind();
    bindActivity();
    await Promise.all([loadServices(), loadMe()]);
    refreshHealth();
    setInterval(refreshHealth, 30_000);
    const hashView = location.hash.replace(/^#/, "");
    if (hashView === "activity" || hashView === "guide") {
      switchView(hashView);
    } else {
      void loadHomeRecent();
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
