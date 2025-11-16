// === Remote Control Simulation ===
function remoteControl(action) {
  const ws = document.getElementById("wsSelect").value;
  const success = Math.random() < 0.9;
  if (success) {
    alert(`✅ ${action} executed on ${ws}`);
  } else {
    alert(`❌ ${action} failed (network error)`);
  }
}
