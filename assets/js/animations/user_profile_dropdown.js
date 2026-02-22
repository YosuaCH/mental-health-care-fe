function initUserProfile() {
  const userJson = localStorage.getItem("user");

  if (!userJson) {
    console.warn("User data tidak ditemukan di Local Storage.");
    return;
  }

  const userDataRaw = JSON.parse(userJson);
  const displayName =
    userDataRaw.username || userDataRaw.namaLengkap || "Username";
  const displayEmail = userDataRaw.email || "username@example.com";

  const name = document.getElementById("user-name");
  if (name) name.innerText = displayName;

  const nameText = document.getElementById("user-name-text");
  if (nameText) nameText.innerText = displayName;

  const dropdownName = document.getElementById("user-name-dropdown");
  if (dropdownName) dropdownName.innerText = displayName;

  const dropdownEmail = document.querySelector("#profile-dropdown p.text-xs");
  if (dropdownEmail) dropdownEmail.innerText = displayEmail;

  const avatarImg = document.getElementById("user-avatar");
  if (avatarImg) {
    avatarImg.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${displayName}`;
  }
}

function toggleProfileMenu() {
  const dropdown = document.getElementById("profile-dropdown");
  const arrow = document.getElementById("profile-arrow");
  if (dropdown) {
    dropdown.classList.toggle("hidden");
    if (arrow) {
      arrow.classList.toggle("-rotate-180");
    }
  }
}

document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("profile-dropdown");
  const button = event.target.closest("button");
  const arrow = document.getElementById("profile-arrow");

  if (dropdown && !dropdown.classList.contains("hidden") && !button) {
    dropdown.classList.add("hidden");
    if (arrow) {
      arrow.classList.remove("-rotate-180");
    }
  }
});
