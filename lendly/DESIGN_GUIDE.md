# Lendly Design Guide
## Quick Reference for Developers

**This is your go-to guide when building UI components.**  
Refer to DESIGN_SYSTEM.md for comprehensive principles.  
Use DESIGN_REVIEW.md before shipping any component.

---

## 🎨 Quick Design Tokens

### Colors (Already in CSS)
```css
--primary: #0EA5A5        /* Teal - brand color */
--accent: #7C3AED         /* Purple - CTAs */
--success: #10b981        /* Green */
--warning: #f59e0b        /* Amber */
--danger: #ef4444         /* Soft red */
```

### Spacing (4px base unit)
- `xs`: 4px
- `sm`: 8px  
- `md`: 12px
- `base`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Typography Classes
- `.text-title` - 32px / Bold
- `.text-h1` - 28px / Bold
- `.text-h2` - 24px / Semibold
- `.text-h3` - 20px / Semibold
- `.text-h4` - 18px / Medium
- `.text-body` - 16px / Regular
- `.text-caption` - 14px / Regular

### Border Radius
- Cards: `rounded-2xl` (16px) or `rounded-3xl` (24px)
- Inputs/Buttons: `rounded-xl` (12px)
- Badges: `rounded-lg` (8px)

---

## 🎯 The Three Moments

### 1. Search Moment
**User Goal**: Find equipment nearby

**Key Screens**:
- Homepage (hero + categories)
- Search results
- Filters

**Design Focus**:
- Location context prominent
- Category shortcuts large & tappable
- Price/day visible
- Trust indicators (rating, verified)

### 2. Decision Moment
**User Goal**: Evaluate an item

**Key Screens**:
- Listing detail
- Booking drawer

**Design Focus**:
- Photos prominent (carousel)
- Owner trust visible
- Deposit breakdown clear
- Reserve button prominent (purple)

### 3. Transaction Moment
**User Goal**: Complete booking flow

**Key Screens**:
- Booking detail
- Chat
- Checklists
- Reviews

**Design Focus**:
- Status always clear
- Next action obvious
- Communication easy
- Progress visible

---

## 📱 Mobile-First Rules

### Tap Targets
- **Minimum**: 48px height
- **Preferred**: 56px for primary actions
- **Spacing**: 12px minimum between targets

### Thumb Zone
- **Primary actions**: Bottom 1/3 of screen
- **Navigation**: Fixed bottom
- **Secondary actions**: Top area OK

### One-Handed Operation
- **Swipe**: Natural gestures (carousel, dismiss)
- **Scroll**: Vertical only (no horizontal)
- **Reach**: Important buttons reachable

---

## ✨ Motion Patterns

### Use Framer Motion

```typescript
import { motion } from "framer-motion";
import { fadeInUp, scaleIn, staggerChildren } from "@/lib/motion";

// For lists
<motion.div variants={staggerChildren} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div variants={fadeInUp} key={item.id}>
      {/* content */}
    </motion.div>
  ))}
</motion.div>

// For buttons (tap feedback)
<motion.button
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  Click me
</motion.button>

// For modals
<motion.div
  variants={scaleIn}
  initial="hidden"
  animate="visible"
>
  {/* modal content */}
</motion.div>
```

### Animation Rules
- **Duration**: 200-500ms (never longer)
- **Purpose**: Every animation signals meaning
- **Performance**: Use `transform` and `opacity` only
- **Respect**: `prefers-reduced-motion`

---

## 🎴 Component Patterns

### Card Pattern
```tsx
<Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
  {/* content */}
</Card>
```

**Rules**:
- 16-24px border radius
- Soft shadow
- Hover: scale 1.02, shadow increase
- Tap: scale 0.98

### Button Pattern
```tsx
<Button 
  className="h-12 rounded-xl" // 48px min height
  // Use motion for tap feedback
>
  Action
</Button>
```

**Variants**:
- Primary: Purple (`bg-accent`)
- Secondary: Teal (`bg-primary`)
- Outline: Border only
- Ghost: Transparent

### Input Pattern
```tsx
<Input 
  className="h-12 rounded-xl" // 48px min height
  // Focus ring: teal
/>
```

**Rules**:
- 48px minimum height
- 12px border radius
- Focus: teal ring
- Error: red border + message below

### Empty State Pattern
```tsx
<div className="flex flex-col items-center justify-center py-12 space-y-6">
  <Icon className="h-16 w-16 text-muted-foreground" />
  <h3 className="text-h3">Title</h3>
  <p className="text-body text-muted-foreground text-center max-w-sm">
    Description
  </p>
  {action && (
    <Button>Action Button</Button>
  )}
</div>
```

**Rules**:
- 64px icon (muted color)
- H3 title
- Body description
- Primary action button (if applicable)
- 24px spacing between elements

---

## 🔒 Trust Indicators

### Always Show
- **Verified badge**: Checkmark icon, teal
- **Trust score**: Number badge, color-coded
- **Rating**: Stars + count
- **Insurance**: Shield icon (if applicable)

### Placement
- **Listing cards**: Trust score + verified badge
- **Owner profile**: All indicators prominent
- **Booking detail**: Trust indicators visible

### Color Coding
- **High trust** (80+): Green
- **Medium trust** (50-79): Amber
- **Low trust** (<50): Red (softened)

---

## 📊 Loading States

### Skeleton Pattern
```tsx
<Skeleton className="h-48 w-full rounded-2xl" />
```

**Rules**:
- Match content structure
- Animated pulse
- Show after 200ms delay
- Same spacing as real content

### Where to Use
- Image loading (listing photos)
- List items (cards, messages)
- Page content (sections)
- Form fields (if slow)

---

## 🚨 Error States

### Pattern
```tsx
<div className="flex flex-col items-center justify-center py-12">
  <AlertTriangle className="h-16 w-16 text-warning" />
  <h3 className="text-h3 mt-4">Something went wrong</h3>
  <p className="text-body text-muted-foreground mt-2">
    Friendly explanation
  </p>
  <Button className="mt-6">Try Again</Button>
</div>
```

**Rules**:
- Amber (not harsh red)
- Friendly message
- Always offer solution
- Clear next action

---

## 🌍 RTL Support

### Automatic
- Layout flips for Hebrew
- Text alignment correct
- Navigation order reversed

### Manual Checks
- [ ] Icons mirrored where needed
- [ ] Numbers/dates formatted correctly
- [ ] Mixed content preserves direction
- [ ] Logo position correct

---

## ✅ Quick Checklist

Before shipping any component:

- [ ] Mobile-first (works on 320px)
- [ ] RTL-safe (Hebrew layout)
- [ ] Tap targets 48px+
- [ ] Loading state (skeleton)
- [ ] Empty state (if applicable)
- [ ] Error state (if applicable)
- [ ] Trust indicators (if user-facing)
- [ ] Motion purposeful (not decoration)
- [ ] Clear next action
- [ ] Tested in both languages

---

## 📚 Reference Documents

1. **DESIGN_SYSTEM.md** - Comprehensive design principles
2. **DESIGN_REVIEW.md** - Pre-ship checklist
3. **DESIGN_AUDIT.md** - Current state assessment
4. **This file** - Quick reference

---

## 🎯 Common Patterns

### Listing Card
- Square image (1:1 aspect)
- Title, price, rating
- Trust indicators
- Tap feedback
- Image skeleton

### Booking Card
- Status badge (top-right)
- Item photo
- Dates
- Actions (context-aware)
- Tap feedback

### Message Card
- Avatar + name
- Message text
- Timestamp
- System events (styled differently)
- Smooth appearance

### Filter Panel
- Large toggles
- Clear labels
- Apply button (prominent)
- Reset option
- Smooth transitions

---

## 💡 Pro Tips

1. **Start with mobile** - Design for 320px first
2. **Test RTL early** - Don't wait until the end
3. **Motion last** - Get layout right, then animate
4. **Trust first** - Always show trust indicators
5. **Empty states matter** - They're part of the experience
6. **Consistency over clever** - Use existing patterns
7. **Accessibility always** - Keyboard, screen reader, contrast

---

**Questions?** Check DESIGN_SYSTEM.md or ask the design team.

**Ready to build?** Use DESIGN_REVIEW.md before shipping.

