function PopulatePage(data) {
    let artigos = data;
    let artigos_table = $("tbody");

    artigos_table.empty();

    for (let i = 0; i < artigos.length; i++) {
        const currentArticle = artigos[i];

        let entry_html = $(
            `<tr>
                <th class="article-id" scope="row"></th>
                <td class="article-titulo"></td>
                <td class="article-descricao"></td>
                <td><button type="button" onClick="SelectButton(this)" class="btn btn-primary">Select</button></td>
            </tr>`);

        entry_html.attr("data-article-id", currentArticle.id);

        entry_html.find(".article-id").text(currentArticle.id);
        entry_html.find(".article-titulo").text(currentArticle.titulo);
        entry_html.find(".article-descricao").text(currentArticle.descricao);

        artigos_table.append(entry_html);
    }
}

function SelectButton(button) {
    let id = $(button).closest('tr').attr("data-article-id");
    console.log("Selected Article ID:", id);

    fetch(`http://localhost:3000/artigos/${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            let form = $("#InputForm");
            console.log("Fetched Data for ID", id, ":", data);

            form.find("#ID").val(data.id);
            form.find("#tituloInput").val(data.titulo);
            form.find("#descricaoInput").val(data.descricao);
            form.find("#imagemInput").val(data.Imagem || '');
            form.find("#authorInput").val(data.author || '');
            form.find("#notesTextarea").val(data.notes || '');

            $('#stepsContainer').empty();

            if (data.Passos && data.Passos.length > 0) {
                data.Passos.forEach(step => {
                    addStepField(step);
                });
            } else {
                addStepField();
            }
        })
        .catch(error => {
            console.error('Error fetching article:', error);
            alert('Failed to load article details. Ensure JSON Server is running and ID is valid.');
        });
}

function NewButton(button) {
    fetch(`http://localhost:3000/artigos`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            let newId = data.length > 0 ? Math.max(...data.map(a => a.id)) + 1 : 0;
            let form = $("#InputForm");

            form.find("#ID").val(newId);
            form.find("#tituloInput").val("");
            form.find("#descricaoInput").val("");
            form.find("#imagemInput").val("");
            form.find("#authorInput").val("");
            form.find("#notesTextarea").val("");

            $('#stepsContainer').empty();
            addStepField();
        })
        .catch(error => {
            console.error('Error preparing new article form:', error);
            alert('Failed to prepare form for a new article.');
        });
}

function GetArtigo(artigoForm) {
    const id = artigoForm.find('#ID').val();
    const titulo = artigoForm.find('#tituloInput').val();
    const descricao = artigoForm.find('#descricaoInput').val();
    const imagem = artigoForm.find('#imagemInput').val();
    const author = artigoForm.find('#authorInput').val();
    const notes = artigoForm.find('#notesTextarea').val();

    const passos = [];
    $('#stepsContainer').children('.step-container').each(function () {
        const stepImage = $(this).find('.step-image').val();
        const stepTitle = $(this).find('.step-title').val();
        const stepNumber = parseInt($(this).find('.step-number').val());
        const stepText = $(this).find('.step-text').val();

        passos.push({
            Imagem: stepImage,
            TituloPasso: stepTitle,
            Numero: stepNumber,
            TextPassos: stepText
        });
    });

    const artigoData = {
        id: id ? parseInt(id, 10) : undefined,
        titulo: titulo,
        descricao: descricao,
        Imagem: imagem,
        author: author,
        notes: notes,
        Passos: passos
    };

    return artigoData;
}

function Submit(button) {
    let content = GetArtigo($('#InputForm'));
    let method;
    let url;
    let id = content.id;

    if (id === undefined || id === null || isNaN(id)) {
        method = 'POST';
        url = 'http://localhost:3000/artigos';
        delete content.id;
    } else {
        method = 'PUT';
        url = `http://localhost:3000/artigos/${id}`;
    }
    console.log(`Submitting with method: ${method}, URL: ${url}, Data:`, content);

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    }).then(res => {
        if (!res.ok) {
            return res.text().then(errorText => {
                throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText || 'No specific error message provided by server.'}`);
            });
        }
        return res.json();
    })
        .then(data => {
            console.log("Success:", data);
            alert(`Artigo ${method === 'POST' ? 'adicionado' : 'atualizado'} com sucesso!`);
            fetch('http://localhost:3000/artigos')
                .then(res => res.json())
                .then(updatedData => {
                    PopulatePage(updatedData);
                    NewButton();
                });
        })
        .catch(error => {
            console.error('Submission Error:', error);
            alert('Falha ao salvar o artigo. Verifique o console do seu navegador e certifique-se de que o JSON Server está rodando.');
        });
}

function addStepField(step = {}) {
    const stepsContainer = $('#stepsContainer');
    const stepIndex = stepsContainer.children('.step-container').length;

    const stepHtml = `
        <div class="step-container" data-step-index="${stepIndex}">
            <h4>Passo ${stepIndex + 1} <button type="button" class="btn btn-sm btn-danger float-end" onclick="removeStepField(this)">Remover</button></h4>
            <div class="form-group">
                <label for="stepImage_${stepIndex}">Image URL do Passo</label>
                <input type="text" class="form-control step-image" id="stepImage_${stepIndex}" value="${step.Imagem || ''}">
            </div>
            <div class="form-group">
                <label for="stepTitle_${stepIndex}">Titulo do Passo</label>
                <input type="text" class="form-control step-title" id="stepTitle_${stepIndex}" value="${step.TituloPasso || ''}">
            </div>
            <div class="form-group">
                <label for="stepNumber_${stepIndex}">Numero do Passo</label>
                <input type="number" class="form-control step-number" id="stepNumber_${stepIndex}" value="${step.Numero || (stepIndex + 1)}">
            </div>
            <div class="form-group">
                <label for="stepText_${stepIndex}">Texto do Passo</label>
                <textarea class="form-control step-text" id="stepText_${stepIndex}" rows="5">${step.TextPassos || step.TextPassao || ''}</textarea>
            </div>
        </div>
    `;
    stepsContainer.append(stepHtml);
    updateStepNumbers();
}

function removeStepField(button) {
    $(button).closest('.step-container').remove();
    updateStepNumbers();
}

function updateStepNumbers() {
    $('#stepsContainer').children('.step-container').each(function (index) {
        $(this).find('h4').html(`Passo ${index + 1} <button type="button" class="btn btn-sm btn-danger float-end" onclick="removeStepField(this)">Remover</button>`);
        $(this).find('input.step-number').val(index + 1);

        $(this).attr('data-step-index', index);
        $(this).find('.step-image').attr('id', `stepImage_${index}`);
        $(this).find('.step-title').attr('id', `stepTitle_${index}`);
        $(this).find('.step-number').attr('id', `stepNumber_${index}`);
        $(this).find('.step-text').attr('id', `stepText_${index}`);
    });
}

function Delete(button) {
    let idToDelete = $('#ID').val();

    if (!idToDelete) {
        alert('Selecione um artigo para excluir.');
        return;
    }

    const confirmDelete = confirm(`Tem certeza que deseja excluir o artigo com ID: ${idToDelete}?`);
    if (confirmDelete) {
        fetch(`http://localhost:3000/artigos/${idToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(errorText => {
                        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText || 'No specific error message provided by server.'}`);
                    });
                }
                alert('Artigo excluído com sucesso!');
                fetch('http://localhost:3000/artigos')
                    .then(res => res.json())
                    .then(data => {
                        PopulatePage(data);
                        NewButton();
                    });
            })
            .catch(error => {
                console.error('Deletion Error:', error);
                alert('Falha ao excluir o artigo. Verifique o console do seu navegador e certifique-se de que o JSON Server está rodando.');
            });
    }
}

$(function () {
    fetch('http://localhost:3000/artigos')
        .then(res => res.json())
        .then(data => {
            console.log('Initial data loaded:', data);
            PopulatePage(data);
        })
        .catch(error => {
            console.error('Error during initial data fetch:', error);
            alert('Failed to load articles. Ensure JSON Server is running on http://localhost:3000');
        });
});