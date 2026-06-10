# Handoff: 6×0 Worlds — jogo de montar a line invencível

## Overview
**6×0 Worlds** é um joguinho casual (estilo "82-0 da NBA" / "7-0 da Copa") focado em **League of Legends – Worlds**. O objetivo: montar a melhor line-up (5 lanes: Top, Jungle, Mid, ADC, Suporte) escolhendo **um jogador por rodada** de times reais e icônicos do Worlds, e então vencer **6 séries seguidas** nos playoffs sem perder — o "6-0 perfeito".

Fluxo macro:
1. **Tela inicial** → botão "Começar campanha".
2. **Draft** → escolhe dificuldade, rola um time aleatório, pega 1 jogador (que ocupa a lane natural dele), e role o próximo (manual). 3 resorteios disponíveis. Repete até as 5 lanes preencherem.
3. **Playoffs** → joga 6 séries uma a uma (3 fase suíça + quartas + semi + final), cada uma com animação de placar subindo.
4. **Tela de campeão** → nota da line, campeões mundiais, jornada 6-0, recorde e compartilhamento.

## About the Design Files
Os arquivos deste bundle são **referências de design feitas em HTML** (protótipos mostrando aparência e comportamento pretendidos) — **não** são código de produção pra copiar direto. A tarefa é **recriar estes designs no ambiente/codebase de destino** (React, Vue, Svelte, etc.), usando os padrões e bibliotecas já estabelecidos lá. Se ainda não houver ambiente, escolha o framework mais apropriado e implemente os designs nele.

Observação técnica: os arquivos `.dc.html` são "Design Components" — um runtime (`support.js`) renderiza um template declarativo + uma classe de lógica. **Toda a lógica de jogo, dados e estilos inline estão legíveis dentro do `Worlds 6-0.dc.html`** e servem de fonte da verdade pro comportamento. Você vai reimplementar isso como componentes do seu app (ex.: um componente React com `useState`/`useReducer`), não embutir o runtime `.dc.html`.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos, estados e interações são finais. Recrie a UI fielmente. As notas de "overall" dos jogadores são valores subjetivos (curados) — fáceis de recalibrar.

---

## Design Tokens

### Cores
| Token | Hex | Uso |
|---|---|---|
| Fundo base (topo→baixo) | `#222834` → `#1A1F28` | gradiente de fundo do app |
| Painel escuro | `#11151B` / `#0E1116` / `#0B0E12` | cards e seções |
| Painel claro (raised) | gradiente `rgba(46,55,70,.94)` → `rgba(32,39,51,.94)` | cards de time, linhas de jogador |
| Dourado primário | `#C9A24B` | acentos |
| Dourado brilhante | `#E8CE86` | títulos, números, destaques |
| Dourado claro (gradiente logo) | `#F8EBBE` → `#D8B45A` → `#9c7c30` | "6X0", tiers |
| Texto principal | `#F2ECDE` | corpo claro |
| Texto suave (muted) | `#9097A1` / `#A7ABB2` | legendas |
| Texto dim | `#777E89` / `#8B919B` | detalhes |
| Verde vitória | `#7ED08F` / gradiente `#86d79a`→`#5fae72` | placares de série, "novo recorde" |
| Azul (rio / nexus azul) | `#6aa0da` / `#2a6fb0` | river no mapa e na logo |
| Vermelho (nexus vermelho / oponente) | `#d27a68` / `#d2a08e` | base inimiga, coluna do adversário |
| Roxo (Barão) | `#9a72c9` | cova do Barão no mapa |
| Laranja (Dragão) | `#d2814a` | cova do Dragão no mapa |
| Borda dourada padrão | `rgba(201,162,75,0.16–0.4)` | bordas de cards |

### Tipografia (Google Fonts)
- **Display / títulos / nomes:** `Oswald` (pesos 500/600/700) — condensada, uppercase com `letter-spacing` 1–3px.
- **Números da logo "6X0":** `Bebas Neue` (peso 400) — alta e condensada.
- **Mono / labels / stats / notas:** `Space Mono` (400/700) — usada em rótulos uppercase com `letter-spacing` 1–3px e em todos os números de overall/placar.
- **Corpo:** `Barlow` (400/500/600).
- Fontes alternativas oferecidas como tweak no arquivo de logo: Anton, Archivo Black, Teko, Orbitron, Chakra Petch.

### Espaçamento / raios / sombras
- Raio de cards: `16px` (grandes), `12px` (médios), `10–11px` (botões), `999px` (pílulas).
- Gaps comuns: `8–14px` (listas), `18–26px` (colunas).
- Padding cards: `12–22px`.
- Sombra de elevação: `0 8px 24px rgba(0,0,0,0.45)`; glow dourado: `0 10px 30px rgba(201,162,75,0.32)`.
- Largura máx. do conteúdo: ~`1100–1180px`. Coluna esquerda do draft fixa em `344px`; direita flexível.
- **Breakpoint responsivo:** `vw < 920px` → empilha colunas (mobile). Implementado via listener de resize em JS (não media query).

### Keyframes / animações
- `scFade` (.35–.5s): fade + translateY(10→0) ao trocar de tela.
- `scPop` (.4s): escala 0.6→1.12→1 na revelação do placar da série.
- `scPulse` (2.6s loop): pulso de box-shadow nas bolinhas vazias do mapa.
- Roleta de sorteio: troca de estado a cada ~45–230ms (ease-out), 15 "flashes".
- Série animada: 1 jogo a cada 620ms.

---

## Screens / Views

### 1. Tela inicial (start)
- **Layout:** coluna centralizada, máx. 780px, fundo com glow dourado no topo.
- **Componentes:**
  - Pílula "★ DESAFIO WORLDS" (borda dourada, Space Mono 12px, uppercase).
  - **Logo 6X0** (SVG, ~clamp 240–460px) — ver seção "Logo" abaixo.
  - H1 "Monte a line invencível" (Oswald 600, clamp 22–38px, uppercase).
  - Parágrafo explicativo (Barlow, `#BFC4CD`).
  - Grid de 3 cards de regras ("01 — SORTEIO", "02 — ESCOLHA", "03 — 3 RESORTEIOS"), auto-fit min 190px.
  - Botão "Começar campanha" (Oswald 600, gradiente dourado `#F5E2A4→#D2AC52`, texto `#1A1F28`, hover sobe 2px).
  - Rodapé: "{N} campanhas no pool · LCK · LPL · LEC · LMS".

### 2. Draft (play)
Top bar + 2 colunas (esq: ação; dir: mapa do Rift).

**Top bar:** logo 6X0 pequena (clicável → volta à tela inicial), label "Draft · monte sua line", indicador "RODADA X/5", pílula de resorteios restantes (↻ N resorteios).

**Coluna esquerda — tem 4 estados:**
- **(a) Pré-draft (1º sorteio):** card "Antes de começar" + seletor de **Dificuldade**:
  - **Clássico** (mostra overall) / **Especialista** (esconde overall) — botões full-width, o selecionado com borda `#E8CE86`, fundo `rgba(201,162,75,.13)`, ✓ dourado.
  - Botão "🎲 Iniciar · rolar 1º time" (gradiente dourado).
- **(b) Sorteando (roleta):** o card mostra o nome do time **trocando rapidamente** (15 flashes, ease-out) com badge "🎲 SORTEANDO…" no topo direito e a lista de jogadores piscando (não-clicável).
- **(c) Time sorteado (escolha):** card do time com:
  - Header: nome do time (Oswald 600, 21px), liga (Space Mono 11px), ano `'YYYY` (Oswald 700, 24px, dourado), badge "★ CAMPEÃO" quando campeão (fundo `#E8CE86`, texto escuro).
  - Lista de 5 jogadores: cada linha = badge da role (TOP/JNG/MID/BOT/SUP, fundo dourado, texto escuro) + nome (Oswald 600, 17px) + label da lane + **overall** (Space Mono 700, 18px, dourado — escondido no Especialista). Hover: borda dourada, `translateX(5px)`, barra dourada à esquerda (`inset 3px 0 0 #E8CE86`). Lanes já preenchidas ficam **dimmed** (opacity .34, grayscale, dashed, não-clicável).
  - Abaixo: 2 botões de resorteio lado a lado: "↻ Outro time" (time diferente) e "↻ Outro Worlds" (mesmo time, outra campanha — desabilita se não houver outra). Cada um gasta 1 dos 3 resorteios e dispara a roleta.
- **(d) Pronto pra rolar (entre escolhas):** card "{N}/5 lanes preenchidas — Bora pro próximo" + botão "🎲 Rolar próximo time". **(IMPORTANTE: após cada escolha NÃO rola automático — o usuário clica pra rolar o próximo.)**
- **(e) Line completa:** card "LINE COMPLETA!" + mini-roster dos 5 escolhidos + botão "▶ Jogar os playoffs".

**Coluna direita — Mapa do Summoner's Rift (SVG estilizado):**
- Board quadrado arredondado (rx baixo, cantos retos) com textura sutil de "jungle" (pattern de curvas douradas low-opacity) e leve glow dourado.
- **Anel de lanes** (rounded-rect, faixa dourada) + **mid lane diagonal** ligando as duas bases nos cantos. As lanes têm "leito" opaco por baixo pra **passarem por cima do rio**.
- **Rio azul** reto, de canto a canto (top-left → bottom-right), perpendicular à mid.
- **Cova do Barão** (círculo roxo) no topo perto da jungle; **Cova do Dragão** (laranja) embaixo.
- **Base azul** (ícone losango, canto inferior-esquerdo) e **base vermelha** (canto superior-direito), bem nas pontas.
- **5 bolinhas das lanes** (≈clamp 52–68px) posicionadas: TOP (sup-esq, na top lane), JNG (jungle de cima esquerda), MID (centro), ADC/BOT e SUP (lado a lado no canto inferior-direito da bot lane). Vazias = dashed pulsante com a sigla da role (BOT exibido como **"ADC"**). Preenchidas = gradiente dourado, borda `#E8CE86`, glow, nome do jogador + overall (escondido no Especialista) + tag "TIME 'YY" embaixo.
- Posições no viewBox 0–100: `TOP[21,20] JNG[30,52] MID[50,50] BOT/ADC[84,85] SUP[71,84]`. Bases: azul `(12,88)`, vermelha `(88,12)`. Rio: `(19,19)→(81,81)`. Mid: `(15,85)→(85,15)`.

### 3. Playoffs (series)
- **Header:** "PLAYOFFS · RUMO AO 6–0" + 6 selos de progresso (1–6; vencidos viram ✓ verde; o atual com borda dourada pulsante).
- **3 colunas:** Sua line (esq) · Centro (confronto) · Linha do adversário (dir, tons avermelhados).
- **Centro — 3 sub-estados:**
  - **Antes:** "VS" grande + botão "▶ Jogar série".
  - **Em jogo (animado):** placar **subindo jogo a jogo** (ex.: 1–0 → 2–0 → 3–0, Space Mono verde 46px) + "EM JOGO…" + bolinhas verdes acendendo (1 a cada 620ms, com som).
  - **Revelado:** placar final (verde, scPop), "VITÓRIA", uma frase de narração, botão "Próxima série →" (ou "Erguer a taça 🏆" na final).
- Estágios e placares: Fase Suíça (Bo1 1-0, Bo3 2-0, Bo3 decisiva 2-0), Quartas/Semi/Final (Bo5 3-0). Adversários = 6 campanhas aleatórias do pool.

### 4. Campeão (result)
- **Header:** "★ Campeões do Mundo · 6–0 ★" + **TIER** grande (gradiente dourado) + descrição.
- Tiers por nota média: `≥95` DREAM TEAM · `≥92` SUPERTIME · `≥89` ELITE MUNDIAL · `≥86` CONTENDER · `<86` UNDERDOG.
- **2 stats:** NOTA DA LINE (média dos 5 overalls, Space Mono 700 42px) e CAMPEÕES MUNDIAIS (X/5).
- **Grid 2 colunas:** "Sua line" (5 jogadores com overall — sempre visível aqui, é a revelação) · "A jornada 6–0" (6 séries com placar verde).
- **Seção compartilhar:** "★ Novo recorde!" (se bateu), "Seu recorde de nota: NN", e 3 botões:
  - "⧉ Copiar resultado" → copia texto pro clipboard (vira "✓ Copiado!").
  - "⬇ Baixar imagem" → gera um PNG 1080×1080 da line (canvas) e baixa.
  - "Jogar de novo" → volta à tela inicial.

### Logo 6X0
- Lockup: dígitos **"6"** e **"0"** (Bebas Neue, gradiente dourado vertical `#F8EBBE→#D8B45A→#9c7c30`) com um **"X"** entre eles formado por **duas linhas cruzadas**: a da **mid lane** (dourada, do canto inf-esq ao sup-dir, com ponto azul/nexus embaixo e vermelho em cima) cruzando o **rio** (azul). Sem caixa em volta. Espaçamento confortável entre 6/0 e o X.
- **Marca compacta (favicon/ícone):** o mesmo X dentro de um **board arredondado** (rounded-square dourado) com os pontos azul/vermelho. Configurada como favicon via `data:image/svg+xml`.

---

## Interactions & Behavior
- **Sorteio (roleta):** dispara no "Iniciar" (1º), em cada "Rolar próximo time" e em cada resorteio. 15 flashes com delay ease-out (45→~230ms). Toca um "tick" por flash e um "pick" ao parar. Durante a roleta, picks e resorteios ficam bloqueados.
- **Escolha de jogador:** só clicável se a roleta parou e a lane está vazia. Ao escolher, o jogador vai pra lane natural dele; o time some e aparece o botão "Rolar próximo time" (**não automático**).
- **Resorteios:** 3 no total. "Outro time" sorteia time diferente; "Outro Worlds" sorteia outra campanha do mesmo time (desabilitado se não existir). Ambos gastam 1 e disparam a roleta.
- **Série:** "Jogar série" anima o placar subindo jogo a jogo (sempre vitória — o 6-0 é narrativo) antes de revelar. A última leva à tela de campeão (com fanfarra).
- **Som:** sintetizado via Web Audio (osciladores) — tick da roleta, confirmação de pick, vitória de série, fanfarra da taça. Botão de **mudo** fixo no canto sup-direito (🔊/🔇), persistido em `localStorage` (`w60_muted`). AudioContext criado/resumido no 1º gesto.
- **Dificuldade:** Clássico mostra overalls; Especialista esconde overalls no draft, no mapa e nas séries (a nota só é revelada na tela final).
- **Hover:** linhas de jogador e botões têm estados de hover (borda dourada, leve translate, sombra/glow).
- **Responsivo:** abaixo de 920px de viewport as colunas empilham.

## State Management
Estado central (um componente com estado tipo `useReducer`/`useState`):
- `phase`: `'loading' | 'start' | 'play' | 'series' | 'result'`.
- `difficulty`: `'classico' | 'especialista'`.
- `lineup`: `{ TOP, JNG, MID, BOT, SUP }` (cada um `null` ou objeto do jogador `{role,name,rating,team,short,year,league,champion}`).
- `current`: time sorteado atualmente (ou `null` entre escolhas/pré-draft).
- `rolling` + `rollDisplay`: animação da roleta (true + time piscando).
- `rerolls`: nº restante (começa em 3).
- `journey`: array das 6 séries (estágio, formato, placar, time adversário + players).
- `seriesIndex`, `revealed`, `seriesPlaying`, `gamesWon`: controle dos playoffs.
- `muted` (persistido), `copied` (feedback do botão copiar).
- Derivados (computados): `filledCount`, `complete (===5)`, `predraftFirst`, `readyRoll`, `showCard`, `showRatings (= !especialista)`, tier, nota média, etc.
- Persistência: `localStorage` → `w60_muted` (mudo) e `w60_record` (melhor nota).

Transições principais: `start →(Começar)→ play(pré-draft) →(Iniciar/roleta)→ play(time) →(escolhe)→ play(rolar) → … (5x) → play(line completa) →(Jogar playoffs)→ series (6x) →(Erguer a taça)→ result →(Jogar de novo)→ start`.

## Assets
- **Sem imagens externas.** Tudo é SVG inline (logo, mapa do Rift, favicon) + fontes do Google Fonts. Não há logos/fotos reais de times/jogadores (oportunidade futura: dropar assets reais nas linhas e bolinhas).
- **Dados** (`worlds-data.js`): ~21 campanhas icônicas do Worlds com 5 jogadores cada (`[role, nome, overall]`), liga e flag de campeão. Roles na ordem `TOP, JNG, MID, BOT, SUP`. As notas são curadas/subjetivas.

## Files
- `Worlds 6-0.dc.html` — **o jogo completo** (template declarativo + classe de lógica `Component`). Fonte da verdade pra layout, lógica, estados e estilos.
- `6-0 Logo.dc.html` — página de apresentação da logo 6X0 (versões claro/escuro + marca compacta + tweak de fonte).
- `worlds-data.js` — dataset dos times/jogadores (ES module: `export const TEAMS`, `ROLES`, `ROLE_LABELS`).
- `support.js` — runtime dos arquivos `.dc.html` (incluído só pra conseguir abrir os protótipos no navegador; **não** faz parte da implementação alvo).

### Como ler a lógica
Dentro de `Worlds 6-0.dc.html`, procure pela `class Component extends DCLogic`: ali estão `begin`, `rollSeq/rollStart` (roleta), `pick`, `rerollOther/rerollSame`, `playSeries` (série animada), `nextSeries`, `saveRecord/copyResult/downloadCard` (recorde + share), os métodos de áudio, e `renderVals()` que computa tudo o que o template consome. O template (markup acima da classe) mostra a estrutura visual exata com estilos inline.
