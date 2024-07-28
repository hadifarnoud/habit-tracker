const habitList = document.getElementById('habit-list');
const addHabitButton = document.getElementById('add-habit-button');
const habitFormModal = document.getElementById('habit-form-modal');
const habitForm = document.getElementById('habit-form');
const cancelButton = document.getElementById('cancel-button');
const calendar = document.getElementById('calendar');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayHabits();
    setupCalendar();
});

addHabitButton.addEventListener('click', () => {
    habitFormModal.classList.remove('hidden');
});

cancelButton.addEventListener('click', () => {
    habitFormModal.classList.add('hidden');
});

habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const habitName = document.getElementById('habit-name').value;
    const habitType = document.getElementById('habit-type').value;
    const habitColor = document.getElementById('habit-color').value;

    const habit = {
        id: Date.now().toString(),
        name: habitName,
        type: habitType,
        color: habitColor,
        history: []
    };

    habits.push(habit);
    localStorage.setItem('habits', JSON.stringify(habits));
    displayHabits();
    habitFormModal.classList.add('hidden');
    habitForm.reset();
});

function displayHabits() {
    habitList.innerHTML = '';
    habits.forEach(habit => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${habit.name}</span>
            <div>
                <button onclick="editHabit('${habit.id}')">Edit</button>
                <button onclick="deleteHabit('${habit.id}')">Delete</button>
            </div>
        `;
        habitList.appendChild(li);
    });
}

function editHabit(id) {
    const habit = habits.find(h => h.id === id);
    document.getElementById('habit-name').value = habit.name;
    document.getElementById('habit-type').value = habit.type;
    document.getElementById('habit-color').value = habit.color;
    habitFormModal.classList.remove('hidden');

    habitForm.addEventListener('submit', () => {
        habit.name = document.getElementById('habit-name').value;
        habit.type = document.getElementById('habit-type').value;
        habit.color = document.getElementById('habit-color').value;
        localStorage.setItem('habits', JSON.stringify(habits));
        displayHabits();
    }, { once: true });
}

function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);
    localStorage.setItem('habits', JSON.stringify(habits));
    displayHabits();
}

function setupCalendar() {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    calendar.innerHTML = '';
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'day';
        day.textContent = i;
        calendar.appendChild(day);
    }
}
