function initNavbar() {
  const joinWrapper = document.getElementById("joinWrapper");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      joinWrapper.style.width = "130px";
    } else {
      joinWrapper.style.width = "0px";
    }
  });
}
document.addEventListener("DOMContentLoaded", initNavbar);
