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
- [next] (A) **Modal "Ver detalhes" expandido do jogador no DM** — clicar no card abre modal com atributos completos, salvaguardas, perícias, slots de magia, condições. Reutiliza `sheet_json` já carregado.
- [ ] (A) **Chat de campanha** — canal broadcast realtime no `dm.html` + `index.html`. Mensagens efêmeras (não precisa persistir) com nickname + timestamp.
- [ ] (A) **Mestre pode marcar condição em jogador remotamente** — chip clicável no card do jogador, update em `characters.sheet_json.activeConditions`.
- [ ] (A) **Tracker de iniciativa compartilhado** — DM adiciona combatentes (jogadores + NPCs), rola iniciativa, marca turno atual, todos veem.

## Prioridade A — Compêndio do Guia do Mestre 5e

- [x] (A) ~~Tabela de tesouro Individual~~ — feito em `dm-data.js` + aba NPCs
- [x] (A) ~~Calculadora de dificuldade de encontro por XP budget~~ — feito em `dm-data.js` + aba NPCs
- [ ] (A) **Importar monstros padrão (CR 0 a 5) do PDF do GdM** para `dm-data.js`. Precisa `brew install poppler` primeiro (`pdftotext` convert). PDF em `~/Downloads/dd-5e-guia-do-mestre-biblioteca-elfica.pdf`. Formato: `{ nome, cr, hp, ca, ataques, resistências, descrição }`.
- [ ] (A) **Tesouro de Dragão (Hoard)** — tabelas por CR do cap 7, equivalente ao Individual.
- [ ] (A) **Gerador de nomes de NPC** (humano, elfo, anão, orc) — tabelas rolagem.

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

(vazio)

---

## Como adicionar itens

- Edite este arquivo manualmente **ou** peça pro Claude: `claude -p "Adicione ao .claude/backlog.md: nova feature X na prioridade A, com dica sobre arquivo Y"`.
- Marque `[next]` no item que deve ser pego na próxima rotina (se nenhum tiver `[next]`, pega o primeiro `[ ]` da seção A).
