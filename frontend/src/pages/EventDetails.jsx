import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

import eventsData from '../data/eventsData';

import './EventDetails.css';

export default function EventDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  /* =====================================================
     EVENT
  ===================================================== */

  const event = eventsData.find(
    (item) => item.id === Number(id)
  );


  /* =====================================================
     FORM STATE
  ===================================================== */

  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');

  const [error, setError] = useState('');


  /* =====================================================
     EVENT NOT FOUND
  ===================================================== */

  if (!event) {

    return (

      <div className="event-not-found">

        <div className="event-not-found-box">

          <div className="not-found-icon">
            😕
          </div>

          <h2>
            Event Not Found
          </h2>

          <p>
            Sorry, the event you are looking for
            does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate('/events')}
          >
            Back to Events
          </button>

        </div>

      </div>

    );
  }


  /* =====================================================
     GET TODAY'S DATE
  ===================================================== */

  const today = new Date()
    .toISOString()
    .split('T')[0];


  /* =====================================================
     BOOK EVENT
  ===================================================== */

  const handleBookEvent = () => {

    setError('');

    /* ---------------------------------------------
       DATE VALIDATION
    --------------------------------------------- */

    if (!eventDate) {

      setError(
        'Please select a date for your event.'
      );

      return;
    }


    /* ---------------------------------------------
       VENUE VALIDATION
    --------------------------------------------- */

    if (!venue.trim()) {

      setError(
        'Please enter the venue for your event.'
      );

      return;
    }


    /* ---------------------------------------------
       LOGIN CHECK
    --------------------------------------------- */

    if (!user) {

      /*
        Save booking information temporarily
        while sending the user to login.
      */

      navigate('/login', {

        state: {

          from: `/events/${event.id}`,

          bookingData: {
            eventId: event.id,
            eventDate: eventDate,
            venue: venue.trim()
          }

        }

      });

      return;
    }


    /* ---------------------------------------------
       USER IS LOGGED IN
    --------------------------------------------- */

    navigate(`/booking/${event.id}`, {

      state: {

        eventDate: eventDate,

        venue: venue.trim()

      }

    });

  };


  /* =====================================================
     JSX
  ===================================================== */

  return (

    <div className="event-details-page">

      <div className="event-details-container">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          className="back-events-btn"
          onClick={() => navigate('/events')}
        >
          ← Back to Events
        </button>


        {/* =================================================
            MAIN DETAILS CARD
        ================================================= */}

        <div className="event-details-card">


          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="event-details-image">

            <img
              src={event.image}
              alt={event.title}
            />

            <span className="details-category">
              {event.category}
            </span>

          </div>


          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="event-details-content">


            <span className="details-label">
              SHREE EVENTS
            </span>


            <h1>
              {event.title}
            </h1>


            <p className="event-details-description">
              {event.description}
            </p>


            {/* =================================================
                EVENT INFORMATION
            ================================================= */}

            <div className="event-info-grid">

              <div className="event-info-item">

                <span className="info-icon">
                  🎉
                </span>

                <div>

                  <small>
                    Event Type
                  </small>

                  <strong>
                    {event.category}
                  </strong>

                </div>

              </div>

            </div>


            {/* =================================================
                DATE SELECTOR
            ================================================= */}

            <div className="booking-field">

              <label htmlFor="eventDate">
                📅 Select Event Date
              </label>

              <input
                id="eventDate"
                type="date"
                min={today}
                value={eventDate}
                onChange={(e) =>
                  setEventDate(e.target.value)
                }
              />

              <small>
                Select the date on which you want
                to organize the event.
              </small>

            </div>


            {/* =================================================
                CUSTOM VENUE
            ================================================= */}

            <div className="booking-field">

              <label htmlFor="venue">
                📍 Event Venue
              </label>

              <input
                id="venue"
                type="text"
                placeholder="Enter your event venue"
                value={venue}
                onChange={(e) =>
                  setVenue(e.target.value)
                }
              />

              <small>
                Enter the location where you want
                the event to be organized.
              </small>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="booking-error">
                ⚠️ {error}
              </div>

            )}


            {/* =================================================
                PRICE + BOOK
            ================================================= */}

            <div className="event-booking-footer">

              <div className="details-price">

                <span>
                  Starting from
                </span>

                <strong>
                  ₹{event.price.toLocaleString('en-IN')}
                </strong>

              </div>


              <button
                type="button"
                className="book-event-btn"
                onClick={handleBookEvent}
              >
                Book This Event
                <span>→</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}