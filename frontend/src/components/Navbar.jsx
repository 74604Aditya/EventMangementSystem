import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa';

import { useAuth } from '../context/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  // ==========================================
  // CLOSE MENUS WHEN ROUTE CHANGES
  // ==========================================

  useEffect(() => {
    setMobileOpen(false);
    setShowMenu(false);
  }, [location.pathname]);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    setMobileOpen(false);
    setShowMenu(false);

    navigate('/login');
  };


  // ==========================================
  // ACTIVE ROUTE
  // ==========================================

  const isActive = (path) => {
    return location.pathname === path;
  };


  // ==========================================
  // NAVIGATION ITEMS
  // ==========================================

  const NavItems = () => (
    <>
      {/* HOME */}

      {!isAdmin && (
        <Link
          to="/"
          className={isActive('/') ? 'active' : ''}
        >
          Home
        </Link>
      )}


      {/* ================= PUBLIC USER ================= */}

      {!user && (
        <>
          <Link
            to="/tncp"
            className={isActive('/tncp') ? 'active' : ''}
          >
            TNCP
          </Link>

          <Link
            to="/events"
            className={isActive('/events') ? 'active' : ''}
          >
            Events
          </Link>

          <Link
            to="/contact-us"
            className={isActive('/contact-us') ? 'active' : ''}
          >
            Contact Us
          </Link>

          <Link
            to="/about-us"
            className={isActive('/about-us') ? 'active' : ''}
          >
            About Us
          </Link>
        </>
      )}


      {/* ================= NORMAL USER ================= */}

      {user && !isAdmin && (
        <>
          <Link
            to="/tncp"
            className={isActive('/tncp') ? 'active' : ''}
          >
            TNCP
          </Link>

          <Link
            to="/events"
            className={isActive('/events') ? 'active' : ''}
          >
            Events
          </Link>

          <Link
            to="/dashboard"
            className={isActive('/dashboard') ? 'active' : ''}
          >
            Dashboard
          </Link>

          <Link
            to="/my-bookings"
            className={isActive('/my-bookings') ? 'active' : ''}
          >
            My Bookings
          </Link>
        </>
      )}


      {/* ================= ADMIN ================= */}

      {user && isAdmin && (
        <Link
          to="/admin"
          className={
            location.pathname.startsWith('/admin')
              ? 'active'
              : ''
          }
        >
          Admin Dashboard
        </Link>
      )}
    </>
  );


  return (
    <>
      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav
        className={`navbar ${scrolled ? 'scrolled' : ''
          }`}
      >

        {/* ================= LOGO ================= */}

        <Link to="/" className="brand">

          <span className="brand-logo">
            <img
              src="/assets/public/images/SE.png"
              alt="SHREE Events Logo"
            />
          </span>

          <span className="brand-text1">
            SHREE
          </span>

          <span className="brand-text2">
            Events
          </span>

        </Link>


        {/* ================= DESKTOP NAV ================= */}

        <div className="nav-links desktop-nav">

          <NavItems />


          {/* ================= LOGIN / REGISTER ================= */}

          {!user && (
            <>
              <Link
                to="/login"
                className={
                  isActive('/login')
                    ? 'active'
                    : ''
                }
              >
                Login
              </Link>

              <Link
                to="/register"
                className={
                  isActive('/register')
                    ? 'active'
                    : ''
                }
              >
                Register
              </Link>
            </>
          )}


          {/* ================= PROFILE ================= */}

          {user && (
            <div
              className="profile-menu"
              onMouseEnter={() => setShowMenu(true)}
            >

              <button
                type="button"
                className="profile-btn"
                onClick={() =>
                  setShowMenu((prev) => !prev)
                }
              >

                <div className="nav-avatar-large">
                  {user.fullName
                    ?.charAt(0)
                    ?.toUpperCase() || 'U'}
                </div>

              </button>


              {/* ================= DROPDOWN ================= */}

              {showMenu && (
                <div className="profile-dropdown">

                  <Link to="/profile">
                    <FaUserCircle />
                    <span>My Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                  >
                    <span>Logout</span>
                  </button>

                </div>
              )}

            </div>
          )}

        </div>


        {/* ================= MOBILE BUTTON ================= */}

        <button
          type="button"
          className={`hamburger ${mobileOpen ? 'open' : ''
            }`}
          onClick={() =>
            setMobileOpen(!mobileOpen)
          }
          aria-label="Menu"
        >
          {mobileOpen
            ? <FaTimes />
            : <FaBars />}
        </button>

      </nav>


      {/* ==========================================
          MOBILE DRAWER
      ========================================== */}

      {mobileOpen && (
        <div
          className="drawer-overlay"
          onClick={() =>
            setMobileOpen(false)
          }
        >

          <div
            className="mobile-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ================= USER INFORMATION ================= */}

            {user && (
              <div className="drawer-profile">

                <div className="profile-avatar large">
                  {user.fullName
                    ?.charAt(0)
                    ?.toUpperCase() || 'U'}
                </div>

                <h3>
                  {user.fullName}
                </h3>

                <p>
                  {user.email}
                </p>

              </div>
            )}


            {/* ================= LINKS ================= */}

            <div className="drawer-links">

              <NavItems />


              {/* ================= LOGGED OUT ================= */}

              {!user && (
                <>
                  <Link to="/login">
                    Login
                  </Link>

                  <Link to="/register">
                    Register
                  </Link>
                </>
              )}


              {/* ================= LOGGED IN ================= */}

              {user && (
                <>
                  <Link to="/profile">
                    <FaUserCircle />
                    <span>My Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}

            </div>

          </div>

        </div>
      )}
    </>
  );
}