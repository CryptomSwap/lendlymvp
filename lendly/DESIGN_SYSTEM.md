# Lendly Design System
## Product Design & UX Architecture Guide

**Version:** 1.0  
**Last Updated:** 2024  
**Lead Designer:** Product Design Team

---

## 1. DESIGN PRINCIPLES

### Core Values
Every design decision must reflect these principles:

#### Clarity
- **Zero clutter** - Remove all non-essential elements
- **Clean spacing** - Generous whitespace (16px minimum between elements)
- **Readable typography** - High contrast, appropriate sizing for mobile
- **Clear hierarchy** - Visual weight guides user attention

#### Trust
- **Strong visual reassurance** - Verified badges, trust scores always visible
- **Consistent patterns** - Same interactions work the same way everywhere
- **Predictable flows** - Users always know what happens next
- **Transparent information** - Deposit calculations, fees clearly explained

#### Motion with Purpose
- **Subtle, smooth animations** - Framer Motion with spring physics
- **Reinforce meaning** - Animations signal state changes, not decoration
- **Never distract** - Motion supports, never competes with content
- **Performance first** - 60fps on mobile, no jank

#### Mobile-First
- **One-handed operation** - Primary actions in thumb zone
- **Large tap targets** - Minimum 44x44px (iOS), 48x48px (Android)
- **Fixed bottom navigation** - Always accessible
- **Swipe gestures** - Natural mobile interactions

#### Consistency
- **Same visuals** - Colors, spacing, typography unified
- **Same spacing** - 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- **Same language** - Consistent copy and tone
- **Same patterns** - Cards, buttons, inputs behave identically

#### Calm Sophistication
- **Teal + purple accents** - Brand colors used thoughtfully
- **Soft shadows** - Subtle depth, never harsh
- **Rounded shapes** - 16-24px for cards, 12px for inputs
- **Minimal gradients** - If used, very subtle
- **No harsh colors** - Warm, approachable palette

### Emotional Tone
- **Friendly but professional** - Approachable, not casual
- **Safe, secure, reliable** - Visual cues reinforce trust
- **Fun but not playful** - Engaging without being childish

---

## 2. BRAND & VISUAL LANGUAGE

### Logo
- **Hebrew wordmark**: "לנדלי" in textured teal
- **Usage**: Always on transparent background
- **Size**: Minimum 32px height
- **Placement**: Top-left in header (LTR) or top-right (RTL)

### Color Palette

#### Primary: Teal
- **Hex**: `#0EA5A5`
- **Usage**: Brand elements, primary CTAs, trust indicators
- **Variants**: 
  - Light: `#0EA5A5` with 20% opacity for backgrounds
  - Dark: `#0C8A8A` for hover states

#### Accent: Purple
- **Hex**: `#7C3AED`
- **Usage**: Secondary CTAs, highlights, active states
- **Variants**:
  - Light: `#7C3AED` with 20% opacity for backgrounds
  - Dark: `#6D28D9` for hover states

#### Neutrals: Slate
- **Background**: `slate-50` (light mode), `slate-900` (dark mode)
- **Cards**: `slate-100` (light), `slate-800` (dark)
- **Borders**: `slate-200` (light), `slate-700` (dark)
- **Text**: `slate-900` (light), `slate-50` (dark)

#### Semantic Colors
- **Success**: Green (`#10B981`) - Completed actions, positive states
- **Warning**: Amber (`#F59E0B`) - Cautions, pending states
- **Danger**: Soft red (`#EF4444`) - Errors, destructive actions (softened)
- **Info**: Blue (`#3B82F6`) - Information, neutral states

### Typography

#### Scale (Mobile-First)
- **Title**: 32px / 40px line-height / Bold
- **H1**: 28px / 36px / Bold
- **H2**: 24px / 32px / Semibold
- **H3**: 20px / 28px / Semibold
- **H4**: 18px / 24px / Medium
- **Body**: 16px / 24px / Regular
- **Caption**: 14px / 20px / Regular
- **Small**: 12px / 16px / Regular

#### Font Stack
- **Hebrew**: System fonts (Noto Sans Hebrew preferred)
- **English**: System fonts (SF Pro / Roboto)
- **Fallback**: Sans-serif

#### RTL Considerations
- **Hebrew default** - RTL layout, right-aligned text
- **English secondary** - LTR layout, left-aligned text
- **Mixed content** - Preserve direction per language

### Spacing System
Base unit: **4px**

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **base**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Border Radius
- **Cards**: 16-24px (larger for hero cards)
- **Inputs/Buttons**: 12px
- **Badges**: 8px
- **Images**: 12px (unless full-bleed)

### Shadows
- **Card**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **Elevated**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Modal**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **Never**: Sharp, harsh, or high-contrast shadows

---

## 3. MOTION & ANIMATION

### Framer Motion Variants

#### fadeInUp
```typescript
{
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}
```
**Usage**: Content appearing on screen, cards in lists

#### scaleIn
```typescript
{
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}
```
**Usage**: Important actions, modals, critical CTAs

#### staggerChildren
```typescript
{
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```
**Usage**: Card lists, grid layouts, sequential content

#### Spring Toggle
```typescript
{
  type: "spring",
  stiffness: 300,
  damping: 30
}
```
**Usage**: Toggles, switches, interactive elements

### Animation Rules
1. **Duration**: 200-500ms (never longer)
2. **Easing**: Custom cubic-bezier for natural feel
3. **Purpose**: Every animation must signal meaning
4. **Performance**: Use `will-change` and `transform` for GPU acceleration
5. **Reduced motion**: Respect `prefers-reduced-motion`

---

## 4. INFORMATION ARCHITECTURE

### The Three Real-World Moments

#### A) The Search Moment (Renter)

**User Questions:**
- Where am I?
- What's available around me?
- How much does it cost?

**Key Screens:**

1. **Homepage**
   - Animated hero symbols (2 person icons + rotating item icon)
   - Location input (auto-detect button + manual entry)
   - Category shortcuts (large, tappable chips)
   - Featured listings grid (2-column on mobile)

2. **Search Results**
   - Filters (price slider, distance, availability, rating, insurance toggle)
   - Results grid (2-column cards)
   - Empty state (friendly, actionable)

3. **Category Browse**
   - Visual category cards
   - Quick filters
   - Trending items

**Information Hierarchy:**
1. Location context
2. Category/type
3. Price/day
4. Rating & trust indicators
5. Distance/availability

#### B) The Decision Moment

**User Questions:**
- Is this item right for me?
- Can I trust this owner?
- What's the total cost?
- When is it available?

**Key Screens:**

1. **Listing Detail Page**
   - Photo carousel (swipeable, touch-friendly)
   - Title, price/day, rating (prominent)
   - Owner mini-profile (avatar, rating, trust score, verified badge)
   - Description (readable, well-spaced)
   - Map preview (interactive)
   - Availability calendar (minimal taps)
   - Reserve button (prominent, purple, fixed on scroll)

2. **Booking Drawer**
   - Date picker (large, accessible)
   - Deposit breakdown (clear, transparent)
   - Insurance toggle (optional, clearly explained)
   - Total calculation (prominent)
   - Reserve CTA (primary action)

**Information Hierarchy:**
1. Visual (photos)
2. Price & availability
3. Trust indicators
4. Details
5. Action (reserve)

#### C) The Transaction Moment

**User Questions:**
- What's the status?
- What do I need to do next?
- How do I communicate?
- When is pickup/return?

**Key Screens:**

1. **Booking Detail**
   - Status badge (clear, color-coded)
   - Timeline (visual progress)
   - Chat thread (always accessible)
   - Action buttons (context-aware)

2. **Chat Thread**
   - Messages (chronological, clear sender)
   - System events (styled differently)
   - Input (always visible, accessible)

3. **Checklists**
   - Photo capture (6 photos, clear instructions)
   - Serial/model entry
   - Condition notes
   - Confirmation (deposit collected checkbox)

4. **Review Screen**
   - Star rating (large, tappable)
   - Text input (optional)
   - Submit (prominent)

**Information Hierarchy:**
1. Current status
2. Next action
3. Communication
4. History/timeline

---

## 5. COMPONENT PATTERNS

### Global Header
- **Logo**: Left (LTR) or Right (RTL)
- **Reserved space**: Top 16px for animated carousel
- **Actions**: Language toggle, dark mode, auth button (right side)
- **Height**: 56px (14 * 4px)
- **Behavior**: Sticky, backdrop blur

### Bottom Navigation
- **Always visible**: Fixed at bottom
- **Tabs**: Home, Search, Messages, Bookings, Profile
- **Icons**: Lucide icons, 20px
- **Active state**: Purple accent, slight scale animation
- **Tap feedback**: Subtle scale (0.95) on press
- **Height**: 64px (16 * 4px)
- **Safe area**: Respects device safe area (notch/home indicator)

### Cards

#### Listing Card
- **Aspect ratio**: 1:1 (square)
- **Content**: Photo, title, price/day, rating, location
- **Padding**: 12px
- **Border radius**: 16px
- **Shadow**: Card shadow
- **Hover/tap**: Scale 1.02, slight shadow increase
- **Spacing**: 12px gap between cards

#### Message Card
- **Padding**: 16px
- **Border radius**: 12px
- **Background**: Muted (slate-100/800)
- **Hover**: Subtle background change
- **Spacing**: 8px gap between messages

#### Booking Card
- **Padding**: 16px
- **Border radius**: 16px
- **Status badge**: Top-right
- **Content**: Item photo, dates, status, actions
- **Spacing**: 16px gap between bookings

### Buttons

#### Primary (Purple)
- **Background**: Purple (`#7C3AED`)
- **Text**: White
- **Padding**: 12px 24px
- **Border radius**: 12px
- **Height**: 48px (minimum)
- **Tap**: Scale 0.98, spring animation
- **Loading**: Spinner, disabled state

#### Secondary (Teal)
- **Background**: Teal (`#0EA5A5`)
- **Text**: White
- **Same sizing as primary**

#### Outline
- **Border**: 1px solid slate-300
- **Background**: Transparent
- **Text**: Slate-900
- **Hover**: Background slate-50

#### Ghost
- **Background**: Transparent
- **Text**: Slate-700
- **Hover**: Background slate-100

### Inputs
- **Height**: 48px (minimum)
- **Padding**: 12px 16px
- **Border radius**: 12px
- **Border**: 1px solid slate-300
- **Focus**: Border teal, ring 2px
- **Error**: Border red, message below
- **Placeholder**: Slate-400

### Modals & Sheets
- **Backdrop**: Dark overlay, 40% opacity
- **Animation**: Scale in + fade
- **Content**: Rounded top corners (24px)
- **Padding**: 24px
- **Max height**: 90vh
- **Close**: X button top-right, or swipe down

---

## 6. USER FLOWS

### Renter Booking Flow

1. **Browse** → Homepage with categories
2. **Search** → Enter location, select category
3. **View Listing** → See details, check availability
4. **Select Dates** → Calendar picker
5. **Review Deposit** → See calculation breakdown
6. **Reserve** → Tap "Reserve now" button
7. **Chat Opens** → Automatic message thread
8. **Wait for Approval** → Status: RESERVED
9. **Pickup** → Owner marks as picked up, checklist
10. **Return** → Owner marks as returned, checklist
11. **Review** → Rate and comment

**Key Principles:**
- Linear progression
- Clear status at each step
- Reversible (can cancel before pickup)
- Error-resistant (validation at each step)

### Owner Workflow

1. **"List Your Gear" CTA** → Profile or homepage
2. **Wizard Steps**:
   - Upload photos (6 max)
   - Describe item (title, description, category)
   - Set pricing (daily rate, deposit override, min days)
   - Set availability (calendar)
   - Toggle instant booking
   - Publish
3. **Receive Request** → Notification, inbox
4. **Approve/Decline** → One tap action
5. **Pickup Checklist** → Photos, serial, condition, deposit confirmation
6. **Return Checklist** → Photos, condition assessment
7. **Review** → Rate renter

**Key Principles:**
- Wizard pattern (clear steps)
- Save progress (draft state)
- Preview before publish
- Quick actions (approve/decline)

---

## 7. TRUST & SAFETY VISUALS

### Always Visible
- **Verified badge**: Checkmark icon, teal color
- **Trust score**: Number badge, color-coded (green = high, amber = medium)
- **Rating**: Stars, average + count
- **Insurance indicator**: Shield icon, optional badge
- **Deposit explanation**: Tooltip or info icon

### Trust Indicators Hierarchy
1. **Owner verification** (highest priority)
2. **Trust score** (numerical, color-coded)
3. **Rating average** (stars + number)
4. **Review count** (social proof)
5. **Completed bookings** (experience indicator)

### Negative States (Softened)
- **Damages**: Amber/orange, not red
- **Disputes**: Amber warning, not danger red
- **Errors**: Soft red, friendly message
- **No scary UI**: Always offer solution, next step

---

## 8. EMPTY STATES

### Required Empty States

#### Empty Inbox
- **Icon**: MessageSquare (lucide), 64px, muted
- **Title**: "No messages yet"
- **Description**: "Start a conversation to see messages here"
- **Action**: "Browse Listings" button

#### No Search Results
- **Icon**: Search (lucide), 64px, muted
- **Title**: "No listings found"
- **Description**: "Try adjusting your filters or search in a different location"
- **Action**: "Clear Filters" button

#### No Listings Yet
- **Icon**: Package (lucide), 64px, muted
- **Title**: "No listings yet"
- **Description**: "Start earning by listing your equipment"
- **Action**: "List Your Gear" button (primary, purple)

#### No Bookings
- **Icon**: Calendar (lucide), 64px, muted
- **Title**: "No bookings yet"
- **Description**: "Your upcoming bookings will appear here"
- **Action**: "Browse Listings" button

#### No Reviews
- **Icon**: Star (lucide), 64px, muted
- **Title**: "No reviews yet"
- **Description**: "Reviews from completed bookings will appear here"
- **Action**: None (informational only)

### Empty State Pattern
1. **Large icon** (64px, muted color)
2. **Friendly title** (H3, slate-900)
3. **Helpful description** (Body, slate-600)
4. **Primary action** (if applicable, purple button)
5. **Spacing**: 24px between elements

---

## 9. LOADING STATES

### Skeletons
- **Purpose**: Show content structure while loading
- **Style**: Animated pulse, muted background
- **Match content**: Skeleton shape matches final content
- **Duration**: Show after 200ms delay

### Skeleton Patterns

#### Listing Card Skeleton
- Square image placeholder
- Title line (60% width)
- Price line (40% width)
- Rating dots

#### List Skeleton
- 3-4 skeleton cards
- Staggered appearance
- Same spacing as real content

#### Page Skeleton
- Header skeleton
- Content area skeleton
- Footer/nav always visible

---

## 10. ERROR STATES

### Error Patterns

#### Form Errors
- **Inline**: Red text below input
- **Icon**: AlertCircle (lucide), 16px
- **Message**: Clear, actionable
- **Example**: "Please enter a valid email address"

#### Page Errors
- **Icon**: AlertTriangle (lucide), 64px, amber
- **Title**: "Something went wrong"
- **Description**: Friendly explanation
- **Action**: "Try Again" button

#### Network Errors
- **Icon**: WifiOff (lucide), 64px, muted
- **Title**: "Connection problem"
- **Description**: "Check your internet connection"
- **Action**: "Retry" button

### Error Principles
- **Never blame user**
- **Always offer solution**
- **Soft colors** (amber, not harsh red)
- **Clear next step**

---

## 11. RESPONSIVE BREAKPOINTS

### Mobile-First Approach
- **Base**: 320px (smallest mobile)
- **sm**: 640px (large mobile)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

### Layout Adjustments
- **Mobile**: Single column, full width cards
- **Tablet**: 2 columns where appropriate
- **Desktop**: 3-4 columns, sidebars

---

## 12. ACCESSIBILITY

### Requirements
- **WCAG AA compliance** minimum
- **Color contrast**: 4.5:1 for text, 3:1 for UI
- **Focus indicators**: Visible, clear
- **Screen reader**: Semantic HTML, ARIA labels
- **Keyboard navigation**: All actions accessible
- **Touch targets**: Minimum 44x44px

### RTL Support
- **Automatic**: Layout flips for Hebrew
- **Icons**: Mirror where appropriate
- **Text alignment**: Right for Hebrew, left for English
- **Navigation**: Reverse order in RTL

---

## 13. IMPLEMENTATION CHECKLIST

### For Every New Component/Screen

- [ ] Mobile-first responsive
- [ ] RTL-safe (Hebrew layout)
- [ ] Clear visual hierarchy
- [ ] Consistent spacing (4px base)
- [ ] Appropriate motion (purposeful)
- [ ] Accessible (keyboard, screen reader)
- [ ] Loading state (skeleton)
- [ ] Empty state (if applicable)
- [ ] Error state (if applicable)
- [ ] Trust indicators (if user-facing)
- [ ] Large tap targets (48px minimum)
- [ ] Clear next action
- [ ] Tested in both languages

---

## 14. DESIGN TOKENS REFERENCE

### Spacing
```typescript
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
}
```

### Colors
```typescript
const colors = {
  primary: '#0EA5A5', // Teal
  accent: '#7C3AED',  // Purple
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  // ... slate scale
}
```

### Typography
```typescript
const typography = {
  title: { size: '32px', lineHeight: '40px', weight: 'bold' },
  h1: { size: '28px', lineHeight: '36px', weight: 'bold' },
  // ... etc
}
```

### Motion
```typescript
const motion = {
  fadeInUp: { /* ... */ },
  scaleIn: { /* ... */ },
  stagger: { /* ... */ },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
}
```

---

## 15. QUALITY GATES

### Before Shipping Any UI

1. **Visual Audit**
   - [ ] Spacing consistent (4px base)
   - [ ] Colors match palette
   - [ ] Typography follows scale
   - [ ] Shadows are soft
   - [ ] Border radius appropriate

2. **Interaction Audit**
   - [ ] Tap targets 48px+
   - [ ] Animations purposeful
   - [ ] Loading states present
   - [ ] Error handling graceful
   - [ ] Empty states friendly

3. **Content Audit**
   - [ ] Copy is clear
   - [ ] Trust indicators visible
   - [ ] Next action obvious
   - [ ] No visual noise

4. **Technical Audit**
   - [ ] RTL works correctly
   - [ ] Responsive on all sizes
   - [ ] 60fps animations
   - [ ] Accessible
   - [ ] Works in both languages

---

## 16. DESIGN DECISION LOG

### Key Decisions Made

1. **Bottom Navigation Fixed**
   - **Why**: One-handed mobile operation, always accessible
   - **Trade-off**: Slightly less screen space, but better UX

2. **Purple for CTAs**
   - **Why**: Distinguishes from teal brand, creates hierarchy
   - **Trade-off**: Two accent colors, but clear purpose

3. **16-24px Border Radius**
   - **Why**: Modern, friendly, not too rounded
   - **Trade-off**: Slightly less space-efficient, but more approachable

4. **Skeleton Loading**
   - **Why**: Better perceived performance, shows structure
   - **Trade-off**: More code, but better UX

5. **Hebrew Default (RTL)**
   - **Why**: Primary market, cultural respect
   - **Trade-off**: More complex layouts, but authentic experience

---

## 17. FUTURE CONSIDERATIONS

### Design Debt to Address
- [ ] Standardize all card components
- [ ] Create component library documentation
- [ ] Add design tokens to codebase
- [ ] Create Figma design system
- [ ] Document animation library
- [ ] Create empty state illustrations
- [ ] Standardize error messages

### Design Enhancements
- [ ] Micro-interactions for delight
- [ ] Haptic feedback simulation (via animation)
- [ ] Pull-to-refresh animations
- [ ] Optimistic UI updates
- [ ] Skeleton loading improvements
- [ ] Dark mode refinements

---

**This document is living and should be updated as the design system evolves.**

**Questions or clarifications?** Refer to this document first, then consult the design team.

