// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDr39wbDbC0pE5huN_izcfmr5f9ODA4qD0",
  authDomain: "habits-tracker-4ee66.firebaseapp.com",
  projectId: "habits-tracker-4ee66",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let user = null;
let habits = [];
let isPro = false;

const today = new Date().toISOString().split("T")[0];

// UI
function showAuth() {
  hero.classList.add("hidden");
  authDiv.classList.remove("hidden");
}

const hero = document.getElementById("hero");
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");

// AUTH
function signup() {
  auth.createUserWithEmailAndPassword(email.value, password.value);
}

function login() {
  auth.signInWithEmailAndPassword(email.value, password.value);
}

function logout() {
  auth.signOut();
}

// STATE
auth.onAuthStateChanged(async (u) => {
  if (u) {
    user = u;
    authDiv.classList.add("hidden");
    appDiv.classList.remove("hidden");
    loadData();
  }
});

// DATA
async function loadData() {
  const ref = db.collection("users").doc(user.uid);
  const doc = await ref.get();

  if (doc.exists) {
    habits = doc.data().habits || [];
    isPro = doc.data().isPro || false;
  }

  render();
}

function save() {
  db.collection("users").doc(user.uid).set({
    habits,
    isPro
  });
}

// HABITS
function addHabit() {
  if (!isPro && habits.length >= 5) return alert("Passe PRO");

  habits.push({ name: habitInput.value, dates: {} });
  habitInput.value = "";
  save();
  render();
}

function toggleHabit(i) {
  habits[i].dates[today] = !habits[i].dates[today];
  animate();
  save();
  render();
}

// ANIMATION
function animate() {
  document.body.style.transform = "scale(0.98)";
  setTimeout(() => {
    document.body.style.transform = "scale(1)";
  }, 150);
}

// PRO
function activatePro() {
  isPro = true;
  save();
  alert("PRO activé");
}

// RENDER
function render() {
  habitList.innerHTML = "";

  habits.forEach((h, i) => {
    habitList.innerHTML += `
      <div class="habit">
        <span>${h.name}</span>
        <input type="checkbox" ${h.dates[today] ? "checked" : ""} onclick="toggleHabit(${i})">
      </div>
    `;
  });
}
