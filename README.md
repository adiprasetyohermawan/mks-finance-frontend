# MKS Finance — Customer Profile 360 (Frontend)

## Bahasa Indonesia

Repo ini berisi **aplikasi Frontend (React + Vite)** untuk mini POC **MKS Finance — Customer Profile 360**.

Aplikasi ini digunakan untuk:
- **Dashboard**: menampilkan KPI dan status *Sync Health* (bukti POC).
- **Customers**: pencarian, filter, pagination, dan tombol **View 360**.
- **Customer 360**: tampilan detail nasabah (summary + tab: kredit, kendaraan, raw JSON).

### Prasyarat
- Node.js **18+** (disarankan LTS)
- npm **9+**
- Backend API sudah berjalan (lihat repo **mks-finance-backend**)

### Konfigurasi API
Frontend membaca base URL backend dari env Vite:
- `VITE_API_BASE`

#### Opsi A — Development lokal (disarankan)
Buat file `.env.local` di root project:

```bash
VITE_API_BASE=http://localhost:8088
```

Catatan:
- Arahkan ke **URL backend**.
- Jangan pakai trailing slash (`/`).

#### Opsi B — Same origin (reverse proxy)
Jika frontend dan backend disajikan dari domain yang sama lewat reverse proxy (mis. Nginx), `VITE_API_BASE` boleh dikosongkan.
Frontend akan memanggil endpoint:
- `/api/v1/...` (host yang sama)

### Cara Menjalankan (Development)

```bash
npm install
npm run dev
```

Default URL:
- `http://localhost:5173`

### Build & Preview (Production)

```bash
npm run build
npm run preview
```

Output build ada di folder:
- `dist/`

### Endpoint API yang Dipakai
Sesuai `src/api/client.js`:
- `GET /api/v1/health`
- `GET /api/v1/customers?limit&offset&q&status&gender&segment&sort_by&order`
- `GET /api/v1/customers/:customerId/profile`
- `GET /api/v1/stats/kpi`
- `GET /api/v1/sync/health`

### Struktur Kode (Ringkas)
- `src/pages/DashboardPage.jsx` — KPI + Sync Health
- `src/pages/CustomersPage.jsx` — list customer + filters + pagination
- `src/pages/CustomerProfilePage.jsx` — 360 view + tabs

### Styling
CSS dipisah per halaman:
- `src/styles/main.css` (shared)
- `src/styles/dashboard.css`
- `src/styles/customers.css`
- `src/styles/customerProfile.css`

Entry point:
- `src/main.jsx` mengimpor `./styles/main.css`
- masing-masing page mengimpor CSS-nya sendiri

### Troubleshooting
**Data kosong / error API**
1) Cek Network di DevTools browser
2) Pastikan `VITE_API_BASE` benar
3) Test backend:

```bash
curl -s http://localhost:8088/api/v1/health | jq
```

---

## English

This repository contains the **Frontend (React + Vite)** for the **MKS Finance — Customer Profile 360** mini POC.

It provides:
- **Dashboard**: KPI + Sync Health (POC evidence)
- **Customers**: search, filters, pagination, and **View 360**
- **Customer 360**: customer detail view (summary + tabs: credit apps, vehicles, raw JSON)

### Prerequisites
- Node.js **18+** (recommended LTS)
- npm **9+**
- Backend API running (see **mks-finance-backend** repo)

### API Configuration
The frontend reads the backend base URL from a Vite env variable:
- `VITE_API_BASE`

#### Option A — Local development (recommended)
Create `.env.local` in the project root:

```bash
VITE_API_BASE=http://localhost:8088
```

Notes:
- Point it to the **backend URL**.
- Do not include a trailing slash.

#### Option B — Same origin (reverse proxy)
If you deploy behind a reverse proxy (e.g., Nginx) and serve frontend + backend under the same domain, you can leave `VITE_API_BASE` empty.
The frontend will call:
- `/api/v1/...` on the same host

### Run (Development)

```bash
npm install
npm run dev
```

Default URL:
- `http://localhost:5173`

### Build & Preview (Production)

```bash
npm run build
npm run preview
```

Build output:
- `dist/`

### API Endpoints Used
From `src/api/client.js`:
- `GET /api/v1/health`
- `GET /api/v1/customers?limit&offset&q&status&gender&segment&sort_by&order`
- `GET /api/v1/customers/:customerId/profile`
- `GET /api/v1/stats/kpi`
- `GET /api/v1/sync/health`

### Code Map (Quick)
- `src/pages/DashboardPage.jsx` — KPI + Sync Health
- `src/pages/CustomersPage.jsx` — customer list + filters + pagination
- `src/pages/CustomerProfilePage.jsx` — 360 view + tabs

### Styling
CSS is split by concern:
- `src/styles/main.css` (shared)
- `src/styles/dashboard.css`
- `src/styles/customers.css`
- `src/styles/customerProfile.css`

Entry point:
- `src/main.jsx` imports `./styles/main.css`
- each page imports its own CSS file

### Troubleshooting
**Blank data / API errors**
1) Check browser DevTools → Network
2) Verify `VITE_API_BASE`
3) Test backend:

```bash
curl -s http://localhost:8088/api/v1/health | jq
```

---

## Scripts

```bash
npm run dev      # start dev server
npm run build    # build production bundle
npm run preview  # preview production build
npm run lint     # lint (if configured)
```

## License
Internal POC — for demo/testing purposes.