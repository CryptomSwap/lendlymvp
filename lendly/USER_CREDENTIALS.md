# User Credentials for Testing

This document contains credentials for different user types in the Lendly application.

## Authentication Method

Lendly uses **magic link authentication** - there are no passwords. Users sign in by entering their email address and receiving a magic link via email.

**Note**: In development mode, the magic link is displayed in a toast notification for easy testing.

---

## User Types & Credentials

### 1. Admin User
**Email**: `admin@lendly.com`  
**Role**: `ADMIN`  
**Trust Score**: 100  
**Verified**: ✅ Yes  
**Description**: Full admin access to manage listings, disputes, users, and platform rules.

---

### 2. Regular User - Active Owner (Verified)
**Email**: `alon@example.com`  
**Name**: אלון כהן (Alon Cohen)  
**Role**: `USER`  
**Trust Score**: 85  
**Verified**: ✅ Yes  
**Phone**: +972-50-123-4567  
**Description**: Regular user who owns multiple listings (cameras, drones, tools, sports equipment). All users can both rent and lend items.

---

### 3. Regular User (Verified, High Trust)
**Email**: `sara@example.com`  
**Name**: שרה לוי (Sara Levi)  
**Role**: `USER`  
**Trust Score**: 92  
**Verified**: ✅ Yes  
**Phone**: +972-50-234-5678  
**Description**: Regular user with high trust score. Owns some listings.

---

### 4. Regular User (Not Verified)
**Email**: `david@example.com`  
**Name**: דוד ישראלי (David Israeli)  
**Role**: `USER`  
**Trust Score**: 78  
**Verified**: ❌ No  
**Phone**: +972-50-345-6789  
**Description**: Regular user who hasn't completed verification yet. Owns some listings.

---

### 5. Regular User (Verified, Highest Trust)
**Email**: `maya@example.com`  
**Name**: מאיה אברהם (Maya Avraham)  
**Role**: `USER`  
**Trust Score**: 95  
**Verified**: ✅ Yes  
**Phone**: +972-50-456-7890  
**Description**: Regular user with the highest trust score. Owns multiple listings.

---

### 6. Regular User (Verified)
**Email**: `tom@example.com`  
**Name**: תום רוזן (Tom Rosen)  
**Role**: `USER`  
**Trust Score**: 88  
**Verified**: ✅ Yes  
**Phone**: +972-50-567-8901  
**Description**: Regular verified user. Owns several listings.

---

### 7. Regular User (Not Verified)
**Email**: `noa@example.com`  
**Name**: נועה דוד (Noa David)  
**Role**: `USER`  
**Trust Score**: 82  
**Verified**: ❌ No  
**Phone**: +972-50-678-9012  
**Description**: Regular user who hasn't completed verification. Owns some listings.

---

## How to Sign In

1. Navigate to `/auth/signin` (or `/he/auth/signin` / `/en/auth/signin`)
2. Enter one of the email addresses above
3. Click "Send Magic Link"
4. In **development mode**, the magic link will appear in a toast notification
5. Click the link in the toast to sign in automatically

---

## User Roles Summary

| Role | Description | Users |
|------|-------------|-------|
| `ADMIN` | Full platform administration access | admin@lendly.com |
| `USER` | Standard user - can both rent items and create/manage listings | All other users |

---

## Testing Scenarios

### Test Admin Features
- Use: `admin@lendly.com`
- Access: `/admin` routes
- Can: Manage listings, disputes, users, rules, metrics

### Test Owner Features (Any User)
- Use: `alon@example.com` (or any user)
- Access: Create listings, manage bookings, view owner dashboard
- Note: All regular users can create and manage listings
- Has: Multiple active listings

### Test Renter Features
- Use: `sara@example.com` or `maya@example.com`
- Access: Browse listings, make bookings, view renter dashboard
- Has: High trust scores for better experience

### Test Unverified User
- Use: `david@example.com` or `noa@example.com`
- Access: Limited features until verification
- Can: Test verification flow

---

## Notes

- All users are created by the seed script (`prisma/seed.ts`)
- To reset users, run: `npx prisma db seed`
- Magic links expire after 15 minutes
- In production, magic links are sent via email
- Trust scores affect deposit calculations and platform features

