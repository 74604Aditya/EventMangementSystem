import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  FaGoogle,
  FaFacebookF,
  FaApple,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import './Register.css';

export default function Register() {

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number: allow only digits and max 10 digits
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);

      setForm((prev) => ({
        ...prev,
        phone: phoneValue,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm({ ...form, phone: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Full name validation
    if (form.fullName.trim().length < 3) {
      setError('Full name must be at least 3 characters long');
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(form.fullName.trim())) {
      setError('Full name can contain only letters and spaces');
      return;
    }

    // Email validation
    if (!emailRegex.test(form.email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation
    if (!phoneRegex.test(form.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    // Password validation
    if (!passwordRegex.test(form.password)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      );
      return;
    }

    // Confirm password
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Terms
    if (!agree) {
      setError('Please accept the Terms & Conditions');
      return;
    }

    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        password: form.password,
      });

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }

  };

  return (
    <div className="register-container"> <div className="register-card">

      {/* Left Section */}
      <div className="register-left">
        <div className="register-header">
          <div className="logo">🪔</div>
          <h2>Create Account</h2>
          <h3>Join SHREE Event Management and book amazing events</h3>
          <h4>" सजावट तुमची जबाबदारी आमची "</h4>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
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
            <label>Phone number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your 10-digit mobile number"
              maxLength={10}
              inputMode="numeric"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm password</label>

            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <label className="terms">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />

            <span>
              I agree to the{' '}
              <Link to="/terms">Terms & Conditions</Link>
            </span>
          </label>

          <button className="register-btn" type="submit">
            Create Account
          </button>

        </form>
      </div>

      {/* Right Section */}
      <div className="register-right">
        <div className="social-section">
          <div className="divider">
            <span>Or sign up with</span>
          </div>

          <div className="social-login">
            <button className="social-btn google" type="button">
              <FaGoogle />
              Google
            </button>

            <button className="social-btn facebook" type="button">
              <FaFacebookF />
              Facebook
            </button>

            <button className="social-btn apple" type="button">
              <FaApple />
              Apple
            </button>
          </div>

          <p className="login-link">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

    </div>
    </div>
  );
}

