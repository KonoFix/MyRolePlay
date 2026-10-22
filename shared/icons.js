// =============================================================================
// icons.js — ícones SVG (estilo line-art, tema medieval) para substituir emojis.
// Script clássico (não ES module) para funcionar tanto em <script src> comuns
// (app.js, login.html) quanto em módulos (dm.js, chat-widget.js via window.svgIcon).
// =============================================================================
(function () {
  // viewBox 24x24, stroke="currentColor" — cada entrada é o miolo do <svg>.
  const ICONS = {
    // --- Identidade / papéis ---
    'wizard-hat': '<path d="M12 2 4 20h16L12 2Z"/><path d="M9 14h6"/><circle cx="12" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/>',
    mask: '<path d="M4 9c2-2 4-3 8-3s6 1 8 3c0 6-3 10-8 10S4 15 4 9Z"/><path d="M8 10.5c.5-1 1.2-1 1.7 0M14.3 10.5c.5-1 1.2-1 1.7 0"/><path d="M9 14c1.5 1 4.5 1 6 0"/>',
    crown: '<path d="M3 17h18M4 17 3 8l4.5 3L12 6l4.5 5L21 8l-1 9"/>',

    // --- Ações comuns ---
    'plus-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    link: '<path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 12.5 5a3.5 3.5 0 0 1 5 5l-1.5 1.5"/><path d="M13 17.5 11.5 19a3.5 3.5 0 0 1-5-5l1.5-1.5"/>',
    save: '<path d="M5 4h11l3 3v13H5V4Z"/><path d="M8 4v5h7V4"/><path d="M8 14h8v6H8v-6Z"/>',
    'folder-open': '<path d="M3 8h5l2 2h6l2 3-1.5 7H5L3 8Z"/><path d="M3 8V6a1 1 0 0 1 1-1h4l2 2"/>',
    scroll: '<path d="M7 4h11v15a2 2 0 1 1-4 0V9H7"/><path d="M7 4a2 2 0 1 0 0 4h1"/><path d="M7 15a2 2 0 1 0 0 4h5"/>',
    pencil: '<path d="M4 17.25 3 21l3.75-1L18.5 8.25a1.5 1.5 0 0 0 0-2.12l-1.63-1.63a1.5 1.5 0 0 0-2.12 0L4 15.25v2Z"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>',
    eye: '<path d="M2 12c2.5-5 7-7 10-7s7.5 2 10 7c-2.5 5-7 7-10 7s-7.5-2-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="M5 13l4.5 4.5L19 7"/>',
    'alert-triangle': '<path d="M12 4 21 20H3L12 4Z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"/>',

    // --- Dados / combate ---
    dice: '<path d="M12 2 20 7v10l-8 5-8-5V7l8-5Z"/><path d="M12 2v10M20 7l-8 5M4 7l8 5"/><circle cx="12" cy="9" r="1" fill="currentColor" stroke="none"/>',
    'die-d4': '<path d="M12 3 21 20 3 20 Z"/><path d="M12 3 12 13 M21 20 12 13 M3 20 12 13"/>',
    'die-d6': '<path d="M12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 Z"/><path d="M12 3 12 12 20 16.5 M12 12 4 16.5"/>',
    'die-d8': '<path d="M12 2 21 12 12 22 3 12 Z"/><path d="M3 12 21 12 M12 2 12 22"/>',
    'die-d10': '<path d="M12 1 18 9 12 23 6 9 Z"/><path d="M12 1 12 23"/>',
    'die-d12': '<path d="M12 1.5 22 8.75 18.2 20.5 5.8 20.5 2 8.75 Z"/><path d="M12 1.5 12 12 M22 8.75 12 12 M18.2 20.5 12 12 M5.8 20.5 12 12 M2 8.75 12 12"/>',
    flame: '<path d="M12 3c2 3-3 4-2 8 .4 1.6 2 2 2 2s1.6-.4 2-2c1-4-4-5-2-8Z"/><path d="M8 13c-1 2-1 4 0 5.5A4.5 4.5 0 0 0 12 21a4.5 4.5 0 0 0 4-2.5c1-1.5 1-3.5 0-5.5-1 2-2 3-4 3s-3-1-4-3Z"/>',
    swords: '<path d="M3 3l8 8M3 3l1.5 5L3 10M3 3l5 1.5L7 3"/><path d="M21 3l-8 8M21 3l-1.5 5L21 10M21 3l-5 1.5L17 3"/><path d="M6 14l-3 3 3 3M18 14l3 3-3 3M9 15l3-3 3 3-3 3-3-3Z"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    scale: '<path d="M12 3v15M7 6h10M5 6l-3 7a3 3 0 0 0 6 0L5 6ZM19 6l-3 7a3 3 0 0 0 6 0L19 6Z"/><path d="M8 21h8"/>',

    // --- Status / atributos ---
    heart: '<path d="M12 20s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.6-9.3 9-9.3 9Z"/>',
    sparkles: '<path d="M12 3v4M12 17v4M4 12H2M22 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="3"/>',
    star: '<path d="M12 3 14.5 9.5 21 10 16 14.3 17.5 21 12 17.3 6.5 21 8 14.3 3 10 9.5 9.5 12 3Z"/>',
    circle: '<circle cx="12" cy="12" r="8"/>',
    medal: '<circle cx="12" cy="15" r="6"/><path d="M9 4h6l2 7-5 4-5-4 2-7Z"/>',
    boots: '<path d="M8 3v8l-4 4v4h7v-4h6v4h-1"/><path d="M11 11h6l2 4"/>',

    // --- Navegação / mundo ---
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20c0-2.6 1.6-4.6 4-5.3"/>',
    map: '<path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    dragon: '<path d="M3 15c2-3 4-4 6-4 1 0 2 .4 2 1.5S9.5 14 8 14M11 11c3-5 7-6 10-3-1 0-2 .5-2 2 0 1 1 1.5 2 1.5-1.5 2-4 2-5 .5-1 2-3 3-5 2.5"/><path d="M8 14c-1.5 2-1.5 4 0 6M13 10.5c1 1 1 3-.5 4"/><circle cx="16.5" cy="8.5" r="0.8" fill="currentColor" stroke="none"/>',
    backpack: '<path d="M8 8V6a4 4 0 1 1 8 0v2"/><path d="M6 8h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"/><path d="M9 13h6M9 17h6"/>',
    'book-open': '<path d="M12 6c-2-1.5-5-2-9-1v13c4-1 7-.5 9 1 2-1.5 5-2 9-1V5c-4-1-7-.5-9 1Z"/><path d="M12 6v13"/>',

    // --- Tema / utilidades ---
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z"/>',
    coffee: '<path d="M5 9h12v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z"/><path d="M17 10h1.5a2 2 0 1 1 0 4H17"/><path d="M8 5.5c0-.8.5-1 .5-1.8M12 5.5c0-.8.5-1 .5-1.8"/>',
    tent: '<path d="M12 4 3 20h18L12 4Z"/><path d="M12 4v16M8 20l4-9M16 20l-4-9"/>',
    printer: '<path d="M7 8V4h10v4"/><rect x="5" y="8" width="14" height="7" rx="1"/><path d="M7 15h10v5H7v-5Z"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.5-2.5h5L16 7"/><circle cx="12" cy="13.5" r="3.5"/>',
    'message-circle': '<path d="M21 12a9 9 0 1 1-4-7.5"/><path d="M21 3v6h-6"/>',
    'message-square': '<path d="M4 4h16v12H9l-5 4V4Z"/>',
    send: '<path d="M4 11 20 4l-5 16-4-7-7-2Z"/>',

    // --- Marca ---
    'd20-seal': '<circle cx="12" cy="12" r="11.4" stroke-width="0.55"/><circle cx="12" cy="12" r="9.84" stroke-width="0.3" opacity="0.4"/><path d="M12,1.44 L12,0.6 M16.04,2.24 L16.36,1.47 M19.47,4.53 L20.06,3.94 M21.76,7.96 L22.53,7.64 M22.56,12 L23.4,12 M21.76,16.04 L22.53,16.36 M19.47,19.47 L20.06,20.06 M16.04,21.76 L16.36,22.53 M12,22.56 L12,23.4 M7.96,21.76 L7.64,22.53 M4.53,19.47 L3.94,20.06 M2.24,16.04 L1.47,16.36 M1.44,12 L0.6,12 M2.24,7.96 L1.47,7.64 M4.53,4.53 L3.94,3.94 M7.96,2.24 L7.64,1.47" stroke-width="0.4"/><path d="M12,5.45 L17.95,8.73 L17.95,15.27 L12,18.55 L6.05,15.27 L6.05,8.73 Z" stroke-width="0.85" stroke-linejoin="round"/><path d="M12,5.45 L12,12 M17.95,8.73 L12,12 M17.95,15.27 L12,12 M12,18.55 L12,12 M6.05,15.27 L12,12 M6.05,8.73 L12,12" stroke-width="0.65" stroke-linecap="round"/>',
  };

  function svgIcon(name, opts) {
    opts = opts || {};
    const size = opts.size || 18;
    const className = opts.className || '';
    const inner = ICONS[name];
    if (!inner) return '';
    return (
      '<svg class="icon icon-' + name + (className ? ' ' + className : '') + '"' +
      ' width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true" focusable="false">' + inner + '</svg>'
    );
  }

  if (typeof window !== 'undefined') {
    window.MRP_ICONS = ICONS;
    window.svgIcon = svgIcon;
  }
})();
