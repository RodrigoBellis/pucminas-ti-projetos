
function PopulatePage(data, i) {


    console.log(i);
    console.log(data);
    let artigo = data;
    console.log(artigo);
    console.log(i)
    console.log(artigo[0])
    let titulo = artigo[i]["nome"];
    console.log($("h1, #nome_artigo").text)
    $("h1, #nome_artigo").text(titulo);
    $("title").text(titulo);
    let artigo_passos = $("section, .artigo_passos");
    artigo_passos.empty();
    let passos_json = artigo[i]["Passos"];
    for (let i = 0; i < passos_json.length; i++) {
        passos_data = passos_json[i];
        let passo_html = $(`<div class="passo" tabindex=0>
             <div class="row">
                <div class="col-md-12 image-heading-container">
                    <div class="col-md-auto">
                        <img id="passo_img" src="https://picsum.photos/300/200" alt="Imagem do Passo">
                    </div>
                    <div class="col-md-auto">
                        <h2 id="passo_titulo">Passo Numero 1</h2>
                    </div>
                </div>
            </div>
            <div class="row">
                <p id="passo_content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquam finibus nunc sed ornare.
                    Nullam et libero euismod, hendrerit ante ac, eleifend orci. Sed aliquet tortor vitae ex
                    fermentum,
                    euismod dictum augue iaculis. Vestibulum et lobortis urna. Nullam aliquet enim sed venenatis
                    euismod. Curabitur a vehicula sapien, eu malesuada ipsum. Donec at viverra felis. Donec
                    vestibulum
                    ipsum nec nulla placerat, et sodales nibh viverra. Nullam dignissim magna blandit ante rutrum
                    sagittis. Nullam porta tincidunt mi, in consequat est mattis vitae. Ut mauris lorem, auctor sed
                    velit vitae, lobortis aliquam risus. </p>
            </div>
           </div>`);
        passo_html.find("#passo_img").attr('src', passos_data["Imagem"]);
        passo_html.find("#passo_titulo").text(passos_data["TituloPasso"]);
        passo_html.find("#passo_content").text(passos_data["TextPasso"]);
        artigo_passos.append(passo_html);

    }

}
function convertArticleToPlainText(data, articleIndex) {
    if (!data || !data.artigos || !data.artigos[articleIndex]) {
        console.error("Invalid data or article index.");
        return "";
    }

    const artigo = data.artigos[articleIndex];
    let plainTextLines = [];

    plainTextLines.push(artigo.nome);
    plainTextLines.push("");

    if (artigo.Passos && Array.isArray(artigo.Passos)) {
        artigo.Passos.forEach(passo => {
            plainTextLines.push(`Passo ${passo.Numero}`);
            plainTextLines.push(passo.TituloPasso);
            plainTextLines.push(passo.TextPasso);
            plainTextLines.push("");
        });
    }

    return plainTextLines.join("\r\n");
}
$(function () {

    let params = new URLSearchParams(location.search)
    if (params.has('id')) {
        console.log(params.has('id'))
        let i = new URLSearchParams(location.search).get("id")
        fetch('http://localhost:3000/artigos')
            .then(res => res.json())
            .then(data => {
                PopulatePage(data, i);
                $('.passo').on(`click`, function () {
                    $(this).trigger(`focus`)
                    console.log(`Focused`)
                })

            })

    }
    else {
        let i = 0
        fetch('http://localhost:3000/artigos')
            .then(res => res.json())
            .then(data => {
                let artigo = data;
                PopulatePage(data, i);
                $('.passo').on(`click`, function () {
                    //FocusColor(this)
                    $(this).trigger(`focus`)
                    console.log(`Focused`)
                })
                $('.download-button-side').on(`click`, function () {
                    const link = document.createElement('a');



                    // Set href with data URI
                    let plainText = convertArticleToPlainText(data, i)
                    const encodedPlainText = encodeURIComponent(plainText); // Encode the plain text
                    link.href = `data:text/plain;charset=utf-8,${encodedPlainText}`;
                    link.download = `${artigo[i]["nome"]}.txt`;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
            })
    }

});
