import { BACKEND_URL } from "../const/base_url.js";

const resetPasswordForm = document.getElementById("resetPasswordForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const matchError = document.getElementById("matchError");

// Ambil token dari URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

if (!token) {
  alert("Token tidak ditemukan. Silakan gunakan link dari email pemulihan Anda.");
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

  const pass = passwordInput.value;
  const confirm = confirmPasswordInput.value;

  if (pass !== confirm) {
    showError(confirmPasswordInput, matchError, "Kata sandi tidak cocok");
    return;
  }

  if (!resetPasswordForm.reportValidity()) return;

  const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerText = "Menyimpan...";

  try {
    const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        newPassword: pass,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      window.location.href = "login.html";
    } else {
      alert(result.message || "Gagal mengatur ulang sandi.");
    }
  } catch (err) {
    alert("Koneksi gagal: " + err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Simpan Sandi Baru";
  }
});
