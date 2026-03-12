import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { label: 'My Campaigns', value: '3', color: 'bg-blue-500' },
    { label: 'Total Raised', value: 'UGX 4.2M', color: 'bg-green-500' },
    { label: 'Total Donors', value: '128', color: 'bg-purple-500' },
    { label: 'Donations Made', value: '7', color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className={`${stat.color} text-white rounded-lg p-6`}>
            <p className="text-sm opacity-80">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Campaigns</h2>
          <Link to="/campaigns/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            + New Campaign
          </Link>
        </div>
        <p className="text-gray-500 text-center py-8">
          No campaigns yet. <Link to="/campaigns/create" className="text-blue-600 hover:underline">Create your first one!</Link>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
