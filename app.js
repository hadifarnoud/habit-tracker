// DOM Elements
const homeView = document.getElementById('home-view');
const weeklyView = document.getElementById('weekly-view');
const habitLogView = document.getElementById('habit-log-view');
const addHabitView = document.getElementById('add-habit-view');
const habitList = document.getElementById('habit-list');
const weeklyGrid = document.getElementById('weekly-grid');
const habitLogList = document.getElementById('habit-log-list');
const habitLogTitle = document.getElementById('habit-log-title');
const addHabitForm = document.getElementById('add-habit-form');

// Navigation
document.getElementById('home-btn').addEventListener('click', showHomeView);
document.getElementById('weekly-btn').addEventListener('click', showWeeklyView);
document.getElementById('add-habit-btn').addEventListener('click', showAddHabitView);

// Data structure
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// View functions
function showHomeView() {
    hideAllViews();
    homeView.classList.remove('hidden');
    renderHabitList();
}

function showWeeklyView() {
    hideAllViews();
    weeklyView.classList.remove('hidden');
    renderWeeklyView();
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
    weeklyView.classList.add('hidden');
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
        `;
        div.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                showHabitLogView(habit);
            }
        });
        habitList.appendChild(div);
    });
}

function renderWeeklyView() {
    weeklyGrid.innerHTML = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'weekly-day';
        dayDiv.innerHTML = `
            <div>${days[i]}</div>
            <div>${date.getDate()}</div>
            <div class="habit-markers"></div>
        `;
        weeklyGrid.appendChild(dayDiv);

        const habitMarkers = dayDiv.querySelector('.habit-markers');
        habits.forEach(habit => {
            const hasEntry = habit.log.some(entry => {
                const entryDate = new Date(entry);
                return entryDate.toDateString() === date.toDateString();
            });
            if (hasEntry) {
                const marker = document.createElement('span');
                marker.className = `habit-marker ${habit.type}`;
                marker.style.backgroundColor = habit.color;
                habitMarkers.appendChild(marker);
            }
        });
    }
}

function renderHabitLog(habit) {
    habitLogTitle.textContent = `${habit.name} Log`;
    habitLogList.innerHTML = '';
    habit.log.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = new Date(entry).toLocaleString();
        habitLogList.appendChild(li);
    });
}

// Habit functions
function addHabit(event) {
    event.preventDefault();
    const name = document.getElementById('habit-name').value;
    const color = document.getElementById('habit-color').value;
    const type = document.querySelector('input[name="habit-type"]:checked').value;
    habits.push({ name, color, type, log: [] });
    saveHabits();
    showHomeView();
}

function trackHabit(index) {
    habits[index].log.push(new Date());
    saveHabits();
    renderHabitList();
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Event listeners
addHabitForm.addEventListener('submit', addHabit);

// Initial render
showHomeView();
