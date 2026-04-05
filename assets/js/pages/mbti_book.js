import { fetchAllEbooks } from "../services/mbti_book.js";
import { getUserData } from "../utils/user_profile.js";

const getCleanPreviewUrl = (url) => {
  if (!url || url === "#") return "#";
  try {
    const baseUrl = url.split("?")[0];
    const urlObj = new URL(url);

    const bookId = urlObj.searchParams.get("id");
    if (bookId) {
      return `${baseUrl}?id=${bookId}&printsec=frontcover`;
    }
    const paramsToClean = ["q", "dq", "lpg", "pg", "focus"];
    paramsToClean.forEach((p) => urlObj.searchParams.delete(p));
    urlObj.searchParams.set("printsec", "frontcover");

    return urlObj.toString();
  } catch (e) {
    return url;
  }
};

const cleanDescription = (htmlText) => {
  if (!htmlText) return "";
  return htmlText
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const renderEbooks = async () => {
  const container = document.getElementById("ebook-container");

  try {
    const books = await fetchAllEbooks();

    if (!books || books.length === 0) {
      container.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <p class="text-slate-500 italic">Maaf, saat ini tidak ada buku yang tersedia.</p>
                </div>`;
      return;
    }

    container.innerHTML = "";

    books.forEach((book) => {
      const coverImg = book.thumbnail
        ? book.thumbnail.replace("http://", "https://")
        : "https://via.placeholder.com/400x400?text=No+Cover";

      const title = book.title || "Judul Tidak Tersedia";
      const cleanedDesc = cleanDescription(book.description);
      const desc =
        cleanedDesc.length > 20
          ? cleanedDesc
          : "Temukan wawasan baru mengenai kesehatan mental melalui buku ini.";

      const pages = book.pageCount
        ? `${book.pageCount} halaman`
        : "Halaman N/A";

      const finalPreviewLink = getCleanPreviewUrl(book.previewLink);

      container.innerHTML += `
                <div class="w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-50 flex flex-col h-full">
                    <div class="aspect-square bg-gray-100 relative overflow-hidden">
                        <img src="${coverImg}" 
                             alt="${title}" 
                             class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500">
                    </div>

                    <div class="p-5 flex flex-col flex-grow">
                        <h3 class="font-bold text-lg text-slate-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                            ${title}
                        </h3>
                        <p class="text-sm text-slate-600 mb-3 line-clamp-2 flex-grow min-h-[2.5rem] leading-relaxed" 
                        style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; word-break: break-word; hyphens: auto;">
                            ${desc}
                        </p>

                        <div class="flex items-center gap-4 text-xs text-slate-500 mb-4">
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4 text-[#f2ca4b]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                ${pages}
                            </span>
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4 text-[#f2ca4b]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                                </svg>
                                ~${Math.round(book.pageCount / 2 || 30)} menit
                            </span>
                        </div>

                        <button 
                            onclick="window.open('${finalPreviewLink}', '_blank')"
                            class="w-full bg-[#f2ca4b] hover:bg-[#e5be42] text-slate-900 font-semibold py-2.5 rounded-xl transition-colors duration-300"
                        >
                            Baca Sekarang
                        </button>
                    </div>
                </div>
            `;
    });
  } catch (error) {
    console.error("Error rendering ebooks:", error);
    container.innerHTML =
      '<p class="col-span-full text-center text-red-500">Terjadi kesalahan saat memuat data.</p>';
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userData = await getUserData();

    if (userData) {
      document.body.style.display = "block";
      initUserProfile();
      await renderEbooks();
    } else {
      console.warn("User tidak terautentikasi, mengalihkan...");
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Gagal inisialisasi halaman E-Book:", error);
  }
});
