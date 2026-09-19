import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = [
  'Bank Transfer',
  'UPI',
  'Debit Card',
  'Credit Card',
  'Cash',
  'Net Banking',
  'Other',
];

const ContributionModal = ({ isOpen, onClose, onSuccess, goal }) => {
  const { currency } = useAuth();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [deductFromBalance, setDeductFromBalance] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  if (!goal) return null;

  const currentVal = goal.currentSavedAmount || 0;
  const targetVal = goal.targetAmount || 1;
  const addedVal = parseFloat(amount) || 0;
  const projectedTotal = currentVal + addedVal;
  const projectedPct = Math.min(Math.round((projectedTotal / targetVal) * 100), 100);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a positive contribution amount');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/goals/${goal._id}/contribute`, {
        amount: parseFloat(amount),
        note: note.trim(),
        createTransaction: deductFromBalance,
        paymentMethod: deductFromBalance ? paymentMethod : undefined,
        date: deductFromBalance ? date : undefined,
      });

      toast.success(res.data.message || 'Contribution added successfully!');
      setAmount('');
      setNote('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add contribution';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contribute to "${goal.name}"`}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-3 mb-3 bg-light rounded-3 border">
          <div className="d-flex justify-content-between text-muted small mb-1">
            <span>Current Saved</span>
            <span className="fw-semibold text-dark">{formatCurrency(currentVal, currency)}</span>
          </div>
          <div className="d-flex justify-content-between text-muted small mb-2">
            <span>Target Goal</span>
            <span className="fw-semibold text-dark">{formatCurrency(targetVal, currency)}</span>
          </div>

          <div className="progress" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${projectedPct}%` }}
              aria-valuenow={projectedPct}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mt-1">
            <span className="small text-muted">Projected: {projectedPct}%</span>
            {projectedTotal >= targetVal && (
              <span className="badge bg-success-subtle text-success border border-success-subtle py-1" style={{ fontSize: '0.7rem' }}>
                Completes Goal! 🎉
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Contribution Amount *</label>
          <div className="input-group">
            <span className="input-group-text bg-light fw-bold">
              {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
            </span>
            <input
              type="number"
              step="1"
              min="1"
              required
              className="form-control form-control-lg form-control-custom fw-semibold"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Contribution Note</label>
          <input
            type="text"
            className="form-control form-control-custom"
            placeholder="e.g. Freelance bonus deposit, Monthly savings"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Deduct from account balance checkbox */}
        <div className="p-3 bg-light rounded-3 border mb-4">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="deductBalanceCheck"
              checked={deductFromBalance}
              onChange={(e) => setDeductFromBalance(e.target.checked)}
            />
            <label className="form-check-label fw-semibold text-dark small" htmlFor="deductBalanceCheck">
              Deduct from Account Balance (Creates Transaction)
            </label>
          </div>
          <div className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
            When enabled, this savings deposit will be recorded as an expense transaction and deducted from your Net Balance.
          </div>

          {deductFromBalance && (
            <div className="row g-2 mt-2 pt-2 border-top">
              <div className="col-6">
                <label className="form-label fw-medium text-muted small" style={{ fontSize: '0.75rem' }}>Paid Via</label>
                <select
                  className="form-select form-select-sm form-select-custom"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label fw-medium text-muted small" style={{ fontSize: '0.75rem' }}>Deposit Date</label>
                <input
                  type="date"
                  required
                  className="form-control form-control-sm form-control-custom"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
          <button
            type="button"
            className="btn btn-light px-4 fw-medium"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary-custom px-4 fw-medium"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Deposit Savings'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContributionModal;
