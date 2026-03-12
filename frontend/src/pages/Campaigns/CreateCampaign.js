import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
  const [form, setForm] = useState({ title: '', description: '', goal: '', category: '', deadline: '' });
  const navigate = useNavigate();

  const categories = ['Education', 'Medical', 'Community', 'Emergency', 'Business', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/campaigns');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Start a Campaign</h1>
      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fundraising Goal (UGX)</label>
            <input type="number" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2" required>
              <option value="">Select a category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
              className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium">
            Create Campaign
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
