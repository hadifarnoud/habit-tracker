let habits = [];
let editingHabitId = null;
let currentDate = new Date();

const habitList = document.getElementById("habit-list");
const addHabitBtn = document.getElementById("add-habit-btn");
const modal = document.getElementById("modal");
const habitForm = document.getElementById("habit-form");
const cancelBtn = document.getElementById("cancel-btn");
const homeBtn = document.getElementById("home-btn");
const monthlyBtn = document.getElementById("monthly-btn");
const statsBtn = document.getElementById("stats-btn");
const homeSection = document.getElementById("home");
const monthlySection = document.getElementById("monthly-view");
const statsSection = document.getElementById("stats-view");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const currentMonthSpan = document.getElementById("current-month");

// New elements for tracking log
const trackingModal = document.getElementById("tracking-modal");
const trackingList = document.getElementById("tracking-list");
const trackingModalTitle = document.getElementById("tracking-modal-title");
const trackingCancelBtn = document.getElementById("tracking-cancel-btn");

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function loadHabits() {
  const storedHabits = localStorage.getItem("habits");
  if (storedHabits) {
    habits = JSON.parse(storedHabits);

    // Convert tracks to new format if needed
    habits.forEach((habit) => {
      if (habit.tracks && habit.tracks.length > 0) {
        // Check if the first element is an object with a date property
        if (typeof habit.tracks[0] === "object" && habit.tracks[0].date) {
          // Convert to array of date strings
          habit.tracks = habit.tracks.map((track) => track.date);
        }
      }
    });

    saveHabits(); // Save the converted data back to localStorage
    renderHabits();
  }
}

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit) => {
    const li = document.createElement("li");
    const icon = document.createElement("span");
    icon.className = `habit-icon ${habit.type}-habit`;
    icon.style.backgroundColor = habit.color;

    li.innerHTML = `
      ${icon.outerHTML}
      ${habit.name}
      <div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        <button class="track-btn">Track</button>
      </div>
    `;
    li.querySelector(".edit-btn").addEventListener("click", () => editHabit(habit.id));
    li.querySelector(".delete-btn").addEventListener("click", () => deleteHabit(habit.id));
    li.querySelector(".track-btn").addEventListener("click", () => openTrackingLog(habit.id));
    habitList.appendChild(li);
  });
}

function addHabit(name, color, type, startDate) {
  const newHabit = {
    id: Date.now().toString(),
    name,
    color,
    type,
    startDate,
    tracks: [],
  };
  habits.push(newHabit);
  saveHabits();
  renderHabits();
  showNotification("Habit added successfully!");
}

function editHabit(id) {
  const habit = habits.find((h) => h.id === id);
  if (habit) {
    document.getElementById("modal-title").textContent = "Edit Habit";
    document.getElementById("habit-name").value = habit.name;
    document.getElementById("habit-color").value = habit.color;
    document.getElementById("habit-type").value = habit.type;
    document.getElementById("habit-start-date").value = habit.startDate;
    editingHabitId = id;
    modal.style.display = "block";
  }
}

function updateHabit(id, name, color, type, startDate) {
  const habit = habits.find((h) => h.id === id);
  if (habit) {
    habit.name = name;
    habit.color = color;
    habit.type = type;
    habit.startDate = startDate;
    saveHabits();
    renderHabits();
    showNotification("Habit updated successfully!");
  }
}

function deleteHabit(id) {
  if (confirm("Are you sure you want to delete this habit?")) {
    habits = habits.filter((habit) => habit.id !== id);
    saveHabits();
    renderHabits();
    showNotification("Habit deleted.");
  }
}

// Modified trackHabit function to track for a specific date
function trackHabitForDate(habitId, date) {
  const habit = habits.find((h) => h.id === habitId);
  if (habit) {
    const trackIndex = habit.tracks.indexOf(date);
    if (trackIndex === -1) {
      habit.tracks.push(date);
      showNotification(`Habit tracked for ${date}!`);
    } else {
      habit.tracks.splice(trackIndex, 1);
      showNotification(`Habit untracked for ${date}.`);
    }
    saveHabits();
    renderHabits();
    renderTrackingLog(habitId);
    renderMonthlyView();
  }
}

// New function to open the tracking log modal
function openTrackingLog(habitId) {
  const habit = habits.find((h) => h.id === habitId);
  if (habit) {
    trackingModalTitle.textContent = `Tracking Log for ${habit.name}`;
    renderTrackingLog(habitId);
    trackingModal.dataset.habitId = habitId;
    trackingModal.style.display = "block";
  }
}

// New function to render the tracking log
function renderTrackingLog(habitId) {
  const habit = habits.find((h) => h.id === habitId);
  if (habit) {
    trackingList.innerHTML = "";
    const sortedTracks = habit.tracks.slice().sort((a, b) => new Date(b) - new Date(a));
    sortedTracks.forEach((date) => {
      const li = document.createElement("li");
      li.textContent = date;
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-track-btn";
      editBtn.addEventListener("click", () => editTrackDate(habitId, date));
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-track-btn";
      deleteBtn.addEventListener("click", () => deleteTrackDate(habitId, date));
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      trackingList.appendChild(li);
    });
    // Add option to track a new date
    const addTrackLi = document.createElement("li");
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.max = new Date().toISOString().split("T")[0];
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.addEventListener("click", () => {
      if (dateInput.value) {
        trackHabitForDate(habitId, dateInput.value);
        dateInput.value = "";
      }
    });
    addTrackLi.appendChild(dateInput);
    addTrackLi.appendChild(addBtn);
    trackingList.insertBefore(addTrackLi, trackingList.firstChild);
  }
}

// New function to edit a tracked date
function editTrackDate(habitId, oldDate) {
  const newDate = prompt("Enter the new date (YYYY-MM-DD):", oldDate);
  if (newDate) {
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      const index = habit.tracks.indexOf(oldDate);
      if (index !== -1) {
        habit.tracks[index] = newDate;
        saveHabits();
        renderHabits();
        renderTrackingLog(habitId);
        renderMonthlyView();
        showNotification(`Date changed to ${newDate}.`);
      }
    }
  }
}

// New function to delete a tracked date
function deleteTrackDate(habitId, date) {
  if (confirm(`Are you sure you want to delete the track for ${date}?`)) {
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      const index = habit.tracks.indexOf(date);
      if (index !== -1) {
        habit.tracks.splice(index, 1);
        saveHabits();
        renderHabits();
        renderTrackingLog(habitId);
        renderMonthlyView();
        showNotification(`Track for ${date} deleted.`);
      }
    }
  }
}

function renderMonthlyView() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthSpan.textContent = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    calendar.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.textContent = day;

    const date = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    const tracksContainer = document.createElement("div");
    tracksContainer.className = "tracks-container";

    habits.forEach((habit) => {
      if (habit.tracks.includes(date)) {
        const trackElement = document.createElement("div");
        trackElement.className = `habit-track ${habit.type}-habit`;
        trackElement.style.backgroundColor = habit.color;
        tracksContainer.appendChild(trackElement);
      }
    });

    dayElement.appendChild(tracksContainer);
    calendar.appendChild(dayElement);
  }
}

addHabitBtn.addEventListener("click", () => {
  document.getElementById("modal-title").textContent = "Add Habit";
  habitForm.reset();
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("habit-start-date").value = today;
  document.getElementById("habit-start-date").max = today;
  editingHabitId = null;
  modal.style.display = "block";
});

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("habit-name").value;
  const color = document.getElementById("habit-color").value;
  const type = document.getElementById("habit-type").value;
  const startDate = document.getElementById("habit-start-date").value;

  const today = new Date().toISOString().split("T")[0];
  if (startDate > today) {
    alert("Start date cannot be in the future.");
    return;
  }

  if (editingHabitId) {
    updateHabit(editingHabitId, name, color, type, startDate);
  } else {
    addHabit(name, color, type, startDate);
  }

  modal.style.display = "none";
  habitForm.reset();
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
  habitForm.reset();
});

// Event listener for tracking modal cancel button
trackingCancelBtn.addEventListener("click", () => {
  trackingModal.style.display = "none";
});

function setActiveNavButton(activeBtn) {
  [homeBtn, monthlyBtn, statsBtn].forEach((btn) => {
    btn.classList.toggle("active", btn === activeBtn);
  });
}

homeBtn.addEventListener("click", () => {
  homeSection.style.display = "block";
  monthlySection.style.display = "none";
  statsSection.style.display = "none";
  setActiveNavButton(homeBtn);
});

monthlyBtn.addEventListener("click", () => {
  homeSection.style.display = "none";
  monthlySection.style.display = "block";
  statsSection.style.display = "none";
  setActiveNavButton(monthlyBtn);
  renderMonthlyView();
});

statsBtn.addEventListener("click", () => {
  homeSection.style.display = "none";
  monthlySection.style.display = "none";
  statsSection.style.display = "block";
  setActiveNavButton(statsBtn);
  renderStatsView();
});

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderMonthlyView();
});

nextMonthBtn.addEventListener("click", () => {
  const now = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();

  if (currentYear < nowYear || (currentYear === nowYear && currentMonth < nowMonth)) {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderMonthlyView();
  }
});

function renderStatsView() {
  const monthlyAverage = calculateMonthlyAverage();
  const weeklyAverage = calculateWeeklyAverage();

  document.getElementById("monthly-average").textContent = monthlyAverage.toFixed(2);
  document.getElementById("weekly-average").textContent = weeklyAverage.toFixed(2);

  const allHabitsList = document.getElementById("all-habits-list");
  allHabitsList.innerHTML = "";
  habits.forEach((habit) => {
    const habitMonthlyAverage = calculateHabitMonthlyAverage(habit);
    const habitWeeklyAverage = calculateHabitWeeklyAverage(habit);

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${habit.name}</strong> - Total Tracks: ${habit.tracks.length}
      <br>
      Monthly Average: ${habitMonthlyAverage.toFixed(2)}
      <br>
      Weekly Average: ${habitWeeklyAverage.toFixed(2)}
      <div>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    li.querySelector(".edit-btn").addEventListener("click", () => editHabit(habit.id));
    li.querySelector(".delete-btn").addEventListener("click", () => deleteHabit(habit.id));
    allHabitsList.appendChild(li);
  });
}

function calculateMonthlyAverage() {
  // ... existing code remains unchanged ...
}

function calculateWeeklyAverage() {
  // ... existing code remains unchanged ...
}

// Functions to calculate per-habit averages remain unchanged

function showNotification(message, duration = 3000) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, duration);
}

window.addEventListener("load", () => {
  loadHabits();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  }
});
