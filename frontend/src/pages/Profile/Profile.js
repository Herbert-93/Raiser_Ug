import React, { useState } from 'react';

const Profile = () => {
  const [form, setForm] = useState({ full_name: 'John Doe', email: 'john@example.com', phone: '0700000000', bio: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated!');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
            {form.full_name.charAt(0)}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{form.full_name}</h2>
            <p className="text-gray-500">{form.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['full_name', 'email', 'phone'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace('_', ' ')}
              </label>
              <input type="text" value={form[field]}
                onChange={e => setForm({...form, [field]: e.target.value})}
                className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea rows={3} value={form.bio}
              onChange={e => setForm({...form, bio: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Tell people about yourself..." />
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
