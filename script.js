document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || !email || !phone) {
    alert("Please fill all fields");
    return;
  }

  // Simulated backend call
  document.getElementById('responseMsg').textContent = "OTP sent to " + phone;
  document.getElementById('otpSection').classList.remove('hidden');
});

document.getElementById('verifyOtp').addEventListener('click', function() {
  const otp = document.getElementById('otp').value.trim();
  if (otp === "1234") {
    document.getElementById('responseMsg').textContent = "Registration successful ✅";
    document.getElementById('otpSection').classList.add('hidden');
  } else {
    document.getElementById('responseMsg').textContent = "Invalid OTP ❌";
  }
});
