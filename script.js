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

// AJOUT HABITUDE AVEC CATÉGORIE
function addHabit() {
  const input = document.getElementById("habitInput");

  if (!input.value) {
    alert("Entre une habitude !");
    return;
  }

  const category = prompt("Catégorie ? (travail, sport, perso...)");

  habits.push({
    name: input.value,
    category: category || "Autre",
    dates: {}
  });

  input.value = "";
  save();
  render();
}

// TOGGLE
function toggleHabit(index) {
  const habit = habits[index];
  habit.dates[today] = !habit.dates[today];

  save();
  render();
}

// STREAK
function getStreak(dates) {
  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    if (dates[dateStr]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else break;
  }

  return streak;
}

// RENDER AVEC CATÉGORIES
function render() {
  const container = document.getElementById("habitList");
  container.innerHTML = "";

  const categories = {};

  habits.forEach((habit, index) => {
    if (!categories[habit.category]) {
      categories[habit.category] = [];
    }
    categories[habit.category].push({ habit, index });
  });

  let doneCount = habits.filter(h => h.dates[today]).length;

  document.getElementById("stats").innerText =
    doneCount + " / " + habits.length + " habitudes faites aujourd’hui";

  let percent = habits.length ? (doneCount / habits.length) * 100 : 0;
  document.getElementById("progress").style.width = percent + "%";

  for (let category in categories) {
    const card = document.createElement("div");
    card.className = "category-card";

    const title = document.createElement("h3");
    title.innerText = category;

    card.appendChild(title);

    categories[category].forEach(({ habit, index }) => {
      const doneToday = habit.dates[today] || false;
      const streak = getStreak(habit.dates);

      const item = document.createElement("div");
      item.className = "habit-item";

      item.innerHTML = `
        <input type="checkbox" ${doneToday ? "checked" : ""} 
        onchange="toggleHabit(${index})">
        
        <span>${habit.name}</span>
        
        <span class="streak">🔥 ${streak}</span>
      `;

      card.appendChild(item);
    });

    container.appendChild(card);
  }
}

// AUTO LOAD
if (currentUser) {
  loadUserData();
}
