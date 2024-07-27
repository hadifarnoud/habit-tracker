// ... (previous code remains the same) ...

// DOM Elements (add these)
const monthlyView = document.getElementById('monthly-view');
const monthlyGrid = document.getElementById('monthly-grid');
const currentMonthSpan = document.getElementById('current-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const habitLegend = document.getElementById('habit-legend');

// Navigation (update this)
document.getElementById('monthly-btn').addEventListener('click', showMonthlyView);

// Current date for monthly view
let currentDate = new Date();

// View functions (add this)
function showMonthlyView() {
    hideAllViews();
    monthlyView.classList.remove('hidden');
    renderMonthlyView();
}

// Render functions (add this)
function renderMonthlyView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthSpan.textContent = `${getMonthName(month)} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    monthlyGrid.innerHTML = '';
    
    // Add days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const dayElement = createDayElement(new Date(year, month, -i), true);
        monthlyGrid.prepend(dayElement);
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = createDayElement(new Date(year, month, i));
        monthlyGrid.appendChild(dayElement);
    }
    
    // Add days from next month
    const remainingCells = 42 - monthlyGrid.children.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = createDayElement(new Date(year, month + 1, i), true);
        monthlyGrid.appendChild(dayElement);
    }
    
    renderHabitLegend();
}

function createDayElement(date, isOtherMonth = false) {
    const dayElement = document.createElement('div');
    dayElement.className = `monthly-day${isOtherMonth ? ' other-month' : ''}`;
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'monthly-day-number';
    dayNumber.textContent = date.getDate();
    dayElement.appendChild(dayNumber);
    
    const habitMarkers = document.createElement('div');
    habitMarkers.className = 'habit-markers';
    dayElement.appendChild(habitMarkers);
    
    habits.forEach(habit => {
        if (habit.log.some(entry => isSameDay(new Date(entry), date))) {
            const marker = document.createElement('div');
            marker.className = `habit-marker ${habit.type}`;
            marker.style.backgroundColor = habit.color;
            habitMarkers.appendChild(marker);
        }
    });
    
    return dayElement;
}

function renderHabitLegend() {
    habitLegend.innerHTML = '';
    habits.forEach(habit => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorSquare = document.createElement('div');
        colorSquare.className = 'legend-color';
        colorSquare.style.backgroundColor = habit.color;
        
        const habitName = document.createElement('span');
        habitName.textContent = habit.name;
        
        legendItem.appendChild(colorSquare);
        legendItem.appendChild(habitName);
        habitLegend.appendChild(legendItem);
    });
}

// Helper functions
function getMonthName(monthIndex) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Event listeners for month navigation
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderMonthlyView();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderMonthlyView();
});

// ... (rest of the code remains the same) ...
