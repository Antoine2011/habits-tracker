// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "MET_TA_VRAIE_API_KEY_ICI",
  authDomain: "habits-tracker-4ee66.firebaseapp.com",
  projectId: "habits-tracker-4ee66",
  storageBucket: "habits-tracker-4ee66.appspot.com",
  messagingSenderId: "MET_LE_VRAI_ID",
  appId: "MET_LE_VRAI_APP_ID"
};

// INIT
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ================= VARIABLES =================
let user = null;
let habits = [];
let isPro = false;

const today = new Date().toISOString().split("T")[0];


// ================= AUTH =================

// SIGNUP
function signup() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!email || !pass) {
    alert("Remplis tous les champs");
    return;
  }

  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => alert("Compte créé"))
    .catch(err => alert(err.message));
}

// LOGIN
function login() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  auth.signInWithEmailAndPassword(email, pass)
    .catch(err => alert(err.message));
}

// LOGOUT
function logout() {
  auth.signOut();
}


// ================= STATE =================

auth.onAuthStateChanged(async (u) => {
  if (u) {
    user = u;

    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";

    await loadData();
  } else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});


// ================= DATA =================

// LOAD USER DATA
async function loadData() {
  const ref = db.collection("users").doc(user.uid);
  const doc = await ref.get();

  if (doc.exists) {
    habits = doc.data().habits || [];
    isPro = doc.data().isPro || false;
  } else {
    await ref.set({
      habits: [],
      isPro: false
    });
    habits = [];
    isPro = false;
  }

  render();
}

// SAVE DATA
function save() {
  if (!user) return;

  db.collection("users").doc(user.uid).set({
    habits,
    isPro
  });
}


// ================= HABITS =================

// ADD
function addHabit() {
  const input = document.getElementById("habitInput");

  if (!input.value) return;

  if (!isPro && habits.length >= 5) {
    alert("Passe en PRO pour plus d’habitudes");
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

// DELETE
function deleteHabit(i) {
  habits.splice(i, 1);
  save();
  render();
}


// ================= STATS =================

// STREAK
function getStreak(dates) {
  let count = 0;
  let d = new Date();

  while (true) {
    const key = d.toISOString().split("T")[0];

    if (dates[key]) {
      count++;
      d.setDate(d.getDate() - 1);
    } else break;
  }

  return count;
}


// ================= UI =================

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
    div.className = "habit";

    div.innerHTML = `
      <input type="checkbox" ${h.dates[today] ? "checked" : ""} onchange="toggleHabit(${i})">
      <span>${h.name}</span>
      <span class="streak">🔥 ${streak}</span>
      <button onclick="deleteHabit(${i})">❌</button>
    `;

    list.appendChild(div);
  });

  let percent = habits.length
    ? Math.round((done / habits.length) * 100)
    : 0;

  document.getElementById("dashboard").innerHTML = `
    🔥 Record : ${best} jours <br>
    📊 Complétion : ${percent}% <br>
    🎯 Habitudes : ${habits.length}
  `;
}
