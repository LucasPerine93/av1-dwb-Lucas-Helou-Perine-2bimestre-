# Projeto MotoGP - Classificação e Telemetria API

Este projeto é uma aplicação web dinâmica desenvolvida para a avaliação **AV1 de Desenvolvimento de Websites (DWB)**. O objetivo principal é consumir dados de uma API pública (Sportradar) para exibir informações do campeonato de MotoGP de 2025.

## 🚀 Funcionalidades Implementadas

### Parte 1 - Listagem Principal
- **Grid de Pilotos:** Exibição dinâmica de todos os pilotos participantes da temporada na página inicial (`index.html`).
- **Cards Interativos:** Os cards dos pilotos possuem efeitos de hover e, ao serem clicados, expandem de forma suave (accordion) exibindo a telemetria/detalhes rápidos do piloto.
- **Busca em Tempo Real:** Campo de busca funcional na navbar que filtra os pilotos instantaneamente pelo nome ou pela equipe.

### Parte 2 - Navegação, Leaderboard e Detalhes
- **Classificação de Pilotos e Equipes:** Telas dedicadas (`detalhes.html` e `equipes.html`) com a classificação do campeonato em tempo real, somando os pontos das equipes de forma automática.
- **Menu Lateral Moderno:** Uma barra lateral expansível estilizada para navegação global.
- **Uso de URLSearchParams:** Implementação de uma página de perfil detalhado do piloto (`perfil.html`), que recebe o ID do piloto via parâmetro de URL (`?id=...`), realiza uma nova requisição à API e exibe os dados exclusivos do piloto selecionado.
- **Feedback Visual:** Implementação de spinners do Bootstrap para indicar carregamento (Loading) e alertas visuais de erro com tratamento de exceções na requisição da API (try/catch).

## 🛠️ Tecnologias Utilizadas
De acordo com os requisitos do projeto, **nenhum framework JavaScript (React, Vue, Angular)** foi utilizado.
- **HTML5 & CSS3** (Estilização customizada seguindo as diretrizes visuais da MotoGP).
- **Bootstrap 5** (Sistema de grid, botões, spinners, alertas).
- **JavaScript Puro (Vanilla JS)** (Lógica de filtragem, renderização do DOM, manipulação de eventos).
- **Fetch API & Async/Await** (Consumo da API JSON).
- **Git & GitHub** (Versionamento e entrega).

## 📁 Estrutura do Projeto

```text
/
├── index.html           # Página inicial (Listagem e busca)
├── detalhes.html        # Ranking de pilotos
├── equipes.html         # Ranking de equipes
├── perfil.html          # Perfil detalhado com URLSearchParams
├── css/
│   └── style.css        # Estilos globais
├── JS/
│   ├── script.js        # Lógica da página inicial
│   ├── detalhes.js      # Lógica do ranking de pilotos
│   ├── equipes.js       # Lógica do ranking de equipes
│   └── perfil.js        # Lógica de detalhes com parâmetros de URL
└── README.md            # Documentação do projeto
```

## 🏁 Como Executar
1. Clone este repositório ou faça o download dos arquivos.
2. Abra o arquivo `index.html` em qualquer navegador web moderno.
3. Não é necessária a instalação de dependências locais via NPM, pois o Bootstrap e as Fontes estão sendo importados via CDN, e o consumo de dados ocorre diretamente no navegador via Fetch API.
