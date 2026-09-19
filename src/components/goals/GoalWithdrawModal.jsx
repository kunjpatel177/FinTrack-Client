import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';

const PAYMENT_METHODS = [
  'Bank Transfer',
  'UPI',
  'Debit Card',
  'Cash',
  'Net Banking',
  'Other',
];

const GoalWithdrawModal = ({ isOpen, onClose, onSuccess, goal }) => {
  const { currency } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setPaymentMethod('Bank Transfer');
      setDate(new Date().toISOString().slice(0, 10));
      setNote('');
    }
  }, [isOpen]);

  if (!goal) return null;

  const currentVal = goal.currentSavedAmount || 0;
  const numAmount = parseFloat(amount) || 0;
  const remainingAfter = Math.max(0, currentVal - numAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a positive withdrawal amount');
      return;
    }

    if (numAmount > currentVal) {
      toast.error(`Cannot withdraw more than available savings (${formatCurrency(currentVal, currency)})`);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/goals/${goal._id}/withdraw`, {
        amount: numAmount,
        note: note.trim(),
        paymentMethod,
        date,
        createTransaction: true,
      });

      toast.success(res.data.message || 'Funds withdrawn to account balance!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to withdraw from goal';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Withdraw from "${goal.name}"`}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-3 mb-3 bg-light rounded-3 border">
          <div className="d-flex justify-content-between text-muted small mb-1">
            <span>Available in Goal</span>
            <span className="fw-bold text-success fs-6">
              {formatCurrency(currentVal, currency)}
            </span>
          </div>

          <div className="d-flex justify-content-between text-muted small">
            <span>Remaining After</span>
            <span className="fw-semibold text-dark">
              {formatCurrency(remainingAfter, currency)}
            </span>
          </div>
        </div>

        <div className="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-3">
          <FaInfoCircle className="flex-shrink-0" />
          <span>Withdrawn funds will be returned to your spendable Net Balance and deducted from your monthly expenses.</span>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Withdrawal Amount *</label>
          <div className="input-group">
            <span className="input-group-text bg-light fw-bold">
              {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
            </span>
            <input
              type="number"
              step="any"
              min="1"
              max={currentVal}
              required
              className="form-control form-control-lg form-control-custom fw-semibold"
              placeholder="e.g. 2000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
          <div className="d-flex justify-content-between mt-1">
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none small text-primary"
              onClick={() => setAmount(currentVal.toString())}
            >
              Withdraw Full Amount ({formatCurrency(currentVal, currency)})
            </button>
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-6">
            <label className="form-label fw-medium text-muted small">Deposit Into</label>
            <select
              className="form-select form-select-custom"
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
            <label className="form-label fw-medium text-muted small">Date</label>
            <input
              type="date"
              required
              className="form-control form-control-custom"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium text-muted small">Reason / Note</label>
          <input
            type="text"
            className="form-control form-control-custom"
            placeholder="e.g. Emergency medical expense, Planned purchase"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
          <button
            type="button"
            className="btn btn-light px-3"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary-custom px-4 fw-medium d-flex align-items-center gap-2"
            disabled={loading || numAmount <= 0 || numAmount > currentVal}
          >
            <FaMoneyBillWave size={14} />
            <span>{loading ? 'Processing...' : 'Withdraw to Account'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalWithdrawModal;
