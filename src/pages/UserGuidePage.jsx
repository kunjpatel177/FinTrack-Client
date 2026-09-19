import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBookOpen,
  FaSearch,
  FaCoins,
  FaReceipt,
  FaChartPie,
  FaBullseye,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaQuestionCircle,
  FaLightbulb,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaTags,
  FaChartLine,
  FaHistory,
  FaTimes,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarCheck,
  FaLayerGroup,
} from 'react-icons/fa';

const guideSections = [
  {
    id: 'dashboard',
    category: 'dashboard',
    title: '1. Dashboard, Real-Time KPIs & Balance Reconciliation',
    icon: FaCoins,
    color: '#f59e0b',
    bgColor: '#fef3c7',
    summary: 'Master your home dashboard, real-time KPI metrics, opening balances, and bank statement reconciliations.',
    linkTo: '/dashboard',
    linkText: 'Open Dashboard',
    content: [
      {
        subtitle: 'Core Balance Mathematics',
        text: 'FinTrack computes your Net Balance using strict banking mathematics: Net Balance = Opening Starting Balance + Total Incomes - Total Expenses. Every transaction, whether an income, grocery purchase, store refund, or savings withdrawal, updates your Net Balance instantaneously.',
      },
      {
        subtitle: 'Understanding the 5 Core KPI Metric Cards',
        text: '1) Net Balance: The true liquidity currently available across all accounts. 2) Monthly Income: Total earnings logged for the active month. 3) Monthly Expenses: Total outflows for the active month (automatically offset by refunds). 4) Net Savings: Cumulative funds allocated towards your financial targets. 5) Savings Rate %: Percentage of monthly earnings retained as savings ((Income - Expenses) / Income * 100).',
      },
      {
        subtitle: 'Setting Your Opening Starting Balance',
        text: 'When first onboarding with FinTrack, establish your starting baseline. Click the "Net Balance" button or go to Settings and enter your total cumulative funds across bank accounts, investments, and physical cash. This prevents you from needing to log years of historical transactions.',
      },
      {
        subtitle: 'In-Between Bank Statement Reconciliation (Step-by-Step)',
        text: 'Down the road, if your FinTrack balance differs slightly from your official bank statement (e.g. unexpected bank fees, missed cash spending, or interest payments): 1) Click "Net Balance" -> choose "Reconcile Balance" mode. 2) Enter your actual bank statement figure (e.g., ₹54,200 instead of ₹54,000). 3) FinTrack automatically calculates the exact difference (+₹200) and creates a balancing Credit/Debit audit transaction. Your records immediately match your bank statement without guesswork.',
      },
      {
        subtitle: 'Multi-Currency Formatting',
        text: 'FinTrack seamlessly formats currency throughout all screens. Switch between INR (₹), USD ($), EUR (€), and GBP (£) anytime in Profile Settings. All metrics, charts, and transaction lists update dynamically.',
      },
    ],
    tips: [
      'Perform In-Between Reconciliation at the end of each calendar month when your official bank statement arrives.',
      'All 4 quick action buttons (Add Income, Add Expense, Create Budget, Add Goal) remain high-contrast on hover.',
    ],
  },
  {
    id: 'transactions',
    category: 'transactions',
    title: '2. Precision Transaction Logging, Truthful Refund Mechanics & CSV Export',
    icon: FaReceipt,
    color: '#2563eb',
    bgColor: '#dbeafe',
    summary: 'Learn how to record incomes, expenses, transfers, store refunds, and export tax-ready CSV records.',
    linkTo: '/transactions',
    linkText: 'Go to Transactions',
    content: [
      {
        subtitle: 'Logging Incomes, Expenses & Transfers',
        text: 'Click "+ Add Transaction" from anywhere in the app or top navigation. Select the transaction type (Income or Expense), enter the numerical amount, choose an expense category (e.g., Dining, Groceries, Rent, Salary), choose your payment method (UPI, Debit/Credit Card, Net Banking, Cash), and add optional tags or notes.',
      },
      {
        subtitle: 'The Refund Principle: Why FinTrack Protects Your Tax Records',
        text: 'In naive expense apps, a store return of ₹3,000 is logged as "Income". This is dangerous: it artificially inflates your reported gross income, distorts your tax calculations, and leaves your expense category falsely inflated. In FinTrack, check "Is Refund" when logging a returned item. FinTrack deducts ₹3,000 directly from that category\'s monthly expenses, restoring your monthly budget ceiling and keeping cash flow 100% truthful.',
      },
      {
        subtitle: 'Filtering, Keyword Search & Pagination',
        text: 'Use the real-time search bar on the Transactions page to instantly find past merchants, payees, or notes. Filter by category, transaction type, or payment method to analyze specific spending patterns.',
      },
      {
        subtitle: 'One-Click CSV Export for Spreadsheets & Tax Filing',
        text: 'Need your records for tax preparation or offline backup? Click "Export to CSV" on the Transactions page. FinTrack instantly generates a clean, structured .csv file containing Dates, Descriptions, Categories, Amounts, Types, and Payment Methods compatible with Excel, Google Sheets, and accounting software.',
      },
    ],
    tips: [
      'Always attach descriptive notes to significant purchases to make tax filing stress-free.',
      'Refunds restore remaining budget allowance for that category in real-time.',
    ],
  },
  {
    id: 'categories',
    category: 'categories',
    title: '3. Category Management & Custom Tax Buckets',
    icon: FaTags,
    color: '#0284c7',
    bgColor: '#e0f2fe',
    summary: 'Organize spending into custom categories with personalized color badges and icon identifiers.',
    linkTo: '/categories',
    linkText: 'Manage Categories',
    content: [
      {
        subtitle: 'System Categories vs. Custom Categories',
        text: 'FinTrack includes default essential categories (Salary, Freelance, Groceries, Rent, Utilities, Dining, Health, Entertainment, Transportation). You can also create unlimited custom categories tailored to your unique lifestyle (e.g. "Pet Supplies", "Crypto Investments", "Kids Tuition").',
      },
      {
        subtitle: 'Creating Custom Categories',
        text: 'Navigate to Categories, click "Add Category", enter a name, specify whether it applies to Income or Expense, and select an icon and hex color. Custom categories immediately become selectable when logging transactions and setting budgets.',
      },
      {
        subtitle: 'Safe Category Deletion',
        text: 'When deleting a custom category, FinTrack protects past historical data: previous transactions linked to the deleted category retain their records without corruption.',
      },
    ],
    tips: [
      'Keep your high-level categories under 15 for cleaner analytics donut charts.',
      'Use sub-tags in transaction notes for highly granular tracking instead of making dozens of niche categories.',
    ],
  },
  {
    id: 'budgets',
    category: 'budgets',
    title: '4. Category Budgets & Multi-Tier Overspending Alerts',
    icon: FaChartPie,
    color: '#10b981',
    bgColor: '#d1fae5',
    summary: 'Establish monthly category spending caps and prevent debt with proactive color-coded thresholds.',
    linkTo: '/budgets',
    linkText: 'Go to Budgets',
    content: [
      {
        subtitle: 'Creating Monthly Category Budgets',
        text: 'Navigate to Budgets, click "Create Budget", select an expense category (e.g. Dining), and set a maximum spending limit for the month. FinTrack automatically aggregates all expenses logged in that category for the current calendar month.',
      },
      {
        subtitle: 'The Three-Tier Color Threshold System',
        text: 'FinTrack proactively indicates spending health: 1) Safe Zone (<80%): Progress bar is Green, indicating healthy surplus. 2) Caution Warning (80% - 100%): Progress bar shifts to Amber, signaling that you are approaching your limit. 3) Overbudget Danger (>100%): Progress bar turns Red, warning you of budget breaches before overspending spirals.',
      },
      {
        subtitle: 'Real-Time Dynamic Synchronization',
        text: 'Whenever you log a new transaction, edit an existing amount, delete a transaction, or record a refund, your remaining budget recalculates immediately without requiring a browser refresh.',
      },
      {
        subtitle: 'Automatic Monthly Rollover',
        text: 'Budgets automatically reset on the 1st of each calendar month. Historical spending reports remain archived so you can compare month-over-month performance.',
      },
    ],
    tips: [
      'Prioritize budgeting discretionary categories (e.g., Dining Out, Shopping) to maximize your monthly savings.',
      'Refunds immediately free up spent budget space within the active month.',
    ],
  },
  {
    id: 'goals',
    category: 'goals',
    title: '5. Savings Goals & Real-World Banking Accounting',
    icon: FaBullseye,
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    summary: 'Save for emergency funds, vacations, or home down payments with mathematically sound banking rules.',
    linkTo: '/goals',
    linkText: 'Go to Savings Goals',
    content: [
      {
        subtitle: 'Creating a Goal with "Already Saved" Seed Balance',
        text: 'When creating a goal (e.g. "Emergency Fund - ₹100,000"), specify your target amount and target completion date. If you already have ₹30,000 saved in a bank account before using FinTrack, enter ₹30,000 in "Already Saved". FinTrack immediately credits this to your Net Savings metric without generating fake past transactions.',
      },
      {
        subtitle: 'Making Contributions',
        text: 'Click "Add Contribution" on any active goal to deposit savings towards your target. The progress bar advances towards 100% and your target countdown updates.',
      },
      {
        subtitle: 'Withdrawing from a Goal (Strict Banking Rule)',
        text: 'If an unexpected emergency requires you to pull money out of your savings goal, FinTrack enforces real-world banking logic: the withdrawn funds reduce the goal balance and are recorded as an expenditure in your cash flow. This guarantees that your Net Savings reflects true remaining funds rather than phantom wealth.',
      },
      {
        subtitle: 'Safe Cancellation & Deletion of Uncompleted Goals',
        text: 'If you cancel or delete a savings goal before reaching completion, your saved funds are NEVER lost. FinTrack automatically restores and credits the accumulated savings from that goal back into your accessible Net Balance.',
      },
    ],
    tips: [
      'Set realistic target dates so the suggested monthly contribution aligns with your net monthly cash flow.',
      'Completed goals remain accessible in your milestone history.',
    ],
  },
  {
    id: 'recurring',
    category: 'recurring',
    title: '6. Recurring Bills & Subscription Calendar Automation',
    icon: FaCalendarAlt,
    color: '#ec4899',
    bgColor: '#fce7f3',
    summary: 'Automate recurring bills (rent, utilities, Netflix, insurance) and eliminate late payment penalties.',
    linkTo: '/recurring',
    linkText: 'Go to Recurring Bills',
    content: [
      {
        subtitle: 'Setting Up Recurring Schedules',
        text: 'Navigate to Recurring Bills, click "Add Recurring Bill", enter the bill name (e.g. "Apartment Rent"), the amount, category, frequency (Daily, Weekly, Monthly, Yearly), and the next due date.',
      },
      {
        subtitle: 'Proactive Due Reminders & Badges',
        text: 'FinTrack flags upcoming bills with colored badges: "Due in 3 days", "Due Today", or "Overdue", ensuring you never forget an important payment deadline.',
      },
      {
        subtitle: 'Marking as Paid (Automated Reconciliation)',
        text: 'When you pay a bill, click "Mark as Paid". FinTrack automatically generates a matching transaction record in your ledger, debits the amount, updates the category budget, and rolls the next due date forward by the exact recurrence interval.',
      },
      {
        subtitle: 'Skipping Bill Cycles',
        text: 'If a subscription is temporarily paused or waived for a billing cycle, click "Skip". FinTrack advances the next due date to the subsequent cycle without logging an expense transaction.',
      },
    ],
    tips: [
      'Keep annual bills (like auto insurance or Amazon Prime) on Yearly recurrence so they don\'t surprise you.',
      'Check the Recurring Bills page at the start of every week to forecast cash flow demands.',
    ],
  },
  {
    id: 'household',
    category: 'household',
    title: '7. Household & Partner Collaborative Sharing',
    icon: FaUsers,
    color: '#06b6d4',
    bgColor: '#cffafe',
    summary: 'Share joint expenses with spouses, partners, or roommates while preserving personal privacy.',
    linkTo: '/household',
    linkText: 'Open Household Sharing',
    content: [
      {
        subtitle: 'The Dual-Workspace Architecture',
        text: 'FinTrack protects personal privacy while enabling collaboration. You have two distinct modes: Personal Workspace (strictly private to you; no one else can ever see these records) and Household Workspace (shared joint bills visible to all household members).',
      },
      {
        subtitle: 'Creating a Household & Inviting Members',
        text: 'Go to Household Sharing, enter a household name (e.g. "Greenwood Apartment"), and create your space. You become the Household Owner. Invite your spouse, partner, or roommate by entering their registered FinTrack email address.',
      },
      {
        subtitle: 'Accepting Invitations & Switching Workspaces',
        text: 'Invited members receive an in-app prompt to accept the invitation. Once accepted, all members can toggle between Personal and Household modes in 1 click from the Top Navigation or Household page.',
      },
      {
        subtitle: 'Resilient Household Succession',
        text: 'If the household owner deletes their personal FinTrack account, our automated succession engine transfers ownership to the next active household member, ensuring joint household financial records are never lost.',
      },
    ],
    tips: [
      'Log shared rent, groceries, and WiFi in Household Mode; log personal shopping and hobbies in Personal Mode.',
      'All household members can review joint audit trails to maintain total transparency.',
    ],
  },
  {
    id: 'reports',
    category: 'reports',
    title: '8. Visual Analytics, Financial Reports & Trend Lines',
    icon: FaChartLine,
    color: '#6366f1',
    bgColor: '#e0e7ff',
    summary: 'Analyze cash flow trends, category spending distribution donuts, and long-term net worth velocity.',
    linkTo: '/reports',
    linkText: 'View Financial Reports',
    content: [
      {
        subtitle: 'Income vs. Expense Monthly Trends',
        text: 'Visual bar charts compare your total monthly earnings against your monthly outflows over time, giving you instant visual feedback on whether your cash flow surplus is expanding or shrinking.',
      },
      {
        subtitle: 'Category Expense Distribution Donut',
        text: 'Inspect an interactive donut chart breaking down exactly where your money went across all spending categories. Hover over slices to view percentage distributions and totals.',
      },
      {
        subtitle: 'Cash Flow Velocity & Savings Rate Gauge',
        text: 'Track your savings rate percentage over time to monitor progress towards financial independence and emergency preparedness.',
      },
      {
        subtitle: 'Custom Date Filtering',
        text: 'Filter reports by Month, Quarter, Year, or custom date ranges to isolate seasonal spikes (e.g. holiday shopping or annual travel).',
      },
    ],
    tips: [
      'Review your category donut at the end of each month to identify your top 3 expenditure categories.',
      'Aim to maintain a monthly savings rate of at least 20% according to the 50/30/20 guideline.',
    ],
  },
  {
    id: 'activities',
    category: 'activities',
    title: '9. Immutable Activity Logs & Audit Trail',
    icon: FaHistory,
    color: '#64748b',
    bgColor: '#f1f5f9',
    summary: 'Inspect a tamper-evident audit history of all system events, logins, and balance adjustments.',
    linkTo: '/activities',
    linkText: 'View Activity Log',
    content: [
      {
        subtitle: 'What Gets Audited?',
        text: 'FinTrack logs all critical administrative and financial events: User Logins, Password Resets, MFA Security Toggles, Opening Balance Adjustments, In-Between Bank Reconciliations, and Profile Edits.',
      },
      {
        subtitle: 'Audit Event Metadata',
        text: 'Every log entry includes exact timestamps, event categories, descriptive actions, and device user-agent information, providing complete accountability.',
      },
      {
        subtitle: 'Security & Compliance Monitoring',
        text: 'Check the Activity Log periodically to verify that all sign-in events and balance modifications correspond to your own legitimate actions.',
      },
    ],
    tips: [
      'If you notice any unexpected login events in the Activity Log, change your password and enable Authenticator MFA immediately.',
    ],
  },
  {
    id: 'security',
    category: 'security',
    title: '10. Multi-Factor Authentication (MFA), Security & Account Management',
    icon: FaShieldAlt,
    color: '#ef4444',
    bgColor: '#fee2e2',
    summary: 'Configure Authenticator apps (TOTP), Email OTPs, eye visibility toggles, and permanent data deletion.',
    linkTo: '/profile',
    linkText: 'Manage Profile & Security',
    content: [
      {
        subtitle: 'Four Customizable MFA Choices (User Autonomy)',
        text: 'FinTrack provides full autonomy over your security tier in Profile Settings: 1) Disabled: Simple password login. 2) Authenticator App Only: TOTP 6-digit codes via Google Authenticator, Authy, or 1Password. 3) Email OTP Only: 6-digit codes sent to your registered inbox. 4) Both: Dual verification requiring both Authenticator and Email OTP for maximum banking-grade defense.',
      },
      {
        subtitle: 'Setting Up Authenticator (TOTP)',
        text: 'In Profile Settings, click "Setup Authenticator". Scan the QR code using Google Authenticator, Authy, or Microsoft Authenticator (or copy the manual secret key), enter the 6-digit verification code, and confirm. Authenticator MFA is now active.',
      },
      {
        subtitle: 'Universal Password Eye Visibility Toggles',
        text: 'Every password input in FinTrack (Login, Register, Password Change, MFA Confirmation, and Account Deletion) features an interactive Eye icon button so you can inspect your password before submission, eliminating typing mistakes.',
      },
      {
        subtitle: 'Password Resets & Email Verification',
        text: 'Verify your account using the activation link dispatched upon registration. If you ever forget your password, click "Forgot Password?" on the login screen to receive a secure 1-hour reset link.',
      },
      {
        subtitle: 'Permanent Account Deletion (Danger Zone)',
        text: 'Located at the bottom of your Profile page. To permanently delete your account, type "DELETE" in all caps and provide your current password. Cascading deletion permanently erases all transactions, budgets, recurring rules, categories, activity logs, and household memberships.',
      },
    ],
    tips: [
      'Always store your Authenticator backup key in a secure password manager.',
      'Export your transactions to CSV before using the Danger Zone account deletion.',
    ],
  },
];

const faqs = [
  {
    q: 'How does FinTrack compute my Net Balance?',
    a: 'Net Balance is calculated as: Opening Starting Balance + Total Income - Total Expenses. Goal contributions and withdrawals are accounted for in strict adherence to real-world banking rules.',
  },
  {
    q: 'What is the difference between Opening Starting Balance and In-Between Reconciliation?',
    a: 'Opening Starting Balance is the total cash and bank funds you held when you first began tracking with FinTrack. In-Between Reconciliation is used later on to realign your balance with your bank statement by automatically generating a balancing credit or debit transaction with full audit history.',
  },
  {
    q: 'How do refunds work in FinTrack, and why is it better for my taxes?',
    a: 'When you receive a refund for a returned purchase, check the "Is Refund" checkbox. FinTrack deducts that amount directly from that category\'s monthly expenses rather than treating it as new taxable income. This keeps your gross earnings accurate and restores your category budget ceiling.',
  },
  {
    q: 'Is Multi-Factor Authentication (MFA) mandatory?',
    a: 'No, MFA is completely optional. You can keep it disabled, use only an Authenticator app (Google Authenticator/Authy), use Email OTP, or require both for maximum protection.',
  },
  {
    q: 'What happens to my money if I delete an uncompleted savings goal?',
    a: 'Any funds accumulated in an uncompleted goal are automatically returned and credited back into your accessible Net Balance. No money is ever lost.',
  },
  {
    q: 'Why are savings goal withdrawals logged as expenses?',
    a: 'When you take money out of a savings goal to spend it, that money exits your locked savings reserve. Real-world banking logic dictates that an outflow from your savings pool must be recorded as an expenditure so your net savings remains truthful.',
  },
  {
    q: 'Can other household members see my private personal transactions?',
    a: 'No. Household members can only view transactions explicitly logged within the Household Workspace. Your Personal Workspace remains strictly confidential.',
  },
  {
    q: 'How can I change my currency symbol across the platform?',
    a: 'Go to Profile Settings, select your preferred Display Currency (INR ₹, USD $, EUR €, GBP £), and click "Save Profile Changes". All dashboard figures and charts update immediately.',
  },
  {
    q: 'Can I export all my transactions to Excel or Google Sheets?',
    a: 'Yes. In the Transactions page, click "Export to CSV" to immediately download your complete transaction records in standard CSV format.',
  },
  {
    q: 'How does "Mark as Paid" work for recurring bills?',
    a: 'Clicking "Mark as Paid" automatically creates an expense transaction in your ledger, debits your balance, updates the category budget, and rolls the due date forward to the next cycle.',
  },
  {
    q: 'What should I do if I pause a subscription temporarily?',
    a: 'Click the "Skip" button on that recurring bill. FinTrack advances the next due date to the subsequent billing cycle without generating an expense transaction.',
  },
  {
    q: 'What happens if the Household Owner deletes their account?',
    a: 'FinTrack includes automated succession logic. If the owner deletes their account, ownership automatically transfers to the next active household member so joint records are never lost.',
  },
];

const UserGuidePage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(0);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const categories = [
    { id: 'all', name: 'All Modules', icon: FaLayerGroup },
    { id: 'dashboard', name: 'Dashboard & Balance', icon: FaCoins },
    { id: 'transactions', name: 'Transactions & Refunds', icon: FaReceipt },
    { id: 'budgets', name: 'Budgets & Alerts', icon: FaChartPie },
    { id: 'goals', name: 'Savings Goals', icon: FaBullseye },
    { id: 'recurring', name: 'Recurring Bills', icon: FaCalendarAlt },
    { id: 'household', name: 'Household Sharing', icon: FaUsers },
    { id: 'categories', name: 'Categories', icon: FaTags },
    { id: 'reports', name: 'Reports & Analytics', icon: FaChartLine },
    { id: 'activities', name: 'Activity Log', icon: FaHistory },
    { id: 'security', name: 'MFA & Security', icon: FaShieldAlt },
  ];

  // Filter sections by search query and category
  const filteredSections = useMemo(() => {
    return guideSections.filter((section) => {
      const matchesCategory = activeCategory === 'all' || section.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = section.title.toLowerCase().includes(q);
      const matchSummary = section.summary.toLowerCase().includes(q);
      const matchContent = section.content.some(
        (c) => c.subtitle.toLowerCase().includes(q) || c.text.toLowerCase().includes(q)
      );
      const matchTips = section.tips?.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchSummary || matchContent || matchTips;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Page Header with Clean Modern Card */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary border border-primary-subtle mb-2 small fw-semibold shadow-xs">
              <FaBookOpen size={12} />
              <span>Official FinTrack Documentation & Manual</span>
            </div>
            <h1 className="fw-bold fs-3 mb-1 text-dark">User Guide & Reference Manual</h1>
            <p className="text-muted small mb-0">
              Welcome, <strong className="text-dark">{user?.name}</strong>! Master every functionality, real-world banking rule, and workflow in FinTrack.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/dashboard"
              className="btn d-flex align-items-center gap-2 py-2 px-3 rounded-pill text-white fw-semibold shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                fontSize: '14px',
                border: 'none',
              }}
            >
              <span>Go to Dashboard</span> <FaArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Command Search Bar */}
        <div className="mt-4">
          <div className="position-relative">
            <FaSearch className="position-absolute top-50 translate-middle-y text-muted ms-3" size={15} />
            <input
              type="text"
              className="form-control search-command-input w-100"
              placeholder="Search instructions, banking rules, features (e.g. 'refund', 'reconcile', 'MFA', 'withdraw', 'delete')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-3 text-muted p-0"
                title="Clear search"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="small text-muted mt-2 ps-1">
              Found <strong className="text-primary">{filteredSections.length}</strong> matching guide {filteredSections.length === 1 ? 'module' : 'modules'}
            </div>
          )}
        </div>

        {/* Category Pills with Icons */}
        <div className="d-flex flex-wrap gap-2 mt-3 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pill-filter-btn ${isActive ? 'active' : ''}`}
              >
                <CatIcon size={12} className={isActive ? 'text-white' : 'text-muted'} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cheatsheet Widget: 3 Glassy Routine Cards */}
      <div
        className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-white position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)' }}
      >
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="rounded-circle bg-white text-primary p-2 d-flex align-items-center justify-content-center shadow-xs">
            <FaLightbulb size={16} />
          </div>
          <h5 className="fw-bold mb-0 text-white">Recommended Routine & Best Practices</h5>
        </div>

        <div className="row g-3">
          {/* Daily Card */}
          <div className="col-12 col-md-4">
            <div
              className="p-3 rounded-3 h-100"
              style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCalendarDay className="text-warning" size={15} />
                <strong className="text-white small text-uppercase" style={{ letterSpacing: '0.05em' }}>Daily Habit</strong>
              </div>
              <p className="small mb-0 text-white-50 lh-sm">
                Log transactions on the fly via "+ Add Transaction". If returning an item, check "Is Refund" to deduct directly from category expenses.
              </p>
            </div>
          </div>

          {/* Weekly Card */}
          <div className="col-12 col-md-4">
            <div
              className="p-3 rounded-3 h-100"
              style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCalendarWeek className="text-info" size={15} />
                <strong className="text-white small text-uppercase" style={{ letterSpacing: '0.05em' }}>Weekly Check-in</strong>
              </div>
              <p className="small mb-0 text-white-50 lh-sm">
                Check Recurring Bills for upcoming due dates. Review Category Budgets to avoid slipping into the Amber (80%) or Red (&gt;100%) warning zones.
              </p>
            </div>
          </div>

          {/* Monthly Card */}
          <div className="col-12 col-md-4">
            <div
              className="p-3 rounded-3 h-100"
              style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCalendarCheck className="text-success" size={15} />
                <strong className="text-white small text-uppercase" style={{ letterSpacing: '0.05em' }}>Monthly Reconciliation</strong>
              </div>
              <p className="small mb-0 text-white-50 lh-sm">
                Use "In-Between Reconciliation" against your bank statement to auto-generate balancing entries and inspect Income vs Expense reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Modules List */}
      {filteredSections.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <FaInfoCircle size={36} className="text-muted mb-3 mx-auto" />
          <h5 className="fw-bold mb-1 text-dark">No matching instructions found</h5>
          <p className="text-muted small mb-3">
            We couldn't find any guide sections matching "{searchQuery}". Try searching for terms like "balance", "refund", "budget", "goal", or "MFA".
          </p>
          <div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="btn btn-outline-primary btn-sm px-3 rounded-pill"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {filteredSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                className="guide-module-card p-4"
                style={{ borderLeft: `5px solid ${section.color}` }}
              >
                {/* Module Header */}
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs"
                      style={{
                        width: '46px',
                        height: '46px',
                        backgroundColor: section.bgColor,
                        color: section.color,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h2 className="fw-bold fs-5 mb-1 text-dark">{section.title}</h2>
                      <p className="text-muted small mb-0 lh-sm">{section.summary}</p>
                    </div>
                  </div>

                  {section.linkTo && (
                    <Link
                      to={section.linkTo}
                      className="btn btn-outline-primary btn-sm px-3 py-1 fw-semibold rounded-pill d-inline-flex align-items-center gap-1 flex-shrink-0 shadow-xs"
                      style={{ fontSize: '13px' }}
                    >
                      <span>{section.linkText}</span>
                      <FaArrowRight size={11} />
                    </Link>
                  )}
                </div>

                {/* Subsections with Step Badges */}
                <div className="d-flex flex-column gap-3 mb-3">
                  {section.content.map((item, cIdx) => (
                    <div key={cIdx} className="p-3 rounded-3 bg-light-subtle border">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span
                          className="badge rounded-pill fw-semibold px-2 py-1"
                          style={{
                            fontSize: '11px',
                            backgroundColor: '#e2e8f0',
                            color: '#334155',
                          }}
                        >
                          Step {cIdx + 1}
                        </span>
                        <h4 className="fw-bold text-dark mb-0 fs-6">{item.subtitle}</h4>
                      </div>
                      <p className="text-muted small mb-0 lh-base">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Pro Tips Box */}
                {section.tips && section.tips.length > 0 && (
                  <div
                    className="p-3 rounded-3"
                    style={{ background: '#f0fdf4', borderLeft: '4px solid #10b981', border: '1px solid #dcfce7', borderLeftWidth: '4px' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2 text-success fw-bold small">
                      <FaCheckCircle size={14} /> <span>Pro Tips & Best Practices:</span>
                    </div>
                    <ul className="mb-0 ps-3 small text-muted">
                      {section.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="mb-1 lh-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive FAQ Section */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mt-4 bg-white">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2">
            <FaQuestionCircle className="text-primary" size={20} />
            <h3 className="fw-bold fs-5 mb-0 text-dark">Frequently Asked Questions</h3>
          </div>
          <span className="badge bg-light text-muted border rounded-pill px-3 py-1 small">
            {faqs.length} Answers
          </span>
        </div>
        <p className="text-muted small mb-4">
          Quick answers to the most common questions about FinTrack's banking calculations, security, and workspaces.
        </p>

        <div className="d-flex flex-column gap-2">
          {faqs.map((faq, fIdx) => (
            <div
              key={fIdx}
              className="border rounded-3 p-3 transition-all"
              style={{
                borderColor: expandedFaq === fIdx ? '#2563eb' : '#e2e8f0',
                backgroundColor: expandedFaq === fIdx ? '#f8fafc' : '#ffffff',
                boxShadow: expandedFaq === fIdx ? '0 4px 12px rgba(37, 99, 235, 0.06)' : 'none',
              }}
            >
              <button
                onClick={() => toggleFaq(fIdx)}
                className="btn btn-link text-decoration-none text-dark d-flex align-items-center justify-content-between w-100 p-0 text-start fw-semibold"
                style={{ fontSize: '15px' }}
              >
                <span>{faq.q}</span>
                {expandedFaq === fIdx ? <FaChevronUp className="text-primary" size={12} /> : <FaChevronDown className="text-muted" size={12} />}
              </button>
              {expandedFaq === fIdx && (
                <div className="mt-2 pt-2 border-top text-muted small lh-base">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Help & Navigation Banner */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mt-4 mb-5 text-center bg-white">
        <h5 className="fw-bold mb-2 text-dark">Need Further Assistance?</h5>
        <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: '600px' }}>
          Have feedback, found a banking discrepancy, or need assistance configuring Multi-Factor Authentication? Check your Profile Settings or return to your active dashboard.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/profile" className="btn btn-primary-custom btn-sm px-4 py-2 rounded-pill fw-semibold shadow-xs">
            Manage Security & Profile
          </Link>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm px-4 py-2 rounded-pill fw-semibold shadow-xs">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserGuidePage;
