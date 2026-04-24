// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "habits-tracker-4ee66.firebaseapp.com",
  projectId: "habits-tracker-4ee66"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let user = null;
let habits = [];
let isPro = false;

const today = new Date().toISOString().split("T")[0];

// SIGNUP
function signup() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => alert("Compte créé !"))
    .catch(err => alert(err.message));
}

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, pass)
    .catch(err => alert(err.message));
}

// STATE
auth.onAuthStateChanged(u => {
  if (u) {
    user = u;
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadData();
  }
});

// LOAD
async function loadData() {
  const doc = await db.collection("users").doc(user.uid).get();

  if (doc.exists) {
    habits = doc.data().habits || [];
    isPro = doc.data().isPro || false;
  }

  render();
}

// SAVE
function save() {
  db.collection("users").doc(user.uid).set({
    habits,
    isPro
  });
}

// ADD
function addHabit() {
  const input = document.getElementById("habitInput");

  if (!input.value) return alert("Entre une habitude !");

  if (!isPro && habits.length >= 5) {
    alert("🚀 Passe en PRO pour ajouter plus d’habitudes !");
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

  document.getElementById("stats").innerText =
    `${done}/${habits.length} aujourd’hui`;

  document.getElementById("progress").style.width =
    (habits.length ? (done / habits.length) * 100 : 0) + "%";

  let best = 0;

  habits.forEach((h, i) => {
    const streak = getStreak(h.dates);
    if (streak > best) best = streak;

    const div = document.createElement("div");
    div.className = "habit-item";

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

  document.getElementById("dashboard").innerHTML = `
    🔥 Record : ${best} jours <br>
    📊 Complétion : ${percent}% <br>
    🎯 Habitudes : ${total}
  `;

  // 👑 STATUS PRO
  document.getElementById("proStatus").innerText =
    isPro ? "👑 Compte PRO" : "🆓 Version gratuite";
}
