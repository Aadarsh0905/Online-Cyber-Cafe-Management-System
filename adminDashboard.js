// === Admin Dashboard (Mock Reports) ===
function loginAdmin() {
  const pwd = document.getElementById("adminPass").value;
  if (pwd === "admin") {
    alert("✅ Admin logged in");
    renderReport();
  } else {
    alert("❌ Invalid password / insufficient permissions");
  }
}

function renderReport() {
  const canvas = document.getElementById("reportChart");
  const ctx = canvas.getContext("2d");
  const data = [5, 9, 7, 8, 10, 12]; // sample usage
  ctx.beginPath();
  ctx.moveTo(10, 150);
  data.forEach((v, i) => {
    ctx.lineTo(40 + i * 50, 150 - v * 10);
  });
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 2;
  ctx.stroke();
}
