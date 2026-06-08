/**
 * 서브 서비스 공통 헤더 — 포털 로그인 사용자·로그아웃 연동
 * portal-header.css 와 함께 사용 (#portalHeaderUser, #portalHeaderLogout)
 */
(function () {
  var PORTAL = "https://portal.platformers.kr";
  var userEl = document.getElementById("portalHeaderUser");
  var logoutEl = document.getElementById("portalHeaderLogout");
  if (!userEl && !logoutEl) return;

  function show(el) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute("aria-hidden");
  }

  fetch(PORTAL + "/api/me", { credentials: "include" })
    .then(function (r) {
      return r.json();
    })
    .then(function (me) {
      if (!me || !me.loggedIn) return;
      if (userEl) {
        userEl.textContent =
          (me.user && (me.user.displayName || me.user.name)) || "user";
        show(userEl);
      }
      if (logoutEl) show(logoutEl);
    })
    .catch(function () {});

  if (logoutEl) {
    logoutEl.addEventListener("click", function () {
      fetch(PORTAL + "/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
        .catch(function () {})
        .finally(function () {
          window.location.href = PORTAL + "/login";
        });
    });
  }
})();
