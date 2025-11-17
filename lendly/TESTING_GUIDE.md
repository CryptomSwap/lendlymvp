# Lendly Testing Guide

This guide helps you test the complete flow: listing items, renting items, insurance calculations, and UI display.

## 🚀 Quick Start

### 1. Seed the Database

First, populate your database with mock data:

```bash
cd lendly
npm run db:seed
```

This creates:
- 50 users (with Hebrew and English names)
- 90 listings across all categories
- 60 bookings with various statuses
- 35 reviews
- 25 conversations with messages

### 2. Start the Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 📋 Testing Checklist

### ✅ Test 1: Listing an Item

**Goal**: Verify you can create a new listing and it appears correctly.

**Prerequisites**: You need to be signed in first!

**Sign In for Testing**:
1. Use the dev sign-in endpoint (development only):
   ```bash
   # In browser console or using curl:
   fetch('/api/auth/dev-signin', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'user1@lendly.co.il' })
   })
   ```
   Or use any email from the seeded users (user1@lendly.co.il through user50@lendly.co.il)

**Steps**:
1. Navigate to `/listings/new` (or click "List an Item" in the UI)
2. Fill out the form:
   - **Title**: "מצלמת DSLR קנון 5D Mark IV"
   - **Description**: "מצלמה מקצועית עם חיישן full frame"
   - **Category**: Select "Cameras" (מצלמות)
   - **Daily Rate**: 300 ₪
   - **Location**: "תל אביב"
   - Upload at least one photo
3. Click "Create Listing"
4. **Verify**:
   - Listing appears in `/listings`
   - Listing detail page shows all information correctly
   - Price, category, and location are displayed

**Expected Result**: Listing is created and visible in the listings page.

---

### ✅ Test 2: Renting an Item (Creating a Booking)

**Goal**: Verify the booking flow works and calculates deposits correctly.

**Steps**:
1. Navigate to any listing detail page (e.g., `/listing/[id]`)
2. Click "Reserve" or "Book Now"
3. Select dates (start and end date)
4. **Observe the booking drawer**:
   - Daily rate is shown
   - Number of days is calculated
   - **Deposit amount** is displayed (should be calculated automatically)
   - **Insurance option** toggle is available
5. Toggle insurance ON/OFF and observe:
   - Insurance fee changes
   - Total price updates
6. Click "Reserve"
7. **Verify**:
   - Booking is created
   - Redirected to booking confirmation page
   - Booking appears in your dashboard

**Expected Result**: Booking is created with correct deposit and optional insurance.

---

### ✅ Test 3: Insurance Algorithm Testing

**Goal**: Verify the insurance/deposit calculation works correctly for different scenarios.

#### Test 3a: Low Risk Scenario
- **Item**: Camping tent (cheap, low-risk category)
- **Renter**: High trust score (90+)
- **Owner**: High trust score (90+)
- **Expected**: Low deposit, low insurance fee

#### Test 3b: High Risk Scenario
- **Item**: Expensive drone (high-risk category)
- **Renter**: Low trust score (30-40)
- **Owner**: Medium trust score (60-70)
- **Expected**: High deposit, higher insurance fee

#### Test 3c: Medium Risk Scenario
- **Item**: Camera (medium-risk)
- **Renter**: Medium trust score (60-70)
- **Owner**: Medium trust score (60-70)
- **Expected**: Medium deposit, medium insurance fee

**How to Test**:
1. Use the test script (see below) to verify calculations
2. Or manually create bookings with different user/listing combinations
3. Check the console logs for calculated values

---

### ✅ Test 4: UI Display Verification

**Goal**: Ensure all calculated values are displayed correctly to users.

**Check These Pages**:

1. **Listing Detail Page** (`/listing/[id]`):
   - [ ] Daily rate is shown
   - [ ] Deposit amount is displayed (if available)
   - [ ] Insurance option is visible
   - [ ] Owner information is shown
   - [ ] Reviews are displayed

2. **Booking Drawer** (when clicking Reserve):
   - [ ] Date range selector works
   - [ ] Number of days is calculated correctly
   - [ ] Subtotal (days × daily rate) is correct
   - [ ] Deposit amount is shown
   - [ ] Insurance fee updates when toggled
   - [ ] Total price is correct (subtotal + insurance)
   - [ ] All amounts are formatted in ₪ (shekels)

3. **Dashboard** (`/dashboard`):
   - [ ] Upcoming bookings are shown
   - [ ] Past bookings are shown
   - [ ] Booking details include deposit and insurance info

4. **Booking Detail Page** (`/bookings/[id]`):
   - [ ] All booking information is displayed
   - [ ] Deposit amount is shown
   - [ ] Insurance status (with/without) is shown
   - [ ] Total price breakdown is visible

---

## 🧪 Automated Testing Script

Run the insurance algorithm test script:

```bash
cd lendly
npm run test:insurance
```

Or manually run:

```bash
npx tsx scripts/test-insurance.ts
```

This will test various scenarios and print the results.

---

## 🔍 Manual Testing Scenarios

### Scenario 1: New User Renting Expensive Item
1. Create a user with low trust score (0-30)
2. Find an expensive drone listing (500+ ₪/day)
3. Try to book it
4. **Expected**: High deposit (should be 80% of item value max)
5. **Expected**: High insurance fee (8% of item value)

### Scenario 2: Trusted User Renting Cheap Item
1. Use a user with high trust score (90+)
2. Find a cheap camping item (50-100 ₪/day)
3. Book it
4. **Expected**: Low deposit (reduced for low risk)
5. **Expected**: Low insurance fee (3% of item value)

### Scenario 3: Long Rental Period
1. Book any item for 10+ days
2. **Expected**: Deposit should be increased by 15% (long rental multiplier)
3. **Expected**: Insurance fee should scale with rental days

### Scenario 4: Different Categories
Test booking items from different categories:
- **Drone**: Should have highest risk factor (1.3)
- **Camera**: Medium-high risk (1.1)
- **Camping**: Lowest risk (0.9)
- **Tools**: Standard risk (1.0)

---

## 🐛 Debugging Tips

### Check Insurance Calculations

If deposits/insurance seem wrong, check:

1. **Console Logs**: The booking drawer logs calculations
2. **Database**: Check the `Booking` table for `deposit` and `insurance` fields
3. **Risk Engine**: Use the test script to verify calculations

### Common Issues

**Issue**: Deposit is always the same regardless of user/item
- **Fix**: Check that `calculateInsuranceQuote` is being called with correct parameters
- **Fix**: Verify trust scores are being passed correctly

**Issue**: Insurance fee is 0
- **Fix**: Check if insurance toggle is working
- **Fix**: Verify `insuranceAdded` parameter is being passed to booking creation

**Issue**: UI shows wrong amounts
- **Fix**: Check if field mapping is correct (`pricePerDay` vs `dailyRate`)
- **Fix**: Verify the `mapListingFields` function is being used

---

## 📊 Expected Values Reference

### Deposit Calculation
- **Base**: 35% of item value
- **Low Risk**: Base × 0.8
- **Medium Risk**: Base × 1.0
- **High Risk**: Base × 1.3
- **Long Rental (>7 days)**: +15%
- **Min**: 2 × daily price
- **Max**: 80% of item value

### Insurance Fee
- **Low Risk**: 3% of item value
- **Medium Risk**: 5% of item value
- **High Risk**: 8% of item value
- **Coverage**: Up to 60% of item value

### Item Value Estimation
- Default: `dailyPrice × 20`

---

## 🎯 Quick Test Commands

```bash
# Seed database
npm run db:seed

# Run insurance tests
npm run test:insurance

# Run all tests
npm test

# Check TypeScript
npm run typecheck

# Start dev server
npm run dev
```

---

## 📝 Test Data

After seeding, you can use these test users:
- Email: `user1@lendly.co.il` (Trust score: varies)
- Email: `user2@lendly.co.il` (Trust score: varies)

Or create your own test users through the UI.

---

## ✅ Success Criteria

Your testing is successful when:

1. ✅ You can create a listing and it appears in the listings page
2. ✅ You can book an item and see the correct deposit calculation
3. ✅ Insurance toggle works and updates the total price
4. ✅ Different risk scenarios produce different deposits/fees
5. ✅ All amounts are displayed correctly in the UI
6. ✅ Booking appears in dashboard with correct information

---

## 🆘 Need Help?

If something doesn't work:
1. Check the browser console for errors
2. Check the server logs
3. Verify the database has been seeded
4. Check that Prisma client is generated: `npm run db:generate`
5. Review the insurance algorithm test results

