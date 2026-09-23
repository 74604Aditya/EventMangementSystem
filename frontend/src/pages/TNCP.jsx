import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaMapMarkerAlt, FaGift } from 'react-icons/fa';
import './TNCP.css';


const gallery = [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
];

export default function TNCP() {
    return (<div className="tncp-page">

        {/* Hero Banner */}
        <section className="tncp-hero">
            <div className="tncp-overlay"></div>

            <div className="tncp-hero-content">

                <div className="tncp-badge">
                    <img src="./assets/public/images/TNCP.png" alt="TNCP Logo" />
                </div>

                <h1>THE NEW CELEBRATION POINT</h1>

                <h2>❤️ We Make Your Moments Special ❤️</h2>

                <p className="tncp-tagline">
                    We make your moments of joy unforgettable...
                </p>

                <p className="tncp-tagline secondary">
                    The occasion is yours; the responsibility is ours!
                </p>

                <div className="tncp-btns">
                    <button className="primary-btn">
                        Balloon Decoration
                    </button>
                    <button className="primary-btn">
                        Birthday Setups
                    </button>
                    <button className="primary-btn">
                        Anniversary Celebrations
                    </button>
                    <button className="primary-btn">
                        Ring Ceremonies
                    </button>
                    <button className="primary-btn">
                        Selfie Points
                    </button>
                    <button className="primary-btn">
                        Surprise Events
                    </button>
                    <button className="primary-btn">
                        Floral Art
                    </button>
                    <button className="primary-btn">
                        All Types of Celebrations
                    </button>
                </div>

                <div className="tncp-contact-info">

                    <div className="contact-item">
                        <FaMapMarkerAlt />
                        <span>
                            Near Paridhan Collection, Supa–Parner Road,
                            Parner, Taluka Parner, District Ahmednagar
                        </span>
                    </div>

                    <div className="contact-item">
                        <FaPhoneAlt />
                        <span>8767228828 / 9529784421</span>
                    </div>

                </div>

                <div className="tncp-buttons">
                    <a href="tel:8767228828" className="primary-btn">
                        Book Your Celebration
                    </a>
                </div>

                <div className="combo-offer">
                    <span className="offer-label">Special Combo Offer</span>
                    <h3>Celebration Pack Available</h3>
                    <p>
                        Complete decoration, selfie point, balloon setup,
                        floral art, and customized celebration themes
                        at exclusive combo prices.
                    </p>
                </div>

            </div>

        </section>

        {/* =========================
     OUR CELEBRATION SERVICES
  ========================= */}

        <section className="tncp-section">
            <div className="section-header">
                <span className="section-subtitle">Our Services</span>
                <h2>Celebrations We Create</h2>
                <p>
                    Beautiful decorations and personalized celebration setups
                    designed to make every occasion unforgettable.
                </p>
            </div>

            <div className="services-grid">

                <div className="service-card">
                    <div className="service-icon">🎈</div>
                    <h3>Balloon Decoration</h3>
                    <p>
                        Premium balloon arches, ceiling décor, themed balloon
                        arrangements, and customized celebration styling.
                    </p>
                </div>

                <div className="service-card">
                    <div className="service-icon">🎂</div>
                    <h3>Birthday Setup</h3>
                    <p>
                        Elegant birthday backdrops, cake tables, lighting,
                        personalized themes, and complete party decoration.
                    </p>
                </div>

                <div className="service-card">
                    <div className="service-icon">📸</div>
                    <h3>Selfie Point</h3>
                    <p>
                        Creative selfie corners and premium photo booths
                        that make your celebration Instagram-worthy.
                    </p>
                </div>

                <div className="service-card">
                    <div className="service-icon">❤️</div>
                    <h3>LOVE Celebration</h3>
                    <p>
                        Romantic room decoration, proposal setups,
                        candlelight themes, and surprise couple celebrations.
                    </p>
                </div>

                <div className="service-card">
                    <div className="service-icon">🎁</div>
                    <h3>Surprise Decoration</h3>
                    <p>
                        Midnight surprises, welcome decorations,
                        anniversary surprises, and personalized celebration experiences.
                    </p>
                </div>

                <div className="service-card">
                    <div className="service-icon">🌸</div>
                    <h3>Floral Art & Decoration</h3>
                    <p>
                        Fresh floral arrangements, entrance décor,
                        stage decoration, and elegant celebration styling.
                    </p>
                </div>

                <div className="service-card">
                    <div className="service-icon">💍</div>
                    <h3>Ring Ceremonies</h3>
                    <p>
                        Beautiful engagement décor, floral backdrops,
                        lighting arrangements, and memorable ceremony setups.
                    </p>
                </div>

                <div className="service-card">
                    <div className="service-icon">✨</div>
                    <h3>All Types of Celebrations</h3>
                    <p>
                        Weddings, birthdays, anniversaries, family functions,
                        festive events, and customized celebration themes.
                    </p>
                </div>

            </div>
        </section>

        {/* =========================
     CELEBRATION COMBO PACKS
  ========================= */}

        <section className="combo-section">
            <div className="section-header">
                <span className="section-subtitle">Special Offers</span>
                <h2>Celebration Combo Packs</h2>
                <p>
                    Complete celebration solutions with premium decorations,
                    selfie points, floral art, and personalized themes.
                </p>
            </div>

            <div className="combo-grid">

                <div className="combo-card">

                    <div className="combo-badge">Most Popular</div>

                    <h3>Birthday Celebration Pack</h3>

                    <ul>
                        <li>Balloon Decoration</li>
                        <li>Birthday Backdrop</li>
                        <li>Selfie Point</li>
                        <li>LED Lighting</li>
                        <li>Cake Table Decoration</li>
                    </ul>

                    <a href="tel:8767228828" className="combo-btn">
                        Book This Pack
                    </a>

                </div>

                <div className="combo-card featured">

                    <div className="combo-badge">Best Value</div>

                    <h3>Premium Celebration Pack</h3>

                    <ul>
                        <li>Luxury Balloon Decoration</li>
                        <li>Premium Selfie Point</li>
                        <li>Floral Art</li>
                        <li>Customized Theme Setup</li>
                        <li>Entrance Decoration</li>
                        <li>Complete Celebration Styling</li>
                    </ul>

                    <a href="tel:8767228828" className="combo-btn">
                        Book Premium Pack
                    </a>

                </div>

                <div className="combo-card">

                    <div className="combo-badge">Romantic</div>

                    <h3>LOVE Celebration Pack</h3>

                    <ul>
                        <li>Romantic Decoration</li>
                        <li>Candlelight Setup</li>
                        <li>Floral Arrangements</li>
                        <li>Personalized Message Décor</li>
                        <li>Photo Corner</li>
                    </ul>

                    <a href="tel:9529784421" className="combo-btn">
                        Book This Pack
                    </a>

                </div>

            </div>
        </section>

        {/* =========================
     WHY CHOOSE TNCP
  ========================= */}

        <section className="tncp-section why-section">
            <div className="section-header">
                <span className="section-subtitle">Why Choose Us</span>
                <h2>Perfect Decoration for Every Special Moment</h2>
            </div>

            <div className="why-grid">

                <div className="why-card">
                    <h3>Premium Decoration</h3>
                    <p>
                        High-quality decoration materials and elegant
                        celebration styling for every occasion.
                    </p>
                </div>

                <div className="why-card">
                    <h3>Customized Themes</h3>
                    <p>
                        Every celebration is designed according to
                        your preferences and event style.
                    </p>
                </div>

                <div className="why-card">
                    <h3>Affordable Combo Offers</h3>
                    <p>
                        Premium decoration packages at reasonable prices
                        with complete celebration solutions.
                    </p>
                </div>

                <div className="why-card">
                    <h3>Timely Setup</h3>
                    <p>
                        Professional execution and on-time decoration setup
                        so you can enjoy your celebration stress-free.
                    </p>
                </div>

            </div>
        </section>

        {/* =========================
     PHOTO GALLERY
  ========================= */}

        <section className="tncp-section gallery-section" id="gallery">
            <div className="section-header">
                <span className="section-subtitle">Our Gallery</span>
                <h2>Celebration Moments</h2>
                <p>
                    A glimpse of the beautiful decorations and memorable
                    celebrations created at The New Celebration Point.
                </p>
            </div>

            <div className="gallery-collage">
                {gallery.map((image, index) => (
                    <div
                        className={`gallery-item item-${(index % 6) + 1}`}
                        key={index}
                    >
                        <img src={image} alt={`Celebration ${index + 1}`} />
                    </div>
                ))}
            </div>
        </section>

        {/* =========================
     TESTIMONIALS
  ========================= */}

        <section className="tncp-section testimonials-section">
            <div className="section-header">
                <span className="section-subtitle">Happy Customers</span>
                <h2>What Our Customers Say</h2>
            </div>

            <div className="testimonial-grid">

                <div className="testimonial-card">
                    <p>
                        “The birthday decoration was absolutely beautiful.
                        The selfie point became the highlight of our celebration.”
                    </p>
                    <h4>— Priya Patil</h4>
                </div>

                <div className="testimonial-card">
                    <p>
                        “Amazing decoration, great service, and very reasonable pricing.
                        Highly recommended for every celebration.”
                    </p>
                    <h4>— Rahul Jadhav</h4>
                </div>

                <div className="testimonial-card">
                    <p>
                        “The surprise decoration exceeded our expectations.
                        Every detail was perfectly arranged.”
                    </p>
                    <h4>— Sneha Kulkarni</h4>
                </div>

            </div>
        </section>

        {/* =========================
     CONTACT SECTION
  ========================= */}

        <section className="contact-section">
            <div className="contact-content">

                <h2>Ready to Celebrate?</h2>

                <p>
                    Visit our shop or call us today to book your decoration,
                    celebration setup, or premium combo pack.
                </p>

                <div className="contact-details">
                    <p>
                        🗺️ Near Paridhan Collection, Supa–Parner Road,
                        Parner, Taluka Parner, District Ahmednagar
                    </p>

                    <p>📱 8767228828 / 9529784421</p>
                </div>

                <div className="contact-buttons">

                    <a
                        href="https://maps.app.goo.gl/QRNYk7yJkVpQjteM6"
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-btn"
                    >
                        Visit Our Shop
                    </a>
                </div>

            </div>
        </section>
    </div>

    );
}
