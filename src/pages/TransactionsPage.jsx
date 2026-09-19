import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryIcon } from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import {
  FaSearch,
  FaFilter,
  FaFileCsv,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUndo,
  FaReceipt,
} from 'react-icons/fa';

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Bank Transfer',
  'Net Banking',
  'Other',
];

const TransactionsPage = () => {
  const { currency } = useAuth();
  const { refreshKey, triggerGlobalRefresh } = useOutletContext() || {};

  // Filters State
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data State
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState(null);
  const [txToDelete, setTxToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch transactions with applied filters
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (type) params.append('type', type);
      if (category) params.append('category', category);
      if (paymentMethod) params.append('paymentMethod', paymentMethod);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await api.get(`/transactions?${params.toString()}`);
      if (res.data.success) {
        setTransactions(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      toast.error('Could not load transactions');
    } finally {
      setLoading(false);
    }
  }, [search, type, category, paymentMethod, startDate, endDate, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshKey]);

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setCategory('');
    setPaymentMethod('');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
    setPage(1);
  };

  const handleExportCsv = async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (type) params.append('type', type);
      if (category) params.append('category', category);
      if (paymentMethod) params.append('paymentMethod', paymentMethod);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await api.get(`/transactions/export/csv?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fintrack_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV exported successfully');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!txToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/transactions/${txToDelete._id}`);
      toast.success('Transaction deleted successfully');
      setIsDeleteOpen(false);
      setTxToDelete(null);
      fetchTransactions();
      if (triggerGlobalRefresh) triggerGlobalRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete transaction');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  return (
    <div className="container-fluid p-0">
      {/* Header bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Transactions</h4>
          <p className="text-muted small mb-0">
            Manage, filter, and inspect your income and expense transactions.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="btn btn-outline-secondary btn-dashboard-action d-flex align-items-center gap-2 px-3 py-2 fw-medium"
            title="Download CSV of current filtered transactions"
          >
            <FaFileCsv className="text-success" size={16} />
            <span className="d-none d-sm-inline">Export CSV</span>
          </button>

          <button
            onClick={() => {
              setTxToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="btn btn-primary-custom d-flex align-items-center gap-2 px-3 py-2"
          >
            <FaPlus size={12} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-fintrack p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Search box */}
          <div className="col-12 col-md-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light text-muted border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control form-control-custom border-start-0 ps-0"
                placeholder="Search description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Type filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm form-select-custom"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Types</option>
              <option value="expense">Expense Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm form-select-custom"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm form-select-custom"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Payment Modes</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Date range inputs */}
          <div className="col-6 col-md-2">
            <input
              type="date"
              className="form-control form-control-sm form-control-custom"
              placeholder="From date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              title="Start Date"
            />
          </div>

          <div className="col-6 col-md-1 text-end">
            <button
              onClick={handleResetFilters}
              className="btn btn-sm btn-light border text-muted w-100"
              title="Reset all filters"
            >
              <FaUndo size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="card-fintrack overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Fetching transactions..." />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={FaReceipt}
            title="No transactions found"
            description="Try adjusting your search filters or record a new transaction."
            actionText="Record First Transaction"
            onAction={() => {
              setTxToEdit(null);
              setIsFormModalOpen(true);
            }}
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table-fintrack mb-0">
                <thead>
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('date')}>
                      <div className="d-flex align-items-center gap-1">
                        <span>Date</span>
                        {sortBy === 'date' ? (
                          sortOrder === 'asc' ? <FaSortAmountUp size={11} /> : <FaSortAmountDown size={11} />
                        ) : (
                          <FaSort size={11} />
                        )}
                      </div>
                    </th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Payment Method</th>
                    <th
                      className="text-end"
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleSort('amount')}
                    >
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        <span>Amount</span>
                        {sortBy === 'amount' ? (
                          sortOrder === 'asc' ? <FaSortAmountUp size={11} /> : <FaSortAmountDown size={11} />
                        ) : (
                          <FaSort size={11} />
                        )}
                      </div>
                    </th>
                    <th className="text-center" style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td className="text-muted small text-nowrap">{formatDate(tx.date)}</td>
                      <td>
                        <div className="fw-semibold text-dark">{tx.description}</div>
                        {tx.notes && (
                          <div className="text-muted text-truncate" style={{ fontSize: '0.775rem', maxWidth: '280px' }}>
                            {tx.notes}
                          </div>
                        )}
                        {tx.isShared && (
                          <span className="badge bg-light text-muted border py-0 px-1" style={{ fontSize: '0.65rem' }}>
                            Shared Household
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className="badge px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                          style={{
                            backgroundColor: `${tx.category?.color || '#3b82f6'}20`,
                            color: tx.category?.color || '#3b82f6',
                            fontSize: '0.775rem',
                          }}
                        >
                          {getCategoryIcon(tx.category?.icon)}
                          <span>{tx.category?.name || 'Uncategorized'}</span>
                        </span>
                      </td>
                      <td className="text-muted small">{tx.paymentMethod}</td>
                      <td
                        className={`text-end fw-bold fs-6 ${
                          tx.isRefund || tx.type === 'income' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        <div>
                          {tx.isRefund || tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount, currency)}
                        </div>
                        {tx.isRefund && (
                          <span
                            className="badge bg-success-subtle text-success border border-success-subtle py-0 px-1"
                            style={{ fontSize: '0.65rem' }}
                          >
                            Expense Refund / Credit
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-inline-flex align-items-center gap-1">
                          <button
                            onClick={() => {
                              setTxToEdit(tx);
                              setIsFormModalOpen(true);
                            }}
                            className="btn btn-sm btn-light border-0 p-1 text-muted rounded-circle"
                            title="Edit transaction"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setTxToDelete(tx);
                              setIsDeleteOpen(true);
                            }}
                            className="btn btn-sm btn-light border-0 p-1 text-danger rounded-circle"
                            title="Delete transaction"
                          >
                            <FaTrashAlt size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="p-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="text-muted small">
                Showing{' '}
                <strong>
                  {Math.min(pagination.totalCount, (pagination.page - 1) * limit + 1)} -{' '}
                  {Math.min(pagination.totalCount, pagination.page * limit)}
                </strong>{' '}
                of <strong>{pagination.totalCount}</strong> transactions
              </div>

              <div className="d-flex align-items-center gap-1">
                <button
                  className="btn btn-sm btn-light border px-3"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span className="px-2 small text-muted">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </span>
                <button
                  className="btn btn-sm btn-light border px-3"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setTxToEdit(null);
        }}
        transactionToEdit={txToEdit}
        onSuccess={() => {
          fetchTransactions();
          if (triggerGlobalRefresh) triggerGlobalRefresh();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setTxToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${txToDelete?.description}" of ${formatCurrency(txToDelete?.amount, currency)}? This cannot be undone.`}
        confirmText="Yes, Delete"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default TransactionsPage;
