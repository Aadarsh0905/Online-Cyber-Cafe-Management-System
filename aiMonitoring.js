// === AI Monitoring Simulation ===
function aiMonitor() {
  setInterval(() => {
    if (Math.random() < 0.2) {
      const ws = "WS" + (1 + Math.floor(Math.random() * 5));
      console.log(`⚠️ AI Alert: ${ws} idle for 10+ mins (demo)`);
    }
  }, 3000);
}
aiMonitor();
