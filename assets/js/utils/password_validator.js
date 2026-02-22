export function setupPasswordValidator(passwordInput, confirmInput) {
  function validatePassword(password) {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };
  }

  function updatePasswordIndicators(validations) {
    const indicators = {
      minLength: document.querySelector('[data-requirement="minLength"]'),
      hasUpperCase: document.querySelector('[data-requirement="hasUpperCase"]'),
      hasNumber: document.querySelector('[data-requirement="hasNumber"]'),
      hasSpecialChar: document.querySelector(
        '[data-requirement="hasSpecialChar"]',
      ),
    };

    Object.keys(validations).forEach((key) => {
      const indicator = indicators[key];
      if (!indicator) return;

      const svg = indicator.querySelector("svg");
      const isValid = validations[key];

      if (isValid) {
        svg.classList.remove("text-gray-300");
        svg.classList.add("text-green-500");
        svg.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 13l4 4L19 7"></path>
        `;
      } else {
        svg.classList.remove("text-green-500");
        svg.classList.add("text-gray-300");
        svg.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        `;
      }
    });
  }

  passwordInput.addEventListener("input", () => {
    const validations = validatePassword(passwordInput.value);
    updatePasswordIndicators(validations);
  });

  return function isPasswordValid() {
    const validations = validatePassword(passwordInput.value);
    const allValid = Object.values(validations).every((v) => v === true);

    if (!allValid) {
      return false;
    }

    if (passwordInput.value !== confirmInput.value) {
      return false;
    }

    return true;
  };
}
