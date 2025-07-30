
const apiUrl = "http://localhost:3000/videos";

// Função para listar os vídeos na tela
function listarVideos() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(videos => {
            const container = document.getElementById("lista-videos");
            if (!container) return;
            container.innerHTML = "";

            videos.forEach(video => {
                const div = document.createElement("div");
                div.className = "video-item";
                div.innerHTML = `
                    <h3>${video.titulo}</h3>
                    <p>${video.descricao}</p>
                    <iframe width="300" height="200" src="${video.url}" frameborder="0" allowfullscreen></iframe>
                    <br>
                    <button onclick="removerVideo('${video.id}')">Remover</button>
                    <hr>
                `;
                container.appendChild(div);
            });
        });
}

// Função para adicionar novo vídeo
function adicionarVideo(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo")?.value;
    const descricao = document.getElementById("descricao")?.value;
    const url = document.getElementById("link")?.value;

    if (!titulo || !descricao || !url) {
        alert("Preencha todos os campos.");
        return;
    }

    const novoVideo = {
        titulo,
        descricao,
        url,
        tipo: "youtube"
    };

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoVideo)
    })
    .then(() => {
        listarVideos();
        document.getElementById("form-video").reset();
    });
}

// Função para remover vídeo
function removerVideo(id) {
    fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    })
    .then(() => listarVideos());
}

// Chamada inicial
document.addEventListener("DOMContentLoaded", listarVideos);
