const resetPasswordForm = document.getElementById("resetPasswordForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const matchError = document.getElementById("matchError");

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

resetPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const pass = passwordInput.value;
  const confirm = confirmPasswordInput.value;

  if (pass !== confirm) {
    showError(confirmPasswordInput, matchError, "Kata sandi tidak cocok");
    return;
  }

  if (!resetPasswordForm.reportValidity()) return;

  alert("Sandi berhasil diperbarui!");
  window.location.href = "login.html";
});
