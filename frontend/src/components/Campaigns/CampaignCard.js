import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

const CampaignCard = ({ campaign }) => {
  const progress = (campaign.raised_amount / campaign.goal_amount) * 100;
  const daysLeft = campaign.end_date 
    ? Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="card group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.cover_image || 'https://via.placeholder.com/400x200'}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        {campaign.is_featured && (
          <span className="absolute top-2 right-2 bg-uganda-yellow text-black px-2 py-1 rounded text-xs font-semibold">
            Featured
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
            {campaign.category}
          </span>
          {daysLeft && (
            <span className="text-xs text-gray-500 flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              {daysLeft} days left
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link to={`/campaign/${campaign.id}`} className="hover:text-primary-600 transition">
            {campaign.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {campaign.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">
              UGX {campaign.raised_amount?.toLocaleString()}
            </span>
            <span className="text-gray-500">
              of UGX {campaign.goal_amount?.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              {campaign.users?.profile_image ? (
                <img
                  src={campaign.users.profile_image}
                  alt={campaign.users.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-full h-full p-1 text-gray-400" />
              )}
            </div>
            <span className="text-sm text-gray-600">
              {campaign.users?.full_name?.split(' ')[0]}
            </span>
          </div>
          
          <Link
            to={`/donate/${campaign.id}`}
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <HeartIcon className="w-5 h-5" />
            <span>Donate</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
