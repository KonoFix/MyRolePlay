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
- [next] (A) **Mestre pode marcar condição em jogador remotamente** — chip clicável no card do jogador, update em `characters.sheet_json.activeConditions`.
- [ ] (A) **Tracker de iniciativa compartilhado** — DM adiciona combatentes (jogadores + NPCs), rola iniciativa, marca turno atual, todos veem.

## Prioridade A — Compêndio do Guia do Mestre 5e

- [x] (A) ~~Tabela de tesouro Individual~~ — feito em `dm-data.js` + aba NPCs
- [x] (A) ~~Calculadora de dificuldade de encontro por XP budget~~ — feito em `dm-data.js` + aba NPCs
- [ ] (A) **Importar monstros padrão (CR 0 a 5) do PDF do GdM** para `dm-data.js`. Precisa `brew install poppler` primeiro (`pdftotext` convert). PDF em `~/Downloads/dd-5e-guia-do-mestre-biblioteca-elfica.pdf`. Formato: `{ nome, cr, hp, ca, ataques, resistências, descrição }`.
- [ ] (A) **Tesouro de Dragão (Hoard)** — tabelas por CR do cap 7, equivalente ao Individual.
- [x] (A) ~~Gerador de nomes de NPC~~ — feito: tabelas humano/elfo/anão/orc (masc/fem + sobrenome) em `dm-data.js`, card na aba NPCs.

## Prioridade B — Qualidade de vida

- [x] (B) ~~Modo escuro/claro no `dm.html`~~ — feito (botão `#btnDmToggleTheme`)
- [x] (B) ~~Shortcut Ctrl/Cmd+K~~ — feito (palette com campaigns/arcs/players/maps)
- [x] (B) ~~Importar/Exportar campanha JSON~~ — feito (botões no header do DM)
- [x] (B) ~~Avatar do mestre~~ — feito (bucket avatars + círculo clicável no header)
- [ ] (B) **Botão "Visualizar como jogador"** — mestre vê o mapa com fog ativo + só suas fichas públicas (preview do que o player vê).
- [ ] (B) **Timeline de atividade no DM** — feed cronológico das mudanças (PV, condição, rolagem, movimento no mapa) usando realtime do canal.
- [ ] (B) **Botão "Enviar handout"** — DM anexa texto/imagem no modal, aparece pra jogadores selecionados.
- [ ] (B) **CRUD completo de NPCs** — formulário com stat block, lista na aba NPCs, converter em token com 1 clique.

## Prioridade C — Refinamento futuro

- [ ] (C) Som/música ambiente (free tier do Jamendo API).
- [ ] (C) Timer de turno de iniciativa com beep ao esgotar.
- [ ] (C) Logs de alterações da ficha (quem mudou PV e quando) — tabela `audit_log` + render no DM.
- [ ] (C) Dark/light theme no `login.html`.
- [ ] (C) PWA — instalável como app no celular do jogador (manifest.json + service worker).
- [ ] (C) Exportar PDF da ficha (print layout já pronto; só adicionar botão).

## Precisa de clarificação

- **[2026-10-26] Vários branches `routine/*` implementam os mesmos itens sem merge em `main`.** Como nenhum branch de rotina anterior foi mesclado, o item `[next]` "condição remota" e o item "tracker de iniciativa" foram implementados de forma independente e duplicada em pelo menos 3 e 2 branches respectivamente (`routine/20261022-2236`, `routine/20261024-0915`, `routine/20261025-1513` para condições; `routine/20261023-0915`, `routine/20261024-1404` para iniciativa). Recomenda-se revisar e mesclar a melhor versão de cada um em `main` e descartar os branches redundantes, para que a rotina automática não continue reimplementando os mesmos itens. Por isso, hoje a rotina pulou o `[next]` e o item de tracker de iniciativa (já cobertos nesses branches) e implementou o gerador de nomes de NPC em vez disso.

---

## Como adicionar itens

- Edite este arquivo manualmente **ou** peça pro Claude: `claude -p "Adicione ao .claude/backlog.md: nova feature X na prioridade A, com dica sobre arquivo Y"`.
- Marque `[next]` no item que deve ser pego na próxima rotina (se nenhum tiver `[next]`, pega o primeiro `[ ]` da seção A).
