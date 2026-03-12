import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you shortly.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Send Message
          </button>
        </form>
        <div className="mt-6 pt-6 border-t text-sm text-gray-500 space-y-1">
          <p>📧 support@raiser.ug</p>
          <p>📍 Kampala, Uganda</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
