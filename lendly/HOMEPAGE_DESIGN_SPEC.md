# Lendly Mobile-First Homepage Design Specification

**Version:** 1.0  
**Date:** 2024  
**Design Goal:** Compact, professional, modern, premium marketplace homepage

---

## 1. OVERALL VISUAL DIRECTION

### Background
- **Base Color**: Deep slate (`#1e293b` to `#0f172a`) or dark teal gradient (`#0f4c5c` to `#1a5f6f`)
- **Texture**: Subtle grain/noise overlay (5-10% opacity, monochrome)
- **Gradient Direction**: Vertical (top to bottom, slightly darker at bottom)
- **Effect**: Creates depth without distraction, maintains readability

### Visual Philosophy
- **Premium Minimalism**: Every element serves a purpose
- **Compact Density**: More information in less space, but never cramped
- **Soft Sophistication**: Rounded edges, gentle shadows, muted tones
- **Trustworthy Aesthetics**: Professional color palette, consistent spacing
- **Mobile-Optimized**: Everything above the fold on standard mobile viewport (375px × 667px)

---

## 2. LAYOUT STRUCTURE

### Vertical Stack (Top to Bottom)

```
┌─────────────────────────────────┐
│   Logo (לנדלי)                  │  ← 16px from top
│   [Compact Search Bar]          │  ← 12px gap
│   [Location Indicator]          │
├─────────────────────────────────┤
│   Category Grid (4×2 or 4×3)    │  ← 24px gap
│   [8-10 circular buttons]        │
├─────────────────────────────────┤
│   Featured Listings Panel       │  ← 24px gap
│   [3 compact cards, horizontal] │
├─────────────────────────────────┤
│   Bottom Navigation             │  ← Fixed at bottom
└─────────────────────────────────┘
```

### Spacing System
- **Top padding**: 16px (safe area + logo spacing)
- **Section gaps**: 24px between major sections
- **Element gaps**: 12px between related elements
- **Bottom nav height**: 64px (includes safe area)

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 Logo Section

**Position**: Top center  
**Size**: 32px height (smaller than typical apps)  
**Typography**: 
- Font: Hebrew system font (Noto Sans Hebrew preferred)
- Weight: Medium (500)
- Color: Soft metallic teal (`#5eead4` with slight gradient overlay)
- Effect: Subtle inner shadow for depth

**Visual Treatment**:
- Text with soft gradient: `#5eead4` → `#2dd4bf`
- Optional: Very subtle texture overlay (grain, 5% opacity)
- No background box or border
- Centered horizontally

**Spacing**:
- Top: 16px from safe area
- Bottom: 12px to search bar

---

### 3.2 Search & Location Bar

**Layout**: Single row, compact  
**Height**: 44px  
**Width**: Full width minus 32px side padding (16px each side)

**Structure** (RTL - Hebrew):
```
[Location Icon] [Location Text] ──────────────── [Search Icon]
```

**Visual Design**:
- **Background**: Glass-like effect
  - Base: `rgba(30, 41, 59, 0.6)` (semi-transparent slate)
  - Backdrop blur: 8px
  - Border: 1px solid `rgba(148, 163, 184, 0.2)` (subtle border)
- **Border Radius**: 12px
- **Shadow**: `0 2px 8px rgba(0, 0, 0, 0.15)` (soft, subtle)

**Location Indicator** (Right side in RTL):
- **Icon**: MapPin (Lucide), 18px, color `#94a3b8`
- **Text**: "תל אביב" or "זיהוי אוטומטי" (auto-detect)
- **Typography**: 14px, Regular, color `#cbd5e1`
- **Spacing**: 12px padding from edge, 8px gap between icon and text
- **Interaction**: Tap to open location picker

**Search Icon** (Left side in RTL):
- **Icon**: Search (Lucide), 20px, color `#5eead4` (teal accent)
- **Position**: 12px from left edge
- **Interaction**: Tap to open search modal

**Spacing**:
- Top: 12px from logo
- Bottom: 24px to category grid
- Horizontal: 16px padding

---

### 3.3 Category Grid

**Layout**: 4 columns × 2-3 rows (8-10 categories total)  
**Grid Gap**: 12px horizontal, 16px vertical  
**Container Padding**: 16px horizontal

**Category Circle Specifications**:
- **Size**: 64px diameter (significantly smaller than typical)
- **Shape**: Perfect circle
- **Background**: 
  - Base gradient: `#1e3a5f` → `#1a4d6f` (deep teal variants)
  - Subtle texture overlay (grain, 8% opacity)
  - Inner shadow: `inset 0 1px 2px rgba(0, 0, 0, 0.2)`
- **Border**: 1px solid `rgba(94, 234, 212, 0.15)` (very subtle teal)
- **Shadow**: `0 2px 6px rgba(0, 0, 0, 0.2)` (soft depth)

**Icon Inside Circle**:
- **Size**: 28px × 28px
- **Color**: `#5eead4` (soft teal)
- **Stroke Weight**: 1.5px (line-based icons)
- **Position**: Centered
- **Icons** (Lucide):
  - Camera (מצלמות)
  - Drone (רחפנים)
  - Wrench/Drill (כלים)
  - Music/Headphones (ציוד DJ)
  - Tent (קמפינג)
  - Mixer (מיקסר)
  - Speaker (רמקולים)
  - Gamepad (משחקים)
  - Bicycle (אופניים)
  - Laptop (מחשבים)

**Label Below Circle**:
- **Typography**: 11px, Regular, color `#cbd5e1`
- **Position**: Centered below circle
- **Spacing**: 8px gap from circle
- **Text**: Hebrew category name (short, 2-4 characters when possible)
- **Max Width**: 64px (same as circle), text truncates with ellipsis if needed

**Category List** (8-10 items):
1. מצלמות (Cameras)
2. רחפנים (Drones)
3. כלים (Tools)
4. ציוד DJ (DJ Gear)
5. קמפינג (Camping)
6. מיקסר (Mixer)
7. רמקולים (Speakers)
8. משחקים (Gaming)
9. אופניים (Bicycles) - optional
10. מחשבים (Computers) - optional

**Interaction**:
- **Tap Feedback**: Scale to 0.92 (subtle press)
- **Hover** (desktop): Scale to 1.05, slight shadow increase
- **Animation**: Smooth spring transition (300ms, ease-out)
- **Active State**: Slight teal glow (`0 0 0 2px rgba(94, 234, 212, 0.3)`)

**Grid Calculation**:
- Screen width: 375px (standard mobile)
- Padding: 16px × 2 = 32px
- Available width: 343px
- 4 columns: (343px - 36px gaps) / 4 = 76.75px per column
- Circle: 64px (fits comfortably with spacing)

**Spacing**:
- Top: 24px from search bar
- Bottom: 24px to listings section
- Section title: None (categories are self-evident)

---

### 3.4 Featured Listings Section

**Layout**: Horizontal scrollable row (3 cards visible, scroll for more)  
**Container**: Subtle dimmed panel background

**Panel Background**:
- **Color**: `rgba(15, 23, 42, 0.4)` (darker slate, semi-transparent)
- **Border Radius**: 16px (top corners only, bottom extends)
- **Padding**: 16px horizontal, 20px vertical
- **Border**: 1px solid `rgba(148, 163, 184, 0.1)` (very subtle)
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.2)` (soft elevation)

**Section Title** (Optional, minimal):
- **Text**: "רשימות מומלצות" (Featured Listings)
- **Typography**: 14px, Semibold, color `#94a3b8`
- **Position**: 16px from left edge, 12px above cards
- **Spacing**: 8px gap to cards

**Listing Card Specifications**:
- **Width**: 160px (fixed, allows 3 visible + peek of 4th)
- **Height**: 220px (compact, vertical)
- **Aspect Ratio**: ~0.73:1
- **Border Radius**: 12px
- **Background**: `#1e293b` (solid slate, slightly lighter than background)
- **Border**: 1px solid `rgba(148, 163, 184, 0.15)`
- **Shadow**: `0 2px 8px rgba(0, 0, 0, 0.25)` (soft depth)
- **Spacing**: 12px gap between cards

**Card Content Structure** (Top to Bottom):

1. **Image** (Top section):
   - **Height**: 120px
   - **Border Radius**: 12px (top corners only)
   - **Aspect Ratio**: 4:3
   - **Background**: `#0f172a` (dark placeholder)
   - **Overlay**: None (clean image)
   - **Quality**: High-resolution, professional photography

2. **Content** (Bottom section, 100px):
   - **Padding**: 12px
   - **Spacing**: 8px between elements

3. **Title**:
   - **Typography**: 13px, Semibold, color `#f1f5f9`
   - **Lines**: 1 (truncate with ellipsis)
   - **Spacing**: 0px top, 4px bottom

4. **Price & Rating Row**:
   - **Layout**: Horizontal, space-between
   - **Price**: 
     - Text: "₪150/יום" (₪150/day)
     - Typography: 14px, Bold, color `#5eead4` (teal accent)
   - **Rating**:
     - Stars: 3.5 filled (small, 10px)
     - Color: `#fbbf24` (amber, muted)
     - Typography: 12px, Regular, color `#94a3b8`

5. **Location** (Optional, minimal):
   - **Typography**: 11px, Regular, color `#64748b`
   - **Icon**: MapPin, 10px
   - **Spacing**: 4px top

**Card Interaction**:
- **Tap**: Navigate to listing detail page
- **Press Feedback**: Scale to 0.96 (subtle)
- **Hover** (desktop): Scale to 1.02, shadow increase
- **Animation**: Smooth transition (200ms)

**Horizontal Scroll**:
- **Behavior**: Smooth scrolling, snap to cards
- **Scrollbar**: Hidden (native mobile scroll)
- **Padding**: 16px on left, 16px on right (for edge cards)

**Spacing**:
- Top: 24px from category grid
- Bottom: 24px to bottom nav (or content continues below)

---

### 3.5 Bottom Navigation

**Position**: Fixed at bottom  
**Height**: 64px (includes safe area padding)  
**Width**: Full width

**Background**:
- **Color**: `rgba(15, 23, 42, 0.95)` (dark slate, near-opaque)
- **Backdrop Blur**: 12px (frosted glass effect)
- **Border**: 1px solid `rgba(148, 163, 184, 0.1)` (top border only)
- **Shadow**: `0 -2px 8px rgba(0, 0, 0, 0.2)` (soft elevation from bottom)

**Navigation Items** (5 tabs, RTL order):
1. בית (Home) - Active
2. חיפוש (Search)
3. הודעות (Messages)
4. הזמנות (Bookings)
5. פרופיל (Profile)

**Tab Layout**:
- **Distribution**: Equal width (20% each)
- **Spacing**: 0px between tabs
- **Padding**: 8px vertical, 4px horizontal per tab

**Tab Content**:
- **Icon**: Lucide icons, 22px
- **Icon Color (Inactive)**: `#64748b` (muted slate)
- **Icon Color (Active)**: `#5eead4` (teal accent)
- **Label**: None (icons only, compact design)
- **Active Indicator**: 
  - Small dot below icon: 4px diameter, color `#5eead4`
  - Position: 2px below icon
  - Animation: Scale in (0.3s, spring)

**Tab Interaction**:
- **Tap Target**: Full tab area (minimum 48px height)
- **Press Feedback**: Icon scale to 0.9 (subtle)
- **Active Transition**: Smooth color change + dot animation (200ms)
- **Haptic Feedback**: Light tap (if available)

**Safe Area**:
- **Padding Bottom**: Respects device safe area (notch/home indicator)
- **Minimum**: 8px padding, maximum: 20px (iPhone X+)

---

## 4. COLOR PALETTE

### Primary Colors
- **Deep Teal**: `#0f4c5c` (background gradient start)
- **Dark Teal**: `#1a5f6f` (background gradient end)
- **Slate Dark**: `#0f172a` (alternative background)
- **Slate Medium**: `#1e293b` (cards, panels)

### Accent Colors
- **Soft Teal**: `#5eead4` (primary accent, icons, active states)
- **Muted Aqua**: `#2dd4bf` (secondary accent, gradients)
- **Steel Green**: `#14b8a6` (tertiary accent)

### Neutral Colors
- **Text Primary**: `#f1f5f9` (headings, important text)
- **Text Secondary**: `#cbd5e1` (body text, labels)
- **Text Muted**: `#94a3b8` (hints, placeholders)
- **Text Disabled**: `#64748b` (inactive elements)

### UI Colors
- **Border Subtle**: `rgba(148, 163, 184, 0.15)` (card borders)
- **Border Visible**: `rgba(148, 163, 184, 0.3)` (input borders)
- **Overlay Dark**: `rgba(0, 0, 0, 0.4)` (modals, sheets)
- **Glass Background**: `rgba(30, 41, 59, 0.6)` (frosted elements)

### Semantic Colors (Minimal Use)
- **Success**: `#10b981` (completed states, rarely used)
- **Warning**: `#f59e0b` (amber, ratings only)
- **Error**: `#ef4444` (errors, rarely used, softened)

---

## 5. TYPOGRAPHY

### Font Stack
- **Hebrew Primary**: "Noto Sans Hebrew", system-ui, sans-serif
- **English Secondary**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Fallback**: sans-serif

### Type Scale (Mobile-First)

**Logo**:
- Size: 20px
- Line Height: 1.2
- Weight: 500 (Medium)
- Letter Spacing: 0.5px

**Section Titles** (if used):
- Size: 14px
- Line Height: 1.4
- Weight: 600 (Semibold)

**Body Text**:
- Size: 14px
- Line Height: 1.5
- Weight: 400 (Regular)

**Small Text** (labels, captions):
- Size: 11px
- Line Height: 1.4
- Weight: 400 (Regular)

**Card Titles**:
- Size: 13px
- Line Height: 1.4
- Weight: 600 (Semibold)

**Price**:
- Size: 14px
- Line Height: 1.2
- Weight: 700 (Bold)

**Category Labels**:
- Size: 11px
- Line Height: 1.3
- Weight: 400 (Regular)

### RTL Considerations
- **Text Alignment**: Right for Hebrew, left for English
- **Icon Positioning**: Mirrored where appropriate (arrows, chevrons)
- **Layout Direction**: `direction: rtl` for Hebrew sections

---

## 6. SPACING SYSTEM

### Base Unit: 4px

**Spacing Tokens**:
- **xs**: 4px (tight spacing, icon padding)
- **sm**: 8px (small gaps, label spacing)
- **md**: 12px (element gaps, card padding)
- **base**: 16px (section padding, standard gaps)
- **lg**: 24px (section spacing, major gaps)
- **xl**: 32px (large spacing, rarely used)

### Applied Spacing

**Page Level**:
- Top safe area: 16px
- Horizontal padding: 16px
- Section gaps: 24px

**Component Level**:
- Logo: 16px top, 12px bottom
- Search bar: 12px top, 24px bottom
- Category grid: 24px top, 24px bottom, 16px horizontal
- Listings panel: 24px top, 24px bottom, 16px horizontal
- Bottom nav: Fixed, 0px margins

**Element Level**:
- Category circles: 12px horizontal gap, 16px vertical gap
- Category label: 8px below circle
- Card gap: 12px
- Card internal padding: 12px
- Bottom nav tabs: 8px vertical, 4px horizontal

---

## 7. SHADOWS & DEPTH

### Shadow System

**Level 1 - Subtle** (cards, inputs):
- `0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)`

**Level 2 - Soft** (elevated cards, panels):
- `0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)`

**Level 3 - Medium** (modals, sheets):
- `0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15)`

**Level 4 - Strong** (floating elements):
- `0 8px 24px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.2)`

### Inner Shadows

**Category Circles**:
- `inset 0 1px 2px rgba(0, 0, 0, 0.2)` (subtle depth)

**Buttons** (if used):
- `inset 0 1px 1px rgba(255, 255, 255, 0.1)` (very subtle highlight)

### Border Shadows (Glow Effects)

**Active Category**:
- `0 0 0 2px rgba(94, 234, 212, 0.3)` (teal glow)

**Focus States**:
- `0 0 0 3px rgba(94, 234, 212, 0.2)` (soft teal ring)

---

## 8. TEXTURES & EFFECTS

### Grain Texture
- **Application**: Background, category circles, buttons
- **Opacity**: 5-10% (very subtle)
- **Type**: Monochrome noise/grain
- **Blend Mode**: Overlay or Soft Light
- **Purpose**: Adds premium tactile feel without distraction

### Glass Morphism (Frosted Glass)
- **Application**: Search bar, bottom navigation
- **Background**: Semi-transparent (`rgba(30, 41, 59, 0.6)`)
- **Backdrop Blur**: 8-12px
- **Border**: Subtle (`rgba(148, 163, 184, 0.2)`)
- **Effect**: Modern, premium, depth

### Gradients

**Background Gradient**:
- Start: `#0f4c5c` (top)
- End: `#1a5f6f` (bottom)
- Direction: Vertical (180deg)
- Stops: 0%, 100%

**Category Circle Gradient**:
- Start: `#1e3a5f` (top-left)
- End: `#1a4d6f` (bottom-right)
- Direction: Diagonal (135deg)
- Stops: 0%, 100%

**Logo Gradient** (optional):
- Start: `#5eead4` (top)
- End: `#2dd4bf` (bottom)
- Direction: Vertical
- Stops: 0%, 100%

---

## 9. INTERACTIONS & ANIMATIONS

### Animation Principles
- **Purposeful**: Every animation signals meaning
- **Subtle**: Never distracting or excessive
- **Smooth**: 60fps, GPU-accelerated
- **Fast**: 200-400ms duration
- **Natural**: Spring physics for organic feel

### Interaction States

**Category Circles**:
- **Default**: Normal scale (1.0)
- **Hover** (desktop): Scale 1.05, shadow increase
- **Press**: Scale 0.92 (subtle press)
- **Active**: Teal glow ring
- **Transition**: Spring (stiffness: 300, damping: 30)

**Listing Cards**:
- **Default**: Normal scale (1.0)
- **Hover** (desktop): Scale 1.02, shadow increase
- **Press**: Scale 0.96 (subtle press)
- **Transition**: Ease-out (200ms)

**Search Bar**:
- **Default**: Normal state
- **Focus**: Teal border glow, slight scale (1.01)
- **Transition**: Ease-out (150ms)

**Bottom Nav Tabs**:
- **Default**: Muted icon color
- **Press**: Icon scale 0.9
- **Active**: Teal color + dot scale in
- **Transition**: Ease-out (200ms)

### Page Load Animations

**Staggered Entry** (if implemented):
1. Logo: Fade in (200ms)
2. Search bar: Fade in + slide up (300ms, delay 50ms)
3. Categories: Fade in + scale (400ms, delay 100ms, stagger 50ms)
4. Listings: Fade in + slide up (400ms, delay 200ms)

**Stagger Configuration**:
- Parent: `staggerChildren: 0.05`
- Child: `fadeInUp` variant (opacity 0 → 1, y 10px → 0)

### Reduced Motion
- **Respect**: `prefers-reduced-motion` media query
- **Fallback**: Instant transitions, no animations
- **Implementation**: CSS `@media (prefers-reduced-motion: reduce)`

---

## 10. RESPONSIVE BEHAVIOR

### Breakpoints
- **Mobile**: 320px - 479px (primary target)
- **Large Mobile**: 480px - 767px
- **Tablet**: 768px+ (future consideration)

### Mobile Adaptations (320px - 479px)
- **Category Grid**: 4 columns (as specified)
- **Listing Cards**: 3 visible, horizontal scroll
- **Search Bar**: Full width minus 32px padding
- **Bottom Nav**: 5 tabs, equal width

### Large Mobile Adaptations (480px - 767px)
- **Category Grid**: 4 columns (maintains compact feel)
- **Listing Cards**: 3-4 visible, slightly larger (180px width)
- **Spacing**: Slightly increased (20px horizontal padding)

### Tablet Considerations (Future)
- **Category Grid**: 5-6 columns
- **Listing Cards**: Grid layout (2-3 columns)
- **Spacing**: Increased padding (24px horizontal)

---

## 11. RTL (HEBREW) LAYOUT

### Layout Direction
- **Default**: `direction: rtl` for Hebrew locale
- **Text Alignment**: Right-aligned
- **Icon Positioning**: Mirrored where appropriate

### Specific RTL Adjustments

**Search Bar**:
- Location indicator: Right side
- Search icon: Left side
- Text input: Right-aligned

**Category Grid**:
- Grid order: Right-to-left (first item on right)
- Labels: Right-aligned below circles

**Listing Cards**:
- Price: Right side
- Rating: Left side
- Text: Right-aligned

**Bottom Navigation**:
- Tab order: Right-to-left
- Icons: No mirroring (universal symbols)
- Active dot: Below icon (same position)

---

## 12. ACCESSIBILITY

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio (WCAG AA)
- **Interactive Elements**: Minimum 3:1 ratio
- **Focus Indicators**: High contrast (teal ring, 3px)

### Touch Targets
- **Minimum Size**: 44px × 44px (iOS), 48px × 48px (Android)
- **Category Circles**: 64px (exceeds minimum)
- **Bottom Nav Tabs**: Full height (64px) × 20% width
- **Listing Cards**: 160px × 220px (exceeds minimum)

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA Labels**: All interactive elements labeled
- **Alt Text**: Images have descriptive alt text
- **Focus Management**: Logical tab order

### Keyboard Navigation
- **Tab Order**: Logical flow (top to bottom, left to right in LTR)
- **Focus Indicators**: Visible teal ring (3px, high contrast)
- **Skip Links**: Optional, for main content

---

## 13. PERFORMANCE CONSIDERATIONS

### Image Optimization
- **Format**: WebP with JPEG fallback
- **Sizing**: Responsive images (srcset)
- **Lazy Loading**: Below-the-fold images
- **Placeholder**: Blur-up or skeleton

### Animation Performance
- **GPU Acceleration**: `transform` and `opacity` only
- **Will-Change**: Applied to animated elements
- **Frame Rate**: Target 60fps, no jank
- **Reduced Motion**: Respects user preference

### Code Splitting
- **Components**: Lazy load below-the-fold sections
- **Images**: Progressive loading
- **Fonts**: Preload critical fonts

---

## 14. DESIGN TOKENS SUMMARY

### Spacing Tokens
```typescript
spacing = {
  xs: '4px',    // Tight spacing
  sm: '8px',    // Small gaps
  md: '12px',   // Element gaps
  base: '16px', // Standard padding
  lg: '24px',   // Section spacing
  xl: '32px',   // Large spacing
}
```

### Color Tokens
```typescript
colors = {
  // Backgrounds
  bgPrimary: '#0f4c5c',      // Deep teal
  bgSecondary: '#1a5f6f',    // Dark teal
  bgSlate: '#0f172a',        // Slate dark
  bgCard: '#1e293b',         // Slate medium
  
  // Accents
  accentTeal: '#5eead4',     // Soft teal
  accentAqua: '#2dd4bf',     // Muted aqua
  accentGreen: '#14b8a6',    // Steel green
  
  // Text
  textPrimary: '#f1f5f9',    // Headings
  textSecondary: '#cbd5e1',  // Body
  textMuted: '#94a3b8',      // Hints
  textDisabled: '#64748b',  // Inactive
  
  // UI
  borderSubtle: 'rgba(148, 163, 184, 0.15)',
  borderVisible: 'rgba(148, 163, 184, 0.3)',
  glassBg: 'rgba(30, 41, 59, 0.6)',
}
```

### Typography Tokens
```typescript
typography = {
  logo: { size: '20px', weight: 500, lineHeight: 1.2 },
  sectionTitle: { size: '14px', weight: 600, lineHeight: 1.4 },
  body: { size: '14px', weight: 400, lineHeight: 1.5 },
  small: { size: '11px', weight: 400, lineHeight: 1.4 },
  cardTitle: { size: '13px', weight: 600, lineHeight: 1.4 },
  price: { size: '14px', weight: 700, lineHeight: 1.2 },
}
```

### Shadow Tokens
```typescript
shadows = {
  subtle: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
  soft: '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15)',
  strong: '0 8px 24px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.2)',
  inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
  glow: '0 0 0 2px rgba(94, 234, 212, 0.3)',
}
```

### Border Radius Tokens
```typescript
radius = {
  sm: '8px',   // Badges
  md: '12px',  // Cards, inputs, buttons
  lg: '16px',  // Panels, large cards
  full: '50%', // Circles
}
```

### Animation Tokens
```typescript
animations = {
  fast: '150ms',
  normal: '200ms',
  slow: '400ms',
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}
```

---

## 15. COMPONENT BREAKDOWN

### Logo Component
- **Type**: Text-based (Hebrew: לנדלי)
- **Size**: 32px height
- **Color**: Soft metallic teal gradient
- **Position**: Top center
- **Spacing**: 16px top, 12px bottom

### Search Bar Component
- **Type**: Glass morphism container
- **Height**: 44px
- **Content**: Location indicator (right) + Search icon (left)
- **Background**: Semi-transparent with backdrop blur
- **Border**: Subtle, rounded (12px)

### Category Grid Component
- **Type**: 4-column grid
- **Items**: 8-10 circular buttons (64px)
- **Layout**: 4 columns × 2-3 rows
- **Spacing**: 12px horizontal, 16px vertical
- **Content**: Icon (28px) + Label (11px, below)

### Category Circle Component
- **Type**: Circular button
- **Size**: 64px diameter
- **Background**: Gradient with texture
- **Content**: Icon centered
- **Interaction**: Scale on press, glow on active

### Featured Listings Component
- **Type**: Horizontal scrollable panel
- **Background**: Dimmed panel (semi-transparent)
- **Layout**: 3 cards visible, scroll for more
- **Spacing**: 12px between cards

### Listing Card Component
- **Type**: Compact vertical card
- **Size**: 160px × 220px
- **Content**: Image (120px) + Title + Price/Rating + Location
- **Background**: Solid slate
- **Border**: Subtle, rounded (12px)

### Bottom Navigation Component
- **Type**: Fixed bar
- **Height**: 64px (includes safe area)
- **Background**: Frosted glass
- **Content**: 5 icon-only tabs
- **Active State**: Teal icon + dot indicator

---

## 16. VISUAL HIERARCHY

### Priority Order (Top to Bottom)

1. **Logo** (Brand identity)
   - Small but visible
   - Premium treatment

2. **Search/Location** (Primary action)
   - Prominent, accessible
   - Glass effect draws attention

3. **Category Grid** (Core functionality)
   - Most prominent section
   - Compact but clear
   - Immediate access to browsing

4. **Featured Listings** (Discovery)
   - Secondary priority
   - Dimmed panel separates from main content
   - Horizontal scroll encourages exploration

5. **Bottom Navigation** (Persistent access)
   - Always visible
   - Minimal, non-intrusive
   - Clear active state

### Visual Weight
- **Heavy**: Category grid (most space, most elements)
- **Medium**: Featured listings (panel, cards)
- **Light**: Logo, search bar, bottom nav (minimal, functional)

---

## 17. ACCEPTANCE CRITERIA CHECKLIST

### Visual Design
- [ ] Compact spacing throughout (no wasted space)
- [ ] Category circles are 64px (small, uniform)
- [ ] Premium texture/grain applied subtly
- [ ] Professional color palette (desaturated, teal-focused)
- [ ] Soft shadows (not harsh)
- [ ] Rounded corners consistent (12px, 16px)

### Layout
- [ ] Everything fits above the fold (mobile viewport)
- [ ] 4-column category grid (tight, balanced)
- [ ] 3 listing cards visible (horizontal scroll)
- [ ] RTL layout correct (Hebrew)
- [ ] Spacing system consistent (4px base unit)

### Interactions
- [ ] Subtle animations only (no bouncing)
- [ ] Tap feedback smooth (scale effects)
- [ ] No cartoon effects
- [ ] High-end, intentional feel

### Functionality
- [ ] Marketplace vibe instantly recognizable
- [ ] Category access immediate and clear
- [ ] Search/location prominent
- [ ] Navigation always accessible
- [ ] Trust indicators visible (if applicable)

### Polish
- [ ] Cohesive visual language
- [ ] Professional appearance
- [ ] Trustworthy aesthetics
- [ ] Modern, premium feel
- [ ] No bright or childish colors

---

## 18. IMPLEMENTATION NOTES

### Technical Considerations
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS (custom tokens)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **RTL**: CSS `direction: rtl` + i18n routing

### Asset Requirements
- **Logo**: SVG or high-res PNG (text-based)
- **Category Icons**: SVG (line-based, 1.5px stroke)
- **Listing Images**: High-res photos (optimized)
- **Texture**: Grain/noise overlay (CSS or image)

### Browser Support
- **Modern Browsers**: Chrome, Safari, Firefox (latest 2 versions)
- **Mobile**: iOS 14+, Android 8+
- **Features**: CSS backdrop-filter, CSS Grid, Flexbox

---

## 19. FUTURE ENHANCEMENTS

### Potential Additions
- **Hero Banner**: Optional promotional banner (above categories)
- **Quick Filters**: Price range, distance (below search)
- **Trending Badge**: On featured listings
- **Category Icons**: Animated on hover (subtle)
- **Pull-to-Refresh**: Smooth refresh animation

### A/B Testing Opportunities
- **Category Count**: 8 vs 10 categories
- **Card Size**: 160px vs 180px width
- **Background**: Gradient vs solid
- **Category Layout**: Grid vs horizontal scroll

---

**End of Design Specification**

This document serves as the complete visual and interaction guide for the Lendly mobile-first homepage. All components, spacing, colors, and behaviors are specified to ensure a compact, professional, modern, and premium marketplace experience.

