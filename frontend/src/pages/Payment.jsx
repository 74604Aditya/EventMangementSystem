import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '../api/axiosConfig';

import './Payment.css';


export default function Payment() {

    const location = useLocation();
    const navigate = useNavigate();


    /* =====================================================
       GET BOOKING DATA FROM BOOKING PAGE
    ===================================================== */

    const {
        event,
        eventDateTime,
        customVenue,
        paymentPlan,
        paymentMethod,
        totalAmount,
        payableAmount
    } = location.state || {};


    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDateTime = (dateTime) => {

        if (!dateTime) {
            return 'Not available';
        }

        try {

            return new Date(dateTime).toLocaleString(
                'en-IN',
                {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                }
            );

        } catch {

            return 'Not available';

        }
    };


    /* =====================================================
       FORMAT AMOUNT
    ===================================================== */

    const formatAmount = (amount) => {

        return Number(amount || 0).toLocaleString(
            'en-IN'
        );

    };


    /* =====================================================
       PAYMENT PLAN TEXT
    ===================================================== */

    const getPaymentPlanText = () => {

        switch (paymentPlan) {

            case 'FULL':
                return 'Full Payment';

            case 'ADVANCE':
                return '50% Advance';

            case 'AFTER_EVENT':
                return 'Pay After Event';

            default:
                return 'Not available';

        }
    };


    /* =====================================================
       NO BOOKING DATA
    ===================================================== */

    if (!event) {

        return (

            <div className="payment-page">

                <div className="payment-error-card">

                    <div className="payment-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Booking Session Expired
                    </h2>

                    <p>
                        Your booking information is no longer
                        available. Please select an event and
                        start the booking process again.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate('/events')}
                    >
                        Browse Events
                    </button>

                </div>

            </div>

        );
    }


    /* =====================================================
       AFTER EVENT BOOKING
       NO RAZORPAY PAYMENT
    ===================================================== */

    const handleAfterEventBooking = async () => {

        const bookingRequest = {

            eventId: event.id,

            eventDateTime: eventDateTime,

            customVenue: customVenue.trim(),

            paymentPlan: 'AFTER_EVENT',

            paymentMethod: null

        };


        console.log(
            'Creating AFTER_EVENT booking:',
            bookingRequest
        );


        const response = await api.post(
            '/bookings',
            bookingRequest
        );


        console.log(
            'AFTER_EVENT booking created:',
            response.data
        );


        navigate('/my-bookings', {

            replace: true,

            state: {

                bookingSuccess: true,

                booking: response.data

            }

        });

    };


    /* =====================================================
       CREATE RAZORPAY ORDER
    ===================================================== */

    const createRazorpayOrder = async () => {

        const orderRequest = {

            eventId: event.id,

            eventDateTime: eventDateTime,

            customVenue: customVenue.trim(),

            paymentPlan: paymentPlan,

            paymentMethod: paymentMethod,

            /*
             * Receipt should be unique.
             */
            receipt:
                `event_booking_${event.id}_${Date.now()}`
        };


        console.log(
            'Creating Razorpay order:',
            orderRequest
        );


        const response = await api.post(
            '/payments/create-order',
            orderRequest
        );


        console.log(
            'Razorpay order response:',
            response.data
        );


        return response.data;

    };


    /* =====================================================
       VERIFY RAZORPAY PAYMENT
    ===================================================== */

    const verifyRazorpayPayment = async ({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
    }) => {

        const verifyRequest = {

            razorpayOrderId,

            razorpayPaymentId,

            razorpaySignature

        };


        console.log(
            'Verifying Razorpay payment:',
            verifyRequest
        );


        const response = await api.post(
            '/payments/verify',
            verifyRequest
        );


        console.log(
            'Payment verification response:',
            response.data
        );


        return response.data;

    };


    /* =====================================================
       OPEN RAZORPAY CHECKOUT
    ===================================================== */

    const openRazorpayCheckout = async () => {

        if (
            !window.Razorpay
        ) {

            throw new Error(
                'Razorpay Checkout could not be loaded. Please refresh the page and try again.'
            );

        }


        /*
         * Ask backend to create Razorpay order.
         *
         * IMPORTANT:
         * Amount is calculated by backend.
         */

        const orderData =
            await createRazorpayOrder();


        if (
            !orderData ||
            !orderData.orderId ||
            !orderData.keyId ||
            !orderData.amount
        ) {

            throw new Error(
                'Invalid Razorpay order response from server.'
            );

        }


        const options = {

            key: orderData.keyId,

            amount: orderData.amount,

            currency:
                orderData.currency || 'INR',

            name: 'SHREE EVENTS',

            description:
                `${event.title} - ${getPaymentPlanText()}`,

            order_id:
                orderData.orderId,


            /*
             * Razorpay Checkout prefill
             */

            prefill: {

                name: '',

                email: '',

                contact: ''

            },


            /*
             * Theme
             */

            theme: {

                color: '#b91c1c'

            },


            /*
             * Payment success handler
             */

            handler: async function (razorpayResponse) {

                try {

                    console.log(
                        'Razorpay payment successful:',
                        razorpayResponse
                    );


                    setProcessing(true);
                    setError('');


                    /*
                     * Verify payment on backend.
                     */

                    const verificationResponse =
                        await verifyRazorpayPayment({

                            razorpayOrderId:
                                razorpayResponse.razorpay_order_id,

                            razorpayPaymentId:
                                razorpayResponse.razorpay_payment_id,

                            razorpaySignature:
                                razorpayResponse.razorpay_signature

                        });


                    /*
                     * Payment verified.
                     */

                    navigate(
                        '/booking-confirmation',
                        {

                            replace: true,

                            state: {

                                bookingId:
                                    verificationResponse.bookingId,

                                paymentSuccess: true,

                                paymentVerified: true,

                                paymentPlan:
                                    paymentPlan,

                                razorpayOrderId:
                                    razorpayResponse.razorpay_order_id,

                                razorpayPaymentId:
                                    razorpayResponse.razorpay_payment_id

                            }

                        }
                    );

                } catch (err) {

                    console.error(
                        'Payment verification error:',
                        err
                    );


                    setProcessing(false);


                    setError(

                        err.response?.data?.message ||

                        err.response?.data?.error ||

                        (
                            typeof err.response?.data === 'string'
                                ? err.response.data
                                : null
                        ) ||

                        err.message ||

                        'Payment was received, but verification failed. Please contact support.'

                    );

                }

            },


            /*
             * Razorpay modal closed.
             */

            modal: {

                ondismiss: function () {

                    console.log(
                        'Razorpay Checkout closed.'
                    );

                    setProcessing(false);

                }

            }

        };


        /*
         * Open Razorpay Checkout.
         */

        const razorpay =
            new window.Razorpay(options);


        /*
         * Handle payment failure.
         */

        razorpay.on(
            'payment.failed',
            function (response) {

                console.error(
                    'Razorpay payment failed:',
                    response
                );


                setProcessing(false);


                setError(

                    response.error?.description ||

                    'Payment failed. Please try again.'

                );

            }
        );


        razorpay.open();

    };


    /* =====================================================
       MAIN PAYMENT HANDLER
    ===================================================== */

    const handlePayment = async () => {

        try {

            setProcessing(true);
            setError('');


            /* =================================================
               VALIDATION
            ================================================= */

            if (!event.id) {

                setError(
                    'Event information is missing.'
                );

                setProcessing(false);

                return;

            }


            if (!eventDateTime) {

                setError(
                    'Please select an event date.'
                );

                setProcessing(false);

                return;

            }


            if (
                !customVenue ||
                customVenue.trim() === ''
            ) {

                setError(
                    'Please enter a venue.'
                );

                setProcessing(false);

                return;

            }


            if (!paymentPlan) {

                setError(
                    'Please select a payment plan.'
                );

                setProcessing(false);

                return;

            }


            if (
                paymentPlan !== 'AFTER_EVENT' &&
                !paymentMethod
            ) {

                setError(
                    'Please select a payment method.'
                );

                setProcessing(false);

                return;

            }


            /* =================================================
               AFTER EVENT
            ================================================= */

            if (
                paymentPlan === 'AFTER_EVENT'
            ) {

                await handleAfterEventBooking();

                return;

            }


            /* =================================================
               FULL / ADVANCE
               RAZORPAY
            ================================================= */

            await openRazorpayCheckout();


        } catch (err) {

            console.error(
                'Payment process error:',
                err
            );


            console.error(
                'Backend response:',
                err.response?.data
            );


            setError(

                err.response?.data?.message ||

                err.response?.data?.error ||

                (
                    typeof err.response?.data === 'string'
                        ? err.response.data
                        : null
                ) ||

                err.message ||

                'Unable to start payment. Please try again.'

            );


            setProcessing(false);

        }

    };


    /* =====================================================
       DISPLAY AMOUNTS
       These are only for UI display.
       Backend remains source of truth.
    ===================================================== */

    const displayTotalAmount =
        formatAmount(totalAmount);


    const displayPayableAmount =
        formatAmount(payableAmount);


    const remainingAmount =
        Math.max(

            Number(totalAmount || 0) -
            Number(payableAmount || 0),

            0

        );


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="payment-page">

            <div className="payment-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="payment-header">

                    <span>
                        SHREE EVENTS
                    </span>

                    <h1>
                        Complete Your Payment
                    </h1>

                    <p>
                        Review your booking details before
                        completing the payment.
                    </p>

                </div>


                {/* =================================================
                    PAYMENT CARD
                ================================================= */}

                <div className="payment-card">


                    {/* =================================================
                        EVENT
                    ================================================= */}

                    <div className="payment-event">

                        <img
                            src={event.image}
                            alt={event.title}
                        />

                        <div>

                            <h2>
                                {event.title}
                            </h2>

                            <p>
                                {event.category}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        BOOKING DETAILS
                    ================================================= */}

                    <div className="payment-details">


                        {/* EVENT DATE */}

                        <div className="payment-detail-row">

                            <span>
                                📅 Event Date
                            </span>

                            <strong>
                                {formatDateTime(
                                    eventDateTime
                                )}
                            </strong>

                        </div>


                        {/* VENUE */}

                        <div className="payment-detail-row">

                            <span>
                                📍 Venue
                            </span>

                            <strong>
                                {customVenue ||
                                    event.venue ||
                                    'Not available'}
                            </strong>

                        </div>


                        {/* CITY */}

                        <div className="payment-detail-row">

                            <span>
                                🏙️ Location
                            </span>

                            <strong>
                                {event.city ||
                                    'Not available'}
                            </strong>

                        </div>


                        {/* PAYMENT PLAN */}

                        <div className="payment-detail-row">

                            <span>
                                💳 Payment Plan
                            </span>

                            <strong>
                                {getPaymentPlanText()}
                            </strong>

                        </div>


                        {/* PAYMENT METHOD */}

                        {paymentPlan !== 'AFTER_EVENT' && (

                            <div className="payment-detail-row">

                                <span>
                                    💰 Payment Method
                                </span>

                                <strong>
                                    {paymentMethod}
                                </strong>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        AMOUNT SECTION
                    ================================================= */}

                    <div className="payment-amount-section">


                        {/* TOTAL */}

                        <div className="payment-total">

                            <span>
                                Total Event Amount
                            </span>

                            <strong>
                                ₹{displayTotalAmount}
                            </strong>

                        </div>


                        {/* PAY NOW */}

                        <div className="pay-now">

                            <span>
                                {paymentPlan === 'AFTER_EVENT'
                                    ? 'Pay Now'
                                    : 'Amount Payable Now'}
                            </span>

                            <strong>
                                ₹{displayPayableAmount}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        REMAINING AMOUNT
                    ================================================= */}

                    {paymentPlan === 'ADVANCE' && (

                        <div className="remaining-payment">

                            Remaining amount after advance:

                            <strong>
                                ₹{formatAmount(
                                    remainingAmount
                                )}
                            </strong>

                        </div>

                    )}


                    {/* =================================================
                        AFTER EVENT MESSAGE
                    ================================================= */}

                    {paymentPlan === 'AFTER_EVENT' && (

                        <div className="after-event-payment">

                            <span>
                                ℹ️
                            </span>

                            <p>
                                No payment is required now.
                                Your booking will be confirmed
                                and payment can be made after
                                the event.
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        RAZORPAY MESSAGE
                    ================================================= */}

                    {paymentPlan !== 'AFTER_EVENT' && (

                        <div className="after-event-payment">

                            <span>
                                🔒
                            </span>

                            <p>
                                You will be redirected to
                                Razorpay Checkout to complete
                                your payment securely.
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="payment-error">

                            {error}

                        </div>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="payment-actions">


                        {/* BACK */}

                        <button
                            type="button"
                            className="payment-back-btn"
                            disabled={processing}
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            ← Back
                        </button>


                        {/* PAY / CONFIRM */}

                        <button
                            type="button"
                            className="pay-now-btn"
                            disabled={processing}
                            onClick={handlePayment}
                        >

                            {processing ? (

                                <>

                                    <span className="payment-spinner"></span>

                                    Processing...

                                </>

                            ) : (

                                <>

                                    {paymentPlan === 'AFTER_EVENT'

                                        ? 'Confirm Booking'

                                        : `Pay ₹${displayPayableAmount}`

                                    }

                                    <span>
                                        →
                                    </span>

                                </>

                            )}

                        </button>

                    </div>


                    {/* =================================================
                        SECURITY
                    ================================================= */}

                    <p className="payment-security">

                        🔒 Secure booking

                        <span>•</span>

                        Your booking information is protected.

                    </p>

                </div>

            </div>

        </div>

    );

}