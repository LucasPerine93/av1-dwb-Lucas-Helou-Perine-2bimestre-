const containerClassificacao = document.querySelector("#lista_classificacao");

const urlApiOriginal =
  "https://api.sportradar.com/motogp/trial/v2/en/sport_events/sr:stage:1238599/summary.json?api_key=nP6tsHNgDpOQWclZSAEeKigHMKTTQQ6ev9nOEPPK";
const url =
  "https://api.codetabs.com/v1/proxy?quest=" +
  encodeURIComponent(urlApiOriginal);

async function carregar_classificacao() {
  try {
    containerClassificacao.innerHTML = `
      <div class="col-12 text-center mt-5">
        <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-3 fw-bold text-muted">Carregando classificação do campeonato...</p>
      </div>`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
    }

    const data = await res.json();
    console.log("JSON carregado com sucesso (Classificação):", data);
    
    const listaPilotos = data.stage.competitors;
    
    // Filtrar pilotos que têm resultados e ordená-classificacao por pontos
    // A ordem pedida foi: começa em baixo (final da lista) com o menor, 
    // e sobe (início da lista) até o maior. Então, ordem Decrescente (Maior no topo).
    const pilotosClassificados = listaPilotos
        .filter(piloto => piloto.result && typeof piloto.result.points === 'number')
        .sort((a, b) => b.result.points - a.result.points);

    renderizarClassificacao(pilotosClassificados);

  } catch (error) {
    console.error("Requisição falhou:", error);
    containerClassificacao.innerHTML = `
      <div class="alert alert-danger shadow-sm rounded-4" role="alert">
        <h4 class="alert-heading">Ocorreu um erro!</h4>
        <p>Não foi possível conectar ou carregar os dados. Detalhes: ${error.message}</p>
      </div>`;
  }
}

function renderizarClassificacao(pilotos) {
    let html = "";

    if (pilotos.length === 0) {
        containerClassificacao.innerHTML = `
        <div class="text-center mt-5">
            <h5 class="text-muted">Nenhuma pontuação encontrada.</h5>
        </div>`;
        return;
    }

    pilotos.forEach((piloto, index) => {
        const posicao = index + 1; // 1º, 2º, 3º...
        const numeroMoto = piloto.result.bike_number;
        const pontos = piloto.result.points;

        html += `
        <div class="standings-card">
            <div class="position-badge">
                ${posicao}&deg;
            </div>
            
            <div class="flex-grow-1 ms-3">
                <h4 class="driver-name">${piloto.name}</h4>
                <p class="text-muted mb-0 small fw-bold">Moto Nº ${numeroMoto}</p>
            </div>
            
            <div>
                <span class="points-badge">${pontos} PTS</span>
            </div>
        </div>
        `;
    });

    containerClassificacao.innerHTML = html;
}

carregar_classificacao();
