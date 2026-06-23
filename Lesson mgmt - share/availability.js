// Shared availability data — static mock, consistent regardless of day opened.
// Week 0 assumes today is Wednesday (Mon/Tue past, no slots).
// Weeks 1–3 have ~29 slots each: mid-to-high on weekdays, low on Sat, none on Sun.
// Each file defines its own RECURRING (the already-booked slot), then calls buildWeekSlots(RECURRING).

function buildWeekSlots(recurring) {
  return {
    // ── Week 0: today = Wednesday ─────────────────────────────────────────
    // The circular-shift rendering (base.html:594) means grid positions 5 & 6
    // map to col 0 (Mon) and col 1 (Tue) — same days that open week 1.
    // Mon & Tue must match week 1 exactly to avoid empty→filled jump.
    // Wed–Sat are sparser (fewer slots closer to today).
    '0': [ recurring,
      // Mon (col=0): 6 slots — matches week 1 (shown at end of week 0 grid)
      {col:0,time:'11:00'},{col:0,time:'11:30'},{col:0,time:'12:00'},
      {col:0,time:'14:00'},{col:0,time:'15:00'},{col:0,time:'16:00'},
      // Tue (col=1): 5 slots — matches week 1 (shown at end of week 0 grid)
      {col:1,time:'11:00'},{col:1,time:'11:30'},{col:1,time:'12:30'},
      {col:1,time:'14:30'},{col:1,time:'16:30'},
      // Wed (col=2): 2 slots (subset of week 1)
      {col:2,time:'12:00'},{col:2,time:'16:00'},
      // Thu (col=3): 4 slots (subset of week 1)
      {col:3,time:'11:00'},{col:3,time:'11:30'},{col:3,time:'14:00'},{col:3,time:'16:30'},
      // Fri (col=4): 4 slots (subset of week 1)
      {col:4,time:'11:00'},{col:4,time:'12:00'},{col:4,time:'14:30'},{col:4,time:'15:30'},
      // Sat (col=5): 1 slot (subset of week 1)
      {col:5,time:'11:00'},
      // Sun (col=6): 0 slots
    ],

    // ── Week 1: 29 slots ──────────────────────────────────────────────────
    '1': [ recurring,
      // Mon: 6 slots
      {col:0,time:'11:00'},{col:0,time:'11:30'},{col:0,time:'12:00'},
      {col:0,time:'14:00'},{col:0,time:'15:00'},{col:0,time:'16:00'},
      // Tue: 5 slots
      {col:1,time:'11:00'},{col:1,time:'11:30'},{col:1,time:'12:30'},
      {col:1,time:'14:30'},{col:1,time:'16:30'},
      // Wed: 5 slots
      {col:2,time:'11:30'},{col:2,time:'12:00'},{col:2,time:'14:00'},
      {col:2,time:'15:30'},{col:2,time:'16:00'},
      // Thu: 6 slots
      {col:3,time:'11:00'},{col:3,time:'11:30'},{col:3,time:'12:00'},
      {col:3,time:'14:00'},{col:3,time:'15:00'},{col:3,time:'16:30'},
      // Fri: 5 slots
      {col:4,time:'11:00'},{col:4,time:'12:00'},{col:4,time:'14:30'},
      {col:4,time:'15:30'},{col:4,time:'19:00'},
      // Sat: 2 slots
      {col:5,time:'11:00'},{col:5,time:'11:30'},
      // Sun: 0 slots
    ],

    // ── Week 2: 29 slots ──────────────────────────────────────────────────
    '2': [ recurring,
      // Mon: 5 slots
      {col:0,time:'11:00'},{col:0,time:'12:00'},{col:0,time:'14:00'},
      {col:0,time:'15:30'},{col:0,time:'16:30'},
      // Tue: 6 slots
      {col:1,time:'11:00'},{col:1,time:'11:30'},{col:1,time:'12:30'},
      {col:1,time:'14:30'},{col:1,time:'15:00'},{col:1,time:'16:00'},
      // Wed: 6 slots
      {col:2,time:'11:00'},{col:2,time:'11:30'},{col:2,time:'12:00'},
      {col:2,time:'14:00'},{col:2,time:'15:30'},{col:2,time:'16:30'},
      // Thu: 5 slots
      {col:3,time:'11:30'},{col:3,time:'12:00'},{col:3,time:'14:30'},
      {col:3,time:'15:00'},{col:3,time:'16:00'},
      // Fri: 5 slots
      {col:4,time:'11:00'},{col:4,time:'12:30'},{col:4,time:'14:00'},
      {col:4,time:'15:30'},{col:4,time:'19:00'},
      // Sat: 2 slots
      {col:5,time:'11:00'},{col:5,time:'11:30'},
      // Sun: 0 slots
    ],

    // ── Week 3: 29 slots ──────────────────────────────────────────────────
    '3': [ recurring,
      // Mon: 6 slots
      {col:0,time:'11:00'},{col:0,time:'11:30'},{col:0,time:'12:30'},
      {col:0,time:'14:00'},{col:0,time:'15:00'},{col:0,time:'16:30'},
      // Tue: 5 slots
      {col:1,time:'11:00'},{col:1,time:'12:00'},{col:1,time:'14:30'},
      {col:1,time:'15:30'},{col:1,time:'16:00'},
      // Wed: 5 slots
      {col:2,time:'11:30'},{col:2,time:'12:00'},{col:2,time:'14:00'},
      {col:2,time:'15:00'},{col:2,time:'16:00'},
      // Thu: 6 slots
      {col:3,time:'11:00'},{col:3,time:'11:30'},{col:3,time:'12:00'},
      {col:3,time:'14:30'},{col:3,time:'15:30'},{col:3,time:'16:30'},
      // Fri: 6 slots
      {col:4,time:'11:00'},{col:4,time:'12:00'},{col:4,time:'12:30'},
      {col:4,time:'14:00'},{col:4,time:'15:00'},{col:4,time:'19:00'},
      // Sat: 1 slot
      {col:5,time:'11:00'},
      // Sun: 0 slots
    ],

    // ── Week 4: 29 slots ──────────────────────────────────────────────────
    '4': [ recurring,
      // Mon: 5 slots
      {col:0,time:'11:00'},{col:0,time:'11:30'},{col:0,time:'14:00'},
      {col:0,time:'15:30'},{col:0,time:'16:00'},
      // Tue: 6 slots
      {col:1,time:'11:00'},{col:1,time:'12:00'},{col:1,time:'12:30'},
      {col:1,time:'14:30'},{col:1,time:'15:00'},{col:1,time:'16:30'},
      // Wed: 5 slots
      {col:2,time:'11:00'},{col:2,time:'11:30'},{col:2,time:'14:00'},
      {col:2,time:'15:30'},{col:2,time:'16:30'},
      // Thu: 5 slots
      {col:3,time:'11:00'},{col:3,time:'12:00'},{col:3,time:'14:00'},
      {col:3,time:'15:00'},{col:3,time:'16:00'},
      // Fri: 6 slots
      {col:4,time:'11:00'},{col:4,time:'11:30'},{col:4,time:'12:30'},
      {col:4,time:'14:30'},{col:4,time:'15:30'},{col:4,time:'19:00'},
      // Sat: 2 slots
      {col:5,time:'11:00'},{col:5,time:'11:30'},
      // Sun: 0 slots
    ]
  };
}

// ── Mock scheduled lessons (exp-04, exp-05, exp-06) ───────────────────────
// Always relative to today: 4-plan = next Mon + Thu, 8-plan = 4 weekly Mondays
var MOCK_SCHEDULED = (function() {
  var _days   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var _months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var t = new Date(2026, 2, 16); t.setHours(0, 0, 0, 0); // Fixed: Monday 16 March 2026
  function fmt(d) {
    var di = d.getDay() === 0 ? 6 : d.getDay() - 1;
    return _days[di].slice(0, 3) + ', ' + d.getDate() + ' ' + _months[d.getMonth()];
  }
  // The learner's lesson is weekly, Wednesday 14:00 — its upcoming occurrences.
  var todayCol = t.getDay() === 0 ? 6 : t.getDay() - 1; // 0=Mon … 6=Sun
  var daysToWed = (2 - todayCol + 7) % 7; // next Wednesday (0 if today is Wed)
  var wed1 = new Date(t); wed1.setDate(t.getDate() + daysToWed);
  function wednesdays(n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var d = new Date(wed1); d.setDate(wed1.getDate() + i * 7);
      out.push({ day: fmt(d), time: '14:00', type: 'weekly', mins: 50 });
    }
    return out;
  }
  // 8-plan: four 25-min weekly lessons (Mon–Thu, 14:00 — these slots already
  // exist in the week grids), as upcoming occurrences sorted by date.
  // cols 0–3 = Mon–Thu; `weeks` of each.
  function weekdayAfternoon(weeks) {
    var out = [];
    for (var w = 0; w < weeks; w++) {
      for (var c = 0; c < 4; c++) {
        var d = new Date(t); d.setDate(t.getDate() + c + w * 7);
        out.push({ day: fmt(d), time: '14:00', type: 'weekly', mins: 25 });
      }
    }
    return out;
  }
  return {
    4: wednesdays(4),
    8: weekdayAfternoon(4) // 4 lessons/week × 4 weeks = 16 occurrences (4 per config)
  };
}());
