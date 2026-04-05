import { getUserData } from "../utils/userProfile.js";
import { getAllQuestions } from "../services/questionService.js";

let questionsData = [];

async function initQuestionPage() {
  try {
    const user = await getUserData();

    if (!user) return;
    document.body.classList.remove("opacity-0");
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
