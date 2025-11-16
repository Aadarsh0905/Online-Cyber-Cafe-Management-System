// === Membership & Rewards ===
const plans = [
  { id: "hourly", name: "Hourly Pack", price: 80, points: 10 },
  { id: "monthly", name: "Monthly Plan", price: 1999, points: 200 }
];

function buyPlan(id) {
  const p = plans.find(pl => pl.id === id);
  if (!p) return alert("Invalid plan");
  if (confirm(`Mock pay ₹${p.price} for ${p.name}?`)) {
    localStorage.setItem("membership", JSON.stringify(p));
    alert(`✅ ${p.name} activated. ${p.points} reward points added.`);
  } else {
    alert("❌ Payment failed / invalid promo code");
  }
}

function showActivePlan() {
  const plan = JSON.parse(localStorage.getItem("membership"));
  if (plan) {
    document.getElementById("planInfo").textContent =
      `${plan.name} active — ${plan.points} points`;
  } else {
    document.getElementById("planInfo").textContent = "No active membership.";
  }
}
