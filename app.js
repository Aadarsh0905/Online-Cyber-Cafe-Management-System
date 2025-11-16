/* ===========================================================
   CYBER CAFE CLOUD SUITE (Frontend Demo)
   File: app.js
   Author: Aadarsh Ranjan
   Description:
   Integrated front-end JavaScript for all major functional
   requirements (3.2.1–3.2.10) of the Cyber Café Management System.
   Pure HTML + CSS + JS | No backend | No frameworks.
   =========================================================== */


/* ===========================================================
   3.2.1 USER REGISTRATION & AUTHENTICATION + BIOMETRIC LOGIN
   =========================================================== */

let generatedOTP = null;
let registeredUsers = JSON.parse(localStorage.getItem("users") || "[]");

function sendOTP() {
  const name = document.getElementById("userName")?.value.trim();
  const contact = document.getElementById("userEmail")?.value.trim();

  if (!name || !contact) return showMsg("authMsg", "⚠️ Enter name and email/phone first.");

  const exists = registeredUsers.some(u => u.contact === contact);
  if (exists) return showMsg("authMsg", "❌ User already registered.");

  generatedOTP = Math.floor(100000 + Math.random() * 900000);
  showMsg("authMsg", `📩 OTP sent to ${contact} (Demo: ${generatedOTP})`);
}

function verifyOTP() {
  const entered = document.getElementById("userOTP")?.value.trim();
  if (!generatedOTP) return showMsg("authMsg", "⚠️ Request OTP first.");

  if (entered == generatedOTP) {
    const user = {
      name: document.getElementById("userName").value.trim(),
      contact: document.getElementById("userEmail").value.trim(),
      registeredAt: new Date().toISOString()
    };
    registeredUsers.push(user);
    localStorage.setItem("users", JSON.stringify(registeredUsers));
    showMsg("authMsg", `✅ Welcome, ${user.name}. Registration successful.`);
    generatedOTP = null;
  } else showMsg("authMsg", "❌ Invalid OTP or timeout.");
}

function biometricLogin() {
  if (confirm("Use biometric login (demo)?")) {
    const saved = registeredUsers[0];
    if (saved) showMsg("authMsg", `✅ Logged in as ${saved.name}`);
    else showMsg("authMsg", "⚠️ No registered users found.");
  } else showMsg("authMsg", "❌ Biometric mismatch / unsupported device.");
}


/* ===========================================================
   3.2.2 WORKSTATION BOOKING & SESSION MANAGEMENT
   =========================================================== */

let workstations = Array.from({ length: 6 }, (_, i) => ({ id: "WS" + (i + 1), busy: false }));
let sessions = [];

function renderWorkstations() {
  const grid = document.getElementById("wsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  workstations.forEach(ws => {
    const div = document.createElement("div");
    div.className = "ws-card";
    div.textContent = ws.id + (ws.busy ? " (Busy)" : " (Free)");
    grid.append(div);
  });
}

function bookWorkstation() {
  const id = document.getElementById("selectWS")?.value;
  const duration = parseInt(document.getElementById("duration")?.value || 60);
  const ws = workstations.find(w => w.id === id);
  if (!ws) return alert("Invalid workstation ID.");
  if (ws.busy) return alert("❌ Workstation unavailable.");

  ws.busy = true;
  const end = Date.now() + duration * 60000;
  sessions.push({ id, end });
  alert(`✅ ${id} booked for ${duration} minutes.`);
  renderWorkstations();
}

setInterval(() => {
  const now = Date.now();
  sessions.forEach(s => {
    if (now >= s.end) {
      const ws = workstations.find(w => w.id === s.id);
      if (ws) ws.busy = false;
      alert(`⌛ Session expired for ${s.id}`);
    }
  });
  renderWorkstations();
}, 60000);


/* ===========================================================
   3.2.3 AUTOMATED BILLING AND POS INTEGRATION
   =========================================================== */

const menuItems = [
  { name: "Tea", price: 20 },
  { name: "Coffee", price: 30 },
  { name: "Sandwich", price: 70 }
];
let cart = [];

function addToCart(name) {
  const item = menuItems.find(m => m.name === name);
  if (!item) return;
  cart.push(item);
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart");
  const totalEl = document.getElementById("total");
  if (!list) return;
  list.innerHTML = "";
  let total = 0;
  cart.forEach(i => {
    total += i.price;
    const li = document.createElement("li");
    li.textContent = `${i.name} ₹${i.price}`;
    list.append(li);
  });
  if (totalEl) totalEl.textContent = total;
}

function processPayment() {
  const total = cart.reduce((s, i) => s + i.price, 0);
  if (confirm(`Mock pay ₹${total}?`)) {
    alert("✅ Payment Successful (mock)");
    cart = [];
    renderCart();
  } else alert("❌ Payment failed / gateway timeout");
}


/* ===========================================================
   3.2.4 MEMBERSHIP PLANS & LOYALTY REWARDS
   =========================================================== */

const plans = [
  { id: "hourly", name: "Hourly Plan", price: 80, points: 8 },
  { id: "monthly", name: "Monthly Plan", price: 1999, points: 200 }
];

function buyPlan(id) {
  const plan = plans.find(p => p.id === id);
  if (!plan) return alert("Invalid plan");
  if (confirm(`Mock pay ₹${plan.price} for ${plan.name}?`)) {
    localStorage.setItem("membership", JSON.stringify(plan));
    alert(`✅ ${plan.name} activated with ${plan.points} reward points.`);
  } else alert("❌ Payment failed");
}

function showActivePlan() {
  const plan = JSON.parse(localStorage.getItem("membership"));
  const el = document.getElementById("planInfo");
  if (el) el.textContent = plan ? `${plan.name} active – ${plan.points} pts` : "No active plan.";
}


/* ===========================================================
   3.2.5 ADMIN DASHBOARD & REPORTING
   =========================================================== */

function loginAdmin() {
  const pwd = document.getElementById("adminPass")?.value;
  if (pwd === "admin") {
    alert("✅ Admin logged in");
    renderReport();
  } else alert("❌ Invalid password");
}

function renderReport() {
  const canvas = document.getElementById("reportChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const data = [5, 9, 7, 8, 10, 12];
  ctx.beginPath();
  ctx.moveTo(10, 150);
  data.forEach((v, i) => ctx.lineTo(40 + i * 50, 150 - v * 10));
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 2;
  ctx.stroke();
}


/* ===========================================================
   3.2.6 AI-POWERED MONITORING & ANALYTICS
   =========================================================== */

function aiMonitor() {
  setInterval(() => {
    if (Math.random() < 0.25) {
      const ws = "WS" + (1 + Math.floor(Math.random() * 5));
      console.log(`⚠️ AI Alert: Idle system detected on ${ws}`);
    }
  }, 5000);
}
aiMonitor();


/* ===========================================================
   3.2.7 REMOTE WORKSTATION CONTROL
   =========================================================== */

function remoteAction(action) {
  const ws = document.getElementById("remoteWS")?.value;
  if (!ws) return alert("Select workstation");
  if (Math.random() < 0.9) alert(`✅ ${action} executed on ${ws}`);
  else alert(`❌ ${action} failed due to network error`);
}


/* ===========================================================
   3.2.8 GAMING LIBRARY & AUTO-UPDATES
   =========================================================== */

let games = [
  { name: "Counter Strike", version: 1.1 },
  { name: "Dota 2", version: 2.0 }
];

function updateGame(name) {
  const g = games.find(x => x.name === name);
  if (!g) return;
  g.version += 0.1;
  alert(`${name} updated to v${g.version.toFixed(1)}`);
}

function launchGame(name) {
  alert(`🎮 Launching ${name} (Demo Mode)`);
}


/* ===========================================================
   3.2.9 MULTI-LANGUAGE UI & VOICE CHATBOT
   =========================================================== */

const translations = {
  en: { welcome: "Welcome", help: "You can book a PC online." },
  hi: { welcome: "स्वागत है", help: "आप पीसी ऑनलाइन बुक कर सकते हैं।" }
};

function changeLanguage(lang) {
  const title = document.getElementById("title");
  if (title) title.textContent = translations[lang].welcome;
}

function chatbotResponse() {
  const input = document.getElementById("chatInput")?.value.toLowerCase();
  const lang = document.getElementById("lang")?.value || "en";
  const ansEl = document.getElementById("bot");
  if (!input) return;
  let ans = "🤖 Sorry, I didn’t understand that.";
  if (input.includes("book") || input.includes("बुक")) ans = translations[lang].help;
  if (ansEl) ansEl.textContent = ans;
}


/* ===========================================================
   3.2.10 SECURE PAYMENT GATEWAY (Mock)
   =========================================================== */

function processGatewayPayment() {
  const amt = document.getElementById("amount")?.value;
  const mode = document.getElementById("mode")?.value;
  if (!amt) return alert("Enter amount");
  const ok = Math.random() > 0.2;
  if (ok) alert(`✅ ${mode} payment of ₹${amt} successful.`);
  else alert("❌ Transaction declined or timed out.");
}


/* ===========================================================
   HELPER FUNCTION FOR ALL MODULES
   =========================================================== */
function showMsg(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
  else console.log(msg);
}
