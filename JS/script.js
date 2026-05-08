const container = document.querySelector('#grid_pilotos');

const urlApiOriginal = 'https://api.sportradar.com/motogp/trial/v2/en/sport_events/sr:stage:1238599/summary.json?api_key=nP6tsHNgDpOQWclZSAEeKigHMKTTQQ6ev9nOEPPK';
const url = 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(urlApiOriginal);

async function carregar_grid() {
    try {
        container.innerHTML = '<p>Carregando grid....</p>';

        const res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Erro de rede! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("JSON carregado com sucesso:", data);
        const listaPilotos = data.stage.competitors;
        let html ="";
    
        listaPilotos.forEach((piloto) => {
            const numeroMoto = piloto.result ? piloto.result.bike_number : 'Sem Nº';

            html += `
            <div>
                <h5> ${piloto.name} </h5>
                <p> Número: ${numeroMoto} </p>
                <hr>
            </div>`;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error("Requisição falhou:", error);
        container.innerHTML = `<p> Ocorreu um erro na conexão: ${error.message} </p>`
    }
}

carregar_grid();