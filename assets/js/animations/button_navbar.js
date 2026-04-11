function initNavbarButton() {
  const joinWrapper = document.getElementById("joinWrapper");
  if (joinWrapper) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        joinWrapper.style.width = "130px";
      } else {
        joinWrapper.style.width = "0px";
      }
    });
  }

  // Mobile Navbar Logic
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuItems = document.getElementById("mobile-menu-items");
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");
  const mobileCloseIcon = document.getElementById("mobile-close-icon");
  const mobileNavBg = document.getElementById("mobile-nav-bg");
  let isOpen = false;

  if (mobileMenuBtn && mobileMenuItems) {
    mobileMenuBtn.addEventListener("click", () => {
      isOpen = !isOpen;
      if (isOpen) {
        mobileMenuItems.classList.remove("opacity-0", "pointer-events-none", "-translate-y-4");
        mobileMenuItems.classList.add("opacity-100", "translate-y-0");
        mobileNavBg.classList.add("h-[280px]");
        mobileNavBg.classList.remove("h-[60px]");
        if (mobileMenuIcon) mobileMenuIcon.classList.add("hidden");
        if (mobileCloseIcon) mobileCloseIcon.classList.remove("hidden");
      } else {
        mobileMenuItems.classList.remove("opacity-100", "translate-y-0");
        mobileMenuItems.classList.add("opacity-0", "pointer-events-none", "-translate-y-4");
        mobileNavBg.classList.remove("h-[280px]");
        mobileNavBg.classList.add("h-[60px]");
        if (mobileMenuIcon) mobileMenuIcon.classList.remove("hidden");
        if (mobileCloseIcon) mobileCloseIcon.classList.add("hidden");
      }
    });

    mobileMenuItems.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        isOpen = false;
        mobileMenuItems.classList.remove("opacity-100", "translate-y-0");
        mobileMenuItems.classList.add("opacity-0", "pointer-events-none", "-translate-y-4");
        mobileNavBg.classList.remove("h-[280px]");
        mobileNavBg.classList.add("h-[60px]");
        if (mobileMenuIcon) mobileMenuIcon.classList.remove("hidden");
        if (mobileCloseIcon) mobileCloseIcon.classList.add("hidden");
      });
    });
  }
}