import { useNavigate } from 'react-router-dom';
import './BookingConfirmation.css';

export default function BookingConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="confirmation-page">

      <div className="confirmation-card">

        <div className="confirmation-icon">
          ✓
        </div>

        <h1>Booking Confirmed!</h1>

        <p>
          Your event booking has been successfully confirmed.
        </p>

        <p className="confirmation-message">
          Thank you for choosing SHREE Event Management.
          We look forward to making your event special.
        </p>

        <div className="confirmation-actions">

          <button
            onClick={() => navigate('/my-bookings')}
            className="confirmation-btn primary"
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate('/events')}
            className="confirmation-btn secondary"
          >
            Explore More Events
          </button>

        </div>

      </div>

    </div>
  );
}