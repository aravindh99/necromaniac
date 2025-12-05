# Horror Theme Design System

## Visual Identity

This project creates a **dark, unsettling atmosphere** inspired by:
- Classic horror films (The Ring, Silent Hill)
- Modern horror games (Resident Evil, Dead Space)
- 90s found footage aesthetic

## Color System

### Primary Palette
```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;        /* Nearly pure black */
  --bg-secondary: #1a1a1a;      /* Slightly lighter */
  --bg-tertiary: #2a2a2a;       /* Hover states */
  
  /* Blood Theme */
  --blood-dark: #8b0000;        /* Dark blood red */
  --blood-bright: #ff0000;      /* Fresh blood */
  --blood-glow: rgba(139, 0, 0, 0.8);
  
  /* Toxic Theme */
  --toxic-green: #00ff00;       /* Bright radioactive */
  --toxic-dim: #00aa00;         /* Dimmer version */
  --toxic-glow: rgba(0, 255, 0, 0.6);
  
  /* Ghost Theme */
  --ghost-purple: #6600ff;      /* Deep purple */
  --ghost-blue: #0066ff;        /* Cold blue */
  
  /* Text */
  --text-primary: #e0e0e0;      /* Main text */
  --text-secondary: #888888;    /* Subtle text */
  --text-danger: #ff0000;       /* Errors/warnings */
}
```

### Color Usage Rules

**Backgrounds**: Always start with `--bg-primary`, layer effects on top
**Primary Actions**: Use `--blood-dark` for buttons, links
**Warnings/Errors**: Use `--text-danger` or `--blood-bright`
**Success States**: Use `--toxic-green` sparingly
**Disabled States**: Use `--text-secondary` with 50% opacity

## Typography

### Font Stack
```css
/* Headings - Creepy/Horror */
--font-heading: 'Creepster', 'Nosifer', cursive;

/* Body - Readable Monospace */
--font-body: 'Roboto Mono', 'Courier New', monospace;

/* UI Elements - Clean Sans */
--font-ui: 'Inter', -apple-system, system-ui, sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px - Captions */
--text-sm: 0.875rem;   /* 14px - Small UI */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-xl: 1.25rem;    /* 20px - Subheadings */
--text-2xl: 1.5rem;    /* 24px - Headings */
--text-3xl: 1.875rem;  /* 30px - Large headings */
--text-4xl: 2.25rem;   /* 36px - Hero text */
--text-5xl: 3rem;      /* 48px - Title */
```

### Text Effects
```css
/* Glitch Text */
.glitch-text {
  font-family: var(--font-heading);
  color: var(--blood-bright);
  text-shadow: 
    2px 2px 0 var(--toxic-green),
    -2px -2px 0 var(--ghost-blue);
  animation: glitch 0.3s infinite;
}

/* Blood Drip Text */
.blood-text {
  color: var(--blood-dark);
  filter: drop-shadow(0 0 10px var(--blood-glow));
  font-family: var(--font-heading);
}
```

## Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## Effects Library

### 1. Screen Glitch
```javascript
const glitchKeyframes = `
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }
`;
```

Trigger: Every 8-15 seconds (random)
Duration: 0.3s

### 2. Blood Splatter
- Appears on user clicks
- 50-100 particles per splatter
- Red (#8b0000) to dark red (#4a0000) gradient
- Fade out over 2 seconds
- Physics-based trajectories

### 3. Vignette Pulse
```css
.vignette {
  position: fixed;
  inset: 0;
  background: radial-gradient(
    circle,
    transparent 40%,
    rgba(0, 0, 0, 0.8) 100%
  );
  animation: pulse 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}
```

### 4. Chromatic Aberration
```css
.chromatic {
  position: relative;
}

.chromatic::before {
  content: attr(data-text);
  position: absolute;
  left: -2px;
  color: #ff0000;
  mix-blend-mode: screen;
}

.chromatic::after {
  content: attr(data-text);
  position: absolute;
  left: 2px;
  color: #00ffff;
  mix-blend-mode: screen;
}
```

Apply on hover for interactive elements

### 5. Film Grain
```javascript
// Canvas-based noise overlay
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// Generate noise pattern...
// Apply as background with 5% opacity
```

### 6. Scanlines
```css
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
}
```

## Animation Timing

All animations use these standards:
```javascript
const TIMING = {
  instant: 0,
  fast: 150,      // Quick feedback
  normal: 300,    // Default
  slow: 500,      // Dramatic
  crawl: 1000,    // Suspenseful
};

const EASING = {
  default: 'ease-out',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 2)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
};
```

## Button Styles
```css
.horror-button {
  background: var(--blood-dark);
  color: var(--text-primary);
  border: 2px solid var(--blood-bright);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease-out;
  position: relative;
  overflow: hidden;
}

.horror-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: var(--blood-bright);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
  z-index: -1;
}

.horror-button:hover::before {
  width: 100%;
  height: 100%;
}

.horror-button:hover {
  box-shadow: 0 0 20px var(--blood-glow);
  transform: scale(1.05);
}

.horror-button:active {
  transform: scale(0.95);
}
```

## Loading States
```javascript
// Creepy loading messages (rotate randomly)
const LOADING_MESSAGES = [
  "Awakening the dead...",
  "Summoning darkness...",
  "Collecting souls...",
  "Brewing nightmares...",
  "Disturbing the grave...",
"Opening the portal...",
];

Loading spinner should use blood-red color with glow effect.

## Error States
```javascript
// Horror-themed error messages
const ERROR_MESSAGES = {
  model_load: "💀 The dead refuse to rise...",
  network: "🕸️ Connection severed...",
  audio: "🔇 Silence fills the void...",
  general: "👻 Something wicked happened...",
};
```

## Sound Design

### Volume Levels
```javascript
const AUDIO_VOLUME = {
  ambient: 0.2,      // Background atmosphere
  footsteps: 0.4,    // Zombie movement
  effects: 0.6,      // UI interactions
  jumpscares: 0.8,   // Maximum impact
};
```

### Trigger Rules
- **Never** auto-play audio (browser policy)
- **Always** require user interaction first
- **Fade in** ambient sounds over 2 seconds
- **Spatial audio** for 3D positioned zombies
- **Mute button** must be prominent

## Accessibility Considerations

Despite horror theme, maintain accessibility:
```css
/* Focus indicators - visible but themed */
*:focus {
  outline: 2px solid var(--blood-bright);
  outline-offset: 2px;
}

/* Ensure text contrast > 4.5:1 */
--text-primary: #e0e0e0;  /* Passes WCAG AA */

/* Provide alternatives for effects */
@media (prefers-reduced-motion) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Mobile Adaptations

On mobile devices (< 768px):
- Reduce particle counts by 50%
- Disable complex shaders
- Simplify glitch effects
- Increase touch targets to 44x44px minimum
- Disable spatial audio (use stereo)

## Seizure Warning

Required for flashing effects:
```jsx
<WarningModal>
  <h2>⚠️ Warning</h2>
  <p>
    This experience contains flashing lights, rapid movements,
    and visual distortions that may trigger seizures in people
    with photosensitive epilepsy.
  </p>
  <p>Viewer discretion is advised.</p>
  <button>I Understand</button>
</WarningModal>
```

## UI Component Examples

### Card
```css
.horror-card {
  background: var(--bg-secondary);
  border: 1px solid var(--blood-dark);
  padding: var(--space-6);
  transition: all 0.3s ease-out;
}

.horror-card:hover {
  border-color: var(--blood-bright);
  box-shadow: 0 4px 20px var(--blood-glow);
  transform: translateY(-4px);
}
```

### Input
```css
.horror-input {
  background: var(--bg-primary);
  border: 2px solid var(--blood-dark);
  color: var(--text-primary);
  padding: var(--space-3);
  font-family: var(--font-body);
}

.horror-input:focus {
  border-color: var(--blood-bright);
  box-shadow: 0 0 10px var(--blood-glow);
}
```

---

When asking Kiro to create UI components, reference this document:

"Following horror-theme.md, create a button component with blood glow effect..."