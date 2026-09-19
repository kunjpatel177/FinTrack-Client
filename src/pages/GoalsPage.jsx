import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import GoalFormModal from '../components/goals/GoalFormModal';
import ContributionModal from '../components/goals/ContributionModal';
import GoalWithdrawModal from '../components/goals/GoalWithdrawModal';
import {
  FaBullseye,
  FaPlus,
  FaCoins,
  FaEdit,
  FaTrashAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
} from 'react-icons/fa';

const GoalsPage = () => {
  const { currency } = useAuth();
  const { refreshKey, triggerGlobalRefresh } = useOutletContext() || {};
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [activeGoalForDeposit, setActiveGoalForDeposit] = useState(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [activeGoalForWithdraw, setActiveGoalForWithdraw] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals');
      if (res.data.success) {
        setGoals(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals, refreshKey]);

  const handleDeleteConfirm = async () => {
    if (!goalToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await api.delete(`/goals/${goalToDelete._id}`);
      const refunded = res.data?.data?.refundedAmount;
      if (refunded > 0) {
        toast.success(
          `Goal removed! ${formatCurrency(refunded, currency)} refunded to your account balance and deducted from monthly expenses.`
        );
      } else {
        toast.success('Savings goal deleted');
      }
      setIsDeleteOpen(false);
      setGoalToDelete(null);
      fetchGoals();
      if (triggerGlobalRefresh) triggerGlobalRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete goal');
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeGoals = goals.filter((g) => g.status !== 'completed');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Financial Savings Goals</h4>
          <p className="text-muted small mb-0">
            Track milestones for emergency reserves, dream electronics, vacations, and investments.
          </p>
        </div>

        <button
          onClick={() => {
            setGoalToEdit(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary-custom d-flex align-items-center gap-2 px-3 py-2"
        >
          <FaPlus size={12} />
          <span>Create New Goal</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating goal milestones and savings pace..." />
      ) : goals.length === 0 ? (
        <EmptyState
          icon={FaBullseye}
          title="No financial goals set yet"
          description="Setting clear financial targets is the fastest way to build disciplined wealth. Create your first goal today!"
          actionText="Create First Savings Goal"
          onAction={() => {
            setGoalToEdit(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <>
          {/* Active Goals Section */}
          <div className="mb-5">
            <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
              <span>Active Goals</span>
              <span className="badge bg-primary-subtle text-primary rounded-pill small">
                {activeGoals.length}
              </span>
            </h5>

            <div className="row g-3">
              {activeGoals.map((goal) => (
                <div key={goal._id} className="col-12 col-md-6 col-xl-4">
                  <div className="card-fintrack p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      {/* Top badge and actions */}
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <span className="badge bg-light text-muted border text-capitalize">
                          {goal.category || 'Savings'}
                        </span>

                        <div className="d-flex align-items-center gap-1">
                          <button
                            onClick={() => {
                              setGoalToEdit(goal);
                              setIsFormOpen(true);
                            }}
                            className="btn btn-sm btn-light border-0 p-1 text-muted rounded-circle"
                            title="Edit goal"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setGoalToDelete(goal);
                              setIsDeleteOpen(true);
                            }}
                            className="btn btn-sm btn-light border-0 p-1 text-danger rounded-circle"
                            title="Delete goal"
                          >
                            <FaTrashAlt size={13} />
                          </button>
                        </div>
                      </div>

                      <h5 className="fw-bold mb-1 text-dark text-truncate" title={goal.name}>
                        {goal.name}
                      </h5>

                      {goal.description && (
                        <p className="text-muted small mb-3 text-truncate" title={goal.description}>
                          {goal.description}
                        </p>
                      )}

                      {/* Saved vs Target metrics */}
                      <div className="d-flex align-items-baseline justify-content-between mb-2">
                        <div>
                          <span className="text-muted small">Saved: </span>
                          <span className="fw-bold fs-5 text-dark">
                            {formatCurrency(goal.currentSavedAmount, currency)}
                          </span>
                        </div>
                        <div className="text-muted small">
                          Target: {formatCurrency(goal.targetAmount, currency)}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="progress mb-2" style={{ height: '10px' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${goal.percentage}%` }}
                        />
                      </div>

                      <div className="d-flex justify-content-between text-muted small mb-3">
                        <span>{goal.percentage}% Completed</span>
                        <span>{formatCurrency(goal.remaining, currency)} remaining</span>
                      </div>
                    </div>

                    {/* Footer with target date and deposit/withdraw buttons */}
                    <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-1 text-muted small">
                        <FaClock size={12} />
                        <span>
                          {goal.daysRemaining > 0
                            ? `${goal.daysRemaining} days left`
                            : 'Target date reached'}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {goal.currentSavedAmount > 0 && (
                          <button
                            onClick={() => {
                              setActiveGoalForWithdraw(goal);
                              setIsWithdrawOpen(true);
                            }}
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-2 py-1 fw-medium"
                            title="Withdraw saved funds back to your account balance"
                          >
                            <FaMoneyBillWave size={12} />
                            <span>Withdraw</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActiveGoalForDeposit(goal);
                            setIsContributionOpen(true);
                          }}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 px-3 py-1 fw-medium"
                        >
                          <FaCoins size={12} />
                          <span>Deposit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Goals Section */}
          {completedGoals.length > 0 && (
            <div>
              <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2 text-muted">
                <span>Completed Milestones</span>
                <span className="badge bg-success-subtle text-success rounded-pill small">
                  {completedGoals.length}
                </span>
              </h5>

              <div className="row g-3">
                {completedGoals.map((goal) => (
                  <div key={goal._id} className="col-12 col-md-6 col-xl-4">
                    <div className="card-fintrack p-4 h-100 bg-light-subtle border-success-subtle">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 py-1 px-2">
                          <FaCheckCircle /> Goal Completed 🎉
                        </span>

                        <button
                          onClick={() => {
                            setGoalToDelete(goal);
                            setIsDeleteOpen(true);
                          }}
                          className="btn btn-sm btn-light border-0 p-1 text-muted rounded-circle"
                          title="Delete archive"
                        >
                          <FaTrashAlt size={13} />
                        </button>
                      </div>

                      <h5 className="fw-bold mb-1 text-dark">{goal.name}</h5>
                      <p className="text-muted small mb-3">
                        Achieved target of {formatCurrency(goal.targetAmount, currency)}!
                      </p>

                      <div className="progress mb-2" style={{ height: '8px' }}>
                        <div className="progress-bar bg-success" style={{ width: '100%' }} />
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <span className="text-muted small">
                          Completed on {formatDate(goal.targetDate)}
                        </span>
                        {goal.currentSavedAmount > 0 && (
                          <button
                            onClick={() => {
                              setActiveGoalForWithdraw(goal);
                              setIsWithdrawOpen(true);
                            }}
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-2 py-1 fw-medium"
                            title="Withdraw saved funds to account balance"
                          >
                            <FaMoneyBillWave size={12} />
                            <span>Withdraw</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Goal Modal */}
      <GoalFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setGoalToEdit(null);
        }}
        goalToEdit={goalToEdit}
        onSuccess={() => {
          fetchGoals();
          if (triggerGlobalRefresh) triggerGlobalRefresh();
        }}
      />

      {/* Add Contribution Modal */}
      <ContributionModal
        isOpen={isContributionOpen}
        onClose={() => {
          setIsContributionOpen(false);
          setActiveGoalForDeposit(null);
        }}
        goal={activeGoalForDeposit}
        onSuccess={() => {
          fetchGoals();
          if (triggerGlobalRefresh) triggerGlobalRefresh();
        }}
      />

      {/* Withdraw Modal */}
      <GoalWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => {
          setIsWithdrawOpen(false);
          setActiveGoalForWithdraw(null);
        }}
        goal={activeGoalForWithdraw}
        onSuccess={() => {
          fetchGoals();
          if (triggerGlobalRefresh) triggerGlobalRefresh();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setGoalToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Savings Goal"
        message={
          goalToDelete?.status !== 'completed' && (goalToDelete?.currentSavedAmount || 0) > 0
            ? `Are you sure you want to remove "${goalToDelete?.name}"? Since this goal is not completed, your accumulated savings of ${formatCurrency(
                goalToDelete?.currentSavedAmount,
                currency
              )} will be refunded back to your account balance, deducting from your monthly expenses and restoring your net balance.`
            : `Are you sure you want to remove "${goalToDelete?.name}"? Your saved funds data will be removed.`
        }
        confirmText={
          goalToDelete?.status !== 'completed' && (goalToDelete?.currentSavedAmount || 0) > 0
            ? 'Remove & Refund Funds'
            : 'Remove Goal'
        }
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default GoalsPage;
