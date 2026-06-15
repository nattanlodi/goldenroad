# Design — Modo "Worlds ao Vivo" (torneio multiplayer de 8 amigos)

> Status: **DESIGN-DOC** (nada implementado). Documento pra revisão antes de comprometer tempo.
> Decisões do usuário até aqui:
> - Bracket SEMPRE de **8 times** (quartas → semis → final do Worlds), Bo5, jogado ao vivo.
> - **Mínimo 2 jogadores humanos**; os slots restantes (até 8) são preenchidos por **BOTS**, que
>   draftam e jogam exatamente como os adversários de hoje. O modo é jogável sempre.
> - Draft simultâneo com **timer por pick configurável no lobby (10/20/30s)**.
> - Lobby tem **configs de sala** (só o host): tempo por escolha + modo Normal/Especialista (esconde
>   overalls, vale mais score) + cartas on/off + ritmo Rápido/Imersivo.
> - **Bots têm força VARIADA** (sem config de dificuldade — a eliminatória já filtra: fracos caem,
>   fortes sobem). Bots têm nome próprio engraçado + ícone 🤖.

---

## 1. Visão

Um amigo cria uma **sala**, manda o código no grupo. **De 2 a 8 humanos** entram; o jogo **completa
o bracket com BOTS** até 8 times. Os humanos draftam ao mesmo tempo (cada um livre, jogadores podem
repetir entre lines por agora); os bots recebem line própria no início. Com as 8 lines prontas (humanas
+ bots), sorteia-se o **bracket de 8** (quartas/semis/final) e cada confronto é uma **Bo5 simulada**
pelo motor atual — todos assistem o placar subir em sincronia. Quem perde vira espectador. No fim,
**1 campeão do mundo** (pode ser humano ou bot).

É a maior feature do jogo: o primeiro modo **online/multiplayer**. Tudo o resto hoje é local.

### Por que "bots preenchem" simplifica tudo
- **Jogável com 2** (ou até 1, testando) — não depende de juntar 8 amigos.
- **Bracket SEMPRE 8**: zero matemática de bracket variável (4/6/byes). A estrutura quartas→semi→final
  já existe e fica fixa.
- **Reusa o adversário de hoje**: o bot é literalmente o que o jogo já faz — sorteia uma line forte
  (`drawOpponent`/`weightedTeam`) e o motor simula. Nada novo de IA.
- **Confronto humano-vs-bot e humano-vs-humano** usam o MESMO motor (`simulateSeries`). O host só
  precisa saber, em cada série, se cada lado é humano (line draftada) ou bot (line sorteada) — a
  simulação é idêntica.

---

## 1.5. DIRETRIZ DE CONSISTÊNCIA VISUAL (regra travada — vale pra TODO o modo)

> **As telas novas (lobby, bracket borboleta, etc.) devem parecer que SEMPRE fizeram parte do jogo.**
> Nada de "app diferente colado por cima". Componentes novos: sim. Estilo novo: NÃO. Mesma língua
> visual das telas atuais (Start, Draft, Series, Result).

**Reusar os tokens e classes que já existem** (`src/index.css`), nunca inventar paleta/fonte:
- **Cores**: dourado `--color-gold #c9a24b` / `--color-gold-bright #e8ce86`; grafite `--color-ink
  #1a1f28` / painéis `--color-panel*`; texto `--color-cream/-muted/-dim`; acentos `--color-win`
  (verde vitória), `--color-red`/`-red-soft` (derrota), `--color-blue`. **Nada fora dessa paleta.**
- **Fontes**: `--font-display` (Oswald) pra títulos; `--font-logo` (Bebas) só no logo; `font-mono`
  (Geist) pra rótulos/números (RODADA, placares, médias). Igual hoje.
- **Componentes/classes prontos a reusar**: `.btn-gold` (CTA principal), `.btn-ghost` / `.btn-soft-gold`
  (secundários), `.btn-reroll` (rolar), `.panel-raised` (cards), `.card-comum/raro/epico/lendario/
  mitico/centuriao` (raridade por overall), `.text-gold-fill` (título gradiente), `.app-bg*` (fundo),
  `RoleBadge`, `Flag`, `Logo6x0`, `ScorePanel`, e o **`SeriesScreen`** inteiro (vira o painel da série
  no bracket). O bracket header já tem precedente: `MsiBracketHeader`/`FsBracketHeader` em SeriesScreen.
- **Padrões de UI já estabelecidos** a manter: cantos arredondados `rounded-2xl`/`rounded-[12px]`;
  bordas `border-gold/20..40`; "selo/badge" em pill com `font-mono` uppercase tracking; chips de fase
  verdes (passado `✓`) / dourado-contorno (atual) / cinza (futuro) — exatamente como os
  `MSI_SHORT`/`KO` chips de hoje; animações `anim-pop`/`anim-fade`/`row-in`.
- **Copiar código** (lobby) usa o mesmo padrão visual+lógico do `copyResult` ("✓ Copiado!").
- **Bracket borboleta**: construir com os MESMOS chips/cards de fase que o `MsiBracketHeader` já usa —
  é uma extensão visual do que existe, não um widget de outra biblioteca.

**Na prática**: antes de criar um componente novo, checar se já há um equivalente (botão, card, badge,
header de bracket) e estendê-lo. Telas novas montam-se com peças velhas + poucas peças novas no mesmo
estilo. Revisão visual final do usuário continua valendo (como nas fases anteriores).

---

## 2. Custo de infra — **R$0 no Supabase free tier**

A peça nova é um **"mensageiro" em tempo real** que conecta os 8 navegadores. Não é um servidor de
jogo pesado — só repassa eventos ("Fulano escolheu o Faker", "timer zerou", "quartas começaram").

Opção recomendada: **Supabase Realtime (free tier)**.
- **200 conexões concorrentes grátis** → uma sala usa 8 → cabem ~25 salas simultâneas no grátis.
- **2 milhões de mensagens/mês grátis** → um torneio inteiro gasta algumas centenas. Folga enorme.
- Funciona em qualquer rede (ao contrário de WebRTC puro, que falha atrás de alguns NATs).
- Só exige: criar conta grátis no Supabase (sem cartão) + guardar a `anon key` (pública, pode ir no
  bundle — a segurança vem das Row Level Security policies, não de esconder a chave).

> Só viraria custo se o jogo bombasse com **centenas de salas simultâneas** — problema bom pra depois.
> Alternativa sem cadastro: WebRTC/PeerJS, mas menos confiável (cai em redes difíceis). Não recomendada.

### Por que NÃO precisa de banco de dados "de verdade"
A sala é **efêmera** — existe só durante o torneio. Usamos os **canais Realtime** do Supabase
(pub/sub em memória) + o **Presence** (quem está online na sala). Nada é persistido. Quando o
torneio acaba, a sala some. Zero schema, zero migração.

---

## 3. Arquitetura (sem servidor de jogo)

### O problema central: quem é a "fonte da verdade"?
Com 8 navegadores resolvendo séries e avançando o bracket, precisa de um árbitro pra manter UM estado
único e coerente (placares, quem avançou, timers). (Conflito de pick NÃO é um problema por agora:
jogadores podem repetir entre lines — ver Draft.)

**Modelo escolhido: HOST-autoritativo.**
- Quem **cria a sala** é o HOST. O navegador dele roda a lógica-mestre (timer, validação de picks,
  sorteio do bracket, simulação das séries) e **transmite o estado** pros outros 7.
- Os outros 7 são **clientes**: mandam intenções ("quero pegar o Faker no MID") e **recebem o estado
  oficial** de volta. Eles não decidem nada sozinhos — só renderizam o que o host manda.
- Vantagem: lógica num lugar só (reusa quase tudo que já existe), sem conflito. É o padrão de jogos
  party online simples.
- Risco: se o HOST cair (fechar a aba), a sala morre. Mitigação no MVP: avisa "host saiu, sala
  encerrada". (V2: migração de host pro próximo jogador — fica pra depois.)

### Fluxo de uma mensagem (ex.: pick no draft)
```
Cliente 3 escolhe "Faker (MID)"
   → envia {tipo:"pick", jogador:"faker-t1-23", lane:"MID"} no canal da sala
   → HOST registra no estado-mestre (sem validar disponibilidade — picks podem repetir por agora)
   → HOST transmite o estado novo (progresso de cada um: "3/8 já escolheram a rodada" + timer)
   → todos os 8 navegadores renderizam o estado oficial
```
(A line de cada um pode ficar privada até o fim do draft — os outros só veem "Fulano já escolheu",
não O QUE escolheu, pra dar aquele suspense de revelar as lines antes das quartas. Opcional.)

### Sincronização do timer
O timer **não** roda independente em cada navegador (dessincroniza). O HOST é o relógio: transmite um
`deadline` (timestamp de quando a rodada acaba) e cada cliente conta localmente até ele. A duração da
rodada = a config `pickSeconds` (10/20/30) escolhida no lobby. Quando zera, o HOST aplica o
**auto-pick aleatório** (ver Draft) pra quem não escolheu e avança a rodada.

---

## 4. As telas / estados do modo

```
START ── "Worlds ao Vivo" ─┐
                           ▼
        ┌──────────────  LOBBY  ──────────────┐
        │ host: cria sala → código GOLD-4F2A   │
        │ + botão copiar · convidados digitam   │
        │ 8 slots: humanos (nick) + 🤖 bots     │
        │ configs do host (tempo/modo/cartas/   │
        │   ritmo) · host "Começar" (2..8)      │
        └───────────────────┬──────────────────┘
                            ▼
        ┌──────────  DRAFT SIMULTÂNEO  ────────┐
        │ rodada 1..5, todos ao mesmo tempo     │
        │ timer 10/20/30s (config) por rodada   │
        │ cada um rola livre (picks podem        │
        │   repetir) · auto-pick aleatório       │
        │ bots já têm line desde o início        │
        └───────────────────┬──────────────────┘
                            ▼
        ┌──────  BRACKET PERSISTENTE de 8  ─────┐
        │ sorteia 8 (aleatório) em 4 quartas    │
        │ 1 série por vez (HxH → HxBot);         │
        │   bot×bot resolve rápido no fundo      │
        │ timeline imersiva (config) · timer 10s │
        │   p/ iniciar · vencedores avançam       │
        └───────────────────┬──────────────────┘
                            ▼  SEMIS (2) ▼  FINAL (1)
        ┌────────────  RESULTADO / PÓDIO  ──────┐
        │ pódio 3 degraus + classificação dos 8 │
        │ prêmios (MVP/pentas/zebra) · score     │
        │ caminho do campeão · card PNG · 🎉      │
        └───────────────────────────────────────┘
```

### Detalhes por fase

**LOBBY**
- Sala aceita **2 a 8 humanos**. O host clica "Começar" com no mínimo 2 → os **slots vazios viram
  BOTS** até completar 8. O bracket é **sempre 8** (sem byes, sem matemática de bracket variável).
- Mostra os 8 slots: humanos conectados (nick) + os bots (🤖 nome) ("3 humanos · 5 bots").
- **Sem config de dificuldade dos bots**: eles têm força VARIADA por design; a eliminatória já faz a
  rampa (fracos caem, fortes sobem). Não há ajuste fácil/médio/elite.
- Presence mostra quem está conectado; se um humano sai antes de começar, libera o slot (ou já
  pode virar bot na hora).

**ENTRAR/CRIAR + NICK + COPIAR CÓDIGO (essenciais, regra travada):**
- **NICK obrigatório**: antes de entrar na sala, cada humano digita um **nick** (3–14 chars). É como
  ele aparece no lobby, no bracket e no resultado. **Só nick, SEM avatar** (regra travada — simples).
  - Sugestão: lembrar o último nick no `localStorage` pra não redigitar toda vez.
- **Criar sala** (host): gera um **código curto** (ex.: `GOLD-4F2A`) + um **link direto**
  (`/sala/GOLD-4F2A`). O lobby mostra o código GRANDE e um **botão "⧉ Copiar código"** (e um
  "⧉ Copiar link"). Reusa o padrão de copiar que já existe (`copyResult`: `navigator.clipboard` +
  feedback "✓ Copiado!"). É o jeito de mandar no grupo sem erro de digitação.
- **Entrar na sala** (convidado): cola/digita o código OU abre o link direto → cai numa tela "digite
  seu nick pra entrar" → entra. O link já leva o código embutido, então só falta o nick.
- **Validações**: código inexistente/sala cheia (8 humanos) / já começou → mensagem clara. Nick
  duplicado na mesma sala → pede outro (ou adiciona sufixo).

**CONFIGURAÇÕES DA SALA (só o HOST ajusta, no lobby — travadas ao "Começar"):**
- ⏱️ **Tempo por escolha**: `10s` · `20s` · `30s` (default 30s). É o relógio compartilhado do draft;
  vale pra todos os humanos por igual. Vai junto no estado da sala que o host transmite, então todos
  veem o mesmo timer. (Substitui o "30s fixo" das decisões anteriores → agora é configurável.)
- 👁️ **Modo de visualização**: `Normal` · `Especialista` — reusa a `difficulty` que já existe no jogo.
  - **Normal**: mostra os overalls dos jogadores no draft (como o "clássico" de hoje).
  - **Especialista**: **esconde os overalls** — todos escolhem "no olho". No multiplayer isso fica
    ainda mais tenso (ninguém vê número de ninguém) e **vale mais score** (o `score.ts` já dá ×1.3 pro
    especialista). ⚠️ Decisão: é um ajuste **da sala inteira** (todos no mesmo modo, pra ser justo) —
    não individual.
- 🃏 **Cartas de evento**: `Ligadas` · `Desligadas` (toggle do host). Ver "Cartas no torneio" abaixo.
- 🎬 **Ritmo da partida**: `Rápido` · `Imersivo` (default **Imersivo** no online). Imersivo = timeline
  fictícia do jogo de LoL com eventos subindo (ver "Partida imersiva" abaixo). Rápido = placar direto
  como no offline. Vale pra TODAS as séries do torneio (sincronia).

> Essas configs viram parte do "estado da sala" no Supabase. Como o HOST é autoritativo, basta ele
> guardar `{ pickSeconds, difficulty, cardsOn, pace }` e transmitir — clientes só leem e renderizam.
> (`difficulty` = Normal/Especialista da sala; NÃO existe dificuldade de bots.)

**DRAFT SIMULTÂNEO**
- **Bots recebem SUA line NO INÍCIO** (uma vez só): cada bot é um **participante fixo do torneio** com
  uma line sorteada do pool de finalistas (reusa `weightedTeam` sobre o subconjunto finalista). Essa
  line é **DELE pro torneio inteiro** — não é sorteada de novo a cada rodada (ver "Bracket REAL"). O
  bot draftar é instantâneo (não tem timer); só os humanos draftam com o relógio.
- **NOME do bot (regra travada)**: cada bot recebe um **nome próprio aleatório e engraçado** (ex.:
  "Marlon", "Valter", "Pedrinho"…) de uma lista fixa, sorteado sem repetir na sala. Aparece com um
  **🤖 ícone de robô antes do nick** (ex.: "🤖 Pedrinho") pra diferenciar dos humanos no lobby, bracket
  e pódio. Não é o nome do time da line — é a "pessoa" robô que controla aquela line.
- **Força VARIADA (regra travada)**: cada bot recebe uma line de força aleatória (uns ~84, uns ~94 —
  toda a faixa de finalistas). NÃO se nivela todos iguais. Como o torneio é eliminatório, **os bots
  fracos caem cedo e os fortes sobem** → a dificuldade do SEU caminho cresce **organicamente**, sem
  régua artificial. Quem você enfrenta na final (humano ou bot) é forte porque MERECEU chegar lá.
- **POOL NÃO É EXCLUSIVO por agora (regra travada)**: jogadores podem REPETIR entre as lines — dois
  humanos podem ter o mesmo Faker'15. Cada um drafta livre, do mesmo pool de finalistas, **sem disputar
  picks**. Como cada um rola seu próprio time, cair o MESMO time pra dois é raro, mas pode acontecer —
  tudo bem. Isso **elimina qualquer conflito de pick simultâneo** (não há "pool compartilhado" pra
  esvaziar) → o draft fica muito mais simples.
  - 🔜 **Futuro (V2)**: pool exclusivo — quem pega o Faker'15 tira ele dos outros. Fica pra depois.

### Pool restrito a FINALISTAS (regra travada — exclusivo do online)
No modo online, **só caem times que chegaram a uma final** — campeões E vice-campeões de Worlds e MSI
("torneio dos melhores"). O **draft solo NÃO muda** (continua com todos os times).
- Tamanho do pool: **50 times** (25 campeões + 25 vices) = **250 jogadores** de elite, pra 40 picks
  (8 lines × 5). Folga enorme, sem repetição forçada.
- Implementação: reusa o que já existe — filtra `DRAFT_TEAMS` por `t.champion || t.finalist` (a flag
  `finalist` já está nos dados; é o mesmo critério do `restrict: "finalists"` do `drawOpponent`). O
  sorteio ponderado (`weightedTeam`) roda sobre esse subconjunto. Zero dado novo.
- Os **bots** também sorteiam só finalistas (mesmo pool) — coerência do "torneio de elite".

### Rodadas sincronizadas + "rolar" individual (regra travada)
O grande problema vindo do solo: lá o jogador controla o ritmo (aperta "Rolar próximo time" quando
quer). No online, 8 pessoas precisam estar **na mesma rodada ao mesmo tempo**. Solução — separar duas
coisas que no solo estão juntas:

- **A RODADA é GLOBAL e travada pelo timer**: começou a rodada 3 → todos têm o mesmo countdown
  (`pickSeconds`). Quando zera, **todos avançam juntos** pra rodada 4 (auto-pick aleatório pra quem
  não escolheu). Ninguém adianta nem fica pra trás — o relógio do host manda.
- **O "ROLAR" é INDIVIDUAL e ilimitado DENTRO do seu tempo**: o botão "Rolar próximo time" continua —
  vira a ferramenta pessoal de *procurar* um time bom no seu countdown. Você rola → vê um time → não
  gostou → rola de novo (gasta seus segundos) → achou → **escolhe o jogador**. Rolar e escolher são
  PRIVADOS — não afetam os outros (jogadores podem repetir entre lines por agora). O host só registra
  a line de cada um; não precisa validar disponibilidade.
- **Mantém "rolar TIMES" (como hoje)** — não vira pool aberto de jogadores. Mecânica idêntica ao solo,
  jogadores já entendem, e "rolar de novo custa tempo" cria tensão boa.
- **Resumo**: rolar = privado, ilimitado, gasta tempo · escolher = público, definitivo, valida no host.

### Avanço antecipado (regra travada)
Se **TODOS os humanos** já escolheram antes do timer zerar, o host **pula o resto do countdown** e já
inicia a próxima rodada. Sem espera morta — draft ágil quando todos são rápidos. (Os bots não contam
pro gatilho; eles "escolhem" instantaneamente no início da rodada.)

### UI da rodada (adapta a tela atual de draft)
- **Timer global no topo** (`⏱ 0:18`) — todos veem o mesmo.
- O card de time rolado + lista de jogadores (como hoje), com lanes já ocupadas desabilitadas.
- Botão **"↻ Rolar outro time"** = consome o seu tempo (privado).
- **Barra do lobby**: progresso dos outros nesta rodada ("você ✓ · João ✓ · Ana 🎲 rolando…").
- Após escolher: estado "pronto", vê os outros; não pula sozinho (espera timer ou avanço antecipado).
- **Auto-pick (regra travada): COMPLETAMENTE ALEATÓRIO.** Ao zerar o timer, pra cada humano que não
  escolheu, o host sorteia um jogador **aleatório do pool disponível** (SEM olhar overall — pode cair
  craque ou perna-de-pau, é o risco de deixar zerar) e o aloca numa **lane ainda vazia sorteada**.
  Aleatório no JOGADOR, mas nunca desperdiça num slot já ocupado. Garante que ninguém trava a sala.
  - Não é "pega o melhor disponível" — é dado puro. Quem não draftou a tempo fica à mercê da sorte.
- **Reconnect**: se um cliente cai e volta, o host re-envia o estado atual.

**BRACKET AO VIVO**

### É um BRACKET REAL e PERSISTENTE (regra travada — base do modo)
⚠️ Diferença FUNDAMENTAL do solo: no solo cada série **sorteia um adversário novo**. No torneio NÃO —
os **8 competidores são definidos no início** (humanos + bots, cada um com sua line) e **avançam de
fase** ganhando, ou são **eliminados** perdendo. É um chaveamento de verdade.
- **Cada competidor (humano OU bot) carrega a MESMA line do início ao fim.** Quem vence sobe com a
  line dele; não há line nova por rodada. O "Bot DRX'22" é o mesmo participante, com a mesma line, da
  quarta até onde chegar.
- **Estado do bracket** (no host): uma árvore fixa de 8 → 4 → 2 → 1 com os competidores nas posições.
  Cada série resolve um nó; o vencedor preenche o nó da fase seguinte. Mecânica de torneio, não de
  "lutas avulsas".
- **Rampa de dificuldade ORGÂNICA**: como bots têm força variada e é eliminatório, os fracos caem nas
  quartas e os fortes sobem — sua final tende a ser contra alguém forte (humano ou bot) que MERECEU
  chegar. Sem régua de dificuldade artificial; o bracket faz a seleção sozinho.
- Implementação: reusa `simulateSeries`/`gameWinProb`/`rollSeriesHighlights` por confronto; o NOVO é a
  estrutura do bracket persistente (8 slots, avanço de vencedores) — ver §5.

- Monta o bracket inicial: distribui os 8 (humanos + bots) em 4 confrontos de quartas.
- **Seeding (regra travada pelo usuário):** as quartas têm 4 confrontos, então dá pra garantir
  "nenhum humano×humano nas quartas" só com **até 4 humanos** (1 por chave).
  - **2–4 humanos**: espalha 1 humano por confronto → todos começam contra **bot** nas quartas;
    amigos só podem se cruzar na **semi/final**.
  - **5–8 humanos**: impossível evitar (casa dos pombos) → **bracket sorteado aleatoriamente**, sem
    tentar evitar nada. Humano×humano nas quartas acontece naturalmente. Sem limitador de sala.
- Confrontos possíveis: humano×bot, humano×humano, bot×bot — **todos com o mesmo motor**.
- **bot×bot é RESOLVIDO RÁPIDO (regra travada)**: nenhuma série SEM humano é assistida em timeline
  imersiva (ninguém quer ver 3 min de dois bots). Ela é **simulada por completo por baixo** (as cartas
  são "pickadas" pelos bots, forma do dia 🔥/🧊, tudo computado de verdade) mas o **resultado aparece
  rapidinho**, como no offline — o bracket só preenche o placar final. Humanos veem o resultado, não a
  partida inteira. (Detalhe das escolhas de carta do bot abaixo.)

### Ritmo: UMA SÉRIE POR VEZ (regra travada)
O torneio inteiro é um **evento coletivo**: roda-se uma série por vez (todos assistem a mesma), o
bracket avança junto, com torcida coletiva. Não é paralelo. Quem já jogou/perdeu vira espectador.
- **Ordem das séries dentro de cada fase (regra travada)**: primeiro as **humano×humano**, depois as
  **humano×bot** (em ordem aleatória entre elas). As **bot×bot** são **resolvidas rápido em segundo
  plano** (sem assistir) e o bracket já mostra o resultado — não entram na fila de "assistir". Assim a
  galera vê primeiro os duelos mais quentes (entre amigos) e ninguém espera bots.
- O **host** controla a ordem e dispara cada série; transmite o placar jogo a jogo (sobe pra todos em
  sincronia). Cada série é a **Bo5 simulada** com o motor atual (`simulateSeries`/`gameWinProb`/
  `rollSeriesHighlights`).
- **Sua vez vs assistindo** (dois "chapéus" da tela):
  - É a SUA série → você tem o controle (aperta "jogar série", vê seu evento de pré-série/cartas).
  - É série de outros → modo **espectador**: placar sobe automático, sem controle, pode ir mais rápido.
- **Timer de início de série (regra travada): 10s.** Pra ninguém travar o torneio indo no banheiro:
  ao abrir um confronto, roda um countdown de **10 segundos**. Se **todos os humanos do confronto
  clicarem "jogar"** antes, **começa na hora**. Se zerar os 10s, a série **começa sozinha**. (Confronto
  humano×bot: basta o único humano clicar, ou o timer zerar.)
- Perdedores **continuam na sala** como espectadores (não saem; assistem o bracket até o fim).

### Layout da TELA DE JOGANDO: bracket "borboleta" + painel embaixo (regra travada)
Visual escolhido: **bracket clássico em borboleta** — metade dos confrontos no lado ESQUERDO, metade
no DIREITO, **convergindo pro CENTRO onde fica a GRANDE FINAL** (padrão de bracket de eSports). Não é
o formato linear esquerda→direita.

```
   QUARTAS        SEMIS                      SEMIS        QUARTAS
  (esquerda)    (esquerda)                 (direita)    (direita)

  João  ─┐
  DRX'22 ┘─ João ─┐                          ┌─ Bia ──  RNG'18
                  ├──┐                    ┌──┤          Lucas
  Ana   ─┐        │  │      ╔═════════╗   │  │
  Pedro  ┘─ Ana ──┘  └──────╢  FINAL  ╟───┘  └─ Bia ──  SSW'14
                            ║ 🏆 ??? ║                  FNC'11
                            ╚═════════╝
              ↑ vencedores convergem pro centro ↑
```

- **Topo da tela**: o bracket borboleta inteiro, sempre visível. Cada confronto = card com os dois
  donos (nick do humano / time do bot), placar e estado (⏸ aguardando · ⚔ ao vivo · ✓ terminado).
  A série **ao vivo** pulsa/destaca. Vencedores "sobem" visualmente rumo ao centro.
- **Embaixo**: a série atual abre num **painel que reusa o `SeriesScreen` de hoje** (VS de 3 colunas:
  line esquerda × centro placar × line direita, com pentas/MVP/placar animado). Vê o torneio E a ação
  ao mesmo tempo.
- Em telas estreitas (mobile): bracket colapsa num resumo compacto; o painel da série vira o foco.

### Partida IMERSIVA: timeline fictícia do jogo (regra travada)
Essencial pro online: as partidas **duram bem mais** e ganham drama. No offline o placar sobe rápido
(~1s/jogo); no online (modo Imersivo, default), **cada jogo vira uma mini-timeline** do "jogo de LoL"
com eventos cronometrados subindo na tela. Todos assistem juntos, com torcida.

> ⚠️ A timeline imersiva vale **só pra séries COM pelo menos um humano**. Séries **bot×bot** são sempre
> **resolvidas rápido** (simuladas por completo por baixo, mas sem timeline — ver Bracket), pra ninguém
> ficar assistindo dois bots. O modo "Rápido" do lobby aplica o ritmo rápido a TODAS as séries.

- **É 100% COSMÉTICO**: o resultado de cada jogo já foi decidido pelo `simulateSeries` (não muda nada).
  A timeline só **dramatiza** esse resultado pré-definido. Time mais forte = mais eventos a favor; mas
  com aleatoriedade pra ter tensão (o rival mais fraco "rouba o Baron" e dá esperança antes de cair).
- **Eventos RICOS, com nomes reais** (decisão do usuário). Catálogo de eventos cronometrados por "minuto
  de jogo" fictício, citando os jogadores das duas lines:
  - 🩸 First Blood ("Faker pega o Chovy no mid")
  - 🐉 Dragões / 🌩️ Alma do Dragão · 🦎 Arauto
  - 🦅 **Baron** (o momento-clímax — "GEN.G ROUBA o Baron!")
  - ⚡ Teamfights com placar (3×1, ace)
  - 🏰 Torres / inibidores caindo · 💥 Ace · ⚔ Pentakill (reusa os pentas que o motor já gera!)
  - 🏆 Nexus (fim do jogo)
- **Estende a narração que já existe**: hoje há `WIN_FLAVORS`/`LOSS_FLAVORS`/`seriesFlavor` (frase no
  fim). A timeline é a evolução disso — um gerador de **linha do tempo** a partir de quem venceu o jogo
  + os pentakills/MVP que o `rollSeriesHighlights` já produz. Os eventos "encaixam" nos destaques reais.
- **Duração**: cada jogo ~20–40s de timeline; uma Bo5 pode levar ~2–3 min. ⚠️ Implicação de ritmo: o
  torneio inteiro (7 séries) pode passar de 20 min no Imersivo — é o charme do "evento", e por isso o
  **Rápido** existe como alternativa no lobby.
- **Sincronia**: o HOST gera a timeline (a partir do resultado simulado + seed) e transmite os eventos
  no tempo certo; todos os clientes veem os mesmos eventos no mesmo instante. Um botão **"⏩ pular"**
  (só pro host, ou votação) pode acelerar uma série específica se o grupo quiser.
- **Reaproveita o painel da série**: a timeline aparece na coluna CENTRAL do `SeriesScreen` (onde hoje
  fica o "EM JOGO…" e o placar), como um feed de eventos rolando. Os flashes de penta/MVP que já
  existem viram eventos da timeline.

### Cartas no torneio (regra travada): config no lobby + CAOS LIBERADO
- **Toggle do host no lobby**: `Cartas Ligadas`/`Desligadas` (parte do estado da sala, `cardsOn`).
  Desligadas → torneio "puro" (só line vs line). Ligadas → o sistema de eventos roda como no solo.
- **Quando LIGADAS, é CAOS LIBERADO**: TODO o baralho entra, **inclusive as cartas de trocar/roubar
  jogador** (Curinga `swapOwnRole`, Olheiro `stealBest`, Troca Forçada `swapWithOpp`), os eventos de
  AZAR e a forma do dia 🔥/🧊. Nada é filtrado.
- **Chances IGUAIS às de hoje** (decisão do usuário): mantém os pesos atuais do baralho — e as cartas
  de troca **já são raras** (Curinga e Olheiro são `lendaria` ≈ 8%; Troca Forçada é `rara` ≈ 26%; peso
  global comum/rara/lendária = 70/26/8). Ou seja: o caos existe, mas é tempero ocasional — aquele
  momento memorável ("ele me ROUBOU o Faker!"), não enxurrada. Reusa `rollEventCards` sem mudar pesos.
- **Encaixe no ritmo "uma série por vez"**: o evento de carta acontece **na SUA série** (é a sua vez,
  ninguém fica ocioso à toa). Os outros veem no bracket "Fulano está num evento…". O host só inicia a
  simulação **depois** que o jogador resolveu a carta. Reusa o `EventCardOverlay` + `resolveEventCard`.
- **Cartas que mexem no rival**: contra um BOT, aplicam normal (o bot é só uma line). Contra outro
  HUMANO, o efeito vale pra aquela série (ex.: roubar o melhor do rival) — faz parte do caos. O host é
  autoritativo, então valida e transmite o estado resultante pros dois lados.

### SIMETRIA DE EVENTOS no confronto (regra travada — justiça PvP)
Se rolar carta numa série, **os DOIS lados do confronto recebem evento do mesmo NÍVEL** — ninguém leva
vantagem só porque "calhou" de receber carta e o oponente não. Mas **NÃO são as mesmas cartas**: cada
lado vê seu próprio trio e **escolhe a que preferir**. A simetria é de **NÍVEL/categoria**, não de carta.
- **Mesmo NÍVEL**: se um lado tem evento de BUFF, o outro também tem um evento de buff (do mesmo
  patamar de raridade/intensidade); se é DEBUFF (azar), os dois recebem azar. Nunca um ganha buff e o
  outro nada, nem um leva azar sozinho. (Vale pra forma do dia 🔥/🧊 também.)
- **Cada um ESCOLHE a sua** (humano×humano): os dois recebem 3 cartas do mesmo nível, mas **trios
  diferentes**, e cada um pega a que quiser. Interativo dos dois lados, justo no nível.
- **Timer de carta: 10s + auto-pick aleatório (regra travada)**: quando aparece o evento, há **10
  segundos** pra escolher. Se não pickar a tempo, o jogo escolhe **uma das 3 totalmente aleatória**
  (não a melhor — é o risco de demorar). Mantém o ritmo do torneio (ninguém trava na carta).
- **Humano vs Bot**: o humano vê seu trio e escolhe (10s/auto-pick aleatório); o BOT recebe um trio do
  mesmo nível e **picka a MELHOR** (bot não erra a escolha — ver bot×bot). Mesmo nível dos dois lados.
- **Bot×bot (resolvido rápido)**: cada bot recebe seu trio (mesmo nível) e picka **a MELHOR carta**.
  Tudo computado de verdade na simulação rápida (a forma 🔥/🧊 conta pra fase seguinte), só não é
  assistido. (Vale também pro bot que joga por ausência de um humano — ver §5.1.)
- **Cartas de TROCA/ROUBO** (Curinga `swapOwnRole`, Olheiro `stealBest`, Troca Forçada `swapWithOpp`):
  **só aparecem em humano×humano** (aí os dois podem roubar — é "justo no caos"). **Contra BOT não
  aparecem** (não há equivalente simétrico óbvio de "roubar do rival"). Mantêm a raridade atual.
- ⚠️ Nota de pool: roubar/trocar (só em humano×humano) pode trazer pra sua line um jogador **de fora
  do pool de finalistas**. Aceito no caos — pontual, raro.
- **No modo SOLO/carreira a regra de simetria NÃO se aplica** — lá é você contra a máquina, cartas
  assimétricas seguem como hoje. Simetria é exclusiva do PvP do torneio.

### FORMA DO DIA (🔥/🧊) vale pros BOTS também (regra travada)
Como os bots são **competidores de verdade** (line própria, avançam no bracket), a forma do dia roda
pros jogadores deles igual aos humanos — **inclusive em bot×bot**.
- **Hoje** (`computeForma` em effects.ts) só calcula pro SEU lado (`side: "you"`): 🔥 Fogo se um
  jogador foi MVP de 2+ jogos numa Bo5 (+3 na próxima série dele); 🧊 Gelado após derrota (−3).
- **No torneio**: calcular a forma pra **AMBOS os lados de QUALQUER confronto** (humano ou bot). O
  estado da forma de cada competidor **persiste entre as fases** (é o "do dia") — ex.: um bot que pegou
  🔥 na quarta entra com o buff na semi; um humano gelado 🧊 carrega o −3. Coerente com o bracket
  persistente (a line é a mesma; a forma acompanha o competidor).
- **bot×bot**: os dois lados podem ter 🔥/🧊 normalmente — tudo é computado de verdade na simulação,
  mas a série é **resolvida rápido** (não assistida em timeline, ver Bracket). A forma 🔥/🧊 ganha/perde
  ali conta pra fase seguinte do bot (persiste), mesmo sem a galera ter assistido o jogo.
- Implementação: generalizar `computeForma` pra receber um lado qualquer (não fixo em "you") e guardar
  a forma por competidor no estado do bracket. Reusa os badges/efeitos visuais existentes.

**RESULTADO / PÓDIO** (o grand finale — celebrativo e printável; regras travadas)

O bracket define a hierarquia natural: 🥇 1º (campeão, venceu a final) · 🥈 2º (vice) · 🥉 3º-4º
(semifinalistas) · 5º-8º (quartas). Tudo construído com os tokens/componentes atuais (§1.5) e o fundo
`VictoryBackdrop` (confete dourado, já existe e respeita reduced-motion).

- **Pódio de 3 degraus** (herói visual): top-3 num pódio de verdade — 1º alto/central, 2º à esquerda,
  3º à direita (os dois semis dividem o 3º). Nick + line. Usa dourado/prata/bronze dos
  selos que já existem (★ CAMPEÃO / 🥈 VICE / 🥉 SEMI).
- **Classificação dos 8** (regra travada): ordenada **por colocação no bracket** (quem foi mais longe
  na frente); o **SCORE só desempata DENTRO do mesmo nível** (ex.: entre os 4 das quartas, o de maior
  score fica em 5º). Cada linha: posição, nick, e o score (`score.ts`). Competitivamente justo.
- **Prêmios individuais** (troféus transversais, reconhecem quem não venceu):
  - 🏅 **MVP do torneio**: jogador com mais MVPs de série / pentas no torneio inteiro.
  - ⚔ **Rei dos Pentas**: mais pentakills (reusa os pentas que o motor já gera).
  - 🐴 **Zebra do torneio**: foi mais longe com a line mais fraca (usa o `zebraDiff` do `score.ts`).
  - 💀 **Decepção**: caiu mais cedo com a line mais forte (o "azarão" reverso).
- **Caminho do campeão**: mini-trilha de quem o campeão derrotou (quartas→semi→final) com placares —
  destaca a rota vencedora no bracket borboleta em dourado. Conta a história da conquista.
- **Card compartilhável do torneio (PNG)**: versão torneio do card que já existe (canvas em
  `downloadCard`) — pódio + campeão + os 8 classificados. "Fulano venceu o Worlds ao Vivo!".
- **Reações ao vivo**: confete dourado na celebração (`VictoryBackdrop`) + cada jogador manda um emoji
  (👏😱🐐) que aparece pra todos via Realtime — fecha o "evento coletivo" com a galera reagindo junta.
- **Espectadores/eliminados**: continuaram na sala vendo o bracket; no pódio veem sua colocação
  destacada na tabela dos 8. Ninguém "sai" antes do fim.

---

## 5. O que dá pra REUSAR vs o que é NOVO

### Reusa (muito já existe)
- **Dataset + draft semeado**: os times/jogadores e o sorteio (`drawAny`, `weightedTeam`). Só falta
  tornar o sorteio **determinístico por seed** (trocar `Math.random()` por um PRNG semeado).
- **Motor de batalha**: `simulateSeries`, `gameWinProb`, `rollSeriesHighlights` (pentas/MVP) — intactos.
- **Score**: `computeRunScore` aplica direto pra ranquear os 8.
- **Componentes visuais**: cards de jogador, RoleBadge, Flag, placar animado, bracket header.

### Novo (o trabalho de verdade)
1. **Camada de rede** (Supabase Realtime): conectar, canal da sala, presence, enviar/receber eventos.
2. **PRNG semeado**: `mulberry32(seed)` — ~5 linhas. Torna draft/bracket reproduzíveis e justos.
3. **Máquina de estados multiplayer**: lobby → draft → quartas → semis → final → resultado, com o
   estado vivendo no HOST e espelhado nos clientes.
4. **Lógica de timer compartilhado + auto-pick**.
5. **Bracket PERSISTENTE de 8** (estrutura nova): árvore 8→4→2→1, competidores fixos (humanos + bots
   com line própria gerada no início), avanço de vencedores, eliminação. É o que diferencia de "lutas
   avulsas". Cada nó usa o motor atual; a novidade é a estrutura/estado do chaveamento.
6. **Telas novas**: Lobby, DraftAoVivo, BracketAoVivo (e adaptar a ResultScreen pra modo torneio).
   ⚠️ **Construídas com os tokens/classes/componentes atuais** (ver §1.5) — coerentes com Start/Draft/
   Series/Result, não um estilo novo. "Componente novo, estilo velho."
7. **Reconexão + ausência** (ver §5.1): reconnect automático, re-entrar por ticket, line joga sozinha,
   vira bot se sumir de vez.

> **Critério de pronto de CADA degrau inclui a §1.5**: a tela tem que parecer parte do jogo (mesma
> paleta/fontes/cards/botões) e passar pela revisão visual do usuário antes de seguir.

---

## 5.1. Desconexão e RECONEXÃO (regras travadas)

A maior fonte de bug em multiplayer. Vantagem ENORME do nosso caso: as séries são **simuladas** (não
exigem o jogador clicando em tempo real), então **uma pessoa ausente não quebra a partida** — a line
dela compete sozinha. Isso simplifica tudo.

### O que conta como "cair"
- **Queda TEMPORÁRIA** (comum, recuperável): Wi-Fi/4G oscilou, túnel, elevador. A aba continua aberta.
  O Supabase detecta via **Presence** e **reconecta sozinho** quando a net volta.
- **Saída DEFINITIVA**: **fechou a aba/navegador** (sim, isso é cair), recarregou (F5 = cai e volta),
  PC desligou. A conexão morre; precisa **reabrir e re-entrar**.

### Reconexão (regra travada: AUTOMÁTICA + RE-ENTRAR)
- **Automática** (queda temporária): o Supabase reconecta; ao voltar, o **host re-envia o estado atual**
  (rodada/bracket/série) e a pessoa continua de onde parou. Transparente.
- **Re-entrar** (fechou a aba): guardamos um **ticket no `localStorage`** (`{ sala, playerId, nick }`).
  Ao **reabrir o link da sala**, o jogo reconhece "você é o João que caiu" e **devolve a vaga** — com a
  **line draftada intacta** e na posição do bracket onde estava. (Como voltar pra uma partida ranqueada
  após cair: sua vaga te espera.)

### Enquanto está fora / se NUNCA volta (regra travada: line joga sozinha → vira bot)
O torneio **nunca trava** esperando alguém. A vaga fica guardada, mas o jogo segue:
- **Caiu no DRAFT**: o timer (10/20/30s) corre normal; se não voltar a tempo de escolher → **auto-pick
  aleatório** (já definido) preenche. Voltou depois → retoma com a line que o auto-pick montou.
- **Caiu na SÉRIE dela**: a série é simulada automaticamente de qualquer jeito — a **line compete
  normal** (não perde por WO). Voltou → vê o resultado. (Eventos de carta dela, se ausente, resolvem
  como um bot: pick automático.)
- **Sumiu de vez**: passado um tempo de espera (ex.: ~60–90s sem Presence, OU já passou a vez dela), a
  vaga **vira um BOT** que continua com a **line que ela tinha**. O resto da sala não fica refém.
- **Host autoritativo** decide tudo isso (quem está presente, quando converter em bot) e transmite.

### Se o HOST cair
- **MVP**: a sala **encerra** com aviso claro ("o host saiu — sala encerrada"). É a limitação aceita do
  modelo host-autoritativo no início.
- **V2 (futuro)**: migração de host — passa a autoridade pro próximo jogador presente, sala sobrevive.
  Fica fora do MVP por complexidade.

---

## 6. Riscos / armadilhas (honestidade)

| Risco | Severidade | Mitigação no MVP |
|---|---|---|
| Host cai → sala morre | Alta | Avisar e encerrar; migração de host fica pra V2 (§5.1) |
| Humano cai/fecha a aba no meio | Alta | Reconnect automático + re-entrar por ticket; line joga sozinha; vira bot se sumir (§5.1) |
| Cliente trava o draft (some) | Alta | Auto-pick aleatório por timer resolve sozinho |
| Dessincronia de estado entre os 8 | Média | Host-autoritativo + reenvio de estado completo periódico |
| Uma pessoa trava a série (não clica "jogar") | Média | Timer de início de 10s → começa sozinho |
| Latência (placar fora de sincronia) | Baixa | Host transmite cada passo; clientes só renderizam |
| Abuso/trapaça (editar mensagens) | Baixa | Host valida tudo; casual entre amigos não justifica mais |

**O maior risco não é técnico nem de custo — é de ESCOPO.** É a maior feature do jogo. Fazer 8 +
bracket + rede + timer + reconnect tudo de uma vez tem alta chance de empacar no meio.

---

## 7. Plano de implementação recomendado (em degraus)

> Cada degrau é **jogável e testável** sozinho. Reduz risco e dá vitórias intermediárias.

**Degrau 0 — Fundação offline (sem rede)** ← ponto de partida recomendado
- PRNG semeado (`mulberry32`) + draft/bracket determinísticos por seed.
- Modo "torneio local" (1 humano + 7 bots): prova o **bracket PERSISTENTE de 8 + draft com timer +
  auto-pick** inteiro, sem rede. Bots com nome 🤖 e força variada.
- Já constrói no estilo certo (§1.5) as telas-base: Lobby, DraftAoVivo, BracketAoVivo (borboleta).
- Inclui a **timeline imersiva** (config Rápido/Imersivo) — ela é independente da rede e MELHORA o solo
  também. Resolve ~60% da lógica num ambiente fácil de debugar.

**Degrau 1 — Duelo 1v1 ONLINE**
- Pluga o Supabase: sala de **2 pessoas**, draft simultâneo, 1 Bo5. Resolve TODA a camada de rede
  (conectar, canal, presence, host-autoritativo, sync, reconnect por ticket) com o mínimo de jogadores.
- É a parte mais difícil (rede), isolada no caso mais simples.

**Degrau 2 — Escalar pra 8 + bracket persistente online**
- Com a rede sólida (degrau 1) e o bracket sólido (degrau 0), juntar os dois: lobby de 8, draft de 8,
  bracket persistente ao vivo, ordem das séries (HxH→HxBot, bot×bot no fundo), cartas com simetria de
  nível. Aqui é "montar peças prontas", não inventar do zero.

**Degrau 3 — Polish**
- Pódio completo (prêmios, caminho do campeão, card PNG), reações (emojis), espectadores, reconexão
  robusta.

**V2 (futuro, fora do MVP)**
- **Migração de host** (sala sobrevive se o host cair) · **pool exclusivo** (pegar Faker'15 tira dos
  outros) · ranking persistente entre amigos.

> Tentar pular direto pro Degrau 2 é construir o telhado antes da parede. Os degraus 0 e 1 são o que
> tornam o 2 viável sem empacar.

---

## 8. Decisões em aberto pra você (quando formos implementar)

Quase tudo já travado. ✅ = resolvido.

1. ✅ **Tamanho da sala**: mínimo 2 humanos, bots completam até 8. Bracket sempre 8.
2. ✅ **Bots no draft**: line própria independente, gerada no início (não disputa o pool dos humanos);
   força VARIADA; bracket persistente (a line é dele o torneio todo).
3. ✅ **Formato do draft**: rodadas sincronizadas pelo timer global; "rolar times" é individual/
   ilimitado dentro do seu tempo (privado), "escolher" é público; avanço antecipado.
4. ✅ **Ritmo do bracket**: uma série por vez (evento coletivo); bracket "borboleta" no topo + painel
   da série (`SeriesScreen`) embaixo. Bot×bot resolvido rápido (não assistido).
5. ✅ **Seeding**: 2–4 humanos espalham (todos vs bot nas quartas); 5–8 sorteio aleatório. Sem limitador.
6. ✅ **Dificuldade dos bots**: emergente — bots de força variada; eliminatória faz fracos caírem e
   fortes subirem. Sem config nem régua artificial.
7. ✅ **Identidade**: só **nick** obrigatório, SEM avatar. (Lembrar último nick no localStorage.)
8. ✅ **Convite**: código curto (GOLD-4F2A) **+** link direto, com **botão de copiar** (padrão do
   `copyResult`). Entrar = colar código ou abrir link → digitar nick.
9. ✅ **Escolha de carta do bot**: pega a **melhor** carta do trio (maior benefício / menor dano).
10. ✅ **Reconexão/ausência** (§5.1): reconnect automático + re-entrar por ticket; line joga sozinha;
    vira bot se sumir.
11. ✅ **Nomes dos bots**: nome aleatório engraçado (Marlon/Valter/Pedrinho…) + ícone 🤖. Não é o time.
12. ✅ **Timer de início de série**: 10s; começa antes se todos os humanos clicarem; senão, sozinho.
13. ✅ **Ordem das séries**: humano×humano primeiro, depois humano×bot (aleatório); bot×bot rápido no
    fundo (não assistido).
14. ✅ **Cartas no PvP**: mesmo NÍVEL pros dois (não as mesmas cartas); cada um escolhe a sua; timer de
    10s, auto-pick ALEATÓRIO se não escolher.
15. ✅ **Pool de jogadores**: por agora picks PODEM REPETIR entre lines (sem disputa/conflito). Pool
    exclusivo fica pra V2.
16. 🔜 **Migração de host** (só V2): host caiu → MVP encerra a sala; V2 passa a autoridade pro próximo
    presente. Adiado de propósito.

---

## 9. Resumo executivo

- **Caro? Não.** Supabase free tier cobre você e amigos com folga gigante (R$0).
- **Difícil? Sim** — é a maior feature do jogo (primeiro modo online). O risco é escopo, não custo.
- **Caminho seguro**: Degrau 0 (bracket offline) → Degrau 1 (1v1 online) → Degrau 2 (8 + bracket).
- **Reusa muito**: dataset, motor de batalha, score, componentes. O novo é rede + máquina de estados
  multiplayer + telas de lobby/draft/bracket ao vivo.
