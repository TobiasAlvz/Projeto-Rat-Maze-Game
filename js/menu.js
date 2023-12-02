document.addEventListener("DOMContentLoaded", function () {
  const janelaModal = document.querySelector(".janela");
  const fecharBotao = document.querySelector(".fechar");
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
