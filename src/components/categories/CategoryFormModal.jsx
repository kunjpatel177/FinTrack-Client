import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { AVAILABLE_ICONS, getCategoryIcon } from '../../utils/icons';

const PRESET_COLORS = [
  '#f97316',
  '#06b6d4',
  '#ec4899',
  '#eab308',
  '#8b5cf6',
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#6366f1',
  '#14b8a6',
  '#f59e0b',
  '#64748b',
];

const CategoryFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit = null,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [icon, setIcon] = useState('FaTag');
  const [color, setColor] = useState('#3b82f6');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setIcon(categoryToEdit.icon || 'FaTag');
      setColor(categoryToEdit.color || '#3b82f6');
    } else {
      setName('');
      setType('expense');
      setIcon('FaTag');
      setColor('#3b82f6');
    }
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        type,
        icon,
        color,
      };

      if (categoryToEdit) {
        await api.put(`/categories/${categoryToEdit._id}`, payload);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', payload);
        toast.success('Custom category created successfully');
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save category';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoryToEdit ? 'Edit Category' : 'Create Custom Category'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {!categoryToEdit && (
          <div className="btn-group w-100 mb-3" role="group">
            <button
              type="button"
              className={`btn py-2 fw-semibold ${
                type === 'expense' ? 'btn-danger' : 'btn-outline-secondary'
              }`}
              onClick={() => setType('expense')}
            >
              Expense Category
            </button>
            <button
              type="button"
              className={`btn py-2 fw-semibold ${
                type === 'income' ? 'btn-success' : 'btn-outline-secondary'
              }`}
              onClick={() => setType('income')}
            >
              Income Category
            </button>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Category Name *</label>
          <input
            type="text"
            required
            className="form-control form-control-custom"
            placeholder="e.g. Pet Care, Software Subscriptions, Gym"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        {/* Color Picker */}
        <div className="mb-3">
          <label className="form-label fw-medium text-muted small">Badge Color</label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className="rounded-circle border-0 d-flex align-items-center justify-content-center"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: c,
                  outline: color === c ? '3px solid #0f172a' : 'none',
                  outlineOffset: '2px',
                  cursor: 'pointer',
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Icon Picker */}
        <div className="mb-4">
          <label className="form-label fw-medium text-muted small">Select Icon</label>
          <div
            className="d-flex flex-wrap gap-2 p-2 border rounded-3 bg-light"
            style={{ maxHeight: '160px', overflowY: 'auto' }}
          >
            {AVAILABLE_ICONS.map((icoName) => (
              <button
                key={icoName}
                type="button"
                className={`btn btn-sm ${
                  icon === icoName ? 'btn-primary' : 'btn-white border'
                } p-2 rounded-2 d-flex align-items-center justify-content-center`}
                style={{ width: '38px', height: '38px', fontSize: '1rem' }}
                onClick={() => setIcon(icoName)}
                title={icoName}
              >
                {getCategoryIcon(icoName)}
              </button>
            ))}
          </div>
        </div>

        {/* Preview badge */}
        <div className="mb-4 p-3 bg-light rounded-3 text-center">
          <span className="small text-muted d-block mb-1">Preview</span>
          <span
            className="badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2"
            style={{ backgroundColor: color, color: '#ffffff', fontSize: '0.9rem' }}
          >
            {getCategoryIcon(icon)}
            <span>{name || 'Category Name'}</span>
          </span>
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
            {loading ? 'Saving...' : categoryToEdit ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
