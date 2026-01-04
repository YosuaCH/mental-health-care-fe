function initNavbar() {
  const joinWrapper = document.getElementById("joinWrapper");
  if (!joinWrapper) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      joinWrapper.style.width = "160px";
    } else {
      joinWrapper.style.width = "0px";
    }
  });
}
