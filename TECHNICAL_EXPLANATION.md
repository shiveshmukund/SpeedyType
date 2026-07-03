# SpeedyType Technical Explanation

## Project Overview

`SpeedyType` is a static typing-speed web application built with vanilla HTML, CSS, and JavaScript.
It provides a real-time typing practice experience with live WPM, accuracy, error tracking, theme switching, analytics, and persistence using `localStorage`.

## Files and Responsibilities

- `index.html`
  - Defines the page structure and UI sections.
  - Contains controls for mode, difficulty, timer, language, theme, sound, analytics, and settings.
  - Includes the main typing display, input field, results panel, and modals.

- `styles.css`
  - Manages layout, spacing, colors, theme variables, button styling, and responsive behavior.
  - Defines theme variables for dark, light, hacker, and neon modes.
  - Styles the typing text, highlighted characters, modals, analytics UI, and hover/animation behavior.

- `data.js`
  - Stores typed content for multiple languages and difficulty levels.
  - Exposes `getRandomText(mode, difficulty, language)` for generating practice text.
  - Contains `getRandomQuote(language)` for future or auxiliary display.

- `utils.js`
  - Provides utility objects and helper functions for storage, sound, highlighting, statistics, charts, and theme management.
  - Implements `LocalStorage`, `SoundManager`, `TypingCoach`, `ThemeManager`, and chart drawing.

- `script.js`
  - Orchestrates the application state, event handling, typing logic, timer, results, UI updates, and modal control.
  - Connects the utilities and the data source into the live app experience.

## Core Application State

The app uses a single shared state object called `appState` in `script.js`:

- `originalText` - the generated text the user should type
- `typedText` - what the user has typed so far
- `currentIndex` - current character position
- `timeRemaining` - countdown seconds remaining
- `timerStarted` - whether the timer is active
- `testComplete` - whether test has finished
- `timerId` - interval ID from `setInterval`
- `speedHistory` - recent WPM history for coach consistency
- `startTime` - timestamp when typing began

This state is updated by typing events, timer ticks, text regeneration, and test reset.

## DOM References

`script.js` defines a central `elements` object containing commonly used DOM nodes:

- `displayText`, `typingInput`, `wpmDisplay`, `accuracyDisplay`, `errorsDisplay`, `timerDisplay`
- buttons and controls such as `themeToggle`, `soundToggle`, `analyticsBtn`, `settingsBtn`
- modal references like `settingsModal`, `guideModal`, `analyticsModal`
- settings inputs and the stats container

Keeping DOM references central makes event binding and updates easy and consistent.

## Initialization Flow

### `init()` in `script.js`

`init()` is called when the document finishes loading. It performs:

1. `ThemeManager.initTheme()` - loads the saved theme and applies it.
2. `updateThemeButton()` - updates the theme toggle icon.
3. `SoundManager.init()` - initializes the Web Audio context.
4. `LocalStorage.getSettings()` - reads or falls back to defaults.
5. `updateSettingsUI()` and `applyCurrentSettings()` - sync UI state and apply saved settings.
6. `generateNewText()` - builds the first practice text from `data.js`.
7. `elements.typingInput.focus()` - focuses the typing input field.
8. Shows guide modal if `LocalStorage.shouldShowGuide()` returns true.
9. `setupEventListeners()` - attaches all user event handlers.
10. `updateTimerDisplay()` - reflects the current timer value.

## Event Handling

### `setupEventListeners()`

All main user interactions are wired here:

- `typingInput` → `handleTyping`
- dropdown changes for mode, difficulty, timer, and language
- buttons for theme, sound, analytics, settings, and restart
- settings checkbox toggles for sound, caret, live stats, coach, and guide display
- `document.keydown` → `handleKeyboardShortcuts`
- click outside modals to close them

This keeps behavior modular and easy to reason about.

## Typing Loop and Display

### `handleTyping(event)`

This function is the core typing event handler.

- Reads current input value.
- Starts timer on the first keystroke using `startTimer()`.
- Updates `appState.typedText` and `appState.currentIndex`.
- Plays key sound if sound is enabled.
- Calls `updateDisplay()` and `updateStats()`.
- If typed length matches the whole text, it calls `completeTest()`.

### `updateDisplay()`

This refreshes the visible text output by:

- calling `highlightText(appState.originalText, appState.typedText)`
- calling `createHighlightedHTML(chars, appState.currentIndex)`
- setting `elements.displayText.innerHTML`
- updating the progress bar width

This separation allows text comparison logic to stay reusable and simple.

### `highlightText(originalText, typedText)` in `utils.js`

This helper compares the user input to the target text at each index.

- Builds an array of char objects: `{ char, status }`
- Status values are `correct`, `incorrect`, or `untyped`
- Shows extra typed characters when the user types past the target length

### `createHighlightedHTML(chars, currentIndex)` in `utils.js`

This converts each char object to safe HTML spans:

- correct chars are styled green
- incorrect chars are styled red
- the current active char gets `.current`
- every visible char remains readable with proper escaping

## Statistics Calculation

### `updateStats()` in `script.js`

This updates live score feedback while the test is running.

- calculates elapsed time from `appState.startTime`
- calls `calculateStats(originalText, typedText, elapsedSeconds)`
- updates WPM, accuracy, and errors on-screen
- records speed history for coach analysis
- refreshes typing coach messages periodically

### `calculateStats()` in `utils.js`

Key metric computation logic:

- counts correct and incorrect characters
- counts mistyped keys for later reporting
- extra typed characters are marked incorrect
- total characters typed is `typedText.length`
- WPM formula: `charCount / 5 / (timeInSeconds / 60)`
- accuracy formula: `correctChars / originalText.length * 100`

This function returns a stats object containing:
- `wpm`
- `accuracy`
- `correctChars`
- `incorrectChars`
- `totalTyped`
- `mistypedKeys`
- `errors`

## Timer Management

### `startTimer()`

- avoids duplicate timers
- stores `startTime = Date.now()`
- creates `setInterval()` to decrement `timeRemaining`
- calls `updateTimerDisplay()` each second
- completes the test when time reaches zero

### `stopTimer()`

- clears the interval if running
- resets `appState.timerId` to null

### `updateTimerDisplay()`

- writes the current remaining time to the timer UI
- changes the timer color when 10 seconds or less remain

## Completion and Reset

### `completeTest()`

When the test ends, this function:

- prevents repeated completion
- stops the timer
- disables the input field
- plays the completion sound
- recalculates final stats
- saves results with `LocalStorage.addTestResult()`
- displays the results panel through `showResults()`

### `resetTest()`

This restores a new test state:

- clears input and enables typing
- hides the results panel
- resets timer value from the selected duration
- clears `appState` values
- resets live stats labels and progress bar
- focuses the typing input again

### `restartTest()`

- regenerates text
- resets test state

This is used by the restart button and keyboard shortcuts.

## Text Generation

### `getRandomText(mode, difficulty, language)` in `data.js`

- selects the language dataset: `english` or `hindi`
- picks the requested difficulty level
- for `words`: generates 50–60 random words
- for `sentences`: generates 3–5 random sentences
- for `paragraph`: returns 1–2 random paragraphs

This function is the source of the training text shown on-screen.

## Settings and Persistence

### `LocalStorage` object in `utils.js`

This module abstracts browser storage logic:

- `getStats()` / `saveStats()`
- `addTestResult(result)` updates history, averages, best values, and weak keys
- `getSettings()` / `saveSettings()`
- `getTheme()` / `saveTheme()`
- `shouldShowGuide()` / `setGuideShown()`
- `clearAll()` wipes saved settings and stats

### `applyCurrentSettings()` in `script.js`

- loads saved settings
- updates sound state via `SoundManager`
- updates the sound button icon
- applies caret visibility, live stats visibility, and coach enabling

### `updateSettingsUI()`

- mirrors saved settings back into the modal checkboxes

### Modal behavior

- `openSettings()` / `closeSettings()`
- `closeGuideModal()` hides the guide and persists the "don't show again" checkbox
- `openAnalytics()` / `closeAnalytics()`

## Theme and Sound

### `ThemeManager` in `utils.js`

- contains theme names and the list of available themes
- `setTheme(theme)` clears existing classes and applies the selected theme class
- `getTheme()` reads the saved theme
- `initTheme()` applies the previously saved theme on load
- `toggleTheme()` cycles through all available themes

### `toggleTheme()` in `script.js`

- invokes `ThemeManager.toggleTheme()` and updates the theme icon

### `SoundManager` in `utils.js`

- initializes a `window.AudioContext`
- produces sounds for keypress, errors, and completion
- uses oscillator nodes with gain envelopes
- supports enabling/disabling sound

## Analytics and Charting

### `updateAnalytics()` in `script.js`

- retrieves stats from `LocalStorage.getStats()`
- updates dashboard cards: best WPM, average WPM, best accuracy, total tests
- draws WPM and accuracy charts if history exists
- renders weak key list

### `drawLineChart(canvasId, data, maxValue)` in `utils.js`

- uses plain Canvas 2D rendering
- draws grid lines, axis lines, line graph points, and labels
- styles according to current theme colors

### `getTopWeakKeys(weakKeys, limit)` in `utils.js`

- converts weak key counts into a sorted list
- used by results and analytics screens

## Typing Coach and Feedback

### `TypingCoach` in `utils.js`

- returns a motivational message based on:
  - current WPM
  - accuracy
  - consistency of speed
- `getConsistencyScore(speedHistory)` computes a normalized rhythm score
- the coach text is updated periodically in `updateStats()`

## Keyboard Shortcuts

### `handleKeyboardShortcuts(event)` in `script.js`

Supported shortcuts:
- `Tab` → restart the test if no modal is open
- `Esc` → close open modals or open settings if none are open
- `Ctrl+R` → generate a new test
- `Ctrl+I` → open or close analytics dashboard

## Component Connections

### High-level flow

1. User loads the page.
2. `init()` builds the initial UI state and text.
3. User selects mode/difficulty/time/language.
4. `generateNewText()` fetches text from `data.js`.
5. User types into `typingInput`.
6. `handleTyping()` updates state, UI, and stats.
7. `updateStats()` uses `calculateStats()` and `TypingCoach`.
8. `updateDisplay()` uses `highlightText()` and `createHighlightedHTML()`.
9. Timer ticks call `updateTimerDisplay()` and eventually `completeTest()`.
10. `completeTest()` saves results via `LocalStorage.addTestResult()`.
11. Results and analytics are rendered from stored history.

### Why this structure works

- `data.js` is purely content generation.
- `utils.js` provides reusable business logic, storage, sound, theme, and chart helpers.
- `script.js` handles app orchestration, state, and user interaction.
- UI is kept separate from business logic, making it easier to reason about and modify.

## Deployment Notes

- This is a static app and does not require a server.
- Deployment targets include GitHub Pages, Netlify, Vercel, or any static host.
- Required files for deployment:
  - `index.html`
  - `styles.css`
  - `script.js`
  - `utils.js`
  - `data.js`

## How to Explain This in an Interview

1. Start with what the app does.
2. Describe the architecture by file responsibility.
3. Explain the typing loop and how state flows through `appState`.
4. Show how user settings persist with `localStorage`.
5. Mention clean separation between UI, data, and logic.
6. Highlight additional features like analytics, theming, and sound.
7. End with why this is ready to deploy.

---

### Function Map Summary

- `init()` → app startup
- `setupEventListeners()` → interaction wiring
- `handleTyping()` → typing event flow
- `updateDisplay()` → rendered text highlight
- `updateStats()` → real-time metrics
- `startTimer()` / `stopTimer()` → timer control
- `completeTest()` → end-of-test workflow
- `resetTest()` / `restartTest()` → reset logic
- `generateNewText()` → new practice text
- `openAnalytics()` / `closeAnalytics()` → dashboard modal
- `updateAnalytics()` → analytics refresh
- `toggleTheme()` / `toggleSound()` → UI controls
- `applyCurrentSettings()` → persisted settings
- `LocalStorage` → persistence layer
- `SoundManager` → audio feedback
- `ThemeManager` → theme application
- `TypingCoach` → feedback messages
- `drawLineChart()` → canvas analytics chart
- `getRandomText()` → content generation
