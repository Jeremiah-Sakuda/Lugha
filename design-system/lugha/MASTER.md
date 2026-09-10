# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Lugha
**Generated:** 2026-09-10 18:55:22
**Category:** Language Learning App (adult learners, installed web app on iPhone, notifications mirrored to the watch)

> Hand-reviewed. The generator's first pass proposed a playful children's style; it was replaced below because the wearer is an adult and the product has no marketing page in v1. Tokens, spacing, shadows, and the checklist are kept from the generator.

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#4F46E5` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#818CF8` | `--color-secondary` |
| On Secondary | `#0F172A` | `--color-on-secondary` |
| Accent/CTA | `#16A34A` | `--color-accent` |
| On Accent/CTA | `#000000` | `--color-on-accent` |
| Background | `#EEF2FF` | `--color-background` |
| Foreground | `#312E81` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#312E81` | `--color-card-foreground` |
| Muted | `#EBEEF8` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#C7D2FE` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#4F46E5` | `--color-ring` |

**Color Notes:** Learning indigo + progress green [Accent adjusted from #22C55E]

### Typography

- **Heading Font:** Source Serif 4 (the wearer's own words are set in this face, so they read as a quotation, not a correction)
- **Body Font:** Inter
- **Mood:** calm, adult, legible at small sizes, quiet
- **Google Fonts:** [Source Serif 4 + Inter](https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@400;500;600&display=swap)
- **Minimum body size:** 17px on the phone; the lesson card's four lines never go below 17px

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@400;500;600&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

Buttons: the three lesson actions use `.btn-secondary` styling with equal weight. There is no primary call to action on the lesson card; the wearer decides.

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #16A34A;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #4F46E5;
  border: 2px solid #4F46E5;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #EEF2FF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #4F46E5;
  outline: none;
  box-shadow: 0 0 0 3px #4F46E520;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Quiet card

**Keywords:** flat, one card per screen, generous whitespace, 12px radius, single accent, no decoration

**Best For:** a thing you glance at for thirty seconds and put away

**Key Effects:** none by default. A 150ms opacity transition on state change. No confetti, no progress rings, no bounce.

### Screens (v1)

Lugha has no landing page in v1. The web app has five screens, all mobile-first at 375px:

1. **Lesson card** (`/lesson/[id]`): four lines in fixed order, **You said** / **A more natural way** / **Why** / **Try it**, wearer words in the serif face at the top. Three equal-weight actions at the bottom: Got it, Practice later, Not a mistake. Nothing else on screen.
2. **Moments** (`/moments`): reverse-chronological list grouped by day; each row is the wearer's words plus the category; tapping opens the lesson.
3. **Weekly insight** (`/insight`): counts per category with "down from", "new", or "not seen since <date>"; each line tappable to its moments.
4. **Practice later** (`/practice`): the queue, same card.
5. **Settings** (`/settings`): first language (optional), show "not a language issue" moments (default off), notifications.

---

## Anti-Patterns (Do NOT Use)

- ❌ Praise, scores, percentages, streaks, badges, "mastered". Counts and dates only.
- ❌ Red for the learner's own words. A moment is evidence, not an error.
- ❌ Any element that competes with the four lines on the lesson card.
- ❌ Hover-only affordances; the surface is a phone.

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px first; 768px and up must not break
- [ ] Dark mode: every token has a dark value; the card reads on OLED black
- [ ] Tap targets 44px minimum
- [ ] Lesson card under 40 words renders without scrolling at 375x667
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
