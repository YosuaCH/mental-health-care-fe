function initShapeSection() {
  const shape = document.getElementById("shape");
  if (!shape) return;

  const section = shape.closest("section");
  if (!section) return;

  function onScroll() {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollY = window.scrollY;

    const progress = Math.min(
      Math.max(
        (scrollY - sectionTop + window.innerHeight) /
          (sectionHeight + window.innerHeight),
        0
      ),
      1
    );

    const scale = 0.3 + progress * 10;
    shape.style.setProperty("--scale", scale);
  }

  window.addEventListener("scroll", onScroll);
  onScroll();
}
