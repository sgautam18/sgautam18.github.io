
# NEET-PG Flashcards Game (GitHub-ready)

This repository contains a React flashcards game for NEET-PG practice. The app loads `public/questions.json` by default and runs a fast-paced game where 3 wrong answers end the game.

## Quick start (dev)
```bash
npm install
npm run dev
```

This project uses Vite. To build for production:
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages / Netlify / Vercel
- Push to a GitHub repository. For GitHub Pages, enable Pages from `gh-pages` or use the provided GitHub Actions workflow.
- The app reads `public/questions.json` — replace it with your consolidated dataset.

## Dataset format
Each question object in `questions.json` should have:
- `id` (number)
- `year` (number)
- `source` (string)
- `question` (string)
- `options` (array of strings)
- `answer` (string)
- `image_url` (optional string)
- `image_note` (optional string)

## Notes on copyright & provenance
- This repository contains only public-domain or user-provided sample items. When adding real NEET-PG items, keep provenance in `citation_report.csv` and avoid uploading paywalled PDFs into the repo.
