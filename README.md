# FixIt - Service Provider Marketplace

A full-stack MERN application that connects customers with trusted service providers like electricians, carpenters, painters, and more.

## Features

### For Customers
- Search and filter service providers by location, service type, and rating
- View detailed worker profiles with reviews and portfolios
- Book services with detailed descriptions and budget ranges
- Negotiate prices with service providers
- Track booking status and history
- Leave reviews and ratings after service completion

### For Workers
- Create detailed professional profiles
- Manage service offerings and availability
- Receive and respond to booking requests
- Negotiate prices with customers
- Track earnings and completed jobs
- Build reputation through customer reviews

### Core Features
- Dual authentication system (customers and workers)
- Location-based search functionality
- Real-time price negotiation system
- Rating and review system
- Responsive design for all devices
- Secure payment processing integration ready

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your configuration:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/fixit
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
\`\`\`

5. Start the server:
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
\`\`\`bash
cd client
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The frontend will run on `http://localhost:3000`

### Database Setup

The application will automatically create the necessary collections when you start using it. However, you can seed the database with sample data if needed.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Workers
- `GET /api/workers` - Get all workers (with filters)
- `GET /api/workers/:id` - Get worker by ID
- `PUT /api/workers/profile` - Update worker profile

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id/negotiate` - Add negotiation offer
- `PUT /api/bookings/:id/accept` - Accept booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/worker/:workerId` - Get reviews for worker

## Project Structure

\`\`\`
fixit-service-provider/
├── server/                 # Backend application
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Server entry point
│   └── package.json       # Backend dependencies
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
└── README.md              # This file
\`\`\`

## Usage

### For Customers

1. **Register/Login**: Create an account as a customer
2. **Search Workers**: Use the search functionality to find service providers
3. **View Profiles**: Check worker profiles, ratings, and reviews
4. **Book Service**: Submit a booking request with your requirements
5. **Negotiate Price**: Engage in price negotiation if needed
6. **Track Progress**: Monitor your booking status
7. **Leave Review**: Rate and review the service after completion

### For Workers

1. **Register/Login**: Create an account as a worker
2. **Setup Profile**: Complete your professional profile
3. **Manage Bookings**: View and respond to booking requests
4. **Negotiate Prices**: Counter-offer on customer budgets
5. **Accept Jobs**: Confirm bookings that meet your requirements
6. **Track Earnings**: Monitor your income and completed jobs

## Key Features Explained

### Price Negotiation System
- Customers set budget ranges when booking
- Workers can counter-offer with their preferred price
- Multiple rounds of negotiation supported
- Final price agreed upon before work begins

### Rating System
- 5-star rating system for workers
- Category-based ratings (quality, punctuality, communication, value)
- Verified reviews from completed bookings only
- Average ratings calculated automatically

### Location-Based Search
- Search workers by city/location
- Distance-based filtering (ready for GPS integration)
- Service area management for workers

## Development

### Running in Development Mode

1. Start the backend server:
\`\`\`bash
cd server && npm run dev
\`\`\`

2. Start the frontend development server:
\`\`\`bash
cd client && npm run dev
\`\`\`

### Building for Production

1. Build the frontend:
\`\`\`bash
cd client && npm run build
\`\`\`

2. The built files will be in `client/dist/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
