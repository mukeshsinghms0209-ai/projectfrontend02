# 💻 TeenTracker Frontend

Modern React application built with Vite, Tailwind CSS, React Router 7, Axios, and Recharts.

---

## 🎨 UI & Features

* **Teen-Friendly Visual Design**: Modern dark theme with vibrant indigo/emerald/amber accents, glassmorphic cards, and clean typography (`Plus Jakarta Sans`).
* **Interactive Charts**:
  * Donut chart for category spending breakdown.
  * Line graph with gradient glow for daily spending tracking.
  * Bar charts for monthly history and budget vs. actual comparisons.
* **Smart Filter & Search Bar**: Debounced title & notes search, category filter, payment method filter, and sorting.
* **Goal Celebrations**: Interactive confetti bursts triggered when teenagers hit 100% on their savings targets.
* **Accessible Modals**: Keyboard `Escape` support, blur backdrops, and accessible ARIA attributes.

---

## 🚀 Running Locally

```bash
npm install
npm run dev     # Starts Vite dev server on http://localhost:5173
npm run build   # Production bundle in /dist
```

Configure `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
