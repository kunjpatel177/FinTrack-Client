import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const monthsList = [
  { num: 1, name: 'January' },
  { num: 2, name: 'February' },
  { num: 3, name: 'March' },
  { num: 4, name: 'April' },
  { num: 5, name: 'May' },
  { num: 6, name: 'June' },
  { num: 7, name: 'July' },
  { num: 8, name: 'August' },
  { num: 9, name: 'September' },
  { num: 10, name: 'October' },
  { num: 11, name: 'November' },
  { num: 12, name: 'December' },
];

const BudgetFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  budgetToEdit = null,
  initialMonth = new Date().getMonth() + 1,
  initialYear = new Date().getFullYear(),
}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const res = await api.get('/categories');
          if (res.data.success) {
            // Only expense categories can have budgets
            setCategories(res.data.data.filter((c) => c.type === 'expense'));
          }
        } catch (err) {
          console.error(err);
        }
      };
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category?._id || '');
      setMonth(budgetToEdit.month);
      setYear(budgetToEdit.year);
      setAmount(budgetToEdit.amount.toString());
    } else {
      setCategory('');
      setMonth(initialMonth);
      setYear(initialYear);
      setAmount('');
    }
  }, [budgetToEdit, isOpen, initialMonth, initialYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid positive budget amount');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        category: category || null, // null = overall monthly budget
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        amount: parseFloat(amount),
      };

      if (budgetToEdit) {
        await api.put(`/budgets/${budgetToEdit._id}`, { amount: parseFloat(amount) });
        toast.success('Budget limit updated successfully');
      } else {
        await api.post('/budgets', payload);
        toast.success('New budget set successfully');
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save budget';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? 'Update Budget Limit' : 'Set New Monthly Budget'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {/* Category selection */}
        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Category (Optional)</label>
          <select
            className="form-select form-select-custom"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!!budgetToEdit}
          >
            <option value="">Overall Total Monthly Budget (All categories)</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="form-text small">
            Leave as "Overall" to set a limit on your total monthly expenses across all categories.
          </div>
        </div>

        {/* Amount */}
        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Budget Limit Amount *</label>
          <div className="input-group">
            <span className="input-group-text bg-light fw-bold">
              {user?.currency === 'USD' ? '$' : user?.currency === 'EUR' ? '€' : user?.currency === 'GBP' ? '£' : '₹'}
            </span>
            <input
              type="number"
              step="1"
              min="1"
              required
              className="form-control form-control-lg form-control-custom fw-semibold"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Month & Year Row */}
        <div className="row g-2 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Month</label>
            <select
              className="form-select form-select-custom"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={!!budgetToEdit}
            >
              {monthsList.map((m) => (
                <option key={m.num} value={m.num}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-medium text-muted small">Year</label>
            <input
              type="number"
              min="2020"
              max="2035"
              className="form-control form-control-custom"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={!!budgetToEdit}
            />
          </div>
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
            {loading ? 'Saving...' : budgetToEdit ? 'Update Budget' : 'Save Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetFormModal;
