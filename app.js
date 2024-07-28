let habits = [];
let editingHabitId = null;

const habitList = document.getElementById('habit-list');
const addHabitBtn = document.getElementById('add-habit-btn');
const modal = document.getElementById('modal');
const habitForm = document.getElementById('habit-form');
const cancelBtn = document.getElementById('cancel-btn');
const homeBtn = document.getElementById('home-btn');
const monthlyBtn = document.getElementById('monthly-btn');
const homeSection = document.getElementById('home');
const monthlySection = document.getElementById('monthly-view');

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function loadHabits() {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
        habits = JSON.parse(storedHabits);
        renderHabits();
    }
}

function renderHabits() {
    habitList.innerHTML = '';
    habits.forEach(habit => {
        const li = document.createElement('li');
        const icon = document.createElement('span');
        icon.className = `habit-icon ${habit.type}-habit`;
        icon.style.backgroundColor = habit.color;
        
        li.innerHTML = `
            ${icon.outerHTML}
            ${habit.name}
            <div>
                <button onclick="editHabit('${habit.id}')">Edit</button>
                <button onclick="deleteHabit('${habit.id}')">Delete</button>
                <button onclick="trackHabit('${habit.id}')">Track</button>
            </div>
        `;
        habitList.appendChild(li);
    });
}

function addHabit(name, color, type) {
    const newHabit = {
        id: Date.now().toString(),
        name,
        color,
        type,
        tracks: []
    };
    habits.push(newHabit);
    saveHabits();
    renderHabits();
}

function editHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (habit) {
        document.getElementById('modal-title').textContent = 'Edit Habit';
        document.getElementById('habit-name').value = habit.name;
        document.getElementById('habit-color').value = habit.color;
        document.getElementById('habit-type').value = habit.type;
        editingHabitId = id;
        modal.style.display = 'block';
    }
}

function updateHabit(id, name, color, type) {
    const habitIndex = habits.findIndex(h => h.id === id);
    if (habitIndex !== -1) {
        habits[habitIndex] = { ...habits[habitIndex], name, color, type };
        saveHabits();
        renderHabits();
    }
}

function deleteHabit(id) {
    habits = habits.filter(habit => habit.id !== id);
    saveHabits();
    renderHabits();
}

function trackHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (habit) {
        const today = new Date().toISOString().split('T')[0];
        const trackIndex = habit.tracks.findIndex(track => track.date === today);
        if (trackIndex === -1) {
            habit.tracks.push({ date: today });
        } else {
            habit.tracks.splice(trackIndex, 1);
        }
        saveHabits();
        renderHabits();
    }
}

function renderMonthlyView() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendar.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        habits.forEach(habit => {
            const tracked = habit.tracks.some(track => track.date === date);
            if (tracked) {
                const trackElement = document.createElement('div');
                trackElement.className = `habit-track ${habit.type}-habit`;
                trackElement.style.backgroundColor = habit.color;
                dayElement.appendChild(trackElement);
            }
        });

        calendar.appendChild(dayElement);
    }
}

addHabitBtn.addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Add Habit';
    habitForm.reset();
    editingHabitId = null;
    modal.style.display = 'block';
});

habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('habit-name').value;
    const color = document.getElementById('habit-color').value;
    const type = document.getElementById('habit-type').value;

    if (editingHabitId) {
        updateHabit(editingHabitId, name, color, type);
    } else {
        addHabit(name, color, type);
    }

    modal.style.display = 'none';
    habitForm.reset();
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    habitForm.reset();
});

homeBtn.addEventListener('click', () => {
    homeSection.style.display = 'block';
    monthlySection.style.display = 'none';
});

monthlyBtn.addEventListener('click', () => {
    homeSection.style.display = 'none';
    monthlySection.style.display = 'block';
    renderMonthlyView();
});

window.addEventListener('load', () => {
    loadHabits();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
});