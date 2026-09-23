import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './Home.css';

const events = [
  {
    id: 1,
    title: 'Ganeshotsav Decorations',
    image: 'https://images.unsplash.com/photo-1632404323837-5e7a455e593e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExN3x8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    title: 'Independence Day Decorations',
    image: 'https://plus.unsplash.com/premium_photo-1681398713955-a7f8d18a8527?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    title: 'Wedding Events',
    image: 'https://images.unsplash.com/photo-1608713709464-04cfb951c93f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D',
  },
];

const gallery = [
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
];

export default function Home() {
  return (<div className="home-page">

    {/* Hero
    <section className="hero">
      <div className="hero-content">
        <h1>Discover SHREE Event Management</h1>

        <h3 className="hero-tagline">
          ❤️ We Make Your Moments Special ❤️
        </h3>

        <p>
          Book events, cultural programs, traditional celebrations,
          decorations, and unforgettable experiences across Maharashtra.
        </p>

        <div className="hero-actions">
          <Link to="/events" className="primary-btn">
            Explore Events
          </Link>

          <Link to="/register" className="secondary-btn">
            Join Now
          </Link>
        </div>
      </div>
    </section> */}

    {/* Premium Carousel */}
    <section className="hero-carousel">
      <div
        id="festivalCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="2000"
      >

        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#festivalCarousel"
            data-bs-slide-to="0"
            className="active"
          ></button>

          <button
            type="button"
            data-bs-target="#festivalCarousel"
            data-bs-slide-to="1"
          ></button>

          <button
            type="button"
            data-bs-target="#festivalCarousel"
            data-bs-slide-to="2"
          ></button>

          <button
            type="button"
            data-bs-target="#festivalCarousel"
            data-bs-slide-to="3"
          ></button>
        </div>

        <div className="carousel-inner">

          <div className="carousel-item active">
            <img
              src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1600"
              className="d-block w-100"
              alt="TNCP"
            />

            <div className="carousel-overlay">
              <span className="carousel-badge">Celebration Point</span>

              <h2>The New Celebration Point</h2>

              <p>
                Custom Decorations, birthday parties, anniversaries, valentines day celebrations, all type of custom events and celebrations, and unforgettable
                moments — all in one place.
              </p>

              <Link to="/tncp" className="carousel-btn">
                Explore TNCP
              </Link>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600"
              className="d-block w-100"
              alt="Ganesh Festival"
            />

            <div className="carousel-overlay">
              <span className="carousel-badge">Ganeshotsav 2026</span>

              <h2>Celebrate Every Festival with <br /> SHREE Event Management</h2>

              <p>
                Book authentic cultural celebrations and traditional
                festivals across Maharashtra.
              </p>

              <Link to="/events" className="carousel-btn">
                Explore Events
              </Link>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600"
              className="d-block w-100"
              alt="Cultural Program"
            />

            <div className="carousel-overlay">
              <span className="carousel-badge">Cultural Nights</span>

              <h2>Experience Maharashtra's Rich Traditions</h2>

              <p>
                Discover Lavani performances, folk music, dance festivals,
                and village celebrations.
              </p>

              <Link to="/events" className="carousel-btn">
                Book Now
              </Link>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1600"
              className="d-block w-100"
              alt="Wedding Event"
            />

            <div className="carousel-overlay">
              <span className="carousel-badge">Premium Events</span>

              <h2>From Festivals to Special Celebrations</h2>

              <p>
                Decorations, cultural programs, weddings, and unforgettable
                moments — all in one place.
              </p>

              <Link to="/register" className="carousel-btn">
                Join SHREE Event Management
              </Link>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#festivalCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#festivalCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>

      </div>
    </section>

    {/* Featured Events */}
    <section className="section">
      <div className="section-header">
        <h2>Events</h2>
        <p>Traditional festivals, cultural programs, and memorable celebrations we organize</p>
      </div>

      <div className="event-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <img src={event.image} alt={event.title} />

            <div className="event-content">
              <h3>{event.title}</h3>
              <Link
                to={`/events/${event.id}`}
                className="event-btn"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All Events Button */}
      <div className="view-all-events">
        <Link to="/events" className="view-all-btn">
          View All Events
        </Link>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="section features">
      <div className="section-header">
        <h2>Why Choose <br/>
        SHREE Event Management</h2>
        <p>Your trusted cultural event booking platform</p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>Local Events</h3>
          <p>
            Discover authentic festivals and cultural programs across
            Parner taluka and nearby villages.
          </p>
        </div>

        <div className="feature-card">
          <h3>Easy Booking</h3>
          <p>
            Book tickets and event services in minutes with a simple and
            secure booking process.
          </p>
        </div>

        <div className="feature-card">
          <h3>Trusted Organizers</h3>
          <p>
            Verified organizers, transparent pricing, and reliable event
            management services.
          </p>
        </div>

        <div className="feature-card">
          <h3>Premium Experience</h3>
          <p>
            Beautiful venues, decorations, cultural performances, and
            memorable celebrations for every occasion.
          </p>
        </div>
      </div>
    </section>

    {/* Photo Gallery */}
    <section className="section gallery-section">
      <div className="section-header">
        <h2>Festival Moments</h2>
        <p>Glimpses of celebrations, traditions, and unforgettable memories</p>
      </div>

      <div className="gallery-collage">
        {gallery.map((image, index) => (
          <div
            className={`gallery-item item-${(index % 6) + 1}`}
            key={index}
          >
            <img src={image} alt={`Festival ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="cta">
      <div className="cta-content">
        <h2>Ready to Make Your Moments Special?</h2>

        <p>
          Join SHREE Event Management today and discover the best cultural events,
          festivals, and celebrations across Maharashtra.
        </p>

        <Link to="/register" className="primary-btn">
          Create Free Account
        </Link>
      </div>
    </section>

  </div>

  );
}
