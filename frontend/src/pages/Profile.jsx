import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import EditProfileModal from './EditProfileModal';
import './Profile.css';

const avatarColors = [
  'linear-gradient(135deg, #f54927, #ea580c)',
  'linear-gradient(135deg, #7c3aed, #4f46e5)',
  'linear-gradient(135deg, #0891b2, #0e7490)',
  'linear-gradient(135deg, #059669, #047857)',
  'linear-gradient(135deg, #db2777, #be185d)',
  'linear-gradient(135deg, #d97706, #b45309)',
  'linear-gradient(135deg, #2563eb, #1d4ed8)',
  'linear-gradient(135deg, #9333ea, #7e22ce)',
];

const getAvatarColor = (name = '') => {
  const index =
    name
      .split('')
      .reduce(
        (sum, char) => sum + char.charCodeAt(0),
        0
      ) % avatarColors.length;

  return avatarColors[index];
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setUser(data);
    } catch (err) {
      console.error('Profile loading error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load profile'
      );
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!user) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="profile-container">

      <div className="profile-card">

        {/* =========================
            PROFILE HEADER
        ========================= */}

        <div className="profile-header">

          <div
            className="profile-avatar-large"
            style={{
              background: getAvatarColor(user.fullName),
            }}
          >
            {user.fullName
              ?.charAt(0)
              ?.toUpperCase() || 'U'}
          </div>

          <div className="profile-title">

            <h2>{user.fullName}</h2>

            <p>{user.email}</p>

          </div>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}


        {/* =========================
            PROFILE DETAILS
        ========================= */}

        <div className="profile-details">

          <div className="detail-item">
            <span>Full name</span>
            <strong>
              {user.fullName}
            </strong>
          </div>


          <div className="detail-item">
            <span>Email</span>
            <strong>
              {user.email}
            </strong>
          </div>


          <div className="detail-item">
            <span>Phone</span>
            <strong>
              {user.phone}
            </strong>
          </div>


          <div className="detail-item">
            <span>Village</span>
            <strong>
              {user.village || 'Not provided'}
            </strong>
          </div>


          <div className="detail-item">
            <span>Account type</span>
            <strong>
              {user.role}
            </strong>
          </div>


          <div className="detail-item">
            <span>Member since</span>
            <strong>
              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString('en-IN')
                : 'N/A'}
            </strong>
          </div>

        </div>


        {/* =========================
            UPDATE BUTTON
        ========================= */}

        <button
          className="update-btn"
          onClick={() => setShowModal(true)}
        >
          Update Profile
        </button>

      </div>


      {/* =========================
          EDIT PROFILE MODAL
      ========================= */}

      {showModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowModal(false)}
          onUpdated={(updatedUser) => {
            setUser(updatedUser);
            setShowModal(false);
          }}
        />
      )}

    </div>
  );
}