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

  setTimeout(() => {
    alert("Instruksi pemulihan telah dikirim ke email Anda.");
    window.location.href = "reset_password.html";
  }, 1500);
});
