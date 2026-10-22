// =============================================================================
// chat-widget.js — chat efêmero via Supabase Realtime Broadcast
// =============================================================================
// Não persiste histórico (sem tabela no banco) — mensagens existem apenas
// enquanto os clientes estiverem conectados ao canal da campanha.
// Usado por dm.js (mestre) e shared/app-boot.js (jogador).
//
// Uso:
//   const chat = mountChatWidget({ channel, displayName, isDM, campaignLabel });
//   // channel: um supabase.channel(`campaign:<id>`) ainda NÃO subscrito
//   //          (o .on('broadcast', ...) precisa ser registrado antes do
//   //          .subscribe() ser chamado pelo código que criou o canal)
//   chat.destroy(); // ao trocar de campanha ou deslogar
// =============================================================================

let widgetSeq = 0;
let stylesInjected = false;

const SEALED_LETTER_INNER = '<rect x="3" y="6" width="18" height="13" rx="1.2" fill="#f0e2bc" stroke="#8a6d3a" stroke-width="0.8"/><path d="M3.5 6.8 L12 13.5 L20.5 6.8" stroke="#8a6d3a" stroke-width="0.9" fill="none" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3" fill="#9c2b1f" stroke="#6e1d14" stroke-width="0.5"/>';

function scrollSealIcon(size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" class="icon" aria-hidden="true" focusable="false">${SEALED_LETTER_INNER}</svg>`;
}

export function mountChatWidget({ channel, displayName, isDM = false, campaignLabel = 'Mesa' }) {
  widgetSeq += 1;
  const id = `mrpChat${widgetSeq}`;
  injectStylesOnce();

  const wrap = document.createElement('div');
  wrap.className = 'mrp-chat-wrap';
  wrap.innerHTML = `
    <div class="mrp-chat-panel" id="${id}Panel">
      <div class="mrp-chat-header">
        <span>${scrollSealIcon(18)} Chat — ${escapeHtml(campaignLabel)}</span>
        <button type="button" class="mrp-chat-close" aria-label="Fechar">&times;</button>
      </div>
      <div class="mrp-chat-messages" id="${id}Messages"></div>
      <form class="mrp-chat-form" id="${id}Form" autocomplete="off">
        <input type="text" class="mrp-chat-input" id="${id}Input" placeholder="Digite uma mensagem..." maxlength="500">
        <button type="submit" class="mrp-chat-send" aria-label="Enviar">${window.svgIcon('send', {size:16})}</button>
      </form>
    </div>
    <button type="button" class="mrp-chat-fab" id="${id}Fab" title="Abrir chat da mesa">
      ${scrollSealIcon(28)}<span class="mrp-chat-badge" id="${id}Badge" hidden></span>
    </button>`;
  document.body.appendChild(wrap);

  const panel = wrap.querySelector(`#${id}Panel`);
  const fab = wrap.querySelector(`#${id}Fab`);
  const closeBtn = wrap.querySelector('.mrp-chat-close');
  const messagesEl = wrap.querySelector(`#${id}Messages`);
  const form = wrap.querySelector(`#${id}Form`);
  const input = wrap.querySelector(`#${id}Input`);
  const badge = wrap.querySelector(`#${id}Badge`);

  let open = false;

  function setOpen(next) {
    open = next;
    panel.classList.toggle('open', open);
    if (open) { badge.hidden = true; input.focus(); scrollToBottom(); }
  }
  fab.addEventListener('click', () => setOpen(!open));
  closeBtn.addEventListener('click', () => setOpen(false));

  function scrollToBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

  function appendMessage({ sender, text, ts, isDM: fromDM }) {
    const row = document.createElement('div');
    row.className = 'mrp-chat-msg' + (fromDM ? ' is-dm' : '');
    const time = new Date(ts || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const senderEl = document.createElement('span');
    senderEl.className = 'mrp-chat-sender';
    senderEl.innerHTML = (fromDM ? window.svgIcon('dice', {size:13, className:'mrp-chat-dm-icon'}) + ' ' : '') + escapeHtml(sender || '—');
    const timeEl = document.createElement('span');
    timeEl.className = 'mrp-chat-time';
    timeEl.textContent = time;
    const textEl = document.createElement('div');
    textEl.className = 'mrp-chat-text';
    textEl.textContent = text; // textContent evita qualquer injeção de HTML
    row.append(senderEl, timeEl, textEl);
    messagesEl.appendChild(row);
    while (messagesEl.children.length > 200) messagesEl.removeChild(messagesEl.firstChild);
    scrollToBottom();
    if (!open) badge.hidden = false;
  }

  // Precisa ser registrado ANTES do .subscribe() do canal (convenção Supabase
  // Realtime) — por isso mountChatWidget espera um canal ainda não subscrito.
  channel.on('broadcast', { event: 'chat' }, ({ payload }) => {
    if (payload) appendMessage(payload);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const payload = { sender: displayName, text, ts: Date.now(), isDM };
    channel.send({ type: 'broadcast', event: 'chat', payload });
    appendMessage(payload); // feedback otimista para quem enviou
    input.value = '';
  });

  return {
    destroy() { wrap.remove(); },
  };
}

function escapeHtml(s) {
  return (s ?? '').toString().replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function injectStylesOnce() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .mrp-chat-wrap { position: fixed; bottom: 24px; left: 24px; z-index: 950; }
    .mrp-chat-fab {
      width: 52px; height: 52px; border-radius: 50%; position: relative;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #c89b3c, #855e12);
      border: 2px solid var(--accent-gold-light);
      color: #12100a; font-size: 1.3rem; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.8), var(--shadow-gold);
      transition: var(--transition);
    }
    .mrp-chat-fab svg { filter: drop-shadow(0 1px 1px rgba(0,0,0,0.4)); }
    .mrp-chat-fab:hover { transform: scale(1.08); }
    .mrp-chat-badge {
      position: absolute; top: -2px; right: -2px;
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--accent-red); box-shadow: 0 0 0 2px var(--bg-primary);
    }
    .mrp-chat-panel {
      position: fixed; bottom: 86px; left: 24px;
      width: 320px; max-width: calc(100vw - 48px); max-height: 60vh;
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
      display: none; flex-direction: column; overflow: hidden;
      backdrop-filter: blur(16px);
    }
    .mrp-chat-panel.open { display: flex; animation: mrpChatSlideUp 0.2s ease; }
    @keyframes mrpChatSlideUp { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:translateY(0);} }
    .mrp-chat-header {
      padding: 10px 14px; background: var(--bg-secondary);
      display: flex; justify-content: space-between; align-items: center;
      font-family: var(--font-title); font-weight: 700; font-size: 0.85rem;
      color: var(--text-gold); border-bottom: 1px solid var(--border-color);
    }
    .mrp-chat-close { background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; line-height: 1; }
    .mrp-chat-close:hover { color: var(--text-primary); }
    .mrp-chat-messages { flex: 1; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; min-height: 120px; }
    .mrp-chat-msg { font-size: 0.82rem; }
    .mrp-chat-msg.is-dm .mrp-chat-sender { color: var(--accent-gold-light); }
    .mrp-chat-sender { font-weight: 700; color: var(--text-primary); margin-right: 6px; }
    .mrp-chat-time { color: var(--text-muted); font-size: 0.68rem; }
    .mrp-chat-text { color: var(--text-secondary); margin-top: 2px; word-break: break-word; }
    .mrp-chat-form { display: flex; gap: 6px; padding: 8px; border-top: 1px solid var(--border-color); }
    .mrp-chat-input {
      flex: 1; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);
      border-radius: var(--radius-sm); padding: 6px 10px; color: var(--text-primary); font-size: 0.82rem;
    }
    .mrp-chat-input:focus { outline: none; border-color: var(--border-accent); }
    .mrp-chat-send {
      background: var(--accent-gold); border: none; border-radius: var(--radius-sm);
      color: #12100a; padding: 6px 14px; cursor: pointer; font-weight: 700;
    }
    .mrp-chat-send:hover { filter: brightness(1.1); }
    @media (max-width: 500px) {
      .mrp-chat-wrap { bottom: 14px; left: 14px; }
      .mrp-chat-fab { width: 44px; height: 44px; }
      .mrp-chat-fab svg { width: 24px; height: 24px; }
      .mrp-chat-panel { left: 10px; bottom: 68px; width: calc(100vw - 20px); }
    }
  `;
  document.head.appendChild(style);
}
