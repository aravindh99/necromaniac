# Intro Screen Fix - December 4, 2024

## Problem
The app was stuck on the IntroScreen at the first story line: "In the depths of an abandoned laboratory..."

The intro screen was not progressing through all 5 story lines and never reaching the main app.

## Root Cause
Two issues in `src/components/UI/IntroScreen.jsx`:

1. **Dependency Array Issue**: The `storyLines` array was defined inside the component, causing it to be recreated on every render. Including `storyLines.length` in the `useEffect` dependency array caused the effect to reset continuously.

2. **AnimatePresence Placement**: The `AnimatePresence` was wrapping the entire component instead of just the animated story lines, which could interfere with the transition logic.

## Solution Applied

### 1. Moved Story Lines to Constants
```javascript
// BEFORE (inside component)
const storyLines = [
  "In the depths of an abandoned laboratory...",
  // ...
];

// AFTER (outside component as constant)
const STORY_LINES = [
  "In the depths of an abandoned laboratory...",
  // ...
];
```

### 2. Fixed useEffect Dependencies
```javascript
// BEFORE
useEffect(() => {
  // ...
}, [currentLine, showWarning, onComplete, storyLines.length]);

// AFTER
useEffect(() => {
  // ...
}, [currentLine, showWarning, onComplete]);
```

### 3. Improved AnimatePresence Usage
```javascript
// BEFORE - Wrapped entire component
<AnimatePresence>
  <motion.div>
    {showWarning ? <Warning /> : <Story />}
  </motion.div>
</AnimatePresence>

// AFTER - Only wraps animated story lines
<motion.div>
  {showWarning ? <Warning /> : (
    <AnimatePresence mode="wait">
      <motion.div key={currentLine}>
        <Story />
      </motion.div>
    </AnimatePresence>
  )}
</motion.div>
```

### 4. Added AnimatePresence to App.jsx
Wrapped the IntroScreen in App.jsx with AnimatePresence for proper exit animation:

```javascript
<AnimatePresence>
  {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
</AnimatePresence>
```

## How It Works Now

1. User sees warning screen with "I DARE TO ENTER" button
2. User clicks button → `setShowWarning(false)`
3. useEffect triggers, starts timer for first story line
4. After 2.5 seconds → `setCurrentLine(1)` → shows second line
5. Repeats for all 5 story lines
6. After last line + 1.5 seconds → calls `onComplete()`
7. App.jsx receives callback → `setShowIntro(false)` → shows main app

## Timing
- Warning screen: Until user clicks button
- Each story line: 2.5 seconds
- Final pause: 1.5 seconds
- Total story duration: ~14 seconds (5 lines × 2.5s + 1.5s)

## Files Modified
- `src/components/UI/IntroScreen.jsx` - Fixed timing logic and AnimatePresence
- `src/App.jsx` - Added AnimatePresence wrapper for intro screen

## Build Status
✅ Build successful (5.94s)
✅ No diagnostics errors
✅ Bundle size: ~1.2MB (gzipped ~320KB)

## Testing Checklist
- [ ] Warning screen displays correctly
- [ ] "I DARE TO ENTER" button works
- [ ] All 5 story lines display in sequence
- [ ] Timing is correct (2.5s per line)
- [ ] Transitions are smooth
- [ ] Main app loads after intro completes
- [ ] Jump scares activate after intro
- [ ] Story overlay shows after intro
- [ ] Animated background appears after intro
