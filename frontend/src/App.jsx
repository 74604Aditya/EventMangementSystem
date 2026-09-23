import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './pages/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';

import Booking from './pages/Booking';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';

import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TNCP from './pages/TNCP';

import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

import {
  PrivateRoute,
  AdminRoute,
} from './components/PrivateRoute';

export default function App() {
  return (
    <>
      <Navbar />

      <ScrollToTop />

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/about-us"
          element={<AboutUs />}
        />

        <Route
          path="/contact-us"
          element={<ContactUs />}
        />

        <Route
          path="/tncp"
          element={<TNCP />}
        />


        {/* =================================================
            USER PROTECTED ROUTES
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />


        {/* =================================================
            BOOKING
        ================================================= */}

        <Route
          path="/booking/:id"
          element={
              <Booking />
          }
        />


        {/* =================================================
            PAYMENT
        ================================================= */}

        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />


        {/* =================================================
            BOOKING CONFIRMATION
        ================================================= */}

        <Route
          path="/booking-confirmation"
          element={
            <PrivateRoute>
              <BookingConfirmation />
            </PrivateRoute>
          }
        />


        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Routes>

      <Footer />
    </>
  );
}