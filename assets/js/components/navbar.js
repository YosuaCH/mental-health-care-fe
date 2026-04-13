import { logout as authLogout } from "../services/auth_service.js";
import { DICEBEAR_BASE_URL } from "../const/base_url.js";
import { updateProfile } from "../services/userService.js";

window.logout = authLogout;
window.toggleProfileMenu = toggleProfileMenu;
window.toggleEditProfileModal = toggleEditProfileModal;
window.previewImage = previewImage;
window.initUserProfile = initComponent;

function renderSharedUI() {
  if (document.getElementById("profile-dropdown")) return;

  const navHtml = `
    <nav class="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md shadow-xl rounded-full z-50 px-3 md:px-4 py-2 w-[90%] sm:w-auto sm:min-w-[420px] max-w-2xl border border-white/40 flex justify-between items-center gap-2 md:gap-4">
      <img
        src="assets/image/logo_brand-removebg-preview.png"
        class="w-8 h-8 md:w-10 md:h-10 cursor-pointer flex-shrink-0"
        onclick="location.href='dashboard.html'"
      />

      <div class="text-[11px] md:text-sm font-medium text-slate-500 font-[Poppins] whitespace-nowrap">
        Mental Health Care
      </div>

      <div class="relative">
        <button
          onclick="toggleProfileMenu()"
          class="flex items-center gap-2 md:gap-3 bg-white pl-1 pr-3 md:pr-4 py-1 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all group focus:outline-none"
        >
          <img
            id="user-avatar"
            src=""
            class="w-7 h-7 md:w-8 md:h-8 rounded-full ring-2 ring-white ml-0 md:ml-2 object-cover flex-shrink-0"
          />
          <span
            id="user-name"
            class="text-sm font-bold text-slate-700 group-hover:text-black hidden sm:block"></span>

          <svg
            id="profile-arrow"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-slate-400 transition-transform duration-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          id="profile-dropdown"
          class="hidden absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 transform origin-top-right animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <p id="user-name-dropdown" class="text-sm font-bold text-slate-900 truncate">User</p>
            <p class="text-xs text-slate-400 truncate">user@example.com</p>
          </div>

          <div class="p-2">
            <a
              href="javascript:void(0)"
              onclick="toggleEditProfileModal(); toggleProfileMenu();"
              class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Edit Profil
            </a>
          </div>

          <div class="p-2 border-t border-slate-100">
            <a
              href="javascript:void(0)"
              onclick="logout()"
              class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Keluar
            </a>
          </div>
        </div>
      </div>
    </nav>
  `;

  const modalHtml = `
    <div id="edit-profile-modal" class="fixed inset-0 z-[60] hidden flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onclick="toggleEditProfileModal()"></div>
      <div class="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in duration-300">
        <div class="p-8">
          <div class="text-center mb-8">
            <h3 class="text-xl font-bold text-slate-800">Edit Profil</h3>
            <p class="text-sm text-slate-500">Sesuaikan identitasmu</p>
          </div>

          <form id="edit-profile-form" class="space-y-6">
            <div class="flex flex-col items-center justify-center">
              <div class="relative group cursor-pointer" onclick="document.getElementById('file-input').click()">
                <img id="modal-avatar-preview" src="" class="w-24 h-24 rounded-full object-cover ring-4 ring-slate-50 shadow-md group-hover:brightness-90 transition-all"/>
                <div class="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-slate-600 group-hover:text-blue-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <input type="file" id="file-input" class="hidden" accept="image/*" onchange="previewImage(event)"/>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username Baru</label>
              <input type="text" id="edit-username" placeholder="Masukkan username..." class="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#f2ca4b] focus:border-[#f2ca4b] outline-none transition-all text-slate-700 font-medium"/>
            </div>

            <div id="price-field-container" class="space-y-2 hidden">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Harga Konsultasi (Rp)</label>
              <input type="number" id="edit-price" placeholder="Contoh: 50000" class="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#f2ca4b] focus:border-[#f2ca4b] outline-none transition-all text-slate-700 font-medium"/>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" onclick="toggleEditProfileModal()" class="flex-1 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Batal</button>
              <button type="submit" class="flex-[2] bg-slate-900 text-white px-4 py-3 rounded-2xl font-bold hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("afterbegin", navHtml + modalHtml);
  const form = document.getElementById("edit-profile-form");
  if (form) {
    form.addEventListener("submit", handleSaveProfile);
  }
}

function initComponent() {
  renderSharedUI();

  const userJson = localStorage.getItem("user");
  if (!userJson) return;

  const userDataRaw = JSON.parse(userJson);
  const displayName = userDataRaw.username || userDataRaw.namaLengkap || "User";
  const displayEmail = userDataRaw.email || "user@example.com";

  const nameEl = document.getElementById("user-name");
  const dropdownNameEl = document.getElementById("user-name-dropdown");
  const dropdownEmailEl = document.querySelector("#profile-dropdown p.text-xs");
  const avatarImgEl = document.getElementById("user-avatar");

  if (nameEl) nameEl.innerText = displayName;
  if (dropdownNameEl) dropdownNameEl.innerText = displayName;
  if (dropdownEmailEl) dropdownEmailEl.innerText = displayEmail;
  if (avatarImgEl) {
    avatarImgEl.src =
      userDataRaw.picture || `${DICEBEAR_BASE_URL}?seed=${displayName}`;
  }
}

function toggleProfileMenu() {
  const dropdown = document.getElementById("profile-dropdown");
  const arrow = document.getElementById("profile-arrow");
  if (dropdown) {
    dropdown.classList.toggle("hidden");
    if (arrow) arrow.classList.toggle("-rotate-180");
  }
}

function toggleEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  if (!modal) return;
  const isHidden = modal.classList.toggle("hidden");

  if (!isHidden) {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const displayName = user.namaLengkap || user.username || "";
    document.getElementById("edit-username").value = displayName;
    document.getElementById("modal-avatar-preview").src =
      user.picture || `${DICEBEAR_BASE_URL}?seed=${displayName}`;

    const priceContainer = document.getElementById("price-field-container");
    const priceInput = document.getElementById("edit-price");

    if (user.role === "PSIKIATER") {
      priceContainer.classList.remove("hidden");
      priceInput.value = user.hargaKonsultasi || "";
    } else {
      priceContainer.classList.add("hidden");
    }
  }
}

function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById("modal-avatar-preview");
    output.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function handleSaveProfile(e) {
  e.preventDefault();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  const newName = document.getElementById("edit-username").value;
  const newAvatar = document.getElementById("modal-avatar-preview").src;
  const newPrice = document.getElementById("edit-price").value;

  // Visual Loading State
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg> Menyimpan...
  `;

  updateProfile(newName, newAvatar, newPrice)
    .then((updatedUser) => {
      localStorage.setItem("user", JSON.stringify(updatedUser));
      initComponent();
      toggleEditProfileModal();
    })
    .catch((err) => {
      console.error(err);
      alert("Terjadi kesalahan: " + err.message);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
}
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("profile-dropdown");
  const button = event.target.closest("button");
  if (dropdown && !dropdown.classList.contains("hidden") && !button) {
    dropdown.classList.add("hidden");
    const arrow = document.getElementById("profile-arrow");
    if (arrow) arrow.classList.remove("-rotate-180");
  }
});

initComponent();
