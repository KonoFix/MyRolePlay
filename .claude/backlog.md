# Backlog da Rotina

**Modo atual: sob demanda** — não há agendamento automático. Quando quiser evoluir o repo, abra uma sessão do Claude Code aqui no diretório e diga:

> "Pega um item do backlog e implementa"

Eu leio este arquivo, escolho o primeiro `[next]` (ou primeiro `[ ]` da seção A), implemento e commit.

Para reativar automação no futuro, veja `scripts/README.md`.

---

Formato: `- [status] (prioridade) título` — status: `[ ]` pendente · `[next]` próximo · `[wip]` em andamento · `[x]` feito · `[?]` precisa clarificação.
Prioridade: **A** = alta, **B** = média, **C** = baixa.

---

## Prioridade A — Fundamentos & segurança

- [x] (A) ~~Criar bucket `maps` no Supabase Storage via SQL migration~~ — feito em `supabase/migrations/20261021180000_maps_bucket.sql`
- [x] (A) ~~Preview Markdown no editor de narrativa~~ — feito (marked@12 + DOMPurify@3, abas Editar/Dividir/Preview)
- [x] (A) ~~Rate limit no insert de `dice_rolls`~~ — feito em `supabase/migrations/20261021190000_dice_rolls_rate_limit.sql`
- [x] (A) ~~Realtime presence~~ — feito (presence channel + dot verde nos cards + contador "X/Y online")
- [x] (A) ~~Modal "Ver detalhes" expandido do jogador no DM~~ — feito: clicar no card abre modal com atributos (c/ bônus racial), salvaguardas, perícias, slots de magia, moedas, condições.
- [x] (A) ~~Chat de campanha~~ — feito: `shared/chat-widget.js` (Supabase Realtime Broadcast, efêmero, sem tabela no banco). Widget flutuante compartilhado entre `dm.js` e `app-boot.js`, reaproveita o mesmo canal `campaign:<id>` já usado para presença/postgres_changes.
- [?] (A) ~~Mestre pode marcar condição em jogador remotamente~~ — **já implementado** em 3 branches não mesclados (`routine/20261022-2236`, `routine/20261024-0915`, `routine/20261025-1513`); ver nota em "Precisa de clarificação". Não reimplementar — mesclar um deles em `main`.
- [?] (A) ~~Tracker de iniciativa compartilhado~~ — **já implementado** em 2 branches não mesclados (`routine/20261023-0915`, `routine/20261024-1404`); ver nota em "Precisa de clarificação". Não reimplementar — mesclar um deles em `main`.

## Prioridade A — Compêndio do Guia do Mestre 5e

- [x] (A) ~~Tabela de tesouro Individual~~ — feito em `dm-data.js` + aba NPCs
- [x] (A) ~~Calculadora de dificuldade de encontro por XP budget~~ — feito em `dm-data.js` + aba NPCs
- [ ] (A) **Importar monstros padrão (CR 0 a 5) do PDF do GdM** para `dm-data.js`. Precisa `brew install poppler` primeiro (`pdftotext` convert). PDF em `~/Downloads/dd-5e-guia-do-mestre-biblioteca-elfica.pdf`. Formato: `{ nome, cr, hp, ca, ataques, resistências, descrição }`.
- [x] (A) ~~Tesouro de Dragão (Hoard)~~ — feito: `DM_DATA.treasureHoard` em `dm-data.js` (moedas fixas por faixa de CR + d100 extra de objetos de arte/gemas/item mágico com tabela A–I), novo card "Tesouro de Covil" na aba NPCs (`dm.html`/`dm.js`).
- [?] (A) ~~Gerador de nomes de NPC~~ (humano, elfo, anão, orc) — **já implementado** em `routine/20261026-0915` (não mesclado). Não reimplementar — mesclar em `main`.

## Prioridade B — Qualidade de vida

- [x] (B) ~~Modo escuro/claro no `dm.html`~~ — feito (botão `#btnDmToggleTheme`)
- [x] (B) ~~Shortcut Ctrl/Cmd+K~~ — feito (palette com campaigns/arcs/players/maps)
- [x] (B) ~~Importar/Exportar campanha JSON~~ — feito (botões no header do DM)
- [x] (B) ~~Avatar do mestre~~ — feito (bucket avatars + círculo clicável no header)
- [ ] (B) **Botão "Visualizar como jogador"** — mestre vê o mapa com fog ativo + só suas fichas públicas (preview do que o player vê).
- [ ] (B) **Timeline de atividade no DM** — feed cronológico das mudanças (PV, condição, rolagem, movimento no mapa) usando realtime do canal.
- [ ] (B) **Botão "Enviar handout"** — DM anexa texto/imagem no modal, aparece pra jogadores selecionados.
- [?] (B) ~~CRUD completo de NPCs~~ — **já implementado** em `routine/20261027-0914` (não mesclado). Não reimplementar — mesclar em `main`.

## Prioridade C — Refinamento futuro

- [ ] (C) Som/música ambiente (free tier do Jamendo API).
- [ ] (C) Timer de turno de iniciativa com beep ao esgotar.
- [ ] (C) Logs de alterações da ficha (quem mudou PV e quando) — tabela `audit_log` + render no DM.
- [ ] (C) Dark/light theme no `login.html`.
- [ ] (C) PWA — instalável como app no celular do jogador (manifest.json + service worker).
- [ ] (C) Exportar PDF da ficha (print layout já pronto; só adicionar botão).

## Precisa de clarificação

- **[2026-10-28] `main` continua sem receber merge de nenhum branch `routine/*` — isso causa reimplementação duplicada.** Cada rotina começa com `git checkout main`, e como nenhum branch de rotina anterior foi mesclado nessa linha, o `backlog.md` em `main` nunca reflete o que já foi feito nos branches. Hoje eu ia implementar "Mestre pode marcar condição em jogador remotamente" (o item `[next]` abaixo) e só não criei uma **4ª** cópia porque consultei `.claude/routine.log` (arquivo local, não versionado, mas que sobrevive entre checkouts nesse clone) e vi que já existe em `routine/20261022-2236`, `routine/20261024-0915` e `routine/20261025-1513`. Pelo mesmo motivo, "Tracker de iniciativa compartilhado" já existe em `routine/20261023-0915` e `routine/20261024-1404`; "Gerador de nomes de NPC" (ainda listado como `[ ]` abaixo) já existe em `routine/20261026-0915`; e "CRUD completo de NPCs" (seção B, ainda `[ ]` abaixo) já existe em `routine/20261027-0914`. Troquei para "Tesouro de Dragão (Hoard)" porque é o único item de prioridade A sem nenhuma implementação prévia em qualquer branch. **Ação recomendada:** revisar e mesclar manualmente a melhor versão de cada feature duplicada em `main`, apagar os branches redundantes, e só então marcar os itens correspondentes como `[x]` aqui — isso evita que essa nota (e a duplicação) se repita a cada rotina. Até isso acontecer, a próxima rotina deve tratar `[next]` condição-remota, iniciativa, nomes-de-NPC e CRUD-NPCs como **já feitos** (conferir `.claude/routine.log` ou os branches citados) e pular para o próximo item realmente pendente.

---

## Como adicionar itens

- Edite este arquivo manualmente **ou** peça pro Claude: `claude -p "Adicione ao .claude/backlog.md: nova feature X na prioridade A, com dica sobre arquivo Y"`.
- Marque `[next]` no item que deve ser pego na próxima rotina (se nenhum tiver `[next]`, pega o primeiro `[ ]` da seção A).
