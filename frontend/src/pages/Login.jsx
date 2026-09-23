import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { useAuth } from '../context/useAuth';

import {
  FaGoogle,
  FaFacebookF,
  FaApple,
  FaEye,
  FaEyeSlash,
  FaInstagram,
} from 'react-icons/fa';

import './Login.css';


export default function Login() {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [remember, setRemember] = useState(false);

  const [error, setError] = useState('');


  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();


  /* =====================================================
     VALIDATION
     ===================================================== */

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  /* =====================================================
     LOGIN
     ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');


    /* EMAIL VALIDATION */

    if (!emailRegex.test(email.trim())) {

      setError(
        'Please enter a valid email address'
      );

      return;
    }


    /* PASSWORD VALIDATION */

    if (password.length < 8) {

      setError(
        'Password must be at least 8 characters long'
      );

      return;
    }


    try {

      const data = await login(
        email.trim().toLowerCase(),
        password
      );


      /* =================================================
         ADMIN
         ================================================= */

      if (data.role === 'ADMIN') {

        navigate('/admin');

        return;
      }


      /* =================================================
         ORIGINAL PAGE
         ================================================= */

      /*
        If the user came from Book Now,
        location.state.from will contain:

        /events/1
        /events/2
        /events/3
        etc.
      */

      const from =
        location.state?.from;


      if (from) {

        navigate(from, {
          replace: true
        });

        return;
      }


      /* =================================================
         NORMAL USER LOGIN
         ================================================= */

      navigate('/dashboard', {
        replace: true
      });

    } catch (err) {

      console.error(
        'Login error:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Invalid email or password'
      );
    }
  };


  return (

    <div className="login-container">

      <div className="login-card">


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="login-left">

          <div className="login-header">

            <div className="logo">
              🪔
            </div>


            <h2>
              SHREE Event Management
            </h2>


            <h5>
              ❤️ We Make Your Moments Special ❤️
            </h5>


            <p>
              Welcome back! Sign in to continue
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="error-msg">
              {error}
            </div>

          )}


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form onSubmit={handleSubmit}>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
              </label>


              <div className="password-field">

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                />


                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >

                  {showPassword
                    ? <FaEyeSlash />
                    : <FaEye />
                  }

                </button>

              </div>

            </div>


            {/* LOGIN OPTIONS */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(
                      e.target.checked
                    )
                  }
                />

                Remember me

              </label>


              <Link
                to="/forgot-password"
                className="forgot-link"
              >
                Forgot password?
              </Link>

            </div>


            {/* SIGN IN */}

            <button
              className="login-btn"
              type="submit"
            >
              Sign in
            </button>

          </form>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="login-right">

          <div className="social-section">


            <div className="divider">

              <span>
                Or continue with
              </span>

            </div>


            <div className="social-login">


              <button
                type="button"
                className="social-btn google"
              >

                <FaGoogle />

                Google

              </button>


              <button
                type="button"
                className="social-btn facebook"
              >

                <FaFacebookF />

                Facebook

              </button>


              <button
                type="button"
                className="social-btn instagram"
              >

                <FaInstagram />

                Instagram

              </button>


              <button
                type="button"
                className="social-btn apple"
              >

                <FaApple />

                Apple

              </button>

            </div>


            <p className="register-link">

              Don't have an account?{' '}

              <Link to="/register">
                Create one
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}