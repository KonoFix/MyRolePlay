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
- [x] (A) ~~Mestre pode marcar condição em jogador remotamente~~ — feito: consolidado em `consolidate/condicoes-e-iniciativa` a partir das 3 implementações duplicadas (`routine/20261022-2236`, `routine/20261024-0915`, `routine/20261025-1513`), que foram descartadas.
- [x] (A) ~~Tracker de iniciativa compartilhado~~ — feito: consolidado em `consolidate/condicoes-e-iniciativa` a partir das 2 implementações duplicadas (`routine/20261023-0915`, `routine/20261024-1404`), que foram descartadas.

## Prioridade A — Compêndio do Guia do Mestre 5e

- [x] (A) ~~Tabela de tesouro Individual~~ — feito em `dm-data.js` + aba NPCs
- [x] (A) ~~Calculadora de dificuldade de encontro por XP budget~~ — feito em `dm-data.js` + aba NPCs
- [?] (A) ~~Importar monstros padrão (CR 0 a 5) do PDF do GdM~~ — **bloqueado, ver nota em "Precisa de clarificação"**: o PDF `dd-5e-guia-do-mestre-biblioteca-elfica.pdf` é o Guia do Mestre (DMG), que não contém blocos de estatística de criaturas por CR — ele remete explicitamente ao Manual dos Monstros ("veja o Manual dos Monstros para estatísticas de jogo") em todas as referências a criaturas. Não reimplementar até apontar o PDF correto (Manual dos Monstros/Bestiário).
- [x] (A) ~~Tesouro de Dragão (Hoard)~~ — feito: `DM_DATA.treasureHoard` em `dm-data.js` (moedas fixas por faixa de CR + d100 extra de objetos de arte/gemas/item mágico com tabela A–I), novo card "Tesouro de Covil" na aba NPCs (`dm.html`/`dm.js`).
- [x] (A) ~~Gerador de nomes de NPC~~ — feito: tabelas humano/elfo/anão/orc (masc/fem + sobrenome) em `dm-data.js`, card na aba NPCs (mesclado de `routine/20261026-0915`).

## Prioridade B — Qualidade de vida

- [x] (B) ~~Modo escuro/claro no `dm.html`~~ — feito (botão `#btnDmToggleTheme`)
- [x] (B) ~~Shortcut Ctrl/Cmd+K~~ — feito (palette com campaigns/arcs/players/maps)
- [x] (B) ~~Importar/Exportar campanha JSON~~ — feito (botões no header do DM)
- [x] (B) ~~Avatar do mestre~~ — feito (bucket avatars + círculo clicável no header)
- [x] (B) ~~Botão "Visualizar como jogador"~~ — feito: botão na aba Mapa (`dm.html`/`dm.js`) alterna `createBoard({ isDM: false })`, mostrando a névoa exatamente como o jogador vê (opaca, sem pincel) e desabilitando os controles exclusivos do mestre (novo mapa, upload de imagem, token NPC) enquanto o modo está ativo. Banner de aviso com botão "Voltar ao modo Mestre".
- [ ] (B) **Timeline de atividade no DM** — feed cronológico das mudanças (PV, condição, rolagem, movimento no mapa) usando realtime do canal.
- [ ] (B) **Botão "Enviar handout"** — DM anexa texto/imagem no modal, aparece pra jogadores selecionados.
- [x] (B) ~~CRUD completo de NPCs~~ — feito: card "NPCs da Campanha" na aba NPCs (dm.html/dm.js) com formulário (nome, PV, CA, ataques, notas, hostil), lista clicável reaproveitando `.dm-arcs-list`, e botão "Converter em token" que insere na tabela `tokens` (sem migration nova — `npcs`/`tokens` já existiam no schema; mesclado de `routine/20261027-0914`).

## Prioridade C — Refinamento futuro

- [ ] (C) Som/música ambiente (free tier do Jamendo API).
- [ ] (C) Timer de turno de iniciativa com beep ao esgotar.
- [ ] (C) Logs de alterações da ficha (quem mudou PV e quando) — tabela `audit_log` + render no DM.
- [ ] (C) Dark/light theme no `login.html`.
- [ ] (C) PWA — instalável como app no celular do jogador (manifest.json + service worker).
- [ ] (C) Exportar PDF da ficha (print layout já pronto; só adicionar botão).

## Precisa de clarificação

- **[2026-11-02] Mesclando os branches `routine/*` restantes um a um (sessão interativa).** "Condição remota" e "iniciativa" já tinham sido consolidadas e mescladas em `8b34612`. Dos 5 branches `routine/*` ainda soltos, 2 eram ruído (`routine/20261022-1259` chat e `routine/20261028-0914` modal — zero diff contra `main`, já cobertos por outro caminho, apagados sem merge) e 3 traziam feature real: "Gerador de nomes de NPC" (`routine/20261026-0915`, já mesclado) e "CRUD completo de NPCs" (`routine/20261027-0914`, sendo mesclado agora); "Visualizar como jogador" (`routine/20261029-0915`) é o próximo da fila. Conflito de merge esperado só em `.claude/backlog.md` (texto, não lógica) — arquivos de código mesclam limpo porque cada branch toca região isolada de `dm.js`.

- **[2026-10-29] "Importar monstros padrão (CR 0 a 5) do PDF do GdM" está bloqueado por premissa errada, não por falta de ferramenta.** Extraí o texto completo das 322 páginas de `~/Downloads/dd-5e-guia-do-mestre-biblioteca-elfica.pdf` (usei `pypdf` via pip, já que `poppler`/`brew` não estão disponíveis neste ambiente — isso não foi o bloqueio real) e não existe nenhum bloco de estatística de criatura com CR nesse arquivo: é o **Guia do Mestre** (armas de cerco, itens mágicos, doenças, regras de perseguição, etc.), e toda vez que o texto menciona uma criatura (cobra constritora gigante, enxame de insetos, elemental do fogo...) ele remete explicitamente ao **Manual dos Monstros** ("veja o Manual dos Monstros para estatísticas de jogo"). Não há busca por "Grau de Desafio" ou "Desafio:" que retorne resultado no texto extraído. **Ação recomendada:** se o usuário tiver o PDF do Manual dos Monstros (Bestiário) em algum lugar, apontar o caminho correto no item do backlog; alternativamente, popular `dm-data.js` a partir do SRD 5e (conteúdo aberto sob OGL, não precisa de PDF). Não reimplementar a partir do PDF do GdM — ele não tem os dados. Como não havia nenhum item `[ ]` restante disponível na seção de prioridade A (os outros já estão `[x]` ou `[?]` aguardando merge), implementei o primeiro item `[ ]` da prioridade B em vez disso: "Botão 'Visualizar como jogador'".

---

## Como adicionar itens

- Edite este arquivo manualmente **ou** peça pro Claude: `claude -p "Adicione ao .claude/backlog.md: nova feature X na prioridade A, com dica sobre arquivo Y"`.
- Marque `[next]` no item que deve ser pego na próxima rotina (se nenhum tiver `[next]`, pega o primeiro `[ ]` da seção A).
