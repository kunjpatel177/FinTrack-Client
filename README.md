# FinTrack Web Client (`client/`)

Modern, responsive single-page application (SPA) for **FinTrack — Production-Quality Personal Finance & Wealth Platform**. Built with **React 18**, **Vite 5**, **Bootstrap 5**, and custom SaaS design tokens, this frontend provides real-time financial dashboards, interactive data visualizations, multi-currency support, and collaborative household budgeting.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | React 18.3 | Modern component architecture with hooks and Context API |
| **Build Tool & Server** | Vite 5.3 | Ultra-fast HMR dev server and optimized Rollup production bundling |
| **Routing** | React Router v6.25 | Declarative client-side routing with protected route guards |
| **HTTP Client** | Axios 1.7 | Centralized API client with JWT injection and auto-refresh interceptors |
| **Data Visualizations** | Recharts 2.12 | Responsive SVG charts (Bar, Area, Donut/Pie) for financial trends |
| **Styling & UI** | Bootstrap 5.3 + Tailwind CSS | Fluid grid system, utility classes, and custom SaaS design tokens |
| **Icons** | React Icons (`react-icons/fa`) | FontAwesome icon library for intuitive financial interfaces |
| **Notifications** | React-Toastify 10.0 | Lightweight, non-intrusive alert toasts for CRUD feedback |

---

## 📁 Directory Structure

```
client/
├── public/                 # Static assets, logos, and favicon SVG
├── src/
│   ├── components/         # Reusable UI component library
│   │   ├── budgets/        # BudgetFormModal (monthly limits & category caps)
│   │   ├── categories/     # CategoryFormModal (custom colors, icons, types)
│   │   ├── charts/         # IncomeExpenseChart, CategoryPieChart, SpendingTrendChart
│   │   ├── common/         # Navbar, Footer, StatCard, Modal, ConfirmDialog, LoadingSpinner
│   │   ├── dashboard/      # BalanceAdjustmentModal (double-entry starting balance)
│   │   ├── goals/          # GoalFormModal, ContributionModal, GoalWithdrawModal
│   │   ├── household/      # InviteMemberModal (member invites and token copying)
│   │   ├── layout/         # AppLayout, Sidebar (with collapse), TopNav
│   │   ├── recurring/      # RecurringFormModal (schedules, intervals, auto-renew)
│   │   └── transactions/   # TransactionFormModal (income/expense/refund entries)
│   ├── context/            # React Context state management
│   │   └── AuthContext.jsx # Global user session, JWT storage, currency preferences
│   ├── pages/              # Application page views
│   │   ├── ActivityLogsPage.jsx  # Audit log timeline & security events
│   │   ├── BudgetsPage.jsx       # Category budgets, burn rate progress, historical variance
│   │   ├── CategoriesPage.jsx    # System and custom category manager
│   │   ├── DashboardPage.jsx     # Executive overview, KPI stat cards, interactive charts
│   │   ├── FeaturesPage.jsx      # Marketing overview of platform capabilities & simulator
│   │   ├── ForgotPasswordPage.jsx# Email OTP password recovery request
│   │   ├── GoalsPage.jsx         # Financial savings targets & milestone celebrations
│   │   ├── HouseholdPage.jsx     # Family/roommate sharing, member roles, shared ledger
│   │   ├── LandingPage.jsx       # Enterprise landing page with interactive 50/30/20 demo
│   │   ├── LoginPage.jsx         # Credentials login with 4-tier MFA challenge modal
│   │   ├── ProfilePage.jsx       # User details, currency picker, password change, MFA setup
│   │   ├── RecurringPage.jsx     # Subscription & bill schedules with "Process Due" trigger
│   │   ├── RegisterPage.jsx      # User signup with currency selection
│   │   ├── ReportsPage.jsx       # Multi-period financial analytics & spending distribution
│   │   ├── ResetPasswordPage.jsx # Password reset completion via token
│   │   ├── TransactionsPage.jsx  # Filtered transaction ledger with CSV export
│   │   ├── UserGuidePage.jsx     # Interactive documentation, workflows, and FAQs
│   │   └── VerifyEmailPage.jsx   # Account verification via emailed token
│   ├── services/           # Backend integration services
│   │   └── api.js          # Centralized Axios instance with environment-aware baseURL
│   ├── styles/             # Application styles
│   │   └── main.css        # SaaS design tokens, theme variables, integer spacing rules
│   ├── utils/              # Formatting and helper utilities
│   │   ├── currency.js     # Multi-currency symbols and number formatters (₹, $, €, £)
│   │   └── date.js         # Standardized date formatting utilities
│   ├── App.jsx             # Route definitions and authenticated route wrapper
│   └── main.jsx            # React root mount and Toast container setup
├── .env.example            # Environment configuration template
├── .env                    # Local environment variables
├── index.html              # HTML entry point with meta tags and web fonts
├── package.json            # Frontend dependencies and npm scripts
└── vite.config.js          # Vite configuration
```

---

## ⚙️ Environment Variables

The client reads its backend API endpoint from environment variables prefixed with `VITE_`.

Create a `.env` file in the `client/` directory:

```env
# FinTrack Client Environment Variables
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api/v1
```

> **Note**: `client/src/services/api.js` automatically normalizes `VITE_API_URL`. If you provide `http://localhost:5000` or `http://localhost:5000/api/v1`, it correctly formats all API requests to the `/api/v1` router.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment
Ensure `client/.env` exists and points to your running backend server:
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Bash / Mac / Linux
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
To generate minified, production-ready static assets in the `dist/` directory:
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🔐 Authentication & Session Handling

- **JWT Storage**: Tokens are stored in `localStorage` under `fintrack_token`.
- **Request Interceptor**: Automatically attaches `Authorization: Bearer <token>` to outgoing requests.
- **Session Expiration Interceptor**: When the server returns HTTP `401 Unauthorized` (e.g. expired JWT), the client clears local storage and redirects the user cleanly to `/login?expired=true`.
- **Multi-Factor Authentication (MFA)**:
  - If a user has MFA enabled (TOTP Authenticator or Email OTP), the login endpoint returns `{ mfaRequired: true }`.
  - The client displays an inline MFA verification modal before granting access tokens.

---

## 🎨 UI Guidelines & Strict Integer Spacing

All components follow strict enterprise design principles:
- **Integer Utility Classes**: All padding, margin, and gap utility classes strictly use integer values (`p-3`, `py-4`, `gap-2`, `mb-3`) without fractional values (`gap-1.5`, `px-2.5`, etc.).
- **Typography**: Clean font hierarchy using Google Font `Outfit` for brand titles and system fonts for data tables.
- **Responsive Layouts**: Fully responsive grid optimized for mobile screens, tablets, laptops, and ultra-wide displays.
- **Multi-Currency Ready**: Instant switching between Indian Rupee (`₹ INR`), US Dollar (`$ USD`), Euro (`€ EUR`), and British Pound (`£ GBP`).
