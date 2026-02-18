import { registerClient } from "../services/authService.js";
import { setupPasswordValidator } from "../animations/password_validator.js";

// Input elements
const registerForm = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

// Error span elements
const emailError = document.getElementById("emailError");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmPasswordError");

const isPasswordValid = setupPasswordValidator(passwordInput, confirmInput);

const clearError = (input, errorSpan) => {
  input.classList.remove("ring-2", "ring-red-500", "focus:ring-red-500");
  if (errorSpan) {
    errorSpan.classList.add("hidden");
    errorSpan.innerText = "";
  }
};

function showError(input, span, msg) {
  input.classList.add("ring-2", "ring-red-500", "focus:ring-red-500");
  if (span) {
    span.innerText = msg;
    span.classList.remove("hidden");
  }
}

emailInput.addEventListener("input", () => clearError(emailInput, emailError));
usernameInput.addEventListener("input", () =>
  clearError(usernameInput, usernameError),
);
passwordInput.addEventListener("input", () =>
  clearError(passwordInput, passwordError),
);
confirmInput.addEventListener("input", () =>
  clearError(confirmInput, confirmError),
);

emailInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  const msg = emailInput.validity.valueMissing
    ? "Email tidak boleh kosong"
    : "Format email salah";
  showError(emailInput, emailError, msg);
});

usernameInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  showError(usernameInput, usernameError, "Username tidak boleh kosong");
});

passwordInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  showError(passwordInput, passwordError, "Kata sandi tidak boleh kosong");
});

confirmInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  showError(confirmInput, confirmError, "Konfirmasi kata sandi wajib diisi");
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!registerForm.reportValidity()) return;

  if (!isPasswordValid()) {
    showError(
      confirmInput,
      confirmError,
      "Syarat keamanan belum terpenuhi atau konfirmasi salah",
    );
    return;
  }

  try {
    const res = await registerClient({
      email: emailInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Registrasi Berhasil!");
      window.location.href = "login.html";
    } else {
      const message = data.message || "";
      if (message.toLowerCase().includes("email")) {
        showError(emailInput, emailError, message);
      } else if (message.toLowerCase().includes("username")) {
        showError(usernameInput, usernameError, message);
      } else if (message.toLowerCase().includes("password")) {
        showError(passwordInput, passwordError, message);
      } else {
        alert(message);
      }
    }
  } catch (err) {
    console.error(err);
    alert("Koneksi gagal: Server tidak merespon");
  }
});
