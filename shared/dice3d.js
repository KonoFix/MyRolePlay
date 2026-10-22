// =============================================================================
// dice3d.js — palco 3D do rolador de dados (Three.js)
// Script clássico (não ES module). Progressive enhancement: se THREE não
// carregar (CDN bloqueada/offline) ou o navegador não suportar WebGL, o app
// continua funcionando normalmente com os ícones planos dos botões — ver
// window.DiceStage3D.available.
// =============================================================================
(function () {
  const STAGE_SIZE = 160;
  const GOLD = 0xc89b3c;
  const EDGE_COLOR = 0x2a1c08;

  let renderer, scene, camera, mesh, edges, keyLight;
  let available = false;
  let rolling = false;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function buildD10Geometry() {
    const radius = 1;
    const height = 1.3;
    const sides = 5;
    const ring = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      ring.push([radius * Math.cos(angle), 0, radius * Math.sin(angle)]);
    }
    const positions = [];
    for (let i = 0; i < sides; i++) {
      const a = ring[i], b = ring[(i + 1) % sides];
      positions.push(0, height, 0, ...a, ...b);
    }
    for (let i = 0; i < sides; i++) {
      const a = ring[i], b = ring[(i + 1) % sides];
      positions.push(0, -height, 0, ...b, ...a);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return geometry;
  }

  function geometryForSides(sides) {
    switch (sides) {
      case 4: return new THREE.TetrahedronGeometry(1.25);
      case 6: return new THREE.BoxGeometry(1.5, 1.5, 1.5);
      case 8: return new THREE.OctahedronGeometry(1.25);
      case 10: return buildD10Geometry();
      case 12: return new THREE.DodecahedronGeometry(1.15);
      case 20: return new THREE.IcosahedronGeometry(1.2);
      case 100: return buildD10Geometry();
      default: return new THREE.IcosahedronGeometry(1.2);
    }
  }

  function init(containerEl) {
    if (available || !containerEl) return available;
    if (typeof THREE === 'undefined') return false;
    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.6, 4.2);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(STAGE_SIZE, STAGE_SIZE);
      containerEl.insertBefore(renderer.domElement, containerEl.firstChild);

      scene.add(new THREE.AmbientLight(0xfff1d6, 0.55));
      keyLight = new THREE.DirectionalLight(0xfff6e0, 1.35);
      keyLight.position.set(-3, 4, 3.5);
      scene.add(keyLight);
      const fill = new THREE.DirectionalLight(0x8899cc, 0.35);
      fill.position.set(2, -1.5, -2);
      scene.add(fill);

      const material = new THREE.MeshStandardMaterial({
        color: GOLD,
        metalness: 0.35,
        roughness: 0.32,
        flatShading: true,
      });

      const geometry = new THREE.IcosahedronGeometry(1.2);
      mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.set(0.4, 0.6, 0);
      scene.add(mesh);

      edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: EDGE_COLOR, transparent: true, opacity: 0.55 })
      );
      mesh.add(edges);

      renderer.render(scene, camera);
      available = true;
      return true;
    } catch (err) {
      console.warn('[dice3d] WebGL indisponível, usando apenas ícones planos:', err);
      available = false;
      return false;
    }
  }

  function swapGeometry(sides) {
    const newGeom = geometryForSides(sides);
    mesh.geometry.dispose();
    mesh.geometry = newGeom;
    edges.geometry.dispose();
    edges.geometry = new THREE.EdgesGeometry(newGeom);
  }

  function roll(sides, onSettle) {
    if (!available || rolling) {
      onSettle && onSettle();
      return;
    }
    rolling = true;
    swapGeometry(sides);

    if (prefersReducedMotion()) {
      mesh.rotation.set(0.4, 0.6, 0);
      renderer.render(scene, camera);
      rolling = false;
      onSettle && onSettle();
      return;
    }

    const duration = 900;
    const startTime = performance.now();
    const startRot = { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z };
    const turns = {
      x: (5 + Math.random() * 3) * Math.PI,
      y: (6 + Math.random() * 4) * Math.PI,
      z: (2 + Math.random() * 2) * Math.PI * (Math.random() < 0.5 ? 1 : -1),
    };

    function frame(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      mesh.rotation.x = startRot.x + turns.x * eased;
      mesh.rotation.y = startRot.y + turns.y * eased;
      mesh.rotation.z = startRot.z + turns.z * eased;
      renderer.render(scene, camera);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        rolling = false;
        onSettle && onSettle();
      }
    }
    requestAnimationFrame(frame);
  }

  window.DiceStage3D = {
    init,
    roll,
    get available() { return available; },
  };
})();
