---
name: pr-merge
description: Cria um Pull Request a partir do branch atual e já faz o merge no GitHub, sem depender do gh CLI (usa a API REST via curl quando ele não estiver instalado). Use quando o usuário pedir para "abrir e já mesclar o PR", "subir e mergear", ou similar.
---

# PR + Merge automático

Objetivo: levar o branch atual até dentro da branch base (normalmente `main`) com o
mínimo de fricção — commitar o que faltar, empurrar, abrir o PR e mesclar — tudo numa
única passada, sem deixar PRs abertos e esquecidos nem pedir ajuda ao usuário a cada
etapa quando não for necessário.

Isso resolve um problema real já visto neste projeto: um PR foi mesclado e fechado,
depois um novo commit foi empurrado para o mesmo branch — como o PR fechado não reabre
sozinho, o commit ficou "preso" sem ninguém perceber até o usuário notar que a mudança
não tinha chegado em `main`. Este fluxo sempre verifica se já existe PR aberto antes de
criar um novo, e sempre confirma no final que o commit realmente chegou na base.

## 0. Descobrir o contexto

```bash
cd <diretório de trabalho do projeto>
git remote get-url origin
```

Extraia `owner/repo` da URL (aceita tanto `git@github.com:owner/repo.git` quanto
`https://github.com/owner/repo.git`). Descubra o branch atual com
`git branch --show-current` e a branch base com `git ls-remote --symbolic-ref origin HEAD`
(ou assuma `main` se o repositório não tiver outra convenção clara — confira com
`git ls-remote --heads origin main`).

Nunca rode isto na própria branch base (se `git branch --show-current` já for a base,
pare e avise o usuário — não há o que abrir PR contra si mesmo).

## 1. Garantir que não há trabalho solto

```bash
git status
```

Se houver mudanças não commitadas, rode `git diff`/`git status` para entender o que
mudou, monte uma mensagem de commit que descreva o quê e o porquê (não apenas "mudanças"),
e commite (`git add <arquivos específicos>` — nunca `-A`/`.` sem revisar — depois
`git commit`). Nunca pule esta etapa silenciosamente: se não for óbvio o que está em
aberto, pergunte ao usuário antes de commitar.

## 2. Empurrar o branch

```bash
git push -u origin <branch-atual>
```

## 3. Checar se já existe PR aberto para este branch

**Prefira `gh` se disponível** (`command -v gh`):

```bash
gh pr list --head <branch-atual> --state open --json number,url
```

**Sem `gh`**, use a API REST (não precisa de token para leitura em repositório público):

```bash
curl -s "https://api.github.com/repos/<owner>/<repo>/pulls?head=<owner>:<branch-atual>&state=open"
```

- Se já existir um PR aberto → pule para o passo 5 (merge) usando o número encontrado.
- Se não existir → siga para o passo 4.

Repare que um PR **fechado** (inclusive já mesclado) não conta — é preciso abrir um novo
para quaisquer commits que tenham sido empurrados depois do fechamento. Confirme isso
comparando `git log origin/<base>..origin/<branch-atual> --oneline`: se vier vazio, não
há nada novo para mesclar e o trabalho já está em dia.

## 4. Criar o PR

**Com `gh`:**

```bash
gh pr create --base <base> --title "<título>" --body "<corpo>"
```

Nunca passe `--draft` neste fluxo — o objetivo é mesclar na sequência.

**Sem `gh`** — precisa de um token (classic PAT, escopo `repo`) com permissão de escrita.
Antes de pedir, verifique se já existe uma credencial utilizável:

- `git credential fill` às vezes é bloqueado pelo sandbox de permissões — não insista
  tentando contornar, apenas perceba que falhou e siga para pedir ao usuário.
- Se não houver nada reaproveitável, use `AskUserQuestion` oferecendo duas opções: o
  usuário cola um link de comparação (`https://github.com/<owner>/<repo>/compare/<base>...<branch>`)
  e cria/mescla manualmente, **ou** cola um token classic (escopo `repo`) para você
  terminar o fluxo inteiro (criar PR e já mesclar) via API.

Com o token em mãos, monte o corpo da requisição num arquivo JSON temporário (evita
problemas de escaping de aspas/acentos em linha de comando) e crie o PR:

```bash
curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/<owner>/<repo>/pulls" \
  -d @pr_body.json
```

`pr_body.json` deve conter `title`, `head` (o branch atual), `base`, `draft: false` e um
`body` em markdown cobrindo o quê, o porquê, e qualquer coisa que o revisor precise
saber. Guarde o `number` retornado.

## 5. Mesclar o PR

**Com `gh`:**

```bash
gh pr merge <número> --merge --delete-branch=false
```

**Sem `gh`** (reaproveite o token do passo 4, ou peça um se chegou direto aqui por já
existir PR aberto):

```bash
curl -s -X PUT \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/<owner>/<repo>/pulls/<número>/merge" \
  -d '{"merge_method":"merge"}'
```

Use `merge_method: "merge"` (merge commit) por padrão, a menos que o histórico do
repositório mostre claramente uma convenção diferente (confira `git log --oneline` por
merges anteriores — commits "Merge pull request #N" indicam merge commit; mensagens
`squash` no padrão `<branch> (#N)` indicam squash).

Se a resposta indicar conflito (`mergeable: false` ou HTTP 405/409), **não** tente
forçar nada — pare e explique ao usuário que o PR precisa ser resolvido manualmente
(rebase ou merge da base dentro do branch, resolvendo os conflitos).

## 6. Confirmar e reportar

```bash
git fetch origin <base> --quiet
git log origin/<base> --oneline -3
```

Confirme que o commit mais recente do branch aparece agora em `<base>` (direto ou
dentro de um commit de merge). Reporte ao usuário a URL do PR mesclado, envolvida em
`<pr-created>...</pr-created>` numa linha própria, do mesmo jeito que o fluxo normal de
criação de PR já faz.

## Segurança

- Nunca grave o token em nenhum arquivo do repositório, `.git/config` (além do uso
  pontual documentado de embutir e depois limpar a URL do remoto, se for essa a via de
  autenticação), log ou memória persistente.
- Se o usuário colar um token no chat, ao final do fluxo lembre-o de revogar em
  `github.com/settings/tokens` caso não vá precisar mais (ex.: se o repositório já tem
  deploy automático via integração própria, como Vercel+GitHub, o token só serviu para
  este push pontual).
- Apague arquivos temporários (`pr_body.json`, respostas de API salvas em `/tmp`) depois
  de usá-los.
