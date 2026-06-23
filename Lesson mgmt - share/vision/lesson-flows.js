/* ───────────────────────────────────────────────────────────────
   Shared cancel / reschedule modal flows.

   Public API (call after the script has loaded):

   LessonFlows.cancel({
     date:        'Mon, 22 Jun · 11:00 – 11:50',   // "This lesson" subtitle
     weeklyText:  'Every Monday · 11:00 – 11:50',   // "All weekly lessons" subtitle
     weeklyCount: 4,                                // shown in "Cancel all weekly lessons"
     singleUrl:   'reschedule-vision.html',         // used if they pick Reschedule
     weeklyUrl:   'reschedule-weekly-vision.html',
     tutorImg:    'https://…',                      // optional avatar
     onSingle:    function(){ … },                  // confirm → cancel this lesson
     onAll:       function(){ … }                   // confirm → cancel all weekly
   });

   LessonFlows.reschedule({
     date:       '…', weeklyText: '…',
     singleUrl:  'reschedule-vision.html',
     weeklyUrl:  'reschedule-weekly-vision.html',
     tutorImg:   'https://…'
   });
   ─────────────────────────────────────────────────────────────── */
(function () {
  var DEFAULT_IMG = 'https://randomuser.me/api/portraits/men/32.jpg';

  var MODAL_HTML =
    // Stay on track interstitial
    '<div class="modal-overlay" id="lf-stay-modal">' +
      '<div class="modal-card">' +
        '<button class="lf-close" data-lf-close="lf-stay-modal" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
        '<div class="lf-stay-icon"><i data-lucide="calendar-clock" width="32" height="32" stroke-width="1.8"></i></div>' +
        '<div class="modal-title">Stay on track for real results</div>' +
        '<div class="modal-body" style="margin-top:-12px;">Learners make progress 3x faster when they stay consistent. Pick a new time to keep making progress.</div>' +
        '<div class="lf-stay-actions">' +
          '<button class="lf-btn-secondary" id="lf-stay-cancel">Cancel anyway</button>' +
          '<button class="lf-btn-primary" id="lf-stay-reschedule">Reschedule</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Cancel choice
    '<div class="modal-overlay" id="lf-cancel-choice">' +
      '<div class="modal-card">' +
        '<button class="lf-close" data-lf-close="lf-cancel-choice" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
        '<div class="tutor-avatar"><img id="lf-cancel-choice-img" src="' + DEFAULT_IMG + '" alt="Tutor" /></div>' +
        '<div class="modal-title">Which lesson would you like to cancel?</div>' +
        '<div class="lf-choice-options">' +
          '<button class="lf-choice-option" id="lf-cancel-this">' +
            '<i data-lucide="calendar" class="lf-choice-icon" width="20" height="20" stroke-width="1.8"></i>' +
            '<div class="lf-choice-body"><div class="lf-choice-title">This lesson</div><div class="lf-choice-sub" id="lf-cancel-this-date"></div></div>' +
            '<i data-lucide="chevron-right" class="lf-choice-chevron" width="20" height="20" stroke-width="2.2"></i>' +
          '</button>' +
          '<button class="lf-choice-option" id="lf-cancel-all">' +
            '<i data-lucide="repeat-2" class="lf-choice-icon" width="20" height="20" stroke-width="1.8"></i>' +
            '<div class="lf-choice-body"><div class="lf-choice-title">All weekly lessons</div><div class="lf-choice-sub" id="lf-cancel-all-date"></div></div>' +
            '<i data-lucide="chevron-right" class="lf-choice-chevron" width="20" height="20" stroke-width="2.2"></i>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Reschedule choice
    '<div class="modal-overlay" id="lf-reschedule-choice">' +
      '<div class="modal-card">' +
        '<button class="lf-close" data-lf-close="lf-reschedule-choice" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
        '<div class="tutor-avatar"><img id="lf-resched-choice-img" src="' + DEFAULT_IMG + '" alt="Tutor" /></div>' +
        '<div class="modal-title">Which lesson do you want to reschedule?</div>' +
        '<div class="lf-choice-options">' +
          '<button class="lf-choice-option" id="lf-resched-this">' +
            '<i data-lucide="calendar" class="lf-choice-icon" width="20" height="20" stroke-width="1.8"></i>' +
            '<div class="lf-choice-body"><div class="lf-choice-title">This lesson</div><div class="lf-choice-sub" id="lf-resched-this-date"></div></div>' +
            '<i data-lucide="chevron-right" class="lf-choice-chevron" width="20" height="20" stroke-width="2.2"></i>' +
          '</button>' +
          '<button class="lf-choice-option" id="lf-resched-all">' +
            '<i data-lucide="repeat-2" class="lf-choice-icon" width="20" height="20" stroke-width="1.8"></i>' +
            '<div class="lf-choice-body"><div class="lf-choice-title">All weekly lessons</div><div class="lf-choice-sub" id="lf-resched-all-date"></div></div>' +
            '<i data-lucide="chevron-right" class="lf-choice-chevron" width="20" height="20" stroke-width="2.2"></i>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Cancel form
    '<div class="modal-overlay" id="lf-cancel-modal">' +
      '<div class="modal-card">' +
        '<button class="lf-close" data-lf-close="lf-cancel-modal" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
        '<div class="tutor-avatar"><img id="lf-cancel-img" src="' + DEFAULT_IMG + '" alt="Tutor" /></div>' +
        '<div class="modal-title" id="lf-cancel-title">Cancel this lesson</div>' +
        '<div class="modal-body" id="lf-cancel-datetime" style="margin-top:-12px;font-size:14px;"></div>' +
        '<label class="lf-form-label">Please choose a reason for canceling</label>' +
        '<select id="lf-cancel-reason">' +
          '<option value="" disabled selected>Select a reason</option>' +
          '<option>I have a scheduling conflict</option>' +
          '<option>I&#39;m not feeling well</option>' +
          '<option>I need to reschedule for another time</option>' +
          '<option>Personal reasons</option>' +
          '<option>Other</option>' +
        '</select>' +
        '<label class="lf-form-label">Message to your tutor · Optional</label>' +
        '<textarea id="lf-cancel-message" placeholder="Placeholder"></textarea>' +
        '<div class="modal-actions" id="lf-cancel-actions">' +
          '<button class="lf-back" id="lf-cancel-back" type="button"><i data-lucide="chevron-left" width="18" height="18" stroke-width="2.2"></i><span>Back</span></button>' +
          '<button class="btn-cancel-lesson" id="lf-cancel-confirm">Confirm cancellation</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // "You've canceled this lesson" (cancelling the lesson being rescheduled)
    '<div class="modal-overlay" id="lf-canceled-modal">' +
      '<div class="modal-card">' +
        '<button class="lf-close" data-lf-close="lf-canceled-modal" aria-label="Close"><i data-lucide="x" width="20" height="20" stroke-width="2.2"></i></button>' +
        '<div class="lf-canceled-avatar"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Jonathan" /></div>' +
        '<div class="modal-title">You’ve canceled this lesson</div>' +
        '<div class="modal-body">Now that you’ve canceled this lesson, you can schedule a new time with Jonathan.</div>' +
        '<div class="lf-canceled-actions">' +
          '<button class="lf-btn-primary" id="lf-canceled-schedule">Schedule</button>' +
          '<button class="lf-btn-secondary" id="lf-canceled-notnow">Not now</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  var injected = false;
  var ctx = {};
  var scope = 'single';
  var canceledOpts = {};

  function $(id) { return document.getElementById(id); }
  function show(id) { $(id).classList.add('visible'); }
  function hide(id) { $(id).classList.remove('visible'); }
  function hideAll() {
    ['lf-stay-modal', 'lf-cancel-choice', 'lf-reschedule-choice', 'lf-cancel-modal', 'lf-canceled-modal'].forEach(hide);
  }

  function setImg(id) { if (ctx.tutorImg) { var el = $(id); if (el) el.src = ctx.tutorImg; } }

  function inject() {
    if (injected) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = MODAL_HTML;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    injected = true;
    wire();
    if (window.lucide) lucide.createIcons();
  }

  function openCancelChoice() {
    $('lf-cancel-this-date').textContent = ctx.date || '';
    $('lf-cancel-all-date').textContent = ctx.weeklyText || '';
    setImg('lf-cancel-choice-img');
    hideAll();
    show('lf-cancel-choice');
  }

  function openRescheduleChoice() {
    $('lf-resched-this-date').textContent = ctx.date || '';
    $('lf-resched-all-date').textContent = ctx.weeklyText || '';
    setImg('lf-resched-choice-img');
    hideAll();
    show('lf-reschedule-choice');
  }

  function openCancelForm(which) {
    scope = which;
    $('lf-cancel-reason').value = '';
    $('lf-cancel-message').value = '';
    $('lf-cancel-actions').classList.add('lf-row');
    setImg('lf-cancel-img');
    if (which === 'all') {
      $('lf-cancel-title').textContent = 'Cancel all weekly lessons';
      var count = ctx.weeklyCount != null ? (' · ' + ctx.weeklyCount + ' Lesson' + (ctx.weeklyCount === 1 ? '' : 's')) : '';
      $('lf-cancel-datetime').textContent = (ctx.weeklyText || '') + count;
    } else {
      $('lf-cancel-title').textContent = 'Cancel this lesson';
      $('lf-cancel-datetime').textContent = ctx.date || '';
    }
    hideAll();
    show('lf-cancel-modal');
  }

  function wire() {
    // Close buttons + backdrop dismiss
    document.querySelectorAll('[data-lf-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { hideAll(); });
    });
    ['lf-stay-modal', 'lf-cancel-choice', 'lf-reschedule-choice', 'lf-cancel-modal', 'lf-canceled-modal'].forEach(function (id) {
      $(id).addEventListener('click', function (e) { if (e.target === $(id)) hideAll(); });
    });

    // Stay on track. weeklyOnly skips the "which lesson?" step and goes
    // straight to all-weekly cancel / the weekly reschedule flow.
    $('lf-stay-cancel').addEventListener('click', function () {
      if (ctx.weeklyOnly) openCancelForm('all');
      else openCancelChoice();
    });
    $('lf-stay-reschedule').addEventListener('click', function () {
      if (ctx.weeklyOnly) { if (ctx.weeklyUrl) window.location.href = ctx.weeklyUrl; }
      else openRescheduleChoice();
    });

    // Cancel choice
    $('lf-cancel-this').addEventListener('click', function () { openCancelForm('single'); });
    $('lf-cancel-all').addEventListener('click', function () { openCancelForm('all'); });

    // Reschedule choice
    $('lf-resched-this').addEventListener('click', function () {
      if (ctx.singleUrl) window.location.href = ctx.singleUrl;
    });
    $('lf-resched-all').addEventListener('click', function () {
      if (ctx.weeklyUrl) window.location.href = ctx.weeklyUrl;
    });

    // Cancel form — Back returns to the choice modal, or to "Stay on track"
    // when we bypassed the choice (weeklyOnly).
    $('lf-cancel-back').addEventListener('click', function () {
      if (ctx.onBack) { hideAll(); ctx.onBack(); return; }
      if (ctx.weeklyOnly) { hideAll(); show('lf-stay-modal'); }
      else openCancelChoice();
    });
    $('lf-cancel-confirm').addEventListener('click', function () {
      hideAll();
      if (scope === 'all') { if (ctx.onAll) ctx.onAll(); }
      else { if (ctx.onSingle) ctx.onSingle(); }
    });

    // "You've canceled this lesson"
    $('lf-canceled-schedule').addEventListener('click', function () {
      window.location.href = canceledOpts.scheduleUrl || 'schedule-vision.html';
    });
    $('lf-canceled-notnow').addEventListener('click', function () {
      window.location.href = canceledOpts.myLessonsUrl || 'my-lessons-vision.html';
    });
  }

  window.LessonFlows = {
    cancel: function (opts) { inject(); ctx = opts || {}; scope = 'single'; hideAll(); show('lf-stay-modal'); },
    reschedule: function (opts) {
      inject(); ctx = opts || {};
      if (ctx.weeklyOnly) { if (ctx.weeklyUrl) window.location.href = ctx.weeklyUrl; return; }
      openRescheduleChoice();
    },
    canceledLesson: function (opts) { inject(); canceledOpts = opts || {}; hideAll(); show('lf-canceled-modal'); },
    // Open the cancel FORM directly (skipping stay/choice) — used by the
    // "Free up balance" list. opts.scope: 'single' | 'all'; opts.onBack reopens
    // the caller's list; opts.onSingle / opts.onAll run on confirm.
    cancelForm: function (opts) { inject(); ctx = opts || {}; openCancelForm(ctx.scope || 'single'); }
  };

  if (document.readyState !== 'loading') inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();
