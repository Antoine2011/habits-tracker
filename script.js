// =============================
// 🔥 INIT
// =============================
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let isPro = localStorage.getItem("pro") === "true";

const today = new Date().toISOString().split("T")[0];

// =============================
// 💳 STRIPE SUCCESS
// =============================
const params = new URLSearchParams(window.location.search);

if (params.get("success") === "true") {
  isPro = true;
  localStorage.setItem("pro", "true");

  alert("👑 Paiement réussi ! PRO activé !");
}

// =============================
// 💬 QUOTES
// =============================
const quotes = [
  "🔥 Discipline = liberté",
  "💪 1% better every day",
  "🚀 No excuses",
  "🏆 Stay consistent",
  "⏳ Small steps every day"
];

document.getElementById("quote").innerText =
  quotes[Math.floor(Math.random() * quotes.length)];


// =============================
// 💾 SAVE
// =============================
function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// =============================
// ➕ ADD HABIT
// =============================
function addHabit() {
  const input = document.getElementById("habitInput");

  if (!input.value) return alert("Entre une habitude !");

  // 🔒 LIMIT FREE
  if (!isPro && habits.length >= 5) {
    showPaywall();
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

// =============================
// 🔓 PAYWALL
// =============================
function showPaywall() {
  document.getElementById("paywall").classList.remove("hidden");
}

function closePaywall() {
  document.getElementById("paywall").classList.add("hidden");
}

// =============================
// ✅ TOGGLE HABIT (ANIMATION)
// =============================
function toggleHabit(i) {
  habits[i].dates[today] = !habits[i].dates[today];

  const items = document.querySelectorAll(".habit");

  if (items[i]) {
    items[i].style.transform = "scale(1.1)";
    setTimeout(() => {
      items[i].style.transform = "scale(1)";
    }, 150);
  }

  save();
  render();
}

// =============================
// 🔥 STREAK
// =============================
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

// =============================
// 🎨 RENDER
// =============================
function render() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";

  let done = habits.filter(h => h.dates[today]).length;

  // 📊 Stats
  document.getElementById("stats").innerText =
    `${done}/${habits.length} aujourd’hui`;

  document.getElementById("progress").style.width =
    (habits.length ? (done / habits.length) * 100 : 0) + "%";

  let best = 0;

  habits.forEach((h, i) => {
    const streak = getStreak(h.dates);
    if (streak > best) best = streak;

    const div = document.createElement("div");
    div.className = "habit";

    // 🔥 highlight streak
    if (streak >= 5) {
      div.style.border = "1px solid orange";
    }

    div.innerHTML = `
      <input type="checkbox" ${h.dates[today] ? "checked" : ""} 
      onchange="toggleHabit(${i})">
      <span>${h.name}</span>
      <span class="streak">🔥 ${streak}</span>
    `;

    list.appendChild(div);
  });

  let total = habits.length;
  let percent = total ? Math.round((done / total) * 100) : 0;

  // 📈 STATS PRO
  let weekly = habits.reduce((acc, h) => {
    for (let i = 0; i < 7; i++) {
      let d = new Date();
      d.setDate(d.getDate() - i);
      let key = d.toISOString().split("T")[0];
      if (h.dates[key]) acc++;
    }
    return acc;
  }, 0);

  // 📊 Dashboard
  document.getElementById("dashboard").innerHTML = `
    🔥 Record : ${best} jours <br>
    📊 Complétion : ${percent}% <br>
    🎯 Habitudes : ${total} <br>
    ${isPro ? "📈 Cette semaine : " + weekly : "🔒 Stats PRO"}
  `;

  // 🎉 PERFECT DAY
  if (done === habits.length && habits.length > 0) {
    setTimeout(() => {
      alert("🎉 Journée parfaite !");
    }, 200);
  }

  // 👑 UI PRO
  if (isPro) {
    const premiumBox = document.querySelector(".premium");
    if (premiumBox) premiumBox.style.display = "none";
  }
}

// =============================
// 🚀 INIT
// =============================
render();
