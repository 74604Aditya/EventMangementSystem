import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import {
    FaUsers,
    FaCalendarAlt,
    FaMapMarkedAlt,
    FaAward,
    FaHeart,
    FaGlobe,
} from 'react-icons/fa';

import './AboutUs.css';

function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;

      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentValue = Math.floor(progress * end);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated, end, duration]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
    }
    return num;
  };

  return (
    <h2 ref={counterRef}>
      {formatNumber(count)}
      {suffix}
    </h2>
  );
}

export default function AboutUs() {
    return (<div className="about-page">

        <section className="about-hero">
            <div className="about-hero-content">
                
                <div className="hero-badge">🪔 About SHREE Events</div>

                <h1>
                    ❤️ We Make Your Moments Special ❤️
                </h1>

                <p>
                    SHREE Events is a dedicated platform that connects people with
                    authentic festivals, traditional celebrations, and cultural
                    experiences across Maharashtra.
                </p>

                <div className="hero-actions">
                    <Link to="/events" className="primary-btn">
                        Explore Events
                    </Link>

                    <Link to="/contact-us" className="secondary-btn">
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>

        <section className="about-story">
            <div className="about-container">
                <div className="story-grid">

                    <div className="story-content">
                        <div className="section-badge">Our Story</div>

                        <h2>
                            A platform built for local communities and cultural
                            traditions
                        </h2>

                        <p>
                            We started SHREE Events with a simple mission: to make local
                            festivals and cultural programs easily discoverable and
                            accessible to everyone.
                        </p>

                        <p>
                            From Ganeshotsav celebrations to Wari festivals, Lavani
                            performances, and village cultural events, we believe every
                            tradition deserves a wider audience and better digital
                            support.
                        </p>
                    </div>

                    <div className="story-visual">
                        <div className="visual-card">
                            <div className="visual-icon">🎭</div>
                            <h3>Preserving Heritage</h3>
                            <p>Connecting generations through festivals and traditions.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section className="mission-section">
            <div className="about-container">

                <div className="section-header">
                    <div className="section-badge">Purpose</div>
                    <h2>Our mission and vision</h2>
                </div>

                <div className="mission-grid">

                    <div className="mission-card">
                        <div className="mission-icon">
                            <FaHeart />
                        </div>

                        <h3>Our Mission</h3>

                        <p>
                            To promote Maharashtra's cultural heritage by creating a
                            seamless platform for discovering, booking, and participating
                            in local festivals and traditional events.
                        </p>
                    </div>

                    <div className="mission-card">
                        <div className="mission-icon">
                            <FaGlobe />
                        </div>

                        <h3>Our Vision</h3>

                        <p>
                            To become the leading cultural event discovery platform,
                            connecting every village, organizer, and cultural enthusiast
                            across Maharashtra.
                        </p>
                    </div>

                </div>
            </div>
        </section>

        <section className="stats-section">
            <div className="about-container">
                <div className="stats-grid">

                    <div className="stat-card">
                        <Counter end={10000} suffix="+" />
                        <p>Happy Visitors</p>
                    </div>

                    <div className="stat-card">
                        <Counter end={500} suffix="+" />
                        <p>Cultural Events</p>
                    </div>

                    <div className="stat-card">
                        <Counter end={50} suffix="+" />
                        <p>Villages Connected</p>
                    </div>

                    <div className="stat-card">
                        <Counter end={98} suffix="%" />
                        <p>Satisfaction Rate</p>
                    </div>

                </div>
            </div>
        </section>

        <section className="features-section">
            <div className="about-container">

                <div className="section-header">
                    <div className="section-badge">Why Us</div>
                    <h2>What makes SHREE Events different</h2>
                </div>

                <div className="feature-grid">

                    <div className="feature-card">
                        <FaCalendarAlt className="feature-icon" />

                        <h3>Authentic local events</h3>

                        <p>
                            We focus on genuine cultural celebrations, village festivals,
                            and traditional programs across Maharashtra.
                        </p>
                    </div>

                    <div className="feature-card">
                        <FaUsers className="feature-icon" />

                        <h3>Community focused</h3>

                        <p>
                            We empower local organizers and communities by providing
                            digital visibility and easy event management.
                        </p>
                    </div>

                    <div className="feature-card">
                        <FaMapMarkedAlt className="feature-icon" />

                        <h3>Village connectivity</h3>

                        <p>
                            Discover events in nearby villages and towns with location-
                            based recommendations.
                        </p>
                    </div>

                    <div className="feature-card">
                        <FaAward className="feature-icon" />

                        <h3>Trusted platform</h3>

                        <p>
                            Verified organizers, transparent event information, and
                            secure booking experiences.
                        </p>
                    </div>

                </div>
            </div>
        </section>

        <section className="values-section">
            <div className="about-container">

                <div className="section-header">
                    <div className="section-badge">Our Values</div>
                    <h2>The principles that guide us</h2>
                </div>

                <div className="values-grid">

                    <div className="value-card">
                        <h3>Cultural Preservation</h3>
                        <p>Keeping traditions alive for future generations.</p>
                    </div>

                    <div className="value-card">
                        <h3>Community First</h3>
                        <p>Supporting local artists, organizers, and communities.</p>
                    </div>

                    <div className="value-card">
                        <h3>Transparency</h3>
                        <p>Clear pricing, verified events, and honest communication.</p>
                    </div>

                    <div className="value-card">
                        <h3>Innovation</h3>
                        <p>Modern technology with respect for traditional culture.</p>
                    </div>

                </div>
            </div>
        </section>

        <section className="team-section">
            <div className="about-container">

                <div className="section-header">
                    <div className="section-badge">Our Team</div>
                    <h2>The people behind SHREE Events</h2>
                </div>

                <div className="team-grid">

                    <div className="team-card">
                        <div className="team-avatar">A</div>
                        <h3>Aditya Lande</h3>
                        <p>Founder & Developer</p>
                    </div>

                    <div className="team-card">
                        <div className="team-avatar">S</div>
                        <h3>SHREE Event Management</h3>
                        <p>Community & Event Management</p>
                    </div>

                    <div className="team-card">
                        <div className="team-avatar">C</div>
                        <h3>Cultural Network</h3>
                        <p>Organizer Partnerships</p>
                    </div>

                </div>
            </div>
        </section>

        <section className="about-cta">
            <div className="about-container">

                <div className="cta-card">
                    <h2>Join us in celebrating Maharashtra's culture</h2>

                    <p>
                        Whether you're an event organizer or a festival enthusiast,
                        SHREE Events is your gateway to authentic cultural experiences.
                    </p>

                    <div className="cta-actions">
                        <Link to="/register" className="primary-btn">
                            Create Free Account
                        </Link>
                    </div>
                </div>

            </div>
        </section>

    </div>

    );
}
