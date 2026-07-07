# SpeedyType - Interactive Typing Speed Test 🚀 

[![GitHub stars](https://img.shields.io/github/stars/shiveshmukund/speedytype?style=flat-square)](https://github.com/shiveshmukund/speedytype/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Made with Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e?style=flat-square)](https://github.com/shiveshmukund/speedytype)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/shiveshmukund/speedytype/pulls)

**🔗 Live demo:** [shiveshmukund.github.io/speedytype](https://shiveshmukund.github.io/SpeedyType/)

> ⭐ **If SpeedyType helps you type faster, please consider starring the repo** — it helps other people discover the project and takes two seconds.

A modern, feature-rich typing speed test web application built with vanilla HTML, CSS, and JavaScript. Practice typing, measure your speed, analyze accuracy, and improve your skills with real-time analytics and interactive features.

## ✨ Features

### Core Typing Features
- **Real-time Typing Detection** - Instant character-by-character feedback
- **Character Highlighting System** - Visual feedback with color coding:
  - 🟢 **Green** for correct characters
  - 🔴 **Red** for incorrect characters
  - 🔵 **Cyan** for current/active character position
- **Animated Cursor** - Smooth blinking caret showing typing position
- **Live Progress Bar** - Visual progress indication during typing

### Performance Metrics
- **WPM (Words Per Minute)** - Real-time typing speed calculation
  - Formula: `(Total Characters ÷ 5) ÷ (Time in Minutes)`
- **Accuracy Percentage** - Typing accuracy tracking
  - Formula: `(Correct Characters ÷ Total Characters) × 100`
- **Error Counter** - Track mistyped characters and mistakes
- **Character Statistics** - Detailed breakdown of typed, correct, and incorrect characters

### Typing Modes
- **Words Mode** - Type individual words for speed training
- **Sentences Mode** - Complete sentences for rhythm and flow practice
- **Paragraph Mode** - Full paragraphs for endurance training

### Difficulty Levels
- **Beginner** - Short words, easy vocabulary, minimal punctuation
- **Intermediate** - Longer words, moderate punctuation, medium difficulty
- **Advanced** - Complex words, punctuation, numbers, symbols, difficult vocabulary

### Timer System
- **Smart Start** - Timer begins on first keystroke
- **Multiple Durations**:
  - 15 seconds (Quick practice)
  - 30 seconds (Short test)
  - 60 seconds (Standard test) - *Default*
  - 120 seconds (Extended challenge)
- **Automatic Completion** - Test auto-completes when time runs out
- **Warning Colors** - Timer text changes color when ≤10 seconds remain

### Theme System - 4 Beautiful Themes
1. **Dark Mode** 🌙 (Default) - Modern dark interface with cyan accents
2. **Light Mode** ☀️ - Clean bright interface for daytime use
3. **Hacker Mode** 👾 - Terminal-style green-on-black aesthetic
4. **Neon Mode** 🌈 - Futuristic cyan and magenta glowing design

### Statistics & Analytics
- **LocalStorage Integration** - Persistent data storage without server
- **Statistics Dashboard** - View your typing history and trends
- **Speed Trends** - Visual chart of WPM changes over time
- **Accuracy Trends** - Track accuracy improvements
- **Weak Key Analysis** - Identify frequently mistyped letters
- **Best/Average WPM** - Career statistics tracking
- **Test History** - Complete record of all typing tests

### Typing Coach 🎓
- **Smart Feedback** - Real-time coaching messages based on:
  - Current typing speed
  - Accuracy level
  - Typing consistency
- **Motivational Messages** - Encouraging feedback like:
  - "Keep practicing! You're building muscle memory."
  - "Excellent! You're typing at a professional level."
  - "Outstanding! You're a typing speed demon!"

### Sound System 🔊
- **Optional Audio Feedback**:
  - 🎵 Keypress sound on each keystroke
  - ⚠️ Error sound on incorrect typing
  - 🎉 Completion sound when test finishes
- **Easy Toggle** - Enable/disable sounds in settings

### Hand Position Training
- **Interactive Typing Guide Popup** - Shows on first visit
- **Finger Mapping** - Visual guide for each finger's keyboard keys
- **Correct Finger Positions** - Home row (ASDF-JKL;) highlighted
- **Typing Posture Tips** - Best practices for comfortable typing
- **One-Time Popup** - Option to disable for returning users

### UI/UX Features
- **Responsive Design** - Works perfectly on:
  - Desktop computers
  - Tablets
  - Mobile devices (optimized layout)
- **Smooth Animations** - Professional transitions and effects
- **Hover Effects** - Interactive feedback on buttons and controls
- **Modal Dialogs** - Settings and analytics in beautiful popups

### Keyboard Shortcuts
- **Tab** - Restart current test immediately
- **Esc** - Toggle settings modal
- **Ctrl+R** - Generate new test with fresh text
- **Ctrl+I** - Open analytics dashboard

### Language Support
- **English** - Full English word lists and sentences
- **Hindi** - Complete Hindi text support with native characters

### Results Screen
- **Comprehensive Results** - Shows all performance metrics
- **Error Analysis** - Top mistyped characters with error counts
- **Weak Key Identification** - Most problematic keys
- **Quick Restart** - "Start New Test" button for immediate retry

## 🎨 Design Highlights

- **Modern Interface** - Clean, professional, polished design
- **Dark Mode Default** - Comfortable on the eyes with vibrant cyan accents
- **Glowing Effects** - Neon-style borders and shadows in matching themes
- **Gradient Buttons** - Modern gradient design for action buttons
- **Professional Color Scheme** - Carefully selected colors for accessibility
- **Smooth Transitions** - All changes animate smoothly (0.2-0.5s)

## 📱 Responsive Breakpoints

- **Desktop** (1024px+) - Full-featured layout
- **Tablet** (768px-1023px) - Optimized control placement
- **Mobile** (480px-767px) - Stacked layout, adjusted font sizes
- **Small Mobile** (<480px) - Compact everything

## 🗂️ Project Structure

```
SpeedyType/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling (all themes)
├── script.js           # Main application logic
├── utils.js            # Utility functions and helpers
├── data.js             # Text content and word lists
└── README.md           # This file
```

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables for theming
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Web Audio API** - Sound synthesis for audio feedback
- **LocalStorage** - Client-side persistent data storage
- **HTML5 Canvas** - Chart rendering for analytics

### Key Functions

#### Core Typing
- `handleTyping()` - Process user input
- `updateDisplay()` - Highlight characters in real-time
- `updateStats()` - Calculate WPM, accuracy, errors
- `calculateStats()` - Compute final statistics

#### Timer Management
- `startTimer()` - Begin countdown
- `stopTimer()` - Stop the timer
- `completeTest()` - End test and show results

#### Theme System
- `ThemeManager.setTheme()` - Apply theme globally
- `ThemeManager.toggleTheme()` - Cycle through themes
- `ThemeManager.initTheme()` - Load saved theme on startup

#### Statistics
- `LocalStorage.addTestResult()` - Save test data
- `LocalStorage.getStats()` - Retrieve statistics
- `getTopWeakKeys()` - Identify problem keys

#### Text Generation
- `getRandomText()` - Generate mode-based text
- `highlightText()` - Create character status array
- `createHighlightedHTML()` - Render highlighted text

## 💾 LocalStorage Data Structure

```javascript
{
  // Statistics
  bestWPM: 85,
  avgWPM: 62,
  totalTests: 24,
  bestAccuracy: 98,
  
  // Test History (last 100 tests)
  testHistory: [
    { wpm: 75, accuracy: 95, errors: 3, timestamp: 1234567890 }
  ],
  
  // Weak Keys Tracking
  weakKeys: {
    'e': 5,
    'r': 3,
    'p': 2
  },
  
  // Settings
  soundEnabled: true,
  caretVisible: true,
  liveStatsVisible: true,
  coachEnabled: true
}
```

## 🎯 How to Use

1. **Start** - Open `index.html` in a web browser
2. **Configure** - Select typing mode, difficulty, timer, and language
3. **Read Guide** - Review the typing position guide (first time only)
4. **Type** - Start typing the displayed text
5. **Monitor** - Watch live stats update as you type
6. **Complete** - Test auto-completes when timer ends
7. **Review** - Check your results and error analysis
8. **Practice** - Click "Start New Test" or press Tab to retry

## ⚙️ Customization

### Modify Text Content
Edit `data.js` to add or change:
- Word lists for each difficulty level
- Sentences for practice
- Paragraphs for endurance
- Quotes for variety

### Adjust Timing
In `script.js`, modify `appState.timeRemaining` initialization and timer options in the HTML.

### Change Colors
In `styles.css`, edit the CSS variables at the root:
```css
:root {
    --accent-primary: #00d4ff;  /* Cyan */
    --accent-secondary: #ff006e; /* Magenta */
    --success: #00ff00;           /* Green */
    --error: #ff0000;             /* Red */
}
```

## 📊 Browser Support

- **Chrome/Edge** - Full support
- **Firefox** - Full support
- **Safari** - Full support (macOS & iOS)
- **Mobile Browsers** - Optimized for all modern mobile browsers

## 🚀 Performance

- **Lightweight** - Pure vanilla JavaScript, no dependencies
- **Fast Loading** - Single page, ~50KB total (including CSS)
- **Smooth Animation** - 60 FPS animations
- **Efficient Calculations** - Optimized stat calculations

## 🎓 Learning Features

### For Beginners
- Start with "Beginner" difficulty
- 15-30 second tests for quick practice
- Use the typing guide to learn proper hand position

### For Intermediate Typists
- Switch to "Intermediate" difficulty
- Try "Sentences" mode for better flow
- Use 60-second tests for consistent practice

### For Advanced Users
- Challenge yourself with "Advanced" difficulty
- Use "Paragraph" mode for endurance
- Track weak keys and focus practice on problem areas

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No sounds | Enable in settings (check sound checkbox) |
| Theme not saving | Clear LocalStorage and refresh |
| Stats reset | Don't clear in settings unless you want to reset |
| Timer too fast | Refresh page, may be browser tab issue |
| Text overlapping | Zoom out slightly or use responsive design |

## 📈 Statistics Insights

- **WPM Trends** - Monitor if your speed is improving over time
- **Accuracy Patterns** - Identify accuracy trends
- **Weak Keys** - Focus practice on your most mistyped letters
- **Consistency** - Typing coach helps you maintain steady pace

## 🎉 Version 1.0 Features

✅ Real-time typing detection
✅ Character highlighting system
✅ WPM and accuracy calculation
✅ Multiple typing modes (words, sentences, paragraphs)
✅ Difficulty levels
✅ Timer system with auto-completion
✅ 4 beautiful themes
✅ Statistics tracking with charts
✅ Analytics dashboard
✅ Sound effects
✅ Typing coach with AI-like feedback
✅ Keyboard shortcuts
✅ Responsive design
✅ Hand position training guide
✅ Weak key analysis
✅ Multi-language support (English, Hindi)
✅ LocalStorage persistence

## 🔮 Future Enhancements

- User accounts and cloud sync
- Multiplayer typing races
- Leaderboards
- Custom word lists
- Typing tests from famous quotes
- Export statistics as PDF
- More languages
- Typing games and challenges

## 🚀 Deployment

This project is a fully static web application and is ready to deploy to any static hosting provider — no build step required.

**GitHub Pages** (recommended, free):
1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` folder, then **Save**.
4. Your site will be live at `https://shiveshmukund.github.io/speedytype/` within a minute or two.

**Netlify**: connect the repo, set the publish directory to `.` and leave the build command empty (already configured in `netlify.toml`).

**Vercel**: import the repo and deploy as a static site with the root directory.

Local preview:
```bash
npm install
npm start
```
Then open `http://localhost:8000`.

All app files are included in the repository root:
`index.html`, `styles.css`, `script.js`, `utils.js`, `data.js`.

## 🤝 Contributing

Issues and pull requests are welcome! If you spot a bug or have an idea for a feature, please [open an issue](https://github.com/shiveshmukund/speedytype/issues).

## 📝 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute for personal and educational use.

## 🙌 Credits

Built as a comprehensive typing practice application inspired by professional platforms like Monkeytype and Keybr, with unique features like Indian language support, advanced analytics, and an intelligent typing coach.

If this project helped you, a ⭐ on the repo goes a long way — thank you!

---

**Happy Typing! Keep improving your skills with SpeedyType! 🎯**
