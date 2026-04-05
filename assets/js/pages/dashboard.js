import { getUserData } from "../utils/user_profile.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = await getUserData();
    if (userData) {
      document.body.style.display = "block";
      initUserProfile();
      initCloudBgSection();
      generateDailyQuote();

      // text by role
      if (userData.role === "PSIKIATER") {
        const titleEl = document.getElementById("consultation-title");
        const descEl = document.getElementById("consultation-desc");
        const btnEl = document.getElementById("consultation-btn-text");

        if (titleEl) titleEl.innerText = "Siap Melayani?";
        if (descEl)
          descEl.innerText =
            "Ada pasien yang menantikan empati dan keahlianmu. Mari berikan bantuan terbaikmu hari ini.";
        if (btnEl) btnEl.innerText = "Balas Chat Sekarang";
      } else {
        const titleEl = document.getElementById("consultation-title");
        const descEl = document.getElementById("consultation-desc");
        const btnEl = document.getElementById("consultation-btn-text");

        if (titleEl) titleEl.innerText = "Butuh Bantuan?";
        if (descEl)
          descEl.innerText =
            "Mari urai benang kusut di pikiranmu lewat obrolan privat dengan konselor kami.";
        if (btnEl) btnEl.innerText = "Mulai Obrolan";
      }
    }
  } catch (error) {
    console.error("Gagal inisialisasi dashboard:", error);
  }
});
