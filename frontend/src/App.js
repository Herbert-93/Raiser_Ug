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
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Campaigns from './pages/Campaigns/Campaigns';
import CampaignDetails from './pages/Campaigns/CampaignDetails';
import CreateCampaign from './pages/Campaigns/CreateCampaign';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Donate from './pages/Donate/Donate';
import About from './pages/About';
import Contact from './pages/Contact';

import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaign/:id" element={<CampaignDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected routes */}
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
                background: '#1F2937',
                color: '#F9FAFB',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#F9FAFB' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#F9FAFB' } },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;