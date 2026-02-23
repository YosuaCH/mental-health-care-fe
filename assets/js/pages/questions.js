import { getUserData } from "../utils/userProfile.js";

let questionsData = [];

async function initQuestionPage() {
  try {
    const user = await getUserData();

    if (!user) return;
    questionsData = await getAllQuestions();

    if (!questionsData || questionsData.length === 0) {
      throw new Error("Data pertanyaan kosong");
    }
    renderCards();
    startAnimations();
  } catch (error) {
    console.error("Page Error:", error);
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
