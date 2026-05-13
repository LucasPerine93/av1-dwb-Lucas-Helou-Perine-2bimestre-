const containerEquipes = document.querySelector("#lista_equipes");

const urlApiOriginal =
  "https://api.sportradar.com/motogp/trial/v2/en/sport_events/sr:stage:1238599/summary.json?api_key=nP6tsHNgDpOQWclZSAEeKigHMKTTQQ6ev9nOEPPK";
const url =
  "https://api.codetabs.com/v1/proxy?quest=" +
  encodeURIComponent(urlApiOriginal);

async function carregar_equipes() {
  try {
    containerEquipes.innerHTML = `
      <div class="col-12 text-center mt-5">
        <div class="spinner-border text-dark" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-3 fw-bold text-muted">Carregando classificação de equipes...</p>
      </div>`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
    }

    const data = await res.json();
    console.log("JSON carregado com sucesso (Equipes):", data);
    
    const listaPilotos = data.stage.competitors;
    
    // Objeto para agregar os pontos por equipe
    const timesMap = {};

    listaPilotos.forEach(piloto => {
        if (piloto.team && piloto.team.name && piloto.result && typeof piloto.result.points === 'number') {
            const nomeEquipe = piloto.team.name;
            if (!timesMap[nomeEquipe]) {
                timesMap[nomeEquipe] = 0;
            }
            timesMap[nomeEquipe] += piloto.result.points;
        }
    });

    // Converter objeto em array e ordenar (ordem decrescente - maior pontuação no topo)
    const equipesClassificadas = Object.keys(timesMap).map(nome => {
        return {
            name: nome,
            points: timesMap[nome]
        };
    }).sort((a, b) => b.points - a.points);

    renderizarEquipes(equipesClassificadas);

  } catch (error) {
    console.error("Requisição falhou:", error);
    containerEquipes.innerHTML = `
      <div class="alert alert-danger shadow-sm rounded-4" role="alert">
        <h4 class="alert-heading">Ocorreu um erro!</h4>
        <p>Não foi possível conectar ou carregar os dados. Detalhes: ${error.message}</p>
      </div>`;
  }
}

function renderizarEquipes(equipes) {
    let html = "";

    if (equipes.length === 0) {
        containerEquipes.innerHTML = `
        <div class="text-center mt-5">
            <h5 class="text-muted">Nenhuma pontuação de equipe encontrada.</h5>
        </div>`;
        return;
    }

    equipes.forEach((equipe, index) => {
        const posicao = index + 1; // 1º, 2º, 3º...

        html += `
        <div class="standings-card" style="border-left-color: #1a1a1a;">
            <div class="position-badge">
                ${posicao}&deg;
            </div>
            
            <div class="flex-grow-1 ms-3">
                <h4 class="driver-name">${equipe.name}</h4>
                <p class="text-muted mb-0 small fw-bold text-uppercase">Equipe</p>
            </div>
            
            <div>
                <span class="points-badge">${equipe.points} PTS</span>
            </div>
        </div>
        `;
    });

    containerEquipes.innerHTML = html;
}

carregar_equipes();
