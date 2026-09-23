import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

import eventsData from '../data/eventsData';

import './Events.css';

const categories = [
  'All',
  'Cultural Festivals',
  'Events',
  'Decorations',
];

export default function Events() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const navigate = useNavigate();
  const { user } = useAuth();

  /* =====================================================
     FILTER EVENTS
     ===================================================== */

  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch =
      event.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === 'All' ||
      event.category === category;

    return matchesSearch && matchesCategory;
  });

  /* =====================================================
     BOOK NOW
     ===================================================== */

  const handleBookNow = (eventId) => {
    /*
      USER NOT LOGGED IN
      ------------------
      Send user to Login page.

      After successful login, Login.jsx should
      redirect the user to:

      /booking/{eventId}
    */

    if (!user) {
      navigate('/login', {
        state: {
          from: `/booking/${eventId}`,
        },
      });

      return;
    }

    /*
      USER ALREADY LOGGED IN
      ----------------------
      Go directly to Booking page.
    */

    navigate(`/booking/${eventId}`);
  };

  return (
    <div className="events-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="events-hero">
        <div className="events-hero-content">

          <h1>
            Explore Cultural Events
          </h1>

          <p>
            Discover festivals, traditional performances,
            and community celebrations across Parner Taluka.
          </p>

        </div>
      </section>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <section className="events-controls">

        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        <div className="category-filter">

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}

        </div>

      </section>


      {/* =================================================
          EVENTS
      ================================================= */}

      <section className="events-section">

        <div className="events-grid">

          {filteredEvents.map((event) => (
            <div
              className="event-card"
              key={event.id}
            >

              {/* EVENT IMAGE */}

              <div className="event-image">

                <img
                  src={event.image}
                  alt={event.title}
                />

                <span className="event-category">
                  {event.category}
                </span>

              </div>


              {/* EVENT CONTENT */}

              <div className="event-content">

                <h3>
                  {event.title}
                </h3>


                <div className="event-footer">

                  <span className="event-price">
                    ₹
                    {Number(event.price || 0).toLocaleString(
                      'en-IN'
                    )}
                  </span>


                  {/* BOOK NOW */}

                  <button
                    type="button"
                    className="book-btn"
                    onClick={() => handleBookNow(event.id)}
                  >
                    Book Now
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>


        {/* =================================================
            NO EVENTS
        ================================================= */}

        {filteredEvents.length === 0 && (
          <div className="no-events">

            <h3>
              No events found
            </h3>

            <p>
              Try a different search or category.
            </p>

          </div>
        )}

      </section>

    </div>
  );
}