import { registerPsikiater } from "../services/authService.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const namaLengkap = document.getElementById("namaLengkap").value;
  const noStr = document.getElementById("noStr").value;
  const nomorWa = document.getElementById("noWa").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Password tidak sama!");
    return;
  }

  try {
    const res = await registerPsikiater({
      email,
      namaLengkap,
      noStr,
      nomorWa,
      password,
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Register sukses");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Register gagal");
    }
  } catch (err) {
    alert("Server tidak bisa diakses");
  }
});
