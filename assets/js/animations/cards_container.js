const answers = {};

function generateCards(data) {
  const container = document.getElementById("cards-container");
  if (!container || !data) return;

  container.innerHTML = "";

  const totalQuestionsEl = document.querySelector(".total-questions-text");
  if (totalQuestionsEl) {
    totalQuestionsEl.textContent = data.length;
  }

  data.forEach((q) => {
    const card = document.createElement("div");
    card.className = `card-stack w-[450px] h-[480px] md:w-[1200px] md:h-[490px] rounded-2xl p-8 shadow-lg flex flex-col justify-start card`;
    card.style.backgroundColor = "#1B1B3A";

    card.innerHTML = `
      <h1 class="text-white text-center text-lg md:text-2xl font-semibold mb-2">
          Pertanyaan ${q.questionId}
      </h1>
      
      <div class="h-[80px] flex items-center justify-center mb-2 px-4">
          <h2 class="text-white text-lg md:text-2xl font-semibold text-center leading-tight">
              ${q.question}
          </h2>
      </div>

      <div class="flex flex-1 w-full gap-4 md:gap-12 items-start justify-center">
          ${q.answers
            .map((answer, answerIndex) => {
              const imagePath = `../assets/image/${answer.image}`;
              return `
              <div
                  data-a="${answer.id}"
                  data-q="${q.questionId}"
                  data-dimension="${answer.dimension}"
                  class="answer answer${q.questionId}${answer.id} flex-1 min-w-0 flex flex-col items-center gap-3 cursor-pointer group"
              >
                  <div class="relative w-full max-w-[400px] h-[200px] rounded-2xl overflow-hidden">
                      <img
                          src="${imagePath}"
                          alt=""
                          class="absolute inset-0 w-full h-full object-cover"
                          style="filter: blur(20px); transform: scale(1.1);"
                      />
                      <img
                          data-src="${imagePath}"
                          alt="${answer.text}"
                          class="lazy-load absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0"
                      />
                  </div>

                  <div class="grid grid-cols-1 place-items-center text-center w-full px-4 md:px-12 h-[100px]">
                      <div class="col-start-1 row-start-1 w-full flex items-center justify-center">
                          <div class="choice-circle-not-chosen question-choice-circle is--not-chosen px-6 py-2 rounded-full border border-white text-white text-sm md:text-base font-medium transition-all duration-300 inline-block">
                              ${answer.text}
                          </div>
                      </div>
                      <div class="col-start-1 row-start-1 w-full flex items-center justify-center">
                          <div class="choice-circle-chosen question-choice-circle is--chosen is--${q.questionId}${String.fromCharCode(96 + answer.id)} px-6 py-2 rounded-full bg-yellow-500 border border-yellow-500 text-[#1B1B3A] text-sm md:text-base font-medium transition-all duration-300 opacity-1 inline-block">
                              ${answer.text}
                          </div>
                      </div>
                  </div>
              </div>
              ${answerIndex === 0 ? '<div class="w-px h-52 bg-gradient-to-b from-transparent via-gray-500 to-transparent shrink-0"></div>' : ""}
            `;
            })
            .join("")}
      </div>
    `;

    container.appendChild(card);
  });

  attachAnswerListeners();
  initLazyLoading();
}

function attachAnswerListeners() {
  document.querySelectorAll(".answer").forEach((answer) => {
    answer.addEventListener("click", function () {
      const questionId = this.getAttribute("data-q");
      const answerId = this.getAttribute("data-a");
      const dimension = this.getAttribute("data-dimension");

      document
        .querySelectorAll(`[data-q="${questionId}"]`)
        .forEach((el) => el.classList.remove("selected"));

      this.classList.add("selected");

      answers[questionId] = {
        answer: answerId,
        dimension: dimension,
      };

      console.log(`Question ${questionId} updated:`, answers[questionId]);

      const cards = gsap.utils.toArray(".card");
      const currentIndex = cards.findIndex((card) =>
        card.querySelector(`[data-q="${questionId}"]`),
      );

      if (currentIndex !== -1 && currentIndex < cards.length - 1) {
        setTimeout(() => {
          const st = ScrollTrigger.getAll().find(
            (s) => s.trigger === document.getElementById("stack-container"),
          );

          if (st) {
            const totalCards = cards.length;
            const targetProgress = (currentIndex + 1) / (totalCards - 1);
            const targetScroll =
              st.start + targetProgress * (st.end - st.start);

            window.scrollTo({
              top: targetScroll,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    });
  });
}

function initLazyLoading() {
  const lazyImages = document.querySelectorAll("img.lazy-load");
  if (lazyImages.length === 0) return;

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const fullImg = new Image();
            fullImg.src = img.dataset.src;
            fullImg.onload = () => {
              img.src = img.dataset.src;
              img.style.opacity = "1";
              img.classList.remove("lazy-load");
            };
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: "100px" },
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.style.opacity = "1";
    });
  }
}

function initAnimation() {
  gsap.registerPlugin(ScrollTrigger);
  const cards = gsap.utils.toArray(".card");
  if (cards.length === 0) return;

  const scrollDistance = (cards.length - 1) * window.innerHeight;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#stack-container",
      start: "top top",
      end: "+=" + scrollDistance,
      scrub: 1,
      pin: true,
    },
  });

  cards.forEach((card, index) => {
    gsap.set(card, {
      y: index === 0 ? 0 : window.innerHeight,
      scale: 1,
      opacity: 1,
      filter: "brightness(1)",
      zIndex: index,
    });
  });

  cards.forEach((card, index) => {
    if (index < cards.length - 1) {
      tl.to(cards[index + 1], {
        y: 0,
        duration: 1,
        ease: "none",
      });

      tl.to(
        card,
        {
          scale: 0.95,
          filter: "brightness(0.5)",
          duration: 1,
          ease: "none",
        },
        "<",
      );

      tl.to(
        cards[index + 1],
        {
          filter: "brightness(1)",
          duration: 0.1,
        },
        "<",
      );
    }
  });
}

function calculateMBTI() {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  Object.values(answers).forEach((ans) => {
    if (ans.dimension) scores[ans.dimension]++;
  });

  return (
    (scores.E >= scores.I ? "E" : "I") +
    (scores.S >= scores.N ? "S" : "N") +
    (scores.T >= scores.F ? "T" : "F") +
    (scores.J >= scores.P ? "J" : "P")
  );
}

function finishTest(event) {
  if (event) event.preventDefault();
  const finalResult = calculateMBTI();
  localStorage.setItem("mbti_result", finalResult);
  window.location.href = "result_mbti.html";
}
