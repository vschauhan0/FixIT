# FixIt - Complete Testing Guide

## Pre-Testing Setup
1. Clear browser cache and localStorage
2. Open app in two browser windows/tabs (side by side)
3. Keep one for customer, one for worker

## Complete Test Flow

### Test 1: User Registration (5 minutes)

#### Register Worker
1. Go to `http://localhost:5173`
2. Click "Get Started"
3. Click "Register"
4. Select "Offer Services" toggle
5. Fill form with:
   ```
   Name: John Electrician
   Email: john.electrician@test.com
   Phone: +91 9876543210
   Address: Downtown Tech Park
   Service: Electrician
   Experience: 8
   Description: Certified electrician with 8+ years experience in home wiring and repairs
   Price Range: ₹300-500/hr
   Password: Password123
   Confirm: Password123
   ```
6. Click "Create Account"
7. Should redirect to **Worker Dashboard**
8. Verify stats show:
   - Rating: 0
   - Completed Jobs: 0
   - Pending Orders: 0

#### Register Customer
1. In second browser/tab, go to home
2. Click "Get Started"
3. Click "Register"
4. Select "Find Workers" toggle
5. Fill form with:
   ```
   Name: Alice Customer
   Email: alice.customer@test.com
   Phone: +91 8765432100
   Address: Uptown Residential Area
   Password: Password123
   Confirm: Password123
   ```
6. Click "Create Account"
7. Should redirect to **Customer Dashboard**
8. Verify you see the worker "John Electrician" in the list

---

### Test 2: Login Test (3 minutes)

#### Test Login
1. Go to login page (`/login`)
2. Try login with wrong email:
   ```
   Email: wrong@email.com
   Password: Password123
   ```
3. Should show error: "User not found. Please register first."
4. Try login with correct email but wrong password:
   ```
   Email: john.electrician@test.com
   Password: WrongPass
   ```
5. Should show error: "Invalid email or password"
6. Login with correct credentials:
   ```
   Email: john.electrician@test.com
   Password: Password123
   ```
7. Should redirect to Worker Dashboard

---

### Test 3: Search and Browse Workers (3 minutes)

**In Customer Dashboard:**
1. Verify worker card shows:
   - Name: "John Electrician" ✓
   - Rating: 0 ✓
   - 0 completed jobs ✓
   - Service: "Electrician" ✓
   - Description visible ✓
   - Location shown ✓
   - "Book Now" button present ✓

2. Test search functionality:
   - Type "John" in search → Worker appears
   - Type "electrician" → Worker appears (case insensitive)
   - Clear search → Worker appears again

3. Test filter by service:
   - Select "Carpenter" → No workers shown
   - Select "Electrician" → John appears
   - Select "All Services" → John appears

---

### Test 4: Booking Process (5 minutes)

**In Customer Dashboard:**
1. Click "Book Now" on John's profile
2. Should go to booking page showing John's details:
   - Name and avatar ✓
   - Rating: 0 ✓
   - 0 completed jobs ✓
   - Location shown ✓
   - Phone number: +91 9876543210 ✓
   - Phone is clickable link ✓
   - Email shown ✓

3. Fill booking form:
   ```
   Service Description: I need home wiring installation for my apartment. 
   Three rooms need electrical outlet installation.
   
   Budget Range: ₹200-250
   Urgency: Normal (1-2 days)
   ```

4. Click "Send Booking Request"
5. Should show success message: "Booking request sent successfully!"
6. Should redirect to Customer Dashboard
7. In "My Bookings" sidebar, should show new booking:
   - Worker: John Electrician
   - Status: Pending (yellow badge)
   - Service: Electrician

---

### Test 5: Worker Receives Order (3 minutes)

**Switch to Worker Dashboard (or login as worker):**
1. Refresh page or wait for update
2. In "Pending Orders" tab, should see:
   - Customer: Alice Customer
   - Status: Pending badge ✓
   - Service: Electrician
   - Description: Full text visible ✓
   - Customer Budget: ₹200-250 ✓
   - No price proposed (will use budget)

3. Verify all order details shown:
   - Customer location ✓
   - Job description ✓
   - Budget and proposed price ✓

---

### Test 6: Price Negotiation (5 minutes)

**In Customer Dashboard (create new booking):**
1. Go back to search workers
2. Click "Book Now" again (can test with same or different worker)
3. Fill form with:
   ```
   Description: Need electrical panel upgrade
   Budget: ₹400-500
   ```

4. Click "Propose Different Price"
5. Enter proposed price:
   ```
   Proposed Price: 450
   ```

6. Click "Send Proposal"
7. Should show success and close the bargaining section
8. Click "Send Booking Request"

**In Worker Dashboard:**
1. View the new pending order
2. Should see:
   - Customer Budget: ₹400-500
   - Proposed Price: ₹450

---

### Test 7: Accept Order (3 minutes)

**In Worker Dashboard:**
1. In "Pending Orders" tab, click "Accept Order"
2. Order should move to "Active Orders" tab
3. Status should change from "pending" to "accepted"
4. Button should change to "Mark as Completed"

**In Customer Dashboard:**
1. Refresh or wait for update
2. Check "My Bookings" sidebar
3. Order status should show "Accepted" (blue badge)
4. Can see booking details

---

### Test 8: Reject Order (3 minutes)

**Create another test booking:**
1. Customer creates new booking
2. Worker sees pending order
3. Click "Decline" button
4. Order disappears from pending
5. Doesn't appear in other tabs

**In Customer Dashboard:**
1. Check "My Bookings"
2. Order status shows "Rejected" (red badge)

---

### Test 9: Complete Job (5 minutes)

**In Worker Dashboard:**
1. Go to "Active Orders" tab
2. Should see accepted orders
3. Click "Mark as Completed"
4. Order moves to "Completed" tab
5. Status shows "Completed" (green badge)

**Check Worker Stats:**
1. Rating should increase:
   - Before: 0
   - After first completion: 0.2
   - After second completion: 0.4
   - Pattern: 0.2 per completed job

2. Completed Jobs should increase:
   - Shows actual count: 1, 2, 3, etc.

3. Monthly Revenue should update:
   - If order was ₹450: shows ₹450
   - If multiple: shows total (e.g., ₹450 + ₹200 = ₹650)

**In Customer Dashboard:**
1. Booking status shows "Completed" (green badge)
2. Can see it in completed section

---

### Test 10: Multiple Users (5 minutes)

**Test with multiple workers:**
1. Register another worker:
   ```
   Name: Mike Carpenter
   Service: Carpenter
   Phone: +91 9876543211
   ```

2. Register another customer
3. Verify both workers appear in search
4. Create bookings with different workers
5. Test accepts and completions

---

### Test 11: Page Navigation (3 minutes)

**Test all pages:**
1. Home (`/`) - Should show hero and services
2. Services (`/services`) - All 6 services listed
3. How It Works (`/how-it-works`) - 6 steps for each user type
4. About (`/about`) - Company info, FAQs, stats
5. Login (`/login`) - Login form with validation
6. Register (`/register`) - Registration with user type toggle
7. Customer Dashboard (`/dashboard/customer`) - Search and browse
8. Worker Dashboard (`/dashboard/worker`) - Order management
9. Booking (`/booking/:id`) - Booking form

**Test navigation:**
- Click logo to go home
- Click Services link → Services page
- Click How It Works → How It Works page
- Click About → About page
- Back button works
- Login/Register buttons work

---

### Test 12: Logout (2 minutes)

**In Worker Dashboard:**
1. Click logout button (icon in top right)
2. Should redirect to home
3. Click login
4. Login credentials should be gone

**In Customer Dashboard:**
1. Click logout button
2. Should redirect to home
3. Login with customer credentials
4. Should go to customer dashboard

---

## Expected Results Summary

| Test | Expected | Status |
|------|----------|--------|
| Register Worker | Redirects to Worker Dashboard | ✓ |
| Register Customer | Redirects to Customer Dashboard | ✓ |
| Login Success | Redirects to correct dashboard | ✓ |
| Login Fail | Shows error message | ✓ |
| Search Workers | Filters correctly | ✓ |
| Filter Service | Shows only selected service | ✓ |
| Book Worker | Creates order in pending | ✓ |
| View Order | Shows all customer details | ✓ |
| Accept Order | Moves to active | ✓ |
| Reject Order | Moves to rejected | ✓ |
| Complete Job | Moves to completed | ✓ |
| Rating Update | 0 → 0.2 → 0.4... | ✓ |
| Revenue Track | Sums all completed prices | ✓ |
| Phone Link | Clickable tel: link | ✓ |
| Navigation | All pages work | ✓ |
| Logout | Clears session | ✓ |

---

## Common Issues & Solutions

### Issue: Data not persisting
- **Solution:** Check that localStorage is enabled in browser
- Clear cache and reload
- Use incognito/private window

### Issue: Worker doesn't appear in search
- **Solution:** Worker must be registered with `available: true`
- Refresh the customer dashboard
- Try clearing filters

### Issue: Booking not sent
- **Solution:** Make sure description and budget are filled
- Check browser console for errors
- Refresh and try again

### Issue: Stats not updating
- **Solution:** Refresh worker dashboard
- Complete at least one job
- Rating increases by 0.2 per completion

### Issue: Phone number not clickable
- **Solution:** Should be blue and underlined
- Click to open phone app/dialer
- Also shows in booking details

---

## Performance Notes

- First load: ~2 seconds
- Search: Instant (<100ms)
- Navigation: Instant
- Data updates: <500ms
- No lag expected with current data size

---

## Testing Checklist

- [ ] Worker registration successful
- [ ] Customer registration successful
- [ ] Login works with validation
- [ ] Search filters workers
- [ ] Service type filter works
- [ ] Booking creation successful
- [ ] Worker receives order details
- [ ] Accept order moves to active
- [ ] Reject order removed
- [ ] Complete job updates stats
- [ ] Rating increases properly
- [ ] Revenue tracked correctly
- [ ] Phone number clickable
- [ ] All pages navigate correctly
- [ ] Logout clears session
- [ ] Data persists on refresh

---

**Total Test Time: ~40 minutes for complete flow**

All tests should pass with no errors or warnings in console!
