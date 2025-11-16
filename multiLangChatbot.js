// === Multi-Language UI ===
const translations = {
  en: { welcome: "Welcome", help: "You can book a PC online." },
  hi: { welcome: "स्वागत है", help: "आप पीसी ऑनलाइन बुक कर सकते हैं।" }
};

function changeLanguage(lang) {
  document.getElementById("title").textContent = translations[lang].welcome;
}

function chatbotResponse() {
  const q = document.getElementById("chatInput").value.toLowerCase();
  let ans = "🤖 I didn't understand.";
  if (q.includes("book") || q.includes("बुक"))
    ans = translations[document.getElementById("lang").value].help;
  document.getElementById("bot").textContent = ans;
}
