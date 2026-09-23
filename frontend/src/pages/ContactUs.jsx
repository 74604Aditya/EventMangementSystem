import { useState } from 'react';
import {
FaPhoneAlt,
FaEnvelope,
FaMapMarkerAlt,
FaFacebookF,
FaInstagram,
FaWhatsapp,
} from 'react-icons/fa';
import './ContactUs.css';

export default function ContactUs() {
const [form, setForm] = useState({
name: '',
email: '',
phone: '',
subject: '',
message: '',
});

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const handleSubmit = (e) => {
e.preventDefault();
alert('Message sent successfully!');
};

return ( <div className="contact-container"> <div className="contact-card">

    <div className="contact-left">
      <div className="contact-header">
        <div className="logo">🪔</div>
        <h2>Contact Us</h2>
        <p>We’d love to hear from you. Send us a message and we’ll respond as soon as possible.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows="5"
            required
          ></textarea>
        </div>

        <button className="contact-btn" type="submit">
          Send Message
        </button>
      </form>
    </div>

    <div className="contact-right">
      <div className="contact-info">
        <h3>Get in Touch</h3>

        <div className="info-item">
          <FaPhoneAlt />
          <div>
            <h4>Phone</h4>
            <p>+91 98765 43210</p>
          </div>
        </div>

        <div className="info-item">
          <FaEnvelope />
          <div>
            <h4>Email</h4>
            <p>support@shreeevents.com</p>
          </div>
        </div>

        <div className="info-item">
          <FaMapMarkerAlt />
          <div>
            <h4>Office</h4>
            <p>Parner, Ahmednagar, Maharashtra</p>
          </div>
        </div>

        <div className="social-section">
          <h4>Follow Us</h4>

          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaWhatsapp /></a>
          </div>
        </div>

        <div className="support-box">
          <h4>Support Hours</h4>
          <p>Monday - Sunday</p>
          <p>9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>

  </div>
</div>

);
}
