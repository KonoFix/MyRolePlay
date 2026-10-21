# Rotina Diária (launchd)

Agendamento automático via launchd (equivalente ao cron no macOS). Dispara `claude -p` 1x/dia usando sua assinatura logada no CLI — sem API key separada.

## Instalar

```bash
cp scripts/com.myroleplay.routine.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.myroleplay.routine.plist
```

## Testar agora (dispara imediatamente)

```bash
launchctl kickstart -k gui/$UID/com.myroleplay.routine
tail -f .claude/routine.log
```

## Rodar manualmente (sem launchd)

```bash
bash scripts/daily-routine.sh
```

## Logs

- `.claude/routine.log` — resumo das execuções
- `/tmp/myroleplay-routine-out.log` — output do `claude -p`
- `/tmp/myroleplay-routine-stdout.log` + `/tmp/myroleplay-routine-stderr.log` — do próprio launchd

## Desinstalar

```bash
launchctl unload ~/Library/LaunchAgents/com.myroleplay.routine.plist
rm ~/Library/LaunchAgents/com.myroleplay.routine.plist
```

## Como mudar o horário

Edite `StartCalendarInterval` no plist (Hour/Minute). Após alterar, `unload` e `load` novamente.

## Pré-requisitos

- `claude` CLI logado (sua assinatura)
- `git` configurado com user.email e user.name
- `gh` CLI logado (opcional — se não estiver, o PR não é aberto automaticamente mas o branch fica pronto pra push manual)

## O que a rotina faz

1. Checkout main + pull.
2. Cria branch `routine/YYYYMMDD`.
3. Invoca `claude -p` com o prompt em `.claude/routine-prompt.md`.
4. Claude lê `.claude/backlog.md`, escolhe 1 item, implementa.
5. Se houve commits: push + `gh pr create`.
6. Se não houve: branch fica em local sem push.

Nunca mergeia sozinho em `main` — revisão humana sempre.
