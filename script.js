let currentUser = localStorage.getItem("user") || null;
let habits = [];

const today = new Date().toISOString().split("T")[0];
document.getElementById("date").innerText = "Aujourd'hui : " + today;

// LOGIN SIMPLE
function login() {
  const username = document.getElementById("username").value;
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
function render() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";

  habits.forEach((habit, index) => {
    const doneToday = habit.dates[today] || false;

    const li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" ${doneToday ? "checked" : ""} 
      onchange="toggleHabit(${index})">
      ${habit.name}
    `;

    list.appendChild(li);
  });
}

// AUTO LOAD si déjà connecté
if (currentUser) {
  loadUserData();
}
