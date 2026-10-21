# Rotina Diária — MyRolePlay

Você está sendo invocado em modo não-interativo (`claude -p`) numa execução automática diária. Você está no diretório `/Users/konofix/MyRolePlay` com um branch novo (`routine/YYYYMMDD`) já criado.

## Objetivo

Melhorar incrementalmente o software — segurança, UX, performance, funcionalidades do Guia do Mestre 5e — escolhendo **1 item** do backlog, implementando-o com qualidade e abrindo um Pull Request pra revisão humana.

## Protocolo

1. **Leia `.claude/backlog.md`** — fila priorizada de tarefas. Escolha o item marcado `[next]` ou o primeiro `[ ]` da seção "Prioridade Alta". Se nenhum item estiver pronto, escreva no `.claude/routine.log` "sem tarefas prontas hoje" e saia (código 0).

2. **Entenda o escopo** — leia os arquivos mencionados no item do backlog, examine o código adjacente, não assuma. Se o item for ambíguo demais, mova-o para a seção "Precisa de clarificação" no backlog, commit essa mudança no branch, e abra PR separado só com isso.

3. **Implemente** — preserve o estilo do código existente:
   - HTML/CSS/JS vanilla, sem framework
   - Variáveis CSS do tema em `styles.css` (nunca hardcode cores)
   - Reaproveite funções em `shared/`, `app.js`, `dm.js`
   - RLS: toda nova policy no banco PRECISA ser restritiva (nunca `using (true)` sem justificativa)
   - Nunca commite `config.js`, `.env`, service_role keys

4. **Teste** — se houver suíte de testes (verifique `package.json`), rode. Se não houver, descreva o teste manual em "Test plan" do PR.

5. **Commit & PR** — mensagem no padrão convencional (`feat/fix/chore/docs(scope): …`). Co-autoria com Claude. Rode:
   ```
   gh pr create --title "..." --body-file .claude/pr-body.md
   ```
   O PR fica aguardando merge manual do humano.

6. **Limites de segurança**:
   - **NUNCA** rode `git push --force`, `git reset --hard origin/main`, `rm -rf` em paths do repo, nem edite `.github/workflows/*` sem o item do backlog pedir explicitamente.
   - **NUNCA** mescle sozinho no `main` — abra PR e saia.
   - **NUNCA** instale pacotes npm globais; use `npx -y` ou devDeps.
   - **Pare** se o item exigir migração destrutiva de dados em produção (DROP TABLE/COLUMN) — mova para "Precisa de clarificação".

7. **Log** — escreva um resumo de 3 linhas em `.claude/routine.log` (append, timestamp ISO + item escolhido + status).

## Dicas sobre o repo

- Página do Jogador: `index.html` + `app.js` + `data.js` (regras 5e)
- Página do Mestre: `dm.html` + `dm.js` + `dm.css`
- Login: `login.html`
- Compartilhado: `shared/{supabase-client,auth,character-store,app-boot}.js`
- Mapa: `map/konva-board.js`
- Banco: `supabase/migrations/*.sql` (sempre criar nova migration com timestamp, nunca editar as antigas)

Boa execução.
