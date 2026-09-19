import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryIcon } from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import InviteMemberModal from '../components/household/InviteMemberModal';
import {
  FaUsers,
  FaPlus,
  FaUserPlus,
  FaSignOutAlt,
  FaTrashAlt,
  FaReceipt,
  FaCrown,
  FaUserShield,
  FaUser,
  FaCheck,
  FaCopy,
} from 'react-icons/fa';

const HouseholdPage = () => {
  const { user, currency, updateUser } = useAuth();
  const [householdData, setHouseholdData] = useState(null);
  const [sharedTransactions, setSharedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Creation & Join States
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [joinToken, setJoinToken] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  const fetchHousehold = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/household');
      if (res.data.success && res.data.data) {
        setHouseholdData(res.data.data);
        // Also fetch shared transactions
        const txRes = await api.get('/household/transactions');
        if (txRes.data.success) {
          setSharedTransactions(txRes.data.data);
        }
      } else {
        setHouseholdData(null);
        setSharedTransactions([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHousehold();
  }, [fetchHousehold]);

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    if (!newHouseholdName.trim()) {
      toast.error('Please enter a household name');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/household', { name: newHouseholdName.trim() });
      toast.success('Household created successfully');
      setNewHouseholdName('');
      if (user) {
        updateUser({ ...user, activeHousehold: res.data.data._id });
      }
      fetchHousehold();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create household');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinHousehold = async (e) => {
    e.preventDefault();
    if (!joinToken.trim()) {
      toast.error('Please enter an invitation token');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post('/household/accept-invite', { token: joinToken.trim() });
      toast.success(res.data.message || 'Joined household successfully');
      setJoinToken('');
      if (user) {
        updateUser({ ...user, activeHousehold: res.data.data._id });
      }
      fetchHousehold();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired invitation token');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    setActionLoading(true);
    try {
      await api.delete(`/household/members/${memberToRemove.user._id}`);
      toast.success('Member removed from household');
      setIsRemoveOpen(false);
      setMemberToRemove(null);
      fetchHousehold();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveHousehold = async () => {
    setActionLoading(true);
    try {
      const res = await api.post('/household/leave');
      toast.info(res.data.message || 'Left household');
      setIsLeaveOpen(false);
      if (user) {
        updateUser({ ...user, activeHousehold: null });
      }
      fetchHousehold();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave household');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading household sharing environment..." />;
  }

  // If user is not currently in any household
  if (!householdData || !householdData.household) {
    return (
      <div className="container-fluid p-0">
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Household & Shared Expenses</h4>
          <p className="text-muted small mb-0">
            Collaborate with family members or roommates to budget and track collective expenses.
          </p>
        </div>

        <div className="row g-4 justify-content-center pt-2">
          {/* Create Household Card */}
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card-fintrack p-4 h-100">
              <div
                className="rounded-circle bg-primary-subtle text-primary p-3 d-inline-flex mb-3"
                style={{ width: '54px', height: '54px' }}
              >
                <FaUsers size={24} />
              </div>
              <h5 className="fw-bold mb-2">Create a New Household</h5>
              <p className="text-muted small mb-4">
                Start a shared finance space for your home. You'll become the owner and can invite members via email.
              </p>

              <form onSubmit={handleCreateHousehold}>
                <div className="mb-3">
                  <label className="form-label fw-medium text-muted small">Household Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-custom"
                    placeholder="e.g. Sharma Family, 4th Floor Flatmates"
                    value={newHouseholdName}
                    onChange={(e) => setNewHouseholdName(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn btn-primary-custom w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
                >
                  <FaPlus size={12} />
                  <span>{actionLoading ? 'Creating...' : 'Create Household'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Join Household Card */}
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card-fintrack p-4 h-100">
              <div
                className="rounded-circle bg-success-subtle text-success p-3 d-inline-flex mb-3"
                style={{ width: '54px', height: '54px' }}
              >
                <FaCheck size={24} />
              </div>
              <h5 className="fw-bold mb-2">Join Existing Household</h5>
              <p className="text-muted small mb-4">
                Have an invitation token from a roommate or spouse? Paste it here to join their shared group.
              </p>

              <form onSubmit={handleJoinHousehold}>
                <div className="mb-3">
                  <label className="form-label fw-medium text-muted small">Invitation Token *</label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-custom"
                    placeholder="Paste 48-character token..."
                    value={joinToken}
                    onChange={(e) => setJoinToken(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn btn-outline-success btn-dashboard-action w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
                >
                  <span>{actionLoading ? 'Verifying...' : 'Accept Invitation & Join'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { household, pendingInvites = [], stats = {} } = householdData;
  const currentMemberRole =
    household.members.find((m) => m.user?._id === user?.id || m.user === user?.id)?.role || 'member';
  const isOwnerOrAdmin = ['owner', 'admin'].includes(currentMemberRole);

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold mb-0">{household.name}</h4>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
              Active Household
            </span>
          </div>
          <p className="text-muted small mb-0 mt-1">
            Owner: <strong>{household.owner?.name}</strong> • Your Role:{' '}
            <strong className="text-capitalize">{currentMemberRole}</strong>
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {isOwnerOrAdmin && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="btn btn-primary-custom d-flex align-items-center gap-2 px-3 py-2"
            >
              <FaUserPlus size={14} />
              <span>Invite Member</span>
            </button>
          )}

          <button
            onClick={() => setIsLeaveOpen(true)}
            className="btn btn-outline-danger btn-dashboard-action d-flex align-items-center gap-2 px-3 py-2"
            title="Leave household"
          >
            <FaSignOutAlt size={14} />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Banner */}
      <div className="card-fintrack p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4 border-end-md">
            <span className="text-muted text-uppercase fw-semibold small">
              This Month's Shared Outflow
            </span>
            <h3 className="fw-bold text-dark mt-1 mb-0">
              {formatCurrency(stats.totalSharedMonthExpense || 0, currency)}
            </h3>
            <span className="text-muted small">
              Total shared expenses logged across all members
            </span>
          </div>

          <div className="col-12 col-md-8">
            <span className="text-muted text-uppercase fw-semibold small d-block mb-2">
              Spending Breakdown by Member
            </span>
            <div className="d-flex flex-wrap gap-3">
              {stats.memberSpending?.length === 0 ? (
                <span className="text-muted small">No shared expenses logged yet this month.</span>
              ) : (
                stats.memberSpending?.map((ms) => (
                  <div key={ms.userId} className="p-2 px-3 bg-light rounded-3 border">
                    <div className="fw-semibold text-dark small">{ms.userName}</div>
                    <div className="fw-bold text-primary">{formatCurrency(ms.totalSpent, currency)}</div>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {ms.count} transaction{ms.count > 1 ? 's' : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Household Members List */}
      <div className="card-fintrack mb-4">
        <div className="card-header-clean">
          <h5 className="mb-0 fs-6 fw-semibold">Household Members ({household.members?.length})</h5>
        </div>

        <div className="table-responsive">
          <table className="table-fintrack mb-0">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Joined Date</th>
                {isOwnerOrAdmin && <th className="text-end">Manage</th>}
              </tr>
            </thead>
            <tbody>
              {household.members?.map((m) => {
                const memberUser = m.user;
                const isThisUser = memberUser?._id === user?.id;
                const isTargetOwner = memberUser?._id === household.owner?._id;

                return (
                  <tr key={memberUser?._id || Math.random()}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {memberUser?.avatar ? (
                          <img
                            src={memberUser.avatar}
                            alt=""
                            className="rounded-circle border"
                            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-light text-primary border d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
                          >
                            {memberUser?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold text-dark">
                            {memberUser?.name} {isThisUser && <span className="text-muted">(You)</span>}
                          </div>
                          <div className="text-muted small">{memberUser?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge d-inline-flex align-items-center gap-1 rounded-pill ${
                          m.role === 'owner'
                            ? 'bg-warning-subtle text-warning border border-warning-subtle'
                            : m.role === 'admin'
                            ? 'bg-primary-subtle text-primary border border-primary-subtle'
                            : 'bg-light text-muted border'
                        }`}
                      >
                        {m.role === 'owner' && <FaCrown size={10} />}
                        {m.role === 'admin' && <FaUserShield size={10} />}
                        {m.role === 'member' && <FaUser size={10} />}
                        <span className="text-capitalize">{m.role}</span>
                      </span>
                    </td>
                    <td className="text-muted small">{formatDate(m.joinedAt)}</td>
                    {isOwnerOrAdmin && (
                      <td className="text-end">
                        {!isTargetOwner && !isThisUser && (
                          <button
                            onClick={() => {
                              setMemberToRemove(m);
                              setIsRemoveOpen(true);
                            }}
                            className="btn btn-sm btn-outline-danger border-0 p-1 rounded-circle"
                            title="Remove member"
                          >
                            <FaTrashAlt size={13} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Invitations (if owner or admin) */}
      {isOwnerOrAdmin && pendingInvites.length > 0 && (
        <div className="card-fintrack mb-4">
          <div className="card-header-clean">
            <h5 className="mb-0 fs-6 fw-semibold">Pending Invitations ({pendingInvites.length})</h5>
          </div>
          <div className="table-responsive">
            <table className="table-fintrack mb-0">
              <thead>
                <tr>
                  <th>Invited Email</th>
                  <th>Role</th>
                  <th>Token</th>
                  <th>Expires</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingInvites.map((inv) => (
                  <tr key={inv._id}>
                    <td className="fw-semibold text-dark">{inv.email}</td>
                    <td>
                      <span className="badge bg-light text-muted border text-capitalize">
                        {inv.role}
                      </span>
                    </td>
                    <td>
                      <code className="text-primary small">{inv.token}</code>
                    </td>
                    <td className="text-muted small">{formatDate(inv.expiresAt)}</td>
                    <td className="text-end">
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/accept-invite?token=${inv.token}`;
                          navigator.clipboard.writeText(link);
                          toast.info('Join link copied to clipboard');
                        }}
                        className="btn btn-sm btn-light border px-2 py-1 small d-inline-flex align-items-center gap-1"
                      >
                        <FaCopy size={11} /> Copy Link
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shared Transactions History */}
      <div className="card-fintrack">
        <div className="card-header-clean">
          <div className="d-flex align-items-center gap-2">
            <FaReceipt className="text-primary" />
            <h5 className="mb-0 fs-6 fw-semibold">Shared Household Transactions</h5>
          </div>
        </div>

        <div className="table-responsive">
          {sharedTransactions.length === 0 ? (
            <div className="p-4 text-center text-muted small">
              No shared expenses recorded yet. When adding an expense, check "Share with Household" to log it here.
            </div>
          ) : (
            <table className="table-fintrack mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Paid By</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Payment Method</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sharedTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="text-muted small text-nowrap">{formatDate(tx.date)}</td>
                    <td>
                      <div className="fw-semibold small text-dark">{tx.user?.name}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{tx.description}</div>
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
                        <span>{tx.category?.name || 'Category'}</span>
                      </span>
                    </td>
                    <td className="text-muted small">{tx.paymentMethod}</td>
                    <td className="text-end fw-bold text-danger">
                      -{formatCurrency(tx.amount, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={fetchHousehold}
      />

      {/* Remove Member Confirm Dialog */}
      <ConfirmDialog
        isOpen={isRemoveOpen}
        onClose={() => {
          setIsRemoveOpen(false);
          setMemberToRemove(null);
        }}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.user?.name} from this household? They will lose access to shared expenses.`}
        confirmText="Remove Member"
        confirmVariant="danger"
        loading={actionLoading}
      />

      {/* Leave Household Confirm Dialog */}
      <ConfirmDialog
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        onConfirm={handleLeaveHousehold}
        title="Leave Household"
        message="Are you sure you want to leave this household? You will no longer see shared expenses."
        confirmText="Leave Household"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default HouseholdPage;
