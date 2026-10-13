# Stone Center open-house trivia

A host-operated, offline trivia board with the 15 questions. No build, account, phone, or internet connection is needed.

## Launch

Open `index.html` in a modern browser. Keep `index.html`, `styles.css`, `questions.js`, `app.js`, and the `assets` folder together in the same folder.

Alternatively, from this folder run `python3 -m http.server 8000`, then open `http://localhost:8000`. Stop the server with Control+C. This only serves local files; the game has no backend.

## Host controls

- Select a topic tile, or use **Surprise me** for a random unplayed question.
- Ask visitors to vote with one to four fingers (A–D), or verbally.
- Use **Reveal answer** when ready. No answer selection is required.
- Use **Back to board**, or **Next random question** after the reveal.
- Played questions stay clickable. Opening any question hides the answer again.
- Once every question is played, random selection draws from all 15. There is no game-over screen.

Use **Fullscreen** in the bottom bar when the browser supports it. The same control exits fullscreen; the browser’s Escape key may also exit it. If the control is unavailable, use your browser’s fullscreen command (on Mac, usually Control+Command+F).

## Keyboard

- **Space / Enter:** reveal when the question screen itself has focus (it receives focus when opened).
- **Escape:** return to the board; closes keyboard help first if it is open.
- **N:** open a random unplayed question from either screen.
- **Tab / Shift+Tab:** move between controls. Enter or Space activates a focused button normally; Enter follows a focused link.

The discreet **Keyboard help** control opens an accessible dialog. Fullscreen Escape behavior follows the browser’s rules.

If Safari skips buttons with Tab, use Option+Tab or enable “Press Tab to highlight each item on a webpage” in Safari’s Advanced settings.

## Edit content

All wording, options, answer mappings, explanations, researcher names, and source URLs are in `questions.js`. Each question has four options. The `correct` field is an index: **0 = A, 1 = B, 2 = C, 3 = D**. Keep each numeric `id` unique. The `category` is `center` for the seven “Stone Center” questions, or `research`. Save the file and refresh the browser to see edits.

Source links open a new tab only when clicked. They need an internet connection; the trivia experience does not. Illustrations are inline SVG, fonts are system fonts, and the supplied center logo is stored locally in `assets/stone-center-logo.png`.

## Played status

Revealing an answer marks its tile **✓ Played** and stores that status in this browser on this device. Opening a question alone does not mark it played. **Reset played questions** clears only this game’s played list and returns to the board.

Local file storage behavior varies by browser and privacy settings. If browser storage is blocked, the game shows a small notice and tracks played questions for the current session. Use the local server option for a stable browser origin if needed. File-opening and local-server modes have separate played lists, as do different browsers or server ports.

## GitHub Pages

Repository: https://github.com/Stone-CID/cid-open-house-trivia

Site: https://stone-cid.github.io/cid-open-house-trivia/

GitHub Pages serves the `main` branch from the repository root. Changes committed to `main` publish automatically. No build step or dependencies are required. Keep asset paths relative so the app works at the Pages project URL and when opened locally.

The public site stores played status only in the visitor's browser; there is no server-side data collection.

## Verification

The current 15-question version passes 489 browser checks for content, answer reveal and replay, keyboard and focus behavior, saved played status, reset, random selection, projector and mobile layouts, and local resources.

Prior to the October 13 content revisions, Safari browser checks passed for all 12 original questions, reveal/replay behavior, focus, shortcuts, random selection until exhaustion, persistence, and reset. All question and reveal layouts fit 1920×1080 and 1366×768 viewports; 375 px and 320 px layouts had no horizontal overflow. The board and longest questions/reveals were visually inspected. Opening `index.html` directly also worked with the local server stopped, including saved played status across a refresh.

Fullscreen entry and return to windowed mode were also checked in Safari. If a browser declines fullscreen, the game displays its browser-command fallback. For repeatable checks, launch the local server and open `/tests/browser-check.html`, then select **Run full checks**. That test page resets this game’s played status.
