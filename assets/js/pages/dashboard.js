import { getUserData } from "../utils/user_profile.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = await getUserData();
    if (userData) {
      document.body.style.display = "block";
      initUserProfile();
      initCloudBgSection();
      generateDailyQuote();
    }
  } catch (error) {
    console.error("Gagal inisialisasi dashboard:", error);
  }
});
