import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const emptyForm = {
  title: '', description: '', categoryId: '', city: '', venue: '',
  eventDateTime: '', ticketPrice: 0, imageUrl: '',
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const [ev, cat] = await Promise.all([api.get('/events/public/all'), api.get('/admin/categories')]);
    setEvents(ev.data);
    setCategories(cat.data);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, categoryId: form.categoryId || null };
      if (editingId) {
        await api.put(`/admin/events/${editingId}`, payload);
      } else {
        await api.post('/admin/events', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const editEvent = (ev) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description || '',
      categoryId: ev.category?.id || '',
      city: ev.city,
      venue: ev.venue || '',
      eventDateTime: ev.eventDateTime.slice(0, 16),
      ticketPrice: ev.ticketPrice,
      totalSeats: ev.totalSeats,
      imageUrl: ev.imageUrl || '',
    });
  };

  const deactivate = async (id) => {
    if (!confirm('Deactivate this event?')) return;
    await api.delete(`/admin/events/${id}`);
    load();
  };

  return (
    <div>
      <div className="card">
        <h3>{editingId ? 'Edit Event' : 'Create New Event'}</h3>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          <label>Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange}>
            <option value="">-- None --</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label>City</label>
          <input name="city" value={form.city} onChange={handleChange} required />
          <label>Venue</label>
          <input name="venue" value={form.venue} onChange={handleChange} />
          <label>Date & Time</label>
          <input type="datetime-local" name="eventDateTime" value={form.eventDateTime} onChange={handleChange} required />
          <label>Ticket Price (₹, 0 = free)</label>
          <input type="number" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} min="0" step="0.01" required />
          <label>Total Seats</label>
          <input type="number" name="totalSeats" value={form.totalSeats} onChange={handleChange} min="1" required />
          <label>Image URL (optional)</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          <button className="btn" type="submit">{editingId ? 'Update Event' : 'Create Event'}</button>
          {editingId && (
            <button type="button" className="btn secondary" style={{ marginLeft: 10 }}
              onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="grid">
        {events.map((ev) => (
          <div className="card" key={ev.id}>
            <h4>{ev.title}</h4>
            <p>{ev.city} | {new Date(ev.eventDateTime).toLocaleString('en-IN')}</p>
            <p>Seats: {ev.availableSeats}/{ev.totalSeats}</p>
            <button className="btn secondary" onClick={() => editEvent(ev)}>Edit</button>{' '}
            <button className="btn danger" onClick={() => deactivate(ev.id)}>Deactivate</button>
          </div>
        ))}
      </div>
    </div>
  );
}
