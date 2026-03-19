import { getUserData } from "../utils/userProfile.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = await getUserData();
    if (userData) {
      document.body.style.display = "block";
      initUserProfile();
      initCloudBgSection();
    }
  } catch (error) {
    console.error("Gagal inisialisasi dashboard:", error);
  }
});
