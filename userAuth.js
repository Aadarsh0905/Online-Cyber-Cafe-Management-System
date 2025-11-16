// === User Registration & OTP Authentication ===
// Inputs: name, email/phone, OTP; Output: success message or errors

let otpSent = null;

function sendOTP() {
  const emailOrPhone = document.getElementById("userEmail").value.trim();
  if (!emailOrPhone) return alert("Enter email or phone");
  
  // simulate sending OTP
  otpSent = Math.floor(100000 + Math.random() * 900000);
  alert("OTP sent (demo): " + otpSent);
}

function verifyOTP() {
  const otpEntered = document.getElementById("userOTP").value;
  if (otpEntered == otpSent) {
    alert("✅ Registration Successful!");
    localStorage.setItem("user", JSON.stringify({
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value
    }));
  } else {
    alert("❌ Invalid OTP or timeout");
  }
}

// === Biometric Authentication Simulation ===
function biometricLogin() {
  if (confirm("Use device biometric? (Demo simulation)")) {
    alert("✅ Biometric authentication successful");
  } else {
    alert("❌ Biometric mismatch or unsupported device");
  }
}
