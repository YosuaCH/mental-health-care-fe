import { login } from "../services/authService.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const clearError = (input, errorSpan) => {
  input.classList.remove("ring-2", "ring-red-500", "focus:ring-red-500");
  errorSpan.classList.add("hidden");
  errorSpan.innerText = "";
};

emailInput.addEventListener("input", () => clearError(emailInput, emailError));
passwordInput.addEventListener("input", () =>
  clearError(passwordInput, passwordError),
);

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearError(emailInput, emailError);
  clearError(passwordInput, passwordError);

  try {
    const res = await login(emailInput.value, passwordInput.value);
    const data = await res.json();

    if (res.ok) {
      alert("Login Berhasil!");
      window.location.href = "dashboard.html";
    } else {
      const message = data.message;

      if (message.includes("Email")) {
        emailInput.classList.add(
          "ring-2",
          "ring-red-500",
          "focus:ring-red-500",
        );
        emailError.innerText = message;
        emailError.classList.remove("hidden");
      } else if (message.includes("Password")) {
        passwordInput.classList.add(
          "ring-2",
          "ring-red-500",
          "focus:ring-red-500",
        );
        passwordError.innerText = message;
        passwordError.classList.remove("hidden");
      } else {
        alert(message);
      }
    }
  } catch (err) {
    alert("Koneksi gagal: " + err);
  }
});
