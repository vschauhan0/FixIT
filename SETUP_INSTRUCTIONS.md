# FixIt Service Provider - Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173`

## Testing the Application

### Step 1: Register as Worker
1. Click "Get Started" on homepage
2. Choose "Register"
3. Select "Offer Services" (Worker)
4. Fill in details:
   - Name: e.g., "John Smith"
   - Email: e.g., "john@example.com"
   - Phone: e.g., "+91 9876543210"
   - Address: e.g., "Downtown Area"
   - Service: Select (Electrician, Carpenter, Painter, etc.)
   - Experience: e.g., "8"
   - Description: e.g., "Expert with 8+ years experience"
   - Price Range: e.g., "₹200-400/hr"
5. Click "Create Account"
6. You'll be redirected to worker dashboard

### Step 2: Register as Customer
1. Go back to home, click "Get Started"
2. Select "Find Workers" (Customer)
3. Fill in details:
   - Name: e.g., "Alice Johnson"
   - Email: e.g., "alice@example.com"
   - Phone: e.g., "+91 8765432100"
   - Address: e.g., "Uptown Area"
4. Click "Create Account"
5. You'll be redirected to customer dashboard

### Step 3: Find Worker
1. In customer dashboard, you should see the worker you registered
2. Use search to find workers by name or service
3. Filter by service type

### Step 4: Book a Worker
1. Click "Book Now" on the worker card
2. Fill in:
   - Service Description: What work you need
   - Budget Range: e.g., "₹200-300"
   - Urgency: Select level
3. Optionally propose different price
4. Click "Send Booking Request"

### Step 5: Worker Responds
1. Switch to worker account (logout and login as worker)
2. In worker dashboard, you'll see pending orders
3. Click "Accept Order" to accept the booking
4. Worker details are shown with customer info

### Step 6: Complete the Job
1. Once accepted, the order moves to "Active Orders"
2. Click "Mark as Completed" when done
3. Job moves to "Completed" and revenue is added
4. Rating increases by 0.2 points

### Step 7: View Stats
- Worker dashboard shows:
  - Current rating (increases with each completed job)
  - Completed jobs count
  - Pending orders
  - Monthly revenue (example: ₹12,450)
- Customer can see booking history and status

## Navigation

### Home Page (`/`)
- View services overview
- See how it works
- Register or login buttons

### Services Page (`/services`)
- View all available services
- Service descriptions
- What each service includes

### How It Works Page (`/how-it-works`)
- 6 steps for customers
- 6 steps for workers
- Key features and benefits

### About Page (`/about`)
- Company mission and values
- Team information
- FAQs
- Statistics

### Login Page (`/login`)
- Email and password login
- Validates existing users
- Prevents duplicate entries

### Register Page (`/register`)
- Separate forms for customers and workers
- Worker-specific fields (service, experience, etc.)
- Email validation (no duplicates)

### Customer Dashboard (`/dashboard/customer`)
- Search workers by name or service
- Filter by service type
- View worker profiles with ratings
- See booking history
- Quick statistics

### Worker Dashboard (`/dashboard/worker`)
- View pending order requests
- See customer details and requirements
- Accept or decline orders
- Mark completed jobs
- View rating and revenue stats

### Booking Page (`/booking/:workerId`)
- Worker profile summary
- Phone number for direct contact
- Service description field
- Budget input
- Price negotiation options
- Submit booking request

## Important Features

### Data Persistence
- All data stored in browser's localStorage
- Data persists across browser sessions
- Clearing browser data will reset the app

### User Types
- **Customer**: Posts jobs, sets budget, negotiates price
- **Worker**: Receives bookings, accepts/declines, completes jobs

### Booking Status
- **Pending**: Awaiting worker response
- **Accepted**: Worker accepted the job
- **Rejected**: Worker declined the job
- **Completed**: Job finished, earnings added

### Rating System
- Starts at 0 for new workers
- Increases by 0.2 per completed job
- Maximum rating: 5.0
- Based on completed job count, not customer reviews

### Revenue Tracking
- Calculated from booking prices
- Updated when job marked as completed
- Shows in worker dashboard
- Example: If ₹300 booking completed, adds ₹300 to revenue

## Troubleshooting

### Can't find workers?
- Make sure you're logged in as customer
- Workers must be registered with available status
- Try clearing search filters

### Can't see booking history?
- Refresh the page
- Check that you're logged into correct account
- Bookings appear in tabs (Pending, Active, Completed)

### Prices not showing?
- Customer view doesn't show price ranges
- Price is negotiated during booking
- Worker can see prices in order details

### Lost data?
- Data is stored in localStorage
- Clearing browser cache will reset data
- Use incognito/private window for separate test

## Next Steps for Production

1. **Replace localStorage with MongoDB**
   - Connect to MongoDB Atlas
   - Create API endpoints
   - Implement server-side validation

2. **Add Security**
   - Hash passwords with bcrypt
   - Implement JWT authentication
   - Add HTTPS

3. **Payment Integration**
   - Add payment gateway (Stripe, Razorpay)
   - Implement secure payment flow
   - Track transactions

4. **Email Notifications**
   - Send email on booking requests
   - Notify workers of new orders
   - Confirmation emails

5. **Real-time Updates**
   - Use WebSockets for live updates
   - Real-time chat between users
   - Push notifications

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── dashboard/
│   │   ├── CustomerDashboard.jsx
│   │   └── WorkerDashboard.jsx
│   ├── booking/
│   │   └── BookingPage.jsx
│   ├── pages/
│   │   ├── ServicesPage.jsx
│   │   ├── HowItWorksPage.jsx
│   │   └── AboutPage.jsx
│   ├── ui/
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   └── ... (other components)
│   └── HomePage.jsx
├── utils/
│   └── dataStore.js (data management)
├── App.jsx (main app with routing)
└── App.css (styling)
```

## Support

For issues or questions:
1. Check the CHANGES.md file for recent updates
2. Review the SETUP_INSTRUCTIONS.md (this file)
3. Check browser console for errors
4. Make sure localStorage is enabled in browser
5. Try in a different browser or incognito mode

---

**Happy using FixIt! 🔧**
