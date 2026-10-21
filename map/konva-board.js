// =============================================================================
// konva-board.js — motor de mapa interativo (Konva.js)
// =============================================================================
// Depende de: Konva via esm.sh carregado no HTML
//
// Exporta: createBoard({ container, map, tokens, isDM, callbacks })
//
// callbacks: {
//   onTokenMove(tokenId, x, y)
//   onFogChange(revealedCells)  // só chamado se isDM
// }
// =============================================================================

import Konva from 'https://esm.sh/konva@9.3.6';

export function createBoard({ container, map, tokens, isDM, callbacks = {} }) {
  const width = map.width_px || 1200;
  const height = map.height_px || 800;
  const cellSize = map.grid_px || 64;

  // ---------- Stage & camadas ----------
  const stage = new Konva.Stage({ container, width, height });
  const bgLayer     = new Konva.Layer({ listening: false });
  const gridLayer   = new Konva.Layer({ listening: false });
  const tokenLayer  = new Konva.Layer();
  const fogLayer    = new Konva.Layer({ listening: isDM });
  stage.add(bgLayer, gridLayer, tokenLayer, fogLayer);

  // ---------- Background ----------
  if (map.image_url) {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      bgLayer.add(new Konva.Image({ image: img, x: 0, y: 0, width, height }));
      bgLayer.batchDraw();
    };
    img.src = map.image_url;
  } else {
    bgLayer.add(new Konva.Rect({ x: 0, y: 0, width, height, fill: '#1a1a1a' }));
    bgLayer.draw();
  }

  // ---------- Grid ----------
  drawGrid();
  function drawGrid() {
    gridLayer.destroyChildren();
    const stroke = 'rgba(255,255,255,0.08)';
    for (let x = 0; x <= width; x += cellSize) {
      gridLayer.add(new Konva.Line({ points: [x, 0, x, height], stroke, strokeWidth: 1 }));
    }
    for (let y = 0; y <= height; y += cellSize) {
      gridLayer.add(new Konva.Line({ points: [0, y, width, y], stroke, strokeWidth: 1 }));
    }
    gridLayer.draw();
  }

  // ---------- Tokens ----------
  const tokenShapes = new Map();  // tokenId → Konva.Group

  function addToken(t) {
    const group = new Konva.Group({
      x: t.x,
      y: t.y,
      draggable: isDM || t.ownedByMe,
    });
    const r = (cellSize * (t.size_cells || 1)) / 2 - 4;
    const circle = new Konva.Circle({
      x: cellSize / 2,
      y: cellSize / 2,
      radius: r,
      fill: t.color || '#c89b3c',
      stroke: '#000',
      strokeWidth: 2,
    });
    const label = new Konva.Text({
      x: 0,
      y: cellSize + 2,
      text: t.label || '',
      fontSize: 12,
      fontStyle: 'bold',
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 2,
      fillAfterStrokeEnabled: true,
      align: 'center',
      width: cellSize,
    });
    group.add(circle, label);
    group.on('dragend', () => {
      const snapped = snapToGrid(group.x(), group.y());
      group.position(snapped);
      tokenLayer.batchDraw();
      callbacks.onTokenMove?.(t.id, snapped.x, snapped.y);
    });
    tokenLayer.add(group);
    tokenShapes.set(t.id, group);
  }

  tokens.forEach(addToken);
  tokenLayer.draw();

  function snapToGrid(x, y) {
    return {
      x: Math.round(x / cellSize) * cellSize,
      y: Math.round(y / cellSize) * cellSize,
    };
  }

  // ---------- Fog of War ----------
  // Representado como grid de células booleanas (revealed[y][x])
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const revealed = buildRevealedGrid(map.fog_mask_json?.revealed, rows, cols);

  function buildRevealedGrid(src, rows, cols) {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
    if (Array.isArray(src)) {
      for (const [y, x] of src) {
        if (grid[y] && grid[y][x] !== undefined) grid[y][x] = true;
      }
    }
    return grid;
  }

  function fogToList() {
    const out = [];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++)
        if (revealed[y][x]) out.push([y, x]);
    return out;
  }

  function drawFog() {
    fogLayer.destroyChildren();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!revealed[y][x]) {
          fogLayer.add(new Konva.Rect({
            x: x * cellSize,
            y: y * cellSize,
            width: cellSize,
            height: cellSize,
            fill: isDM ? 'rgba(10,10,10,0.72)' : 'rgba(10,10,10,0.98)',
          }));
        }
      }
    }
    fogLayer.draw();
  }
  drawFog();

  // Pincel do mestre: clique+arrasto revela/oculta
  if (isDM) {
    let painting = false;
    let paintMode = 'reveal';   // 'reveal' | 'hide' — alt revoga
    stage.on('mousedown touchstart', (e) => {
      if (e.target !== stage && !fogLayer.hasChildren()) return;
      painting = true;
      paintMode = e.evt?.shiftKey ? 'hide' : 'reveal';
      paintAt(stage.getPointerPosition());
    });
    stage.on('mousemove touchmove', () => {
      if (painting) paintAt(stage.getPointerPosition());
    });
    stage.on('mouseup touchend', () => {
      if (!painting) return;
      painting = false;
      callbacks.onFogChange?.(fogToList());
    });

    function paintAt(pos) {
      if (!pos) return;
      const col = Math.floor(pos.x / cellSize);
      const row = Math.floor(pos.y / cellSize);
      if (row < 0 || row >= rows || col < 0 || col >= cols) return;
      const next = (paintMode === 'reveal');
      if (revealed[row][col] !== next) {
        revealed[row][col] = next;
        drawFog();
      }
    }
  }

  // ---------- API pública ----------
  return {
    stage,
    updateToken(tokenId, { x, y, label }) {
      const g = tokenShapes.get(tokenId);
      if (!g) return;
      if (x !== undefined && y !== undefined) g.position({ x, y });
      if (label !== undefined) g.findOne('Text')?.text(label);
      tokenLayer.batchDraw();
    },
    addToken(t) { addToken(t); tokenLayer.draw(); },
    removeToken(tokenId) {
      const g = tokenShapes.get(tokenId);
      if (g) { g.destroy(); tokenShapes.delete(tokenId); tokenLayer.draw(); }
    },
    setRevealed(list) {
      // Reconstrói grid a partir da lista remota
      for (let y = 0; y < rows; y++) revealed[y].fill(false);
      for (const [y, x] of list || []) if (revealed[y]?.[x] !== undefined) revealed[y][x] = true;
      drawFog();
    },
    destroy() { stage.destroy(); },
  };
}
