# Backlog da Rotina Diária

Formato: `- [status] (prioridade) título` — status: `[ ]` pendente · `[next]` próximo · `[wip]` em andamento · `[x]` feito · `[?]` precisa clarificação.
Prioridade: **A** = alta, **B** = média, **C** = baixa.

A rotina diária pega **1 item marcado `[next]`** ou, se não houver, o primeiro `[ ]` da seção A.

---

## Prioridade A — Fundamentos & segurança

- [next] (A) Criar bucket `maps` no Supabase Storage via SQL migration (RLS: upload por DM da campanha, read público). Ver `dm.js` fn `uploadMapImage`.
- [ ] (A) Preview Markdown no editor de narrativa (`dm.html` aba Narrativa) — reaproveitar marked.js via esm.sh e sanitizar com DOMPurify.
- [ ] (A) Rate limit no insert de `dice_rolls` (max 20 por minuto por usuário) via função plpgsql + trigger.
- [ ] (A) Realtime presence (quem está online na campanha) no painel do mestre.

## Prioridade A — Compêndio do Guia do Mestre 5e

- [ ] (A) Importar seção "Monstros padrão (CR 0 a 5)" do PDF em `~/Downloads/dd-5e-guia-do-mestre-biblioteca-elfica.pdf` para `data-dm.js` (equivalente a `data.js` do jogador). Instalar `brew install poppler` primeiro se `pdftotext` ainda não existir.
- [ ] (A) Tabela de tesouro Individual (Guia do Mestre cap 7) — gerador clicável que gera moedas + 1 item.
- [ ] (A) Calculadora de dificuldade de encontro por XP budget (CR vs. nível do grupo).

## Prioridade B — Qualidade de vida

- [ ] (B) Modo escuro/claro já existe no jogador — propagar para `dm.html` (`#btnToggleTheme`).
- [ ] (B) Shortcut Ctrl/Cmd+K abre busca global (campanhas / arcos / NPCs).
- [ ] (B) Importar/Exportar campanha completa em JSON (equivalente ao `btnExportJson` do jogador).
- [ ] (B) Avatar do mestre: upload no profile (equivalente ao hero portrait do jogador).

## Prioridade C — Refinamento futuro

- [ ] (C) Som/música ambiente (free tier do Jamendo API).
- [ ] (C) Timer de turno de iniciativa com beep ao esgotar.
- [ ] (C) Logs de alterações da ficha (quem mudou PV e quando).

## Precisa de clarificação

(vazio)

---

## Como adicionar itens

- Edite este arquivo manualmente **ou** peça pro Claude: `claude -p "Adicione ao .claude/backlog.md: nova feature X na prioridade A, com dica sobre arquivo Y"`.
- Marque `[next]` no item que deve ser pego na próxima rotina (se nenhum tiver `[next]`, pega o primeiro `[ ]` da seção A).
