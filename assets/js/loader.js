const load = async (id, file) => {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();

  if (window.AOS) {
    AOS.refreshHard();
  }
};

(async () => {
  await load("navbar", "fragments/navbar.html");
  await load("hero-section", "fragments/hero.html");
  if (typeof initHeroSection === "function") initHeroSection();

  await load("about-section", "fragments/about.html");

  await load("scroll-section", "fragments/scroll_section.html");
  if (typeof initScrollSection === "function") initScrollSection();

  await load("shape-section", "fragments/shape_section.html");
  if (typeof initShapeSection === "function") initShapeSection();

  await load("service-section", "fragments/services.html");

  await load("invitation", "fragments/invitation.html");
})();
