import { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import api from '../api/axiosConfig';
import AdminEvents from './AdminEvents';

import './AdminDashboard.css';

function Overview() {
  const [stats, setStats] = useState({ users: 0, bookings: 0, events: 0 });

  useEffect(() => {
    (async () => {
      const [users, bookings, events] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/bookings'),
        api.get('/events/public/all'),
      ]);
      setStats({ users: users.data.length, bookings: bookings.data.length, events: events.data.length });
    })();
  }, []);

  return (
    <div className="grid">
      <div className="card"><h3>Total Users</h3><h1>{stats.users}</h1></div>
      <div className="card"><h3>Total Bookings</h3><h1>{stats.bookings}</h1></div>
      <div className="card"><h3>Active Events</h3><h1>{stats.events}</h1></div>
    </div>
  );
}

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { api.get('/admin/bookings').then((res) => setBookings(res.data)); }, []);

  return (
    <div className="card">
      <h3>All Bookings</h3>
      <table>
        <thead>
          <tr><th>User</th><th>Event</th><th>Seats</th><th>Amount</th><th>Status</th><th>Booked At</th></tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.user.fullName}</td>
              <td>{b.event.title}</td>
              <td>{b.numberOfSeats}</td>
              <td>₹{b.totalAmount}</td>
              <td><span className={`badge ${b.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'}`}>{b.status}</span></td>
              <td>{new Date(b.bookedAt).toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <div style={{ marginBottom: 16 }}>
        <Link to="/admin"><button className="btn">Overview</button></Link>{' '}
        <Link to="/admin/events"><button className="btn secondary">Manage Events</button></Link>{' '}
        <Link to="/admin/bookings"><button className="btn secondary">All Bookings</button></Link>
      </div>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="bookings" element={<AllBookings />} />
      </Routes>
    </div>
  );
}
