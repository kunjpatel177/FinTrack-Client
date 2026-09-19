import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import {
  FaWallet,
  FaArrowRight,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaPiggyBank,
  FaCalendarAlt,
  FaCoins,
  FaReceipt,
  FaHistory,
  FaCalculator,
  FaInfoCircle,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

const FeaturesPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Interactive 50/30/20 Budget Calculator State
  const [calcIncome, setCalcIncome] = useState(50000);
  const [calcCurrency, setCalcCurrency] = useState('₹');

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const coreFeatures = [
    {
      icon: FaCoins,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      title: 'Net Balance & Cash Flow Engine',
      badge: 'Core Accounting',
      summary:
        'Live tracking of opening starting balances, real-time incomes, expenditures, and seamless reconciliation adjustments.',
      formula: 'Net Balance = Opening Balance + Total Incomes - Total Expenses',
      highlights: [
        'Dynamic formula: Starting Balance + Total Income - Total Expenses',
        'In-between reconciliation adjustments matching live bank statements with automated balancing credit/debit entries',
        'Support for 4 major global currencies (INR ₹, USD $, EUR €, GBP £) with dynamic UI formatting',
        'Zero phantom math — every single unit of currency is accounted for across all connected modules',
      ],
      practicalExample:
        'If your bank account statement reads ₹54,200 but FinTrack shows ₹54,000, 1-click Reconcile automatically logs a +₹200 balancing credit so your records align with the bank perfectly.',
    },
    {
      icon: FaReceipt,
      color: '#2563eb',
      bgColor: '#dbeafe',
      title: 'Precision Transaction Management & Refund Engine',
      badge: 'Truthful Ledgers',
      summary:
        'Log, tag, filter, and inspect your financial transactions with sub-second speed and zero friction.',
      formula: 'Refund Rule: Deduct directly from Category Expense (Never inflate gross income)',
      highlights: [
        'Split tracking: Income, Expense, Transfer, and specialized Refund transactions',
        'Intelligent Refund Routing: Deducts directly from that category\'s monthly expenses rather than falsely inflating your primary income',
        'Rich metadata: Payment methods (UPI, Debit/Credit Card, Bank Transfer, Cash), tags, and custom notes',
        'One-click instant CSV data export for tax filing, accountants, and spreadsheet analysis',
      ],
      practicalExample:
        'You buy a ₹3,000 jacket and return it. Marking "Is Refund" removes ₹3,000 from your Shopping expenses, keeping your tax brackets and budget ceiling completely honest.',
    },
    {
      icon: FaChartLine,
      color: '#10b981',
      bgColor: '#d1fae5',
      title: 'Smart Category Budget Planning',
      badge: 'Proactive Guardrails',
      summary:
        'Set monthly category spending caps with dynamic progress indicators and visual overspending warnings.',
      formula: 'Budget Status: Safe (<80%) | Caution (80-100%) | Overbudget (>100%)',
      highlights: [
        'Three-tier progress tracking: Safe (<80% green), Warning (80-100% amber), Overbudget (>100% red)',
        'Instant live deduction whenever an expense or refund is logged in that category',
        'Remaining budget calculations and monthly rollover reset without data loss',
        'Color-coded icons for easy visual identification across desktop and mobile',
      ],
      practicalExample:
        'Set a ₹15,000 Dining budget. As you log restaurant visits, the visual bar shifts from green to amber at ₹12,000, warning you before overspending spirals out of control.',
    },
    {
      icon: FaPiggyBank,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      title: 'Banking-Grade Savings Goals',
      badge: 'Real-World Banking Rules',
      summary:
        'Target-based savings funds built upon real-world banking logic, preventing phantom wealth and fake math.',
      formula: 'Withdrawal Rule: Withdrawing from savings logs as an Expense (Cash exits locked pool)',
      highlights: [
        'Initial "Already Saved" seed deposits immediately update your Net Savings KPI without creating artificial transactions',
        'Flexible contribution logging with live progress bars and target completion dates',
        'Savings withdrawals deduct from goal funds and log as expenses per banking rules, keeping your net savings truthful',
        'Safe deletion of uncompleted goals returns saved funds back into your spendable Net Balance without losing a cent',
      ],
      practicalExample:
        'You have ₹40,000 saved for an emergency fund before joining FinTrack. Enter it in "Already Saved" to immediately sync your savings net worth on Day 1.',
    },
    {
      icon: FaCalendarAlt,
      color: '#ec4899',
      bgColor: '#fce7f3',
      title: 'Recurring Bills & Subscriptions',
      badge: 'Automated Schedules',
      summary:
        'Never miss rent, utility, gym, or subscription renewals with automated due-date scheduling.',
      formula: 'Cadence: Daily | Weekly | Monthly | Yearly with auto-advancing cycles',
      highlights: [
        'Supported intervals: Daily, Weekly, Monthly, and Yearly recurrence',
        'Upcoming bill alerts with days-remaining countdown badges ("Due in 3 days", "Due Today", "Overdue")',
        'One-click "Mark as Paid" auto-generates matching transaction records and advances the schedule',
        'Option to skip bill cycles without disrupting future scheduled dates (ideal for paused subscriptions)',
      ],
      practicalExample:
        'Mark your ₹1,199 Netflix subscription as paid on the 15th; FinTrack records the expense, updates your Entertainment budget, and sets the next due date to next month automatically.',
    },
    {
      icon: FaUsers,
      color: '#06b6d4',
      bgColor: '#cffafe',
      title: 'Household & Partner Sharing',
      badge: 'Dual-Workspace Architecture',
      summary:
        'Collaborate on joint household rent, groceries, and bills while preserving 100% personal privacy.',
      formula: 'Personal Workspace (Private to You) vs. Household Workspace (Shared with Family)',
      highlights: [
        'Create a household and invite family members or roommates via their registered email',
        'Unified view of shared joint finances alongside separate, strictly private personal ledgers',
        'Instant 1-click workspace switching between Personal and Household modes from the top navigation',
        'Automated ownership transfer safeguards upon account deletion to protect family financial history',
      ],
      practicalExample:
        'Log your ₹25,000 apartment rent and groceries under Household for your spouse to see, while your personal gadgets and gifts remain private in your Personal ledger.',
    },
    {
      icon: FaShieldAlt,
      color: '#ef4444',
      bgColor: '#fee2e2',
      title: 'Enterprise Multi-Factor Authentication',
      badge: 'Bank-Grade Security',
      summary:
        'Bank-grade authentication with user autonomy — choose the exact security tier that fits your needs.',
      formula: '4 Security Tiers: Disabled | Authenticator App (TOTP) | Email OTP | Dual Verification',
      highlights: [
        'Authenticator App (TOTP): Compatible with Google Authenticator, Authy, Microsoft Authenticator, and 1Password',
        'Email One-Time Passcodes (OTP): 6-digit verification codes sent directly to your registered inbox',
        'Four customizable security tiers: Disabled, Authenticator Only, Email OTP Only, or Both',
        'Universal password visibility eye toggles on all password fields across the platform',
      ],
      practicalExample:
        'You can choose Email OTP for simple convenience or pair Google Authenticator for maximum zero-trust security on every sign-in.',
    },
    {
      icon: FaHistory,
      color: '#6366f1',
      bgColor: '#e0e7ff',
      title: 'Audit Trail & Visual Analytics',
      badge: 'Immutable Compliance',
      summary:
        'Full historical audit logging and interactive charts to visualize your financial trajectory.',
      formula: 'Audit Logging: Every login, balance edit, password reset, and deletion is recorded',
      highlights: [
        'Immutable activity logs tracking profile changes, logins, and balance adjustments with timestamps',
        'Income vs Expense monthly comparisons and detailed category spending breakdown donut charts',
        'Savings rate percentage calculations and net worth velocity indicators',
        'Searchable audit trail for complete accountability and compliance',
      ],
      practicalExample:
        'Verify exactly when your starting balance was updated or inspect recent logins with device metadata in the Activity Log.',
    },
  ];

  const comparisonData = [
    {
      feature: 'Real-World Banking Rules on Goal Withdrawals',
      fintrack: 'Yes (Withdrawals count as expenses to keep cash flow truthful)',
      spreadsheets: 'Manual formula patching required',
      otherApps: 'No (Money silently disappears or creates math errors)',
    },
    {
      feature: 'Initial "Already Saved" Goal Seed Balance',
      fintrack: 'Yes (Immediately credits Net Savings without fake deposits)',
      spreadsheets: 'Manual setup',
      otherApps: 'No (Forces fake past deposit transactions)',
    },
    {
      feature: 'Truthful Refund Accounting (Deducts Expense)',
      fintrack: 'Yes (Directly offsets category expense, protects tax bracket)',
      spreadsheets: 'Rarely modeled correctly',
      otherApps: 'No (Falsely recorded as gross income)',
    },
    {
      feature: 'In-Between Bank Statement Reconciliation',
      fintrack: 'Yes (Auto-generates balancing credit/debit audit transactions)',
      spreadsheets: 'Manual trial-and-error balancing',
      otherApps: 'No (Only forces hard overwrites without history)',
    },
    {
      feature: 'Flexible Multi-Factor Auth (4 Tiers: TOTP + Email OTP)',
      fintrack: 'Yes (User autonomy: Disabled, App TOTP, Email OTP, or Both)',
      spreadsheets: 'None (File password only)',
      otherApps: 'Often forced or SMS-only (insecure)',
    },
    {
      feature: 'Dual-Workspace Household & Roommate Sharing',
      fintrack: 'Yes (Private Personal ledgers + Shared Household workspace)',
      spreadsheets: 'Requires messy duplicate tabs and privacy risks',
      otherApps: 'Expensive paid add-on or all-or-nothing sharing',
    },
    {
      feature: 'Recurring Bill Schedules with 1-Click Pay',
      fintrack: 'Yes (Cadence rules, due-date badges & auto-pay transactions)',
      spreadsheets: 'No automation',
      otherApps: 'Basic reminders without auto-reconciliation',
    },
    {
      feature: '1-Click Instant CSV Export for Taxes & Backup',
      fintrack: 'Yes (Export clean, structured CSV anytime with zero paywalls)',
      spreadsheets: 'Native export',
      otherApps: 'Often locked behind premium tier',
    },
    {
      feature: 'Universal Password Visibility Eye Toggles',
      fintrack: 'Yes (Available on every login, register, and security screen)',
      spreadsheets: 'N/A',
      otherApps: 'Rarely implemented on all fields',
    },
    {
      feature: 'Danger Zone Cascading Account Deletion',
      fintrack: 'Yes (Irreversible erasure with ownership succession safeguards)',
      spreadsheets: 'Delete file',
      otherApps: 'Often retains shadow profile data',
    },
  ];

  const faqList = [
    {
      q: 'How does FinTrack differ from standard expense tracking apps?',
      a: 'Most consumer expense apps use naive mathematics: they count store refunds as new income (distorting your tax brackets), allow you to delete uncompleted savings goals without returning your money, and treat goal withdrawals as free money. FinTrack was engineered from day one on strict double-entry banking mathematics. Every withdrawal, contribution, refund, and reconciliation adjustment mirrors real-world banking regulations.',
    },
    {
      q: 'Is my financial data shared with third parties or advertisers?',
      a: 'Never. FinTrack does not sell, monetize, or harvest user financial records. We do not display ads, and all authentication is secured with enterprise bcrypt password hashing, JWT bearer tokens, and zero-knowledge TOTP MFA protocols.',
    },
    {
      q: 'Can I use FinTrack in currencies other than INR?',
      a: 'Yes! FinTrack fully supports INR (₹), USD ($), EUR (€), and GBP (£). You can switch your preferred display currency in your Profile Settings at any time, and every single metric, chart, and transaction throughout the app instantly updates.',
    },
    {
      q: 'How does the Household Sharing feature protect my personal privacy?',
      a: 'FinTrack utilizes a dual-workspace architecture. When you create or join a household, you have two completely distinct views: your Personal Workspace and your Household Workspace. Transactions logged in your Personal Workspace are strictly private to you. Only transactions explicitly entered into the Household Workspace are shared with your family or roommates.',
    },
    {
      q: 'Can I export my financial records to Excel or Google Sheets?',
      a: 'Yes, 100%. In the Transactions module, click the "Export to CSV" button to immediately download your complete transaction history including dates, amounts, categories, types, payment methods, and notes. No paywalls, no restrictions.',
    },
    {
      q: 'What happens if I lose my Authenticator App or cannot receive Email OTP?',
      a: 'FinTrack offers 4 customizable security tiers: Disabled, Authenticator Only, Email OTP Only, or Both. You can select the tier that fits your comfort level. If you ever forget your password, you can use the "Forgot Password" link on the login page to receive a 1-hour secure password reset link to your registered email.',
    },
    {
      q: 'How does the 1-click In-Between Reconciliation feature work?',
      a: 'If your bank statement balance drifts from your FinTrack Net Balance (for example, due to bank fees or missed interest), click "Reconcile Balance" on your dashboard. Enter your actual bank statement amount, and FinTrack automatically calculates the exact difference and logs a balancing credit or debit transaction with full audit history.',
    },
    {
      q: 'Is Multi-Factor Authentication mandatory for all users?',
      a: 'No. We believe in user autonomy. You can keep MFA disabled, enable only the Authenticator App (Google Authenticator / Authy), enable only Email OTP, or enable both for maximum security. You have complete control in your Profile Settings.',
    },
  ];

  // 50/30/20 Calculations
  const needs = Math.round(calcIncome * 0.5);
  const wants = Math.round(calcIncome * 0.3);
  const savings = Math.round(calcIncome * 0.2);

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      {/* Reusable Public Navbar Component */}
      <Navbar />


      {/* Hero Section with Balanced Vertical Spacing */}
      <section
        className="text-center position-relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% -20%, rgba(37, 99, 235, 0.12) 0%, rgba(255, 255, 255, 0) 70%), #f8fafc',
          borderBottom: '1px solid #e2e8f0',
          paddingTop: '5rem',
          paddingBottom: '5rem',
        }}
      >
        <div className="container position-relative z-1 px-3 px-md-4" style={{ maxWidth: '960px' }}>
          <div className="mb-4 small fw-semibold shadow-xs">
            <div className="px-2 py-1 d-inline-flex align-items-center gap-2 rounded-pill bg-primary-subtle text-primary border border-primary-subtle">
              <span className="pulse-dot"></span>
              <span>Production-Quality Financial Engineering</span>
            </div>
          </div>

          <h1 className="display-4 fw-bold mb-3 text-dark lh-1" style={{ letterSpacing: '-1px' }}>
            Engineered for <span className="text-gradient-primary">complete personal & household</span> financial control.
          </h1>

          <p className="lead text-muted mb-4 mx-auto lh-base" style={{ maxWidth: '740px', fontSize: '18px' }}>
            FinTrack unites real-world banking mathematics, proactive category budgeting, automated recurring schedules, and collaborative sharing into one seamless, production-grade platform.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="btn text-white btn-lg px-4 py-2 fs-6 fw-semibold rounded-pill shadow"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                    border: 'none',
                  }}
                >
                  Create Free Account <FaArrowRight className="ms-2" size={13} />
                </Link>
                <button
                  onClick={() => navigate('/login?demo=true')}
                  className="btn btn-outline-secondary btn-dashboard-action btn-lg px-4 py-2 fs-6 fw-semibold rounded-pill shadow-xs"
                >
                  Explore Live Demo
                </button>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="btn text-white btn-lg px-5 py-3 fs-6 fw-bold rounded-pill shadow"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                  border: 'none',
                }}
              >
                Open Dashboard <FaArrowRight className="ms-2" size={14} />
              </Link>
            )}
          </div>

          {/* Quick Credibility Badges with Generous Padding */}
          <div className="d-inline-flex flex-wrap justify-content-center align-items-center gap-3 gap-md-4 text-muted small py-2 px-4 rounded-pill bg-white border shadow-xs mt-2">
            <div className="d-flex align-items-center gap-2 py-2">
              <FaCheckCircle className="text-success" /> <span className="fw-medium text-dark">4 Currencies (₹, $, €, £)</span>
            </div>
            <div className="d-flex align-items-center gap-2 py-2">
              <FaCheckCircle className="text-success" /> <span className="fw-medium text-dark">Zero Ads & 100% Privacy</span>
            </div>
            <div className="d-flex align-items-center gap-2 py-2">
              <FaCheckCircle className="text-success" /> <span className="fw-medium text-dark">Banking-Grade Mathematics</span>
            </div>
            <div className="d-flex align-items-center gap-2 py-2">
              <FaCheckCircle className="text-success" /> <span className="fw-medium text-dark">Instant 1-Click CSV Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Highlight Banner with g-4 Spacing */}
      <section style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div className="container px-3 px-md-4" style={{ maxWidth: '1240px' }}>
          <div className="row g-4 text-center text-md-start">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm d-flex flex-column" style={{ borderTop: '4px solid #2563eb' }}>
                <div className="text-primary fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.06em' }}>
                  Pillar 1
                </div>
                <div className="fw-bold text-dark mb-2 fs-6">Real Banking Rules</div>
                <p className="text-muted mb-0 small lh-base">
                  Goal withdrawals count as expenses; uncompleted goal deletions refund to Net Balance safely.
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm d-flex flex-column" style={{ borderTop: '4px solid #10b981' }}>
                <div className="text-success fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.06em' }}>
                  Pillar 2
                </div>
                <div className="fw-bold text-dark mb-2 fs-6">Truthful Refunds</div>
                <p className="text-muted mb-0 small lh-base">
                  Refunds deduct directly from that category's expense, keeping gross income and tax records honest.
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm d-flex flex-column" style={{ borderTop: '4px solid #06b6d4' }}>
                <div className="text-info fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.06em' }}>
                  Pillar 3
                </div>
                <div className="fw-bold text-dark mb-2 fs-6">Dual Workspaces</div>
                <p className="text-muted mb-0 small lh-base">
                  Keep personal spending strictly confidential while sharing joint rent & groceries with household members.
                </p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm d-flex flex-column" style={{ borderTop: '4px solid #ef4444' }}>
                <div className="text-danger fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '0.06em' }}>
                  Pillar 4
                </div>
                <div className="fw-bold text-dark mb-2 fs-6">Autonomous MFA</div>
                <p className="text-muted mb-0 small lh-base">
                  Freedom to choose between 4 security tiers: Disabled, Google Authenticator TOTP, Email OTP, or Both.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid Section with Clean Alignment */}
      <section className="bg-white" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container px-3 px-md-4" style={{ maxWidth: '1240px' }}>
          <div className="text-center mb-5 pb-2">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-3 fw-semibold rounded-pill">
              System Architecture
            </span>
            <h2 className="fw-bold fs-2 mb-2 text-dark">The 8 Pillars of FinTrack</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
              Explore how each component connects logically to ensure your financial records are always mathematically accurate, transparent, and actionable.
            </p>
          </div>

          <div className="row g-4 g-lg-4">
            {coreFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="col-12 col-lg-6">
                  <div className="card-feature-elevated p-4 p-md-4 h-100 d-flex flex-column">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center shadow-xs mb-2"
                          style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: feat.bgColor,
                            color: feat.color,
                          }}
                        >
                          <Icon size={24} />
                        </div>
                        <span
                          className="badge border px-3 py-1 rounded-pill small fw-semibold"
                          style={{ backgroundColor: '#f8fafc', color: '#475569' }}
                        >
                          {feat.badge}
                        </span>
                      </div>

                      <h3 className="fw-bold fs-5 mb-2 text-dark">{feat.title}</h3>
                      <p className="text-muted small mb-3 lh-base">{feat.summary}</p>

                      {/* Formula / Rule Box */}
                      <div
                        className="p-3 rounded-3 mb-3 small font-monospace"
                        style={{
                          background: '#f8fafc',
                          borderLeft: '4px solid ' + feat.color,
                          fontSize: '0.785rem',
                          color: '#1e293b',
                        }}
                      >
                        <strong className="text-dark">Formula / Rule:</strong> {feat.formula}
                      </div>

                      {/* Highlights with clean line height */}
                      <ul className="list-unstyled small mb-4">
                        {feat.highlights.map((item, hIdx) => (
                          <li key={hIdx} className="d-flex align-items-start gap-2 mb-2 text-secondary">
                            <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={13} />
                            <span className="lh-sm" >{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practical Example Box anchored to the bottom with mt-auto */}
                    <div className="p-3 rounded-3 bg-light-subtle border small text-muted mt-auto">
                      <strong className="text-dark d-block mb-1">
                        <FaInfoCircle className="me-1 text-primary" /> Real-World Example:
                      </strong>
                      <span className="lh-sm">{feat.practicalExample}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive 50/30/20 Budgeting Simulator Section */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container px-3 px-md-4" style={{ maxWidth: '1040px' }}>
          <div className="text-center mb-5">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 mb-3 fw-semibold rounded-pill">
              <FaCalculator className="me-1" /> Interactive Simulator
            </span>
            <h2 className="fw-bold fs-2 mb-2 text-dark">Experience the 50/30/20 Budgeting Engine</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: '620px', lineHeight: 1.6 }}>
              FinTrack encourages balanced personal finance. Input your monthly income to see how our automated budgeting buckets allocate your resources.
            </p>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <div className="row align-items-center g-4 g-lg-5">
              <div className="col-12 col-md-5">
                <label className="form-label fw-bold text-dark small mb-2">
                  Enter Your Monthly Income:
                </label>
                <div className="input-group mb-3 shadow-xs">
                  <select
                    className="form-select flex-grow-0 fw-semibold"
                    style={{ width: '90px', backgroundColor: '#f8fafc' }}
                    value={calcCurrency}
                    onChange={(e) => setCalcCurrency(e.target.value)}
                  >
                    <option value="₹">₹ INR</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                    <option value="£">£ GBP</option>
                  </select>
                  <input
                    type="number"
                    className="form-control form-control-lg fw-bold text-primary"
                    value={calcIncome}
                    onChange={(e) => setCalcIncome(Math.max(0, Number(e.target.value)))}
                    step="5000"
                    min="0"
                  />
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="10000"
                  max="300000"
                  step="5000"
                  value={calcIncome}
                  onChange={(e) => setCalcIncome(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted small mt-1 fw-medium mb-4">
                  <span>{calcCurrency}10,000</span>
                  <span>{calcCurrency}150,000</span>
                  <span>{calcCurrency}300,000+</span>
                </div>

                {/* Visual Ratio Progress Bar */}
                <div className="pt-2 border-top">
                  <div className="d-flex justify-content-between small text-muted mb-2 fw-semibold">
                    <span>Target Allocation Ratio:</span>
                    <span>100% Monthly Income</span>
                  </div>
                  <div className="progress shadow-xs" style={{ height: '14px', borderRadius: '8px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: '50%' }}
                      title="50% Needs"
                    ></div>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: '30%' }}
                      title="30% Wants"
                    ></div>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: '20%', backgroundColor: '#9333ea' }}
                      title="20% Savings"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-7">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="p-3 mb-2 rounded-4 border d-flex justify-content-between align-items-center shadow-xs" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                      <div>
                        <div className="fw-bold text-success mb-1" style={{ fontSize: '15px' }}>
                          50% Needs (Essential Living)
                        </div>
                        <div className="text-muted small">Rent, Groceries, Utilities, Healthcare</div>
                      </div>
                      <div className="fs-3 fw-bold text-success">
                        {calcCurrency}{Number(needs).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 mb-2 rounded-4 border d-flex justify-content-between align-items-center shadow-xs" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                      <div>
                        <div className="fw-bold text-primary mb-1" style={{ fontSize: '15px' }}>
                          30% Wants (Discretionary)
                        </div>
                        <div className="text-muted small">Dining, Entertainment, Shopping, Travel</div>
                      </div>
                      <div className="fs-3 fw-bold text-primary">
                        {calcCurrency}{Number(wants).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 mb-2 rounded-4 border d-flex justify-content-between align-items-center shadow-xs" style={{ background: '#fdf4ff', borderColor: '#f5d0fe' }}>
                      <div>
                        <div className="fw-bold mb-1" style={{ color: '#9333ea', fontSize: '15px' }}>
                          20% Savings & Goals (Future Security)
                        </div>
                        <div className="text-muted small">Emergency Fund, Investments, Debt Payoff</div>
                      </div>
                      <div className="fs-3 fw-bold" style={{ color: '#9333ea' }}>
                        {calcCurrency}{Number(savings).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FinTrack vs Excel vs Generic Apps Comparison Table */}
      <section className="bg-white" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container px-3 px-md-4" style={{ maxWidth: '1140px' }}>
          <div className="text-center mb-5 pb-2">
            <span className="badge bg-secondary-subtle text-secondary border px-3 py-2 mb-3 fw-semibold rounded-pill">
              Feature Comparison
            </span>
            <h2 className="fw-bold fs-2 mb-2 text-dark">Why FinTrack Outperforms Alternatives</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
              See why engineering-focused professionals, households, and finance enthusiasts choose FinTrack over messy Excel sheets and generic consumer apps.
            </p>
          </div>

          <div className="table-responsive border rounded-4 shadow-sm overflow-hidden">
            <table className="comparison-matrix-table align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Feature / Capability</th>
                  <th className="text-primary fw-bold" style={{ width: '27%', background: '#eff6ff' }}>
                    <div className="d-flex align-items-center gap-2 ">
                      <FaWallet size={16} />
                      <span>FinTrack Platform</span>
                      <span className="badge bg-primary text-white rounded-pill ms-1" style={{ fontSize: '0.65rem' }}>PRO</span>
                    </div>
                  </th>
                  <th className="text-muted" style={{ width: '19%' }}>Excel / Google Sheets</th>
                  <th className="text-muted" style={{ width: '19%' }}>Typical Expense Apps</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="fw-semibold text-dark small">{row.feature}</td>
                    <td className="small fw-medium text-dark" style={{ background: '#f8fafc' }}>
                      <div className="d-flex align-items-start gap-2 text-success">
                        <FaCheckCircle className="mt-1 flex-shrink-0" size={14} />
                        <span className="text-dark">{row.fintrack}</span>
                      </div>
                    </td>
                    <td className="small text-muted">{row.spreadsheets}</td>
                    <td className="small text-muted">{row.otherApps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4-Step User Journey Section */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container px-3 px-md-4" style={{ maxWidth: '1140px' }}>
          <div className="text-center mb-5 pb-2">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-3 fw-semibold rounded-pill">
              Seamless Onboarding
            </span>
            <h2 className="fw-bold fs-2 mb-2 text-dark">Get Started in 4 Simple Steps</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: '580px', lineHeight: 1.6 }}>
              From initial sign-up to complete financial clarity in under 3 minutes.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="step-card-visual h-100 text-center text-md-start d-flex flex-column">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold mb-3 mx-auto mx-md-0 shadow-sm"
                  style={{ width: '44px', height: '44px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
                >
                  1
                </div>
                <h4 className="fw-bold fs-6 mb-2 text-dark">Set Opening Balance</h4>
                <p className="text-muted small mb-0 lh-base">
                  Enter your current cash and bank funds, and pick your preferred currency (₹, $, €, £).
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="step-card-visual h-100 text-center text-md-start d-flex flex-column">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold mb-3 mx-auto mx-md-0 shadow-sm"
                  style={{ width: '44px', height: '44px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  2
                </div>
                <h4 className="fw-bold fs-6 mb-2 text-dark">Set Budgets & Bills</h4>
                <p className="text-muted small mb-0 lh-base">
                  Define monthly spending limits for categories and schedule recurring rent and utilities.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="step-card-visual h-100 text-center text-md-start d-flex flex-column">
                <div
                  className="rounded-circle text-dark d-flex align-items-center justify-content-center fw-bold mb-3 mx-auto mx-md-0 shadow-sm"
                  style={{ width: '44px', height: '44px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}
                >
                  3
                </div>
                <h4 className="fw-bold fs-6 mb-2 text-dark">Log Spending & Refunds</h4>
                <p className="text-muted small mb-0 lh-base">
                  Record daily spending on the fly. Store refunds offset expenses without distorting income.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="step-card-visual h-100 text-center text-md-start d-flex flex-column">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold mb-3 mx-auto mx-md-0 shadow-sm"
                  style={{ width: '44px', height: '44px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}
                >
                  4
                </div>
                <h4 className="fw-bold fs-6 mb-2 text-dark">Collaborate & Grow</h4>
                <p className="text-muted small mb-0 lh-base">
                  Invite household members to joint ledgers, track goals, and watch your net worth grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prospective User FAQs with Clean Padding */}
      <section className="bg-white" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container px-3 px-md-4" style={{ maxWidth: '900px' }}>
          <div className="text-center mb-5 pb-2">
            <span className="badge bg-light text-muted border px-3 py-2 mb-2 fw-semibold rounded-pill">
              Got Questions?
            </span>
            <h2 className="fw-bold fs-2 mb-2 text-dark">Frequently Asked Questions</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: '580px', lineHeight: 1.6 }}>
              Clear answers to our most common inquiries regarding security, banking logic, and privacy.
            </p>
          </div>

          <div className="d-flex flex-column gap-3">
            {faqList.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="border rounded-4 px-3 py-2 bg-white transition-all mb-2"
                style={{
                  borderColor: openFaq === fIdx ? '#2563eb' : '#e2e8f0',
                  boxShadow: openFaq === fIdx ? '0 6px 18px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <button
                  onClick={() => toggleFaq(fIdx)}
                  className="btn btn-link text-decoration-none text-dark d-flex align-items-center justify-content-between w-100 px-0 text-start fw-semibold"
                  style={{ fontSize: '0.95rem' }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <FaQuestionCircle className="text-primary flex-shrink-0" size={17} />
                    <span>{faq.q}</span>
                  </span>
                  {openFaq === fIdx ? <FaChevronUp className="text-primary" size={13} /> : <FaChevronDown className="text-muted" size={13} />}
                </button>
                {openFaq === fIdx && (
                  <div className="mt-3 pt-3 border-top text-secondary small lh-base">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner with Rich Gradient */}
      <section
              className="py-5 px-3 px-md-4 text-center text-white"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
              }}
            >
              <div className="container py-3" style={{ maxWidth: '840px' }}>
                <h2 className="display-5 fw-bold mb-3 text-white">Ready to take command of your finances?</h2>
                <p className="lead text-white-50 mb-4 mx-auto lh-base" style={{ maxWidth: '640px', fontSize: '18px' }}>
                  Join smart professionals and families who rely on FinTrack's banking-grade accounting engine every single day.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/register"
                        className="btn btn-light btn-lg px-3 py-2 fw-bold text-primary rounded-pill shadow"
                        style={{ fontSize: '16px' }}
                      >
                        Create Free Account <FaArrowRight className="ms-2" size={13} />
                      </Link>
                      <button
                        onClick={() => navigate('/login?demo=true')}
                        className="btn btn-light text-primary btn-lg px-3 py-2 fw-semibold rounded-pill"
                        style={{ fontSize: '16px' }}
                      >
                        Try Live Demo
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="btn btn-light btn-lg px-5 py-3 fw-bold text-primary rounded-pill shadow"
                      style={{ fontSize: '16px' }}
                    >
                      Return to Dashboard <FaArrowRight className="ms-2" size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </section>

      {/* Professional Footer Component */}
      <Footer />
    </div>
  );
};

export default FeaturesPage;
