alert("JS chargé");

let currentUser = localStorage.getItem("user") || null;
let habits = [];

const today = new Date().toISOString().split("T")[0];
document.getElementById("date").innerText = "Aujourd'hui : " + today;

// LOGIN
function login() {
  const username = document.getElementById("username").value;

  if (!username) {
    alert("Entre un nom !");
    return;
  }

  localStorage.setItem("user", username);
  currentUser = username;

  alert("Connecté en tant que " + username);

  loadUserData();
}

// Charger données
function loadUserData() {
  habits = JSON.parse(localStorage.getItem("habits_" + currentUser)) || [];

  // cacher input username
  document.getElementById("username").style.display = "none";

  render();
}

function save() {
  localStorage.setItem("habits_" + currentUser, JSON.stringify(habits));
}

// Ajouter habitude
function addHabit() {
  const input = document.getElementById("habitInput");

  if (!input.value) {
    alert("Entre une habitude !");
    return;
  }

  habits.push({
    name: input.value,
    dates: {}
  });

  input.value = "";
  save();
  render();
}

// Toggle
function toggleHabit(index) {
  const habit = habits[index];
  habit.dates[today] = !habit.dates[today];

  save();
  render();
}

// Streak
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

// Render
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

  // stats
  let doneCount = habits.filter(h => h.dates[today]).length;

  document.getElementById("stats").innerText =
    doneCount + " / " + habits.length + " habitudes faites aujourd’hui";
}

// auto load
if (currentUser) {
  loadUserData();
}
