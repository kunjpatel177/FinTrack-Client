import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { toast } from 'react-toastify';

const InviteMemberModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/household/invite', {
        email: email.trim().toLowerCase(),
        role,
      });

      toast.success(res.data.message || 'Invitation sent successfully');
      setGeneratedInvite(res.data.data);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send invitation';
      toast.error(msg);
      if (err.response?.data?.invitationToken) {
        setGeneratedInvite({
          email: email.trim().toLowerCase(),
          token: err.response.data.invitationToken,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedInvite?.token) {
      const link = `${window.location.origin}/accept-invite?token=${generatedInvite.token}`;
      navigator.clipboard.writeText(link);
      toast.info('Invitation link copied to clipboard!');
    }
  };

  const handleClose = () => {
    setEmail('');
    setRole('member');
    setGeneratedInvite(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite Household Member"
      size="md"
    >
      {generatedInvite ? (
        <div className="p-3 text-center">
          <div className="alert alert-success d-flex flex-column align-items-center mb-3">
            <h6 className="fw-bold mb-1">Invitation Generated!</h6>
            <p className="small mb-0">
              An invitation was created for <strong>{generatedInvite.email}</strong>.
            </p>
          </div>

          <p className="text-muted small mb-3">
            Share this invite token or direct join link with the invitee:
          </p>

          <div className="p-3 bg-light rounded-3 border mb-3 text-start">
            <div className="text-muted small fw-medium mb-1">Invitation Token:</div>
            <code className="text-primary fw-bold text-break">{generatedInvite.token}</code>
          </div>

          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-outline-primary px-4 fw-medium"
              onClick={handleCopyLink}
            >
              Copy Join Link
            </button>
            <button
              type="button"
              className="btn btn-primary-custom px-4 fw-medium"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium text-muted small">Invitee Email *</label>
            <input
              type="email"
              required
              className="form-control form-control-custom"
              placeholder="e.g. partner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <div className="form-text small">
              The user can log into their FinTrack account and accept the invitation to join your household.
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium text-muted small">Assigned Role</label>
            <select
              className="form-select form-select-custom"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member (Can view & add shared expenses)</option>
              <option value="admin">Admin (Can manage members and shared expenses)</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn btn-light px-4 fw-medium"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary-custom px-4 fw-medium"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default InviteMemberModal;
