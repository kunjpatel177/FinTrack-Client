import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'yearly', label: 'Yearly' },
];

const PAYMENT_METHODS = [
  'Bank Transfer',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Cash',
  'Other',
];

const RecurringFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  recurringToEdit = null,
}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [frequency, setFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const res = await api.get('/categories');
          if (res.data.success) {
            setCategories(res.data.data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      loadCategories();
    }
  }, [isOpen]);

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (filteredCategories.length > 0 && !category) {
      setCategory(filteredCategories[0]._id);
    }
  }, [type, filteredCategories, category]);

  useEffect(() => {
    if (recurringToEdit) {
      setType(recurringToEdit.type);
      setAmount(recurringToEdit.amount.toString());
      setCategory(recurringToEdit.category?._id || recurringToEdit.category || '');
      setDescription(recurringToEdit.description);
      setPaymentMethod(recurringToEdit.paymentMethod || 'Bank Transfer');
      setFrequency(recurringToEdit.frequency);
      setStartDate(
        recurringToEdit.startDate
          ? new Date(recurringToEdit.startDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setEndDate(
        recurringToEdit.endDate
          ? new Date(recurringToEdit.endDate).toISOString().slice(0, 10)
          : ''
      );
      setIsActive(recurringToEdit.isActive !== false);
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDescription('');
      setPaymentMethod('Bank Transfer');
      setFrequency('monthly');
      setStartDate(new Date().toISOString().slice(0, 10));
      setEndDate('');
      setIsActive(true);
    }
  }, [recurringToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a positive amount');
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        type,
        amount: parseFloat(amount),
        category,
        description: description.trim(),
        paymentMethod,
        frequency,
        startDate,
        endDate: endDate || null,
        isActive,
      };

      if (recurringToEdit) {
        await api.put(`/recurring/${recurringToEdit._id}`, payload);
        toast.success('Recurring rule updated successfully');
      } else {
        await api.post('/recurring', payload);
        toast.success('Recurring rule created successfully');
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save recurring rule';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recurringToEdit ? 'Edit Recurring Schedule' : 'Schedule Recurring Transaction'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {/* Type Toggle */}
        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn py-2 fw-semibold ${
              type === 'expense' ? 'btn-danger' : 'btn-outline-secondary'
            }`}
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
          >
            Recurring Expense / Bill
          </button>
          <button
            type="button"
            className={`btn py-2 fw-semibold ${
              type === 'income' ? 'btn-success' : 'btn-outline-secondary'
            }`}
            onClick={() => {
              setType('income');
              setCategory('');
            }}
          >
            Recurring Income / Salary
          </button>
        </div>

        {/* Amount */}
        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Amount *</label>
          <div className="input-group">
            <span className="input-group-text bg-light fw-bold">
              {user?.currency === 'USD' ? '$' : user?.currency === 'EUR' ? '€' : user?.currency === 'GBP' ? '£' : '₹'}
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              className="form-control form-control-lg form-control-custom fw-semibold"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Description *</label>
          <input
            type="text"
            required
            className="form-control form-control-custom"
            placeholder="e.g. Netflix Subscription, Apartment Rent, Gym"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category & Frequency Row */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Category *</label>
            <select
              className="form-select form-select-custom"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select category</option>
              {filteredCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Frequency *</label>
            <select
              className="form-select form-select-custom"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Method & Start Date */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Payment Method</label>
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

          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Start Date *</label>
            <input
              type="date"
              required
              className="form-control form-control-custom"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        {/* End Date (Optional) */}
        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">End Date (Optional)</label>
          <input
            type="date"
            className="form-control form-control-custom"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div className="form-text small">Leave empty if the recurrence continues indefinitely.</div>
        </div>

        {/* Active Toggle (if editing) */}
        {recurringToEdit && (
          <div className="form-check form-switch mb-3 p-3 bg-light rounded-3 border">
            <input
              className="form-check-input ms-0 me-2"
              type="checkbox"
              id="activeRecurringCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label className="form-check-label fw-medium" htmlFor="activeRecurringCheck">
              Rule Status: {isActive ? 'Active' : 'Paused / Inactive'}
            </label>
          </div>
        )}

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
            {loading ? 'Saving...' : recurringToEdit ? 'Save Changes' : 'Schedule Recurring'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecurringFormModal;
