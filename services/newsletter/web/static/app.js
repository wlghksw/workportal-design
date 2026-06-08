(function () {
  const $ = (id) => document.getElementById(id);

  const urlsEl = $("urls");
  const featuredEl = $("featured");
  const issueYearEl = $("issueYear");
  const issueMonthEl = $("issueMonth");
  const allowRepeatEl = $("allowRepeat");
  const btnGenerate = $("btnGenerate");
  const globalAlert = $("globalAlert");
  const previewFrame = $("previewFrame");
  const previewPlaceholder = $("previewPlaceholder");
  const previewStage = $("previewStage");
  const previewTitle = $("previewTitle");
  const previewActions = $("previewActions");
  const btnOpenNew = $("btnOpenNew");
  const btnDownload = $("btnDownload");
  const resultPanel = $("resultPanel");
  const resultSummary = $("resultSummary");
  const resultUrls = $("resultUrls");
  const skippedBlock = $("skippedBlock");
  const usedCount = $("usedCount");
  const usedUrls = $("usedUrls");
  const step1 = $("step1");
  const step2 = $("step2");
  const step3 = $("step3");
  const mailSender = $("mailSender");
  const mailRecipientCount = $("mailRecipientCount");
  const mailHint = $("mailHint");
  const mailReadyPill = $("mailReadyPill");
  const btnSend = $("btnSend");
  const mailGroupBox = $("mailGroupBox");
  const mailGroupChips = $("mailGroupChips");

  let lastHtmlFile = null;
  let lastSendHtmlFile = null;
  let mailReady = false;
  let knownGroups = [];

  const PORTAL_ACTIVITY_URL = "https://portal.platformers.kr/api/activity";
  function reportFeatureUse(action, label, detail) {
    try {
      fetch(PORTAL_ACTIVITY_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "newsletter",
          action: action,
          label: label || undefined,
          detail:
            detail != null && detail !== ""
              ? String(detail).slice(0, 500)
              : undefined,
        }),
      }).catch(function () {});
    } catch (_e) {}
  }

  function showAlert(message, type) {
    globalAlert.hidden = false;
    globalAlert.className = "alert alert--" + (type || "info");
    globalAlert.textContent = message;
  }

  function hideAlert() {
    globalAlert.hidden = true;
  }

  function setSteps(active) {
    [step1, step2, step3].forEach((el, i) => {
      el.classList.remove("active", "done");
      if (i + 1 < active) el.classList.add("done");
      if (i + 1 === active) el.classList.add("active");
    });
  }

  function parseUrls(text) {
    return text
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function getSelectedSendGroups() {
    const boxes = mailGroupChips.querySelectorAll('input[type="checkbox"]');
    if (!boxes.length) return null;
    const all = Array.from(boxes);
    const checked = all.filter((b) => b.checked).map((b) => b.value);
    if (!checked.length) return [];
    if (checked.length === all.length) return null;
    return checked;
  }

  function mailStatusQuery() {
    const groups = getSelectedSendGroups();
    if (!groups || !groups.length) return "";
    return "?groups=" + encodeURIComponent(groups.join(","));
  }

  function renderMailGroupChips(groups) {
    knownGroups = (groups || []).map((g) => g.name).filter(Boolean);
    mailGroupChips.innerHTML = "";
    if (!groups || !groups.length) {
      mailGroupBox.hidden = true;
      return;
    }
    mailGroupBox.hidden = false;
    groups.forEach((g) => {
      const label = document.createElement("label");
      label.className = "group-chip";
      label.innerHTML =
        '<input type="checkbox" value="' +
        escAttr(g.name) +
        '" checked> ' +
        escapeHtml(g.name) +
        " <span class=\"group-chip__cnt\">" +
        (g.active || 0) +
        "</span>";
      mailGroupChips.appendChild(label);
    });
    mailGroupChips.querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("change", () => loadMailStatus());
    });
  }

  async function loadMailStatus() {
    try {
      const res = await fetch("/api/mail/status" + mailStatusQuery());
      const data = await res.json();
      mailSender.textContent = data.sender;
      mailRecipientCount.textContent = (data.recipient_count ?? 0) + "명";
      if (data.groups && data.groups.length && !mailGroupChips.children.length) {
        renderMailGroupChips(data.groups);
      } else if (data.groups && data.groups.length) {
        mailGroupChips.querySelectorAll(".group-chip").forEach((chip, i) => {
          const g = data.groups[i];
          if (!g) return;
          const cnt = chip.querySelector(".group-chip__cnt");
          if (cnt) cnt.textContent = String(g.active || 0);
        });
      }

      if (data.ready) {
        mailReady = true;
        mailReadyPill.textContent = "발행 가능";
        mailReadyPill.className = "cnt-pill cnt-pill--ok";
        mailHint.textContent =
          "미리보기 확인 후 「메일 발행」을 누르면 " +
          data.sender +
          " 에서 BCC로 발송됩니다.";
      } else if (!data.graph_configured) {
        mailReady = false;
        mailReadyPill.textContent = "Graph 미설정";
        mailReadyPill.className = "cnt-pill cnt-pill--warn";
        mailHint.textContent =
          "web/.env 에 Microsoft Graph 설정이 필요합니다. (MAIL_SETUP.md 참고)";
      } else if (!data.recipients_ready) {
        mailReady = false;
        mailReadyPill.textContent = "수신자 없음";
        mailReadyPill.className = "cnt-pill cnt-pill--warn";
        mailHint.textContent =
          "상단 「수신자」 메뉴에서 목록을 추가·저장하세요.";
      } else {
        mailReady = false;
        mailReadyPill.textContent = "준비 중";
        mailReadyPill.className = "cnt-pill cnt-pill--warn";
      }
      updateSendButtons();
    } catch (_err) {
      mailHint.textContent = "메일 설정을 불러오지 못했습니다.";
    }
  }

  function updateSendButtons() {
    const canSend = mailReady && lastHtmlFile;
    btnSend.disabled = !canSend;
  }

  async function loadIssueDefault() {
    const res = await fetch("/api/issue-default");
    const data = await res.json();
    issueYearEl.value = data.issue_year;
    issueMonthEl.value = data.issue_month;
    await loadUsedUrls(data.issue_year, data.issue_month);
  }

  async function loadUsedUrls(year, month) {
    const q = new URLSearchParams({
      issue_year: String(year),
      issue_month: String(month),
    });
    const res = await fetch("/api/used-urls?" + q);
    const data = await res.json();
    usedCount.textContent = data.count + "건";
    usedUrls.innerHTML = "";
    if (!data.urls.length) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "없음";
      usedUrls.appendChild(li);
      return;
    }
    data.urls.forEach((url) => {
      const li = document.createElement("li");
      li.textContent = url;
      usedUrls.appendChild(li);
    });
  }

  issueYearEl.addEventListener("change", () => {
    loadUsedUrls(Number(issueYearEl.value), Number(issueMonthEl.value));
  });
  issueMonthEl.addEventListener("change", () => {
    loadUsedUrls(Number(issueYearEl.value), Number(issueMonthEl.value));
  });

  async function generate() {
    hideAlert();
    const urls = parseUrls(urlsEl.value);
    if (!urls.length) {
      showAlert("블로그 URL을 한 개 이상 입력해 주세요.", "error");
      return;
    }

    setSteps(2);
    btnGenerate.disabled = true;
    const label = btnGenerate.innerHTML;
    btnGenerate.innerHTML = '<span class="spinner"></span> 생성 중…';

    const payload = {
      urls,
      featured_link: featuredEl.value.trim() || null,
      issue_year: Number(issueYearEl.value) || null,
      issue_month: Number(issueMonthEl.value) || null,
      allow_repeat: allowRepeatEl.checked,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = data.detail;
        let msg =
          typeof detail === "string"
            ? detail
            : detail?.message || "생성에 실패했습니다.";
        if (detail?.skipped?.length) {
          msg += " (제외 " + detail.skipped.length + "건)";
        }
        showAlert(msg, "error");
        setSteps(1);
        return;
      }

      setSteps(3);
      lastHtmlFile = data.html_file;
      lastSendHtmlFile = data.outlook_html_file || data.send_html_file || null;
      updateSendButtons();
      reportFeatureUse(
        "generate",
        "뉴스레터 HTML 생성",
        (data.issue_label || "") + " · " + (data.html_file || "")
      );

      let alertMsg =
        data.issue_label +
        " 호 완료 · 미리보기 " +
        data.size_kb +
        " KB";
      if (lastSendHtmlFile) {
        alertMsg += " · 발송은 " + lastSendHtmlFile + " 사용";
      }
      alertMsg += ". 확인 후 메일 발행하세요.";
      if (data.mail?.ok) {
        alertMsg +=
          " · 메일 " + data.mail.recipient_count + "명 발송 완료 (자동 발송)";
      } else if (data.mail?.error) {
        alertMsg += " · 자동 발송 실패: " + data.mail.error;
      }
      showAlert(alertMsg, data.mail?.ok ? "success" : "success");

      previewPlaceholder.hidden = true;
      previewFrame.hidden = false;
      previewStage.classList.add("active");
      previewFrame.src = data.preview_url + "?t=" + Date.now();
      previewTitle.textContent = data.html_file;
      previewActions.hidden = false;
      btnOpenNew.href = data.preview_url;
      btnDownload.href = data.download_url;
      btnDownload.download = data.html_file;

      resultPanel.hidden = false;
      resultSummary.innerHTML =
        '<span class="badge badge-ok">완료</span> ' +
        escapeHtml(data.issue_label) +
        " · 카드 " +
        data.urls_used.length +
        "개";
      resultUrls.innerHTML = "";
      data.urls_used.forEach((u) => {
        const li = document.createElement("li");
        li.textContent = u;
        resultUrls.appendChild(li);
      });

      if (data.skipped?.length || data.invalid?.length) {
        skippedBlock.hidden = false;
        const parts = [];
        if (data.skipped?.length) {
          parts.push("이전 호 제외 " + data.skipped.length + "건");
        }
        if (data.invalid?.length) {
          parts.push("잘못된 URL " + data.invalid.length + "건");
        }
        skippedBlock.textContent = parts.join(" · ");
      } else {
        skippedBlock.hidden = true;
      }

      await loadUsedUrls(data.issue_year, data.issue_month);
    } catch (err) {
      showAlert("네트워크 오류: " + err.message, "error");
      setSteps(1);
    } finally {
      btnGenerate.disabled = false;
      btnGenerate.innerHTML = label;
    }
  }

  async function sendMail() {
    const sendFile = lastSendHtmlFile || lastHtmlFile;
    if (!sendFile) {
      showAlert("먼저 뉴스레터를 생성하세요.", "error");
      return;
    }

    const statusRes = await fetch("/api/mail/status");
    const status = await statusRes.json();
    const year = parseInt(issueYearEl.value, 10);
    const month = parseInt(issueMonthEl.value, 10);
    let subjectLine = "에듀올랩(크레용스쿨) Vol.??.?? 뉴스레터 공유드립니다.";
    if (year && month) {
      const subRes = await fetch(
        "/api/mail/subject?issue_year=" + year + "&issue_month=" + month
      );
      if (subRes.ok) {
        const sub = await subRes.json();
        if (sub.subject) subjectLine = sub.subject;
      }
    }
    const sendGroups = getSelectedSendGroups();
    if (sendGroups && !sendGroups.length) {
      showAlert("발송할 그룹을 하나 이상 선택하세요.", "error");
      return;
    }
    const groupNote =
      sendGroups && sendGroups.length
        ? "\n그룹: " + sendGroups.join(", ") + "\n"
        : "\n그룹: 전체\n";
    const ok = window.confirm(
      status.sender +
        " 계정으로 " +
        status.recipient_count +
        "명에게 BCC 발송합니다." +
        groupNote +
        "\n제목: " +
        subjectLine +
        "\n\n계속하시겠습니까?"
    );
    if (!ok) return;

    hideAlert();
    btnSend.disabled = true;
    const sendLabel = btnSend.textContent;
    btnSend.innerHTML = '<span class="spinner"></span> 발송 중…';

    try {
      const res = await fetch("/api/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html_file: sendFile,
          dry_run: false,
          groups: sendGroups,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // 삭제/정리로 파일이 없어진 경우: 상태 초기화
        if (res.status === 404) {
          lastHtmlFile = null;
          updateSendButtons();
        }
        showAlert(
          typeof data.detail === "string"
            ? data.detail
            : "발송 실패",
          "error"
        );
        return;
      }

      showAlert(data.recipient_count + "명 발송", "success");
      reportFeatureUse(
        "mail_send",
        "뉴스레터 메일 발행",
        (data.recipient_count || 0) + "명"
      );
    } catch (err) {
      showAlert("발송 오류: " + err.message, "error");
    } finally {
      btnSend.textContent = sendLabel;
      updateSendButtons();
    }
  }

  btnGenerate.addEventListener("click", generate);
  btnSend.addEventListener("click", sendMail);

  /* ── 수신자 관리 ── */
  const viewCreate = $("viewCreate");
  const viewRecipients = $("viewRecipients");
  const recipientTableBody = $("recipientTableBody");
  const recipientEmpty = $("recipientEmpty");
  const recipientStats = $("recipientStats");
  const btnAddRecipient = $("btnAddRecipient");
  const saveRecipientBtns = () =>
    document.querySelectorAll(".js-save-recipients");
  const recipientGroupFilter = $("recipientGroupFilter");
  const recipientGroupTabs = $("recipientGroupTabs");
  const recipientSearch = $("recipientSearch");
  const recipientSearchHint = $("recipientSearchHint");
  const newGroupName = $("newGroupName");
  const btnAddGroup = $("btnAddGroup");
  const CUSTOM_GROUPS_KEY = "edu_newsletter_custom_groups";
  const CUSTOM_GROUPS_VERSION_KEY = "edu_newsletter_custom_groups_v";
  const CUSTOM_GROUPS_VERSION = "3";
  const GROUP_CANONICAL = {
    플랫폼머즈: "플랫포머즈",
    플랫폼멋: "플랫포머즈",
    플랫포머: "플랫포머즈",
    플랫포: "플랫포머즈",
  };
  const recipientNameWarn = $("recipientNameWarn");
  const recipientCsvFile = $("recipientCsvFile");
  const recipientCsvMerge = $("recipientCsvMerge");
  const btnImportCsv = $("btnImportCsv");
  const navLinks = document.querySelectorAll(".header__nav-link[data-view]");

  let recipientRows = [];
  let recipientGroupNames = [];
  let recipientGroupSummary = [];
  let customGroupNames = [];
  let sessionEmptyGroups = [];

  function migrateCustomGroupsStorage() {
    try {
      if (
        localStorage.getItem(CUSTOM_GROUPS_VERSION_KEY) !== CUSTOM_GROUPS_VERSION
      ) {
        localStorage.removeItem(CUSTOM_GROUPS_KEY);
        localStorage.setItem(CUSTOM_GROUPS_VERSION_KEY, CUSTOM_GROUPS_VERSION);
      }
    } catch (_e) {}
  }

  function loadCustomGroups() {
    migrateCustomGroupsStorage();
    return [];
  }

  function saveCustomGroups() {
    try {
      localStorage.setItem(
        CUSTOM_GROUPS_KEY,
        JSON.stringify(customGroupNames)
      );
      localStorage.setItem(CUSTOM_GROUPS_VERSION_KEY, CUSTOM_GROUPS_VERSION);
    } catch (_e) {}
  }

  function countHangulSyllables(text) {
    return (String(text).match(/[\uAC00-\uD7A3]/g) || []).length;
  }

  function normalizeGroupName(name) {
    return (name || "").trim().replace(/\s+/g, " ");
  }

  function canonicalGroupName(name) {
    const label = normalizeGroupName(name);
    return GROUP_CANONICAL[label] || label;
  }

  function hangulSyllables(text) {
    return String(text).match(/[\uAC00-\uD7A3]/g) || [];
  }

  function isPartialGroupName(name, allNames) {
    if (countHangulSyllables(name) < 2) return true;
    const syl = hangulSyllables(name);
    return allNames.some((other) => {
      if (other === name) return false;
      if (other.startsWith(name) && other.length > name.length) return true;
      const o = hangulSyllables(other);
      if (syl.length < o.length && syl.every((c, i) => c === o[i])) return true;
      if (syl.length <= 2 && o.length > syl.length && syl[0] === o[0]) {
        return true;
      }
      return false;
    });
  }

  function filterDisplayGroups(catalog) {
    const names = catalog.map((g) => g.name);
    return catalog.filter((g) => !isPartialGroupName(g.name, names));
  }

  function sanitizeCustomGroups() {
    const rowGroups = [
      ...new Set(
        recipientRows
          .filter((r) => r.email)
          .map((r) => canonicalGroupName(r.group))
          .filter(Boolean)
      ),
    ];
    customGroupNames = rowGroups.filter(
      (g) => countHangulSyllables(g) >= 2 && !isPartialGroupName(g, rowGroups)
    );
    sessionEmptyGroups = sessionEmptyGroups.filter((g) =>
      customGroupNames.includes(canonicalGroupName(g))
    );
    saveCustomGroups();
  }

  function mergeGroupCatalog() {
    const counts = new Map();
    recipientRows.forEach((r) => {
      const group = canonicalGroupName(r.group);
      if (!group || !r.email) return;
      const cur = counts.get(group) || { total: 0, active: 0 };
      cur.total += 1;
      if (r.active) cur.active += 1;
      counts.set(group, cur);
    });
    sessionEmptyGroups.forEach((name) => {
      const label = canonicalGroupName(name);
      if (!label || counts.has(label)) return;
      if (countHangulSyllables(label) < 2) return;
      counts.set(label, { total: 0, active: 0 });
    });
    const catalog = Array.from(counts.entries()).map(([name, stats]) => ({
      name,
      ...stats,
    }));
    return filterDisplayGroups(catalog).sort((a, b) =>
      a.name.localeCompare(b.name, "ko")
    );
  }

  function addCustomGroup(name) {
    const label = canonicalGroupName(name);
    if (!label) {
      showAlert("그룹 이름을 입력하세요.", "error");
      return false;
    }
    if (!sessionEmptyGroups.includes(label)) {
      sessionEmptyGroups.push(label);
      sessionEmptyGroups.sort((a, b) => a.localeCompare(b, "ko"));
    }
    if (!recipientGroupNames.includes(label)) {
      recipientGroupNames.push(label);
      recipientGroupNames.sort((a, b) => a.localeCompare(b, "ko"));
    }
    recipientGroupFilter.value = label;
    renderGroupTabs();
    renderRecipientTable();
    return true;
  }

  function countGroupMembers(groupName) {
    const label = canonicalGroupName(groupName);
    let withEmail = 0;
    let withoutEmail = 0;
    recipientRows.forEach((r) => {
      if (canonicalGroupName(r.group) !== label) return;
      if (r.email) withEmail += 1;
      else withoutEmail += 1;
    });
    return { withEmail, withoutEmail };
  }

  function deleteGroup(groupName) {
    const label = canonicalGroupName(groupName);
    if (!label) return;

    const { withEmail } = countGroupMembers(label);
    if (withEmail > 0) {
      const ok = window.confirm(
        '"' +
          label +
          '" 그룹에 수신자 ' +
          withEmail +
          "명이 있습니다.\n\n" +
          "그룹을 삭제하면 해당 수신자의 그룹이 비워집니다.\n" +
          "「저장」을 눌러야 서버에 반영됩니다.\n\n" +
          "계속할까요?"
      );
      if (!ok) return;
    }

    recipientRows.forEach((r) => {
      if (canonicalGroupName(r.group) === label) r.group = "";
    });
    sessionEmptyGroups = sessionEmptyGroups.filter((g) => g !== label);
    customGroupNames = customGroupNames.filter((g) => g !== label);
    saveCustomGroups();

    if (recipientGroupFilter.value === label) {
      recipientGroupFilter.value = "";
    }

    sanitizeCustomGroups();
    recipientGroupNames = mergeGroupCatalog().map((g) => g.name);
    renderGroupTabs();
    renderRecipientTable();
    updateRecipientStatsLocal();

    showAlert(
      withEmail > 0
        ? '"' + label + '" 그룹을 삭제했습니다. 「저장」을 눌러 반영하세요.'
        : '"' + label + '" 그룹을 삭제했습니다.',
      withEmail > 0 ? "info" : "success"
    );
  }

  function switchView(name) {
    const isRecipients = name === "recipients";
    viewCreate.hidden = isRecipients;
    viewRecipients.hidden = !isRecipients;
    navLinks.forEach((link) => {
      const on = link.dataset.view === name;
      link.classList.toggle("is-active", on);
      link.setAttribute("aria-current", on ? "page" : "false");
    });
    if (isRecipients) {
      loadRecipientsEditor();
    }
    hideAlert();
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchView(link.dataset.view);
    });
  });

  function updateGroupDatalist() {
    const names = new Set();
    mergeGroupCatalog()
      .filter((g) => g.total > 0)
      .forEach((g) => names.add(g.name));
    recipientRows.forEach((r) => {
      const g = canonicalGroupName(r.group);
      if (g && r.email) names.add(g);
    });
    const all = Array.from(names).filter(Boolean);
    const sorted = all
      .filter((name) => !isPartialGroupName(name, all))
      .sort((a, b) => a.localeCompare(b, "ko"));
    const datalist = $("recipientGroupList");
    if (!datalist) return;
    datalist.innerHTML = "";
    sorted.forEach((name) => {
      const dopt = document.createElement("option");
      dopt.value = name;
      datalist.appendChild(dopt);
    });
  }

  function listGroupNamesForSelect() {
    const names = new Set();
    mergeGroupCatalog().forEach((g) => {
      if (g.name) names.add(g.name);
    });
    customGroupNames.forEach((n) => {
      const c = canonicalGroupName(n);
      if (c) names.add(c);
    });
    recipientRows.forEach((r) => {
      const g = canonicalGroupName(r.group || "");
      if (g) names.add(g);
    });
    return Array.from(names)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "ko"));
  }

  function groupSelectOptionsHtml(currentGroup) {
    const cur = canonicalGroupName(currentGroup || "");
    const names = listGroupNamesForSelect();
    if (cur && !names.includes(cur)) names.push(cur);
    names.sort((a, b) => a.localeCompare(b, "ko"));
    let html = '<option value="">(미지정)</option>';
    names.forEach((n) => {
      html +=
        '<option value="' +
        escAttr(n) +
        '"' +
        (n === cur ? " selected" : "") +
        ">" +
        escapeHtml(n) +
        "</option>";
    });
    return html;
  }

  function renderGroupTabs() {
    const current = recipientGroupFilter.value;
    const total = recipientRows.filter((r) => r.email).length;
    const items = [{ name: "", label: "전체", count: total }];
    mergeGroupCatalog()
      .filter((g) => g.total > 0 || sessionEmptyGroups.includes(g.name))
      .forEach((g) => {
        items.push({
          name: g.name,
          label: g.name,
          count: g.total,
        });
      });
    recipientGroupTabs.innerHTML = "";
    items.forEach((item) => {
      const wrap = document.createElement("div");
      wrap.className =
        "group-tab-wrap" + (item.name === current ? " is-active" : "");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "group-tab" + (item.name === current ? " active" : "");
      btn.dataset.group = item.name;
      btn.innerHTML =
        escapeHtml(item.label) +
        '<span class="group-tab__cnt">' +
        item.count +
        "</span>";
      btn.addEventListener("click", () => {
        recipientGroupFilter.value = item.name;
        renderGroupTabs();
        renderRecipientTable();
      });
      wrap.appendChild(btn);

      if (item.name) {
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "group-tab-del";
        delBtn.title = "그룹 삭제";
        delBtn.setAttribute("aria-label", item.label + " 그룹 삭제");
        delBtn.textContent = "×";
        delBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteGroup(item.name);
        });
        wrap.appendChild(delBtn);
      }

      recipientGroupTabs.appendChild(wrap);
    });
    updateGroupDatalist();
  }

  function rowMatchesFilters(row) {
    const group = recipientGroupFilter.value;
    if (group && canonicalGroupName(row.group) !== group) return false;
    const q = (recipientSearch?.value || "").trim().toLowerCase();
    if (!q) return true;
    const hay = [
      row.email || "",
      row.name || "",
      row.group || "",
      row.note || "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  }

  function updateRecipientSearchHint(shownCount) {
    if (!recipientSearchHint) return;
    const q = (recipientSearch?.value || "").trim();
    const total = recipientRows.filter((r) => r.email).length;
    if (!q) {
      recipientSearchHint.textContent =
        total > 0 ? "전체 " + total + "명" : "";
      return;
    }
    recipientSearchHint.textContent =
      "검색 결과 " + shownCount + "건" + (total ? " · 전체 " + total + "명" : "");
  }

  function renderRecipientTable() {
    recipientTableBody.innerHTML = "";
    const filter = recipientGroupFilter.value;
    const q = (recipientSearch?.value || "").trim().toLowerCase();
    let shownWithEmail = 0;
    recipientRows.forEach((row) => {
      if (rowMatchesFilters(row) && row.email) shownWithEmail += 1;
    });
    updateRecipientSearchHint(shownWithEmail);

    const anyRowVisible = recipientRows.some((row) => rowMatchesFilters(row));
    recipientEmpty.hidden = recipientRows.length > 0 && anyRowVisible;
    if (recipientRows.length > 0 && !anyRowVisible) {
      recipientEmpty.hidden = false;
      recipientEmpty.textContent = q
        ? "검색어와 일치하는 수신자가 없습니다."
        : filter
          ? "선택한 그룹에 해당하는 수신자가 없습니다."
          : "수신자가 없습니다. 「+ 행 추가」 또는 CSV 가져오기를 사용하세요.";
    } else {
      recipientEmpty.textContent =
        "수신자가 없습니다. 「+ 행 추가」 또는 CSV 가져오기를 사용하세요.";
    }
    recipientRows.forEach((row, index) => {
      if (!rowMatchesFilters(row)) return;
      const tr = document.createElement("tr");
      tr.dataset.rowIndex = String(index);
      tr.innerHTML =
        '<td class="col-check"><input type="checkbox" data-f="active"' +
        (row.active ? " checked" : "") +
        "></td>" +
        '<td class="col-group"><select data-f="group" class="group-select" aria-label="그룹">' +
        groupSelectOptionsHtml(row.group) +
        "</select></td>" +
        '<td><input type="email" data-f="email" value="' +
        escAttr(row.email || "") +
        '" placeholder="email@company.com"></td>' +
        '<td><input type="text" data-f="name" value="' +
        escAttr(row.name || "") +
        '" placeholder="이름 (없으면 이메일로 구분)"></td>' +
        '<td><input type="text" data-f="note" value="' +
        escAttr(row.note || "") +
        '"></td>' +
        '<td class="col-act"><button type="button" class="btn-icon" data-del title="삭제">×</button></td>';
      const rowIndex = parseInt(tr.dataset.rowIndex, 10);
      tr.querySelectorAll("input, select").forEach((inp) => {
        const field = inp.getAttribute("data-f");
        const onUpdate = () => {
          syncRowFromDom(rowIndex, tr);
          if (field === "group") onGroupFieldSettled();
          else updateRecipientStatsLocal();
        };
        if (inp.tagName === "SELECT") {
          inp.addEventListener("change", onUpdate);
        } else {
          inp.addEventListener("input", () => syncRowFromDom(rowIndex, tr));
          inp.addEventListener("change", onUpdate);
        }
      });
      tr.querySelector("[data-del]").addEventListener("click", async () => {
        syncRowFromDom(rowIndex, tr);
        const email = (recipientRows[rowIndex]?.email || "").trim();
        const name = (recipientRows[rowIndex]?.name || "").trim();
        const label = name ? name + " <" + email + ">" : email;
        const ok = window.confirm(
          "이 수신자를 삭제할까요?\n\n" +
            (label ? label + "\n\n" : "") +
            "삭제하면 즉시 서버에 반영됩니다."
        );
        if (!ok) return;
        const backup = recipientRows.slice();
        const delIndex = parseInt(tr.dataset.rowIndex, 10);
        recipientRows.splice(delIndex, 1);
        renderRecipientTable();
        updateRecipientStatsLocal();

        const rows = collectRecipientRows();
        const saved = await saveRecipientsAuto(rows, {
          successMessage: "삭제 완료 · 서버에 반영했습니다.",
          skipFilterConfirm: true,
        });
        if (!saved) {
          recipientRows = backup;
          renderRecipientTable();
          updateRecipientStatsLocal();
        }
      });
      recipientTableBody.appendChild(tr);
    });
    updateRecipientStatsLocal();
  }

  function syncRowFromDom(index, tr) {
    const active = tr.querySelector('[data-f="active"]').checked;
    const email = tr.querySelector('[data-f="email"]').value.trim();
    const name = tr.querySelector('[data-f="name"]').value.trim();
    const note = tr.querySelector('[data-f="note"]').value.trim();
    const groupEl = tr.querySelector('[data-f="group"]');
    const group = canonicalGroupName(groupEl ? groupEl.value : "");
    recipientRows[index] = { email, name, active, note, group };
  }

  function onGroupFieldSettled() {
    sanitizeCustomGroups();
    recipientGroupNames = mergeGroupCatalog().map((g) => g.name);
    updateGroupDatalist();
    renderGroupTabs();
  }

  function syncVisibleRowsFromDom() {
    recipientTableBody.querySelectorAll("tr").forEach((tr) => {
      const index = parseInt(tr.dataset.rowIndex, 10);
      if (!Number.isNaN(index)) syncRowFromDom(index, tr);
    });
  }

  /** 저장 시 전체 recipientRows 사용 (그룹/검색 필터로 숨긴 행도 유지). */
  function collectRecipientRows() {
    syncVisibleRowsFromDom();
    const rows = [];
    recipientRows.forEach((row) => {
      const email = (row.email || "").trim();
      if (!email) return;
      rows.push({
        email,
        name: (row.name || "").trim(),
        active: !!row.active,
        note: (row.note || "").trim(),
        group: canonicalGroupName(row.group || ""),
      });
    });
    return rows;
  }

  function updateRecipientStatsLocal() {
    const active = recipientRows.filter((r) => r.active && r.email).length;
    const total = recipientRows.filter((r) => r.email).length;
    if (recipientStats) {
      recipientStats.textContent =
        total > 0 ? " · 발송 대상 " + active + "명 / 전체 " + total + "명" : "";
    }
  }

  async function loadRecipientsEditor() {
    try {
      const res = await fetch("/api/mail/recipients/manage");
      const data = await res.json();
      recipientRows = (data.recipients || []).map((r) => ({
        email: r.email || "",
        name: r.name || "",
        active: !!r.active,
        note: r.note || "",
        group: canonicalGroupName(r.group || ""),
      }));
      if (!recipientRows.length) {
        recipientRows.push({
          email: "",
          name: "",
          active: true,
          note: "",
          group: "",
        });
      }
      customGroupNames = loadCustomGroups();
      recipientGroupSummary = data.groups || [];
      sanitizeCustomGroups();
      recipientGroupNames = mergeGroupCatalog().map((g) => g.name);
      const emptyNames = data.empty_names ?? 0;
      if (recipientNameWarn) {
        recipientNameWarn.hidden = !(emptyNames > 20);
      }
      if (recipientSearch) recipientSearch.value = "";
      renderGroupTabs();
      renderRecipientTable();
      if (recipientStats) {
        recipientStats.textContent =
          data.total > 0
            ? " · 발송 대상 " + data.active + "명 / 전체 " + data.total + "명"
            : "";
      }
    } catch (err) {
      showAlert("수신자 목록을 불러오지 못했습니다.", "error");
    }
  }

  async function saveRecipients() {
    const rows = collectRecipientRows();
    if (!rows.length) {
      showAlert("저장할 이메일이 없습니다.", "error");
      return;
    }
    const filter = recipientGroupFilter.value;
    const searchQ = (recipientSearch?.value || "").trim();
    if (filter || searchQ) {
      const visible = recipientTableBody.querySelectorAll("tr").length;
      if (visible < rows.length) {
        const ok = window.confirm(
          "지금은 " +
            (filter ? "그룹 「" + filter + "」" : "") +
            (filter && searchQ ? " · " : "") +
            (searchQ ? "검색 필터" : "") +
            "가 적용된 상태입니다.\n\n" +
            "저장하면 전체 " +
            rows.length +
            "명이 서버에 기록됩니다 (화면에 보이는 " +
            visible +
            "행만이 아닙니다).\n\n" +
            "계속 저장할까요?"
        );
        if (!ok) return;
      }
    }
    saveRecipientBtns().forEach((btn) => {
      btn.disabled = true;
    });
    try {
      const res = await fetch("/api/mail/recipients/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: rows }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showAlert(data.detail || "저장 실패", "error");
        return;
      }
      showAlert(
        "저장 완료 · 발송 대상 " + data.active + "명 (전체 " + data.total + "명)",
        "success"
      );
      mailGroupChips.innerHTML = "";
      await loadRecipientsEditor();
      await loadMailStatus();
      onGroupFieldSettled();
    } catch (err) {
      showAlert("저장 오류: " + err.message, "error");
    } finally {
      saveRecipientBtns().forEach((btn) => {
        btn.disabled = false;
      });
    }
  }

  async function saveRecipientsAuto(
    rows,
    { successMessage, skipFilterConfirm } = {}
  ) {
    if (!rows || !rows.length) {
      showAlert("저장할 이메일이 없습니다.", "error");
      return false;
    }
    if (!skipFilterConfirm) {
      const filter = recipientGroupFilter.value;
      const searchQ = (recipientSearch?.value || "").trim();
      if (filter || searchQ) {
        const visible = recipientTableBody.querySelectorAll("tr").length;
        if (visible < rows.length) {
          const ok = window.confirm(
            "지금은 " +
              (filter ? "그룹 「" + filter + "」" : "") +
              (filter && searchQ ? " · " : "") +
              (searchQ ? "검색 필터" : "") +
              "가 적용된 상태입니다.\n\n" +
              "저장하면 전체 " +
              rows.length +
              "명이 서버에 기록됩니다 (화면에 보이는 " +
              visible +
              "행만이 아닙니다).\n\n" +
              "계속 저장할까요?"
          );
          if (!ok) return false;
        }
      }
    }

    saveRecipientBtns().forEach((btn) => {
      btn.disabled = true;
    });
    btnAddRecipient.disabled = true;
    try {
      const res = await fetch("/api/mail/recipients/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: rows }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showAlert(data.detail || "저장 실패", "error");
        return false;
      }
      showAlert(
        successMessage ||
          "저장 완료 · 발송 대상 " + data.active + "명 (전체 " + data.total + "명)",
        "success"
      );
      mailGroupChips.innerHTML = "";
      await loadRecipientsEditor();
      await loadMailStatus();
      onGroupFieldSettled();
      return true;
    } catch (err) {
      showAlert("저장 오류: " + err.message, "error");
      return false;
    } finally {
      btnAddRecipient.disabled = false;
      saveRecipientBtns().forEach((btn) => {
        btn.disabled = false;
      });
    }
  }

  async function importCsvFile() {
    const file = recipientCsvFile.files && recipientCsvFile.files[0];
    if (!file) {
      showAlert("CSV 파일을 선택하세요.", "error");
      return;
    }
    btnImportCsv.disabled = true;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("merge", recipientCsvMerge.checked ? "true" : "false");
    try {
      const res = await fetch("/api/mail/recipients/import-csv", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showAlert(
          typeof data.detail === "string" ? data.detail : "CSV 가져오기 실패",
          "error"
        );
        return;
      }
      let msg =
        "CSV 반영 · " +
        data.active +
        "명 (전체 " +
        data.total +
        "명, 인코딩: " +
        (data.encoding || "?") +
        ")";
      if (data.empty_names) {
        msg +=
          " · 이름 없음 " +
          data.empty_names +
          "명 — UTF-8 CSV로 다시 저장 후 재업로드하세요.";
      }
      showAlert(msg, data.empty_names ? "error" : "success");
      recipientCsvFile.value = "";
      mailGroupChips.innerHTML = "";
      await loadRecipientsEditor();
      await loadMailStatus();
    } catch (err) {
      showAlert("CSV 오류: " + err.message, "error");
    } finally {
      btnImportCsv.disabled = false;
    }
  }

  btnImportCsv.addEventListener("click", importCsvFile);

  function onAddGroupClick() {
    if (addCustomGroup(newGroupName?.value)) {
      if (newGroupName) newGroupName.value = "";
      showAlert("그룹이 추가되었습니다. 수신자 행에 같은 이름을 넣고 저장하세요.", "success");
    }
  }

  if (btnAddGroup) btnAddGroup.addEventListener("click", onAddGroupClick);
  if (newGroupName) {
    newGroupName.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onAddGroupClick();
      }
    });
  }

  if (recipientSearch) {
    recipientSearch.addEventListener("input", renderRecipientTable);
    recipientSearch.addEventListener("search", renderRecipientTable);
  }

  btnAddRecipient.addEventListener("click", () => {
    recipientRows.push({
      email: "",
      name: "",
      active: true,
      note: "",
      group: recipientGroupFilter.value || newGroupName?.value?.trim() || "",
    });
    renderRecipientTable();
    const inputs = recipientTableBody.querySelectorAll('[data-f="email"]');
    inputs[inputs.length - 1]?.focus();
  });
  saveRecipientBtns().forEach((btn) => {
    btn.addEventListener("click", saveRecipients);
  });

  const btnAddRecipientBottom = $("btnAddRecipientBottom");
  if (btnAddRecipientBottom) {
    btnAddRecipientBottom.addEventListener("click", () => {
      btnAddRecipient.click();
    });
  }

  Promise.all([loadIssueDefault(), loadMailStatus()])
    .then(() => {
      reportFeatureUse("view", "뉴스레터 접속");
    })
    .catch(() => {
      showAlert("서버 연결을 확인해 주세요.", "error");
    });
})();
