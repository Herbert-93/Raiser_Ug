import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Campaigns from './pages/Campaigns/Campaigns';
import CampaignDetails from './pages/Campaigns/CampaignDetails';
import CreateCampaign from './pages/Campaigns/CreateCampaign';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Donate from './pages/Donate/Donate';
import About from './pages/About';
import Contact from './pages/Contact';

import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaign/:id" element={<CampaignDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/create-campaign" element={
                  <ProtectedRoute>
                    <CreateCampaign />
                  </ProtectedRoute>
                } />
                <Route path="/donate/:id" element={
                  <ProtectedRoute>
                    <Donate />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
