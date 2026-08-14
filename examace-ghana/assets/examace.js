/* ===========================================================================
   ExamAce Ghana — shared behaviour
   ---------------------------------------------------------------------------
   Deliberately small and defensive. Every page renders and converts fully with
   JavaScript disabled or still downloading: the nav links exist in the drawer
   markup, both pricing tables are in the DOM, and the FAQ uses native <details>.
   Nothing here fetches anything.
   =========================================================================== */

(function () {
  "use strict";

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ------------------------------------------------------- mobile drawer -- */

  var toggle = $(".nav-toggle");
  var drawer = $(".nav-drawer");

  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      drawer.setAttribute("data-open", String(!open));
    });

    // Any tap inside the drawer that lands on a link closes it, including the
    // in-page anchors on the homepage where no navigation event fires.
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        drawer.setAttribute("data-open", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.getAttribute("data-open") === "true") {
        toggle.setAttribute("aria-expanded", "false");
        drawer.setAttribute("data-open", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------- pricing tabs --- */

  var tabs = $$("[data-plans-tab]");

  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-plans-tab");

        tabs.forEach(function (t) {
          t.setAttribute("aria-selected", String(t === tab));
        });
        $$("[data-plans-panel]").forEach(function (panel) {
          var match = panel.getAttribute("data-plans-panel") === target;
          panel.hidden = !match;
        });
      });
    });
  }

  /* ---------------------------------------------------------- reveal ------ */

  var revealables = $$(".rv");

  if (revealables.length) {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ------------------------------------------------- dashboard demo login - */
  /* Front-end prototype only. There is no account, no password check and no
     network call — the form swaps two sections so the dashboard layout can be
     reviewed. Real auth belongs on the server. See README. */

  var loginForm = $("#demo-login");
  var signOut   = $("#demo-signout");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var shell = $("#auth-shell");
      var app   = $("#dash-app");
      if (shell) { shell.hidden = true; }
      if (signOut) { signOut.hidden = false; }
      if (app) {
        app.hidden = false;
        app.setAttribute("tabindex", "-1");
        app.focus();
        window.scrollTo(0, 0);
      }
    });
  }

  if (signOut) {
    signOut.addEventListener("click", function () {
      var shell = $("#auth-shell");
      var app   = $("#dash-app");
      if (app) { app.hidden = true; }
      if (shell) { shell.hidden = false; }
      signOut.hidden = true;
      window.scrollTo(0, 0);
    });
  }

  /* ------------------------------------------------------ mock exam timer - */
  /* Illustrates the timed-simulation feel on the Mock Exam Centre card. */

  var timer = $("[data-mock-timer]");

  if (timer) {
    var remaining = parseInt(timer.getAttribute("data-mock-timer"), 10) || 2700;

    var paint = function () {
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      timer.textContent = m + ":" + (s < 10 ? "0" : "") + s;
    };

    paint();

    var started = false;
    var startTimer = function () {
      if (started) { return; }
      started = true;
      window.setInterval(function () {
        if (remaining > 0) { remaining -= 1; paint(); }
      }, 1000);
    };

    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { startTimer(); tio.disconnect(); }
      });
      tio.observe(timer);
    } else {
      startTimer();
    }
  }

  /* ------------------------------------------------------------ year ------ */

  $$("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
