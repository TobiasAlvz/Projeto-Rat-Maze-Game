document.addEventListener("DOMContentLoaded", function () {
  const windowsModel = document.querySelector(".credits-text");
  const closeButton = document.querySelector(".close");
  const credits = document.querySelector(".credits");

  function openModel() {
    windowsModel.style.display = "flex";
  }

  function closeModel() {
    windowsModel.style.display = "none";
  }

  credits.addEventListener("click", openModel);
  closeButton.addEventListener("click", closeModel);
});

function openTutorial() {
  document.getElementById("tutorialContainer").style.display = "block";
}

function closeTutorial() {
  document.getElementById("tutorialContainer").style.display = "none";
}
