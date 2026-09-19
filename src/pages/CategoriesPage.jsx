import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getCategoryIcon } from '../utils/icons';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CategoryFormModal from '../components/categories/CategoryFormModal';
import { FaTags, FaPlus, FaEdit, FaTrashAlt, FaLock } from 'react-icons/fa';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('expense');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/categories/${categoryToDelete._id}`);
      toast.success('Category removed successfully');
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Category Management</h4>
          <p className="text-muted small mb-0">
            Organize transactions and budgets with default & custom financial tags.
          </p>
        </div>

        <button
          onClick={() => {
            setCategoryToEdit(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary-custom d-flex align-items-center gap-2 px-3 py-2"
        >
          <FaPlus size={12} />
          <span>Add Custom Category</span>
        </button>
      </div>

      {/* Type Switcher Tabs */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2">
        <button
          className={`btn px-4 py-2 rounded-pill fw-medium ${
            activeTab === 'expense'
              ? 'btn-danger'
              : 'btn-light text-muted'
          }`}
          onClick={() => setActiveTab('expense')}
        >
          Expense Categories ({categories.filter((c) => c.type === 'expense').length})
        </button>
        <button
          className={`btn px-4 py-2 rounded-pill fw-medium ${
            activeTab === 'income'
              ? 'btn-success'
              : 'btn-light text-muted'
          }`}
          onClick={() => setActiveTab('income')}
        >
          Income Categories ({categories.filter((c) => c.type === 'income').length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching categories..." />
      ) : (
        <div className="row g-3">
          {filteredCategories.map((cat) => (
            <div key={cat._id} className="col-12 col-sm-6 col-md-4 col-xl-3">
              <div className="card-fintrack p-3 h-100 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3 text-truncate">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '44px',
                      height: '44px',
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                      fontSize: '1.25rem',
                    }}
                  >
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div className="text-truncate">
                    <div className="fw-semibold text-dark text-truncate">{cat.name}</div>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {cat.isDefault ? (
                        <span className="d-inline-flex align-items-center gap-1">
                          <FaLock size={9} /> Default System
                        </span>
                      ) : (
                        'Custom User Tag'
                      )}
                    </span>
                  </div>
                </div>

                {!cat.isDefault ? (
                  <div className="d-flex align-items-center gap-1">
                    <button
                      onClick={() => {
                        setCategoryToEdit(cat);
                        setIsFormOpen(true);
                      }}
                      className="btn btn-sm btn-light border-0 p-1 text-muted rounded-circle"
                      title="Edit custom category"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setIsDeleteOpen(true);
                      }}
                      className="btn btn-sm btn-light border-0 p-1 text-danger rounded-circle"
                      title="Delete category"
                    >
                      <FaTrashAlt size={13} />
                    </button>
                  </div>
                ) : (
                  <span
                    className="badge bg-light text-muted border"
                    style={{ fontSize: '0.7rem' }}
                  >
                    System
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setCategoryToEdit(null);
        }}
        categoryToEdit={categoryToEdit}
        onSuccess={fetchCategories}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Custom Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? If any transactions are attached to it, the server will safely reject deletion.`}
        confirmText="Delete Category"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default CategoriesPage;
