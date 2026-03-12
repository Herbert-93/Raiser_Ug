import React from 'react';
import { useParams, Link } from 'react-router-dom';

const CampaignDetails = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Campaign #{id}</h1>
        <div className="bg-gray-200 h-64 rounded-lg mb-6 flex items-center justify-center text-gray-500">
          Campaign Image
        </div>
        <p className="text-gray-600 mb-6">
          This campaign details page will display full information about the campaign once connected to the backend.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '45%' }} />
          </div>
          <p className="text-sm text-gray-600">45% funded</p>
        </div>
        <Link to={`/donate/${id}`}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Donate Now
        </Link>
      </div>
    </div>
  );
};

export default CampaignDetails;
