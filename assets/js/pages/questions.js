let questionsData = [];

async function initQuestionPage() {
  try {
    questionsData = await getAllQuestions();

    if (!questionsData || questionsData.length === 0) {
      throw new Error("Data pertanyaan kosong");
    }
    renderCards();
    startAnimations();
  } catch (error) {
    console.error("Page Error:", error);
    alert("Waduh, gagal memuat pertanyaan. Cek koneksi server kamu ya!");
  }
}

function renderCards() {
  generateCards(questionsData);
}

function startAnimations() {
  setTimeout(() => {
    if (typeof initAnimation === "function") {
      initAnimation();
    }
  }, 100);
}

document.addEventListener("DOMContentLoaded", initQuestionPage);
