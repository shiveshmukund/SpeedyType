/* ===========================
   MAIN APPLICATION SCRIPT
   =========================== */

// Application State
const appState = {
  originalText: "",
  typedText: "",
  currentIndex: 0,
  timeRemaining: 60,
  timerStarted: false,
  testComplete: false,
  timerId: null,
  speedHistory: [],
  startTime: null,
  isPaused: false,
  isComposing: false,
};
let navOverlayHideTimeout = null;
let lastFocusedElement = null;

function restoreFocus() {
  const el = lastFocusedElement;
  lastFocusedElement = null;
  if (!el || typeof el.focus !== "function" || !document.body.contains(el)) {
    return;
  }
  // The settings/analytics buttons live inside the collapsible hamburger
  // overlay, which hides itself (visibility:hidden) shortly after a modal
  // opens. Focusing a hidden element silently fails and focus falls back
  // to <body>, so detect that case and land on the menu toggle instead.
  const style = window.getComputedStyle(el);
  const isVisible = style.visibility !== "hidden" && style.display !== "none";
  if (isVisible) {
    el.focus();
  } else if (elements.menuToggle) {
    elements.menuToggle.focus();
  }
}

// DOM Elements
const elements = {
  displayText: document.getElementById("display-text"),
  typingInput: document.getElementById("typing-input"),
  textDisplay: document.getElementById("text-display"),
  wpmDisplay: document.getElementById("wpm-display"),
  accuracyDisplay: document.getElementById("accuracy-display"),
  errorsDisplay: document.getElementById("errors-display"),
  timerDisplay: document.getElementById("timer-display"),
  progressBar: document.getElementById("progress-bar"),
  coachMessage: document.getElementById("coach-message"),
  resultsPanel: document.getElementById("results-panel"),
  restartBtn: document.getElementById("restart-btn"),
  typingMode: document.getElementById("typing-mode"),
  difficulty: document.getElementById("difficulty"),
  timerSelect: document.getElementById("timer-select"),
  languageSelect: document.getElementById("language-select"),
  themeToggle: document.getElementById("theme-toggle"),
  soundToggle: document.getElementById("sound-toggle"),
  analyticsBtn: document.getElementById("analytics-btn"),
  settingsBtn: document.getElementById("settings-btn"),
  menuToggle: document.getElementById("menu-toggle"),
  navOverlay: document.getElementById("nav-overlay"),
  settingsModal: document.getElementById("settings-modal"),
  guideModal: document.getElementById("guide-modal"),
  analyticsModal: document.getElementById("analytics-modal"),
  closeSettings: document.getElementById("close-settings"),
  closeGuide: document.getElementById("close-guide"),
  closeAnalytics: document.getElementById("close-analytics"),
  soundSetting: document.getElementById("sound-setting"),
  caretSetting: document.getElementById("caret-setting"),
  liveStatsSetting: document.getElementById("live-stats-setting"),
  coachSetting: document.getElementById("coach-setting"),
  disableGuideSetting: document.getElementById("disable-guide"),
  startGuideBtn: document.getElementById("start-guide-btn"),
  clearStatsBtn: document.getElementById("clear-stats-btn"),
  statsContainer: document.getElementById("stats-container"),
};

/**
 * INITIALIZATION
 */

function init() {
  // Attach event listeners first, before anything else. If a later step
  // throws (theme init, text generation, etc.), the app should still
  // respond to clicks/typing rather than becoming completely inert.
  setupEventListeners();

  try {
    // Initialize theme
    ThemeManager.initTheme();
    updateThemeButton();

    // Initialize sound engine (volume/enabled state is applied below via
    // applyCurrentSettings, so we don't duplicate that here)
    SoundManager.init();

    // Load settings into checkboxes and apply them (sound, caret, live
    // stats, coach)
    updateSettingsUI();
    applyCurrentSettings();

    // Generate initial text
    generateNewText();

    // Focus input
    elements.typingInput.focus();

    // Show guide if needed
    if (LocalStorage.shouldShowGuide()) {
      elements.guideModal.classList.remove("hidden");
      elements.startGuideBtn.focus();
    }

    // Footer: keep the copyright year current automatically
    const footerYear = document.getElementById("footer-year");
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }

    // Update timer display
    updateTimerDisplay();
  } catch (error) {
    // Even if something above fails unexpectedly, event listeners are
    // already attached (see top of this function), so the app remains
    // interactive rather than silently dead.
    console.error("SpeedyType: non-fatal error during initialization", error);
  }
}

/**
 * EVENT LISTENERS SETUP
 */

function setupEventListeners() {
  // Typing input
  elements.typingInput.addEventListener("input", handleTyping);

  // Settings controls
  elements.typingMode.addEventListener("change", () => {
    generateNewText();
    resetTest();
  });

  elements.difficulty.addEventListener("change", () => {
    generateNewText();
    resetTest();
  });

  elements.timerSelect.addEventListener("change", () => {
    appState.timeRemaining = parseInt(elements.timerSelect.value);
    resetTest();
    updateTimerDisplay();
  });

  elements.languageSelect.addEventListener("change", () => {
    generateNewText();
    resetTest();
  });

  // Theme and sound
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.soundToggle.addEventListener("click", toggleSound);
  elements.analyticsBtn.addEventListener("click", openAnalytics);
  elements.settingsBtn.addEventListener("click", openSettings);

  // Modal controls
  elements.closeSettings.addEventListener("click", closeSettings);
  elements.closeGuide.addEventListener("click", closeGuideModal);
  elements.closeAnalytics.addEventListener("click", closeAnalytics);
  elements.startGuideBtn.addEventListener("click", closeGuideModal);
  elements.clearStatsBtn.addEventListener("click", clearAllStats);
  elements.restartBtn.addEventListener("click", restartTest);

  // Settings checkboxes
  elements.soundSetting.addEventListener("change", (e) => {
    SoundManager.setEnabled(e.target.checked);
    const settings = LocalStorage.getSettings();
    settings.soundEnabled = e.target.checked;
    LocalStorage.saveSettings(settings);
    updateSoundButton();
  });

  elements.caretSetting.addEventListener("change", (e) => {
    const settings = LocalStorage.getSettings();
    settings.caretVisible = e.target.checked;
    LocalStorage.saveSettings(settings);
    applyCaretVisibility(e.target.checked);
  });

  elements.liveStatsSetting.addEventListener("change", (e) => {
    const settings = LocalStorage.getSettings();
    settings.liveStatsVisible = e.target.checked;
    LocalStorage.saveSettings(settings);
    applyLiveStatsVisibility(e.target.checked);
  });

  elements.coachSetting.addEventListener("change", (e) => {
    const settings = LocalStorage.getSettings();
    settings.coachEnabled = e.target.checked;
    LocalStorage.saveSettings(settings);
    applyCoachEnabled(e.target.checked);
  });

  elements.disableGuideSetting.addEventListener("change", (e) => {
    if (e.target.checked) {
      LocalStorage.setGuideShown();
    }
  });

  // Text display click
  elements.textDisplay.addEventListener("click", () => {
    elements.typingInput.focus();
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);

  // IME composition support for Hindi and other complex input methods
  elements.typingInput.addEventListener("compositionstart", () => {
    appState.isComposing = true;
  });

  elements.typingInput.addEventListener("compositionupdate", () => {
    appState.isComposing = true;
  });

  elements.typingInput.addEventListener("compositionend", () => {
    appState.isComposing = false;
    setTimeout(() => {
      handleTyping({ target: elements.typingInput });
    }, 0);
  });

  elements.typingInput.addEventListener("compositioncancel", () => {
    appState.isComposing = false;
  });

  // Click outside modal
  elements.settingsModal.addEventListener("click", (e) => {
    if (e.target === elements.settingsModal) {
      closeSettings();
    }
  });

  elements.guideModal.addEventListener("click", (e) => {
    if (e.target === elements.guideModal) {
      closeGuideModal();
    }
  });

  elements.analyticsModal.addEventListener("click", (e) => {
    if (e.target === elements.analyticsModal) {
      closeAnalytics();
    }
  });

  // Menu toggle for header overlay
  if (elements.menuToggle && elements.navOverlay) {
    elements.menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNavOverlay();
    });

    // Close overlay when clicking outside
    document.addEventListener("click", (e) => {
      const overlay = elements.navOverlay;
      const toggle = elements.menuToggle;
      if (!overlay || !toggle) return;
      if (overlay.classList.contains("open")) {
        if (!overlay.contains(e.target) && e.target !== toggle) {
          closeNavOverlay();
        }
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (elements.navOverlay.classList.contains("open")) {
          closeNavOverlay();
        }
      }
    });
  }
}

/* NAV OVERLAY (header menu) */
function toggleNavOverlay() {
  if (!elements.navOverlay || !elements.menuToggle) return;
  const isOpen = elements.navOverlay.classList.contains("open");
  if (isOpen) {
    closeNavOverlay();
  } else {
    openNavOverlay();
  }
}

function openNavOverlay() {
  elements.navOverlay.classList.remove("hidden");
  elements.navOverlay.style.display = "block";
  elements.navOverlay.style.visibility = "hidden";

  if (navOverlayHideTimeout) {
    clearTimeout(navOverlayHideTimeout);
    navOverlayHideTimeout = null;
  }

  requestAnimationFrame(() => {
    positionNavOverlay();
    elements.navOverlay.classList.add("open");
    elements.navOverlay.style.visibility = "";
  });

  elements.menuToggle.setAttribute("aria-expanded", "true");
}

function closeNavOverlay() {
  if (!elements.navOverlay) return;
  elements.navOverlay.classList.remove("open");
  if (navOverlayHideTimeout) {
    clearTimeout(navOverlayHideTimeout);
  }
  navOverlayHideTimeout = setTimeout(() => {
    elements.navOverlay.classList.add("hidden");
    elements.navOverlay.style.display = "";
    elements.navOverlay.style.visibility = "";
    // Only reset position after the fade-out transition has finished,
    // otherwise the overlay snaps to its default top-left (0,0) spot
    // while still visibly fading out, showing a ghost box in the corner.
    elements.navOverlay.style.left = "";
    elements.navOverlay.style.top = "";
    elements.navOverlay.style.position = "";
    navOverlayHideTimeout = null;
  }, 220);
  if (elements.menuToggle) elements.menuToggle.setAttribute("aria-expanded", "false");
}

function positionNavOverlay() {
  const toggle = elements.menuToggle;
  const overlay = elements.navOverlay;
  if (!toggle || !overlay) return;

  overlay.style.position = 'fixed';
  overlay.style.left = '-9999px';
  overlay.style.top = '-9999px';
  overlay.style.right = 'auto';
  overlay.style.visibility = 'hidden';
  overlay.style.display = 'block';

  const toggleRect = toggle.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  const margin = 8;
  const width = overlayRect.width || 240;
  const height = overlayRect.height || 200;

  let left = toggleRect.right - width;
  left = Math.min(Math.max(left, margin), window.innerWidth - width - margin);

  let top = Math.round(toggleRect.bottom + margin);
  const bottomOverflow = top + height - window.innerHeight;

  if (bottomOverflow > 0) {
    const altTop = Math.round(toggleRect.top - height - margin);
    top = altTop >= margin ? altTop : Math.max(margin, window.innerHeight - height - margin);
  }

  overlay.style.left = `${left}px`;
  overlay.style.top = `${top}px`;
  overlay.style.visibility = '';
  overlay.style.right = 'auto';
}

// Reposition overlay on resize while open
window.addEventListener('resize', throttle(() => {
  if (elements.navOverlay && elements.navOverlay.classList.contains('open')) {
    positionNavOverlay();
  }
}, 120));

/**
 * TYPING HANDLER
 */

function handleTyping(event) {
  if (appState.isComposing) return;

  const input = event.target.value;
  const typedLength = splitUnicodeCharacters(input).length;
  const originalLength = splitUnicodeCharacters(appState.originalText).length;

  // Start timer on first keystroke
  if (!appState.timerStarted && typedLength > 0) {
    startTimer();
  }

  appState.typedText = input;
  appState.currentIndex = typedLength;

  // Play sound if enabled
  if (SoundManager.enabled) {
    SoundManager.playKeySound();
  }

  // Update display
  updateDisplay();

  // Update stats
  updateStats();

  // Check if completed. Using >= (not ===) matters here: IME input for
  // Hindi/complex scripts can insert several grapheme clusters in a single
  // "compositionend" event, so typedLength can jump straight past
  // originalLength without ever equaling it exactly.
  if (typedLength >= originalLength) {
    completeTest();
  }
}

/**
 * DISPLAY UPDATE
 */

function updateDisplay() {
  const chars = highlightText(appState.originalText, appState.typedText);
  const html = createHighlightedHTML(chars, appState.currentIndex);
  elements.displayText.innerHTML = html;

  const originalLength = splitUnicodeCharacters(appState.originalText).length;
  const progress = originalLength
    ? Math.min(100, (appState.currentIndex / originalLength) * 100)
    : 0;
  elements.progressBar.style.width = progress + "%";
}

/**
 * STATS UPDATE
 */

function updateStats() {
  if (!appState.timerStarted) return;

  const elapsedSeconds = (Date.now() - appState.startTime) / 1000;
  const stats = calculateStats(
    appState.originalText,
    appState.typedText,
    elapsedSeconds,
  );

  // Update display
  elements.wpmDisplay.textContent = stats.wpm;
  elements.accuracyDisplay.textContent = stats.accuracy + "%";
  elements.errorsDisplay.textContent = stats.errors;

  // Track speed history for coach
  if (
    appState.speedHistory.length === 0 ||
    Date.now() - appState.speedHistory[appState.speedHistory.length - 1].time >
      1000
  ) {
    appState.speedHistory.push({
      wpm: stats.wpm,
      time: Date.now(),
    });
  }

  // Update coach message periodically
  if (appState.speedHistory.length % 5 === 0) {
    const consistencyScore = TypingCoach.getConsistencyScore(
      appState.speedHistory.map((s) => s.wpm),
    );
    const message = TypingCoach.getCoachMessage(
      stats.wpm,
      stats.accuracy,
      consistencyScore,
    );
    elements.coachMessage.textContent = message;
  }
}

/**
 * TIMER MANAGEMENT
 */

function startTimer() {
  if (appState.timerStarted) return;

  appState.timerStarted = true;
  appState.startTime = Date.now();

  appState.timerId = setInterval(() => {
    appState.timeRemaining--;
    updateTimerDisplay();

    if (appState.timeRemaining <= 0) {
      completeTest();
    }
  }, 1000);
}

function stopTimer() {
  if (appState.timerId) {
    clearInterval(appState.timerId);
    appState.timerId = null;
  }
}

function updateTimerDisplay() {
  elements.timerDisplay.textContent = appState.timeRemaining;

  // Add warning if time is running out
  if (appState.timeRemaining <= 10 && appState.timerStarted) {
    elements.timerDisplay.parentElement.style.color = "var(--error)";
  } else {
    elements.timerDisplay.parentElement.style.color = "var(--accent-primary)";
  }
}

/**
 * TEST COMPLETION
 */

function completeTest() {
  if (appState.testComplete) return;

  appState.testComplete = true;
  stopTimer();

  // Disable input
  elements.typingInput.disabled = true;

  // Play complete sound
  if (SoundManager.enabled) {
    SoundManager.playCompleteSound();
  }

  const elapsedSeconds = appState.startTime
    ? (Date.now() - appState.startTime) / 1000
    : 1;
  const stats = calculateStats(
    appState.originalText,
    appState.typedText,
    Math.max(elapsedSeconds, 0.1),
  );

  // Save stats
  const savedStats = LocalStorage.addTestResult({
    wpm: stats.wpm,
    accuracy: stats.accuracy,
    errors: stats.errors,
    duration: elapsedSeconds,
    mistypedKeys: stats.mistypedKeys,
  });

  // Show results
  showResults(stats, savedStats);
}

/**
 * RESET TEST
 */

function resetTest() {
  stopTimer();
  closeNavOverlay();
  elements.typingInput.value = "";
  elements.typingInput.disabled = false;
  elements.coachMessage.textContent = "";
  elements.resultsPanel.classList.add("hidden");

  appState.typedText = "";
  appState.currentIndex = 0;
  appState.timeRemaining = parseInt(elements.timerSelect.value, 10);
  appState.timerStarted = false;
  appState.testComplete = false;
  appState.speedHistory = [];
  appState.startTime = null;

  // Reset displays
  updateTimerDisplay();
  updateDisplay();
  elements.wpmDisplay.textContent = "0";
  elements.accuracyDisplay.textContent = "100%";
  elements.errorsDisplay.textContent = "0";
  elements.progressBar.style.width = "0%";

  // Focus input
  elements.typingInput.focus();
}

/**
 * GENERATE NEW TEXT
 */

function generateNewText() {
  const mode = elements.typingMode.value;
  const difficulty = elements.difficulty.value;
  const language = elements.languageSelect.value;

  appState.originalText = getRandomText(mode, difficulty, language);
  updateDisplay();
}

/**
 * SHOW RESULTS
 */

function showResults(stats, savedStats) {
  // Populate results
  document.getElementById("final-wpm").textContent = stats.wpm;
  document.getElementById("final-accuracy").textContent = stats.accuracy + "%";
  document.getElementById("final-errors").textContent = stats.errors;
  document.getElementById("final-chars").textContent = stats.totalTyped;

  // Show error analysis
  const topErrors = getTopWeakKeys(stats.mistypedKeys, 5);
  const errorAnalysisHTML = topErrors
    .map(
      (e) =>
        `<div class="error-item"><strong>${e.key}</strong><small>${e.count} errors</small></div>`,
    )
    .join("");
  document.getElementById("error-analysis").innerHTML =
    errorAnalysisHTML || '<div class="error-item">No errors!</div>';

  // Show most mistyped keys from overall stats history if available,
  // otherwise fall back to the current test errors.
  const weakKeySource = savedStats?.weakKeys && Object.keys(savedStats.weakKeys).length > 0
    ? savedStats.weakKeys
    : stats.mistypedKeys;
  const topWeakKeys = getTopWeakKeys(weakKeySource, 5);
  const mistypedKeysHTML = topWeakKeys
    .map(
      (k) =>
        `<div class="mistyped-item"><strong>${k.key}</strong><small>${k.count} times</small></div>`,
    )
    .join("");
  document.getElementById("mistyped-keys").innerHTML =
    mistypedKeysHTML || '<div class="mistyped-item">No weak keys yet!</div>';

  // Show results panel
  elements.resultsPanel.classList.remove("hidden");

  // Scroll to results
  setTimeout(() => {
    elements.resultsPanel.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 100);
}

/**
 * RESTART TEST
 */

function restartTest() {
  generateNewText();
  resetTest();
}

/**
 * THEME MANAGEMENT
 */

function toggleTheme() {
  const newTheme = ThemeManager.toggleTheme();
  updateThemeButton();
}

function updateThemeButton() {
  const theme = ThemeManager.getTheme();
  const themeNames = {
    "dark-mode": "🌙",
    "light-mode": "☀️",
    "hacker-mode": "👾",
    "neon-mode": "🌈",
  };
  elements.themeToggle.textContent = themeNames[theme] || "🌙";
}

/**
 * SOUND MANAGEMENT
 */

function toggleSound() {
  const isEnabled = SoundManager.enabled;
  SoundManager.setEnabled(!isEnabled);

  const settings = LocalStorage.getSettings();
  settings.soundEnabled = !isEnabled;
  LocalStorage.saveSettings(settings);

  updateSoundButton();
}

function updateSoundButton() {
  elements.soundToggle.textContent = SoundManager.enabled ? "🔊" : "🔇";
}

/**
 * SETTINGS MODAL
 */

function openSettings(event) {
  if (event && event.stopPropagation) {
    event.preventDefault();
    event.stopPropagation();
  }
  closeNavOverlay();
  lastFocusedElement = document.activeElement;
  elements.settingsModal.classList.remove("hidden");
  elements.closeSettings.focus();
}

function closeSettings() {
  elements.settingsModal.classList.add("hidden");
  restoreFocus();
}

function updateSettingsUI() {
  const settings = LocalStorage.getSettings();
  elements.soundSetting.checked = settings.soundEnabled;
  elements.caretSetting.checked = settings.caretVisible;
  elements.liveStatsSetting.checked = settings.liveStatsVisible;
  elements.coachSetting.checked = settings.coachEnabled;
}

function applyCurrentSettings() {
  const settings = LocalStorage.getSettings();
  SoundManager.setEnabled(settings.soundEnabled);
  updateSoundButton();
  applyCaretVisibility(settings.caretVisible);
  applyLiveStatsVisibility(settings.liveStatsVisible);
  applyCoachEnabled(settings.coachEnabled);
}

function applyCaretVisibility(visible) {
  document.documentElement.classList.toggle("caret-hidden", !visible);
}

function applyLiveStatsVisibility(visible) {
  elements.statsContainer.classList.toggle("hidden", !visible);
}

function applyCoachEnabled(enabled) {
  elements.coachMessage.style.display = enabled ? "block" : "none";
  if (!enabled) {
    elements.coachMessage.textContent = "";
  }
}

/**
 * GUIDE MODAL
 */

function closeGuideModal() {
  elements.guideModal.classList.add("hidden");
  if (elements.disableGuideSetting.checked) {
    LocalStorage.setGuideShown();
  }
  restoreFocus();
  elements.typingInput.focus();
}

/**
 * ANALYTICS MODAL
 */

function openAnalytics() {
  closeNavOverlay();
  lastFocusedElement = document.activeElement;
  elements.analyticsModal.classList.remove("hidden");
  elements.closeAnalytics.focus();
  updateAnalytics();
}

function closeAnalytics() {
  elements.analyticsModal.classList.add("hidden");
  restoreFocus();
}

function updateAnalytics() {
  const stats = LocalStorage.getStats();

  document.getElementById("best-wpm").textContent = stats.bestWPM;
  document.getElementById("avg-wpm").textContent = stats.avgWPM;
  document.getElementById("best-accuracy").textContent =
    stats.bestAccuracy + "%";
  document.getElementById("total-tests").textContent = stats.totalTests;

  if (stats.testHistory.length > 0) {
    const wpmData = stats.testHistory.map((t) => t.wpm);
    const accuracyData = stats.testHistory.map((t) => t.accuracy);

    drawLineChart("speed-chart", wpmData, Math.max(...wpmData) + 10 || 100);
    if (window.attachChartDataToCanvas) {
      window.attachChartDataToCanvas(
        "speed-chart",
        (d) => drawLineChart("speed-chart", d, Math.max(...d) + 10 || 100),
        wpmData,
      );
    }

    drawLineChart("accuracy-chart", accuracyData, 100);
    if (window.attachChartDataToCanvas) {
      window.attachChartDataToCanvas(
        "accuracy-chart",
        (d) => drawLineChart("accuracy-chart", d, 100),
        accuracyData,
      );
    }

    const topWeakKeys = getTopWeakKeys(stats.weakKeys, 10);
    const weakKeysHTML = topWeakKeys
      .map(
        (k) =>
          `<div class="weak-key-item"><strong>${k.key}</strong><small>${k.count}</small></div>`,
      )
      .join("");
    document.getElementById("weak-keys-list").innerHTML =
      weakKeysHTML ||
      '<p style="text-align: center; color: var(--text-secondary);">No data yet</p>';
  } else {
    drawLineChart("speed-chart", [], 100);
    drawLineChart("accuracy-chart", [], 100);
    document.getElementById("weak-keys-list").innerHTML =
      '<p style="text-align: center; color: var(--text-secondary);">No data yet</p>';
  }
}

/**
 * CLEAR ALL STATS
 */

function clearAllStats() {
  if (
    confirm(
      "Are you sure you want to clear all statistics? This cannot be undone.",
    )
  ) {
    LocalStorage.clearAll();
    applyCurrentSettings();
    updateSettingsUI();
    ThemeManager.initTheme();
    updateThemeButton();
    closeSettings();
    alert("All statistics have been cleared!");
  }
}

/**
 * KEYBOARD SHORTCUTS
 */

function handleKeyboardShortcuts(event) {
  // Tab - Restart test only when typing input is focused and no modal is active
  if (event.key === "Tab") {
    if (
      document.activeElement === elements.typingInput &&
      elements.settingsModal.classList.contains("hidden") &&
      elements.guideModal.classList.contains("hidden") &&
      elements.analyticsModal.classList.contains("hidden")
    ) {
      event.preventDefault();
      restartTest();
    }
  }

  // Escape - Close any open overlay/modal, otherwise open settings
  if (event.key === "Escape") {
    event.preventDefault();
    if (elements.navOverlay && elements.navOverlay.classList.contains("open")) {
      closeNavOverlay();
    } else if (!elements.settingsModal.classList.contains("hidden")) {
      closeSettings();
    } else if (!elements.guideModal.classList.contains("hidden")) {
      closeGuideModal();
    } else if (!elements.analyticsModal.classList.contains("hidden")) {
      closeAnalytics();
    } else {
      openSettings();
    }
  }

  // Ctrl+R / Cmd+R - New test
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
    event.preventDefault();
    generateNewText();
    resetTest();
  }

  // Ctrl+I / Cmd+I - Open analytics
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "i") {
    event.preventDefault();
    if (elements.analyticsModal.classList.contains("hidden")) {
      openAnalytics();
    } else {
      closeAnalytics();
    }
  }
}

/**
 * INITIALIZATION ON PAGE LOAD
 */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}