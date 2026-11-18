# FitTrack Hub

FitTrack Hub is a browser-based personal fitness log. The runnable page currently checked into this repository is the root-level `index.html`, which contains its own HTML, CSS, and JavaScript.

## Features in the current page

- Dashboard, workout logging, and workout history
- Exercise and set entry for a workout, with duration, estimated calories, date, and notes
- Separate entries for food calories, sleep, and recovery
- Workout streak/calendar and progress charts
- Browser-local data persistence using `localStorage` keys with the `ft_` prefix

There is no backend or account sync in the standalone page. Data is tied to the current browser profile and can be lost if site data is cleared.

## Run the current standalone app

No package installation or build command is available for the checked-in standalone page.

1. Download or clone this repository.
2. Open `index.html` in a modern browser, or start a simple local server from the repository root:

   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000`.

The page loads Chart.js 4.4.0 from jsDelivr and the Inter font from Google Fonts, so charts and external fonts may require an internet connection. The page itself stores workout data locally in the browser.

## Repository state and architecture

| Path | What is present |
|---|---|
| `index.html` | Standalone fitness app with inline styles and application logic; this is the current runnable entry point |
| `App.jsx` | React scaffold that imports router, context, page, and stylesheet modules not present at the referenced paths in the current checkout |
| `tailwind.config.js` | Tailwind scaffold referencing `src/` and `public/` paths; it is not used by the standalone HTML page |
| `README.md` | Project documentation |

The README previously described a React/Tailwind/Recharts project with `npm` scripts and `src/config.js`. Those instructions do not match the files available on the default branch: a `package.json`, the referenced React modules, `src/config.js`, and a root `LICENSE` file were not found during this review. Do not run `npm install` or rely on the React scaffold until its missing project files and package metadata are restored.

## Screenshots

![FitTrack Hub dashboard](https://github.com/user-attachments/assets/c80784e8-dd37-46b0-a5b6-b2b24580ddd0)

![FitTrack Hub view](https://github.com/user-attachments/assets/cbcf83f2-e409-4389-9580-310d3c2ed9f5)

![FitTrack Hub view](https://github.com/user-attachments/assets/154486f8-2528-446b-97ab-f7b0ffa4b15a)

## Known limitations

- Data is stored in browser `localStorage`; there is no cloud backup or cross-device sync.
- The standalone page depends on external CDN-hosted Chart.js and Google Fonts for those resources.
- The React/Tailwind scaffold is incomplete in the checked-in tree and has no verified build or test command.
- This documentation review did not execute the page or verify its calculations.

## Planned improvements

The earlier project roadmap lists account/cloud sync, CSV/JSON export, Apple Health and Google Fit integration, a configurable rest timer, progressive-overload suggestions, workout templates, social sharing cards, and a light-mode option. These are roadmap items, not claims that the current page implements them.

## Contributing and contact

Review the current files before proposing changes. The previous instruction to run `npm test` is not actionable until a package manifest and test scripts are added. The existing contact address is [carmodbhai@gmail.com](mailto:carmodbhai@gmail.com).

No `LICENSE` file was found at the repository root during this review, so do not assume the project has a declared MIT license until the license file is restored.

---

## Maintenance & Audit

- **Audit date:** 11 November 2026
- **Documentation status:** README reviewed and audit record added on this date.
- **Scope and evidence:** Documentation-level review of the checked-in README, standalone `index.html`, `App.jsx`, and `tailwind.config.js`. This does not establish that the page runs correctly, that calculations are accurate, or that the incomplete React scaffold builds.
- **Code and tests:** No application code was changed and no browser test, build, or calculation test was performed.
- **Maintenance baseline:** Documentation status recorded through 11 November 2026; revisit setup instructions, local-storage behavior, dependencies, and the missing React project files when the repository changes.
