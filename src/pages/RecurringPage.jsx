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
import RecurringFormModal from '../components/recurring/RecurringFormModal';
import {
  FaCalendarAlt,
  FaPlus,
  FaSyncAlt,
  FaEdit,
  FaTrashAlt,
  FaPlay,
  FaPause,
  FaCheckCircle,
} from 'react-icons/fa';

const RecurringPage = () => {
  const { currency } = useAuth();
  const { refreshKey, triggerGlobalRefresh } = useOutletContext() || {};
  const [recurringList, setRecurringList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRecurring = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/recurring');
      if (res.data.success) {
        setRecurringList(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load recurring transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring, refreshKey]);

  const handleProcessNow = async () => {
    try {
      setProcessing(true);
      const res = await api.post('/recurring/process');
      if (res.data.success) {
        toast.success(res.data.message || 'Processed due transactions');
        fetchRecurring();
        if (triggerGlobalRefresh) triggerGlobalRefresh();
      }
    } catch (err) {
      toast.error('Failed to trigger recurring processor');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await api.put(`/recurring/${item._id}`, { isActive: !item.isActive });
      toast.info(`Schedule ${!item.isActive ? 'resumed' : 'paused'}`);
      fetchRecurring();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/recurring/${itemToDelete._id}`);
      toast.success('Recurring schedule deleted');
      setIsDeleteOpen(false);
      setItemToDelete(null);
      fetchRecurring();
      if (triggerGlobalRefresh) triggerGlobalRefresh();
    } catch (err) {
      toast.error('Failed to delete schedule');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Recurring Bills & Subscriptions</h4>
          <p className="text-muted small mb-0">
            Automate monthly salary inflows, rent payments, streaming services, and utility bills.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleProcessNow}
            disabled={processing}
            className="btn btn-outline-secondary btn-dashboard-action d-flex align-items-center gap-2 px-3 py-2 fw-medium"
            title="Scan and create any transactions due up to today"
          >
            <FaSyncAlt className={processing ? 'fa-spin text-primary' : 'text-primary'} size={14} />
            <span>{processing ? 'Processing...' : 'Process Due Now'}</span>
          </button>

          <button
            onClick={() => {
              setItemToEdit(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary-custom d-flex align-items-center gap-2 px-3 py-2"
          >
            <FaPlus size={12} />
            <span>Schedule Recurring</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading recurring schedules..." />
      ) : recurringList.length === 0 ? (
        <EmptyState
          icon={FaCalendarAlt}
          title="No recurring schedules found"
          description="Never miss a monthly bill or salary deposit. Set up automatic schedules with ease."
          actionText="Schedule First Recurring Item"
          onAction={() => {
            setItemToEdit(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <div className="card-fintrack overflow-hidden">
          <div className="table-responsive">
            <table className="table-fintrack mb-0">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Frequency</th>
                  <th>Next Due Date</th>
                  <th>Payment Method</th>
                  <th className="text-end">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recurringList.map((item) => (
                  <tr key={item._id} className={!item.isActive ? 'opacity-75' : ''}>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          item.isActive
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : 'bg-light text-muted border'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{item.description}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Started on {formatDate(item.startDate)}
                        {item.endDate && ` • Ends ${formatDate(item.endDate)}`}
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                        style={{
                          backgroundColor: `${item.category?.color || '#3b82f6'}20`,
                          color: item.category?.color || '#3b82f6',
                          fontSize: '0.75rem',
                        }}
                      >
                        {getCategoryIcon(item.category?.icon)}
                        <span>{item.category?.name || 'Category'}</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border text-capitalize">
                        {item.frequency}
                      </span>
                    </td>
                    <td className="text-muted small">
                      <span className="fw-medium text-dark">{formatDate(item.nextDueDate)}</span>
                    </td>
                    <td className="text-muted small">{item.paymentMethod}</td>
                    <td
                      className={`text-end fw-bold fs-6 ${
                        item.type === 'income' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'}
                      {formatCurrency(item.amount, currency)}
                    </td>
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className="btn btn-sm btn-light border-0 p-1 text-muted rounded-circle"
                          title={item.isActive ? 'Pause rule' : 'Resume rule'}
                        >
                          {item.isActive ? <FaPause size={12} /> : <FaPlay size={12} />}
                        </button>
                        <button
                          onClick={() => {
                            setItemToEdit(item);
                            setIsFormOpen(true);
                          }}
                          className="btn btn-sm btn-light border-0 p-1 text-muted rounded-circle"
                          title="Edit rule"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setIsDeleteOpen(true);
                          }}
                          className="btn btn-sm btn-light border-0 p-1 text-danger rounded-circle"
                          title="Delete rule"
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
        </div>
      )}

      {/* Add / Edit Recurring Modal */}
      <RecurringFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setItemToEdit(null);
        }}
        recurringToEdit={itemToEdit}
        onSuccess={() => {
          fetchRecurring();
          if (triggerGlobalRefresh) triggerGlobalRefresh();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Recurring Schedule"
        message={`Are you sure you want to remove "${itemToDelete?.description}"? Previous transactions created by this rule will remain in your history.`}
        confirmText="Remove Rule"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default RecurringPage;
