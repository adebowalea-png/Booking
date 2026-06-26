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
- Added an info icon beside `Next Cycle` with a tooltip explaining that these lessons fall into the next billing cycle and depend on lesson plan renewal.
- Kept the rest of the My Lessons page structure unchanged.

Changed file:

- `Lesson mgmt - share/vision/my-lessons-vision.html`

### Scheduler booked lesson slots

- Replaced tutor avatar-only booked slots with the new time-and-tutor layout.
- Booked slots now show:
  - lesson time
  - tutor name
- Booked slots use a pale green background with a green outline tied to the progress-plan green.
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
