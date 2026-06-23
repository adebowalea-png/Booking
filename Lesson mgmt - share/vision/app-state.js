/* ───────────────────────────────────────────────────────────────
   Shared, session-scoped app state for the Lesson Management vision.
   Holds the learner's chosen PLAN SIZE (4 or 8) and their live set of
   booked LESSONS, so cancellations / bookings / reschedules persist as
   they navigate between My Lessons, scheduling, and rescheduling.

   Stored in sessionStorage so it survives in-session navigation. A genuine
   page reload resets to the plan selector and clears this state, so
   re-entering always starts from the plan's original setup. Plan defaults
   to 4 when unset; lessons are null until a page seeds them from the plan.
   ─────────────────────────────────────────────────────────────── */
(function () {
  var PLAN_KEY = 'lm_plan';
  var LESSONS_KEY = 'lm_lessons';

  function getPlan() {
    var v = parseInt(sessionStorage.getItem(PLAN_KEY), 10);
    return (v === 4 || v === 8) ? v : 4;
  }
  // Selecting a plan is a fresh start — clear any lingering lesson state.
  function setPlan(n) {
    sessionStorage.setItem(PLAN_KEY, String(parseInt(n, 10) === 8 ? 8 : 4));
    sessionStorage.removeItem(LESSONS_KEY);
  }

  // Live booked lessons (array of { day, time, mins, type }). Returns null
  // when unseeded — the page then initialises it from the plan's mock data.
  function getLessons() {
    try {
      var raw = sessionStorage.getItem(LESSONS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  // Sort key: chronological by date then time (day format "Mon, 16 Mar").
  var MONTH_IDX = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  function lessonSortKey(l) {
    var dm = ((l.day || '').split(', ')[1] || '').split(' '); // ["16","Mar"]
    var mi = MONTH_IDX[dm[1]] != null ? MONTH_IDX[dm[1]] : 0;
    var d = parseInt(dm[0], 10) || 0;
    var tp = (l.time || '0:0').split(':');
    return (mi * 100 + d) * 10000 + ((parseInt(tp[0], 10) || 0) * 60 + (parseInt(tp[1], 10) || 0));
  }
  // Always store in chronological order, so every page renders upcoming lessons
  // in order and weekly cards in day-of-week order (no "jump to bottom" on reschedule).
  function setLessons(arr) {
    arr = (arr || []).slice().sort(function (a, b) { return lessonSortKey(a) - lessonSortKey(b); });
    try { sessionStorage.setItem(LESSONS_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  // Which weekly config the learner is rescheduling — a {day, time} pair, since
  // two configs can share a weekday. Set by the entry point, read by
  // reschedule-weekly. Transient within a session.
  var RESCHED_KEY = 'lm_resched';
  function setRescheduleTarget(day, time) {
    try { sessionStorage.setItem(RESCHED_KEY, JSON.stringify({ day: day || '', time: time || '' })); } catch (e) {}
  }
  function getRescheduleTarget() {
    try { return JSON.parse(sessionStorage.getItem(RESCHED_KEY)) || null; } catch (e) { return null; }
  }

  function clear() {
    sessionStorage.removeItem(PLAN_KEY);
    sessionStorage.removeItem(LESSONS_KEY);
    sessionStorage.removeItem(RESCHED_KEY);
  }

  // A genuine browser refresh (reload) resets to the plan selector; clicking
  // through the prototype (navigation) keeps the chosen plan + state. Browsers
  // can't tell a hard refresh from a soft one, so any reload resets.
  function redirectIfReloaded(selectorUrl) {
    try {
      var nav = (performance.getEntriesByType && performance.getEntriesByType('navigation'))[0];
      var isReload = nav ? nav.type === 'reload'
        : (performance.navigation && performance.navigation.type === 1);
      if (isReload) { clear(); window.location.replace(selectorUrl); return true; }
    } catch (e) {}
    return false;
  }

  window.AppState = {
    getPlan: getPlan, setPlan: setPlan,
    getLessons: getLessons, setLessons: setLessons,
    setRescheduleTarget: setRescheduleTarget, getRescheduleTarget: getRescheduleTarget,
    clear: clear, redirectIfReloaded: redirectIfReloaded
  };
})();
