alert("JS chargé");
let currentUser = localStorage.getItem("user") || null;
let habits = [];

const today = new Date().toISOString().split("T")[0];
document.getElementById("date").innerText = "Aujourd'hui : " + today;

// LOGIN SIMPLE
function login() {
  alert("login cliqué");

  const username = document.getElementById("username").value;

  if (!username) {
    alert("Entre un nom !");
    return;
  }

  localStorage.setItem("user", username);
  currentUser = username;

  loadUserData();
}

// Charger données utilisateur
function loadUserData() {
  habits = JSON.parse(localStorage.getItem("habits_" + currentUser)) || [];
  render();
}

function save() {
  localStorage.setItem("habits_" + currentUser, JSON.stringify(habits));
}

// Ajouter habitude
function addHabit() {
  const input = document.getElementById("habitInput");

  habits.push({
    name: input.value,
    dates: {}
  });

  input.value = "";
  save();
  render();
}

// Toggle pour aujourd’hui
function toggleHabit(index) {
  const habit = habits[index];

  habit.dates[today] = !habit.dates[today];

  save();
  render();
}

// RESET automatique (juste visuel car date change)
function getStreak(dates) {
  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    if (dates[dateStr]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function render() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";

  habits.forEach((habit, index) => {
    const doneToday = habit.dates[today] || false;
    const streak = getStreak(habit.dates);

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="habit-item">
        <input type="checkbox" ${doneToday ? "checked" : ""} 
        onchange="toggleHabit(${index})">
        
        <span>${habit.name}</span>
        
        <span class="streak">🔥 ${streak}</span>
      </div>
    `;

    list.appendChild(li);
  });
}
if (currentUser) {
  loadUserData();
}
function login() {
  const username = document.getElementById("username").value;

  if (!username) {
    alert("Entre un nom !");
    return;
  }

  localStorage.setItem("user", username);
  currentUser = username;

  loadUserData();
}
