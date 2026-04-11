# Stock Management UI

Frontend-only Stock Management and Reseller System built with React, TypeScript, Vite, Tailwind CSS, and React Router.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The build output is generated in the dist folder.

## Vercel deployment

This project is configured for Vercel deployment, including SPA route fallback for React Router paths like /admin/history and /seller/reservations.

### Option 1: Deploy from Vercel dashboard

1. Push this repository to GitHub.
2. In Vercel, click New Project and import the repository.
3. Keep framework preset as Vite.
4. Build command: npm run build
5. Output directory: dist
6. Deploy.

### Option 2: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Notes

- The vercel.json file includes a filesystem-first fallback to index.html so direct URL refreshes work on nested client routes.
- No backend is required for this UI-only build.
