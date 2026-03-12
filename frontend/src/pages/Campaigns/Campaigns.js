import React from 'react';
import { Link } from 'react-router-dom';

const Campaigns = () => {
  const sampleCampaigns = [
    { id: 1, title: 'Help Build a School', category: 'Education', goal: 5000000, raised: 2300000 },
    { id: 2, title: 'Medical Fund for John', category: 'Medical', goal: 3000000, raised: 1500000 },
    { id: 3, title: 'Clean Water Project', category: 'Community', goal: 8000000, raised: 4200000 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCampaigns.map(campaign => (
          <div key={campaign.id} className="bg-white rounded-lg shadow p-6">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{campaign.category}</span>
            <h3 className="text-lg font-semibold mt-2 mb-3">{campaign.title}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }} />
            </div>
            <p className="text-sm text-gray-600">
              UGX {campaign.raised.toLocaleString()} raised of UGX {campaign.goal.toLocaleString()}
            </p>
            <Link to={`/campaign/${campaign.id}`}
              className="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              View Campaign
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
