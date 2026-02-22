async function initResultPage() {
  const code = localStorage.getItem("mbti_result");

  if (!code) {
    console.error("No MBTI result found in localStorage");
    alert("Kamu belum melakukan tes! Yuk tes dulu.");
    window.location.href = "test_mbti.html";
    return;
  }

  try {
    // 2. Ambil data dari Backend menggunakan Service
    // Pastikan mbtiService.js sudah di-load di HTML sebelum file ini
    const data = await mbtiService.getMbtiDetail(code);

    if (data) {
      // 3. Masukkan data ke elemen-elemen UI menggunakan fungsi render yang sudah ada
      updateHeroSection(code, data);
      renderTraits(code, data.traits);
      renderProsCons(data);
      renderDevelopmentTips(data.developmentTips);

      console.log("Halaman hasil berhasil dimuat untuk tipe:", code);
    }
  } catch (error) {
    console.error("Gagal memuat data MBTI:", error);
    alert("Terjadi kesalahan saat mengambil data dari server.");
  }
}

/**
 * FUNGSI RENDER (Tetap gunakan punyamu yang sudah bagus)
 */
function updateHeroSection(code, data) {
  document
    .querySelectorAll(".mbti-code")
    .forEach((el) => (el.innerText = code));
  document.getElementById("mbti-title").innerText = data.title;
  document.getElementById("mbti-desc").innerText = data.desc;

  const longDescEl = document.getElementById("mbti-long-desc");
  if (longDescEl) longDescEl.innerText = data.longDesc;
}

function renderTraits(code, traits) {
  const container = document.getElementById("traits-container");
  if (!container || !traits) return;

  container.innerHTML = traits
    .map(
      (trait) => `
        <div class="flex gap-8 items-start">
            <img src="../assets/image/cloud (11).png" class="w-12 h-12 md:w-14 md:h-14 flex-shrink-0" alt="icon" />
            <p class="text-base md:text-lg leading-relaxed">
                <span class="font-bold">${code}</span> ${trait}
            </p>
        </div>
    `,
    )
    .join("");
}

function renderProsCons(data) {
  const prosContainer = document.getElementById("list-kelebihan");
  const consContainer = document.getElementById("list-kekurangan");

  if (prosContainer && data.pros) {
    prosContainer.innerHTML = data.pros
      .map(
        (text) => `
            <li class="flex items-start gap-3 py-1">
                <div class="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white font-bold shrink-0 mt-0.5">+</div>
                <span class="leading-relaxed">${text}</span>
            </li>
        `,
      )
      .join("");
  }

  if (consContainer && data.cons) {
    consContainer.innerHTML = data.cons
      .map(
        (text) => `
            <li class="flex items-start gap-3 py-1">
                <div class="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white font-bold shrink-0 mt-0.5">-</div>
                <span class="leading-relaxed">${text}</span>
            </li>
        `,
      )
      .join("");
  }
}

function renderDevelopmentTips(tips) {
  const container = document.getElementById("list-tips");
  if (!container || !tips) return;

  container.innerHTML = tips
    .map(
      (text) => `
        <div class="flex gap-8 items-start">
            <img src="../assets/image/cloud (11).png" class="w-14 h-14 mt-1 flex-shrink-0" alt="icon" />
            <p class="text-lg leading-relaxed">${text}</p>
        </div>
    `,
    )
    .join("");
}

// Jalankan inisialisasi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  initResultPage();

  // Panggil fungsi UI lainnya jika ada
  if (typeof initUserProfile === "function") initUserProfile();
  if (typeof initCloudBgSection === "function") initCloudBgSection();
});
