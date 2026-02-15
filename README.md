# To Do List

A simple task manager I built using HTML, CSS, and JavaScript. No frameworks needed—just open it in your browser and start adding tasks.

## Features

- **Intro screen** — Enter your name and what you're using the list for (saved for next time).
- Add new tasks and mark them complete.
- **Filter by** All, Active, or Completed.
- **Edit in place** — Double-click a task to edit its text.
- Delete individual tasks or clear all completed at once.
- **Task stats** — See how many tasks are left; "All done!" when everything is complete.
- **Change profile** — Reset name/purpose and go back to the intro.
- Tasks (and your profile) are saved locally in the browser.

## How to Use

1. Clone or download this repo
2. Open `index.html` in your browser
3. Start adding tasks!

Type a task in the input box and hit Enter or click the Add button. Click the checkbox to mark tasks done, and use the Delete button to remove them.

## What's Inside

- `index.html` - Main structure
- `style.css` - Styling
- `script.js` - All the functionality
- `README.md` - You're reading it

## Local Storage

Tasks are saved in your browser's localStorage, so they stick around even after you close the tab. Your name and "what you're using this for" are saved too, so you can skip the intro next time. Clear your browser data and everything will reset.

---

## Changelog (recent commits)

- **feat: add intro page** — Before using the app, users enter their name and what they're using the list for. Stored in localStorage so returning users skip straight to the list.

- **style: black theme** — Full dark aesthetic: black background (`#0a0a0a`), dark cards, light text, subtle borders. Intro and main app share the same look.

- **feat: show purpose in app** — If the user entered a purpose, it appears under the title as "For: [purpose]".

- **feat: task stats** — Displays "X left" (active tasks) above the list; shows "All done!" when every task is completed.

- **feat: filter tabs** — All / Active / Completed tabs to filter the task list. Empty state message updates per filter.

- **feat: inline edit** — Double-click a task's text to edit in place. Enter saves, Escape cancels. Completed tasks are not editable.

- **feat: change profile** — "Change profile" button clears saved name and purpose and returns to the intro screen.

- **feat: smarter empty state** — Empty message uses the user's purpose when set, e.g. "No tasks for [purpose] yet. Add your first one!".

- **ux: focus and animation** — Input is focused when the app loads after the intro. New tasks get a short fade/slide-in animation.

- **a11y: aria-label on delete** — Delete button has an aria-label for screen readers.
