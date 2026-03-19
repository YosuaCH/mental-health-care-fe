import { getUserData } from "../utils/userProfile.js";
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = await getUserData();

    if (userData) {
      document.body.style.display = "block";
    } else {
      console.warn("User tidak terautentikasi, mengalihkan...");
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Gagal inisialisasi halaman E-Book:", error);
  }
});
