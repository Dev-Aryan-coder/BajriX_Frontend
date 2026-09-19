# BajriX - Multi-Seller Building Materials Marketplace (Frontend)

BajriX is a multi-seller marketplace for construction and home-building materials (cement, bricks, steel rebar, aggregates). The platform enables buyers to compare live rates and availability across multiple local sellers side by side, while empowering material yards to manage their catalogue, inventory, and pricing in real time.

---

## 🌟 Key Features

### 🛒 Buyer Experience
- **Catalogue Discovery**: Search by keyword (e.g., UltraTech, Bricks, TMT Steel), filter by category (Cement, Bricks, Steel, Aggregates), and sort by price.
- **Side-by-Side Seller Comparison**: View all verified vendors offering the same product, their unit rates (with a **Best Price** badge for the lowest rate), stock levels, and Minimum Order Quantities (MOQ).
- **Verified Seller Status**: Only approved vendors are shown to buyers to guarantee safety and authenticity.

### 🏢 Seller Experience
- **Vendor Portal**: Secure dashboard showing active and paused inventory.
- **Catalogue Management**: Add listings from existing master catalogue or register new materials with debounced autocomplete.
- **Live Inventory & Rate Control**: Update prices, stock quantities, and MOQs with optimistic locking (`version` check) to prevent concurrent overwrite conflicts.
- **Quick Status Toggle**: Deactivate ("Stop selling") or reactivate products with one click.
- **Authentication**: Session wristband token management, seller registration, login, and self-serve password recovery with security tokens.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Styling**: Modern Vanilla CSS + CSS Design System Tokens (Industrial Palette)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The app will be running at `http://localhost:5173` (or `http://localhost:5174`).

### 3. Build for Production
```bash
npm run build
```

---

## 🔗 Backend Connection

The frontend communicates with the Spring Boot REST API (`http://localhost:8080/api/v1`). Ensure the backend server is running and connected to MySQL.
