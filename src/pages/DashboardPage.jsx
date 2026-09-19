import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryIcon } from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import BudgetFormModal from '../components/budgets/BudgetFormModal';
import GoalFormModal from '../components/goals/GoalFormModal';
import BalanceAdjustmentModal from '../components/dashboard/BalanceAdjustmentModal';
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaPiggyBank,
  FaPlus,
  FaReceipt,
  FaBullseye,
  FaChartPie,
  FaChevronRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSlidersH,
} from 'react-icons/fa';

const monthsList = [
  { num: 1, name: 'Jan' },
  { num: 2, name: 'Feb' },
  { num: 3, name: 'Mar' },
  { num: 4, name: 'Apr' },
  { num: 5, name: 'May' },
  { num: 6, name: 'Jun' },
  { num: 7, name: 'Jul' },
  { num: 8, name: 'Aug' },
  { num: 9, name: 'Sep' },
  { num: 10, name: 'Oct' },
  { num: 11, name: 'Nov' },
  { num: 12, name: 'Dec' },
];

const DashboardPage = () => {
  const { currency } = useAuth();
  const { openNewTransaction, refreshKey, triggerGlobalRefresh } = useOutletContext();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [summaryData, setSummaryData] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick action modals state
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, chartsRes] = await Promise.all([
        api.get(`/dashboard/summary?month=${selectedMonth}&year=${selectedYear}`),
        api.get(`/dashboard/charts?month=${selectedMonth}&year=${selectedYear}`),
      ]);

      if (summaryRes.data.success) {
        setSummaryData(summaryRes.data.data);
      }
      if (chartsRes.data.success) {
        setChartsData(chartsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  if (loading && !summaryData) {
    return <LoadingSpinner message="Assembling your financial intelligence..." />;
  }

  const {
    totalBalance = 0,
    monthlyIncome = 0,
    monthlyExpense = 0,
    netSavings = 0,
    savingsRate = 0,
    budgetSummary = {},
    recentTransactions = [],
    goalsSnapshot = [],
  } = summaryData || {};

  return (
    <div className="container-fluid p-0">
      {/* Month Filter & Quick Actions Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        {/* Month Selector */}
        <div className="d-flex align-items-center gap-2 bg-white p-1 rounded-3 border shadow-sm">
          <select
            className="form-select form-select-sm border-0 fw-semibold text-dark"
            style={{ width: '90px' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
          >
            {monthsList.map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm border-0 fw-semibold text-dark"
            style={{ width: '85px' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Action Button Group */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            onClick={() => openNewTransaction('income')}
            className="btn btn-sm btn-outline-success btn-dashboard-action d-flex align-items-center gap-1 px-3 py-2 fw-medium"
          >
            <FaArrowUp size={11} />
            <span>Add Income</span>
          </button>

          <button
            onClick={() => openNewTransaction('expense')}
            className="btn btn-sm btn-outline-danger btn-dashboard-action d-flex align-items-center gap-1 px-3 py-2 fw-medium"
          >
            <FaArrowDown size={11} />
            <span>Add Expense</span>
          </button>

          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="btn btn-sm btn-outline-primary btn-dashboard-action d-flex align-items-center gap-1 px-3 py-2 fw-medium"
          >
            <FaChartPie size={11} />
            <span>Create Budget</span>
          </button>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="btn btn-sm btn-outline-secondary btn-dashboard-action d-flex align-items-center gap-1 px-3 py-2 fw-medium"
          >
            <FaBullseye size={11} />
            <span>Add Goal</span>
          </button>

          <button
            onClick={() => setIsBalanceModalOpen(true)}
            className="btn btn-sm btn-outline-dark btn-dashboard-action d-flex align-items-center gap-1 px-3 py-2 fw-medium"
            title="Set opening balance or reconcile in-between balance"
          >
            <FaSlidersH size={11} />
            <span>Adjust Balance</span>
          </button>
        </div>
      </div>

      {/* 4 Hero Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Net Balance"
            value={formatCurrency(totalBalance, currency)}
            subtitle={
              summaryData?.startingBalance
                ? `Base: ${formatCurrency(summaryData.startingBalance, currency)}`
                : 'All-time cumulative balance'
            }
            icon={FaWallet}
            iconBg="#eff6ff"
            iconColor="#2563eb"
            trend={totalBalance >= 0 ? 'Healthy' : 'Deficit'}
            trendType={totalBalance >= 0 ? 'positive' : 'negative'}
            action={{
              text: 'Adjust',
              icon: FaSlidersH,
              onClick: () => setIsBalanceModalOpen(true),
              title: 'Set opening balance or reconcile in-between balance',
            }}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Monthly Income"
            value={formatCurrency(monthlyIncome, currency)}
            subtitle={`${monthsList[selectedMonth - 1]?.name} ${selectedYear}`}
            icon={FaArrowUp}
            iconBg="#ecfdf5"
            iconColor="#10b981"
            trend="Received"
            trendType="positive"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(monthlyExpense, currency)}
            subtitle={`${monthsList[selectedMonth - 1]?.name} ${selectedYear}`}
            icon={FaArrowDown}
            iconBg="#fef2f2"
            iconColor="#ef4444"
            trend="Spent"
            trendType="negative"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Net Savings & Rate"
            value={formatCurrency(netSavings, currency)}
            subtitle={`${savingsRate}% savings rate`}
            icon={FaPiggyBank}
            iconBg="#fffbeb"
            iconColor="#f59e0b"
            trend={`${savingsRate}% Saved`}
            trendType={netSavings >= 0 ? 'positive' : 'negative'}
          />
        </div>
      </div>

      {/* Monthly Budget Summary Banner */}
      {budgetSummary && budgetSummary.totalBudget > 0 && (
        <div className="card-fintrack p-3 mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold text-dark">
                {monthsList[selectedMonth - 1]?.name} Budget Burn Rate
              </span>
              {budgetSummary.status === 'exceeded' ? (
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1">
                  <FaExclamationTriangle size={10} /> Budget Exceeded!
                </span>
              ) : budgetSummary.status === 'warning' ? (
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle d-inline-flex align-items-center gap-1">
                  <FaExclamationTriangle size={10} /> Approaching Limit ({budgetSummary.percentage}%)
                </span>
              ) : (
                <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
                  <FaCheckCircle size={10} /> On Track ({budgetSummary.percentage}%)
                </span>
              )}
            </div>

            <div className="text-muted small">
              Spent <strong>{formatCurrency(budgetSummary.totalSpent, currency)}</strong> of{' '}
              <strong>{formatCurrency(budgetSummary.totalBudget, currency)}</strong> (
              {formatCurrency(budgetSummary.remaining, currency)} remaining)
            </div>
          </div>

          <div className="progress" style={{ height: '10px' }}>
            <div
              className={`progress-bar ${
                budgetSummary.status === 'exceeded'
                  ? 'bg-danger'
                  : budgetSummary.status === 'warning'
                  ? 'bg-warning'
                  : 'bg-primary'
              }`}
              role="progressbar"
              style={{ width: `${Math.min(budgetSummary.percentage, 100)}%` }}
              aria-valuenow={budgetSummary.percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="row g-3 mb-4">
        {/* Income vs Expense 6-Month Bar Chart */}
        <div className="col-12 col-lg-7">
          <div className="card-fintrack h-100">
            <div className="card-header-clean">
              <div>
                <h5 className="mb-0 fs-6 fw-semibold">Income vs Expenses (Past 6 Months)</h5>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Comparing net inflows and outflows
                </span>
              </div>
            </div>
            <div className="p-3">
              <IncomeExpenseChart data={chartsData?.monthlyTrend || []} height={280} />
            </div>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="col-12 col-lg-5">
          <div className="card-fintrack h-100">
            <div className="card-header-clean">
              <div>
                <h5 className="mb-0 fs-6 fw-semibold">Spending by Category</h5>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {monthsList[selectedMonth - 1]?.name} {selectedYear} distribution
                </span>
              </div>
            </div>
            <div className="p-3">
              <CategoryPieChart data={chartsData?.categorySpending || []} height={280} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Spending Trend Area Chart */}
      <div className="card-fintrack mb-4">
        <div className="card-header-clean">
          <div>
            <h5 className="mb-0 fs-6 fw-semibold">Cash Flow & Spending Trajectory</h5>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              Historical cash flow trend across recent operating months
            </span>
          </div>
        </div>
        <div className="p-3">
          <SpendingTrendChart data={chartsData?.monthlyTrend || []} height={240} />
        </div>
      </div>

      {/* Bottom Section: Recent Transactions & Goals Snapshot */}
      <div className="row g-3 mb-4">
        {/* Recent Transactions */}
        <div className="col-12 col-lg-8">
          <div className="card-fintrack h-100">
            <div className="card-header-clean">
              <h5 className="mb-0 fs-6 fw-semibold">Recent Transactions</h5>
              <Link
                to="/transactions"
                className="text-decoration-none text-primary fw-medium small d-flex align-items-center gap-1"
              >
                View All <FaChevronRight size={10} />
              </Link>
            </div>

            <div className="table-responsive">
              {recentTransactions.length === 0 ? (
                <div className="p-4 text-center text-muted small">
                  No transactions recorded yet. Click "Add Expense" or "Add Income" to start.
                </div>
              ) : (
                <table className="table-fintrack mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Payment</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx._id}>
                        <td className="text-muted small">{formatDate(tx.date)}</td>
                        <td>
                          <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>
                            {tx.description}
                          </div>
                          {tx.isShared && (
                            <span className="badge bg-light text-muted border py-0" style={{ fontSize: '0.65rem' }}>
                              Shared
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className="badge px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                            style={{
                              backgroundColor: `${tx.category?.color || '#3b82f6'}20`,
                              color: tx.category?.color || '#3b82f6',
                              fontSize: '0.75rem',
                            }}
                          >
                            {getCategoryIcon(tx.category?.icon)}
                            <span>{tx.category?.name || 'Other'}</span>
                          </span>
                        </td>
                        <td className="text-muted small">{tx.paymentMethod}</td>
                        <td
                          className={`text-end fw-bold ${
                            tx.isRefund || tx.type === 'income' ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {tx.isRefund || tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Goals Progress Snapshot */}
        <div className="col-12 col-lg-4">
          <div className="card-fintrack h-100">
            <div className="card-header-clean">
              <h5 className="mb-0 fs-6 fw-semibold">Savings Goals</h5>
              <Link
                to="/goals"
                className="text-decoration-none text-primary fw-medium small d-flex align-items-center gap-1"
              >
                All Goals <FaChevronRight size={10} />
              </Link>
            </div>

            <div className="p-3">
              {goalsSnapshot.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <FaBullseye size={32} className="text-muted opacity-50 mb-2" />
                  <p className="mb-2">No active financial goals.</p>
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Create a Goal
                  </button>
                </div>
              ) : (
                goalsSnapshot.map((goal) => (
                  <div key={goal.id} className="mb-3 pb-3 border-bottom border-light last-border-none">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-dark text-truncate me-2 small">
                        {goal.name}
                      </span>
                      <span className="badge bg-light text-primary border" style={{ fontSize: '0.75rem' }}>
                        {goal.progressPercentage}%
                      </span>
                    </div>

                    <div className="progress mb-1" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>

                    <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                      <span>Saved: {formatCurrency(goal.currentSavedAmount, currency)}</span>
                      <span>Target: {formatCurrency(goal.targetAmount, currency)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Budget Modal */}
      <BudgetFormModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
          triggerGlobalRefresh();
        }}
        initialMonth={selectedMonth}
        initialYear={selectedYear}
      />

      {/* Quick Goal Modal */}
      <GoalFormModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
          triggerGlobalRefresh();
        }}
      />

      {/* Net Balance Management & Reconciliation Modal */}
      <BalanceAdjustmentModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        currentBalance={totalBalance}
        startingBalance={summaryData?.startingBalance || 0}
        onSuccess={() => {
          fetchDashboardData();
          triggerGlobalRefresh();
        }}
      />
    </div>
  );
};

export default DashboardPage;
