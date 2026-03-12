import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  UsersIcon, 
  GlobeAltIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import api from '../services/api';
import CampaignCard from '../components/Campaigns/CampaignCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Home = () => {
  const { data: featuredCampaigns, isLoading } = useQuery(
    'featuredCampaigns',
    () => api.get('/campaigns/featured').then(res => res.data.campaigns)
  );

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        ></div>
        
        <div className="relative container-custom py-24 md:py-32">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empower Dreams,{' '}
              <span className="text-uganda-yellow">Change Lives</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Join Uganda's leading fundraising platform. Start a campaign for 
              medical emergencies, education, community projects, and more.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/create-campaign" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-center">
                Start a Campaign
              </Link>
              <Link to="/campaigns" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600 text-center">
                Explore Campaigns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Campaigns Launched' },
              { number: '10K+', label: 'Generous Donors' },
              { number: 'UGX 2.5B+', label: 'Funds Raised' },
              { number: '200+', label: 'Communities Helped' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover inspiring stories and make a difference in someone's life today
            </p>
          </motion.div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCampaigns?.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CampaignCard campaign={campaign} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/campaigns" className="btn-secondary inline-flex items-center">
              View All Campaigns
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start making a difference
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: UsersIcon, title: 'Create Your Campaign', description: 'Tell your story, set your goal, and add photos to create your campaign page.' },
              { icon: GlobeAltIcon, title: 'Share Your Story', description: 'Spread the word through social media, email, and WhatsApp to reach potential donors.' },
              { icon: HeartIcon, title: 'Receive Funds', description: 'Watch your community come together to support your cause and receive funds securely.' }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Raiser</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The most trusted fundraising platform in Uganda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: ShieldCheckIcon, title: 'Secure & Trusted', description: 'Your donations and personal information are always safe with our bank-level security.' },
              { icon: CurrencyDollarIcon, title: 'Multiple Payment Options', description: 'Accept donations via MTN Mobile Money, Airtel Money, and Credit/Debit cards.' },
              { icon: HeartIcon, title: '0% Platform Fees', description: 'We charge zero platform fees for community and personal campaigns.' },
              { icon: GlobeAltIcon, title: 'Local Support', description: 'Our team is based in Uganda and understands local needs and challenges.' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-lg"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-600 py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Ugandans who are already changing lives through Raiser
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/create-campaign" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Start Your Campaign
              </Link>
              <Link to="/campaigns" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                Browse Campaigns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
