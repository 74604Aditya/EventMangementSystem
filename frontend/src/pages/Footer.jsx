import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
    return (<footer className="footer"> <div className="footer-container">

        <div className="footer-about">
            <h2> SHREE Events Management</h2>
            <p>
                Discover, book, and experience the vibrant cultural festivals,
                traditional celebrations, and heritage events across Maharashtra.
            </p>

            <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <FaFacebookF />
                </a>

                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    <FaInstagram />
                </a>

                <a href="https://youtube.com" target="_blank" rel="noreferrer">
                    <FaYoutube />
                </a>
            </div>
        </div>

        <div className="footer-links">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/tncp">TNCP</Link>
            <Link to="/events">Events</Link>
            <Link to="/about-us">About Us</Link>
            <Link to="/contact-us">Contact Us</Link>
        </div>

        <div className="footer-links">
            <h3>Categories</h3>
            <Link to="/events?category=ganeshotsav">Ganeshotsav</Link>
            <Link to="/events?category=wari">Wedding Events</Link>
            <Link to="/events?category=decorations">Decorations</Link>
            <Link to="/events?category=celebrations">Celebrations</Link>
        </div>

        <div className="footer-contact">
            <h3>Contact</h3>

            <p>
                <FaPhoneAlt />  8767228828 / 9529784421
            </p>

            <p>
                <FaEnvelope /> support@shreeevents.com
            </p>

            <p>
                <FaMapMarkerAlt /> Near Paridhan Collection, Supa–Parner Road, Parner, Taluka-Parner, District-Ahilyanagar
            </p>
        </div>

    </div>

        <div className="footer-bottom">
            <p>© 2026 SHREE Event Management. All rights reserved.</p>
        </div>
    </footer>

    );
}
