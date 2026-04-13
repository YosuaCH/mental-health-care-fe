import { login } from "../services/auth_service.js";
import { BACKEND_URL } from "../const/base_url.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const errorType = urlParams.get("error");

  if (errorType === "manual") {
    alert(
      "Email ini terdaftar secara manual. Silakan masukkan kata sandi Anda untuk login.",
    );

    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (errorType === "oauth_failed") {
    alert("Gagal melakukan login dengan Google. Silakan coba lagi.");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const googleLink = document.getElementById("googleLoginLink");
  if (googleLink) {
    googleLink.href = `${BACKEND_URL}/oauth2/authorization/google`;
  }
});

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
passwordInput.addEventListener("input", () =>
  clearError(passwordInput, passwordError),
);

emailInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  const msg = emailInput.validity.valueMissing
    ? "Email tidak boleh kosong"
    : "Format email salah";
  showError(emailInput, emailError, msg);
});

passwordInput.addEventListener("invalid", (e) => {
  e.preventDefault();
  showError(passwordInput, passwordError, "Kata sandi tidak boleh kosong");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!loginForm.reportValidity()) return;

  try {
    const res = await login(emailInput.value, passwordInput.value);
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.data));
      window.location.href = "dashboard.html";
    } else {
      const message = data.message;
      if (message.includes("Email")) {
        showError(emailInput, emailError, message);
      } else if (message.includes("Password")) {
        showError(passwordInput, passwordError, message);
      } else {
        alert(message);
      }
    }
  } catch (err) {
    alert("Koneksi gagal: " + err);
    alert(res);
  }
});
