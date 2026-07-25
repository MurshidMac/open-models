# Open Models

Open Models is a React + TypeScript + Vite frontend for browsing open-weight models from the Models.dev catalog. It combines data from the two public endpoints:

- https://models.dev/api.json
- https://models.dev/models.json

The app displays a searchable, filterable list of open-weight models with provider details, release information, modality tags, and links to provider/weight resources.

## Features

- Fetches provider and model metadata from Models.dev
- Filters models by provider and free-text search
- Highlights open-weight models in a polished card layout
- Ready for deployment to GitHub Pages

## Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Deployment

The project includes GitHub Pages deployment support through GitHub Actions.

### GitHub Pages

1. Push the repository to GitHub.
2. Open Settings → Pages.
3. Choose GitHub Actions as the source.
4. The workflow in `.github/workflows/deploy-pages.yml` will build and publish the app automatically.

## Project Structure

- `src/App.tsx` – main UI and data loading
- `src/App.css` – styling for the catalog UI
- `src/lib/models.ts` – model parsing and transformation logic
- `public/404.html` – SPA fallback for static hosting
- `.github/workflows/deploy-pages.yml` – GitHub Pages deployment workflow
