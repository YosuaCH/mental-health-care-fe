import { getUserData } from "../utils/userProfile.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = await getUserData();
    if (userData) {
      document.body.style.display = "block";

      if (typeof window.initUserProfile === "function")
        window.initUserProfile();
      if (typeof window.initCloudBgSection === "function")
        window.initCloudBgSection();

      const role = (userData.role || "user").toLowerCase(); // default role

      const chatPageTitle = document.getElementById("chat-page-title");
      const chatPageSubtitle = document.getElementById("chat-page-subtitle");
      const contactListTitle = document.getElementById("contact-list-title");
      const aiAssistantContainer = document.getElementById(
        "ai-assistant-container",
      );

      if (role === "psikiater") {
        // Tampilan untuk Dokter
        if (chatPageSubtitle)
          chatPageSubtitle.textContent =
            "Pilih AI atau pasien untuk memulai chat";
        if (contactListTitle) contactListTitle.textContent = "Pasien Aktif";
        if (aiAssistantContainer) aiAssistantContainer.style.display = "block";

        if (typeof window.selectContact === "function") {
          window.selectContact(
            "AI Assistant",
            "../assets/image/cloud (3).png",
            true,
          );
        }

        if (typeof window.loadPatientsFromServer === "function") {
          window.loadPatientsFromServer();
        }
      } else {
        // Tampilan untuk Pasien
        if (chatPageTitle) chatPageTitle.textContent = "Obrolan Kamu";
        if (chatPageSubtitle)
          chatPageSubtitle.textContent =
            "Pilih AI atau dokter untuk mulai curhat";
        if (contactListTitle)
          contactListTitle.textContent = "Available Psychiatrists";
        if (aiAssistantContainer) aiAssistantContainer.style.display = "block";

        if (typeof window.selectContact === "function") {
          window.selectContact(
            "AI Assistant",
            "../assets/image/cloud (3).png",
            true,
          );
        }

        if (typeof window.loadDoctorsFromServer === "function") {
          window.loadDoctorsFromServer();
        }
      }
    }
  } catch (error) {
    console.error("Gagal inisialisasi dashboard:", error);
  }
});
