import { useState } from 'react';
import api from '../api/axiosConfig';
import './EditProfileModal.css';

export default function EditProfileModal({
  user,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    village: user.village || '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const { data } = await api.put('/users/profile', form);
    onUpdated(data);
  } catch (err) {
    setError(
      err.response?.data?.message || 'Failed to update profile'
    );
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>Edit Profile</h3>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={user.email} disabled />
          </div>

          <div className="form-group">
            <label>Phone number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Village</label>
            <input
              name="village"
              value={form.village}
              onChange={handleChange}
              placeholder="Enter your village"
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}