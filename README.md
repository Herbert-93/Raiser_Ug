# Raiser - Uganda's Fundraising Platform

Raiser is a comprehensive fundraising platform built for Uganda, enabling users to create and donate to campaigns using MTN Mobile Money, Airtel Money, and credit/debit cards.

## Features

- **User Authentication**: Secure registration and login
- **Campaign Management**: Create, update, and manage fundraising campaigns
- **Multiple Payment Options**: MTN MoMo, Airtel Money, and Card payments
- **Real-time Tracking**: Monitor campaign progress and donations
- **Responsive Design**: Mobile-friendly interface
- **Admin Dashboard**: Manage users and campaigns
- **Social Sharing**: Share campaigns on social media

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL with Supabase
- JWT Authentication
- Stripe for card payments
- MTN & Airtel APIs integration

### Frontend
- React.js
- Tailwind CSS
- React Query for data fetching
- Framer Motion for animations
- Stripe Elements for card payments

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Stripe account (for card payments)
- MTN & Airtel developer accounts (for mobile money)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both backend and frontend folders
   - Fill in your API keys and credentials

5. Set up the database:
   - Run the SQL schema in `backend/src/config/database.sql` on your Supabase instance

6. Start the development servers:
   ```bash
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm start
   ```

## Environment Variables

### Backend (.env)
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
MTN_MOMO_* = your_mtn_credentials
AIRTEL_* = your_airtel_credentials
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Campaigns
- GET /api/campaigns - List all campaigns
- POST /api/campaigns - Create new campaign
- GET /api/campaigns/:id - Get campaign details
- PUT /api/campaigns/:id - Update campaign
- DELETE /api/campaigns/:id - Delete campaign

### Payments
- POST /api/payments/mtn - Process MTN payment
- POST /api/payments/airtel - Process Airtel payment
- POST /api/payments/card - Process card payment
- GET /api/payments/:id/status - Check payment status

## Deployment

### Backend Deployment
1. Set up a production server (e.g., Heroku, DigitalOcean)
2. Configure environment variables
3. Run `npm start`

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to hosting service (e.g., Netlify, Vercel)

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License.

## Support

For support, email support@raiser.ug or join our Slack channel.

## Acknowledgments

- GoFundMe for inspiration
- MTN MoMo & Airtel for payment integration
- Stripe for card processing
- The Uganda community for support
