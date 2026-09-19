import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaWallet,
  FaArrowRight,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaPiggyBank,
  FaFileCsv,
  FaCoins,
  FaReceipt,
  FaHistory,
  FaCalculator,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaBalanceScale,
  FaRegLightbulb,
  FaKey,
} from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Quick 50/30/20 Calculator State on Home Page
  const [incomeInput, setIncomeInput] = useState(50000);
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  // FAQ open/close state
  const [faqIndex, setFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setFaqIndex(faqIndex === index ? null : index);
  };

  const needsAmount = Math.round(incomeInput * 0.5);
  const wantsAmount = Math.round(incomeInput * 0.3);
  const savingsAmount = Math.round(incomeInput * 0.2);

  const pillars = [
    {
      icon: FaBalanceScale,
      color: '#2563eb',
      bgColor: '#eff6ff',
      title: 'Double-Entry Accounting Integrity',
      summary:
        'Every unit of currency has a verifiable debit and credit counterpart. No phantom balances, hidden fees, or mysterious discrepancies.',
    },
    {
      icon: FaChartLine,
      color: '#10b981',
      bgColor: '#ecfdf5',
      title: 'Proactive Category Guardrails',
      summary:
        'Set hard or flexible thresholds across custom categories. Get instant visual warnings before overspending occurs.',
    },
    {
      icon: FaUsers,
      color: '#06b6d4',
      bgColor: '#ecfeff',
      title: 'Multi-Tenant Household Sharing',
      summary:
        'Collaborate with roommates, spouses, or family members on shared utilities and groceries without exposing private finances.',
    },
    {
      icon: FaShieldAlt,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      title: 'Autonomous 4-Tier MFA & Privacy',
      summary:
        'Hardware TOTP, direct email OTP verification, zero data monetization, and instant cascading account erasure in Danger Zone.',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Set Your True Starting Balance',
      desc: 'Input your initial bank and cash balances. Reconcile with real-world bank statements using automated balancing adjustments.',
      badge: 'Account Setup',
    },
    {
      step: '02',
      title: 'Define Monthly Category Budgets',
      desc: 'Distribute your earnings using the proven 50/30/20 rule or custom allocation envelopes with automated recurring bill deductions.',
      badge: 'Cash Flow Planning',
    },
    {
      step: '03',
      title: 'Collaborate & Monitor Growth',
      desc: 'Invite household members to shared ledgers, track milestone savings goals, and generate clean CSV spreadsheets for tax filings.',
      badge: 'Wealth Building',
    },
  ];

  const comparisons = [
    {
      feature: 'Reconciliation with Live Bank Balance',
      spreadsheet: 'Manual formula patching prone to broken refs',
      bankApp: 'Delayed by 24 to 72 hours with static exports',
      fintrack: '1-Click balancing adjustment entries logged automatically',
    },
    {
      feature: 'Household & Split Expense Sharing',
      spreadsheet: 'Requires sharing entire file with no privacy isolation',
      bankApp: 'Single-account lock-in with zero roommate support',
      fintrack: 'Dual Workspace: Personal finances strictly isolated from Shared ledger',
    },
    {
      feature: 'Multi-Factor Authentication (MFA)',
      spreadsheet: 'None (Basic password or open file)',
      bankApp: 'SMS OTP only (vulnerable to SIM swapping)',
      fintrack: 'Autonomous 4-Tier MFA: Google Authenticator (TOTP) + Email OTP',
    },
    {
      feature: 'Data Privacy & Monetization',
      spreadsheet: 'Saved on personal drive or corporate cloud',
      bankApp: 'Monetizes portfolio data for targeted loan advertisements',
      fintrack: 'Zero Data Monetization pledge: We never sell or broker user records',
    },
    {
      feature: 'Double-Entry Accounting Verification',
      spreadsheet: 'Subject to manual typing errors and orphan rows',
      bankApp: 'Black-box calculation with unverified balance math',
      fintrack: 'Atomic database transactions with audited credit and debit trail',
    },
  ];

  const personas = [
    {
      role: 'Freelancer & Solo Founder',
      headline: 'Tame Irregular Incomes & Tax Deadlines',
      quote:
        'FinTrack allows me to separate my consulting earnings from personal living costs, while instant CSV exports make quarterly tax filings effortless.',
      tag: 'Independent Income',
    },
    {
      role: 'Modern Family & Roommates',
      headline: 'Split Household Bills Without Awkwardness',
      quote:
        'We track apartment rent, groceries, and internet bills in our shared household ledger, while keeping our personal savings goals 100% private.',
      tag: 'Shared Living',
    },
    {
      role: 'FIRE & Wealth Planner',
      headline: 'Target Aggressive Savings Milestones',
      quote:
        'The milestone savings tracker automatically syncs with goal withdrawals and expense deductions, ensuring our retirement timeline stays mathematically accurate.',
      tag: 'Financial Independence',
    },
  ];

  const faqs = [
    {
      q: 'How does FinTrack guarantee mathematical accuracy across accounts?',
      a: 'FinTrack is built upon strict double-entry banking principles. Whenever you log an expense, adjust a reconciliation balance, or transfer funds to a savings goal, the system executes atomic database updates. Opening Balance + Incomes - Expenses always equals your current Net Balance with zero phantom math.',
    },
    {
      q: 'Do I have to connect my real bank credentials or credit cards?',
      a: 'No. FinTrack is completely zero-knowledge and requires NO bank account passwords or Plaid credentials. You have total privacy and complete control over your financial records without third-party data aggregators scraping your portfolio.',
    },
    {
      q: 'How does Household Sharing protect my personal private transactions?',
      a: 'FinTrack features a Dual Workspace architecture. Your personal dashboard, bank reconciliations, and private transactions are strictly invisible to household members. Only transactions explicitly designated as "Shared Household" appear on the joint ledger.',
    },
    {
      q: 'What Multi-Factor Authentication options are supported?',
      a: 'We offer an autonomous 4-Tier MFA suite: 1) Password-only, 2) Google Authenticator TOTP app, 3) Direct Inbox Email OTP, or 4) Dual MFA requiring both TOTP and Email OTP for high-security environments. You are free to configure any level from your Profile Settings.',
    },
    {
      q: 'Can I test FinTrack before creating a permanent account?',
      a: 'Yes. Simply click the "Live Demo" button in the top navigation bar to explore a pre-populated sandbox account with real transaction histories, category budgets, and savings milestones.',
    },
  ];

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      {/* Reusable Public Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-5 px-3 px-md-4 text-center position-relative overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container py-4" style={{ maxWidth: '960px' }}>
          {/* Top Pill Chip */}
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary border border-primary-subtle mb-4 small fw-semibold">
            <span className="badge bg-primary rounded-pill">v2.0</span>
            <span>Production-Quality Personal & Household Finance</span>
          </div>

          {/* Main Headline */}
          <h1 className="display-4 fw-bold mb-3 text-dark lh-1" style={{ letterSpacing: '-1px' }}>
            Master your personal finances with <span className="text-primary">banking-grade clarity</span>.
          </h1>

          {/* Subtitle */}
          <p className="lead text-muted mb-4 mx-auto lh-base" style={{ maxWidth: '720px', fontSize: '18px' }}>
            FinTrack gives individuals and modern households full command over net worth, category budgets, milestone savings goals, and collaborative ledgers with strict double-entry accuracy.
          </p>

          {/* Primary Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="btn btn-primary-custom btn-lg px-4 py-3 fw-bold rounded-pill shadow"
                  style={{ fontSize: '16px' }}
                >
                  Create Free Account <FaArrowRight className="ms-2" size={14} />
                </Link>
                <button
                  onClick={() => navigate('/login?demo=true')}
                  className="btn btn-outline-secondary btn-dashboard-action btn-lg px-4 py-3 fw-semibold rounded-pill"
                  style={{ fontSize: '16px' }}
                >
                  Explore Live Demo
                </button>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="btn btn-primary-custom btn-lg px-5 py-3 fw-bold rounded-pill shadow"
                style={{ fontSize: '16px' }}
              >
                Go to Your Dashboard <FaArrowRight className="ms-2" size={14} />
              </Link>
            )}
            <Link
              to="/features"
              className="btn btn-light btn-lg px-4 py-3 fw-semibold border rounded-pill text-dark"
              style={{ fontSize: '16px' }}
            >
              Explore All Features
            </Link>
          </div>

          {/* Trust Highlights Strip */}
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 text-muted small pt-2 mb-5">
            <div className="d-flex align-items-center gap-2">
              <FaCheckCircle className="text-success" size={16} />
              <span className="fw-medium text-dark">Zero Phantom Math</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <FaShieldAlt className="text-primary" size={16} />
              <span className="fw-medium text-dark">256-Bit Bcrypt Encryption</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <FaKey className="text-info" size={16} />
              <span className="fw-medium text-dark">Autonomous 4-Tier MFA</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <FaCoins className="text-warning" size={16} />
              <span className="fw-medium text-dark">INR, USD, EUR & GBP Support</span>
            </div>
          </div>

          {/* Interactive Live Preview Card Mockup */}
          <div
            className="card border shadow-lg rounded-4 text-start p-4 mx-auto bg-white"
            style={{
              maxWidth: '820px',
              borderColor: '#e2e8f0',
            }}
          >
            <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-3 mb-3 gap-2">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-white"
                  style={{ width: '32px', height: '32px', background: '#2563eb' }}
                >
                  <FaWallet size={16} />
                </div>
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                    FinTrack Real-Time Balance Engine
                  </div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>
                    Automated Double-Entry Reconciliation Ledger
                  </div>
                </div>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-semibold">
                ● Balanced & Verified
              </span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-4">
                <div className="p-3 rounded-3 bg-light border">
                  <div className="text-muted small mb-1">Total Net Balance</div>
                  <div className="fs-4 fw-bold text-dark">₹1,48,250</div>
                  <div className="text-success small fw-semibold">↑ +₹18,400 this month</div>
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="p-3 rounded-3 bg-light border">
                  <div className="text-muted small mb-1">Monthly Incomes</div>
                  <div className="fs-4 fw-bold text-success">₹85,000</div>
                  <div className="text-muted small">Primary + Consulting</div>
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="p-3 rounded-3 bg-light border">
                  <div className="text-muted small mb-1">Monthly Expenses</div>
                  <div className="fs-4 fw-bold text-danger">₹32,400</div>
                  <div className="text-muted small">62% of monthly cap</div>
                </div>
              </div>
            </div>

            {/* Visual Budget Progress Bar */}
            <div className="p-3 rounded-3 bg-light border">
              <div className="d-flex justify-content-between align-items-center mb-2 small">
                <span className="fw-semibold text-dark">50/30/20 Budget Allocation Health</span>
                <span className="fw-bold text-primary">Healthy Pace (38% Saved)</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar bg-primary" role="progressbar" style={{ width: '45%' }} title="Needs: 45%"></div>
                <div className="progress-bar bg-info" role="progressbar" style={{ width: '25%' }} title="Wants: 25%"></div>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: '30%' }} title="Savings: 30%"></div>
              </div>
              <div className="d-flex justify-content-between mt-2 text-muted" style={{ fontSize: '11px' }}>
                <span>Needs (₹23,500)</span>
                <span>Wants (₹8,900)</span>
                <span className="text-success fw-semibold">Savings & Goals (₹52,600)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Architectural Pillars */}
      <section className="py-5 px-3 px-md-4 container" style={{ maxWidth: '1240px' }}>
        <div className="text-center mb-5">
          <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-semibold mb-2">
            Engineered Architecture
          </div>
          <h2 className="display-6 fw-bold text-dark mb-2">The Four Pillars of FinTrack</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '640px', fontSize: '16px' }}>
            Built from scratch to resolve the fundamental flaws found in typical personal finance apps and manual spreadsheets.
          </p>
        </div>

        <div className="row g-4">
          {pillars.map((pillar, pIdx) => {
            const IconComponent = pillar.icon;
            return (
              <div key={pIdx} className="col-12 col-md-6 col-lg-3">
                <div className="card-fintrack p-4 h-100 d-flex flex-column border rounded-4 bg-white shadow-sm">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: pillar.bgColor,
                      color: pillar.color,
                    }}
                  >
                    <IconComponent size={22} />
                  </div>
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>
                    {pillar.title}
                  </h5>
                  <p className="text-muted small lh-base mb-0">{pillar.summary}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Step Guided Workflow */}
      <section className="py-5 px-3 px-md-4" style={{ backgroundColor: '#f1f5f9' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div className="text-center mb-5">
            <div className="badge bg-info-subtle text-info border border-info-subtle px-3 py-1 rounded-pill fw-semibold mb-2">
              Simple 3-Step Flow
            </div>
            <h2 className="display-6 fw-bold text-dark mb-2">How FinTrack Operates</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '16px' }}>
              Set up your accounts, establish proactive spending limits, and achieve financial clarity in under five minutes.
            </p>
          </div>

          <div className="row g-4">
            {workflowSteps.map((step, sIdx) => (
              <div key={sIdx} className="col-12 col-md-4">
                <div className="card border-0 rounded-4 p-4 h-100 bg-white shadow-sm d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="display-6 fw-bold text-primary opacity-50">{step.step}</span>
                    <span className="badge bg-light text-dark border px-3 py-1 rounded-pill small fw-semibold">
                      {step.badge}
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{step.title}</h5>
                  <p className="text-muted small lh-base mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Quick 50/30/20 Calculator on Home Page */}
      <section className="py-5 px-3 px-md-4 container" style={{ maxWidth: '1100px' }}>
        <div className="card border-0 rounded-4 p-4 p-md-5 shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-5">
              <div className="d-flex align-items-center gap-2 text-primary fw-semibold mb-2 small">
                <FaCalculator size={14} />
                <span>Quick Income Allocation Simulator</span>
              </div>
              <h3 className="fw-bold text-dark mb-3">Try the 50/30/20 Formula</h3>
              <p className="text-muted small lh-base mb-4">
                See how FinTrack partitions your take-home earnings into balanced Needs, Wants, and Savings buckets before you spend.
              </p>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Your Monthly Net Take-Home Income</label>
                <div className="input-group">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {currencySymbol}
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={() => setCurrencySymbol('₹')}>INR (₹)</button></li>
                    <li><button className="dropdown-item" onClick={() => setCurrencySymbol('$')}>USD ($)</button></li>
                    <li><button className="dropdown-item" onClick={() => setCurrencySymbol('€')}>EUR (€)</button></li>
                    <li><button className="dropdown-item" onClick={() => setCurrencySymbol('£')}>GBP (£)</button></li>
                  </ul>
                  <input
                    type="number"
                    className="form-control"
                    value={incomeInput}
                    min="1000"
                    step="1000"
                    onChange={(e) => setIncomeInput(Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <Link to="/features" className="btn btn-link p-0 text-decoration-none fw-semibold text-primary small">
                View Full Interactive Simulator on Features Page →
              </Link>
            </div>

            <div className="col-12 col-lg-7">
              <div className="row g-3">
                <div className="col-12 col-sm-4">
                  <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-primary text-white rounded-pill">50% Needs</span>
                    </div>
                    <div className="fs-4 fw-bold text-primary mb-1">
                      {currencySymbol}{needsAmount.toLocaleString()}
                    </div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>
                      Rent, utilities, groceries, healthcare & debt minimums.
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: '#ecfeff', borderColor: '#a5f3fc' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-info text-white rounded-pill">30% Wants</span>
                    </div>
                    <div className="fs-4 fw-bold text-info mb-1">
                      {currencySymbol}{wantsAmount.toLocaleString()}
                    </div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>
                      Dining out, subscriptions, recreation, hobbies & shopping.
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-success text-white rounded-pill">20% Savings</span>
                    </div>
                    <div className="fs-4 fw-bold text-success mb-1">
                      {currencySymbol}{savingsAmount.toLocaleString()}
                    </div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>
                      Emergency fund, retirement goals, index funds & prepayments.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-5 px-3 px-md-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div className="text-center mb-5">
            <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-semibold mb-2">
              Market Comparison
            </div>
            <h2 className="display-6 fw-bold text-dark mb-2">Why Switch to FinTrack?</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '640px', fontSize: '16px' }}>
              See how FinTrack outperforms messy spreadsheets and black-box corporate banking apps.
            </p>
          </div>

          <div className="table-responsive bg-white rounded-4 shadow-sm border">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase small" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                <tr>
                  <th className="py-3 px-4" style={{ width: '25%' }}>Capability</th>
                  <th className="py-3 px-4 text-muted" style={{ width: '25%' }}>Traditional Spreadsheets</th>
                  <th className="py-3 px-4 text-muted" style={{ width: '25%' }}>Corporate Banking Apps</th>
                  <th className="py-3 px-4 bg-primary-subtle text-primary fw-bold" style={{ width: '25%' }}>
                    FinTrack Platform
                  </th>
                </tr>
              </thead>
              <tbody className="small">
                {comparisons.map((c, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 fw-bold text-dark">{c.feature}</td>
                    <td className="py-3 px-4 text-muted">{c.spreadsheet}</td>
                    <td className="py-3 px-4 text-muted">{c.bankApp}</td>
                    <td className="py-3 px-4 bg-primary-subtle text-dark fw-semibold">
                      <div className="d-flex align-items-center gap-2">
                        <FaCheckCircle className="text-primary flex-shrink-0" size={14} />
                        <span>{c.fintrack}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Personas / Use Cases */}
      <section className="py-5 px-3 px-md-4 container" style={{ maxWidth: '1240px' }}>
        <div className="text-center mb-5">
          <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-semibold mb-2">
            Versatile Use Cases
          </div>
          <h2 className="display-6 fw-bold text-dark mb-2">Engineered for Every Lifestyle</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '16px' }}>
            Whether managing solo freelance streams or joint family budgets, FinTrack adapts to your reality.
          </p>
        </div>

        <div className="row g-4">
          {personas.map((persona, idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="card-fintrack p-4 h-100 rounded-4 bg-white border shadow-sm d-flex flex-column">
                <span className="badge bg-light text-primary border px-3 py-1 rounded-pill small fw-semibold align-self-start mb-3">
                  {persona.tag}
                </span>
                <h5 className="fw-bold text-dark mb-2">{persona.role}</h5>
                <h6 className="fw-semibold text-muted small mb-3">{persona.headline}</h6>
                <p className="text-muted small lh-base fst-italic mt-auto mb-0 border-top pt-3">
                  "{persona.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-5 px-3 px-md-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="text-center mb-5">
            <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-semibold mb-2">
              Got Questions?
            </div>
            <h2 className="display-6 fw-bold text-dark mb-2">Frequently Asked Questions</h2>
            <p className="text-muted small">
              Everything you need to know about FinTrack accounting rules, multi-user ledgers, and data privacy.
            </p>
          </div>

          <div className="d-flex flex-column gap-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card border rounded-3 p-3 bg-white shadow-xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="btn btn-link text-decoration-none text-dark d-flex align-items-center justify-content-between w-100 p-0 text-start fw-semibold"
                  style={{ fontSize: '15px' }}
                >
                  <span>{faq.q}</span>
                  {faqIndex === idx ? (
                    <FaChevronUp className="text-primary flex-shrink-0 ms-2" size={12} />
                  ) : (
                    <FaChevronDown className="text-muted flex-shrink-0 ms-2" size={12} />
                  )}
                </button>
                {faqIndex === idx && (
                  <div className="mt-3 pt-3 border-top text-muted small lh-base">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Converting CTA Banner right before Footer */}
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

export default LandingPage;
