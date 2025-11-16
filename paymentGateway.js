// === Mock Payment Gateway ===
function processPayment() {
  const amt = document.getElementById("amount").value;
  const mode = document.getElementById("mode").value;
  const success = Math.random() > 0.2;
  if (success) {
    alert(`✅ ${mode} payment of ₹${amt} successful.`);
  } else {
    alert("❌ Transaction declined / gateway timeout.");
  }
}
