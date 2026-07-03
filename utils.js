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

  safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  },

  safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (_error) {
      return false;
    }
  },

  safeRemoveItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (_error) {
      return false;
    }
  },

  safeParse(value, fallback) {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch (_error) {
      return fallback;
    }
  },

  getStats() {
    const stats = this.safeGetItem(this.STATS_KEY);
    return this.safeParse(stats, {
      bestWPM: 0,
      avgWPM: 0,
      totalTests: 0,
      testHistory: [],
      bestAccuracy: 0,
      weakKeys: {},
      commonMistakes: {},
    });
  },

  saveStats(stats) {
    this.safeSetItem(this.STATS_KEY, JSON.stringify(stats));
  },

  addTestResult(result) {
    const stats = this.getStats();
    stats.testHistory.push({
      wpm: result.wpm,
      accuracy: result.accuracy,
      errors: result.errors,
      timestamp: Date.now(),
      duration: result.duration,
    });

    if (stats.testHistory.length > 100) {
      stats.testHistory = stats.testHistory.slice(-100);
    }

    stats.totalTests = stats.testHistory.length;
    stats.bestWPM = Math.max(stats.bestWPM || 0, result.wpm);
    stats.bestAccuracy = Math.max(stats.bestAccuracy || 0, result.accuracy);

    const totalWPM = stats.testHistory.reduce((sum, test) => sum + test.wpm, 0);
    stats.avgWPM = stats.testHistory.length
      ? Math.round(totalWPM / stats.testHistory.length)
      : 0;

    if (result.mistypedKeys) {
      Object.keys(result.mistypedKeys).forEach((key) => {
        stats.weakKeys[key] =
          (stats.weakKeys[key] || 0) + result.mistypedKeys[key];
      });
    }

    this.saveStats(stats);
    return stats;
  },

  getSettings() {
    const settings = this.safeGetItem(this.SETTINGS_KEY);
    return this.safeParse(settings, {
      soundEnabled: true,
      caretVisible: true,
      liveStatsVisible: true,
      coachEnabled: true,
    });
  },

  saveSettings(settings) {
    this.safeSetItem(this.SETTINGS_KEY, JSON.stringify(settings));
  },

  getTheme() {
    const theme = this.safeGetItem(this.THEME_KEY);
    return theme || "dark-mode";
  },

  saveTheme(theme) {
    this.safeSetItem(this.THEME_KEY, theme);
  },

  shouldShowGuide() {
    const shown = this.safeGetItem(this.SHOW_GUIDE_KEY);
    return shown !== "false";
  },

  setGuideShown() {
    this.safeSetItem(this.SHOW_GUIDE_KEY, "false");
  },

  clearAll() {
    this.safeRemoveItem(this.STATS_KEY);
    this.safeRemoveItem(this.SETTINGS_KEY);
    this.safeRemoveItem(this.THEME_KEY);
    this.safeRemoveItem(this.SHOW_GUIDE_KEY);
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
    } catch (_e) {
      this.audioContext = null;
    }
  },

  setEnabled(enabled) {
    this.enabled = enabled;
  },

  // Most browsers create AudioContext in a "suspended" state until a user
  // gesture explicitly resumes it (autoplay policy). Without this, the very
  // first keystroke sounds can silently fail to play.
  ensureResumed() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume().catch(() => {});
    }
  },

  playKeySound() {
    if (!this.enabled || !this.audioContext) return;
    this.ensureResumed();
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
    } catch (_e) {
      return;
    }
  },

  playErrorSound() {
    if (!this.enabled || !this.audioContext) return;
    this.ensureResumed();
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
    } catch (_e) {
      return;
    }
  },

  playCompleteSound() {
    if (!this.enabled || !this.audioContext) return;
    this.ensureResumed();
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
    } catch (_e) {
      return;
    }
  },
};

/**
 * TEXT FORMATTING UTILITIES
 */

function splitUnicodeCharacters(text) {
  if (!text) return [];

  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const locale =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : "en";
    try {
      return Array.from(
        new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(text),
        (segment) => segment.segment,
      );
    } catch (_error) {
      // Some environments report locale tags (e.g. "en-US@posix") that
      // Intl.Segmenter rejects with a RangeError. Fall through to the
      // regex-based splitter below instead of letting this exception
      // propagate and break the whole app.
    }
  }

  try {
    return text.match(/\P{Mark}\p{Mark}*/gu) || [];
  } catch (error) {
    return Array.from(text);
  }
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

function calculateWPM(correctCharCount, timeInSeconds) {
  if (timeInSeconds === 0) return 0;
  return Math.round((correctCharCount / 5) / (timeInSeconds / 60));
}

function calculateAccuracy(correctChars, totalTyped) {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
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
      const expectedChar = originalChars[i] || typedChars[i];
      mistypedKeys[expectedChar] = (mistypedKeys[expectedChar] || 0) + 1;
    }
  }

  // Count extra typed grapheme clusters as incorrect
  if (typedChars.length > originalChars.length) {
    incorrectChars += typedChars.length - originalChars.length;
  }

  const totalTyped = typedChars.length;
  const wpm = calculateWPM(correctChars, timeInSeconds);
  const accuracy = calculateAccuracy(correctChars, totalTyped);

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
    if (avg === 0) return 1;

    let variance = 0;
    for (let speed of speedHistory) {
      variance += Math.pow(speed - avg, 2);
    }

    variance = variance / speedHistory.length;
    const stdDev = Math.sqrt(variance);

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
    if (!this.themes.includes(theme)) {
      theme = "dark-mode";
    }

    this.themes.forEach((t) => document.documentElement.classList.remove(t));

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
  if (!ctx) return;
  canvas.style.width = "100%";

  const containerWidth = canvas.clientWidth || canvas.parentElement?.clientWidth || 0;
  if (containerWidth <= 0) {
    setTimeout(() => drawLineChart(canvasId, data, maxValue), 80);
    return;
  }

  const desiredHeight = Math.max(140, Math.round(containerWidth * 0.35));
  const ratio = window.devicePixelRatio || 1;

  // Set the backing store size for crisp rendering on high-DPI screens
  canvas.width = Math.round(containerWidth * ratio);
  canvas.height = Math.round(desiredHeight * ratio);
  canvas.style.height = desiredHeight + "px";

  // Reset any previous scaling then scale to devicePixelRatio
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);

  const padding = 30;
  const width = containerWidth - 2 * padding;
  const height = desiredHeight - 2 * padding;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

// Ensure charts redraw on resize. Use a weak map to avoid attaching multiple listeners per canvas.
if (typeof window !== "undefined") {
  const redrawMap = new WeakMap();
  window.addEventListener(
    "resize",
    debounce(() => {
      // Find all canvas elements inside .chart-container and trigger re-draw if they have data-* attributes
      document.querySelectorAll(".chart-container canvas").forEach((c) => {
        const id = c.id;
        if (!id) return;
        // If a redraw is already scheduled for this canvas, skip
        if (redrawMap.get(c)) return;
        // Mark scheduled and trigger a synthetic re-draw by invoking any existing init call
        redrawMap.set(c, true);
        // Attempt to read stored data attached to the element (if any)
        const stored = c.__chartData;
        if (stored && stored.drawFn) {
          stored.drawFn();
        }
        // Clear scheduled marker after a short delay
        setTimeout(() => redrawMap.delete(c), 200);
      });
    }, 150),
  );
}

// Helper to attach persistent draw data to canvas so resize handler can call it
function attachChartDataToCanvas(canvasId, drawFn, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas.__chartData = { drawFn: () => drawFn(data), data };
}

// Export attach helper for use by other modules
window.attachChartDataToCanvas = attachChartDataToCanvas;

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
