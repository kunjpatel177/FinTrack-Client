import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { getCategoryIcon } from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import BudgetFormModal from '../components/budgets/BudgetFormModal';
import {
  FaChartPie,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHistory,
} from 'react-icons/fa';

const monthsList = [
  { num: 1, name: 'January' },
  { num: 2, name: 'February' },
  { num: 3, name: 'March' },
  { num: 4, name: 'April' },
  { num: 5, name: 'May' },
  { num: 6, name: 'June' },
  { num: 7, name: 'July' },
  { num: 8, name: 'August' },
  { num: 9, name: 'September' },
  { num: 10, name: 'October' },
  { num: 11, name: 'November' },
  { num: 12, name: 'December' },
];

const BudgetsPage = () => {
  const { currency } = useAuth();
  const { refreshKey, triggerGlobalRefresh } = useOutletContext() || {};
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [budgetsData, setBudgetsData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const [bRes, hRes] = await Promise.all([
        api.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`),
        api.get('/budgets/history'),
      ]);

      if (bRes.data.success) {
        setBudgetsData(bRes.data.data);
      }
      if (hRes.data.success) {
        setHistoryData(hRes.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets, refreshKey]);

  const handleDeleteConfirm = async () => {
    if (!budgetToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/budgets/${budgetToDelete._id}`);
      toast.success('Budget removed');
      setIsDeleteOpen(false);
      setBudgetToDelete(null);
      fetchBudgets();
      if (triggerGlobalRefresh) triggerGlobalRefresh();
    } catch (err) {
      toast.error('Failed to delete budget');
    } finally {
      setDeleteLoading(false);
    }
  };

  const { budgets = [], summary = {} } = budgetsData || {};

  return (
    <div className="container-fluid p-0">
      {/* Header & Controls */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Budget Planning & Controls</h4>
          <p className="text-muted small mb-0">
            Enforce spending limits per category or across your entire monthly wallet.
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Month/Year selector */}
          <div className="d-flex align-items-center gap-2 bg-white p-1 rounded-3 border shadow-sm">
            <select
              className="form-select form-select-sm border-0 fw-semibold text-dark"
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

          <button
            onClick={() => {
              setBudgetToEdit(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary-custom d-flex align-items-center gap-2 px-3 py-2"
          >
            <FaPlus size={12} />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating real-time budget usage..." />
      ) : (
        <>
          {/* Total Monthly Summary Banner */}
          {summary.totalBudget > 0 && (
            <div className="card-fintrack p-4 mb-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    {monthsList[selectedMonth - 1]?.name} {selectedYear} Overall Budget
                  </h5>
                  <span className="text-muted small">
                    Combined across all allocated categories
                  </span>
                </div>

                <div className="text-end">
                  <div className="fs-5 fw-bold text-dark">
                    {formatCurrency(summary.totalSpent, currency)}{' '}
                    <span className="text-muted fs-6 fw-normal">
                      / {formatCurrency(summary.totalBudget, currency)}
                    </span>
                  </div>
                  <span
                    className={`badge rounded-pill ${
                      summary.overallPercentage >= 100
                        ? 'bg-danger text-white'
                        : summary.overallPercentage >= 80
                        ? 'bg-warning text-dark'
                        : 'bg-success text-white'
                    }`}
                  >
                    {summary.overallPercentage}% Used
                  </span>
                </div>
              </div>

              <div className="progress mb-2" style={{ height: '12px' }}>
                <div
                  className={`progress-bar ${
                    summary.overallPercentage >= 100
                      ? 'bg-danger'
                      : summary.overallPercentage >= 80
                      ? 'bg-warning'
                      : 'bg-success'
                  }`}
                  role="progressbar"
                  style={{ width: `${Math.min(summary.overallPercentage, 100)}%` }}
                />
              </div>

              <div className="d-flex justify-content-between text-muted small">
                <span>0%</span>
                <span>Remaining: {formatCurrency(summary.remaining, currency)}</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Budget Cards Grid */}
          {budgets.length === 0 ? (
            <EmptyState
              icon={FaChartPie}
              title={`No budgets set for ${monthsList[selectedMonth - 1]?.name} ${selectedYear}`}
              description="Establish spending targets to keep your expenses under control."
              actionText="Set First Budget"
              onAction={() => {
                setBudgetToEdit(null);
                setIsFormOpen(true);
              }}
            />
          ) : (
            <div className="row g-3 mb-5">
              {budgets.map((b) => {
                const isExceeded = b.status === 'exceeded';
                const isWarning = b.status === 'warning';

                return (
                  <div key={b._id} className="col-12 col-md-6 col-xl-4">
                    <div className="card-fintrack p-3 h-100 d-flex flex-column justify-content-between">
                      <div>
                        {/* Card Header */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: '36px',
                                height: '36px',
                                backgroundColor: b.category ? `${b.category.color}20` : '#eff6ff',
                                color: b.category ? b.category.color : '#2563eb',
                                fontSize: '1rem',
                              }}
                            >
                              {getCategoryIcon(b.category?.icon)}
                            </span>
                            <div>
                              <div className="fw-semibold text-dark">
                                {b.category ? b.category.name : 'Overall Total Budget'}
                              </div>
                              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {b.isOverall ? 'All Categories' : 'Category-specific'}
                              </span>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-1">
                            <button
                              onClick={() => {
                                setBudgetToEdit(b);
                                setIsFormOpen(true);
                              }}
                              className="btn btn-sm btn-light border-0 p-1 text-muted rounded-circle"
                              title="Edit budget"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setBudgetToDelete(b);
                                setIsDeleteOpen(true);
                              }}
                              className="btn btn-sm btn-light border-0 p-1 text-danger rounded-circle"
                              title="Delete budget"
                            >
                              <FaTrashAlt size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Amounts display */}
                        <div className="d-flex align-items-baseline justify-content-between mb-2">
                          <div>
                            <span className="text-muted small">Spent: </span>
                            <span className="fw-bold fs-5 text-dark">
                              {formatCurrency(b.spent, currency)}
                            </span>
                          </div>
                          <div className="text-muted small">
                            Limit: {formatCurrency(b.amount, currency)}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="progress mb-2" style={{ height: '8px' }}>
                          <div
                            className={`progress-bar ${
                              isExceeded
                                ? 'bg-danger'
                                : isWarning
                                ? 'bg-warning'
                                : 'bg-primary'
                            }`}
                            role="progressbar"
                            style={{ width: `${Math.min(b.percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Status indicator footer */}
                      <div className="pt-2 border-top d-flex align-items-center justify-content-between mt-2">
                        <span className="small text-muted">
                          {b.percentage}% utilized
                        </span>

                        {isExceeded ? (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1">
                            <FaExclamationTriangle size={10} /> Exceeded by {formatCurrency(b.spent - b.amount, currency)}
                          </span>
                        ) : isWarning ? (
                          <span className="badge bg-warning-subtle text-warning border border-warning-subtle d-inline-flex align-items-center gap-1">
                            <FaExclamationTriangle size={10} /> Near Limit ({formatCurrency(b.remaining, currency)} left)
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
                            <FaCheckCircle size={10} /> {formatCurrency(b.remaining, currency)} Left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Historical Budget Performance Section */}
          <div className="card-fintrack mb-4">
            <div className="card-header-clean">
              <div className="d-flex align-items-center gap-2">
                <FaHistory className="text-primary" />
                <h5 className="mb-0 fs-6 fw-semibold">Past 6 Months Budget Variance</h5>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table-fintrack mb-0">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="text-end">Budget Allocated</th>
                    <th className="text-end">Actual Expenses</th>
                    <th className="text-end">Surplus / Deficit</th>
                    <th className="text-center">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((h, i) => {
                    const isOver = h.variance < 0;
                    return (
                      <tr key={`history-${i}`}>
                        <td className="fw-semibold text-dark">{h.month}</td>
                        <td className="text-end text-muted">{formatCurrency(h.budget, currency)}</td>
                        <td className="text-end fw-semibold text-dark">{formatCurrency(h.spent, currency)}</td>
                        <td
                          className={`text-end fw-bold ${
                            isOver ? 'text-danger' : 'text-success'
                          }`}
                        >
                          {isOver ? '-' : '+'}
                          {formatCurrency(Math.abs(h.variance), currency)}
                        </td>
                        <td className="text-center">
                          {h.budget === 0 ? (
                            <span className="badge bg-light text-muted border">No Budget Set</span>
                          ) : isOver ? (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                              Exceeded
                            </span>
                          ) : (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              Within Budget
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add / Edit Budget Modal */}
      <BudgetFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setBudgetToEdit(null);
        }}
        budgetToEdit={budgetToEdit}
        initialMonth={selectedMonth}
        initialYear={selectedYear}
        onSuccess={() => {
          fetchBudgets();
          if (triggerGlobalRefresh) triggerGlobalRefresh();
        }}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setBudgetToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Remove Budget"
        message="Are you sure you want to remove this budget? Your transaction history will not be affected."
        confirmText="Remove Budget"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default BudgetsPage;
