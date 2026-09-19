import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { formatDateTime } from '../utils/formatters';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  FaHistory,
  FaReceipt,
  FaChartPie,
  FaBullseye,
  FaUsers,
  FaUserCog,
  FaTrashAlt,
  FaCircle,
} from 'react-icons/fa';

const ACTION_TYPES = [
  { value: '', label: 'All Activities' },
  { value: 'TRANSACTION_CREATE', label: 'Transactions Added' },
  { value: 'TRANSACTION_UPDATE', label: 'Transactions Modified' },
  { value: 'TRANSACTION_DELETE', label: 'Transactions Removed' },
  { value: 'BUDGET_CREATE', label: 'Budgets Configured' },
  { value: 'GOAL_CONTRIBUTION', label: 'Goal Savings Deposits' },
  { value: 'HOUSEHOLD_INVITE', label: 'Household Invites' },
  { value: 'USER_LOGIN', label: 'Logins' },
];

const getActivityIcon = (action) => {
  if (action?.startsWith('TRANSACTION')) return <FaReceipt className="text-primary" />;
  if (action?.startsWith('BUDGET')) return <FaChartPie className="text-warning" />;
  if (action?.startsWith('GOAL')) return <FaBullseye className="text-success" />;
  if (action?.startsWith('HOUSEHOLD')) return <FaUsers className="text-info" />;
  return <FaUserCog className="text-secondary" />;
};

const ActivityLogsPage = () => {
  const [activities, setActivities] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);

  const [isClearOpen, setIsClearOpen] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedAction) params.append('action', selectedAction);
      params.append('page', page.toString());
      params.append('limit', '15');

      const res = await api.get(`/activities?${params.toString()}`);
      if (res.data.success) {
        setActivities(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  }, [selectedAction, page]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleClearConfirm = async () => {
    setClearLoading(true);
    try {
      await api.delete('/activities');
      toast.success('Activity log history cleared');
      setIsClearOpen(false);
      fetchActivities();
    } catch (err) {
      toast.error('Failed to clear logs');
    } finally {
      setClearLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Activity & Audit Timeline</h4>
          <p className="text-muted small mb-0">
            A tamper-evident, chronological trail of all financial actions taken across your account.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Action type filter */}
          <select
            className="form-select form-select-sm form-select-custom"
            style={{ width: '210px' }}
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setPage(1);
            }}
          >
            {ACTION_TYPES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>

          {activities.length > 0 && (
            <button
              onClick={() => setIsClearOpen(true)}
              className="btn btn-outline-danger btn-dashboard-action btn-sm d-flex align-items-center gap-1 px-3 py-2"
              title="Clear all recorded activity history"
            >
              <FaTrashAlt size={12} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving activity timeline..." />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={FaHistory}
          title="No activity records found"
          description="Your financial actions, budget adjustments, and transactions will appear here chronologically."
        />
      ) : (
        <div className="card-fintrack p-4">
          <div className="timeline-container">
            {activities.map((act, index) => (
              <div
                key={act._id}
                className="d-flex align-items-start gap-3 pb-3 mb-3 border-bottom border-light last-border-none"
              >
                <div
                  className="rounded-circle p-2 bg-light border d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '40px', height: '40px', fontSize: '1rem' }}
                >
                  {getActivityIcon(act.action)}
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-1">
                    <span className="fw-semibold text-dark small">{act.description}</span>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {formatDateTime(act.createdAt)}
                    </span>
                  </div>

                  <span className="badge bg-light text-muted border text-capitalize" style={{ fontSize: '0.675rem' }}>
                    {act.action?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pt-3 border-top d-flex align-items-center justify-content-between">
            <span className="text-muted small">
              Page {pagination.page} of {pagination.totalPages || 1} ({pagination.totalCount} events)
            </span>
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-light border px-3"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                className="btn btn-sm btn-light border px-3"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearOpen}
        onClose={() => setIsClearOpen(false)}
        onConfirm={handleClearConfirm}
        title="Clear Activity Logs"
        message="Are you sure you want to delete your activity history? This will erase the audit trail."
        confirmText="Clear History"
        confirmVariant="danger"
        loading={clearLoading}
      />
    </div>
  );
};

export default ActivityLogsPage;
