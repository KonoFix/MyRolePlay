#!/bin/bash
# =============================================================================
# daily-routine.sh — invoca Claude Code em modo não-interativo para melhorar
# o repo e abrir PR. Usa a assinatura logada no CLI (sem API key separada).
# =============================================================================
# Agendamento: ver scripts/com.myroleplay.routine.plist (launchd no macOS)
# =============================================================================
set -euo pipefail

REPO_DIR="${REPO_DIR:-/Users/konofix/MyRolePlay}"
LOG_FILE="$REPO_DIR/.claude/routine.log"
PROMPT_FILE="$REPO_DIR/.claude/routine-prompt.md"
TODAY=$(date -u +%Y%m%d)
BRANCH="routine/$TODAY"

log() {
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" | tee -a "$LOG_FILE"
}

cd "$REPO_DIR"

log "=== Rotina iniciada ($BRANCH) ==="

# 1. Garante que o Claude CLI está disponível
if ! command -v claude >/dev/null 2>&1; then
  log "ERRO: 'claude' CLI não encontrado no PATH. Rotina abortada."
  exit 1
fi

# 2. Sincroniza com main
if ! git fetch origin main 2>/dev/null; then
  log "WARN: fetch origin main falhou (talvez repo local sem remote); continuando com main local."
fi

if git show-ref --verify --quiet refs/remotes/origin/main; then
  git checkout main
  git pull --ff-only origin main || log "WARN: fast-forward falhou; continuando."
else
  git checkout main 2>/dev/null || true
fi

# 3. Branch do dia (idempotente)
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  log "Branch $BRANCH já existe; checkout."
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

# 4. Dispara Claude em modo não-interativo
log "Chamando claude -p ..."
if claude -p "$(cat "$PROMPT_FILE")" --dangerously-skip-permissions > /tmp/myroleplay-routine-out.log 2>&1; then
  log "claude concluído com sucesso. Veja /tmp/myroleplay-routine-out.log para o output."
else
  rc=$?
  log "ERRO: claude falhou com código $rc. Veja /tmp/myroleplay-routine-out.log."
  exit $rc
fi

# 5. Se o Claude não criou commits novos no branch, não há PR pra abrir.
if [ "$(git rev-list --count "main..$BRANCH")" = "0" ]; then
  log "Nenhum commit novo no $BRANCH; nada a enviar."
  log "=== Rotina finalizada (noop) ==="
  exit 0
fi

# 6. Push + PR
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  log "Fazendo push e abrindo PR..."
  git push -u origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
  gh pr create --title "routine: $(git log -1 --pretty=%s)" \
               --body "Alterações automáticas da rotina diária.\n\n$(git log main..$BRANCH --pretty='- %s')" \
               2>&1 | tee -a "$LOG_FILE" || log "WARN: gh pr create falhou."
else
  log "gh CLI indisponível ou não autenticado — PR não aberto. Branch $BRANCH pronto para push manual."
fi

log "=== Rotina finalizada ==="
