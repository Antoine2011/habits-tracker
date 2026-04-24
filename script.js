let currentUser = localStorage.getItem("user") || null;
let habits = [];

const today = new Date().toISOString().split("T")[0];
document.getElementById("date").innerText = "Aujourd'hui : " + today;

const categoryIcons = {
  travail: "💼",
  sport: "🏋️",
  perso: "🌿",
  etudes: "📚",
  autre: "✨"
};

const categoryColors = {
  travail: "#3b82f6",
  sport: "#ef4444",
  perso: "#22c55e",
  etudes: "#a855f7",
  autre: "#f59e0b"
};

// LOGIN
function login() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Entre un nom !");
  localStorage.setItem("user", username);
  currentUser = username;
  loadUserData();
}

function loadUserData() {
  habits = JSON.parse(localStorage.getItem("habits_" + currentUser)) || [];
  document.getElementById("username").style.display = "none";
  document.querySelector("button").style.display = "none";
  render();
}

function save() {
  localStorage.setItem("habits_" + currentUser, JSON.stringify(habits));
}

// ADD
function addHabit() {
  const input = document.getElementById("habitInput");
  if (!input.value) return alert("Entre une habitude !");

  let category = prompt("Catégorie (travail, sport, perso...)");
  category = category ? category.toLowerCase() : "autre";

  habits.push({
    name: input.value,
    category,
    dates: {}
  });

  input.value = "";
  save();
  render();
}

// TOGGLE
function toggleHabit(index) {
  habits[index].dates[today] = !habits[index].dates[today];
  save();
  render();
}

// DRAG
let dragIndex = null;

function dragStart(index) {
  dragIndex = index;
}

function drop(index) {
  const temp = habits[dragIndex];
  habits.splice(dragIndex, 1);
  habits.splice(index, 0, temp);
  save();
  render();
}

// STREAK
function getStreak(dates) {
  let streak = 0;
  let d = new Date();

  while (true) {
    const key = d.toISOString().split("T")[0];
    if (dates[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }

  return streak;
}

// RENDER
function render() {
  const container = document.getElementById("habitList");
  container.innerHTML = "";

  let doneCount = habits.filter(h => h.dates[today]).length;

  document.getElementById("stats").innerText =
    `${doneCount} / ${habits.length} aujourd’hui`;

  let percent = habits.length ? (doneCount / habits.length) * 100 : 0;
  document.getElementById("progress").style.width = percent + "%";

  habits.forEach((habit, index) => {
    const done = habit.dates[today];
    const streak = getStreak(habit.dates);

    const color = categoryColors[habit.category] || "#f59e0b";
    const icon = categoryIcons[habit.category] || "✨";

    const item = document.createElement("div");
    item.className = "habit-item";
    item.draggable = true;

    item.ondragstart = () => dragStart(index);
    item.ondragover = (e) => e.preventDefault();
    item.ondrop = () => drop(index);

    item.innerHTML = `
      <div class="left">
        <span class="icon" style="background:${color}">${icon}</span>
        <input type="checkbox" ${done ? "checked" : ""} onchange="toggleHabit(${index})">
        <span>${habit.name}</span>
      </div>

      <span class="streak">🔥 ${streak}</span>
    `;

    container.appendChild(item);
  });
}

// AUTO LOAD
if (currentUser) loadUserData();
