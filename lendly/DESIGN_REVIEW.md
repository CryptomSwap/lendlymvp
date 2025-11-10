# Design Review Checklist
## Use this for every UI component/screen before implementation

## Pre-Implementation Questions

1. **Which real-world moment does this serve?**
   - [ ] Search Moment (finding items)
   - [ ] Decision Moment (evaluating items)
   - [ ] Transaction Moment (booking flow)

2. **What is the user's primary goal here?**
   - [ ] Find something
   - [ ] Learn about something
   - [ ] Take an action
   - [ ] Check status
   - [ ] Communicate

3. **What happens next?**
   - Clear next action identified: ___________
   - Button/link is prominent: [ ] Yes [ ] No

## Visual Design Check

### Spacing
- [ ] Uses 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Generous whitespace (minimum 16px between sections)
- [ ] Consistent gaps in lists/grids

### Typography
- [ ] Appropriate heading level (H1-H4)
- [ ] Body text readable (16px minimum)
- [ ] High contrast (4.5:1 minimum)
- [ ] RTL-safe (Hebrew text flows correctly)

### Colors
- [ ] Uses brand palette (teal, purple, slate)
- [ ] No harsh colors
- [ ] Trust indicators visible (if applicable)
- [ ] Error states use softened colors (amber, not harsh red)

### Components
- [ ] Cards have 16-24px border radius
- [ ] Buttons are 48px+ height
- [ ] Inputs are 48px+ height
- [ ] Shadows are soft and subtle
- [ ] Icons are consistent (Lucide)

## Interaction Design Check

### Mobile-First
- [ ] Works one-handed
- [ ] Primary actions in thumb zone
- [ ] Tap targets 48px minimum
- [ ] Swipe gestures where appropriate
- [ ] Bottom nav always accessible

### Motion
- [ ] Animations have purpose (not decoration)
- [ ] Smooth, spring-based
- [ ] 60fps performance
- [ ] Respects reduced motion preference

### Feedback
- [ ] Tap feedback (scale animation)
- [ ] Loading states (skeletons)
- [ ] Error states (friendly messages)
- [ ] Success states (optimistic updates)

## Information Architecture Check

### Hierarchy
- [ ] Most important info is most prominent
- [ ] Visual weight guides attention
- [ ] Related items grouped
- [ ] Clear sections/regions

### Trust & Safety
- [ ] Trust indicators visible (if applicable)
- [ ] Verified badges shown
- [ ] Ratings/reviews accessible
- [ ] Deposit/insurance clearly explained

### Clarity
- [ ] Zero clutter
- [ ] No unnecessary elements
- [ ] Clear labels
- [ ] Helpful descriptions

## Content Check

### Copy
- [ ] Friendly but professional tone
- [ ] Clear, concise language
- [ ] Action-oriented CTAs
- [ ] Helpful error messages
- [ ] Translated (Hebrew + English)

### Empty States
- [ ] Friendly icon (64px, muted)
- [ ] Helpful title
- [ ] Actionable description
- [ ] Primary action button (if applicable)

### Loading States
- [ ] Skeleton matches content structure
- [ ] Shows after 200ms delay
- [ ] Animated pulse
- [ ] Same spacing as real content

## Technical Check

### Responsive
- [ ] Works on 320px width
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1024px+)
- [ ] No horizontal scroll

### RTL
- [ ] Layout flips for Hebrew
- [ ] Text alignment correct
- [ ] Icons mirrored where needed
- [ ] Navigation order reversed

### Accessibility
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] ARIA labels where needed

### Performance
- [ ] Images optimized
- [ ] Animations GPU-accelerated
- [ ] No layout shift
- [ ] Fast initial load

## Final Questions

1. **Does this feel trustworthy?** [ ] Yes [ ] No
   - If no, what's missing? ___________

2. **Is the next action obvious?** [ ] Yes [ ] No
   - If no, what's unclear? ___________

3. **Would a user feel safe using this?** [ ] Yes [ ] No
   - If no, what feels unsafe? ___________

4. **Is this mobile-friendly?** [ ] Yes [ ] No
   - If no, what needs fixing? ___________

5. **Does this match the design system?** [ ] Yes [ ] No
   - If no, what's inconsistent? ___________

---

## Approval

- [ ] Design reviewed against checklist
- [ ] All critical items checked
- [ ] Ready for implementation
- [ ] Design system document consulted

**Reviewed by**: ___________  
**Date**: ___________

