import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { getCategoryIcon } from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import {
  FaChartBar,
  FaCalendarAlt,
  FaPiggyBank,
  FaArrowDown,
  FaArrowUp,
  FaCreditCard,
  FaReceipt,
} from 'react-icons/fa';

const TIMEFRAMES = [
  { value: '1month', label: 'This Month' },
  { value: '3months', label: 'Past 3 Months' },
  { value: '6months', label: 'Past 6 Months' },
  { value: '1year', label: 'Past Year' },
  { value: 'all', label: 'All History' },
];

const ReportsPage = () => {
  const { currency } = useAuth();
  const { refreshKey } = useOutletContext() || {};
  const [timeframe, setTimeframe] = useState('6months');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reports/analytics?timeframe=${timeframe}`);
      if (res.data.success) {
        setAnalyticsData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load reports analytics');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics, refreshKey]);

  const {
    summary = {},
    monthlyTrends = [],
    categorySpending = [],
    topCategories = [],
    paymentMethodStats = [],
  } = analyticsData || {};

  return (
    <div className="container-fluid p-0">
      {/* Header & Timeframe selector */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Financial Intelligence & Reports</h4>
          <p className="text-muted small mb-0">
            Deep dive into historical cash flows, category allocations, and wealth velocity.
          </p>
        </div>

        <div className="d-flex align-items-center gap-1 bg-white p-1 rounded-3 border shadow-sm">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`btn btn-sm px-3 py-1 rounded-2 fw-medium ${
                timeframe === tf.value
                  ? 'btn-primary'
                  : 'btn-light text-muted border-0'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Aggregating financial intelligence..." />
      ) : (
        <>
          {/* Executive KPI Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                    Total Inflow
                  </span>
                  <div className="stat-icon-wrapper bg-success-subtle text-success">
                    <FaArrowUp />
                  </div>
                </div>
                <div className="stat-val text-success">
                  {formatCurrency(summary.totalIncome, currency)}
                </div>
                <span className="text-muted small">Total income received</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                    Total Outflow
                  </span>
                  <div className="stat-icon-wrapper bg-danger-subtle text-danger">
                    <FaArrowDown />
                  </div>
                </div>
                <div className="stat-val text-danger">
                  {formatCurrency(summary.totalExpense, currency)}
                </div>
                <span className="text-muted small">Total expenses paid</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                    Net Capital Saved
                  </span>
                  <div className="stat-icon-wrapper bg-primary-subtle text-primary">
                    <FaPiggyBank />
                  </div>
                </div>
                <div className="stat-val text-primary">
                  {formatCurrency(summary.netSavings, currency)}
                </div>
                <span className="text-muted small">{summary.savingsRate}% overall savings rate</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stat-card">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                    Monthly Burn Rate
                  </span>
                  <div className="stat-icon-wrapper bg-warning-subtle text-warning">
                    <FaCalendarAlt />
                  </div>
                </div>
                <div className="stat-val text-dark">
                  {formatCurrency(summary.avgMonthlyExpense, currency)}
                </div>
                <span className="text-muted small">Avg expense across {summary.monthCount} mo</span>
              </div>
            </div>
          </div>

          {/* Recharts Grid */}
          <div className="row g-3 mb-4">
            {/* Monthly Trend Grouped Bar */}
            <div className="col-12 col-lg-7">
              <div className="card-fintrack h-100">
                <div className="card-header-clean">
                  <div>
                    <h5 className="mb-0 fs-6 fw-semibold">Monthly Inflow vs Outflow</h5>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Grouped bars comparing monthly volume
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <IncomeExpenseChart data={monthlyTrends} height={300} />
                </div>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="col-12 col-lg-5">
              <div className="card-fintrack h-100">
                <div className="card-header-clean">
                  <div>
                    <h5 className="mb-0 fs-6 fw-semibold">Expense Allocation by Category</h5>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Distribution across period
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <CategoryPieChart data={categorySpending} height={300} />
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow Trajectory Chart */}
          <div className="card-fintrack mb-4">
            <div className="card-header-clean">
              <div>
                <h5 className="mb-0 fs-6 fw-semibold">Continuous Cash Flow Trajectory</h5>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Smooth trend curves showing sustained financial velocity
                </span>
              </div>
            </div>
            <div className="p-3">
              <SpendingTrendChart data={monthlyTrends} height={260} />
            </div>
          </div>

          {/* Top Categories & Payment Methods Tables */}
          <div className="row g-3">
            {/* Top 5 Spending Categories */}
            <div className="col-12 col-md-6">
              <div className="card-fintrack h-100">
                <div className="card-header-clean">
                  <h5 className="mb-0 fs-6 fw-semibold">Top 5 Spending Categories</h5>
                </div>
                <div className="table-responsive">
                  <table className="table-fintrack mb-0">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th className="text-center">Transactions</th>
                        <th className="text-end">Total Amount</th>
                        <th className="text-end">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCategories.map((cat) => (
                        <tr key={cat.categoryId}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  backgroundColor: `${cat.color}20`,
                                  color: cat.color,
                                  fontSize: '0.85rem',
                                }}
                              >
                                {getCategoryIcon(cat.icon)}
                              </span>
                              <span className="fw-semibold text-dark">{cat.name}</span>
                            </div>
                          </td>
                          <td className="text-center text-muted small">{cat.count}</td>
                          <td className="text-end fw-bold text-dark">
                            {formatCurrency(cat.amount, currency)}
                          </td>
                          <td className="text-end text-muted small">{cat.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="col-12 col-md-6">
              <div className="card-fintrack h-100">
                <div className="card-header-clean">
                  <h5 className="mb-0 fs-6 fw-semibold">Payment Methods Volume</h5>
                </div>
                <div className="table-responsive">
                  <table className="table-fintrack mb-0">
                    <thead>
                      <tr>
                        <th>Payment Mode</th>
                        <th className="text-center">Usage Count</th>
                        <th className="text-end">Total Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentMethodStats.map((pm) => (
                        <tr key={pm._id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <FaCreditCard className="text-primary" />
                              <span className="fw-semibold text-dark">{pm._id}</span>
                            </div>
                          </td>
                          <td className="text-center text-muted small">{pm.count} txs</td>
                          <td className="text-end fw-bold text-dark">
                            {formatCurrency(pm.total, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
