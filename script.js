let currentUser = localStorage.getItem("user") || null;
let habits = [];

const today = new Date().toISOString().split("T")[0];

// LOGIN
function login() {
  const username = document.getElementById("username").value;

  if (!username) return alert("Entre un nom");

  currentUser = username;
  localStorage.setItem("user", username);

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("appContent").style.display = "block";

  loadData();
}

// LOAD
function loadData() {
  habits = JSON.parse(localStorage.getItem("habits_" + currentUser)) || [];
  render();
}

// SAVE
function save() {
  localStorage.setItem("habits_" + currentUser, JSON.stringify(habits));
}

// ADD
function addHabit() {
  const input = document.getElementById("habitInput");

  if (!input.value) return alert("Entre une habitude");

  if (habits.length >= 5) {
    alert("Version gratuite limitée à 5 😎");
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

// TOGGLE
function toggleHabit(i) {
  habits[i].dates[today] = !habits[i].dates[today];
  save();
  render();
}

// STREAK
function getStreak(dates) {
  let s = 0;
  let d = new Date();

  while (true) {
    let key = d.toISOString().split("T")[0];
    if (dates[key]) {
      s++;
      d.setDate(d.getDate() - 1);
    } else break;
  }

  return s;
}

// RENDER
function render() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";

  let done = habits.filter(h => h.dates[today]).length;
  let best = 0;

  habits.forEach((h, i) => {
    let streak = getStreak(h.dates);
    if (streak > best) best = streak;

    const div = document.createElement("div");
    div.className = "habit";

    div.innerHTML = `
      <input type="checkbox" ${h.dates[today] ? "checked" : ""} 
      onchange="toggleHabit(${i})">
      <span>${h.name}</span>
      <span class="streak">🔥 ${streak}</span>
    `;

    list.appendChild(div);
  });

  let percent = habits.length ? Math.round((done / habits.length) * 100) : 0;

  document.getElementById("stats").innerText =
    `${done}/${habits.length} aujourd’hui (${percent}%)`;

  document.getElementById("progress").style.width = percent + "%";

  document.getElementById("dashboard").innerHTML = `
    🔥 Record : ${best} jours <br>
    🎯 Habitudes : ${habits.length}
  `;
}

// AUTO LOGIN
if (currentUser) {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("appContent").style.display = "block";
  loadData();
}
