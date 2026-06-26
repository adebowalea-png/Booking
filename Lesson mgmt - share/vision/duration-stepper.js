/* ───────────────────────────────────────────────────────────────
   Shared lesson-duration stepper + custom dropdown.

   Markup: #duration-select (native <select>, hidden — the source of
   options + selected value), #duration-value (visible label),
   .duration-step-minus / .duration-step-plus, .duration-stepper-center,
   .duration-stepper-wrap.

   −/+ step through the UNLOCKED durations (sorted ascending) and
   dispatch a native 'change' on the select, so each page's existing
   change logic still runs. Buttons disable at the unlocked ends.

   The custom dropdown lists every duration. A page can mark durations
   as locked by defining window.isDurationLocked(value) -> boolean.
   Locked rows show a lock icon + "Insufficient balance" and are not
   selectable; the current unlocked row is highlighted with a check.
   ─────────────────────────────────────────────────────────────── */
(function () {
  function init() {
    var select = document.getElementById('duration-select');
    var valueEl = document.getElementById('duration-value');
    var center = document.querySelector('.duration-stepper-center');
    var minus = document.querySelector('.duration-step-minus');
    var plus = document.querySelector('.duration-step-plus');
    var wrap = document.querySelector('.duration-stepper-wrap');
    if (!select || !valueEl || !center || !minus || !plus || !wrap) return;

    var menu = document.createElement('div');
    menu.className = 'duration-menu';
    menu.setAttribute('role', 'listbox');
    wrap.appendChild(menu);

    // ── Insufficient-balance modals (shown when a locked duration is picked) ──
    var modalHost = document.createElement('div');
    modalHost.innerHTML =
      '<div class="modal-overlay" id="ds-balance-modal">' +
        '<div class="modal-card">' +
          '<button class="ds-balance-close" id="ds-balance-close" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
          '<div class="ds-balance-avatar"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Jonathan" /></div>' +
          '<div class="ds-balance-title" id="ds-balance-title">You’ve scheduled all your lessons with Jonathan</div>' +
          '<div class="ds-balance-body" id="ds-balance-body">Impressive work! To continue your progress, add extra to your plan or cancel a lesson to free up balance</div>' +
          '<div class="ds-balance-actions">' +
            '<button class="ds-balance-primary" id="ds-balance-add">Add lessons</button>' +
            '<button class="ds-balance-secondary" id="ds-balance-single" style="display:none;">Book a single lesson instead</button>' +
            '<button class="ds-balance-secondary" id="ds-balance-free">Free up balance</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-overlay" id="ds-freeup-modal">' +
        '<div class="modal-card">' +
          '<button class="ds-balance-back" id="ds-freeup-back" aria-label="Back"><i data-lucide="arrow-left" width="20" height="20" stroke-width="2.2"></i></button>' +
          '<button class="ds-balance-close" id="ds-freeup-close" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
          '<div class="ds-freeup-icon"><i data-lucide="calendar-days" width="44" height="44" stroke-width="1.6"></i></div>' +
          '<div class="ds-balance-title">Managing your balance is easy! Just click on the lesson to cancel or reschedule</div>' +
          '<div class="ds-freeup-list">' +
            '<div class="ds-freeup-item"><i data-lucide="check" class="ds-freeup-check" width="20" height="20" stroke-width="2.4"></i><span>Cancel individual lessons to get the balance back</span></div>' +
            '<div class="ds-freeup-item"><i data-lucide="check" class="ds-freeup-check" width="20" height="20" stroke-width="2.4"></i><span>Cancel all weekly lessons to get all four lessons back</span></div>' +
            '<div class="ds-freeup-item"><i data-lucide="check" class="ds-freeup-check" width="20" height="20" stroke-width="2.4"></i><span>To schedule weekly lessons, you’ll need enough balance and a big enough plan size</span></div>' +
          '</div>' +
          '<div class="ds-balance-actions">' +
            '<button class="ds-balance-primary" id="ds-freeup-start">Get started</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-overlay" id="ds-freeup-list-modal">' +
        '<div class="modal-card">' +
          '<button class="ds-balance-back" id="ds-fb-back" aria-label="Back"><i data-lucide="arrow-left" width="20" height="20" stroke-width="2.2"></i></button>' +
          '<button class="ds-balance-close" id="ds-fb-close" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
          '<div class="ds-fb-title">Free up balance with Jonathan</div>' +
          '<div class="ds-fb-body">Cancel a booked lesson to return its balance. You can rebook it any time.</div>' +
          '<div class="ds-fb-list" id="ds-fb-list"></div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-overlay" id="ds-more-modal">' +
        '<div class="modal-card">' +
          '<button class="ds-balance-back" id="ds-more-back" aria-label="Back"><i data-lucide="arrow-left" width="20" height="20" stroke-width="2.2"></i></button>' +
          '<button class="ds-balance-close" id="ds-more-close" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
          '<div class="ds-more-chart">' +
            '<div class="ds-more-plot">' +
              '<div class="ds-more-col"><div class="ds-more-bar ds-more-bar-current"></div></div>' +
              '<div class="ds-more-col"><div class="ds-more-bar ds-more-bar-plan"><span>4</span></div></div>' +
            '</div>' +
            '<div class="ds-more-labels"><span>Current cycle</span><span>Your plan</span></div>' +
            '<div class="ds-more-renews">Your plan renews on July 1</div>' +
          '</div>' +
          '<div class="ds-more-title">How would you like to get more lessons?</div>' +
          '<div class="lf-choice-options">' +
            '<button class="lf-choice-option" id="ds-more-upgrade">' +
              '<div class="lf-choice-body"><div class="lf-choice-title">Upgrade my plan</div><div class="lf-choice-sub">Change my plan to include more lessons every billing cycle</div></div>' +
              '<i data-lucide="chevron-right" class="lf-choice-chevron" width="20" height="20" stroke-width="2.2"></i>' +
            '</button>' +
            '<button class="lf-choice-option" id="ds-more-add">' +
              '<div class="lf-choice-body"><div class="lf-choice-title">Add lessons this cycle</div><div class="lf-choice-sub">Get extra lessons for this billing cycle only</div></div>' +
              '<i data-lucide="chevron-right" class="lf-choice-chevron" width="20" height="20" stroke-width="2.2"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    while (modalHost.firstChild) document.body.appendChild(modalHost.firstChild);
    if (window.lucide) lucide.createIcons();

    var balance = document.getElementById('ds-balance-modal');
    var freeup = document.getElementById('ds-freeup-modal');
    var more = document.getElementById('ds-more-modal');
    var lastBalanceReason = 'balance';
    // The balance/upsell modal is reason-aware: a weekly blocked by plan size
    // leads with "Get more lessons" (upgrade); a balance shortfall (or any
    // single lesson) leads with "Free up balance".
    function openBalance(reason) {
      if (reason) lastBalanceReason = reason;
      reason = lastBalanceReason;
      var title = document.getElementById('ds-balance-title');
      var body = document.getElementById('ds-balance-body');
      var addBtn = document.getElementById('ds-balance-add');   // → openMore
      var freeBtn = document.getElementById('ds-balance-free'); // → openFreeup
      var singleBtn = document.getElementById('ds-balance-single'); // → single tab
      if (reason === 'plan') {
        var pc = (typeof window.getPlanContext === 'function') ? window.getPlanContext() : null;
        title.textContent = 'You’ve reached your plan size limit with Jonathan';
        if (pc && pc.groups && pc.weeklyBooked >= 1) {
          // "1 × 50 min", "2 × 25 min", or "1 × 50 min and 2 × 25 min" for mixes.
          var parts = pc.groups.map(function (g) { return g.count + ' × ' + shortLabel(g.lengthMins); });
          var booked = parts.length <= 1 ? (parts[0] || '')
            : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
          var s = pc.weeklyBooked === 1 ? '' : 's';
          body.textContent = 'You’ve already booked ' + booked + ' weekly lesson' + s +
            '. Adding more or longer weekly lessons would go over your plan — upgrade your plan or cancel an existing weekly lesson.';
        } else {
          body.textContent = 'Weekly lessons are limited by your plan size. Upgrade your plan to schedule more or longer weekly lessons.';
        }
        addBtn.textContent = 'Get more lessons';
        addBtn.className = 'ds-balance-primary'; addBtn.style.order = '1';
        if (singleBtn) {
          singleBtn.style.display = (typeof window.canBookSingleLesson === 'function' && window.canBookSingleLesson()) ? '' : 'none';
          singleBtn.style.order = '2';
        }
        freeBtn.textContent = 'Free up balance';
        freeBtn.className = 'ds-balance-secondary'; freeBtn.style.order = '3';
      } else {
        title.textContent = 'Not enough balance for this lesson';
        body.textContent = 'You don’t have enough balance free for this lesson. Free up balance by cancelling a lesson, or add extra to your plan.';
        if (singleBtn) singleBtn.style.display = 'none';
        freeBtn.textContent = 'Free up balance';
        freeBtn.className = 'ds-balance-primary'; freeBtn.style.order = '1';
        addBtn.textContent = 'Add lessons';
        addBtn.className = 'ds-balance-secondary'; addBtn.style.order = '2';
      }
      freeup.classList.remove('visible'); more.classList.remove('visible'); balance.classList.add('visible');
    }
    function closeBalance() { balance.classList.remove('visible'); }
    function openFreeup() { balance.classList.remove('visible'); freeup.classList.add('visible'); }
    function closeFreeup() { freeup.classList.remove('visible'); }
    function openMore() { balance.classList.remove('visible'); more.classList.add('visible'); }
    function closeMore() { more.classList.remove('visible'); }

    document.getElementById('ds-balance-close').addEventListener('click', closeBalance);
    document.getElementById('ds-balance-add').addEventListener('click', openMore);
    document.getElementById('ds-balance-single').addEventListener('click', function () {
      if (typeof window.canBookSingleLesson === 'function'
        && window.canBookSingleLesson()
        && typeof window.switchToSingleBooking === 'function') {
        closeBalance();
        window.switchToSingleBooking();
      }
    });
    document.getElementById('ds-balance-free').addEventListener('click', function () {
      openFreeup();
    });
    balance.addEventListener('click', function (e) { if (e.target === balance) closeBalance(); });

    document.getElementById('ds-freeup-back').addEventListener('click', openBalance);
    document.getElementById('ds-freeup-close').addEventListener('click', closeFreeup);
    document.getElementById('ds-freeup-start').addEventListener('click', openFreeupList);
    freeup.addEventListener('click', function (e) { if (e.target === freeup) closeFreeup(); });

    // ── Free up balance list (booked lessons you can cancel) ──
    var freeupList = document.getElementById('ds-freeup-list-modal');
    function freeupRowHtml(l, section, index) {
      var frees = (l.frees != null) ? l.frees : (l.mins / 50);
      var freesTxt = frees + ' lesson' + (frees === 1 ? '' : 's');
      var icon = l.type === 'weekly' ? 'repeat-2' : 'calendar';
      return '<button type="button" class="ds-fb-row" data-fb-section="' + section + '" data-fb-index="' + index + '">' +
               '<i data-lucide="' + icon + '" class="ds-fb-icon" width="24" height="24" stroke-width="1.8"></i>' +
               '<div class="ds-fb-info"><div class="ds-fb-date">' + l.label + '</div>' +
                 '<div class="ds-fb-sub">' + l.mins + ' min · frees ' + freesTxt + '</div></div>' +
               '<span class="ds-fb-action">Cancel<i data-lucide="chevron-right" class="ds-fb-chevron" width="20" height="20" stroke-width="2.2"></i></span>' +
             '</button>';
    }
    function freeupSectionHtml(title, lessons, section) {
      if (!lessons || !lessons.length) return '';
      return '<div class="ds-fb-section">' +
               '<div class="ds-fb-section-title">' + title + '</div>' +
               lessons.map(function (l, i) { return freeupRowHtml(l, section, i); }).join('') +
             '</div>';
    }
    function buildFreeupList() {
      var listEl = document.getElementById('ds-fb-list');
      var data = (typeof window.getFreeUpLessons === 'function') ? window.getFreeUpLessons() : {};
      var upcoming = data.upcoming || (Array.isArray(data) ? data : []);
      var weekly = data.weekly || [];
      // Weekly configs lead (cancelling one frees its whole balance). Individual
      // occurrences are tucked behind a collapsed "Cancel individual lessons" toggle.
      var html = freeupSectionHtml('Weekly lessons', weekly, 'weekly');
      if (upcoming.length) {
        html += '<button type="button" class="ds-fb-toggle" id="ds-fb-toggle">' +
                  '<span>Cancel individual lessons</span>' +
                  '<i data-lucide="chevron-down" class="ds-fb-toggle-chevron" width="20" height="20" stroke-width="2.2"></i>' +
                '</button>' +
                '<div class="ds-fb-individual" id="ds-fb-individual" hidden>' +
                  upcoming.map(function (l, i) { return freeupRowHtml(l, 'upcoming', i); }).join('') +
                '</div>';
      }
      listEl.innerHTML = html;
      var toggle = document.getElementById('ds-fb-toggle');
      if (toggle) toggle.addEventListener('click', function () {
        var ind = document.getElementById('ds-fb-individual');
        if (!ind) return;
        if (ind.hasAttribute('hidden')) { ind.removeAttribute('hidden'); toggle.classList.add('open'); }
        else { ind.setAttribute('hidden', ''); toggle.classList.remove('open'); }
      });
      if (window.lucide) lucide.createIcons();
    }
    function openFreeupList() { freeup.classList.remove('visible'); buildFreeupList(); freeupList.classList.add('visible'); }
    function closeFreeupList() { freeupList.classList.remove('visible'); }
    document.getElementById('ds-fb-back').addEventListener('click', function () {
      freeupList.classList.remove('visible'); freeup.classList.add('visible');
    });
    document.getElementById('ds-fb-close').addEventListener('click', closeFreeupList);
    freeupList.addEventListener('click', function (e) { if (e.target === freeupList) closeFreeupList(); });
    // Row "Cancel" → hand off to the page, which opens the cancel form and
    // removes + updates the balance on confirm.
    document.getElementById('ds-fb-list').addEventListener('click', function (e) {
      var row = e.target.closest ? e.target.closest('.ds-fb-row') : null;
      if (!row) return;
      var section = row.getAttribute('data-fb-section');
      var index = parseInt(row.getAttribute('data-fb-index'), 10);
      if (typeof window.onFreeUpRowCancel === 'function') window.onFreeUpRowCancel(section, index);
    });

    document.getElementById('ds-more-back').addEventListener('click', openBalance);
    document.getElementById('ds-more-close').addEventListener('click', closeMore);
    more.addEventListener('click', function (e) { if (e.target === more) closeMore(); });
    // Option rows are inert for now (building block).

    function isLocked(v) {
      return typeof window.isDurationLocked === 'function' && !!window.isDurationLocked(v);
    }
    function shortLabel(v) {
      v = parseInt(v, 10);
      if (isNaN(v)) return '';
      if (v < 60) return v + ' min';
      var h = Math.floor(v / 60), m = v % 60;
      return h + 'h' + (m ? ' ' + m + 'min' : '');
    }
    function options() {
      return Array.prototype.slice.call(select.options)
        .filter(function (o) { return o.value !== ''; })
        .map(function (o) { return { value: parseInt(o.value, 10), label: o.textContent }; })
        .sort(function (a, b) { return a.value - b.value; });
    }
    function unlockedValues() {
      return options().filter(function (o) { return !isLocked(o.value); })
        .map(function (o) { return o.value; });
    }

    function sync() {
      var cur = parseInt(select.value, 10);
      valueEl.textContent = shortLabel(cur);
      var u = unlockedValues();
      var idx = u.indexOf(cur);
      minus.disabled = (idx <= 0);
      plus.disabled = (idx === -1 || idx >= u.length - 1);
    }

    // Balance cost (in lessons) of a given duration, in the page's context
    // (single = mins/50; weekly multiplies). Falls back to mins/50.
    function durCost(v) {
      return (typeof window.durationCost === 'function') ? window.durationCost(v) : (v / 50);
    }
    function fmtUnits(n) { return String(Math.round(n * 100) / 100); }
    function lessonWord(n) { return n === 1 ? 'lesson' : 'lessons'; }
    function blockReasonFor(v) {
      return (typeof window.durationBlockReason === 'function') ? window.durationBlockReason(v) : 'balance';
    }
    // Description of an option's balance implication, relative to the current pick.
    function optionSub(v, cur, locked) {
      if (v === cur) return 'Current length';
      var delta = durCost(v) - durCost(cur);
      if (locked) {
        // Weekly can be blocked by plan size (only a plan upgrade helps) or by
        // balance; single lessons are always a balance story.
        return blockReasonFor(v) === 'plan'
          ? 'Needs a larger plan'
          : 'Needs ' + fmtUnits(delta) + ' lesson balance';
      }
      if (delta < 0) return 'Returns ' + fmtUnits(-delta) + ' ' + lessonWord(-delta) + ' to balance';
      if (delta > 0) return 'Uses ' + fmtUnits(delta) + ' ' + lessonWord(delta) + ' from balance';
      return 'Current length';
    }

    function buildMenu() {
      var cur = parseInt(select.value, 10);
      menu.innerHTML = options().map(function (o) {
        var locked = isLocked(o.value);
        var current = (o.value === cur && !locked);
        var cls = 'duration-opt' + (locked ? ' is-locked' : '') + (current ? ' is-current' : '');
        var right = locked
          ? '<i data-lucide="lock" class="duration-opt-icon duration-opt-lock" width="18" height="18" stroke-width="2"></i>'
          : (current ? '<i data-lucide="check" class="duration-opt-icon duration-opt-check" width="20" height="20" stroke-width="2.4"></i>' : '');
        var sub = '<div class="duration-opt-sub">' + optionSub(o.value, cur, locked) + '</div>';
        return '<button type="button" class="' + cls + '" data-value="' + o.value + '">' +
                 '<div class="duration-opt-main"><div class="duration-opt-title">' + o.label + '</div>' + sub + '</div>' +
                 right +
               '</button>';
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openMenu() { buildMenu(); menu.classList.add('open'); center.classList.add('open'); }
    function closeMenu() { menu.classList.remove('open'); center.classList.remove('open'); }

    center.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closeMenu();
    });
    menu.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.duration-opt') : null;
      if (!btn) return;
      if (btn.classList.contains('is-locked')) { closeMenu(); openBalance(blockReasonFor(parseInt(btn.getAttribute('data-value'), 10))); return; }
      var v = btn.getAttribute('data-value');
      if (parseInt(v, 10) !== parseInt(select.value, 10)) {
        select.value = v;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      closeMenu();
      sync();
    });

    function step(dir) {
      var u = unlockedValues();
      var idx = u.indexOf(parseInt(select.value, 10));
      if (idx === -1) return;
      var next = idx + dir;
      if (next < 0 || next >= u.length) return;
      select.value = String(u[next]);
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
    }
    minus.addEventListener('click', function () { step(-1); });
    plus.addEventListener('click', function () { step(1); });
    select.addEventListener('change', sync);

    // Re-sync when the option set is rebuilt (e.g. schedule tab switch).
    new MutationObserver(sync).observe(select, { childList: true });

    sync();
    window.DurationStepper = { sync: sync, openBalance: openBalance, openMore: openMore, openFreeupList: openFreeupList, closeFreeupList: closeFreeupList };
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
