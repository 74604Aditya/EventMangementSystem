import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axiosConfig';
import './MyBookings.css';


function hoursSince(dateStr) {
    if (!dateStr) {
        return Infinity;
    }

    return (
        (Date.now() - new Date(dateStr).getTime()) /
        (1000 * 60 * 60)
    );
}


function formatDate(date) {
    if (!date) {
        return 'Not available';
    }

    return new Date(date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}


function formatAmount(amount) {
    if (amount === null || amount === undefined) {
        return '0';
    }

    return Number(amount).toLocaleString('en-IN');
}


export default function MyBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);


    /* =====================================================
       LOAD BOOKINGS
    ===================================================== */

    const loadBookings = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await api.get('/bookings/my');

            setBookings(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error('Bookings error:', err);

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                navigate('/login', {
                    replace: true
                });

                return;
            }

            setError(
                err.response?.data?.message ||
                'Failed to load bookings'
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadBookings();
    }, []);


    /* =====================================================
       CANCEL BOOKING
    ===================================================== */

    const cancelBooking = async (id) => {

        const confirmed = window.confirm(
            'Are you sure you want to cancel this booking?'
        );

        if (!confirmed) {
            return;
        }

        try {

            setError('');
            setCancellingId(id);

            await api.put(`/booking/${id}/cancel`);

            await loadBookings();

        } catch (err) {

            console.error('Cancellation error:', err);

            setError(
                err.response?.data?.message ||
                'Cancellation failed'
            );

        } finally {

            setCancellingId(null);

        }
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <div className="bookings-page-state">

                <div className="bookings-loader">

                    <div className="loader-circle"></div>

                    <h3>
                        Loading your bookings...
                    </h3>

                    <p>
                        Please wait while we fetch your bookings.
                    </p>

                </div>

            </div>
        );
    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="bookings-container">

            <div className="bookings-wrapper">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="bookings-header">

                    <div>

                        <span className="section-label">
                            SHREE EVENTS
                        </span>

                        <h1>
                            My Bookings
                        </h1>

                        <p>
                            View and manage all your event bookings.
                        </p>

                    </div>


                    <div className="booking-count">

                        <span>
                            {bookings.length}
                        </span>

                        <small>
                            {bookings.length === 1
                                ? 'Booking'
                                : 'Bookings'}
                        </small>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="error-msg">
                        {error}
                    </div>
                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {bookings.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🎟️
                        </div>

                        <h2>
                            No bookings yet
                        </h2>

                        <p>
                            You haven't booked any events yet.
                            Explore events and make your first
                            booking.
                        </p>

                        <button
                            className="browse-events-btn"
                            onClick={() => navigate('/events')}
                        >
                            Browse Events
                            <span>→</span>
                        </button>

                    </div>

                ) : (

                    /* =================================================
                       BOOKINGS GRID
                    ================================================= */

                    <div className="bookings-grid">

                        {bookings.map((booking) => {

                            const withinWindow =
                                hoursSince(booking.bookedAt) <= 12;

                            const status =
                                booking.status?.toUpperCase();

                            const isConfirmed =
                                status === 'CONFIRMED';

                            const isCancelled =
                                status === 'CANCELLED';

                            const isCancelling =
                                cancellingId === booking.id;


                            return (

                                <div
                                    className="booking-card"
                                    key={booking.id}
                                >

                                    {/* ==============================
                                        HEADER
                                    ============================== */}

                                    <div className="booking-card-header">

                                        <div className="booking-event-icon">
                                            🎉
                                        </div>

                                        <span
                                            className={`badge ${
                                                isConfirmed
                                                    ? 'confirmed'
                                                    : 'cancelled'
                                            }`}
                                        >
                                            {booking.status}
                                        </span>

                                    </div>


                                    {/* ==============================
                                        EVENT
                                    ============================== */}

                                    <div className="booking-event">

                                        <h2 className="event-title">
                                            {booking.event?.title ||
                                                'Event'}
                                        </h2>

                                        <span>
                                            {booking.event?.category?.name ||
                                                booking.event?.category ||
                                                ''}
                                        </span>

                                    </div>


                                    {/* ==============================
                                        BOOKING DETAILS
                                    ============================== */}

                                    <div className="booking-info">


                                        {/* EVENT DATE */}

                                        <div className="info-row">

                                            <span className="info-icon">
                                                📅
                                            </span>

                                            <div>

                                                <small>
                                                    Event Date
                                                </small>

                                                <strong>
                                                    {formatDate(
                                                        booking.eventDateTime ||
                                                        booking.customDate ||
                                                        booking.event?.eventDateTime
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* VENUE */}

                                        <div className="info-row">

                                            <span className="info-icon">
                                                📍
                                            </span>

                                            <div>

                                                <small>
                                                    Venue
                                                </small>

                                                <strong>
                                                    {booking.customVenue ||
                                                        booking.venue ||
                                                        booking.event?.venue ||
                                                        'Not available'}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* CITY */}

                                        <div className="info-row">

                                            <span className="info-icon">
                                                🏙️
                                            </span>

                                            <div>

                                                <small>
                                                    Location
                                                </small>

                                                <strong>
                                                    {booking.event?.city ||
                                                        booking.city ||
                                                        'Not available'}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* PAYMENT PLAN */}

                                        <div className="info-row">

                                            <span className="info-icon">
                                                💳
                                            </span>

                                            <div>

                                                <small>
                                                    Payment Plan
                                                </small>

                                                <strong>

                                                    {booking.paymentPlan ===
                                                    'FULL'
                                                        ? 'Full Payment'
                                                        : booking.paymentPlan ===
                                                          'ADVANCE'
                                                            ? '50% Advance'
                                                            : booking.paymentPlan ===
                                                              'AFTER_EVENT'
                                                                ? 'Pay After Event'
                                                                : 'Not available'}

                                                </strong>

                                            </div>

                                        </div>


                                        {/* PAYMENT METHOD */}

                                        {booking.paymentPlan !==
                                            'AFTER_EVENT' && (

                                            <div className="info-row">

                                                <span className="info-icon">
                                                    💰
                                                </span>

                                                <div>

                                                    <small>
                                                        Payment Method
                                                    </small>

                                                    <strong>
                                                        {booking.paymentMethod ||
                                                            'Not available'}
                                                    </strong>

                                                </div>

                                            </div>

                                        )}


                                        {/* TOTAL AMOUNT */}

                                        <div className="info-row amount-row">

                                            <span className="info-icon">
                                                💵
                                            </span>

                                            <div>

                                                <small>
                                                    Total Amount
                                                </small>

                                                <strong>
                                                    ₹
                                                    {formatAmount(
                                                        booking.totalAmount
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* PAID / PAYABLE */}

                                        <div className="info-row">

                                            <span className="info-icon">
                                                🧾
                                            </span>

                                            <div>

                                                <small>
                                                    Paid / Payable Now
                                                </small>

                                                <strong>
                                                    ₹
                                                    {formatAmount(
                                                        booking.payableAmount
                                                    )}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ==============================
                                        BOOKED DATE
                                    ============================== */}

                                    <div className="booked-at">

                                        Booked on{' '}

                                        {formatDate(
                                            booking.bookedAt
                                        )}

                                    </div>


                                    {/* ==============================
                                        CANCEL BUTTON
                                    ============================== */}

                                    {isConfirmed && (

                                        <div className="cancel-section">

                                            <button
                                                className="cancel-btn"
                                                onClick={() =>
                                                    cancelBooking(
                                                        booking.id
                                                    )
                                                }
                                                disabled={
                                                    !withinWindow ||
                                                    isCancelling
                                                }
                                                title={
                                                    !withinWindow
                                                        ? '12-hour free cancellation window has passed'
                                                        : ''
                                                }
                                            >

                                                {isCancelling
                                                    ? 'Cancelling...'
                                                    : withinWindow
                                                        ? 'Cancel Booking'
                                                        : 'Cancellation Window Closed'}

                                            </button>


                                            {withinWindow && (

                                                <p className="cancel-note">
                                                    Free cancellation
                                                    available within
                                                    12 hours of booking.
                                                </p>

                                            )}


                                            {!withinWindow && (

                                                <p className="cancel-note closed">
                                                    The 12-hour cancellation
                                                    window has passed.
                                                </p>

                                            )}

                                        </div>

                                    )}


                                    {/* ==============================
                                        CANCELLED
                                    ============================== */}

                                    {isCancelled && (

                                        <div className="cancelled-message">

                                            <span>
                                                ✓
                                            </span>

                                            This booking has been
                                            cancelled.

                                        </div>

                                    )}

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>
    );
}