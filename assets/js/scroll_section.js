function initScrollSection() {
  const wrapper = document.getElementById("scroll-section");
  if (!wrapper) {
    console.warn("scroll-section belum ada");
    return;
  }

  const section = wrapper.querySelector("section");
  if (!section) {
    console.warn("section di dalam scroll-section belum ada");
    return;
  }

  const steps = section.querySelectorAll(".step");
  if (!steps.length) return;

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const maxScroll = section.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const progress = Math.min(Math.max(-rect.top / maxScroll, 0), 1);

    const activeStep = Math.floor(progress * steps.length);

    steps.forEach((el, index) => {
      if (index <= activeStep) {
        el.classList.remove("opacity-0", "translate-y-10");
      } else {
        el.classList.add("opacity-0", "translate-y-10");
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll();
}
