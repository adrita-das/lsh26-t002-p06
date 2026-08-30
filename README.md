# Client Reporting Digest Generator
 
Solution for **LofiStack Hackathon 2026 — P06**
 
## Project information
 
- **Team:** `<404: Hope Not Found>`
- **Team ID:** `LSH26-T002`
- **Problem:** `P06 — Client Reporting Digest Generator`
- **Live application:** <https://lsh26-t002-p06.netlify.app>
- **Demo video:** Optional link, maximum three minutes
> Judges will evaluate only the exact commit SHA entered in the Final Submission Form.
 
## Solution summary
 
This application turns raw monthly client performance data (impressions, clicks, sales, spend, and other measures) into an automated reporting digest. For each client it calculates the change from the previous month, highlights the two measures that moved the most, and writes a short auto-generated summary paragraph. A batch view shows all client reports at once, with a live, user-configurable alert that flags any client whose chosen measure crosses a set threshold.
 
## Requirements
 
| Requirement | Status | Where to verify |
| --- | --- | --- |
| R1 — At least 6 clients, 5 measures, 2 months of history | Complete | Data loaded from `P06_client_digest_public.json` on page load; visible across all client cards |
| R2 — Per-client report with current numbers, change with direction, and top 2 movers | Complete | Each client card — current value, ▲/▼ percent change per measure, top 2 movers marked with ★ |
| R3 — Auto-generated summary paragraph per client | Complete | Text directly under each client's name on their card, e.g. "Khulna Motors saw Sessions dropped by 57.4%, while Conversion Rate improved by 51.7%." |
| R4 — Batch view with a settable alert level | Complete | All client cards render together on one page; the Measure / Direction / Level control at the top recalculates alerts live for every client on "Apply Alert" |
 
## How to test the application
 
1. Open the live application.
2. Observe all client report cards rendered at once (batch view) with current values, percent change, direction arrows, and top-2-mover stars.
3. In the alert control at the top, choose a measure, a direction (above/below), and a level, then click "Apply Alert".
4. Client cards whose chosen measure crosses that threshold will show a red "⚠ Alert" badge and the specific triggering detail at the bottom of the card.
### Test or sample data
 
The application loads its data directly from the bundled `P06_client_digest_public.json` file (test case `PUB-01`) — no manual data entry or upload is required. To reset the alert view to its original state, refresh the page; alert selections are not persisted between sessions.
 
## Run locally
 
### Requirements
 
- Node.js (v18 or later recommended)
- npm
- No database required
### Setup
 
```bash
git clone <PUBLIC-REPOSITORY-URL>
cd lsh26-t002-p06
npm install
npm run dev
```
 
No environment variables are required for this project — all data is loaded client-side from the bundled JSON file.
 
## Problem-solving approach
 
- **Understanding the problem:** The problem required turning static monthly metrics into a digestible report: numeric change, direction, top movers, a natural-language summary, and a configurable alert system across all clients at once.
- **Chosen solution:** A vanilla JavaScript + Tailwind CSS app built on Vite, with all data transformation handled in a small set of pure functions (`calculateChange`, `processClient`, `generateSummary`, `checkAlerts`), and rendering handled separately via string-based template functions — keeping hand-written HTML to a minimum.
- **Most important technical decision:** Ranking "top movers" by **absolute percent change** rather than raw numeric difference, so measures on very different scales (e.g. Spend in the thousands vs. CTR near single digits) can be fairly compared. Zero-value edge cases (previous value of 0) are handled explicitly to avoid divide-by-zero errors.
- **Testing:** Core logic is covered by unit tests written with Vitest (`src/lib/metrics.test.js`), covering change calculation, top-mover ranking, alert triggering in both directions, and summary generation. The UI was also manually verified in-browser against the provided test case.
## Technology used
 
- **Frontend:** HTML, Tailwind CSS, Vanilla JavaScript
- **Backend:** None — fully client-side
- **Database:** None — data sourced from a static JSON test fixture
- **Deployment:** Netlify
- **Other material tools:** Vite (build tooling), Vitest (unit testing)
See [`LICENSES.md`](LICENSES.md) for third-party materials.
 
## Team contributions
 
| Registered member | GitHub username | Major contribution | Evidence |
| --- | --- | --- | --- |
| Adrita | `adrita-das` | Core logic (change calculation, top movers, summary generation, alert system), full UI build, unit tests, deployment | `src/lib/metrics.js`, `src/lib/render.js`, `src/main.js`, `src/lib/metrics.test.js` |
| `<Rehenuma Tarin Tuhi>` | `<RehenumaOP>` | `<Contribution>` | File, feature or commit |
 
Commit count alone does not represent contribution.
 
## AI usage
 
Claude (Anthropic) was used as a coding assistant throughout development — to explain the problem statement, help design the calculation logic (change/percent/direction, top-mover ranking, alert triggering), help debug issues (missing imports, HTML wiring), assist with the Tailwind UI structure, write unit tests, and structure this README. All generated code was manually run, tested in-browser, and verified against the provided sample data (`P06_client_digest_public.json`) before being committed.
 
## Major design decisions
 
- **Decision:** Rank top movers by absolute percent change rather than raw difference — reason: keeps comparisons fair across measures of very different scale (e.g. Spend vs. CTR).
- **Decision:** No backend or database — reason: the problem's data is a static test fixture, so client-side processing was sufficient and fastest to build within the time limit.
- **Decision:** Alert configuration lives in in-memory JS state, not persisted — reason: not required by the problem statement, and persistence would have added unnecessary setup time.
## Known limitations
 
- Only the `PUB-01` test case from the provided JSON is used; the app does not currently support switching between multiple cases if the file contains more than one.
- Alert configuration resets on page refresh — it is not saved between sessions.
- Unit tests cover the core calculation logic but not the UI rendering layer directly.
## Repository records
 
- First commit after 6:00 PM includes `EVENT.md` with the event start code, as required.
- Full commit history has been preserved from initial setup through final submission.
- No passwords, API keys, access tokens, or personal data are committed anywhere in this repository.
