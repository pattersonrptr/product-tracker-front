# Product Tracker — Frontend

React + Vite + TypeScript frontend for the **Product Tracker** application.  
Tracks product prices over time and manages scraping configurations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build | [Vite](https://vitejs.dev/) 7 |
| UI framework | React 19 + TypeScript 5 |
| Component library | [MUI v6](https://mui.com/) (Material UI + DataGrid) |
| Routing | React Router v6 |
| HTTP client | Axios (with JWT interceptor + refresh queue) |
| Charts | [Recharts](https://recharts.org/) |
| Notifications | [Notistack](https://notistack.com/) |
| Testing | Vitest + Testing Library |
| Auth tokens | jwt-decode |

---

## Architecture

```
src/
├── api/
│   ├── client.ts          # Axios instance — JWT interceptors, token refresh queue
│   ├── endpoints.ts       # All API URL constants in one place
│   └── jsonapi.ts         # JSON:API helpers (unwrapSingle, unwrapCollection, wrapPayload)
├── services/              # One file per resource — maps API ↔ domain types
│   ├── authService.ts
│   ├── productService.ts
│   ├── priceHistoryService.ts
│   ├── searchConfigService.ts
│   └── sourceWebsiteService.ts
├── hooks/                 # Reusable React hooks built on top of services
│   ├── usePaginatedResource.ts   # Generic paginated list hook
│   └── useProductDetails.ts
├── context/
│   └── AuthContext.tsx    # Auth state, exposes useAuth()
├── components/
│   ├── common/            # Shared UI components (dialogs, modals, page header)
│   └── layout/            # App shell: AppLayout, Header, Sidebar, Footer
├── pages/                 # One file per route
│   ├── LoginPage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── SearchConfigsPage.tsx
│   └── SourceWebsitesPage.tsx
├── router/
│   └── index.tsx          # Route definitions + RequireAuth guard
├── types/                 # Shared TypeScript interfaces (barrel-exported from index.ts)
├── lib/
│   ├── logger.ts          # Structured logger (suppresses debug in production)
│   └── formatters.ts      # Date and currency formatters
└── tests/
    ├── setup.ts
    └── unit/              # Unit tests mirroring src/ structure
```

Data flow: `pages` → `hooks` → `services` → `api/client` → backend

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- The [product-tracker backend](../product-tracker) running on `http://localhost:8000`

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure the API base URL
cp .env.example .env
# Edit .env if your backend runs on a different address

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API base URL |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests and generate coverage report |

---

## Running Tests

```bash
npm test
```

Coverage report is generated in `coverage/` as HTML and LCOV.

```bash
npm run test:coverage
open coverage/index.html
```

---

## Docker

```bash
# Build the image
docker build -t product-tracker-front .

# Run (serves on port 80)
docker run -p 80:80 product-tracker-front

# Pass a custom API URL at build time
docker build --build-arg VITE_API_BASE_URL=https://api.mysite.com -t product-tracker-front .
```

---

## API Contract

All backend responses follow the [JSON:API](https://jsonapi.org/) specification:

```json
// Single resource
{ "data": { "id": "1", "type": "product", "attributes": { ... } } }

// Collection
{ "data": [ ... ], "meta": { "total": 42 } }
```

The `src/api/jsonapi.ts` helpers handle unwrapping automatically — services always return plain domain objects.
