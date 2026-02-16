import { registerPsikiater } from "../services/authService.js";
import { setupPasswordValidator } from "../animations/password_validator.js";

const registerForm = document.getElementById("registerForm");
const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const isPasswordValid = setupPasswordValidator(passwordInput, confirmPassword);

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!isPasswordValid()) return;

  const email = document.getElementById("email").value;
  const namaLengkap = document.getElementById("namaLengkap").value;
  const noStr = document.getElementById("noStr").value;
  const nomorWa = document.getElementById("noWa").value;
  const password = passwordInput.value;

  try {
    const res = await registerPsikiater({
      email,
      namaLengkap,
      noStr,
      nomorWa,
      password,
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Register sukses");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Register gagal");
    }
  } catch (err) {
    alert("Server tidak bisa diakses");
  }
});
