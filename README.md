# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# MKS Finance — Customer Profile 360 (Frontend)

React + Vite frontend for the **Customer Profile 360** mini POC.

This UI provides:
- **Dashboard**: KPI + Sync Health (POC evidence)
- **Customers**: search, filter, pagination
- **Customer 360**: profile summary + tabs (credit apps, vehicles, raw JSON)

---

## Prerequisites

- Node.js **18+** (recommended LTS)
- npm **9+** (or use your preferred package manager)
- Backend API running (see backend repo)

---

## Configuration

This frontend reads the API base URL from a Vite environment variable:

- `VITE_API_BASE`

### Option A — Local development (recommended)
Create a file named `.env.local` in the project root:

```bash
VITE_API_BASE=http://localhost:8088
```

Notes:
- `VITE_API_BASE` should point to the **backend base URL**.
- Do **not** include a trailing slash.

### Option B — Same origin (reverse proxy)
If you deploy behind a reverse proxy (Nginx) and serve the frontend and backend under the same domain, you can leave `VITE_API_BASE` empty.

In that case, the frontend will call:
- `/api/v1/...` on the same host

---

## Install

```bash
npm install
```

---

## Run (Development)

```bash
npm run dev
```

By default Vite runs on:
- `http://localhost:5173`

---

## Build (Production)

```bash
npm run build
```

The output will be generated in:
- `dist/`

To preview the production build locally:

```bash
npm run preview
```

---

## API Endpoints Used

The frontend calls these endpoints (see `src/api/client.js`):

- `GET /api/v1/health`
- `GET /api/v1/customers?limit&offset&q&status&gender&segment&sort_by&order`
- `GET /api/v1/customers/:customerId/profile`
- `GET /api/v1/stats/kpi`
- `GET /api/v1/sync/health`

---

## Pages

- `src/pages/DashboardPage.jsx`
  - KPI cards (customers, credit applications, vehicle ownership)
  - Sync Health banner (status, SLA target, lag, last success/error)

- `src/pages/CustomersPage.jsx`
  - search + filters + pagination
  - table list + “View 360” action

- `src/pages/CustomerProfilePage.jsx`
  - summary cards (customer, apps, outstanding, vehicles)
  - tabs: Summary / Credit Apps / Vehicles / Raw JSON

---

## Styling

CSS is split into:
- `src/styles/main.css` (shared styles)
- `src/styles/dashboard.css`
- `src/styles/customers.css`
- `src/styles/customerProfile.css`

Entry import:
- `src/main.jsx` imports `./styles/main.css`
- each page imports its own css file

---

## Recommended Production Setup (Reverse Proxy)

For a production-like POC, use a single entry point:

- `https://your-domain/` → serves frontend (static)
- `https://your-domain/api/` → proxies to backend

Benefits:
- no CORS issues
- simpler URL management
- closer to real production deployment

---

## Troubleshooting

### 1) Blank data / API errors
- Open browser DevTools → Network tab
- Confirm `VITE_API_BASE` is correct
- Test backend directly:

```bash
curl -s http://localhost:8088/api/v1/health | jq
```

### 2) Table action button is clipped
- Ensure `src/styles/customers.css` is imported in `CustomersPage.jsx`
- Ensure the `tableWrap` container has horizontal scroll enabled (handled by `main.css`)

---

## Scripts

```bash
npm run dev      # start dev server
npm run build    # build production bundle
npm run preview  # preview production build
npm run lint     # lint (if configured)
```

---

## License

Internal POC — for demo/testing purposes.