// DOM Elements
const homeView = document.getElementById('home-view');
const monthlyView = document.getElementById('monthly-view');
const habitLogView = document.getElementById('habit-log-view');
const addHabitView = document.getElementById('add-habit-view');
const habitList = document.getElementById('habit-list');
const monthlyGrid = document.getElementById('monthly-grid');
const habitLogList = document.getElementById('habit-log-list');
const habitLogTitle = document.getElementById('habit-log-title');
const addHabitForm = document.getElementById('add-habit-form');
const notification = document.getElementById('notification');
const habitLegend = document.getElementById('habit-legend');
const currentMonthSpan = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

// Navigation
document.getElementById('home-btn').addEventListener('click', showHomeView);
document.getElementById('monthly-btn').addEventListener('click', showMonthlyView);
document.getElementById('add-habit-btn').addEventListener('click', showAddHabitView);

// Data structure
let habits = [];
let currentDate = new Date();

// Load habits from IndexedDB
function loadHabits() {
    const dbName = 'HabitTrackerDB';
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function(event) {
        console.error("IndexedDB error:", event.target.error);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['habits'], 'readonly');
        const objectStore = transaction.objectStore('habits');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function(event) {
            habits = event.target.result;
            renderHabitList();
        };
    };

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        db.createObjectStore('habits', { keyPath: 'id', autoIncrement: true });
    };
}

// Save habits to IndexedDB
function saveHabits() {
    const dbName = 'HabitTrackerDB';
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['habits'], 'readwrite');
        const objectStore = transaction.objectStore('habits');

        // Clear existing habits
        const clearRequest = objectStore.clear();

        clearRequest.onsuccess = function() {
            // Add all habits
            habits.forEach(function(habit) {
                objectStore.add(habit);
            });
        };
    };
}

// View functions
function showHomeView() {
    hideAllViews();
    homeView.classList.remove('hidden');
    renderHabitList();
}

function showMonthlyView() {
    hideAllViews();
    monthlyView.classList.remove('hidden');
    renderMonthlyView();
}

function showHabitLogView(habit) {
    hideAllViews();
    habitLogView.classList.remove('hidden');
    renderHabitLog(habit);
}

function showAddHabitView() {
    hideAllViews();
    addHabitView.classList.remove('hidden');
}

function hideAllViews() {
    homeView.classList.add('hidden');
    monthlyView.classList.add('hidden');
    habitLogView.classList.add('hidden');
    addHabitView.classList.add('hidden');
}

// Render functions
function renderHabitList() {
    habitList.innerHTML = '';
    habits.forEach((habit, index) => {
        const div = document.createElement('div');
        div.className = 'habit-item';
        div.innerHTML = `
            <div class="habit-color" style="background-color: ${habit.color};"></div>
            <div class="habit-name">${habit.name}</div>
            <div class="habit-type ${habit.type}">${habit.type}</div>
            <button onclick="trackHabit(${index})">Track</button>
            <button onclick="editHabit(${index})">Edit</button>
            <button onclick="deleteHabit(${index})">Delete</button>
        `;
        div.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                showHabitLogView(habit);
            }
        });
        habitList.appendChild(div);
    });
}

function renderMonthlyView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthSpan.textContent = `${getMonthName(month)} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    monthlyGrid.innerHTML = '';
    
    // Add days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const dayElement = createDayElement(new Date(year, month
