import { getUserData } from "../utils/userProfile.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = await getUserData();
    if (userData) {
      document.body.classList.remove("opacity-0");
      initUserProfile();
      initCloudBgSection();
      generateDailyQuote();
    }
  } catch (error) {
    console.error("Gagal inisialisasi dashboard:", error);
  }
});
