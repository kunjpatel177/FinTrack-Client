import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { FaSlidersH, FaWallet, FaCheck, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';

const PAYMENT_METHODS = [
  'Bank Transfer',
  'UPI',
  'Debit Card',
  'Credit Card',
  'Cash',
  'Net Banking',
  'Other',
];

const BalanceAdjustmentModal = ({
  isOpen,
  onClose,
  currentBalance = 0,
  startingBalance = 0,
  onSuccess,
}) => {
  const { currency, user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('reconcile'); // 'reconcile' | 'starting'

  // Form states
  const [newStartingBalance, setNewStartingBalance] = useState('');
  const [targetBalance, setTargetBalance] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewStartingBalance(startingBalance?.toString() || '0');
      setTargetBalance(currentBalance?.toString() || '0');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [isOpen, startingBalance, currentBalance]);

  const numTarget = parseFloat(targetBalance) || 0;
  const delta = Math.round((numTarget - currentBalance) * 100) / 100;
  const isCredit = delta > 0;
  const isDebit = delta < 0;

  const handleSaveStartingBalance = async (e) => {
    e.preventDefault();
    const num = parseFloat(newStartingBalance);
    if (isNaN(num) || num < 0) {
      toast.error('Starting balance must be a non-negative number');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/balance', {
        mode: 'starting',
        startingBalance: num,
      });

      if (res.data.success) {
        toast.success('Opening starting balance updated!');
        if (user) {
          updateUser({ ...user, startingBalance: num });
        }
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update starting balance');
    } finally {
      setLoading(false);
    }
  };

  const handleReconcileBalance = async (e) => {
    e.preventDefault();
    if (isNaN(numTarget)) {
      toast.error('Please enter a valid target balance');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/balance', {
        mode: 'reconcile',
        targetBalance: numTarget,
        paymentMethod,
        date,
        notes: notes.trim() || undefined,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Balance successfully reconciled!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reconcile balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Net Balance Management"
      size="md"
    >
      {/* Current Balances Header Summary */}
      <div className="bg-light p-3 rounded-3 border mb-3">
        <div className="row g-2 text-center">
          <div className="col-6 border-end">
            <span className="text-muted small d-block">Current Net Balance</span>
            <span className={`fw-bold fs-5 ${currentBalance >= 0 ? 'text-primary' : 'text-danger'}`}>
              {formatCurrency(currentBalance, currency)}
            </span>
          </div>
          <div className="col-6">
            <span className="text-muted small d-block">Opening Base Balance</span>
            <span className="fw-semibold text-dark fs-6">
              {formatCurrency(startingBalance, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="d-flex border-bottom mb-3">
        <button
          type="button"
          className={`btn btn-sm rounded-0 border-0 pb-2 px-3 fw-semibold ${
            activeTab === 'reconcile'
              ? 'text-primary border-bottom border-primary border-2'
              : 'text-muted'
          }`}
          onClick={() => setActiveTab('reconcile')}
        >
          <FaExchangeAlt className="me-1" size={12} />
          Reconcile Balance (In Between)
        </button>

        <button
          type="button"
          className={`btn btn-sm rounded-0 border-0 pb-2 px-3 fw-semibold ${
            activeTab === 'starting'
              ? 'text-primary border-bottom border-primary border-2'
              : 'text-muted'
          }`}
          onClick={() => setActiveTab('starting')}
        >
          <FaWallet className="me-1" size={12} />
          Opening Starting Balance
        </button>
      </div>

      {activeTab === 'reconcile' ? (
        /* Reconcile Form */
        <form onSubmit={handleReconcileBalance}>
          <div className="alert alert-info py-2 px-3 small d-flex align-items-start gap-2 mb-3">
            <FaInfoCircle className="mt-1 flex-shrink-0 text-info" />
            <div>
              Enter your real bank or cash balance as of today. FinTrack will automatically calculate the difference and record a balance adjustment transaction.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium text-muted small">
              Actual Current Balance *
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light fw-bold">
                {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
              </span>
              <input
                type="number"
                step="any"
                required
                className="form-control form-control-lg form-control-custom fw-semibold"
                placeholder="e.g. 75000"
                value={targetBalance}
                onChange={(e) => setTargetBalance(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Live Diff Preview */}
          <div className="p-3 mb-3 rounded-3 border bg-light-subtle">
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted">Required Adjustment:</span>
              <span
                className={`fw-bold small px-2 py-1 rounded-pill ${
                  delta === 0
                    ? 'bg-light text-muted border'
                    : isCredit
                    ? 'bg-success-subtle text-success border border-success-subtle'
                    : 'bg-danger-subtle text-danger border border-danger-subtle'
                }`}
              >
                {delta === 0
                  ? 'No adjustment needed (Match)'
                  : isCredit
                  ? `+${formatCurrency(delta, currency)} (Income Credit)`
                  : `-${formatCurrency(Math.abs(delta), currency)} (Expense Debit)`}
              </span>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label fw-medium text-muted small">Account / Mode</label>
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
              <label className="form-label fw-medium text-muted small">Reconciliation Date</label>
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
            <label className="form-label fw-medium text-muted small">Reconciliation Note</label>
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. Reconciled with bank statement"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              disabled={loading || delta === 0}
            >
              <FaCheck size={12} />
              <span>{loading ? 'Reconciling...' : 'Apply Reconciliation'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Opening Starting Balance Form */
        <form onSubmit={handleSaveStartingBalance}>
          <div className="alert alert-warning py-2 px-3 small d-flex align-items-start gap-2 mb-3">
            <FaInfoCircle className="mt-1 flex-shrink-0 text-warning" />
            <div>
              Changing your Opening Starting Balance shifts the baseline balance for your entire historical ledger without creating a new transaction.
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium text-muted small">
              Opening Starting Balance *
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light fw-bold">
                {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                className="form-control form-control-lg form-control-custom fw-semibold"
                placeholder="e.g. 50000"
                value={newStartingBalance}
                onChange={(e) => setNewStartingBalance(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-text small">
              The initial total of your bank accounts, fixed deposits, and cash in hand when you started using FinTrack.
            </div>
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
              disabled={loading}
            >
              <FaCheck size={12} />
              <span>{loading ? 'Saving...' : 'Save Opening Balance'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default BalanceAdjustmentModal;
