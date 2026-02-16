import { login } from "../services/authService.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await login(email, password);
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      window.location.href = "dashboard.html";
    } else {
      alert("Gagal: " + data.message);
    }
  } catch (err) {
    alert("Server tidak bisa diakses");
  }
});
