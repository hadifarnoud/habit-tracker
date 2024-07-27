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
    showTrackingSuccessMessage(habits[index].name);
}

function editHabit(index) {
    const habit = habits[index];
    document.getElementById('habit-name').value = habit.name;
    document.getElementById('habit-color').value = habit.color;
    document.querySelector(`input[name="habit-type"][value="${habit.type}"]`).checked = true;
    
    addHabitTitle.textContent = 'Edit Habit';
    habitSubmitBtn.textContent = 'Save Changes';
    
    addHabitForm.onsubmit = (event) => {
        event.preventDefault();
        habit.name = document.getElementById('habit-name').value;
        habit.color = document.getElementById('habit-color').value;
        habit.type = document.querySelector('input[name="habit-type"]:checked').value;
        saveHabits();
        resetAddHabitForm();
        showHomeView();
    };
    
    showAddHabitView();
}

function deleteHabit(index) {
    if (confirm('Are you sure you want to delete this habit?')) {
        habits.splice(index, 1);
        saveHabits();
        renderHabitList();
    }
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function resetAddHabitForm() {
    addHabitForm.reset();
    addHabitTitle.textContent = 'Add New Habit';
    habitSubmitBtn.textContent = 'Add Habit';
    addHabitForm.onsubmit = addHabit;
}

function showTrackingSuccessMessage(habitName) {
    const message = document.createElement('div');
    message.textContent = `${habitName} successfully tracked!`;
    message.className = 'success-message';
    document.body.appendChild(message);
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Initial render
showHomeView();