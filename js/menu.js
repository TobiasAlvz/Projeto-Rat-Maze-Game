document.addEventListener("DOMContentLoaded", function () {
  const janelaModal = document.querySelector(".credits-text");
  const fecharBotao = document.querySelector(".close");
  const creditosLink = document.querySelector(".credits");

  function mostrarModal() {
    janelaModal.style.display = "flex";
  }

  function fecharModal() {
    janelaModal.style.display = "none";
  }

  creditosLink.addEventListener("click", mostrarModal);
  fecharBotao.addEventListener("click", fecharModal);
});
