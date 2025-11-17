# Quick Testing Reference

## 🚀 Setup (One-time)

```bash
cd lendly
npm install
npm run db:generate
npm run db:seed
npm run dev
```

## ✅ Quick Test Flow

### 0. Sign In First (Required!)
```bash
# In browser console (F12), run:
fetch('/api/auth/dev-signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user1@lendly.co.il' })
}).then(r => r.json()).then(console.log)
```

Or use any seeded user email: `user1@lendly.co.il` through `user50@lendly.co.il`

### 1. Test Listing Creation
```
1. Go to: http://localhost:3000/listings/new
2. Fill form and create listing
3. Verify it appears in /listings
```

### 2. Test Booking with Insurance
```
1. Go to any listing: http://localhost:3000/listing/[id]
2. Click "Reserve"
3. Select dates
4. Toggle insurance ON/OFF
5. Verify deposit and insurance fees update
6. Complete booking
```

### 3. Test Insurance Algorithm
```bash
npm run test:insurance
```

This runs automated tests for:
- Low risk scenarios
- High risk scenarios
- Long rentals
- Min/max deposit bounds

## 🔍 What to Check

### In Booking Drawer:
- ✅ Deposit amount is calculated
- ✅ Insurance fee updates when toggled
- ✅ Total price = subtotal + insurance
- ✅ All amounts in ₪ (shekels)

### In Dashboard:
- ✅ Bookings appear with correct info
- ✅ Deposit and insurance status shown

### In Database:
```sql
-- Check a booking
SELECT id, deposit, insurance, status FROM Booking LIMIT 5;

-- Check listings
SELECT id, title, pricePerDay, deposit FROM Listing LIMIT 5;
```

## 🐛 Common Issues

**Issue**: Deposit always same
- Check: Are trust scores being passed?
- Check: Is insurance engine being called?

**Issue**: Insurance fee is 0
- Check: Is insurance toggle working?
- Check: Is `insuranceAdded` parameter passed?

**Issue**: UI shows wrong amounts
- Check: Field mapping (`pricePerDay` vs `dailyRate`)
- Check: Browser console for errors

## 📊 Expected Values

**Low Risk** (trusted user, cheap item):
- Deposit: ~20-30% of item value
- Insurance: 3% of item value

**High Risk** (new user, expensive item):
- Deposit: ~50-80% of item value
- Insurance: 8% of item value

**Item Value**: Estimated as `dailyPrice × 20`

