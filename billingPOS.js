// === POS Billing Simulation ===
const menuItems = [
  { name: "Tea", price: 20 },
  { name: "Coffee", price: 35 },
  { name: "Sandwich", price: 60 }
];
let cart = [];

function addToCart(name) {
  const item = menuItems.find(m => m.name === name);
  cart.push(item);
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart");
  list.innerHTML = "";
  let total = 0;
  cart.forEach(i => {
    total += i.price;
    const li = document.createElement("li");
    li.textContent = `${i.name} - ₹${i.price}`;
    list.append(li);
  });
  document.getElementById("total").textContent = total;
}

function processPayment() {
  const total = cart.reduce((s, i) => s + i.price, 0);
  if (confirm(`Pay ₹${total} using mock gateway?`)) {
    alert("✅ Payment Success. Receipt sent via email (demo)");
    cart = [];
    renderCart();
  } else {
    alert("❌ Payment failed / timeout");
  }
}
