import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Bank Transfer',
  'Net Banking',
  'Other',
];

const TransactionFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit = null,
  defaultType = 'expense',
}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load categories
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  // Sync state when editing or opening
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(transactionToEdit.amount.toString());
      setCategory(transactionToEdit.category?._id || transactionToEdit.category || '');
      setDescription(transactionToEdit.description);
      setPaymentMethod(transactionToEdit.paymentMethod || 'UPI');
      setDate(
        transactionToEdit.date
          ? new Date(transactionToEdit.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setNotes(transactionToEdit.notes || '');
      setIsShared(!!transactionToEdit.isShared);
    } else {
      setType(defaultType);
      setAmount('');
      setCategory('');
      setDescription('');
      setPaymentMethod('UPI');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
      setIsShared(false);
    }
  }, [transactionToEdit, isOpen, defaultType]);

  // Filter categories by type
  const filteredCategories = categories.filter((c) => c.type === type);

  // Set default category if none selected or type changed
  useEffect(() => {
    if (filteredCategories.length > 0 && !category) {
      setCategory(filteredCategories[0]._id);
    }
  }, [type, filteredCategories, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid positive amount');
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
        date,
        notes: notes.trim(),
        isShared: !!isShared,
        householdId: isShared && user?.activeHousehold ? (user.activeHousehold._id || user.activeHousehold) : undefined,
      };

      let res;
      if (transactionToEdit) {
        res = await api.put(`/transactions/${transactionToEdit._id}`, payload);
        toast.success('Transaction updated successfully');
      } else {
        res = await api.post('/transactions', payload);
        toast.success('Transaction recorded successfully');

        // Check if budget warning was returned
        if (res.data.budgetAlert) {
          if (res.data.budgetAlert.exceeded) {
            toast.warning(res.data.budgetAlert.message, { autoClose: 7000 });
          } else if (res.data.budgetAlert.warning) {
            toast.info(res.data.budgetAlert.message, { autoClose: 5000 });
          }
        }
      }

      onClose();
      if (onSuccess) onSuccess(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save transaction';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Edit Transaction' : 'Record New Transaction'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {/* Type Toggle Segment */}
        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn py-2 fw-semibold ${
              type === 'expense'
                ? 'btn-danger'
                : 'btn-outline-secondary'
            }`}
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
          >
            Expense
          </button>
          <button
            type="button"
            className={`btn py-2 fw-semibold ${
              type === 'income'
                ? 'btn-success'
                : 'btn-outline-secondary'
            }`}
            onClick={() => {
              setType('income');
              setCategory('');
            }}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
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

        {/* Category & Payment Method Row */}
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
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Payment Method *</label>
            <select
              className="form-select form-select-custom"
              required
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
        </div>

        {/* Description & Date Row */}
        <div className="row g-2 mb-3">
          <div className="col-md-7">
            <label className="form-label fw-medium text-muted small">Description *</label>
            <input
              type="text"
              required
              className="form-control form-control-custom"
              placeholder="e.g. Grocery store, Salary payout, Uber ride"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-md-5">
            <label className="form-label fw-medium text-muted small">Date *</label>
            <input
              type="date"
              required
              className="form-control form-control-custom"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Notes (Optional)</label>
          <textarea
            className="form-control form-control-custom"
            rows="2"
            placeholder="Add any additional context or tags..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Shared with Household Checkbox */}
        {user?.activeHousehold && (
          <div className="form-check form-switch mb-3 p-3 bg-light rounded-3 border">
            <input
              className="form-check-input ms-0 me-2"
              type="checkbox"
              id="sharedHouseholdCheck"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
            />
            <label className="form-check-label fw-medium" htmlFor="sharedHouseholdCheck">
              Share with Household
            </label>
            <div className="text-muted small mt-1">
              Mark this {type} as a shared household expense visible to family members.
            </div>
          </div>
        )}

        {/* Action buttons */}
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
            {loading ? 'Saving...' : transactionToEdit ? 'Save Changes' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
