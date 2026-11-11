const languageButton = document.querySelector(".language-toggle");
let currentLanguage = "en";

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-en][data-sq]").forEach((element) => {
    element.textContent = element.dataset[language];
  });
  languageButton.textContent = language === "en" ? "SQ" : "EN";
  languageButton.setAttribute("aria-label", language === "en" ? "Switch to Albanian" : "Switch to English");
}
languageButton.addEventListener("click", () => setLanguage(currentLanguage === "en" ? "sq" : "en"));

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

document.getElementById("year").textContent = new Date().getFullYear();

const interestForm = document.getElementById("interest-form");

// Buttons with data-interest pre-select that option in the form's dropdown.
document.querySelectorAll("a[data-interest]").forEach((link) => link.addEventListener("click", () => {
  interestForm.elements.interest.value = link.dataset.interest;
}));
const formNote = document.getElementById("form-note");
const submitButton = interestForm.querySelector('button[type="submit"]');

function showFormMessage(type, en, sq) {
  formNote.classList.remove("success", "error");
  if (type) formNote.classList.add(type);
  formNote.dataset.en = en;
  formNote.dataset.sq = sq;
  formNote.textContent = currentLanguage === "en" ? en : sq;
}

interestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  showFormMessage(null, "Sending…", "Po dërgohet…");
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(interestForm)).toString()
    });
    if (!response.ok) throw new Error("Submission failed: " + response.status);
    interestForm.reset();
    showFormMessage("success",
      "Thank you! Your interest has been sent. The AWA team will be in touch soon.",
      "Faleminderit! Interesimi yt u dërgua. Ekipi i AWA do të të kontaktojë së shpejti.");
  } catch (error) {
    showFormMessage("error",
      "Sorry, something went wrong. Please try again or email admin@albanianwomenalliance.org.",
      "Na vjen keq, diçka shkoi keq. Provo përsëri ose shkruaj në admin@albanianwomenalliance.org.");
  } finally {
    submitButton.disabled = false;
  }
});
