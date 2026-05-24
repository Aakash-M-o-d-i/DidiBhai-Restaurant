# Didi-Bhai Restaurant - Modern Delivery & Management Suite

A premium, full-stack digital web application for **Didi-Bhai Restaurant**. Powered by a high-performance **React + Vite** single-page frontend, a resilient **Express.js API server**, and an active **MySQL/MariaDB** database engine.

---

## 🍽️ Premium Diner Experience
*   **Intuitive Home Menu:** Harmony-focused visual menu with dynamic categories, veg/non-veg tags, popularity banners, and stock indicators.
*   **Enhanced Ingredient Search:** Real-time search engine querying across dish titles, categories, descriptions, ingredients (e.g. searching "ginger" or "coriander"), and add-ons.
*   **Responsive Pill Bottom Navigation:** Smooth, fluid bottom navigation bar optimized with `:has()` focus selectors to automatically slide out of the way on virtual mobile keyboards to maximize viewport space.
*   **Stunning Customization Modal:** Immersive ingredient detail card detailing recipes, pricing calculations, custom chef comments, and add-on pricing structures.

---

## 🛡️ Administrative Console & Security Control Center
Accessible via the highly obscured secure route:
👉 **[http://localhost:5173/g/a/n/e/s/h/ganeshdidibhai](http://localhost:5173/g/a/n/e/s/h/ganeshdidibhai)**

### 🗝️ Default Permanent Credentials
*   **Username:** `PriyaGanesh`
*   **Password:** `GaneshAakash`

### 🔒 Elite Security Telemetry & Brute Force Lockout
1.  **Obscured Routing:** Administrative views and backend API routes have been completely relocated from standard conventions (`/didibhai`, `/api/auth`) to `/g/a/n/e/s/h/ganeshdidibhai` to guard against automated bots and scanners.
2.  **Brute Force Lockout:** Monitors authentication requests by client IP. If an IP triggers **8 consecutive failed password attempts**, it is permanently blacklisted in the security registry.
3.  **Security Control Center:** A live dashboard view that provides:
    *   **Blocked IP Registry:** Lists all currently locked-out IPs with individual **Unblock** actions.
    *   **Failed Attempt Trackers:** Displays active failed attempts (e.g., `4/8`) by IP before permanent lockout is hit, enabling administrators to clear logs.
    *   **Manual Administration Tools:** Form allowing explicit IP unblocking or global **Unblock All IPs** actions.

---

## 🚀 Getting Started

### 📂 Directory Architecture
*   `/src` — React frontend codebase (pages, components, utilities, visual styling assets).
*   `server.js` — Core Express REST API, CORS middleware, brute force database tracking, and menu storage handlers.
*   `server/data/` — Local runtime file caching for the authentication blacklist database state.

### 🛠️ Execution Scripts

In the `website` directory, you can run the following commands:

#### 1. Run Backend Server Only
Runs the Express API server on `http://localhost:5000`:
```bash
npm run server
```

#### 2. Run Frontend Dev Server Only
Runs the Vite single-page application dev server on `http://localhost:5173`:
```bash
npm run dev
```

#### 3. Run Both Concurrently (Recommended)
Launches the background backend server and hot-reloads the frontend:
```bash
npm run dev:full
```
