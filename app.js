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
const addHabitTitle = document.getElementById('add-habit-title');
const habitSubmitBtn = document.getElementById('habit-submit-btn');

// Navigation
document.getElementById('home-btn').addEventListener('click', showHomeView);
document.getElementById('monthly-btn').addEventListener('click', showMonthlyView);
document.getElementById('add-habit-btn').addEventListener('click', showAddHabitView);

// Data structure
let habits = JSON.parse(localStorage.getItem('habits')) || [];

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
    resetAddHabitForm();
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
    monthlyGrid.innerHTML = '';
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'monthly-day empty';
        monthlyGrid.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'monthly-day';
        dayDiv.innerHTML = `
            <div>${i}</div>
            <div class="habit-markers"></div>
        `;
        monthlyGrid.appendChild(dayDiv);

        const habitMarkers = dayDiv.querySelector('.habit-markers');
        habits.forEach(habit => {
            const hasEntry = habit.log.some(entry => {
                const entryDate = new Date(entry);
                return entryDate.toDateString() === date.to
