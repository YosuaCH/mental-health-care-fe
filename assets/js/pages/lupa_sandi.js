import { forgotPassword } from "../services/auth_service.js";

const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

const clearError = (input, errorSpan) => {
  input.classList.remove("ring-2", "ring-red-500", "focus:ring-red-500");
  errorSpan.classList.add("hidden");
  errorSpan.innerText = "";
};

function showError(input, span, msg) {
  input.classList.add("ring-2", "ring-red-500", "focus:ring-red-500");
  span.innerText = msg;
  span.classList.remove("hidden");
}

emailInput.addEventListener("input", () => clearError(emailInput, emailError));

emailInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  const msg = emailInput.validity.valueMissing
    ? "Email tidak boleh kosong"
    : "Format email salah";
  showError(emailInput, emailError, msg);
});

forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!forgotPasswordForm.reportValidity()) return;

  const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerText;

  submitBtn.disabled = true;
  submitBtn.innerText = "Mengirim...";

  try {
    const response = await forgotPassword(emailInput.value);

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
    } else {
      showError(
        emailInput,
        emailError,
        result.message || "Gagal mengirim email.",
      );
    }
  } catch (err) {
    alert("Koneksi gagal: " + err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = originalText;
  }
});
