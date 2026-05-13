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
      const nacionalidade = piloto.nationality || "N/A";
      const corridas = piloto.result && piloto.result.races !== undefined ? piloto.result.races : "0";
      const pilotoId = piloto.id; // Pegando o ID da API para passar na URL

      // Formatar o nome de "Sobrenome, Nome" para "NOME SOBRENOME"
      let nomeFormatado = piloto.name;
      if (nomeFormatado.includes(",")) {
          const partes = nomeFormatado.split(",");
          nomeFormatado = `${partes[1].trim()} ${partes[0].trim()}`.toUpperCase();
      } else {
          nomeFormatado = nomeFormatado.toUpperCase();
      }

      html += `
        <div class="col">
            <div class="card piloto-card shadow-sm h-100">
                <div class="card-header-motogp position-relative">
                    <h5 class="card-title text-truncate" title="${nomeFormatado}">${nomeFormatado}</h5>
                    <span class="bike-number">${numeroMoto}</span>
                </div>
                <div class="card-body d-flex flex-column justify-content-start">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="equipe-badge text-truncate" title="${nomeEquipe}">
                            ${nomeEquipe}
                        </span>
                        <span class="chevron-icon text-muted fs-5">&#9662;</span>
                    </div>
                    
                    <span class="click-hint text-center w-100 mt-2">Clique para Telemetria</span>

                    <!-- Caixa de Telemetria (Oculta por padrão) -->
                    <div class="piloto-card-telemetry">
                        <div class="telemetry-box mt-3">
                            <div class="telemetry-row">
                                <span class="telemetry-label">Nacionalidade</span>
                                <span class="telemetry-value">${nacionalidade}</span>
                            </div>
                            <div class="telemetry-row">
                                <span class="telemetry-label">Equipe</span>
                                <span class="telemetry-value">${nomeEquipe}</span>
                            </div>
                            <div class="telemetry-row">
                                <span class="telemetry-label">Nº Piloto</span>
                                <span class="telemetry-value">${numeroMoto}</span>
                            </div>
                            <div class="telemetry-row">
                                <span class="telemetry-label">Corridas</span>
                                <span class="telemetry-value">${corridas}</span>
                            </div>
                            <div class="mt-3 text-center">
                                <a href="perfil.html?id=${encodeURIComponent(pilotoId)}" class="btn btn-sm btn-outline-light rounded-pill px-4 fw-bold">Ver Perfil Completo</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
}

// Event listener para expandir o card ao clicar
container.addEventListener('click', (e) => {
    // Se clicou no botão "Ver Perfil Completo", não faz o toggle da caixa
    if (e.target.closest('a')) {
        return; 
    }

    const card = e.target.closest('.piloto-card');
    if (card) {
        card.classList.toggle('expanded');
    }
});

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
