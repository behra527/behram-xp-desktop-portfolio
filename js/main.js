(function () {
  const h = XPD.h;
  const D = XPData;
  const ICON_KEY = "mbh-icon-positions";
  const recentIds = [];
  const bootSource = (function () {
    const node = document.getElementById("boot");
    return node ? node.outerHTML : "";
  })();
  const flagNode = (function () {
    const svg = document.querySelector("#boot .xp-flag");
    return svg ? svg.cloneNode(true) : null;
  })();

  function init() {
    const os = document.getElementById("os");
    const layer = document.getElementById("windowLayer");
    const taskbar = document.getElementById("taskbarApps");
    const iconLayer = document.getElementById("iconLayer");
    const startBtn = document.getElementById("startBtn");
    const startMenu = document.getElementById("startMenu");
    const clockBtn = document.getElementById("clockBtn");
    const calendar = document.getElementById("calendarPop");
    const welcome = document.getElementById("welcome");

    XPWM.init({ os: os, layer: layer, taskbar: taskbar });
    buildIcons(iconLayer);
    buildStart(startMenu, startBtn);
    startClock(clockBtn, calendar);
    setupWelcome(welcome);
    setupGlobalKeys(startMenu, calendar, welcome);
    layoutIcons();
    window.addEventListener("resize", debounce(layoutIcons, 120));
    setupSaver();
    playBoot(welcome);

    iconLayer.addEventListener("click", function (e) {
      if (e.target === iconLayer) clearSelection();
    });
  }

  function buildIcons(layer) {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(ICON_KEY) || "{}"); } catch (e) { saved = {}; }
    D.desktopIcons.forEach(function (item) {
      const btn = h("button", {
        type: "button",
        class: "desk-icon",
        "aria-label": item.label,
        dataset: { app: item.id }
      }, [
        XPIcons.el(item.icon),
        h("span", { class: "label", text: item.label })
      ]);
      if (saved[item.id]) btn.dataset.custom = "1";
      layer.append(btn);
      bindIcon(btn);
    });
  }

  function bindIcon(btn) {
    let suppress = false;
    btn.addEventListener("click", function () {
      if (suppress) {
        suppress = false;
        return;
      }
      select(btn);
      if (XPWM.isCompact()) XPWM.open(btn.dataset.app, btn);
    });
    btn.addEventListener("dblclick", function (e) {
      e.preventDefault();
      if (!XPWM.isCompact()) XPWM.open(btn.dataset.app, btn);
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        XPWM.open(btn.dataset.app, btn);
      }
    });
    btn.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || XPWM.isCompact()) return;
      select(btn);
      const startX = e.clientX;
      const startY = e.clientY;
      const origX = btn.offsetLeft;
      const origY = btn.offsetTop;
      let moved = false;
      function move(ev) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!moved && Math.hypot(dx, dy) > 6) {
          moved = true;
          document.body.classList.add("is-dragging");
        }
        if (!moved) return;
        btn.dataset.custom = "1";
        btn.style.left = (origX + dx) + "px";
        btn.style.top = (origY + dy) + "px";
      }
      function up() {
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerup", up);
        btn.removeEventListener("pointercancel", up);
        document.body.classList.remove("is-dragging");
        if (moved) {
          suppress = true;
          clampIcon(btn);
          saveIcons();
        }
      }
      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerup", up);
      btn.addEventListener("pointercancel", up);
    });
  }

  function select(btn) {
    document.querySelectorAll(".desk-icon").forEach(function (icon) {
      icon.classList.toggle("is-selected", icon === btn);
    });
  }

  function clearSelection() {
    document.querySelectorAll(".desk-icon.is-selected").forEach(function (icon) {
      icon.classList.remove("is-selected");
    });
  }

  function layoutIcons() {
    const layer = document.getElementById("iconLayer");
    const icons = Array.prototype.slice.call(layer.querySelectorAll(".desk-icon"));
    if (XPWM.isCompact()) return;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(ICON_KEY) || "{}"); } catch (e) { saved = {}; }
    const gapX = 100;
    const gapY = 96;
    const rows = Math.max(1, Math.floor((layer.clientHeight - 12) / gapY));
    icons.forEach(function (btn, index) {
      const custom = saved[btn.dataset.app];
      if (btn.dataset.custom === "1" && custom) {
        btn.style.left = custom.x + "px";
        btn.style.top = custom.y + "px";
        clampIcon(btn);
        return;
      }
      const col = Math.floor(index / rows);
      const row = index % rows;
      btn.style.left = (10 + col * gapX) + "px";
      btn.style.top = (8 + row * gapY) + "px";
    });
  }

  function clampIcon(btn) {
    const layer = document.getElementById("iconLayer");
    const maxX = Math.max(4, layer.clientWidth - btn.offsetWidth - 4);
    const maxY = Math.max(4, layer.clientHeight - btn.offsetHeight - 4);
    const x = Math.min(Math.max(4, parseInt(btn.style.left, 10) || 4), maxX);
    const y = Math.min(Math.max(4, parseInt(btn.style.top, 10) || 4), maxY);
    btn.style.left = x + "px";
    btn.style.top = y + "px";
  }

  function saveIcons() {
    const data = {};
    document.querySelectorAll(".desk-icon").forEach(function (btn) {
      if (btn.dataset.custom === "1") {
        data[btn.dataset.app] = {
          x: parseInt(btn.style.left, 10) || 0,
          y: parseInt(btn.style.top, 10) || 0
        };
      }
    });
    try { localStorage.setItem(ICON_KEY, JSON.stringify(data)); } catch (e) { /* storage may be blocked */ }
  }

  function buildStart(menu, button) {
    const recentBox = h("div", { class: "start-recent", hidden: true });
    const programs = h("div", { class: "start-programs" });
    const places = h("div", { class: "start-places" });
    const flyout = h("div", { class: "flyout", hidden: true });
    const search = h("input", { type: "search", class: "search", placeholder: "Search this PC", "aria-label": "Search programs" });
    D.startPrograms.forEach(function (item) {
      programs.append(programButton(item));
    });
    D.allPrograms.forEach(function (item) {
      places.append(programButton(item, true));
      flyout.append(programButton(item));
    });
    const allBtn = h("button", {
      type: "button",
      class: "all-programs",
      "aria-expanded": "false",
      onclick: function () {
        const open = flyout.hidden;
        flyout.hidden = !open;
        allBtn.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }, [h("span", { text: "All Programs" })]);
    const left = h("div", { class: "start-left" }, [search, recentBox, programs, allBtn, flyout]);
    const right = h("div", { class: "start-right" }, [
      h("p", { class: "places-label", text: "Places" }),
      places
    ]);
    const photo = h("img", { src: D.profile.photo, alt: "", width: "42", height: "42" });
    photo.addEventListener("error", function () { photo.remove(); });
    menu.append(
      h("div", { class: "start-user" }, [
        photo,
        h("div", {}, [
          h("strong", { text: D.profile.name }),
          h("span", { text: "Junior Data Scientist" })
        ])
      ]),
      h("div", { class: "start-body" }, [left, right]),
      h("div", { class: "start-foot" }, [
        h("button", { type: "button", class: "start-foot-btn", text: "Run...", onclick: function () { setStart(false); showRun(); } }),
        h("button", { type: "button", class: "start-foot-btn", text: "Help and Support", onclick: function () { setStart(false); XPWM.open("help"); } }),
        h("button", { type: "button", class: "start-foot-btn is-off", text: "Turn Off Computer", onclick: function () { setStart(false); showShutdown(); } })
      ])
    );
    menu._paintRecent = paintRecent;

    search.addEventListener("input", function () {
      const q = search.value.trim().toLowerCase();
      menu.querySelectorAll(".start-item").forEach(function (item) {
        const label = item.textContent.toLowerCase();
        item.hidden = q ? label.indexOf(q) === -1 : false;
      });
    });

    button.addEventListener("click", function () {
      const willOpen = menu.hidden;
      setStart(willOpen);
      if (willOpen) {
        search.value = "";
        menu.querySelectorAll(".start-item").forEach(function (item) { item.hidden = false; });
        search.focus();
      }
    });

    document.addEventListener("pointerdown", function (e) {
      if (menu.hidden) return;
      if (menu.contains(e.target) || button.contains(e.target)) return;
      setStart(false);
    });

    function setStart(open) {
      menu.hidden = !open;
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.classList.toggle("is-open", open);
      if (!open) flyout.hidden = true;
      if (open) paintRecent();
    }
    menu._setStart = setStart;

    function paintRecent() {
      XPD.clear(recentBox);
      if (!recentIds.length) {
        recentBox.hidden = true;
        return;
      }
      recentBox.hidden = false;
      recentBox.append(h("p", { class: "places-label", text: "Recent" }));
      recentIds.forEach(function (id) {
        const item = findProgram(id);
        if (item) recentBox.append(programButton(item));
      });
    }
  }

  function programButton(item, compact) {
    return h("button", {
      type: "button",
      class: "start-item" + (compact ? " start-item-place" : ""),
      onclick: function (e) {
        const menu = document.getElementById("startMenu");
        if (menu._setStart) menu._setStart(false);
        XPWM.open(item.id, e.currentTarget);
      }
    }, [
      XPIcons.el(item.icon),
      h("span", { text: item.label })
    ]);
  }

  function startClock(button, calendar) {
    function tick() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const suffix = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const time = hours + ":" + minutes + " " + suffix;
      const date = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      button.querySelector(".clock-time").textContent = time;
      button.setAttribute("aria-label", "Current time " + time + ", " + date + ". Open calendar");
      button.title = date;
    }
    tick();
    window.setInterval(tick, 1000);
    button.addEventListener("click", function () {
      if (calendar.hidden) {
        renderCalendar(calendar, new Date());
        calendar.hidden = false;
      } else calendar.hidden = true;
    });
    document.addEventListener("pointerdown", function (e) {
      if (calendar.hidden) return;
      if (calendar.contains(e.target) || button.contains(e.target)) return;
      calendar.hidden = true;
    });
  }

  function renderCalendar(calendar, cursor) {
    XPD.clear(calendar);
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const label = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    const grid = h("div", { class: "cal-grid" });
    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(function (day) {
      grid.append(h("span", { class: "cal-dow", text: day }));
    });
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    for (let i = 0; i < first; i += 1) grid.append(h("span", { class: "cal-empty" }));
    for (let day = 1; day <= days; day += 1) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
      grid.append(h("span", { class: "cal-day" + (isToday ? " is-today" : ""), text: String(day) }));
    }
    calendar.append(
      h("div", { class: "cal-head" }, [
        h("button", { type: "button", class: "xp-btn", "aria-label": "Previous month", text: "‹", onclick: function () {
          renderCalendar(calendar, new Date(year, month - 1, 1));
        } }),
        h("strong", { text: label }),
        h("button", { type: "button", class: "xp-btn", "aria-label": "Next month", text: "›", onclick: function () {
          renderCalendar(calendar, new Date(year, month + 1, 1));
        } })
      ]),
      grid
    );
  }

  function setupWelcome(welcome) {
    const compact = XPWM.isCompact();
    welcome.append(
      h("strong", { text: "Welcome" }),
      h("p", { text: compact
        ? "Tap an icon to open Muhammad Behram Hassan's resume, projects, and certificates."
        : "Muhammad Behram Hassan, Junior Data Scientist at SoftCodec. Double-click an icon to open the resume, projects, and certificates." }),
      h("button", { type: "button", class: "xp-btn", text: "OK", onclick: function () { welcome.hidden = true; } })
    );
    welcome.hidden = true;
  }

  function showWelcome(welcome) {
    welcome.hidden = false;
    window.setTimeout(function () { welcome.hidden = true; }, 9000);
  }

  function mountBoot() {
    let boot = document.getElementById("boot");
    if (!boot && bootSource) {
      document.body.insertAdjacentHTML("afterbegin", bootSource);
      boot = document.getElementById("boot");
    }
    if (boot) boot.classList.remove("is-done");
    return boot;
  }

  function playBoot(welcome) {
    const boot = mountBoot();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!boot || reduce) {
      if (boot) boot.remove();
      showWelcome(welcome);
      return;
    }
    let closed = false;
    function finish() {
      if (closed) return;
      closed = true;
      document.removeEventListener("keydown", skip, true);
      boot.classList.add("is-done");
      window.setTimeout(function () {
        boot.remove();
        showWelcome(welcome);
        if (window.XPArmSaver) window.XPArmSaver();
      }, 480);
    }
    function skip(e) {
      if (closed) return;
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        finish();
      }
    }
    boot.addEventListener("click", finish);
    boot.addEventListener("animationend", function (e) {
      if (e.animationName === "xp-boot-life") finish();
    });
    document.addEventListener("keydown", skip, true);
    window.setTimeout(finish, 3800);
  }

  function findProgram(id) {
    const lists = [D.startPrograms, D.allPrograms];
    for (let i = 0; i < lists.length; i += 1) {
      for (let j = 0; j < lists[i].length; j += 1) {
        if (lists[i][j].id === id) return lists[i][j];
      }
    }
    return null;
  }

  function remember(id) {
    if (!findProgram(id)) return;
    const next = [id].concat(recentIds.filter(function (item) { return item !== id; })).slice(0, 3);
    recentIds.length = 0;
    next.forEach(function (item) { recentIds.push(item); });
    const menu = document.getElementById("startMenu");
    if (menu && menu._paintRecent && !menu.hidden) menu._paintRecent();
  }

  function closeShade() {
    document.querySelectorAll(".xp-shade").forEach(function (node) { node.remove(); });
  }

  function showRun() {
    const menu = document.getElementById("startMenu");
    if (menu && menu._setStart) menu._setStart(false);
    closeShade();
    const input = h("input", { type: "text", class: "search", "aria-label": "Open", placeholder: "Type a program name", "data-autofocus": "true" });
    const error = h("p", { class: "run-error" });
    const dialog = h("form", { class: "xp-run" }, [
      h("header", { class: "titlebar" }, [h("h2", { class: "window-title", text: "Run" })]),
      h("div", { class: "xp-run-body" }, [
        h("p", { text: "Type the name of a program, folder, or document, and Windows will open it for you." }),
        h("label", { class: "run-line" }, [h("span", { text: "Open:" }), input]),
        error
      ]),
      h("div", { class: "xp-run-actions" }, [
        h("button", { type: "submit", class: "xp-btn primary", text: "OK" }),
        h("button", { type: "button", class: "xp-btn", text: "Cancel", onclick: closeShade })
      ])
    ]);
    const shade = h("div", { class: "xp-shade", role: "dialog", "aria-label": "Run", dataset: { mode: "run" } }, [dialog]);
    dialog.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = input.value.trim().toLowerCase();
      const alias = {
        resume: "resume", about: "about", projects: "projects", github: "github",
        skills: "skills", certifications: "certifications", certs: "certifications",
        contact: "contact", computer: "computer", recycle: "recycle",
        terminal: "terminal", cmd: "terminal", command: "terminal",
        assistant: "assistant", help: "help", support: "help"
      };
      if (!alias[name]) {
        error.textContent = "Windows cannot find '" + input.value.trim() + "'. Make sure you typed the name correctly.";
        return;
      }
      closeShade();
      XPWM.open(alias[name]);
    });
    document.body.append(shade);
    input.focus();
  }

  function showShutdown() {
    closeShade();
    const shade = h("div", { class: "xp-shade", role: "dialog", "aria-label": "Turn off computer", dataset: { mode: "shutdown" } });
    shade.append(h("div", { class: "xp-shutdown" }, [
      h("h2", { text: "Turn off computer" }),
      h("div", { class: "xp-power-row" }, [
        powerButton("Stand By", "standby", function () { standBy(shade); }),
        powerButton("Turn Off", "off", function () { powerOff(shade); }),
        powerButton("Restart", "restart", function () { restart(); })
      ]),
      h("button", { type: "button", class: "xp-btn", text: "Cancel", onclick: closeShade })
    ]));
    document.body.append(shade);
  }

  function powerButton(label, kind, onclick) {
    return h("button", { type: "button", class: "xp-power xp-power-" + kind, onclick: onclick }, [
      h("span", { class: "xp-power-mark", "aria-hidden": "true" }),
      h("span", { text: label })
    ]);
  }

  function standBy(shade) {
    XPD.clear(shade);
    shade.dataset.mode = "standby";
    shade.append(h("div", { class: "xp-standby" }, [
      h("p", { text: "Standing by" }),
      h("p", { class: "xp-standby-hint", text: "Move the mouse or press a key to resume." })
    ]));
    function wake(e) {
      if (e.type === "keydown" && e.key === "Tab") return;
      shade.removeEventListener("pointerdown", wake);
      document.removeEventListener("keydown", wake, true);
      closeShade();
    }
    shade.addEventListener("pointerdown", wake);
    document.addEventListener("keydown", wake, true);
  }

  function powerOff(shade) {
    XPD.clear(shade);
    shade.dataset.mode = "off";
    shade.classList.add("is-black");
    shade.append(h("div", { class: "xp-off" }, [
      h("p", { text: "It is now safe to turn off your computer." }),
      h("button", { type: "button", class: "xp-btn", text: "Turn On", onclick: turnOn })
    ]));
  }

  function restart() {
    closeShade();
    const saver = document.querySelector(".xp-saver");
    if (saver) saver.hidden = true;
    playBoot(document.getElementById("welcome"));
  }

  function turnOn() {
    closeShade();
    restart();
  }

  function closeSystemDialog() {
    const shade = document.querySelector(".xp-shade");
    if (!shade) return false;
    if (shade.dataset.mode === "off") {
      turnOn();
      return true;
    }
    if (shade.dataset.mode === "standby") {
      closeShade();
      return true;
    }
    closeShade();
    return true;
  }

  function setupSaver() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saver = h("div", { class: "xp-saver", hidden: true, "aria-label": "Screen saver" });
    const logo = flagNode ? flagNode.cloneNode(true) : h("div", { class: "xp-saver-fallback", text: "Windows XP" });
    logo.classList.add("xp-saver-logo");
    saver.append(logo);
    document.body.append(saver);
    let timer = 0;
    function busy() {
      return document.getElementById("boot") || document.querySelector(".xp-shade");
    }
    function arm() {
      window.clearTimeout(timer);
      if (reduce || !saver.hidden || busy()) return;
      timer = window.setTimeout(function () {
        if (busy()) return;
        saver.hidden = false;
      }, 60000);
    }
    function wake() {
      const wasOn = !saver.hidden;
      if (wasOn) saver.hidden = true;
      arm();
    }
    ["pointerdown", "pointermove", "keydown"].forEach(function (type) {
      document.addEventListener(type, wake, true);
    });
    window.XPArmSaver = arm;
    arm();
  }

  function setupGlobalKeys(menu, calendar, welcome) {
    window.XPHooks = { opened: remember };
    document.addEventListener("keydown", function (e) {
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.key === "Meta") && key === "r") {
        e.preventDefault();
        showRun();
        return;
      }
      if (e.key === "Meta" && !e.repeat) {
        const menuOpen = !menu.hidden;
        menu._setStart(!menuOpen);
        return;
      }
      if (e.key !== "Escape") return;
      if (closeSystemDialog()) return;
      if (!welcome.hidden) {
        welcome.hidden = true;
        return;
      }
      if (!calendar.hidden) {
        calendar.hidden = true;
        return;
      }
      if (!menu.hidden) {
        menu._setStart(false);
        document.getElementById("startBtn").focus();
        return;
      }
      XPWM.closeTop();
    });
    function hideWindows() { XPWM.showDesktop(); }
    document.getElementById("showDesktop").addEventListener("click", hideWindows);
    const deskEdge = document.getElementById("showDesktopEdge");
    if (deskEdge) deskEdge.addEventListener("click", hideWindows);
    document.getElementById("quickTerminal").addEventListener("click", function (e) {
      XPWM.open("terminal", e.currentTarget);
    });
    document.getElementById("quickAssistant").addEventListener("click", function (e) {
      XPWM.open("assistant", e.currentTarget);
    });
  }

  function debounce(fn, ms) {
    let timer = 0;
    return function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(fn, ms);
    };
  }

  init();
})();
