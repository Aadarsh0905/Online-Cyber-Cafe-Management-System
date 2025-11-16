// === Workstation Booking & Session Management ===
let workstations = Array.from({ length: 8 }, (_, i) => ({ id: "WS" + (i + 1), busy: false }));
let sessions = [];

// show available workstations
function renderWorkstations() {
  const grid = document.getElementById("wsGrid");
  grid.innerHTML = "";
  workstations.forEach(ws => {
    const div = document.createElement("div");
    div.textContent = ws.id + (ws.busy ? " (Busy)" : " (Free)");
    grid.append(div);
  });
}

// book a workstation
function bookWorkstation() {
  const id = document.getElementById("selectWS").value;
  const duration = parseInt(document.getElementById("duration").value);
  const ws = workstations.find(w => w.id === id);
  if (ws.busy) return alert("❌ Workstation unavailable");
  
  ws.busy = true;
  const end = Date.now() + duration * 60000;
  sessions.push({ id, end, remaining: duration });
  alert("✅ " + id + " booked for " + duration + " minutes");
  renderWorkstations();
}

// auto-update sessions every minute
setInterval(() => {
  const now = Date.now();
  sessions.forEach(s => {
    s.remaining = Math.max(0, Math.ceil((s.end - now) / 60000));
    if (s.remaining <= 0) {
      const ws = workstations.find(w => w.id === s.id);
      ws.busy = false;
      alert(`⌛ Session ended for ${s.id}`);
    }
  });
  renderWorkstations();
}, 60000);
