let artigosVisiveis = false;

function carregarArtigos() {
  const artigosDiv = document.getElementById("artigos");
  const lista = document.getElementById("lista-artigos");

  if (!artigosVisiveis) {
    fetch("../../assets/data/artigos.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro na requisição: " + response.status);
        }
        return response.json();
      })
      .then(data => {
        lista.innerHTML = "";
        data.forEach(item => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${item.titulo}:</strong> ${item.descricao}`;
          lista.appendChild(li);
        });
        artigosDiv.classList.add("ativo");
      })
      .catch(error => {
        console.error("Erro ao carregar os artigos:", error);
        lista.innerHTML = "<li>Erro ao carregar os artigos.</li>";
        artigosDiv.classList.add("ativo");
      });

    artigosVisiveis = true;
  } else {
    artigosDiv.classList.toggle("ativo");
  }
}

function irParaInicio() {
  window.location.href = "../inicio/inicio.html"; // atualizado para funcionar corretamente
}
