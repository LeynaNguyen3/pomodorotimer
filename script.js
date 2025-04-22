// Global variables
let timeLeft;
let timerInterval;
let currentInterval = 'pomodoro';
let backgroundColor = '#F1F1EF'; // Default background color
let fontColor = '#37352F'; // Default font color

// Default time settings (in seconds)
let timeSettings = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

// DOM elements
const timeLeftEl = document.getElementById('time-left');
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroIntervalBtn = document.getElementById('pomodoro-interval-btn');
const shortBreakIntervalBtn = document.getElementById('short-break-interval-btn');
const longBreakIntervalBtn = document.getElementById('long-break-interval-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.querySelector('.close-btn');
const backgroundColorSelect = document.getElementById('background-color');
const fontColorSelect = document.getElementById('font-color');
const pomodoroTimeInput = document.getElementById('pomodoro-time');
const shortBreakTimeInput = document.getElementById('short-break-time');
const longBreakTimeInput = document.getElementById('long-break-time');
const saveBtn = document.getElementById('save-btn');

// Initialize timer with current interval
resetTimer();

// Event listeners for interval buttons
pomodoroIntervalBtn.addEventListener('click', () => {
  currentInterval = 'pomodoro';
  resetTimer();
});

shortBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'shortBreak';
  resetTimer();
});

longBreakIntervalBtn.addEventListener('click', () => {
  currentInterval = 'longBreak';
  resetTimer();
});

// Event listener for start/stop button
startStopBtn.addEventListener('click', () => {
  if (startStopBtn.textContent === 'Start') {
    startTimer();
    startStopBtn.textContent = 'Stop';
  } else {
    stopTimer();
  }
});

// Event listener for reset button
resetBtn.addEventListener('click', () => {
  resetTimer();
});

// Event listener for settings button
settingsBtn.addEventListener('click', () => {
  // Load current settings into modal inputs
  pomodoroTimeInput.value = timeSettings.pomodoro / 60;
  shortBreakTimeInput.value = timeSettings.shortBreak / 60;
  longBreakTimeInput.value = timeSettings.longBreak / 60;
  backgroundColorSelect.value = backgroundColor;
  fontColorSelect.value = fontColor;
  
  settingsModal.style.display = 'flex';
});

// Event listener for close button in the settings modal
closeModalBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

// Event listener for save button in the settings modal
saveBtn.addEventListener('click', () => {
  // Save time settings
  timeSettings.pomodoro = parseInt(pomodoroTimeInput.value) * 60;
  timeSettings.shortBreak = parseInt(shortBreakTimeInput.value) * 60;
  timeSettings.longBreak = parseInt(longBreakTimeInput.value) * 60;
  
  // Save color preferences
  backgroundColor = backgroundColorSelect.value;
  fontColor = fontColorSelect.value;

  // Save to localStorage
  localStorage.setItem('timeSettings', JSON.stringify(timeSettings));
  localStorage.setItem('backgroundColor', backgroundColor);
  localStorage.setItem('fontColor', fontColor);

  // Apply the new settings
  applyUserPreferences();
  resetTimer();

  // Close the modal
  settingsModal.style.display = 'none';
});

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimeLeftTextContent();
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      if (currentInterval === 'pomodoro') {
        currentInterval = 'shortBreak';
      } else if (currentInterval === 'shortBreak') {
        currentInterval = 'longBreak';
      } else {
        currentInterval = 'pomodoro';
      }
      resetTimer();
      startTimer();
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  startStopBtn.textContent = 'Start';
}

// Function to reset the timer
function resetTimer() {
  stopTimer();
  timeLeft = timeSettings[currentInterval];
  updateTimeLeftTextContent();
  startStopBtn.textContent = 'Start';
}

// Function to update the time left text content
function updateTimeLeftTextContent() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to apply the user's saved preferences
function applyUserPreferences() {
  // Retrieve user preferences from localStorage
  const savedTimeSettings = localStorage.getItem('timeSettings');
  const savedBackgroundColor = localStorage.getItem('backgroundColor');
  const savedFontColor = localStorage.getItem('fontColor');

  // Apply time settings if they exist
  if (savedTimeSettings) {
    timeSettings = JSON.parse(savedTimeSettings);
  }

  // Apply color preferences if they exist
  if (savedBackgroundColor) {
    backgroundColor = savedBackgroundColor;
  }

  if (savedFontColor) {
    fontColor = savedFontColor;
  }

  // Apply the preferences to the page
  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = fontColor;
  timeLeftEl.style.color = fontColor;
  
  // Update the buttons' styles
  const buttons = document.querySelectorAll('.interval-btn, #start-stop-btn, #reset-btn, #settings-btn');
  buttons.forEach((button) => {
    button.style.color = fontColor;
    button.style.backgroundColor = backgroundColor;
    button.style.borderColor = fontColor;
  });
}

// Apply user preferences on page load
applyUserPreferences();
