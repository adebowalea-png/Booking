# Prototype Changes Summary

Branch: `lesson-management-vision-updates`

Prototype path: `Lesson mgmt - share/vision/`

Local preview:

```bash
cd "Lesson mgmt - share"
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/vision/plan-select-vision.html
```

## Main Changes

### My Lessons upcoming lesson display

- Added `Weekly` and `Single` badges to upcoming lesson rows.
- Added a `Next Cycle` section beneath the existing upcoming lesson groupings.
- Added cycle date ranges to the upcoming lesson display:
  - current cycle: `Mar 1st - 28th`
  - next cycle: `Mar 29th - April 25th`
- Added an info icon beside `Next Cycle` with a tooltip explaining that these lessons fall into the next billing cycle and depend on lesson plan renewal.
- Kept the rest of the My Lessons page structure unchanged.

Changed file:

- `Lesson mgmt - share/vision/my-lessons-vision.html`

### Scheduler booked lesson slots

- Replaced tutor avatar-only booked slots with the new time-and-tutor layout.
- Booked slots now show:
  - lesson time
  - tutor name
- Booked slots now use a white background with a green outline.
- Applied consistently across the scheduler and reschedule scheduler views.

Changed files:

- `Lesson mgmt - share/vision/schedule-vision.html`
- `Lesson mgmt - share/vision/reschedule-vision.html`
- `Lesson mgmt - share/vision/reschedule-weekly-vision.html`
- `Lesson mgmt - share/vision/duration-stepper.css`

### Reschedule/current slot microinteraction

- Removed the previous pulsing reschedule/current slot treatment.
- Replaced the disconnected edge animation with a single SVG rectangle stroke.
- The reschedule/current slot border now animates as one continuous dashed path around the full slot border.
- The reschedule/current slot now uses a full green background with white foreground text.
- The animated dashed border sits outside the slot edge and uses a `13 13` dash pattern.
- The animated border uses `stroke-dashoffset`, so the dashed line moves uniformly through the corners and edges.
- Added reduced-motion handling so the border animation stops when the user has reduced motion enabled.

Changed files:

- `Lesson mgmt - share/vision/reschedule-vision.html`
- `Lesson mgmt - share/vision/reschedule-weekly-vision.html`
- `Lesson mgmt - share/vision/duration-stepper.css`

## Verification

- Inline JavaScript syntax checks passed for the edited prototype pages.
- `git diff --check` passed.
- Local server responded successfully on the edited scheduler pages.
