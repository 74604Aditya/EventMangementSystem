import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../api/axiosConfig';
import eventsData from '../data/eventsData';

import './Booking.css';


export default function Booking() {

    const { id } = useParams();
    const navigate = useNavigate();


    /* =====================================================
       FIND EVENT
    ===================================================== */

    const event = eventsData.find(
        (item) => item.id === Number(id)
    );


    /* =====================================================
       STATE
    ===================================================== */

    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');

    const [venue, setVenue] = useState('');

    const [paymentPlan, setPaymentPlan] =
        useState('ADVANCE');

    const [paymentMethod, setPaymentMethod] =
        useState('UPI');

    const [error, setError] = useState('');

    const [loading, setLoading] =
        useState(false);


    /* =====================================================
       EVENT NOT FOUND
    ===================================================== */

    if (!event) {

        return (

            <div className="booking-not-found">

                <div className="booking-not-found-box">

                    <h2>
                        Event Not Found
                    </h2>

                    <p>
                        The selected event could not be found.
                    </p>

                    <button
                        onClick={() =>
                            navigate('/events')
                        }
                    >
                        Back to Events
                    </button>

                </div>

            </div>
        );
    }


    /* =====================================================
       AMOUNT
    ===================================================== */

    const totalAmount = event.price;

    let payableAmount = totalAmount;

    if (paymentPlan === 'ADVANCE') {

        payableAmount =
            totalAmount / 2;
    }

    if (paymentPlan === 'AFTER_EVENT') {

        payableAmount = 0;
    }


    /* =====================================================
       MINIMUM DATE
    ===================================================== */

    const today =
        new Date()
            .toISOString()
            .split('T')[0];


    /* =====================================================
       CONTINUE
    ===================================================== */

    const handleContinue = async () => {

        setError('');


        /* =================================================
           VALIDATION
        ================================================= */

        if (!eventDate) {

            setError(
                'Please select an event date.'
            );

            return;
        }


        if (!eventTime) {

            setError(
                'Please select an event time.'
            );

            return;
        }


        if (!venue.trim()) {

            setError(
                'Please enter the event venue.'
            );

            return;
        }


        /*
         * Create LocalDateTime format:
         *
         * 2026-09-10T18:00
         */

        const eventDateTime =
            `${eventDate}T${eventTime}`;


        /*
         * Prevent past date/time
         */

        if (
            new Date(eventDateTime) <=
            new Date()
        ) {

            setError(
                'Please select a future date and time.'
            );

            return;
        }


        /* =================================================
           PAYMENT REQUIRED
        ================================================= */

        if (
            paymentPlan !== 'AFTER_EVENT'
        ) {

            /*
             * Store booking information temporarily.
             *
             * Payment.jsx will use this information
             * after successful payment.
             */

            navigate('/payment', {

                state: {

                    event,

                    eventDateTime,

                    venue,

                    paymentPlan,

                    paymentMethod,

                    totalAmount,

                    payableAmount

                }

            });

            return;
        }


        /* =================================================
           PAY AFTER EVENT
        ================================================= */

        try {

            setLoading(true);


            const response =
                await api.post(
                    '/bookings',
                    {

                        eventId: event.id,

                        eventDateTime,

                        venue: venue.trim(),

                        paymentPlan:

                            'AFTER_EVENT',

                        paymentMethod:

                            'PAY_AFTER_EVENT'

                    }
                );


            /*
             * Booking successfully created.
             */

            console.log(
                'Booking created:',
                response.data
            );


            /*
             * Go directly to confirmation.
             */

            navigate(
                '/booking-confirmation',
                {
                    state: {
                        booking:
                            response.data
                    }
                }
            );


        } catch (err) {

            console.error(
                'Booking creation error:',
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                'Failed to create booking.'
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="booking-page">

            <div className="booking-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="booking-header">

                    <button
                        type="button"
                        className="booking-back-btn"
                        onClick={() =>
                            navigate(
                                `/events/${event.id}`
                            )
                        }
                    >
                        ← Back
                    </button>


                    <span>
                        SHREE EVENTS
                    </span>


                    <h1>
                        Complete Your Booking
                    </h1>


                    <p>
                        Select your event date, venue
                        and payment preference.
                    </p>

                </div>


                {/* =================================================
                    BOOKING GRID
                ================================================= */}

                <div className="booking-grid">


                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

                    <div className="booking-main">


                        {/* =================================================
                            EVENT SUMMARY
                        ================================================= */}

                        <section className="booking-card">

                            <div className="booking-card-title">

                                <span className="booking-title-icon">
                                    🎉
                                </span>

                                <div>

                                    <h2>
                                        Event Details
                                    </h2>

                                    <p>
                                        Your selected event
                                    </p>

                                </div>

                            </div>


                            <div className="booking-event-summary">

                                <img
                                    src={event.image}
                                    alt={event.title}
                                />


                                <div>

                                    <h3>
                                        {event.title}
                                    </h3>

                                    <span>
                                        {event.category}
                                    </span>

                                    <strong>
                                        ₹
                                        {totalAmount.toLocaleString(
                                            'en-IN'
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            DATE + VENUE
                        ================================================= */}

                        <section className="booking-card">

                            <div className="booking-card-title">

                                <span className="booking-title-icon">
                                    📅
                                </span>

                                <div>

                                    <h2>
                                        Event Schedule
                                    </h2>

                                    <p>
                                        Choose when and where
                                        your event will take place.
                                    </p>

                                </div>

                            </div>


                            {/* DATE */}

                            <div className="booking-fields-row">

                                <div className="booking-field">

                                    <label htmlFor="eventDate">
                                        Event Date
                                    </label>

                                    <input
                                        id="eventDate"
                                        type="date"
                                        min={today}
                                        value={eventDate}
                                        onChange={(e) =>
                                            setEventDate(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* TIME */}

                                <div className="booking-field">

                                    <label htmlFor="eventTime">
                                        Event Time
                                    </label>

                                    <input
                                        id="eventTime"
                                        type="time"
                                        value={eventTime}
                                        onChange={(e) =>
                                            setEventTime(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* VENUE */}

                            <div className="booking-field">

                                <label htmlFor="venue">
                                    Custom Venue
                                </label>

                                <input
                                    id="venue"
                                    type="text"
                                    placeholder="Enter your event venue"
                                    value={venue}
                                    onChange={(e) =>
                                        setVenue(
                                            e.target.value
                                        )
                                    }
                                />

                                <small>
                                    Enter the location where
                                    you want the event to be held.
                                </small>

                            </div>

                        </section>


                        {/* =================================================
                            PAYMENT PLAN
                        ================================================= */}

                        <section className="booking-card">

                            <div className="booking-card-title">

                                <span className="booking-title-icon">
                                    💰
                                </span>

                                <div>

                                    <h2>
                                        Payment Plan
                                    </h2>

                                    <p>
                                        Select how you want to pay.
                                    </p>

                                </div>

                            </div>


                            <div className="payment-plan-options">


                                {/* FULL */}

                                <label
                                    className={
                                        `payment-plan-option ${
                                            paymentPlan === 'FULL'
                                                ? 'selected'
                                                : ''
                                        }`
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="paymentPlan"
                                        value="FULL"
                                        checked={
                                            paymentPlan === 'FULL'
                                        }
                                        onChange={(e) =>
                                            setPaymentPlan(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <div className="payment-plan-content">

                                        <div className="payment-plan-top">

                                            <strong>
                                                Pay Full Amount
                                            </strong>

                                            <span>
                                                ₹
                                                {totalAmount.toLocaleString(
                                                    'en-IN'
                                                )}
                                            </span>

                                        </div>


                                        <p>
                                            Pay the complete event
                                            amount now.
                                        </p>

                                    </div>

                                </label>


                                {/* ADVANCE */}

                                <label
                                    className={
                                        `payment-plan-option ${
                                            paymentPlan === 'ADVANCE'
                                                ? 'selected'
                                                : ''
                                        }`
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="paymentPlan"
                                        value="ADVANCE"
                                        checked={
                                            paymentPlan === 'ADVANCE'
                                        }
                                        onChange={(e) =>
                                            setPaymentPlan(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <div className="payment-plan-content">

                                        <div className="payment-plan-top">

                                            <strong>
                                                Pay 50% Advance
                                            </strong>

                                            <span>
                                                ₹
                                                {(
                                                    totalAmount / 2
                                                ).toLocaleString(
                                                    'en-IN'
                                                )}
                                            </span>

                                        </div>


                                        <p>
                                            Pay half now and
                                            the remaining amount later.
                                        </p>

                                    </div>

                                </label>


                                {/* AFTER EVENT */}

                                <label
                                    className={
                                        `payment-plan-option ${
                                            paymentPlan === 'AFTER_EVENT'
                                                ? 'selected'
                                                : ''
                                        }`
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="paymentPlan"
                                        value="AFTER_EVENT"
                                        checked={
                                            paymentPlan === 'AFTER_EVENT'
                                        }
                                        onChange={(e) =>
                                            setPaymentPlan(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <div className="payment-plan-content">

                                        <div className="payment-plan-top">

                                            <strong>
                                                Pay After Event
                                            </strong>

                                            <span>
                                                ₹0
                                            </span>

                                        </div>


                                        <p>
                                            Reserve your event
                                            and pay after the event.
                                        </p>

                                    </div>

                                </label>

                            </div>

                        </section>


                        {/* =================================================
                            PAYMENT METHOD
                        ================================================= */}

                        {paymentPlan !== 'AFTER_EVENT' && (

                            <section className="booking-card">

                                <div className="booking-card-title">

                                    <span className="booking-title-icon">
                                        💳
                                    </span>

                                    <div>

                                        <h2>
                                            Payment Method
                                        </h2>

                                        <p>
                                            Select your preferred
                                            payment method.
                                        </p>

                                    </div>

                                </div>


                                <div className="payment-method-options">


                                    {/* UPI */}

                                    <button
                                        type="button"
                                        className={
                                            `payment-method ${
                                                paymentMethod === 'UPI'
                                                    ? 'selected'
                                                    : ''
                                            }`
                                        }
                                        onClick={() =>
                                            setPaymentMethod(
                                                'UPI'
                                            )
                                        }
                                    >

                                        <span>
                                            📱
                                        </span>

                                        <strong>
                                            UPI
                                        </strong>

                                    </button>


                                    {/* CARD */}

                                    <button
                                        type="button"
                                        className={
                                            `payment-method ${
                                                paymentMethod === 'CARD'
                                                    ? 'selected'
                                                    : ''
                                            }`
                                        }
                                        onClick={() =>
                                            setPaymentMethod(
                                                'CARD'
                                            )
                                        }
                                    >

                                        <span>
                                            💳
                                        </span>

                                        <strong>
                                            Card
                                        </strong>

                                    </button>


                                    {/* QR */}

                                    <button
                                        type="button"
                                        className={
                                            `payment-method ${
                                                paymentMethod === 'QR'
                                                    ? 'selected'
                                                    : ''
                                            }`
                                        }
                                        onClick={() =>
                                            setPaymentMethod(
                                                'QR'
                                            )
                                        }
                                    >

                                        <span>
                                            ▣
                                        </span>

                                        <strong>
                                            QR Code
                                        </strong>

                                    </button>

                                </div>

                            </section>

                        )}

                    </div>


                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <aside className="booking-summary">

                        <div className="summary-card">

                            <span className="summary-label">
                                BOOKING SUMMARY
                            </span>


                            <h2>
                                {event.title}
                            </h2>


                            {/* DATE */}

                            <div className="summary-row">

                                <span>
                                    Event Date
                                </span>

                                <strong>
                                    {eventDate
                                        ? new Date(
                                            `${eventDate}T00:00`
                                        ).toLocaleDateString(
                                            'en-IN'
                                        )
                                        : 'Not selected'}
                                </strong>

                            </div>


                            {/* VENUE */}

                            <div className="summary-row">

                                <span>
                                    Venue
                                </span>

                                <strong>
                                    {venue ||
                                        'Not selected'}
                                </strong>

                            </div>


                            {/* PRICE */}

                            <div className="summary-row">

                                <span>
                                    Event Price
                                </span>

                                <strong>
                                    ₹
                                    {totalAmount.toLocaleString(
                                        'en-IN'
                                    )}
                                </strong>

                            </div>


                            {/* PAYMENT PLAN */}

                            <div className="summary-row">

                                <span>
                                    Payment Plan
                                </span>

                                <strong>

                                    {paymentPlan === 'FULL' &&
                                        'Full Payment'}

                                    {paymentPlan === 'ADVANCE' &&
                                        '50% Advance'}

                                    {paymentPlan === 'AFTER_EVENT' &&
                                        'Pay After Event'}

                                </strong>

                            </div>


                            {/* PAYMENT METHOD */}

                            {paymentPlan !== 'AFTER_EVENT' && (

                                <div className="summary-row">

                                    <span>
                                        Payment Method
                                    </span>

                                    <strong>
                                        {paymentMethod}
                                    </strong>

                                </div>

                            )}


                            <div className="summary-divider"></div>


                            {/* PAY NOW */}

                            <div className="summary-total">

                                <span>
                                    Pay Now
                                </span>

                                <strong>
                                    ₹
                                    {payableAmount.toLocaleString(
                                        'en-IN'
                                    )}
                                </strong>

                            </div>


                            {/* REMAINING */}

                            {paymentPlan === 'ADVANCE' && (

                                <p className="remaining-amount">

                                    Remaining amount:
                                    {' '}
                                    ₹
                                    {(
                                        totalAmount / 2
                                    ).toLocaleString(
                                        'en-IN'
                                    )}

                                </p>

                            )}


                            {/* AFTER EVENT */}

                            {paymentPlan === 'AFTER_EVENT' && (

                                <p className="after-event-note">

                                    You don't need to make
                                    an online payment now.

                                </p>

                            )}


                            {/* ERROR */}

                            {error && (

                                <div className="booking-error">

                                    {error}

                                </div>

                            )}


                            {/* BUTTON */}

                            <button
                                type="button"
                                className="continue-payment-btn"
                                onClick={handleContinue}
                                disabled={loading}
                            >

                                {loading
                                    ? 'Confirming...'
                                    : paymentPlan === 'AFTER_EVENT'
                                        ? 'Confirm Booking'
                                        : 'Continue to Payment'
                                }

                                {!loading && (
                                    <span>
                                        →
                                    </span>
                                )}

                            </button>


                            <p className="secure-note">

                                🔒 Your booking information
                                is secure.

                            </p>

                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );
}