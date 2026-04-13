import { resetPassword } from "../services/auth_service.js";

const resetPasswordForm = document.getElementById("resetPasswordForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const matchError = document.getElementById("matchError");

// Ambil token dari URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

if (!token) {
  alert(
    "Token tidak ditemukan. Silakan gunakan link dari email pemulihan Anda.",
  );
  window.location.href = "login.html";
}

window.togglePassword = function (inputId, closedIconId, openIconId) {
  const input = document.getElementById(inputId);
  const eyeClosed = document.getElementById(closedIconId);
  const eyeOpen = document.getElementById(openIconId);

  if (input.type === "password") {
    input.type = "text";
    eyeOpen.classList.remove("hidden");
    eyeClosed.classList.add("hidden");
  } else {
    input.type = "password";
    eyeOpen.classList.add("hidden");
    eyeClosed.classList.remove("hidden");
  }
};

const clearError = (input, errorSpan) => {
  input.classList.remove("ring-2", "ring-red-500", "focus:ring-red-500");
  errorSpan.classList.add("hidden");
};

function showError(input, span, msg) {
  input.classList.add("ring-2", "ring-red-500", "focus:ring-red-500");
  span.innerText = msg;
  span.classList.remove("hidden");
}

passwordInput.addEventListener("input", () =>
  clearError(passwordInput, passwordError),
);
confirmPasswordInput.addEventListener("input", () =>
  clearError(confirmPasswordInput, matchError),
);

passwordInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  showError(passwordInput, passwordError, "Kata sandi tidak boleh kosong");
});

confirmPasswordInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  const msg = confirmPasswordInput.valueMissing
    ? "Konfirmasi sandi tidak boleh kosong"
    : "Kata sandi tidak cocok";
  showError(confirmPasswordInput, matchError, msg);
});

resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');
  const pass = passwordInput.value;
  const confirm = confirmPasswordInput.value;

  //validasi kekuatan sandi
  const validateStrength = (p) => {
    const requirements = {
      minLength: p.length >= 8,
      hasUpperCase: /[A-Z]/.test(p),
      hasNumber: /[0-9]/.test(p),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
    };
    return requirements;
  };

  const strength = validateStrength(pass);
  if (
    !strength.minLength ||
    !strength.hasUpperCase ||
    !strength.hasNumber ||
    !strength.hasSpecialChar
  ) {
    showError(
      passwordInput,
      passwordError,
      "Sandi harus 8+ karakter, ada huruf besar, angka, dan simbol.",
    );
    return;
  }

  if (pass !== confirm) {
    showError(confirmPasswordInput, matchError, "Kata sandi tidak cocok");
    return;
  }

  if (!resetPasswordForm.reportValidity()) return;

  submitBtn.disabled = true;
  const originalHtml = submitBtn.innerHTML;
  submitBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg> Menyimpan...
  `;

  try {
    const response = await resetPassword({
      token: token,
      newPassword: pass,
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("resetContainer").classList.add("hidden");
      document.getElementById("successState").classList.remove("hidden");
    } else {
      showError(
        passwordInput,
        passwordError,
        result.message || "Gagal mengatur ulang sandi.",
      );
    }
  } catch (err) {
    showError(
      passwordInput,
      passwordError,
      "Koneksi gagal atau sesi habis. Silakan coba lagi.",
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
  }
});
