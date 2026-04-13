import { registerClient } from "../services/auth_service.js";
import { setupPasswordValidator } from "../utils/password_validator.js";

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

  // Visual Loading State
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg> Menyiapkan Akun...
  `;

  try {
    const res = await registerClient({
      email: emailInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("registerContainer").classList.add("hidden");
      document.getElementById("successState").classList.remove("hidden");
    } else {
      // Revert loading state on error
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

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
    // Revert loading state on catch
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    console.error(err);
    alert("Koneksi gagal: Server tidak merespon");
  }
});
