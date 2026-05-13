const container = document.querySelector("#grid_pilotos");
const inputBusca = document.querySelector("#input-busca");
const formBusca = document.querySelector("#form-busca");

const urlApiOriginal =
  "https://api.sportradar.com/motogp/trial/v2/en/sport_events/sr:stage:1238599/summary.json?api_key=nP6tsHNgDpOQWclZSAEeKigHMKTTQQ6ev9nOEPPK";
const url =
  "https://api.codetabs.com/v1/proxy?quest=" +
  encodeURIComponent(urlApiOriginal);

let todosPilotos = [];

async function carregar_grid() {
  try {
    // Feedback de carregamento utilizando Bootstrap (Spinner)
    container.innerHTML = `
      <div class="col-12 text-center mt-5">
        <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-3 fw-bold text-muted">Carregando grid de pilotos...</p>
      </div>`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
    }

    const data = await res.json();
    console.log("JSON carregado com sucesso:", data);
    
    // Armazena todos os pilotos na variável global
    todosPilotos = data.stage.competitors;
    
    // Renderiza a lista completa inicialmente
    renderizarPilotos(todosPilotos);
  } catch (error) {
    console.error("Requisição falhou:", error);
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger shadow-sm rounded-4" role="alert">
          <h4 class="alert-heading">Ocorreu um erro!</h4>
          <p>Não foi possível conectar ou carregar os dados. Detalhes: ${error.message}</p>
        </div>
      </div>`;
  }
}

function renderizarPilotos(listaPilotos) {
    let html = "";

    if (listaPilotos.length === 0) {
        container.innerHTML = `
        <div class="col-12 text-center mt-5">
            <h5 class="text-muted">Nenhum piloto ou equipe encontrado com esse nome.</h5>
        </div>`;
        return;
    }

    listaPilotos.forEach((piloto) => {
      const numeroMoto = piloto.result ? piloto.result.bike_number : "N/A";
      const nomeEquipe = piloto.team ? piloto.team.name : "Sem equipe";

      html += `
        <div class="col">
            <div class="card piloto-card shadow-sm h-100">
                <div class="card-header-motogp position-relative">
                    <h5 class="card-title text-truncate" title="${piloto.name}">${piloto.name}</h5>
                    <span class="bike-number">${numeroMoto}</span>
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <p class="text-muted mb-1 small text-uppercase fw-bold">Moto</p>
                        <p class="fs-5 fw-bold mb-3 text-dark">Nº ${numeroMoto}</p>
                    </div>
                    <div>
                        <span class="equipe-badge text-truncate d-block w-100" title="${nomeEquipe}">
                            ${nomeEquipe}
                        </span>
                    </div>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
}

// Event listener para a barra de pesquisa
if (inputBusca) {
    inputBusca.addEventListener("input", (e) => {
        const termoBusca = e.target.value.toLowerCase();
        
        const pilotosFiltrados = todosPilotos.filter((piloto) => {
            const nomePiloto = piloto.name.toLowerCase();
            const nomeEquipe = piloto.team ? piloto.team.name.toLowerCase() : "";
            
            return nomePiloto.includes(termoBusca) || nomeEquipe.includes(termoBusca);
        });
        
        renderizarPilotos(pilotosFiltrados);
    });
}

// Prevenir o recarregamento da página ao dar "Enter" no formulário de busca
if (formBusca) {
    formBusca.addEventListener("submit", (e) => {
        e.preventDefault();
    });
}

carregar_grid();
