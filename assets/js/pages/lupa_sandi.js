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
  const originalHtml = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg> Mengirim...
  `;

  try {
    const response = await forgotPassword(emailInput.value);

    const result = await response.json();

    if (response.ok) {
      formState.classList.add("hidden");
      successState.classList.remove("hidden");
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
    submitBtn.innerHTML = originalHtml;
  }
});
