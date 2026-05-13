const containerPerfil = document.querySelector("#perfil_container");

const urlApiOriginal =
  "https://api.sportradar.com/motogp/trial/v2/en/sport_events/sr:stage:1238599/summary.json?api_key=nP6tsHNgDpOQWclZSAEeKigHMKTTQQ6ev9nOEPPK";
const url =
  "https://api.codetabs.com/v1/proxy?quest=" +
  encodeURIComponent(urlApiOriginal);

// Utilizando URLSearchParams conforme os requisitos do projeto
const params = new URLSearchParams(window.location.search);
const pilotoId = params.get('id');

async function carregar_perfil() {
  if (!pilotoId) {
      containerPerfil.innerHTML = `
      <div class="alert alert-warning text-center rounded-4 shadow-sm" role="alert">
        Nenhum piloto selecionado. Por favor, volte para a tela principal e selecione um piloto.
      </div>`;
      return;
  }

  try {
    containerPerfil.innerHTML = `
      <div class="col-12 text-center mt-5">
        <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-3 fw-bold text-muted">Carregando detalhes do piloto...</p>
      </div>`;

    // Nova requisição à API para buscar os detalhes
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
    }

    const data = await res.json();
    console.log("JSON carregado com sucesso (Perfil):", data);
    
    const listaPilotos = data.stage.competitors;
    
    // Procura o piloto específico pelo ID passado na URL
    const piloto = listaPilotos.find(p => p.id === pilotoId);

    if (piloto) {
        renderizarPerfil(piloto);
    } else {
        containerPerfil.innerHTML = `
        <div class="alert alert-warning text-center rounded-4 shadow-sm" role="alert">
          Piloto não encontrado no campeonato.
        </div>`;
    }

  } catch (error) {
    console.error("Requisição falhou:", error);
    containerPerfil.innerHTML = `
      <div class="alert alert-danger shadow-sm rounded-4" role="alert">
        <h4 class="alert-heading">Ocorreu um erro!</h4>
        <p>Não foi possível conectar ou carregar os dados. Detalhes: ${error.message}</p>
      </div>`;
  }
}

function renderizarPerfil(piloto) {
    const numeroMoto = piloto.result ? piloto.result.bike_number : "N/A";
    const nomeEquipe = piloto.team ? piloto.team.name : "Sem equipe";
    const nacionalidade = piloto.nationality || "N/A";
    const corridas = piloto.result && piloto.result.races !== undefined ? piloto.result.races : "0";
    const pontos = piloto.result && piloto.result.points !== undefined ? piloto.result.points : "0";
    const pos = piloto.result && piloto.result.position !== undefined ? piloto.result.position + "&deg;" : "N/A";
    const victorias = piloto.result && piloto.result.victories !== undefined ? piloto.result.victories : "0";
    const podiums = piloto.result && piloto.result.podiums !== undefined ? piloto.result.podiums : "0";

    // Formatar o nome
    let nomeFormatado = piloto.name;
    if (nomeFormatado.includes(",")) {
        const partes = nomeFormatado.split(",");
        nomeFormatado = `${partes[1].trim()} ${partes[0].trim()}`.toUpperCase();
    } else {
        nomeFormatado = nomeFormatado.toUpperCase();
    }

    const html = `
    <div class="card piloto-card shadow-lg" style="cursor: default; transform: none;">
        <div class="card-header-motogp position-relative py-4">
            <h2 class="card-title text-truncate fw-bolder fs-1" title="${nomeFormatado}">${nomeFormatado}</h2>
            <span class="bike-number" style="font-size: 4rem; top: 20px;">${numeroMoto}</span>
        </div>
        <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="equipe-badge fs-5 px-3 py-2">
                    ${nomeEquipe}
                </span>
                <span class="badge bg-dark text-white fs-5 px-3 py-2 rounded-pill">Posição Atual: ${pos}</span>
            </div>

            <!-- Caixa de Telemetria Completa -->
            <div class="telemetry-box mt-4 p-4">
                <h4 class="mb-4 text-center text-uppercase fw-bold text-danger border-bottom border-secondary pb-3">Telemetria da Temporada</h4>
                
                <div class="telemetry-row fs-5 py-3">
                    <span class="telemetry-label text-white-50">Nacionalidade</span>
                    <span class="telemetry-value text-white">${nacionalidade}</span>
                </div>
                <div class="telemetry-row fs-5 py-3">
                    <span class="telemetry-label text-white-50">Equipe Atual</span>
                    <span class="telemetry-value text-white">${nomeEquipe}</span>
                </div>
                <div class="telemetry-row fs-5 py-3">
                    <span class="telemetry-label text-white-50">Nº Oficial da Moto</span>
                    <span class="telemetry-value text-white">${numeroMoto}</span>
                </div>
                <div class="telemetry-row fs-5 py-3">
                    <span class="telemetry-label text-white-50">Total de Pontos</span>
                    <span class="telemetry-value text-white">${pontos} PTS</span>
                </div>
                <div class="telemetry-row fs-5 py-3">
                    <span class="telemetry-label text-white-50">Corridas Disputadas</span>
                    <span class="telemetry-value text-white">${corridas}</span>
                </div>
                <div class="telemetry-row fs-5 py-3">
                    <span class="telemetry-label text-white-50">Vitórias</span>
                    <span class="telemetry-value text-white">${victorias}</span>
                </div>
                <div class="telemetry-row fs-5 py-3">
                    <span class="telemetry-label text-white-50">Pódios</span>
                    <span class="telemetry-value text-white">${podiums}</span>
                </div>
            </div>
        </div>
    </div>`;

    containerPerfil.innerHTML = html;
}

carregar_perfil();
