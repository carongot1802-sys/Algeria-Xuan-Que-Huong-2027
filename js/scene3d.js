import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONFIG } from './config.js';

/*
  Mô hình sân tổ chức, đơn vị là mét.
  Trục x sang phải, y lên trên, z về phía người xem. Tường phông nền nằm ở z = -10, cổng chào ở z = +10.6.
  Mỗi khu có: area (x, z, rộng, sâu) để tô sáng mặt sàn, hot (x, y, z) để đặt số, cam (vị trí máy, điểm nhìn).
*/
const GEO = {
  gate:      { area: [0, 10.6, 5, 2.4],   hot: [0, 4.1, 10.6],   cam: { p: [6.5, 3.4, 15.5],  t: [0, 1.5, 10.2] } },
  coffee:    { area: [-9.4, 1.5, 2.2, 3], hot: [-9.2, 3.2, 1.5], cam: { p: [-3.4, 2.6, 4.2],  t: [-9.2, 1.2, 1.5] } },
  tea:       { area: [-9.4, 4.5, 2.2, 3], hot: [-9.2, 3.2, 4.5], cam: { p: [-3.4, 2.6, 7.4],  t: [-9.2, 1.2, 4.5] } },
  banhchung: { area: [8.6, 4.6, 5, 4],    hot: [8.6, 2.6, 4.6],  cam: { p: [3.0, 3.2, 9.2],   t: [8.6, 0.9, 4.6] } },
  cocktail:  { area: [0.2, 0.6, 8.4, 4.4],hot: [0.2, 1.9, 0.6],  cam: { p: [-4.8, 4.6, 7.8],  t: [0.2, 0.8, 0.6] } },
  buffet:    { area: [8.9, -4.3, 5.4, 6.6],hot: [8.9, 3.7, -4.3],cam: { p: [3.2, 3.8, 0.8],   t: [8.9, 1.0, -4.3] } },
  seating:   { area: [-7.15, -3.9, 5.8, 5.4], hot: [-7.15, 2.2, -3.9], cam: { p: [-1.6, 4.4, 2.4], t: [-7.1, 0.8, -3.9] } },
  standing:  { area: [0, -3.9, 7.4, 4.6], hot: [0, 2.5, -3.9],   cam: { p: [0, 3.4, 4.8],     t: [0, 1.2, -4.5] } },
  stage:     { area: [0, -8.4, 7.8, 3],   hot: [-2.6, 1.2, -8.3],cam: { p: [-7.6, 3.2, -0.6], t: [0, 1.0, -8.4] } },
  backdrop:  { area: [0, -9.5, 6.6, 0.8], hot: [0, 4.3, -9.7],   cam: { p: [0, 2.5, -1.6],    t: [0, 2.4, -9.9] } },
  podium:    { area: [3, -8, 1.3, 1.3],   hot: [3, 2.0, -8],     cam: { p: [6.8, 2.4, -3.7],  t: [3, 1.2, -8] } }
};

const VIEWS = {
  overview: { p: [15, 12.5, 17],   t: [0, 0.4, -1.5] },
  gate:     { p: [0, 1.7, 9.2],    t: [0, 1.9, -9] },
  audience: { p: [0, 1.7, 4.5],    t: [0, 2.0, -9.5] },
  stage:    { p: [-1, 2.0, -8.6],  t: [0.5, 1.2, 6] },
  top:      { p: [0.01, 30, 5],    t: [0, 0, -1] }
};

const COL = {
  red: 0xa8141f, redDeep: 0x7a0f18, gold: 0xe3b04b, cream: 0xf2e8d5, white: 0xf3f1ec,
  kraft: 0xc9a46b, wood: 0x6b4528, leaf: 0x2f6b3f, pink: 0xf2a5b8, mai: 0xf0c332,
  steel: 0xc9ced6, dark: 0x2b2b30
};

const TIMES = {
  dusk: { bg: 0x2a3352, hemiSky: 0xaab8ff, hemiGround: 0x40302a, hemi: 1.05, sun: 0xffd2a0, sunI: 1.0, lantern: 1.7, fairy: 2.6, beam: 0.12, win: 1.3 },
  day:  { bg: 0xbcd8ee, hemiSky: 0xffffff, hemiGround: 0xb9a58c, hemi: 1.15, sun: 0xfff4e0, sunI: 2.3, lantern: 0.15, fairy: 0.1, beam: 0.0, win: 0.0 }
};

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createScene(container, opts) {
  const { zones, hotspotLayer, onSelect } = opts;
  const lowPower = /Mobi|Android/i.test(navigator.userAgent) || matchMedia('(max-width: 760px)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = mulberry32(2027);

  /* ---------- Renderer, camera, controls ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(TIMES.dusk.bg);
  scene.fog = new THREE.Fog(TIMES.dusk.bg, 48, 120);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 300);
  camera.position.set(...VIEWS.overview.p);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...VIEWS.overview.t);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2;
  controls.maxDistance = 44;
  controls.maxPolarAngle = Math.PI / 2 - 0.03;
  controls.update();

  const root = new THREE.Group();
  scene.add(root);

  /* ---------- Ánh sáng ---------- */
  const hemi = new THREE.HemisphereLight(TIMES.dusk.hemiSky, TIMES.dusk.hemiGround, TIMES.dusk.hemi);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(TIMES.dusk.sun, TIMES.dusk.sunI);
  sun.position.set(10, 20, 13);
  sun.castShadow = true;
  sun.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = -19; sc.right = 19; sc.top = 19; sc.bottom = -19; sc.near = 1; sc.far = 70;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);

  /* ---------- Hàm dựng cơ bản ---------- */
  const matCache = {};
  const M = (color, o = {}) => {
    const k = color + JSON.stringify(o);
    return (matCache[k] ||= new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...o }));
  };
  const geoCache = {};
  const G = (type, ...a) => (geoCache[type + a.join(',')] ||= new THREE[type](...a));

  function mesh(geo, mat, x = 0, y = 0, z = 0, parent = root, shadow = true) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = shadow; m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  const box = (w, h, d, mat, x, y, z, p) => mesh(G('BoxGeometry', w, h, d), mat, x, y, z, p);
  const cyl = (rt, rb, h, mat, x, y, z, p, seg = 16) => mesh(G('CylinderGeometry', rt, rb, h, seg), mat, x, y, z, p);
  const sph = (r, mat, x, y, z, p, ws = 12, hs = 8) => mesh(G('SphereGeometry', r, ws, hs), mat, x, y, z, p);

  function canvasTex(w, h, draw, repeat) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
    return t;
  }

  const FONT = '"Cormorant Garamond", Georgia, serif';

  function signPlane(text, w, h, bg, fg, x, y, z, parent = root, rotY = 0, double = true) {
    const t = canvasTex(512, Math.round(512 * h / w), (g, cw, ch) => {
      g.fillStyle = bg; g.fillRect(0, 0, cw, ch);
      g.strokeStyle = fg; g.globalAlpha = 0.7; g.lineWidth = 6; g.strokeRect(10, 10, cw - 20, ch - 20); g.globalAlpha = 1;
      g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
      let size = ch * 0.5;
      g.font = `bold ${size}px ${FONT}`;
      while (g.measureText(text).width > cw * 0.86 && size > 12) { size -= 2; g.font = `bold ${size}px ${FONT}`; }
      g.fillText(text, cw / 2, ch / 2 + size * 0.04);
    });
    const mat = new THREE.MeshBasicMaterial({ map: t, side: double ? THREE.DoubleSide : THREE.FrontSide, toneMapped: false });
    const m = new THREE.Mesh(G('PlaneGeometry', w, h), mat);
    m.position.set(x, y, z); m.rotation.y = rotY;
    parent.add(m);
    return m;
  }

  /* ---------- Vật liệu phát sáng, đổi theo thời điểm ---------- */
  const lanternMat = new THREE.MeshStandardMaterial({ color: COL.red, emissive: 0xff2a14, emissiveIntensity: 1.7, roughness: 0.5 });
  const fairyMat = new THREE.MeshStandardMaterial({ color: 0xfff1c8, emissive: 0xffd98a, emissiveIntensity: 2.6 });
  const beamMats = [];

  /* ---------- Nền đất, tường, nhà xung quanh ---------- */
  const groundTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#cfc8bc'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#b3aa9c'; g.lineWidth = 3;
    g.strokeRect(0, 0, w, h);
    g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  }, [13, 13]);
  const ground = mesh(G('PlaneGeometry', 26, 26), new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.95 }), 0, 0, 0, root, false);
  ground.rotation.x = -Math.PI / 2;
  const street = mesh(G('PlaneGeometry', 220, 220), M(0x4a4d55, { roughness: 1 }), 0, -0.03, 0, root, false);
  street.rotation.x = -Math.PI / 2;

  const wallMat = M(COL.white, { roughness: 0.95 });
  box(26, 4.8, 0.3, wallMat, 0, 2.4, -10.15);            // tường sau (nền phông)
  box(0.3, 4.2, 22.6, wallMat, -12.15, 2.1, 0.9);        // tường trái
  box(0.3, 2.8, 22.6, wallMat, 12.15, 1.4, 0.9);         // tường phải thấp
  box(10, 1.2, 0.3, wallMat, -8, 0.6, 12.15);            // tường trước, chừa lối cổng
  box(10, 1.2, 0.3, wallMat, 8, 0.6, 12.15);

  const bRnd = mulberry32(88);
  const winCanvas = (lit) => canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = lit ? '#000' : '#cdbfa8'; g.fillRect(0, 0, w, h);
    for (let y = 12; y < h; y += 32) for (let x = 12; x < w; x += 32) {
      if (lit) { g.fillStyle = bRnd() > 0.55 ? '#ffd27a' : '#000'; }
      else g.fillStyle = '#6d7480';
      g.fillRect(x, y, 14, 18);
    }
  }, [3, 4]);
  const bldMat = new THREE.MeshStandardMaterial({ map: winCanvas(false), emissiveMap: winCanvas(true), emissive: 0xffffff, emissiveIntensity: 1.3, roughness: 1 });
  [[-19, -14, 8, 14, 9], [-21, 3, 7, 10, 12], [-18, 18, 8, 15, 8], [20, -13, 9, 12, 9], [21, 6, 7, 16, 9],
   [3, -20, 16, 11, 8], [-12, -21, 10, 15, 8], [14, -22, 12, 13, 8]].forEach(([x, z, w, h, d]) => box(w, h, d, bldMat, x, h / 2, z));

  /* ---------- Cây, hoa đào, hoa mai ---------- */
  function realTree(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z); root.add(g);
    cyl(0.22, 0.34, 3.4, M(COL.wood), 0, 1.7, 0, g, 8);
    [[0, 4.2, 0, 1.5], [-1.1, 3.8, 0.4, 1.1], [1.0, 3.9, -0.3, 1.2], [0.2, 5.0, 0.3, 1.0], [-0.4, 3.6, -1.0, 1.0]].forEach(([a, b, c, r], i) =>
      mesh(G('IcosahedronGeometry', r, 1), M(i % 2 ? 0x3f7a45 : 0x2f6b3f), a, b, c, g));
  }

  function blossomTree(x, z, color, parent = root, s = 1) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
    cyl(0.4, 0.3, 0.5, M(COL.redDeep), 0, 0.25, 0, g, 14);
    cyl(0.06, 0.1, 1.7, M(COL.wood), 0, 1.3, 0, g, 6);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const b = cyl(0.03, 0.05, 1.1, M(COL.wood), Math.cos(a) * 0.25, 2.0, Math.sin(a) * 0.25, g, 5);
      b.rotation.z = Math.cos(a) * 0.6; b.rotation.x = -Math.sin(a) * 0.6;
    }
    for (let i = 0; i < 18; i++) {
      const a = rnd() * Math.PI * 2, r = 0.2 + rnd() * 0.75, y = 2.0 + rnd() * 1.0;
      const c = new THREE.Color(color).offsetHSL(0, 0, (rnd() - 0.5) * 0.1);
      mesh(G('IcosahedronGeometry', 0.17 + rnd() * 0.08, 0), M(c.getHex()), Math.cos(a) * r, y, Math.sin(a) * r, g);
    }
  }

  realTree(-9.6, -8.8);

  /* ---------- Lồng đèn, dây đèn ---------- */
  function lantern(x, y, z, parent = root, s = 1) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
    const body = new THREE.Mesh(G('SphereGeometry', 0.22, 14, 10), lanternMat);
    body.scale.set(1, 0.88, 1); body.castShadow = true; g.add(body);
    cyl(0.07, 0.07, 0.05, M(COL.gold), 0, 0.2, 0, g, 8);
    cyl(0.07, 0.07, 0.05, M(COL.gold), 0, -0.2, 0, g, 8);
    cyl(0.012, 0.012, 0.22, M(COL.gold), 0, -0.34, 0, g, 4);
    return g;
  }

  function lanternString(x1, x2, z, y, sag, count) {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pts.push(new THREE.Vector3(x1 + (x2 - x1) * t, y - Math.sin(t * Math.PI) * sag, z));
    }
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x20120f })));
    for (let i = 1; i < count; i++) {
      const t = i / count;
      lantern(x1 + (x2 - x1) * t, y - Math.sin(t * Math.PI) * sag - 0.28, z);
    }
  }
  lanternString(-11.8, 11.8, 5.2, 4.7, 0.5, 11);
  lanternString(-11.8, 11.8, -0.8, 4.9, 0.5, 11);

  for (let x = -11.5; x <= 11.5; x += 0.55) sph(0.05, fairyMat, x, 4.15 + Math.sin(x * 1.3) * 0.07, -9.95, root, 6, 4);
  for (let z = -9.5; z <= 11; z += 0.55) sph(0.05, fairyMat, -11.95, 3.9 + Math.sin(z * 1.3) * 0.07, z, root, 6, 4);

  /* ---------- Sân khấu, phông nền, bục phát biểu ---------- */
  const [bw, bh] = CONFIG.scene.backdropSize || [6.4, 3.4];
  const stageMat = M(COL.red, { roughness: 0.95 });
  box(7.6, 0.3, 2.8, stageMat, 0, 0.15, -8.4);
  box(7.7, 0.04, 2.9, M(COL.gold), 0, 0.31, -8.4).scale.y = 0.4;
  box(7.6, 0.02, 2.8, M(COL.redDeep), 0, 0.31, -8.4);

  const bdTex = canvasTex(1024, Math.round(1024 * bh / bw), (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#3a0c12'); gr.addColorStop(0.55, '#7a1a14'); gr.addColorStop(1, '#2b1a10');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(227,176,75,.2)'; g.lineWidth = 2;
    for (let y = 0; y < h; y += 26) for (let x = ((y / 26) % 2) * 26; x < w; x += 52) { g.beginPath(); g.arc(x, y, 26, Math.PI, 0); g.stroke(); }
    const rg = g.createRadialGradient(w / 2, h * 0.6, 10, w / 2, h * 0.6, w * 0.45);
    rg.addColorStop(0, 'rgba(255,190,90,.45)'); rg.addColorStop(1, 'rgba(255,190,90,0)');
    g.fillStyle = rg; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e3b04b'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `bold ${h * 0.045}px ${FONT}`;
    g.fillText('ĐẠI SỨ QUÁN NƯỚC CHXHCN VIỆT NAM TẠI ALGERIA', w / 2, h * 0.09);
    g.fillText('AMBASSADE DE LA RÉPUBLIQUE SOCIALISTE DU VIET NAM EN ALGÉRIE', w / 2, h * 0.15);
    g.font = `bold ${h * 0.22}px ${FONT}`;
    g.fillText('Xuân Quê hương', w / 2, h * 0.47);
    g.font = `bold ${h * 0.15}px ${FONT}`;
    g.fillStyle = '#f3dca3';
    g.fillText('Đinh Mùi 2027', w / 2, h * 0.72);
    g.font = `${h * 0.04}px ${FONT}`;
    g.fillStyle = 'rgba(243,220,163,.7)';
    g.fillText('Phông minh họa. Thay bằng thiết kế thật trong assets/backdrop', w / 2, h * 0.93);
  });
  const useLed = !!CONFIG.scene.useLed;
  const backdropMat = new THREE.MeshStandardMaterial({
    map: bdTex, roughness: 0.7, emissive: 0xffffff, emissiveMap: bdTex, emissiveIntensity: useLed ? 0.9 : 0.1
  });
  const backdrop = new THREE.Mesh(G('PlaneGeometry', bw, bh), backdropMat);
  backdrop.position.set(0, 0.5 + bh / 2 + 0.5, -9.97);
  backdrop.receiveShadow = true;
  root.add(backdrop);
  new THREE.TextureLoader().load(CONFIG.scene.backdropImage, t => {
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    backdropMat.map = t; backdropMat.emissiveMap = t; backdropMat.needsUpdate = true;
  }, undefined, () => {});
  const bdTop = 1.0 + bh;
  box(bw + 0.2, 0.1, 0.06, M(COL.dark), 0, bdTop + 0.05, -9.95);
  box(bw + 0.2, 0.1, 0.06, M(COL.dark), 0, 0.95, -9.95);

  // Thanh đèn rọi phía trên phông, như ảnh chương trình năm 2026
  const railY = bdTop + 0.45;
  box(bw + 0.6, 0.05, 0.05, M(COL.dark), 0, railY, -9.7);
  for (let i = 0; i < 5; i++) {
    const x = -bw * 0.38 + (i * bw * 0.76) / 4;
    const fx = new THREE.Group(); fx.position.set(x, railY - 0.05, -9.7); fx.rotation.x = 0.16; root.add(fx);
    cyl(0.07, 0.09, 0.18, M(COL.dark), 0, -0.05, 0, fx, 10);
    const bm = new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    beamMats.push(bm);
    const cone = new THREE.Mesh(G('ConeGeometry', 0.55, 2.4, 14, 1, true), bm);
    cone.position.y = -1.3; fx.add(cone);
  }

  // Hoa hai đầu sân khấu
  blossomTree(-4.7, -8.9, COL.pink);
  blossomTree(4.7, -8.9, COL.mai);

  // Bục phát biểu
  const pod = new THREE.Group(); pod.position.set(3, 0.3, -8); root.add(pod);
  box(0.75, 1.05, 0.5, M(COL.wood), 0, 0.525, 0, pod);
  const podTop = box(0.85, 0.07, 0.6, M(0x4a2e1a), 0, 1.08, 0, pod); podTop.rotation.x = 0.12;
  const emb = new THREE.Mesh(G('CircleGeometry', 0.17, 24), new THREE.MeshBasicMaterial({ color: COL.gold }));
  emb.position.set(0, 0.55, 0.255); pod.add(emb);
  cyl(0.012, 0.012, 0.32, M(COL.dark), 0.1, 1.27, 0.05, pod, 6);
  sph(0.03, M(COL.dark), 0.1, 1.45, 0.07, pod, 8, 6);

  /* ---------- Bàn ghế ---------- */
  const cupMat = M(COL.red);
  const kraftMat = M(COL.kraft);

  function cocktailTable(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z); root.add(g);
    cyl(0.44, 0.6, 1.05, M(0xa5121f, { roughness: 0.7 }), 0, 0.525, 0, g, 20);
    cyl(0.46, 0.46, 0.04, M(0xa5121f, { roughness: 0.7 }), 0, 1.07, 0, g, 20);
    cyl(0.12, 0.09, 0.1, kraftMat, -0.12, 1.14, 0.06, g, 12);
    cyl(0.12, 0.09, 0.1, kraftMat, 0.12, 1.14, -0.1, g, 12);
    for (let i = 0; i < 3; i++) cyl(0.045, 0.035, 0.1, cupMat, -0.25 + i * 0.22, 1.14, 0.25, g, 8);
  }
  const cocktailPos = [[-2.4, -0.6], [0.2, 0.0], [2.6, -0.8], [-1.4, 1.9], [1.6, 2.1], [3.9, 0.9], [-3.9, 0.8], [-0.8, -1.2]];
  cocktailPos.forEach(([x, z]) => cocktailTable(x, z));

  const chairSeat = M(0x5a3b24), chairBack = M(0x5a3b24);
  function chair(x, z, rotY, parent = root) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; parent.add(g);
    box(0.42, 0.05, 0.42, chairSeat, 0, 0.46, 0, g);
    box(0.42, 0.45, 0.05, chairBack, 0, 0.72, 0.2, g);
    [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([a, b]) => box(0.04, 0.44, 0.04, M(COL.dark), a, 0.22, b, g));
  }
  const seated = [];
  function roundTable(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z); root.add(g);
    cyl(0.85, 0.9, 0.74, M(COL.cream), 0, 0.37, 0, g, 24);
    cyl(0.87, 0.87, 0.04, M(COL.cream), 0, 0.76, 0, g, 24);
    cyl(0.28, 0.28, 0.02, M(COL.red), 0, 0.79, 0, g, 16);
    sph(0.07, M(COL.gold), 0, 0.88, 0, g, 8, 6);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      const cx = Math.cos(a) * 1.25, cz = Math.sin(a) * 1.25;
      chair(x + cx, z + cz, Math.PI / 2 - a);
      if (rnd() > 0.45) seated.push([x + Math.cos(a) * 1.18, z + Math.sin(a) * 1.18]);
    }
  }
  [[-8.4, -5.4], [-5.9, -5.4], [-8.4, -2.4], [-5.9, -2.4]].forEach(([x, z]) => roundTable(x, z));

  /* ---------- Cờ nhỏ, khăn kẻ caro ---------- */
  const flagTex = canvasTex(96, 64, (g, w, h) => {
    g.fillStyle = '#da251d'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffde00'; g.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 11 : 26, a = -Math.PI / 2 + (i * Math.PI) / 5;
      g.lineTo(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r);
    }
    g.closePath(); g.fill();
  });
  function miniFlag(x, y, z, parent) {
    cyl(0.008, 0.008, 0.3, M(COL.dark), x, y + 0.15, z, parent, 4);
    const f = new THREE.Mesh(G('PlaneGeometry', 0.2, 0.135), new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide, toneMapped: false }));
    f.position.set(x + 0.1, y + 0.25, z); parent.add(f);
  }
  const checkerTex = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#a31621'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#7c0f18';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if ((x + y) % 2) g.fillRect(x * 16, y * 16, 16, 16);
  }, [4, 1]);
  const checkerMat = new THREE.MeshStandardMaterial({ map: checkerTex, roughness: 0.9 });

  /* ---------- Quầy buffet dưới mái che ---------- */
  function chafing(x, y, z, parent) {
    box(0.55, 0.14, 0.36, M(COL.steel, { metalness: 0.6, roughness: 0.35 }), x, y + 0.07, z, parent);
    const lid = new THREE.Mesh(G('SphereGeometry', 0.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), M(COL.steel, { metalness: 0.7, roughness: 0.3 }));
    lid.scale.set(1.3, 0.85, 0.9); lid.position.set(x, y + 0.14, z); lid.castShadow = true; parent.add(lid);
  }
  function bowlStack(x, y, z, parent, n = 3) {
    for (let i = 0; i < n; i++) cyl(0.11, 0.08, 0.07, kraftMat, x, y + 0.035 + i * 0.06, z, parent, 12);
  }
  function buffetTable(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z); root.add(g);
    box(3.6, 0.9, 0.9, checkerMat, 0, 0.45, 0, g);
    box(3.7, 0.04, 1.0, M(COL.white), 0, 0.92, 0, g);
    for (let i = 0; i < 3; i++) chafing(-1.1 + i * 0.85, 0.94, 0, g);
    bowlStack(1.35, 0.94, -0.15, g, 3);
    bowlStack(1.35, 0.94, 0.2, g, 4);
    miniFlag(-1.65, 0.94, 0.3, g);
  }

  function pavilion() {
    const g = new THREE.Group(); root.add(g);
    const x0 = 6.4, x1 = 11.5, z0 = -7.6, z1 = -1.0;
    box(x1 - x0 + 0.4, 0.14, z1 - z0 + 0.4, M(COL.white), (x0 + x1) / 2, 3.3, (z0 + z1) / 2, g);
    [[x0, z0], [x1, z0], [x0, z1], [x1, z1]].forEach(([x, z]) => cyl(0.06, 0.06, 3.25, M(COL.white), x, 1.625, z, g, 8));
    [[7.4, -4.3], [9.0, -4.3], [10.6, -4.3], [8.2, -2.2], [9.8, -6.4]].forEach(([x, z]) => lantern(x, 2.9, z, g));
    [[x0, z0 + 0.2], [x1, z0 + 0.2], [x0, z1 - 0.2], [x1, z1 - 0.2]].forEach(([x, z]) => {
      for (let i = 0; i < 5; i++) sph(0.13 - i * 0.012, M(COL.pink), x, 3.1 - i * 0.2, z, g, 8, 6);
    });
    buffetTable(9.0, -6.2);
    buffetTable(9.0, -2.2);
  }
  pavilion();

  /* ---------- Gian hàng cà phê, trà ---------- */
  const awningTex = canvasTex(128, 64, (g, w, h) => {
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f3f1ec' : '#a8141f'; g.fillRect(i * 16, 0, 16, h); }
  });

  function booth(label, x, z, kind) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.PI / 2; root.add(g);
    box(2.6, 0.92, 0.9, M(COL.white), 0, 0.46, 0, g);
    box(2.7, 0.05, 1.0, M(COL.white), 0, 0.94, 0, g);
    box(2.7, 2.3, 0.08, M(0xe9dcc0), 0, 1.15, -0.9, g);
    signPlane(kind === 'coffee' ? 'Cà phê Việt Nam' : 'Trà Việt Nam', 2.2, 0.9, '#3b2418', '#f3dca3', 0, 1.5, -0.855, g, 0, false);
    [-1.3, 1.3].forEach(px => cyl(0.04, 0.04, 2.5, M(COL.wood), px, 1.25, 0.6, g, 8));
    const aw = new THREE.Mesh(G('BoxGeometry', 2.9, 0.07, 1.9), new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.9 }));
    aw.position.set(0, 2.52, -0.1); aw.castShadow = true; g.add(aw);
    signPlane(label, 1.8, 0.4, '#a8141f', '#f3dca3', 0, 2.3, 0.88, g, 0, false);
    [-1.2, 1.2].forEach(px => { for (let i = 0; i < 5; i++) sph(0.12 - i * 0.01, M(COL.pink), px, 2.0 - i * 0.17, 0.62, g, 8, 6); });
    lantern(0, 2.2, 0.55, g, 0.8);

    if (kind === 'coffee') {
      for (let i = 0; i < 4; i++) {
        const cx = -0.95 + i * 0.5;
        cyl(0.07, 0.055, 0.09, M(COL.white), cx, 1.02, 0.1, g, 10);
        cyl(0.055, 0.055, 0.05, M(COL.steel, { metalness: 0.6, roughness: 0.4 }), cx, 1.1, 0.1, g, 10);
      }
      cyl(0.12, 0.14, 0.26, M(COL.steel, { metalness: 0.6, roughness: 0.4 }), 1.0, 1.1, -0.1, g, 12);
      bowlStack(-0.2, 0.96, -0.3, g, 3);
    } else {
      box(1.2, 0.03, 0.5, M(COL.wood), -0.2, 0.975, 0.05, g);
      sph(0.13, M(0xdde6ee), -0.55, 1.12, 0.05, g, 12, 8);
      cyl(0.04, 0.04, 0.05, M(0xdde6ee), -0.55, 1.26, 0.05, g, 8);
      for (let i = 0; i < 6; i++) cyl(0.04, 0.03, 0.05, M(COL.white), -0.1 + (i % 3) * 0.2, 1.01, -0.08 + Math.floor(i / 3) * 0.2, g, 8);
      miniFlag(1.0, 0.96, 0.2, g);
    }
    // nhân viên đứng sau quầy
    [-0.7, 0.7].forEach((px, i) => {
      mesh(G('CapsuleGeometry', 0.2, 0.65, 4, 8), M(i ? COL.red : COL.dark), px, 0.78, -0.55, g);
      sph(0.15, M(0xe2b48c), px, 1.5, -0.55, g, 10, 8);
    });
  }
  booth('Gian cà phê', -9.2, 1.5, 'coffee');
  booth('Gian trà', -9.2, 4.5, 'tea');

  /* ---------- Khu gói bánh chưng ---------- */
  const steamPuffs = [];
  function banhChungZone(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z); root.add(g);
    [-1.0, 1.0].forEach(tz => {
      box(3.0, 0.78, 0.8, M(COL.white), 0, 0.39, tz, g);
      box(3.1, 0.04, 0.9, M(COL.cream), 0, 0.8, tz, g);
      for (let i = 0; i < 3; i++) box(0.5, 0.06, 0.34, M(COL.leaf), -1.1 + i * 0.55, 0.85, tz - 0.12, g);
      for (let i = 0; i < 4; i++) {
        const bc = box(0.26, 0.15, 0.26, M(0x3d7d48), 0.55 + (i % 2) * 0.35, 0.9, tz - 0.12 + Math.floor(i / 2) * 0.28, g);
        bc.rotation.y = rnd() * 0.5;
      }
      box(0.34, 0.06, 0.34, M(COL.wood), 0.1, 0.86, tz + 0.15, g);
      for (let s = 0; s < 3; s++) cyl(0.17, 0.17, 0.46, M(COL.wood), -1.1 + s * 1.1, 0.23, tz + (tz < 0 ? -0.9 : 0.9), g, 12);
    });
    // nồi bánh và hơi nước
    const px = 2.4, pz = -1.9;
    cyl(0.5, 0.5, 0.7, M(0x1d1d22), px, 0.35, pz, g, 18);
    cyl(0.52, 0.52, 0.05, M(0x2c2c33), px, 0.72, pz, g, 18);
    for (let i = 0; i < 3; i++) {
      const p = sph(0.22, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false }), px, 1.0, pz, g, 10, 8);
      p.castShadow = false;
      steamPuffs.push({ m: p, o: i / 3 });
    }
    signPlane('Gói bánh chưng', 2.2, 0.55, '#2f6b3f', '#f3dca3', 0, 2.3, -2.5, g, 0);
    cyl(0.04, 0.04, 2.1, M(COL.wood), -1.05, 1.05, -2.5, g, 6);
    cyl(0.04, 0.04, 2.1, M(COL.wood), 1.05, 1.05, -2.5, g, 6);
  }
  banhChungZone(8.6, 4.6);

  /* ---------- Cổng chào và bàn đón khách ---------- */
  (function gate() {
    const g = new THREE.Group(); g.position.set(0, 0, 10.6); root.add(g);
    [-2.1, 2.1].forEach(px => box(0.36, 3.6, 0.36, M(COL.red), px, 1.8, 0, g));
    box(4.9, 0.45, 0.42, M(COL.redDeep), 0, 3.6, 0, g);
    box(5.0, 0.07, 0.46, M(COL.gold), 0, 3.86, 0, g);
    signPlane('Xuân Quê hương 2027', 3.7, 0.7, '#7a0f18', '#f3dca3', 0, 3.6, 0, g, 0, true).position.z = 0.215;
    signPlane('Xuân Quê hương 2027', 3.7, 0.7, '#7a0f18', '#f3dca3', 0, 3.6, -0.215, g, Math.PI, false);
    lantern(-1.6, 3.0, 0.1, g, 1.1); lantern(1.6, 3.0, 0.1, g, 1.1);
    blossomTree(-2.9, 0.1, COL.pink, g, 1.1);
    blossomTree(2.9, 0.1, COL.mai, g, 1.1);
    box(1.7, 0.9, 0.7, M(0xa5121f), -4.6, 0.45, -1.8, g);
    box(1.8, 0.04, 0.8, M(COL.white), -4.6, 0.92, -1.8, g);
    signPlane('Đón khách', 1.2, 0.3, '#f3f1ec', '#7a0f18', -4.6, 1.35, -1.8, g, 0, true);
  })();

  /* ---------- Khách tham dự (hình khối đơn giản) ---------- */
  const people = [];
  const addP = (x, z, sit = false) => people.push({ x, z, sit });
  for (let gx = -3.4; gx <= 3.4; gx += 0.82) for (let gz = -6.0; gz <= -2.3; gz += 0.82)
    if (rnd() > 0.14) addP(gx + (rnd() - 0.5) * 0.4, gz + (rnd() - 0.5) * 0.4);
  cocktailPos.forEach(([tx, tz]) => {
    const n = 3 + Math.floor(rnd() * 2);
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2; addP(tx + Math.cos(a) * 0.95, tz + Math.sin(a) * 0.95); }
  });
  for (let i = 0; i < 7; i++) addP(7.2 + i * 0.5, -4.2 + (rnd() - 0.5) * 0.3);
  [[-8.0, 1.0], [-8.1, 2.0], [-8.0, 4.0], [-8.1, 5.0]].forEach(([x, z]) => addP(x, z));
  [[6.6, 4.6], [7.2, 3.6], [10.0, 5.6]].forEach(([x, z]) => addP(x, z, true));
  seated.forEach(([x, z]) => addP(x, z, true));
  addP(-4.1, 9.0); addP(-3.0, 8.4);

  const bodyGeo = G('CapsuleGeometry', 0.2, 0.65, 4, 8);
  const headGeo = G('SphereGeometry', 0.15, 10, 8);
  const bodies = new THREE.InstancedMesh(bodyGeo, new THREE.MeshStandardMaterial({ roughness: 0.9 }), people.length);
  const heads = new THREE.InstancedMesh(headGeo, new THREE.MeshStandardMaterial({ roughness: 0.8 }), people.length);
  bodies.castShadow = heads.castShadow = true;
  const coats = [0x2d3a2f, 0x1c1c22, 0xd8d1c4, 0x7a1f2a, 0x3b4a7a, 0xf1efe8, 0x8a8f98, 0xe0a3b5, 0xa8141f];
  const skins = [0xf0c8a0, 0xd9a679, 0xb9855a, 0x8d5a3c];
  const dummy = new THREE.Object3D();
  people.forEach((p, i) => {
    const s = 0.92 + rnd() * 0.18;
    dummy.position.set(p.x, p.sit ? 0.62 : 0.78 * s, p.z);
    dummy.scale.set(1, p.sit ? 0.72 : s, 1);
    dummy.rotation.set(0, 0, 0); dummy.updateMatrix();
    bodies.setMatrixAt(i, dummy.matrix);
    bodies.setColorAt(i, new THREE.Color(coats[Math.floor(rnd() * coats.length)]));
    dummy.position.set(p.x, p.sit ? 1.18 : 1.5 * s, p.z);
    dummy.scale.set(1, 1, 1); dummy.updateMatrix();
    heads.setMatrixAt(i, dummy.matrix);
    heads.setColorAt(i, new THREE.Color(skins[Math.floor(rnd() * skins.length)]));
  });
  root.add(bodies, heads);

  /* ---------- Vùng sáng sàn, vùng bấm, số hiệu ---------- */
  const highlights = {};
  const proxies = [];
  const proxyH = { podium: [2.2, 1.1], stage: [1.2, 0.5], backdrop: [3.4, 2.5] };
  zones.forEach(z => {
    const geo = GEO[z.id];
    if (!geo) return;
    const [ax, az, aw, ad] = geo.area;
    const hl = new THREE.Mesh(
      new THREE.PlaneGeometry(aw, ad),
      new THREE.MeshBasicMaterial({ color: COL.gold, transparent: true, opacity: 0, depthWrite: false })
    );
    hl.rotation.x = -Math.PI / 2; hl.position.set(ax, 0.06, az);
    root.add(hl);
    highlights[z.id] = hl;

    const [ph, py] = proxyH[z.id] || [2.2, 1.1];
    const proxy = new THREE.Mesh(new THREE.BoxGeometry(aw, ph, ad), new THREE.MeshBasicMaterial({ visible: false }));
    proxy.position.set(ax, z.id === 'backdrop' ? 2.5 : py, az);
    proxy.userData.zone = z.id;
    root.add(proxy);
    proxies.push(proxy);
  });

  const hotEls = {};
  zones.forEach(z => {
    const geo = GEO[z.id];
    if (!geo) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hotspot'; b.setAttribute('aria-label', z.name);
    b.innerHTML = `<b>${z.no}</b><span>${z.name}</span>`;
    b.addEventListener('click', e => { e.stopPropagation(); selectZone(z.id); });
    hotspotLayer.appendChild(b);
    hotEls[z.id] = { el: b, v: new THREE.Vector3(...geo.hot) };
  });

  /* ---------- Chọn khu, bay camera ---------- */
  let activeId = null;
  let tween = null;

  function flyTo(p, t, dur = 1.25) {
    tween = {
      start: performance.now(), dur: dur * 1000,
      p0: camera.position.clone(), t0: controls.target.clone(),
      p1: new THREE.Vector3(...p), t1: new THREE.Vector3(...t)
    };
  }
  controls.addEventListener('start', () => { tween = null; });

  function selectZone(id, { fly = true } = {}) {
    activeId = id;
    Object.entries(hotEls).forEach(([k, h]) => h.el.classList.toggle('on', k === id));
    if (id && fly && GEO[id]) flyTo(GEO[id].cam.p, GEO[id].cam.t);
    if (onSelect) onSelect(id);
  }

  function setView(key) {
    const v = VIEWS[key];
    if (v) flyTo(v.p, v.t, 1.4);
  }

  /* ---------- Buổi tối, ban ngày ---------- */
  function setTime(mode) {
    const T = TIMES[mode];
    scene.background.setHex(T.bg);
    scene.fog.color.setHex(T.bg);
    hemi.color.setHex(T.hemiSky); hemi.groundColor.setHex(T.hemiGround); hemi.intensity = T.hemi;
    sun.color.setHex(T.sun); sun.intensity = T.sunI;
    lanternMat.emissiveIntensity = T.lantern;
    fairyMat.emissiveIntensity = T.fairy;
    bldMat.emissiveIntensity = T.win;
    beamMats.forEach(m => { m.opacity = T.beam; });
    backdropMat.emissiveIntensity = useLed ? 0.9 : (mode === 'dusk' ? 0.16 : 0.05);
  }

  /* ---------- Chạm chọn trong cảnh ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down = null;
  renderer.domElement.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    if (moved > 6) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(proxies, false)[0];
    if (hit) selectZone(hit.object.userData.zone);
  });
  renderer.domElement.addEventListener('pointermove', e => {
    if (e.buttons) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    renderer.domElement.style.cursor = ray.intersectObjects(proxies, false).length ? 'pointer' : 'grab';
  });

  /* ---------- Vòng lặp ---------- */
  function resize() {
    const w = container.clientWidth || 1, h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const tmp = new THREE.Vector3();
  function updateHotspots() {
    const w = container.clientWidth, h = container.clientHeight;
    Object.values(hotEls).forEach(({ el, v }) => {
      tmp.copy(v).project(camera);
      const hidden = tmp.z > 1 || tmp.z < -1;
      el.style.visibility = hidden ? 'hidden' : 'visible';
      el.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * w}px, ${(-tmp.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
    });
  }

  let running = false, raf = 0;
  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    if (tween) {
      const k = Math.min(1, (now - tween.start) / tween.dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      camera.position.lerpVectors(tween.p0, tween.p1, e);
      controls.target.lerpVectors(tween.t0, tween.t1, e);
      if (k >= 1) tween = null;
    }
    controls.update();
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -14, 14);
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, -12, 14);
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 6);
    if (camera.position.y < 0.5) camera.position.y = 0.5;

    Object.entries(highlights).forEach(([id, hl]) => {
      const target = id === activeId ? 0.3 : 0;
      hl.material.opacity += (target - hl.material.opacity) * 0.14;
      hl.visible = hl.material.opacity > 0.004;
    });

    if (!reduceMotion) {
      const t = now / 1000;
      steamPuffs.forEach(({ m, o }) => {
        const k = (t * 0.35 + o) % 1;
        m.position.y = 1.0 + k * 1.1;
        m.scale.setScalar(0.7 + k * 0.9);
        m.material.opacity = 0.32 * (1 - k);
      });
    }

    updateHotspots();
    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  setTime('dusk');
  resize();

  return { start, stop, resize, selectZone, setView, setTime };
}
