function initUserProfile() {
  const userData = {
    name: "Username",
    email: "username@example.com",
  };

  // update text dengan data
  const name = document.getElementById("user-name");
  if (name) name.innerText = userData.name;
  const nameText = document.getElementById("user-name-text");
  if (nameText) nameText.innerText = userData.name;
  const dropdownName = document.getElementById("user-name-dropdown");
  if (dropdownName) dropdownName.innerText = userData.name;

  // gambar random
  const avatarImg = document.getElementById("user-avatar");
  if (avatarImg) {
    avatarImg.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random()}`;
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

// buat tutup menu kalau klik di luar area
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("profile-dropdown");
  const button = event.target.closest("button");
  const arrow = document.getElementById("profile-arrow");

  if (dropdown && !dropdown.classList.contains("hidden") && !button) {
    dropdown.classList.add("hidden");
    if (arrow) {
      arrow.classList.remove("rotate-180");
    }
  }
});
