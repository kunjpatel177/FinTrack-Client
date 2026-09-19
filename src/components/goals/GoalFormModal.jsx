import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';
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

const GoalFormModal = ({ isOpen, onClose, onSuccess, goalToEdit = null }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSavedAmount, setCurrentSavedAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Savings');
  const [description, setDescription] = useState('');
  const [deductFromBalance, setDeductFromBalance] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name);
      setTargetAmount(goalToEdit.targetAmount.toString());
      setCurrentSavedAmount(goalToEdit.currentSavedAmount.toString());
      setTargetDate(
        goalToEdit.targetDate
          ? new Date(goalToEdit.targetDate).toISOString().slice(0, 10)
          : ''
      );
      setCategory(goalToEdit.category || 'Savings');
      setDescription(goalToEdit.description || '');
      setDeductFromBalance(true);
      setPaymentMethod('Bank Transfer');
      setDate(new Date().toISOString().slice(0, 10));
    } else {
      setName('');
      setTargetAmount('');
      setCurrentSavedAmount('');
      // Default 6 months from today
      const d = new Date();
      d.setMonth(d.getMonth() + 6);
      setTargetDate(d.toISOString().slice(0, 10));
      setCategory('Savings');
      setDescription('');
      setDeductFromBalance(true);
      setPaymentMethod('Bank Transfer');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [goalToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a goal name');
      return;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }

    if (!targetDate) {
      toast.error('Please select a target completion date');
      return;
    }

    setLoading(true);

    try {
      const parsedSaved = currentSavedAmount ? parseFloat(currentSavedAmount) : 0;
      const payload = {
        name: name.trim(),
        targetAmount: parseFloat(targetAmount),
        currentSavedAmount: parsedSaved,
        targetDate,
        category,
        description: description.trim(),
        createTransaction: deductFromBalance,
        paymentMethod: deductFromBalance ? paymentMethod : undefined,
        date: deductFromBalance ? date : undefined,
      };

      if (goalToEdit) {
        const res = await api.put(`/goals/${goalToEdit._id}`, payload);
        toast.success(res.data?.message || 'Savings goal updated successfully');
      } else {
        const res = await api.post('/goals', payload);
        toast.success(res.data?.message || 'Savings goal created successfully');
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save goal';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? 'Edit Savings Goal' : 'Create New Financial Goal'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Goal Title *</label>
          <input
            type="text"
            required
            className="form-control form-control-custom"
            placeholder="e.g. Emergency Fund, New Laptop, Home Downpayment"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Target Amount *</label>
            <div className="input-group">
              <span className="input-group-text bg-light fw-bold">
                {user?.currency === 'USD' ? '$' : user?.currency === 'EUR' ? '€' : user?.currency === 'GBP' ? '£' : '₹'}
              </span>
              <input
                type="number"
                step="1"
                min="1"
                required
                className="form-control form-control-custom"
                placeholder="100000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Already Saved</label>
            <div className="input-group">
              <span className="input-group-text bg-light fw-bold">
                {user?.currency === 'USD' ? '$' : user?.currency === 'EUR' ? '€' : user?.currency === 'GBP' ? '£' : '₹'}
              </span>
              <input
                type="number"
                step="1"
                min="0"
                className="form-control form-control-custom"
                placeholder="0"
                value={currentSavedAmount}
                onChange={(e) => setCurrentSavedAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Balance and Net Savings sync controls if Already Saved is specified */}
        {((!goalToEdit && (parseFloat(currentSavedAmount) || 0) > 0) ||
          (goalToEdit && (parseFloat(currentSavedAmount) || 0) !== (goalToEdit.currentSavedAmount || 0))) && (
          <div className="p-3 mb-3 bg-light rounded-3 border">
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="deductBalanceSwitch"
                checked={deductFromBalance}
                onChange={(e) => setDeductFromBalance(e.target.checked)}
              />
              <label className="form-check-label fw-semibold text-dark small" htmlFor="deductBalanceSwitch">
                {goalToEdit
                  ? 'Sync Saved Difference with Balance & Net Savings'
                  : 'Deduct from Account Balance & Net Savings'}
              </label>
            </div>
            <div className="text-muted small mb-2">
              {goalToEdit
                ? 'Creates a linked adjustment transaction under Savings & Investments reflecting in your net balance and net savings.'
                : 'Creates a linked transaction under Savings & Investments, allocating these funds from your net balance and unallocated net savings into this goal.'}
            </div>

            {deductFromBalance && (
              <div className="row g-2 mt-1">
                <div className="col-6">
                  <label className="form-label text-muted small mb-1">Payment Method</label>
                  <select
                    className="form-select form-select-sm"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small mb-1">Transaction Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Target Date *</label>
            <input
              type="date"
              required
              className="form-control form-control-custom"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Category Tag</label>
            <select
              className="form-select form-select-custom"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Savings">General Savings</option>
              <option value="Emergency">Emergency Buffer</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Tech & Electronics">Tech & Electronics</option>
              <option value="Travel & Leisure">Travel & Leisure</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Education">Education</option>
              <option value="Investment">Investment</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium text-muted small">Description or Milestone Notes</label>
          <textarea
            className="form-control form-control-custom"
            rows="2"
            placeholder="What is this goal for? Motivation notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
            {loading ? 'Saving...' : goalToEdit ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalFormModal;
