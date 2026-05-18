/* ===========================
   UTILITY FUNCTIONS
   =========================== */

/**
 * LOCAL STORAGE UTILITIES
 */

const LocalStorage = {
  // Keys
  STATS_KEY: "speedytype_stats",
  SETTINGS_KEY: "speedytype_settings",
  THEME_KEY: "speedytype_theme",
  SHOW_GUIDE_KEY: "speedytype_show_guide",

  // Get all stats
  getStats() {
    const stats = localStorage.getItem(this.STATS_KEY);
    return stats
      ? JSON.parse(stats)
      : {
          bestWPM: 0,
          avgWPM: 0,
          totalTests: 0,
          testHistory: [],
          bestAccuracy: 0,
          weakKeys: {},
          commonMistakes: {},
        };
  },

  // Save stats
  saveStats(stats) {
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  },

  // Add test result
  addTestResult(result) {
    const stats = this.getStats();
    stats.testHistory.push({
      wpm: result.wpm,
      accuracy: result.accuracy,
      errors: result.errors,
      timestamp: Date.now(),
      duration: result.duration,
    });

    // Keep only last 100 tests
    if (stats.testHistory.length > 100) {
      stats.testHistory = stats.testHistory.slice(-100);
    }

    // Update aggregate stats
    stats.totalTests = stats.testHistory.length;
    stats.bestWPM = Math.max(stats.bestWPM, result.wpm);
    stats.bestAccuracy = Math.max(stats.bestAccuracy, result.accuracy);

    const totalWPM = stats.testHistory.reduce((sum, test) => sum + test.wpm, 0);
    stats.avgWPM = Math.round(totalWPM / stats.testHistory.length);

    // Track weak keys
    if (result.mistypedKeys) {
      Object.keys(result.mistypedKeys).forEach((key) => {
        stats.weakKeys[key] =
          (stats.weakKeys[key] || 0) + result.mistypedKeys[key];
      });
    }

    this.saveStats(stats);
    return stats;
  },

  // Get settings
  getSettings() {
    const settings = localStorage.getItem(this.SETTINGS_KEY);
    return settings
      ? JSON.parse(settings)
      : {
          soundEnabled: true,
          caretVisible: true,
          liveStatsVisible: true,
          coachEnabled: true,
        };
  },

  // Save settings
  saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  },

  // Get theme
  getTheme() {
    return localStorage.getItem(this.THEME_KEY) || "dark-mode";
  },

  // Save theme
  saveTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
  },

  // Check if guide should show
  shouldShowGuide() {
    const shown = localStorage.getItem(this.SHOW_GUIDE_KEY);
    return shown !== "false";
  },

  // Set guide as shown
  setGuideShown() {
    localStorage.setItem(this.SHOW_GUIDE_KEY, "false");
  },

  // Clear all data
  clearAll() {
    localStorage.removeItem(this.STATS_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
    localStorage.removeItem(this.THEME_KEY);
    localStorage.removeItem(this.SHOW_GUIDE_KEY);
  },
};

/**
 * SOUND UTILITIES
 */

const SoundManager = {
  enabled: true,
  audioContext: null,

  init() {
    try {
      // Create audio context for sound synthesis
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  },

  setEnabled(enabled) {
    this.enabled = enabled;
  },

  playKeySound() {
    if (!this.enabled || !this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.value = 800;
      osc.type = "sine";

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn("Could not play key sound");
    }
  },

  playErrorSound() {
    if (!this.enabled || !this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.value = 300;
      osc.type = "square";

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("Could not play error sound");
    }
  },

  playCompleteSound() {
    if (!this.enabled || !this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      const notes = [1046.5, 1318.5, 1568.0]; // C6, E6, G6

      notes.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.value = freq;
        osc.type = "sine";

        const startTime = now + index * 0.1;
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch (e) {
      console.warn("Could not play complete sound");
    }
  },
};

/**
 * TEXT FORMATTING UTILITIES
 */

function splitUnicodeCharacters(text) {
  if (!text) return [];

  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return Array.from(
      new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text),
      (segment) => segment.segment,
    );
  }

  return text.match(/\P{Mark}\p{Mark}*/gu) || [];
}

function highlightText(originalText, typedText) {
  const chars = [];
  const originalChars = splitUnicodeCharacters(originalText);
  const typedChars = splitUnicodeCharacters(typedText);
  const maxLength = Math.max(originalChars.length, typedChars.length);

  for (let i = 0; i < maxLength; i++) {
    const originalChar = originalChars[i] || "";
    const typedChar = typedChars[i] || "";

    let status = "untyped";
    let charToShow = originalChar;

    if (i < typedChars.length) {
      if (typedChar === originalChar) {
        status = "correct";
      } else {
        status = "incorrect";
      }

      // Show the typed character when the user exceeds the target text length.
      if (!originalChar && typedChar) {
        charToShow = typedChar;
      }
    }

    chars.push({
      char: charToShow,
      status: status,
    });
  }

  return chars;
}

function createHighlightedHTML(chars, currentIndex) {
  return chars
    .map((charObj, index) => {
      let className = `char`;

      // Highlight from index 0 to currentIndex continuously
      if (index <= currentIndex) {
        if (charObj.status === "correct") {
          className += " correct";
        } else if (charObj.status === "incorrect") {
          className += " incorrect";
        } else {
          className += " highlighted";
        }

        // Mark current position with special styling
        if (index === currentIndex) {
          className += " current";
        }
      }

      const char =
        charObj.char === " "
          ? "&nbsp;"
          : charObj.char.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<span class="${className}">${char}</span>`;
    })
    .join("");
}

/**
 * STATISTICS UTILITIES
 */

function calculateWPM(charCount, timeInSeconds) {
  if (timeInSeconds === 0) return 0;
  return Math.round(charCount / 5 / (timeInSeconds / 60));
}

function calculateAccuracy(correctChars, totalChars) {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

function calculateStats(originalText, typedText, timeInSeconds) {
  const originalChars = splitUnicodeCharacters(originalText);
  const typedChars = splitUnicodeCharacters(typedText);
  let correctChars = 0;
  let incorrectChars = 0;
  const mistypedKeys = {};

  const minLength = Math.min(originalChars.length, typedChars.length);

  for (let i = 0; i < minLength; i++) {
    if (originalChars[i] === typedChars[i]) {
      correctChars++;
    } else {
      incorrectChars++;
      const expectedChar = originalChars[i];
      mistypedKeys[expectedChar] = (mistypedKeys[expectedChar] || 0) + 1;
    }
  }

  // Count extra typed grapheme clusters as incorrect
  if (typedChars.length > originalChars.length) {
    incorrectChars += typedChars.length - originalChars.length;
  }

  const totalTyped = typedChars.length;
  const wpm = calculateWPM(totalTyped, timeInSeconds);
  const accuracy = calculateAccuracy(correctChars, originalChars.length);

  return {
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    totalChars: originalChars.length,
    totalTyped,
    mistypedKeys,
    errors: incorrectChars,
  };
}

/**
 * FORMATTING UTILITIES
 */

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getTopWeakKeys(weakKeys, limit = 10) {
  return Object.entries(weakKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({
      key: key === " " ? "space" : key,
      count,
      rawKey: key,
    }));
}

/**
 * TYPING COACH UTILITIES
 */

const TypingCoach = {
  getCoachMessage(wpm, accuracy, consistencyScore) {
    const messages = [];

    if (wpm < 40) {
      messages.push("💪 Keep practicing! You're building muscle memory.");
    } else if (wpm < 60) {
      messages.push("📈 Good progress! You're getting faster.");
    } else if (wpm < 80) {
      messages.push("⚡ Excellent! You're typing at a professional level.");
    } else {
      messages.push("🚀 Outstanding! You're a typing speed demon!");
    }

    if (accuracy < 90) {
      messages.push("🎯 Focus on accuracy for better results.");
    } else if (accuracy < 95) {
      messages.push("✨ Great accuracy! Almost perfect!");
    } else if (accuracy === 100) {
      messages.push("🏆 Perfect accuracy! Flawless typing!");
    }

    if (consistencyScore > 0.9) {
      messages.push("🎼 Your typing rhythm is very consistent!");
    } else if (consistencyScore > 0.7) {
      messages.push("🎵 Work on maintaining steady typing pace.");
    }

    return messages[Math.floor(Math.random() * messages.length)];
  },

  getConsistencyScore(speedHistory) {
    if (speedHistory.length < 2) return 1;

    const avg = speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    let variance = 0;

    for (let speed of speedHistory) {
      variance += Math.pow(speed - avg, 2);
    }

    variance = variance / speedHistory.length;
    const stdDev = Math.sqrt(variance);

    // Calculate score (lower variance = higher score)
    return Math.max(0, 1 - stdDev / avg);
  },
};

/**
 * THEME UTILITIES
 */

const ThemeManager = {
  themes: ["dark-mode", "light-mode", "hacker-mode", "neon-mode"],
  themeNames: {
    "dark-mode": "Dark Mode",
    "light-mode": "Light Mode",
    "hacker-mode": "Hacker Mode",
    "neon-mode": "Neon Mode",
  },

  setTheme(theme) {
    // Remove all theme classes
    this.themes.forEach((t) => document.documentElement.classList.remove(t));

    // Add selected theme
    if (theme !== "dark-mode") {
      document.documentElement.classList.add(theme);
    }

    LocalStorage.saveTheme(theme);
  },

  getTheme() {
    return LocalStorage.getTheme();
  },

  initTheme() {
    const theme = this.getTheme();
    this.setTheme(theme);
  },

  toggleTheme() {
    const current = this.getTheme();
    const nextIndex = (this.themes.indexOf(current) + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex]);
    return this.themes[nextIndex];
  },
};

/**
 * CHART UTILITIES (for canvas charting)
 */

function drawLineChart(canvasId, data, maxValue = 100) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 250;

  const padding = 30;
  const width = canvas.width - 2 * padding;
  const height = canvas.height - 2 * padding;

  if (data.length === 0) {
    ctx.fillStyle = "#999";
    ctx.fillText("No data available", padding + 20, padding + height / 2);
    return;
  }

  const computedStyle = getComputedStyle(document.documentElement);
  const textColor = computedStyle.getPropertyValue("--text-primary").trim();
  const accentColor = computedStyle.getPropertyValue("--accent-primary").trim();
  const borderColor = computedStyle.getPropertyValue("--border-color").trim();

  // Draw grid lines
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + width, y);
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + height);
  ctx.lineTo(padding + width, padding + height);
  ctx.stroke();

  // Draw line
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  const pointSpacing = width / (data.length - 1 || 1);

  data.forEach((value, index) => {
    const x = padding + index * pointSpacing;
    const y = padding + height - (value / maxValue) * height;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw points
  ctx.fillStyle = accentColor;
  data.forEach((value, index) => {
    const x = padding + index * pointSpacing;
    const y = padding + height - (value / maxValue) * height;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Draw labels
  ctx.fillStyle = textColor;
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";

  // Y-axis labels
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((maxValue / 5) * i);
    const y = padding + height - (height / 5) * i;
    ctx.fillText(value.toString(), padding - 20, y + 4);
  }
}

/**
 * EVENT UTILITIES
 */

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
