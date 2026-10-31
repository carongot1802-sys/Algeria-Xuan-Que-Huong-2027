import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/*
  Mô hình sân tổ chức, đơn vị là mét.
  Trục x sang phải, y lên trên, z về phía người xem. Tường phông nền ở z = -10, cổng chào ở z = +10.6.
  Mỗi khu có area (x, z, rộng, sâu) để tô sáng sàn, hot (x, y, z) để đặt số, cam (vị trí máy, điểm nhìn).
*/
export const GEO = {
  gate:      { area: [0, 10.6, 5.6, 2.6],    hot: [0, 5.7, 10.6],     cam: { p: [7.5, 3.6, 16.5],  t: [0, 2.3, 10.2] } },
  reception: { area: [0, 7.7, 4.6, 2.6],     hot: [0, 2.8, 7.4],      cam: { p: [5.4, 3.0, 11.4],  t: [0, 1.1, 7.2] } },
  coffee:    { area: [-9.3, 1.1, 2.8, 4.0],  hot: [-9.3, 4.4, 1.1],   cam: { p: [-3.0, 2.9, 4.0],  t: [-9.3, 1.5, 1.1] } },
  tea:       { area: [-9.3, 5.5, 2.8, 4.0],  hot: [-9.3, 4.4, 5.5],   cam: { p: [-3.0, 2.9, 8.4],  t: [-9.3, 1.5, 5.5] } },
  banhchung: { area: [8.2, 4.9, 6.8, 5.0],   hot: [8.2, 2.5, 4.9],    cam: { p: [2.2, 3.9, 10.4],  t: [8.4, 0.7, 4.9] } },
  cocktail:  { area: [0.2, 0.6, 8.4, 4.4],   hot: [0.2, 1.9, 0.6],    cam: { p: [-4.8, 4.6, 7.2],  t: [0.2, 0.8, 0.6] } },
  buffet:    { area: [8.75, -4.25, 6.4, 8.0],hot: [8.75, 4.2, -4.25], cam: { p: [2.4, 4.6, 1.6],   t: [8.75, 0.9, -4.25] } },
  seating:   { area: [-7.15, -3.9, 5.8, 5.4],hot: [-7.15, 2.2, -3.9],cam: { p: [-1.6, 4.4, 2.4],   t: [-7.1, 0.8, -3.9] } },
  standing:  { area: [0, -3.9, 7.4, 4.6],    hot: [0, 2.5, -3.9],     cam: { p: [0, 3.4, 4.8],     t: [0, 1.2, -4.5] } },
  stage:     { area: [0, -8.4, 7.8, 3],      hot: [2.6, 1.2, -8.3],   cam: { p: [7.6, 3.2, -0.6],  t: [0, 1.0, -8.4] } },
  backdrop:  { area: [0, -9.5, 6.6, 0.8],    hot: [0, 4.9, -9.7],     cam: { p: [0, 2.5, -1.6],    t: [0, 2.4, -9.9] } },
  podium:    { area: [-3, -8, 1.4, 1.4],     hot: [-3, 2.3, -8],      cam: { p: [-6.8, 2.4, -3.7], t: [-3, 1.3, -8] } }
};

export const STAGE_RECT = [-3.8, 3.8, -9.8, -7.0];
export const STAGE_H = 0.3;

const COL = {
  red: 0xa8141f, redDeep: 0x7a0f18, gold: 0xe3b04b, cream: 0xf2e8d5, white: 0xf3f1ec,
  kraft: 0xc9a46b, wood: 0x6b4528, leaf: 0x2f6b3f, pink: 0xf2a5b8, mai: 0xf0c332,
  steel: 0xc9ced6, dark: 0x2b2b30, bamboo: 0x7fa04a
};
const FD = '"Cormorant Garamond", Georgia, serif';
const FB = '"Be Vietnam Pro", Arial, sans-serif';

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildWorld(cfg, env) {
  const root = new THREE.Group();
  const rnd = mulberry32(2027);
  const obstacles = { rects: [], circles: [] };
  const rect = (x0, x1, z0, z1) => obstacles.rects.push([x0, x1, z0, z1]);
  const circ = (x, z, r) => obstacles.circles.push([x, z, r]);

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
    draw(c.getContext('2d'), w, h, c);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
    return t;
  }
  function flatPlane(tex, w, h, x, y, z, parent = root, rotY = 0, double = false) {
    const m = new THREE.Mesh(G('PlaneGeometry', w, h), new THREE.MeshBasicMaterial({ map: tex, side: double ? THREE.DoubleSide : THREE.FrontSide, toneMapped: false }));
    m.position.set(x, y, z); m.rotation.y = rotY;
    parent.add(m);
    return m;
  }
  function wrap(g, text, maxW) {
    const words = text.split(' '); const lines = []; let cur = '';
    words.forEach(w => {
      const t = cur ? cur + ' ' + w : w;
      if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function signPlane(text, w, h, bg, fg, x, y, z, parent = root, rotY = 0, double = false) {
    const t = canvasTex(512, Math.round(512 * h / w), (g, cw, ch) => {
      g.fillStyle = bg; g.fillRect(0, 0, cw, ch);
      g.strokeStyle = fg; g.globalAlpha = 0.7; g.lineWidth = 6; g.strokeRect(10, 10, cw - 20, ch - 20); g.globalAlpha = 1;
      g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
      let size = ch * 0.5;
      g.font = `bold ${size}px ${FD}`;
      while (g.measureText(text).width > cw * 0.86 && size > 12) { size -= 2; g.font = `bold ${size}px ${FD}`; }
      g.fillText(text, cw / 2, ch / 2 + size * 0.04);
    });
    return flatPlane(t, w, h, x, y, z, parent, rotY, double);
  }

  /* ---------- Vật liệu phát sáng ---------- */
  const lanternMat = new THREE.MeshStandardMaterial({ color: COL.red, emissive: 0xff2a14, emissiveIntensity: 1.7, roughness: 0.5 });
  const fairyMat = new THREE.MeshStandardMaterial({ color: 0xfff1c8, emissive: 0xffd98a, emissiveIntensity: 2.6 });
  const beamMats = [];
  const steamPuffs = [];

  /* ---------- Đèn lồng (gom lại một lượt để nhẹ máy) ---------- */
  const lanternList = [];
  function lantern(x, y, z, s = 1, parent = null) {
    if (parent) {
      parent.updateMatrixWorld(true);
      const v = parent.localToWorld(new THREE.Vector3(x, y, z));
      x = v.x; y = v.y; z = v.z;
    }
    lanternList.push({ x, y, z, s });
  }
  function flushLanterns() {
    const n = lanternList.length;
    const body = new THREE.InstancedMesh(G('SphereGeometry', 0.22, 14, 10), lanternMat, n);
    const cap = new THREE.InstancedMesh(G('CylinderGeometry', 0.07, 0.07, 0.05, 8), M(COL.gold), n * 2);
    const tas = new THREE.InstancedMesh(G('CylinderGeometry', 0.012, 0.012, 0.22, 4), M(COL.gold), n);
    const d = new THREE.Object3D();
    lanternList.forEach((l, i) => {
      d.rotation.set(0, 0, 0);
      d.position.set(l.x, l.y, l.z); d.scale.set(l.s, 0.88 * l.s, l.s); d.updateMatrix(); body.setMatrixAt(i, d.matrix);
      d.scale.setScalar(l.s);
      d.position.set(l.x, l.y + 0.2 * l.s, l.z); d.updateMatrix(); cap.setMatrixAt(i * 2, d.matrix);
      d.position.set(l.x, l.y - 0.2 * l.s, l.z); d.updateMatrix(); cap.setMatrixAt(i * 2 + 1, d.matrix);
      d.position.set(l.x, l.y - 0.34 * l.s, l.z); d.updateMatrix(); tas.setMatrixAt(i, d.matrix);
    });
    root.add(body, cap, tas);
  }

  /* ---------- Nền đất, tường, nhà xung quanh ---------- */
  const groundTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#cfc8bc'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#b3aa9c'; g.lineWidth = 3; g.strokeRect(0, 0, w, h);
    g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  }, [13, 13]);
  const ground = mesh(G('PlaneGeometry', 26, 26), new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.95 }), 0, 0, 0, root, false);
  ground.rotation.x = -Math.PI / 2;
  const street = mesh(G('PlaneGeometry', 220, 220), M(0x4a4d55, { roughness: 1 }), 0, -0.03, 0, root, false);
  street.rotation.x = -Math.PI / 2;

  const wallMat = M(COL.white, { roughness: 0.95 });
  box(26, 4.8, 0.3, wallMat, 0, 2.4, -10.15);
  box(0.3, 4.2, 22.6, wallMat, -12.15, 2.1, 0.9);
  box(0.3, 2.8, 22.6, wallMat, 12.15, 1.4, 0.9);
  box(9, 1.2, 0.3, wallMat, -7.5, 0.6, 12.15);
  box(9, 1.2, 0.3, wallMat, 7.5, 0.6, 12.15);

  const bRnd = mulberry32(88);
  const winCanvas = lit => canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = lit ? '#000' : '#cdbfa8'; g.fillRect(0, 0, w, h);
    for (let y = 12; y < h; y += 32) for (let x = 12; x < w; x += 32) {
      g.fillStyle = lit ? (bRnd() > 0.55 ? '#ffd27a' : '#000') : '#6d7480';
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
    circ(x, z, 0.5);
  }
  function blossomTree(x, z, color, parent = root, s = 1, solid = true) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
    cyl(0.4, 0.3, 0.5, M(COL.redDeep), 0, 0.25, 0, g, 14);
    cyl(0.4, 0.4, 0.03, M(COL.gold), 0, 0.48, 0, g, 14);
    cyl(0.06, 0.1, 1.7, M(COL.wood), 0, 1.3, 0, g, 6);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const b = cyl(0.03, 0.05, 1.1, M(COL.wood), Math.cos(a) * 0.25, 2.0, Math.sin(a) * 0.25, g, 5);
      b.rotation.z = Math.cos(a) * 0.6; b.rotation.x = -Math.sin(a) * 0.6;
    }
    for (let i = 0; i < 22; i++) {
      const a = rnd() * Math.PI * 2, r = 0.2 + rnd() * 0.8, y = 1.9 + rnd() * 1.1;
      const c = new THREE.Color(color).offsetHSL(0, 0, (rnd() - 0.5) * 0.1);
      mesh(G('IcosahedronGeometry', 0.17 + rnd() * 0.08, 0), M(c.getHex()), Math.cos(a) * r, y, Math.sin(a) * r, g);
    }
    if (solid) circ(x, z, 0.45 * s);
  }
  realTree(-9.6, -8.8);

  /* ---------- Câu đối ---------- */
  function coupletTex(text) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return canvasTex(256, 1024, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#b3151f'); gr.addColorStop(1, '#8e0f18');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#e3b04b'; g.lineWidth = 5; g.strokeRect(12, 12, w - 24, h - 24);
      g.lineWidth = 2; g.strokeRect(22, 22, w - 44, h - 44);
      g.fillStyle = '#e3b04b';
      [[42, 42], [w - 42, 42], [42, h - 42], [w - 42, h - 42]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); });
      g.fillStyle = '#f3dca3'; g.textAlign = 'center'; g.textBaseline = 'middle';
      const step = (h - 170) / Math.max(1, words.length);
      words.forEach((wd, i) => {
        let s = Math.min(96, step * 0.8);
        g.font = `italic 700 ${s}px ${FD}`;
        while (g.measureText(wd).width > w - 80 && s > 20) { s -= 4; g.font = `italic 700 ${s}px ${FD}`; }
        g.fillText(wd, w / 2, 90 + step * (i + 0.5));
      });
    });
  }
  const coupletTexs = {
    left: coupletTex(cfg.scene.couplets.left),
    right: coupletTex(cfg.scene.couplets.right)
  };
  function couplet(side, x, y, z, parent = root, rotY = 0, s = 1) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rotY; g.scale.setScalar(s); parent.add(g);
    flatPlane(coupletTexs[side], 0.45, 1.8, 0, 0, 0, g, 0, true);
    [0.92, -0.92].forEach(yy => {
      const r = cyl(0.03, 0.03, 0.56, M(COL.wood), 0, yy, 0, g, 8); r.rotation.z = Math.PI / 2;
      sph(0.045, M(COL.gold), 0.29, yy, 0, g, 8, 6); sph(0.045, M(COL.gold), -0.29, yy, 0, g, 8, 6);
    });
    return g;
  }

  /* ---------- Dây đèn lồng, dây đèn nhỏ ---------- */
  function lanternString(x1, x2, z, y, sag, count) {
    const pts = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push(new THREE.Vector3(x1 + (x2 - x1) * t, y - Math.sin(t * Math.PI) * sag, z)); }
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x20120f })));
    for (let i = 1; i < count; i++) {
      const t = i / count;
      lantern(x1 + (x2 - x1) * t, y - Math.sin(t * Math.PI) * sag - 0.28, z);
    }
  }
  [[8.6, 4.9], [4.2, 5.0], [0.0, 5.1], [-4.0, 5.2], [-7.6, 5.0]].forEach(([z, y]) => lanternString(-11.8, 11.8, z, y, 0.5, 15));
  for (let x = -11.5; x <= 11.5; x += 0.55) sph(0.05, fairyMat, x, 4.15 + Math.sin(x * 1.3) * 0.07, -9.95, root, 6, 4);
  for (let z = -9.5; z <= 11; z += 0.55) sph(0.05, fairyMat, -11.95, 3.9 + Math.sin(z * 1.3) * 0.07, z, root, 6, 4);

  /* ---------- Sân khấu, phông nền ---------- */
  const [bw, bh] = cfg.scene.backdropSize || [6.4, 3.4];
  box(7.6, 0.3, 2.8, M(COL.red, { roughness: 0.95 }), 0, 0.15, -8.4);
  box(7.7, 0.015, 2.9, M(COL.gold), 0, 0.305, -8.4);
  box(7.5, 0.02, 2.7, M(COL.redDeep), 0, 0.31, -8.4);

  function drawFlagVN(g, x, y, w, h) {
    g.fillStyle = '#da251d'; g.fillRect(x, y, w, h);
    g.fillStyle = '#ffde00'; g.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = (i % 2 ? 0.1 : 0.26) * h, a = -Math.PI / 2 + (i * Math.PI) / 5;
      g.lineTo(x + w / 2 + Math.cos(a) * r, y + h / 2 + Math.sin(a) * r);
    }
    g.closePath(); g.fill();
  }
  function drawFlagDZ(g, x, y, w, h) {
    g.fillStyle = '#ffffff'; g.fillRect(x, y, w, h);
    g.fillStyle = '#006233'; g.fillRect(x, y, w / 2, h);
    g.fillStyle = '#d21034';
    g.beginPath(); g.arc(x + w / 2, y + h / 2, h * 0.26, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(x + w / 2 + h * 0.07, y + h / 2, h * 0.21, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#d21034';
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = (i % 2 ? 0.05 : 0.12) * h, a = -Math.PI / 2 + (i * Math.PI) / 5;
      g.lineTo(x + w / 2 + h * 0.1 + Math.cos(a) * r, y + h / 2 + Math.sin(a) * r);
    }
    g.closePath(); g.fill();
  }
  const bdTex = canvasTex(1024, Math.round(1024 * bh / bw), (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#3a0c12'); gr.addColorStop(0.5, '#7a1a14'); gr.addColorStop(1, '#0f3b25');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(227,176,75,.2)'; g.lineWidth = 2;
    for (let y = 0; y < h; y += 26) for (let x = ((y / 26) % 2) * 26; x < w; x += 52) { g.beginPath(); g.arc(x, y, 26, Math.PI, 0); g.stroke(); }
    g.fillStyle = '#e3b04b'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `bold ${h * 0.04}px ${FD}`;
    g.fillText('ĐẠI SỨ QUÁN NƯỚC CHXHCN VIỆT NAM TẠI ALGERIA', w / 2, h * 0.08);
    g.fillText('AMBASSADE DE LA RÉPUBLIQUE SOCIALISTE DU VIETNAM EN ALGÉRIE', w / 2, h * 0.14);
    g.font = `bold ${h * 0.2}px ${FD}`; g.fillText('Xuân Quê hương', w / 2, h * 0.43);
    g.font = `bold ${h * 0.14}px ${FD}`; g.fillStyle = '#f3dca3'; g.fillText('Đinh Mùi 2027', w / 2, h * 0.65);
    drawFlagVN(g, w * 0.3, h * 0.78, w * 0.1, h * 0.1);
    drawFlagDZ(g, w * 0.6, h * 0.78, w * 0.1, h * 0.1);
    g.fillStyle = '#f3dca3'; g.font = `bold ${h * 0.05}px ${FD}`;
    g.fillText('Việt Nam', w * 0.45, h * 0.83); g.fillText('Algérie', w * 0.55, h * 0.83);
    g.font = `${h * 0.032}px ${FB}`; g.fillStyle = 'rgba(243,220,163,.75)';
    g.fillText('Phông minh họa. Thiết kế giao thoa Việt Nam và Algeria sẽ được thêm trong trang quản trị', w / 2, h * 0.94);
  });
  const useLed = !!cfg.scene.useLed;
  const backdropMat = new THREE.MeshStandardMaterial({ map: bdTex, roughness: 0.7, emissive: 0xffffff, emissiveMap: bdTex, emissiveIntensity: useLed ? 0.9 : 0.1 });
  const backdrop = new THREE.Mesh(G('PlaneGeometry', bw, bh), backdropMat);
  backdrop.position.set(0, 1.0 + bh / 2, -9.97);
  backdrop.receiveShadow = true;
  root.add(backdrop);
  if (cfg.scene.backdropImage) env.loadTexture(cfg.scene.backdropImage, t => {
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    backdropMat.map = t; backdropMat.emissiveMap = t; backdropMat.needsUpdate = true;
  });
  const bdTop = 1.0 + bh;
  box(bw + 0.2, 0.1, 0.06, M(COL.dark), 0, bdTop + 0.05, -9.95);
  box(bw + 0.2, 0.1, 0.06, M(COL.dark), 0, 0.95, -9.95);
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
  couplet('left', -bw / 2 - 0.55, 2.35, -9.9, root, 0, 1.15);
  couplet('right', bw / 2 + 0.55, 2.35, -9.9, root, 0, 1.15);
  blossomTree(-4.7, -8.9, COL.pink);
  blossomTree(4.7, -8.9, COL.mai);
  lantern(-bw / 2 - 1.2, 3.6, -9.6, 1.3); lantern(bw / 2 + 1.2, 3.6, -9.6, 1.3);

  /* ---------- Bục phát biểu bên trái và người phát biểu ---------- */
  const pod = new THREE.Group(); pod.position.set(-3, 0.3, -8); root.add(pod);
  box(0.75, 1.05, 0.5, M(COL.wood), 0, 0.525, 0, pod);
  const podTop = box(0.85, 0.07, 0.6, M(0x4a2e1a), 0, 1.08, 0, pod); podTop.rotation.x = 0.12;
  const emb = new THREE.Mesh(G('CircleGeometry', 0.17, 24), new THREE.MeshBasicMaterial({ color: COL.gold }));
  emb.position.set(0, 0.55, 0.255); pod.add(emb);
  cyl(0.012, 0.012, 0.32, M(COL.dark), 0.1, 1.27, 0.05, pod, 6);
  sph(0.03, M(COL.dark), 0.1, 1.45, 0.07, pod, 8, 6);
  circ(-3, -8, 0.55);

  // Người phát biểu đứng sau bục, áo dài xanh
  const speaker = new THREE.Group(); speaker.position.set(-3, 0.3, -8.5); root.add(speaker);
  const robe = new THREE.Mesh(G('CylinderGeometry', 0.2, 0.3, 1.3, 16), M(0x2e4a73, { roughness: 0.7 }));
  robe.position.y = 0.65; robe.castShadow = true; speaker.add(robe);
  box(0.36, 0.05, 0.18, M(0x1f3555), 0, 1.3, 0.04, speaker);
  sph(0.15, M(0xe2b48c), 0, 1.5, 0, speaker, 12, 10);
  [-0.06, 0.06].forEach(x => { const r = new THREE.Mesh(G('TorusGeometry', 0.04, 0.008, 6, 14), M(COL.dark)); r.position.set(x, 1.52, 0.14); speaker.add(r); });
  sph(0.155, M(0x1c1c1c), 0, 1.56, -0.02, speaker, 12, 6).scale.set(1, 0.6, 1);
  const armL = cyl(0.05, 0.05, 0.5, M(0x2e4a73), -0.2, 1.0, 0.12, speaker, 8); armL.rotation.x = -0.7;
  const armR = cyl(0.05, 0.05, 0.5, M(0x2e4a73), 0.2, 1.0, 0.12, speaker, 8); armR.rotation.x = -0.7;
  sph(0.045, M(0xe2b48c), -0.2, 0.82, 0.3, speaker, 8, 6); sph(0.045, M(0xe2b48c), 0.2, 0.82, 0.3, speaker, 8, 6);

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
    circ(x, z, 0.6);
  }
  const cocktailPos = [[-2.4, -0.6], [0.2, 0.0], [2.6, -0.8], [-1.4, 1.9], [1.6, 2.1], [3.9, 0.9], [-3.9, 0.8], [-0.8, -1.2]];
  cocktailPos.forEach(([x, z]) => cocktailTable(x, z));

  const chairMat = M(0x5a3b24);
  function chair(x, z, rotY) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; root.add(g);
    box(0.42, 0.05, 0.42, chairMat, 0, 0.46, 0, g);
    box(0.42, 0.45, 0.05, chairMat, 0, 0.72, 0.2, g);
    [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([a, b]) => box(0.04, 0.44, 0.04, M(COL.dark), a, 0.22, b, g));
  }
  const seated = [];
  function roundTable(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z); root.add(g);
    cyl(0.85, 0.9, 0.74, M(COL.cream), 0, 0.37, 0, g, 24);
    cyl(0.87, 0.87, 0.04, M(COL.cream), 0, 0.76, 0, g, 24);
    cyl(0.28, 0.28, 0.02, M(COL.red), 0, 0.79, 0, g, 16);
    sph(0.07, M(COL.gold), 0, 0.88, 0, g, 8, 6);
    circ(x, z, 1.0);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      chair(x + Math.cos(a) * 1.25, z + Math.sin(a) * 1.25, Math.PI / 2 - a);
      if (rnd() > 0.45) seated.push([x + Math.cos(a) * 1.2, z + Math.sin(a) * 1.2]);
    }
  }
  [[-8.4, -5.4], [-5.9, -5.4], [-8.4, -2.4], [-5.9, -2.4]].forEach(([x, z]) => roundTable(x, z));

  /* ---------- Cờ nhỏ, khăn kẻ caro, thảm ---------- */
  const flagTex = canvasTex(96, 64, (g, w, h) => drawFlagVN(g, 0, 0, w, h));
  function miniFlag(x, y, z, parent) {
    cyl(0.008, 0.008, 0.3, M(COL.dark), x, y + 0.15, z, parent, 4);
    const f = new THREE.Mesh(G('PlaneGeometry', 0.2, 0.135), new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide, toneMapped: false }));
    f.position.set(x + 0.1, y + 0.25, z); parent.add(f);
  }
  const checkerTex = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#a31621'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#7c0f18';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if ((x + y) % 2) g.fillRect(x * 16, y * 16, 16, 16);
  }, [3, 1]);
  const checkerMat = new THREE.MeshStandardMaterial({ map: checkerTex, roughness: 0.9 });

  function bowlStack(x, y, z, parent, n = 3) {
    for (let i = 0; i < n; i++) cyl(0.11, 0.08, 0.07, kraftMat, x, y + 0.035 + i * 0.06, z, parent, 12);
  }
  function chafing(x, y, z, parent) {
    box(0.55, 0.14, 0.36, M(COL.steel, { metalness: 0.6, roughness: 0.35 }), x, y + 0.07, z, parent);
    const lid = new THREE.Mesh(G('SphereGeometry', 0.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), M(COL.steel, { metalness: 0.7, roughness: 0.3 }));
    lid.scale.set(1.3, 0.85, 0.9); lid.position.set(x, y + 0.14, z); lid.castShadow = true; parent.add(lid);
  }

  /* ---------- Bàn đón tiếp ---------- */
  (function reception() {
    const g = new THREE.Group(); g.position.set(0, 0, 7.4); root.add(g);
    box(3.4, 0.95, 0.8, M(0xa5121f), 0, 0.475, 0, g);
    box(3.5, 0.05, 0.9, M(COL.gold), 0, 0.975, 0, g);
    box(3.3, 0.04, 0.78, M(COL.white), 0, 1.0, 0, g);
    signPlane('BÀN ĐÓN TIẾP', 2.2, 0.5, '#7a0f18', '#f3dca3', 0, 0.55, 0.405, g, 0, false);
    box(0.5, 0.04, 0.34, M(COL.white), -0.9, 1.04, 0.05, g);                  // sổ lưu bút
    for (let i = 0; i < 4; i++) box(0.22, 0.012, 0.15, M(COL.cream), 0.3 + i * 0.28, 1.03 + (i % 2) * 0.006, 0.12, g); // thiệp
    miniFlag(1.4, 1.02, 0.2, g);
    // panel phía sau
    box(3.6, 2.2, 0.08, M(COL.redDeep), 0, 1.1, -1.0, g);
    signPlane('CHÀO MỪNG QUÝ KHÁCH', 3.0, 0.5, '#7a0f18', '#f3dca3', 0, 1.65, -0.95, g, 0, false);
    signPlane('BIENVENUE', 1.8, 0.4, '#7a0f18', '#e3b04b', 0, 1.1, -0.95, g, 0, false);
    [-2.2, 2.2].forEach((x, i) => blossomTree(x, 0.2, i ? COL.mai : COL.pink, g, 0.9, false));
    couplet('left', -1.55, 1.7, -0.9, g, 0, 0.8); couplet('right', 1.55, 1.7, -0.9, g, 0, 0.8);
    lantern(-1.2, 2.4, 0.2, 1.1, g); lantern(1.2, 2.4, 0.2, 1.1, g);
    rect(-1.95, 1.95, 6.95, 7.9);
    circ(-2.2, 7.6, 0.45); circ(2.2, 7.6, 0.45);
  })();

  /* ---------- Gian cà phê, trà ---------- */
  function drawCup(g, cx, cy, s, coffee) {
    g.fillStyle = '#f7f1e6';
    g.beginPath(); g.moveTo(cx - s * 0.5, cy - s * 0.2); g.lineTo(cx + s * 0.5, cy - s * 0.2); g.lineTo(cx + s * 0.34, cy + s * 0.32); g.lineTo(cx - s * 0.34, cy + s * 0.32); g.closePath(); g.fill();
    g.beginPath(); g.ellipse(cx, cy + s * 0.36, s * 0.7, s * 0.1, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = coffee ? '#4a2616' : '#9fc46a';
    g.beginPath(); g.ellipse(cx, cy - s * 0.2, s * 0.5, s * 0.08, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(243,220,163,.8)'; g.lineWidth = 5; g.lineCap = 'round';
    [-0.2, 0.05, 0.3].forEach(o => { g.beginPath(); g.moveTo(cx + s * o, cy - s * 0.35); g.bezierCurveTo(cx + s * (o + 0.15), cy - s * 0.55, cx + s * (o - 0.15), cy - s * 0.7, cx + s * o, cy - s * 0.9); g.stroke(); });
  }
  function bannerTex(kind) {
    const coffee = kind === 'coffee';
    return canvasTex(1024, 392, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w, h);
      if (coffee) { gr.addColorStop(0, '#2a140c'); gr.addColorStop(1, '#5a2e19'); } else { gr.addColorStop(0, '#173d24'); gr.addColorStop(1, '#2f6b3f'); }
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.22; g.fillStyle = coffee ? '#e3b04b' : '#d9f0c0';
      for (let i = 0; i < 30; i++) {
        const x = rnd() * w, y = rnd() * h, r = 10 + rnd() * 14, a = rnd() * Math.PI;
        g.save(); g.translate(x, y); g.rotate(a); g.beginPath();
        if (coffee) g.ellipse(0, 0, r, r * 0.65, 0, 0, Math.PI * 2);
        else { g.moveTo(-r * 1.3, 0); g.quadraticCurveTo(0, -r, r * 1.3, 0); g.quadraticCurveTo(0, r, -r * 1.3, 0); }
        g.fill(); g.restore();
      }
      g.globalAlpha = 1;
      g.strokeStyle = '#e3b04b'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28);
      g.fillStyle = '#f3dca3'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = `bold ${h * 0.3}px ${FD}`; g.fillText(coffee ? 'CÀ PHÊ VIỆT NAM' : 'TRÀ VIỆT NAM', w * 0.57, h * 0.42);
      g.font = `${h * 0.095}px ${FB}`; g.fillStyle = '#e3b04b';
      g.fillText(coffee ? 'Phin · Robusta · Arabica' : 'Trà xanh · Trà sen · Trà hoa nhài', w * 0.57, h * 0.74);
      drawCup(g, w * 0.14, h * 0.55, h * 0.3, coffee);
    });
  }
  const stripeTex = canvasTex(128, 64, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f3f1ec' : '#a8141f'; g.fillRect(i * 16, 0, 16, h); } });

  function bagBox(x, y, z, parent, label) {
    box(0.17, 0.27, 0.08, kraftMat, x, y + 0.135, z, parent);
    box(0.12, 0.1, 0.005, M(label), x, y + 0.12, z + 0.043, parent);
  }
  function teaTin(x, y, z, parent, color) {
    cyl(0.085, 0.085, 0.24, M(color, { roughness: 0.5 }), x, y + 0.12, z, parent, 14);
    cyl(0.09, 0.09, 0.02, M(COL.gold), x, y + 0.25, z, parent, 14);
  }
  function teaCup(x, y, z, parent, fill) {
    cyl(0.045, 0.032, 0.05, M(COL.white), x, y + 0.025, z, parent, 10);
    if (fill) cyl(0.038, 0.038, 0.004, M(fill), x, y + 0.052, z, parent, 10);
  }
  function teapot(x, y, z, parent) {
    sph(0.12, M(0xdde6ee), x, y + 0.12, z, parent, 12, 8);
    cyl(0.04, 0.04, 0.04, M(0xdde6ee), x, y + 0.26, z, parent, 8);
    const sp = cyl(0.015, 0.025, 0.14, M(0xdde6ee), x + 0.15, y + 0.17, z, parent, 6); sp.rotation.z = -0.9;
  }

  function booth(kind, x, z, label) {
    const coffee = kind === 'coffee';
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.PI / 2; root.add(g);
    const W = 3.8;
    box(W, 0.95, 0.95, M(0xfbfaf6), 0, 0.475, 0.05, g);
    box(W + 0.12, 0.05, 1.05, M(0xf0e8d8), 0, 0.97, 0.05, g);
    box(W - 0.2, 0.5, 0.01, M(COL.red), 0, 0.5, 0.535, g);
    box(W + 0.2, 3.2, 0.1, M(coffee ? 0xe9dcc0 : 0xe3ecd4), 0, 1.6, -0.95, g);
    flatPlane(bannerTex(kind), 3.4, 1.3, 0, 2.5, -0.89, g);
    [-W / 2, W / 2].forEach(px => cyl(0.06, 0.06, 3.3, M(COL.wood), px, 1.65, 0.9, g, 8));
    const aw = new THREE.Mesh(G('BoxGeometry', W + 0.5, 0.09, 2.1), new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.9 }));
    aw.position.set(0, 3.3, -0.05); aw.castShadow = true; g.add(aw);
    signPlane(label, 2.6, 0.5, coffee ? '#3b2418' : '#1f4a2c', '#f3dca3', 0, 3.65, 0.95, g, 0, false);
    couplet('left', -1.55, 2.2, 0.93, g, 0, 0.95); couplet('right', 1.55, 2.2, 0.93, g, 0, 0.95);
    [-1.2, 1.2].forEach(px => { for (let i = 0; i < 6; i++) sph(0.13 - i * 0.01, M(COL.pink), px, 3.15 - i * 0.17, 0.85, g, 8, 6); });
    [-0.6, 0.6].forEach(px => lantern(px, 3.0, 0.85, 0.9, g));
    box(2.4, 0.04, 0.34, M(COL.wood), 0, 1.2, -0.78, g); box(2.4, 0.04, 0.34, M(COL.wood), 0, 1.6, -0.78, g);

    if (coffee) {
      const labels = [0xd13b3b, 0x4f8a3a, 0x3a6fc4, 0xe0577a];
      for (let i = 0; i < 9; i++) { bagBox(-1.1 + i * 0.275, 1.22, -0.78, g, labels[i % 4]); bagBox(-1.1 + i * 0.275, 1.62, -0.78, g, labels[(i + 1) % 4]); }
      for (let i = 0; i < 5; i++) {
        const cx = -1.6 + i * 0.36;
        cyl(0.07, 0.055, 0.09, M(COL.white), cx, 1.04, 0.2, g, 10);
        cyl(0.055, 0.055, 0.05, M(COL.steel, { metalness: 0.6, roughness: 0.4 }), cx, 1.12, 0.2, g, 10);
        cyl(0.04, 0.055, 0.03, M(COL.steel, { metalness: 0.6, roughness: 0.4 }), cx, 1.16, 0.2, g, 10);
      }
      for (let i = 0; i < 12; i++) {
        const cx = -0.35 + (i % 6) * 0.19, cz = 0.3 - Math.floor(i / 6) * 0.2 - 0.2;
        cyl(0.045, 0.034, 0.055, M(COL.white), cx, 1.03, cz, g, 10);
        cyl(0.038, 0.038, 0.004, M(0x3b1f10), cx, 1.058, cz, g, 10);
      }
      for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) bagBox(1.0 + i * 0.2 + r * 0.1, 0.97 + r * 0.27, 0.18, g, labels[(i + r) % 4]);
      cyl(0.2, 0.24, 0.45, M(0xb99a68), -1.7, 1.22, -0.45, g, 12);
    } else {
      const tins = [0xe6c229, 0xb3262b, 0x6c9a2f, 0xe6c229, 0xb3262b, 0x6c9a2f, 0xe6c229, 0xb3262b];
      for (let i = 0; i < 8; i++) { teaTin(-1.1 + i * 0.31, 1.22, -0.78, g, tins[i]); teaTin(-1.0 + i * 0.31, 1.62, -0.78, g, tins[(i + 2) % 8]); }
      box(1.5, 0.03, 0.55, M(COL.wood), -0.7, 0.995, 0.2, g);
      teapot(-1.15, 1.01, 0.2, g); teapot(-0.7, 1.01, 0.2, g); teapot(-0.25, 1.01, 0.2, g);
      for (let i = 0; i < 12; i++) teaCup(-1.4 + (i % 6) * 0.22, 1.01, 0.38 - Math.floor(i / 6) * 0.2 + 0.0, g, 0xc98b2a);
      for (let i = 0; i < 4; i++) { box(0.22, 0.13, 0.1, M(i % 2 ? 0xe6c229 : 0x2f6b3f), 0.9 + i * 0.25, 1.04, 0.2, g); }
      for (let i = 0; i < 3; i++) teaTin(1.0 + i * 0.3, 0.97, 0.0, g, tins[i]);
      cyl(0.28, 0.2, 0.14, M(0xc9a46b), 1.55, 1.05, 0.3, g, 14); cyl(0.26, 0.26, 0.02, M(0x6f8f3b), 1.55, 1.12, 0.3, g, 14);
    }
    [-0.8, 0.8].forEach((px, i) => {
      const s = mesh(G('CapsuleGeometry', 0.2, 0.85, 4, 8), M(i ? COL.red : COL.dark), px, 0.625, -0.45, g);
      s.castShadow = true;
      sph(0.15, M(0xe2b48c), px, 1.37, -0.45, g, 10, 8);
    });
    const sinZ = Math.sin(g.rotation.y), cosZ = Math.cos(g.rotation.y);
    rect(x - 1.0, x + 0.95, z - W / 2, z + W / 2);
    return { sinZ, cosZ };
  }
  booth('coffee', -9.3, 1.1, 'Gian cà phê');
  booth('tea', -9.3, 5.5, 'Gian trà');
  [[-9.3, -1.4, COL.pink], [-9.3, 3.3, COL.mai], [-9.3, 7.9, COL.pink]].forEach(([x, z, c]) => blossomTree(x, z, c, root, 1.1));

  /* ---------- Khu gói bánh chưng ---------- */
  const matTex = canvasTex(256, 192, (g, w, h) => {
    g.fillStyle = '#e8d9b0'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#b3151f'; g.fillRect(0, 0, w, 26); g.fillRect(0, h - 26, w, 26); g.fillRect(0, 0, 26, h); g.fillRect(w - 26, 0, 26, h);
    g.strokeStyle = '#e8d9b0'; g.lineWidth = 3; g.strokeRect(38, 38, w - 76, h - 76);
    g.strokeStyle = '#b3151f'; g.lineWidth = 8; g.beginPath(); g.arc(w / 2, h / 2, 36, 0, 7); g.stroke();
    g.fillStyle = '#b3151f'; g.fillRect(w / 2 - 12, h / 2 - 12, 24, 24);
    [[70, 70], [w - 70, 70], [70, h - 70], [w - 70, h - 70]].forEach(([x, y]) => g.fillRect(x - 10, y - 10, 20, 20));
  });
  function sitter(x, y, z, parent, color, skin) {
    const b = mesh(G('CapsuleGeometry', 0.2, 0.85, 4, 8), M(color), x, y + 0.3, z, parent);
    b.scale.set(1.15, 0.45, 1.15);
    sph(0.15, M(skin), x, y + 0.72, z, parent, 10, 8);
  }
  (function banhChung() {
    const g = new THREE.Group(); g.position.set(8.2, 0, 4.9); root.add(g);
    [-1.45, 1.45].forEach(tx => {
      box(2.7, 0.78, 0.8, M(COL.white), tx, 0.39, -1.7, g);
      box(2.8, 0.04, 0.9, M(COL.cream), tx, 0.8, -1.7, g);
      for (let i = 0; i < 3; i++) box(0.5, 0.06, 0.34, M(COL.leaf), tx - 0.9 + i * 0.55, 0.85, -1.82, g);
      for (let i = 0; i < 4; i++) { const bc = box(0.26, 0.15, 0.26, M(0x3d7d48), tx + 0.3 + (i % 2) * 0.35, 0.9, -1.82 + Math.floor(i / 2) * 0.28, g); bc.rotation.y = rnd() * 0.5; }
      box(0.34, 0.06, 0.34, M(COL.wood), tx - 0.1, 0.86, -1.5, g);
      for (let s = 0; s < 3; s++) cyl(0.17, 0.17, 0.46, M(COL.wood), tx - 0.9 + s * 0.9, 0.23, -0.95, g, 12);
    });
    rect(5.5, 10.9, 2.7, 3.6);
    // ba tấm chiếu cói ngồi gói bánh
    [-2.3, -0.3, 1.7].forEach((mx, mi) => {
      const m = new THREE.Mesh(G('PlaneGeometry', 1.85, 1.4), new THREE.MeshStandardMaterial({ map: matTex, roughness: 1 }));
      m.rotation.x = -Math.PI / 2; m.position.set(mx, 0.025, 1.35); m.receiveShadow = true; g.add(m);
      box(0.8, 0.06, 0.55, M(COL.wood), mx, 0.06, 1.35, g);
      for (let i = 0; i < 2; i++) box(0.5, 0.03, 0.32, M(COL.leaf), mx - 0.1, 0.1 + i * 0.03, 1.3, g);
      for (let i = 0; i < 3; i++) box(0.2, 0.12, 0.2, M(0x3d7d48), mx + 0.18 + (i % 2) * 0.18, 0.16, 1.28 + Math.floor(i / 2) * 0.2, g);
      const cols = [0x7a1f2a, 0x2d3a2f, 0xe0a3b5, 0x3b4a7a, 0xd8d1c4, 0xa8141f];
      const skins = [0xf0c8a0, 0xd9a679, 0xb9855a];
      sitter(mx - 0.6, 0.02, 1.0, g, cols[(mi * 2) % 6], skins[mi % 3]);
      sitter(mx + 0.6, 0.02, 1.0, g, cols[(mi * 2 + 1) % 6], skins[(mi + 1) % 3]);
      sitter(mx, 0.02, 1.95, g, cols[(mi + 3) % 6], skins[(mi + 2) % 3]);
    });
    // nồi bánh đặt ở góc ngoài, dễ thấy
    const px = 3.2, pz = -0.2;
    box(0.9, 0.3, 0.9, M(0x3a2a22), px, 0.15, pz, g);
    const fire = new THREE.Mesh(G('CircleGeometry', 0.3, 16), new THREE.MeshBasicMaterial({ color: 0xff7a1a }));
    fire.rotation.x = -Math.PI / 2; fire.position.set(px, 0.31, pz + 0.38); g.add(fire);
    cyl(0.55, 0.55, 0.8, M(0x1d1d22), px, 0.7, pz, g, 20);
    cyl(0.58, 0.58, 0.06, M(0x2c2c33), px, 1.12, pz, g, 20);
    [-0.45, 0.45].forEach(o => sph(0.06, M(COL.dark), px + o, 1.0, pz, g, 8, 6));
    for (let i = 0; i < 4; i++) {
      const p = sph(0.26, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false }), px, 1.3, pz, g, 10, 8);
      p.castShadow = false;
      steamPuffs.push({ m: p, o: i / 4, y0: 1.3, h: 1.8 });
    }
    signPlane('Nồi bánh chưng', 1.7, 0.4, '#2f6b3f', '#f3dca3', px, 2.9, pz, g, 0, true);
    cyl(0.03, 0.03, 2.3, M(COL.wood), px - 0.6, 1.45, pz, g, 6); cyl(0.03, 0.03, 2.3, M(COL.wood), px + 0.6, 1.45, pz, g, 6);
    for (let i = 0; i < 3; i++) cyl(0.12, 0.12, 0.3, M(COL.wood), px - 1.0 + (i % 2) * 0.3, 0.15, pz + 0.9 + i * 0.1, g, 8); // củi
    circ(11.4, 4.7, 0.8);
    blossomTree(-3.0, -2.4, COL.mai, g, 0.9, false);
    lantern(-2.0, 2.6, 0.9, 1.0, g); lantern(0.4, 2.6, 0.9, 1.0, g);
    signPlane('Gói bánh chưng', 2.6, 0.55, '#2f6b3f', '#f3dca3', -0.4, 2.7, -2.5, g, 0, true);
    cyl(0.04, 0.04, 2.5, M(COL.wood), -1.7, 1.25, -2.5, g, 6); cyl(0.04, 0.04, 2.5, M(COL.wood), 0.9, 1.25, -2.5, g, 6);
  })();

  /* ---------- Khu buffet món Việt dưới mái che ---------- */
  const foodTex = [];
  const foodBoards = [];
  cfg.scene.foods.forEach((f, i) => {
    foodTex[i] = null;
    if (f.image) env.loadTexture(f.image, t => {
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      const img = t.image; const aspect = img && img.width ? img.width / img.height : 1;
      const target = 1.1 / 0.8;
      if (aspect > target) { t.repeat.set(target / aspect, 1); t.offset.set((1 - target / aspect) / 2, 0); }
      else { t.repeat.set(1, aspect / target); t.offset.set(0, (1 - aspect / target) / 2); }
      foodTex[i] = t;
      const m = foodBoards[i]; if (m) { m.material.map = t; m.material.needsUpdate = true; }
    });
  });

  function dish(kind, parent, y) {
    const white = M(COL.white), steel = M(COL.steel, { metalness: 0.6, roughness: 0.35 });
    if (kind === 'pho') {
      for (let i = 0; i < 4; i++) {
        const x = -0.8 + i * 0.5;
        cyl(0.16, 0.09, 0.1, white, x, y + 0.05, 0.05, parent, 16);
        cyl(0.145, 0.145, 0.004, M(0xa66f2f), x, y + 0.102, 0.05, parent, 16);
        cyl(0.1, 0.1, 0.012, M(0xf1e6c8), x, y + 0.106, 0.05, parent, 14);
        box(0.08, 0.012, 0.05, M(0xb55c52), x - 0.03, y + 0.115, 0.04, parent);
        sph(0.025, M(0x3d8f3a), x + 0.05, y + 0.12, 0.08, parent, 6, 4);
      }
      chafing(-0.55, y, -0.3, parent); chafing(0.55, y, -0.3, parent);
    } else if (kind === 'banhmi') {
      box(1.5, 0.03, 0.5, M(COL.wood), 0, y + 0.015, 0.05, parent);
      for (let i = 0; i < 7; i++) {
        const b = mesh(G('CapsuleGeometry', 0.055, 0.22, 4, 8), M(0xd9a85b), -0.6 + i * 0.2, y + 0.09, 0.05 + (i % 2) * 0.1, parent);
        b.rotation.z = Math.PI / 2; b.rotation.y = 0.4;
      }
      box(0.5, 0.16, 0.3, M(0xe8c98a), 0.55, y + 0.1, -0.28, parent);
    } else if (kind === 'sup') {
      for (let i = 0; i < 5; i++) {
        const x = -0.85 + i * 0.42;
        cyl(0.14, 0.08, 0.1, white, x, y + 0.05, 0.05, parent, 16);
        cyl(0.125, 0.125, 0.004, M(0xe8b53a), x, y + 0.102, 0.05, parent, 16);
        sph(0.02, M(0x3d8f3a), x, y + 0.11, 0.05, parent, 6, 4);
      }
      chafing(-0.55, y, -0.3, parent); chafing(0.55, y, -0.3, parent);
    } else if (kind === 'che') {
      const fills = [0x7fc97f, 0x9a6bb7, 0xf0a050, 0x7fc97f, 0xd9a05b, 0x9a6bb7];
      for (let i = 0; i < 12; i++) {
        const x = -0.85 + (i % 6) * 0.32, z = 0.15 - Math.floor(i / 6) * 0.25;
        cyl(0.065, 0.045, 0.1, new THREE.MeshStandardMaterial({ color: 0xf0f6f8, transparent: true, opacity: 0.55, roughness: 0.2 }), x, y + 0.05, z, parent, 12);
        cyl(0.055, 0.04, 0.07, M(fills[i % 6]), x, y + 0.04, z, parent, 12);
      }
      box(0.6, 0.2, 0.3, M(0xcfe9f2), 0.8, y + 0.1, -0.3, parent);
    } else if (kind === 'banhchung') {
      for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) {
        const bc = box(0.27, 0.15, 0.27, M(0x3d7d48), -0.5 + i * 0.32 + r * 0.16, y + 0.075 + r * 0.16, 0.0, parent); bc.rotation.y = (i + r) * 0.1;
        box(0.275, 0.02, 0.03, M(0x1f4a2b), -0.5 + i * 0.32 + r * 0.16, y + 0.152 + r * 0.16, 0.0, parent);
      }
      for (let i = 0; i < 3; i++) box(0.5, 0.04, 0.3, M(COL.leaf), 0.6, y + 0.02 + i * 0.04, 0.0, parent);
    } else {
      [0xf0a050, 0xe0577a, 0x7fc97f].forEach((c, i) => {
        const jug = new THREE.Mesh(G('CylinderGeometry', 0.1, 0.1, 0.3, 14), new THREE.MeshStandardMaterial({ color: 0xf0f6f8, transparent: true, opacity: 0.5, roughness: 0.2 }));
        jug.position.set(-0.8 + i * 0.3, y + 0.15, -0.15); parent.add(jug);
        cyl(0.085, 0.085, 0.22, M(c), -0.8 + i * 0.3, y + 0.12, -0.15, parent, 14);
      });
      for (let i = 0; i < 14; i++) cyl(0.04, 0.03, 0.08, cupMat, 0.0 + (i % 7) * 0.13, y + 0.04, 0.15 - Math.floor(i / 7) * 0.12, parent, 8);
    }
  }

  (function pavilion() {
    const g = new THREE.Group(); root.add(g);
    const x0 = 5.7, x1 = 11.8, z0 = -8.2, z1 = -0.3;
    box(x1 - x0 + 0.5, 0.14, z1 - z0 + 0.5, M(COL.white), (x0 + x1) / 2, 3.4, (z0 + z1) / 2, g);
    box(x1 - x0 + 0.6, 0.35, 0.1, stripeTex ? new THREE.MeshStandardMaterial({ map: stripeTex }) : M(COL.red), (x0 + x1) / 2, 3.15, z1 + 0.25, g);
    [[x0, z0], [x1, z0], [x0, z1], [x1, z1], [(x0 + x1) / 2, z1], [(x0 + x1) / 2, z0]].forEach(([x, z]) => { cyl(0.07, 0.07, 3.35, M(COL.white), x, 1.675, z, g, 8); circ(x, z, 0.12); });
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) lantern(x0 + 0.9 + i * 1.5, 3.0, z0 + 0.9 + j * 2.2, 1.0);
    [[x0, z1 - 0.3], [x1, z1 - 0.3], [x0, z0 + 0.3], [x1, z0 + 0.3]].forEach(([x, z]) => { for (let i = 0; i < 6; i++) sph(0.13 - i * 0.01, M(COL.pink), x, 3.2 - i * 0.18, z, g, 8, 6); });
    couplet('left', x0 - 0.1, 2.0, z1 - 0.1, g, 0, 0.9); couplet('right', x1 + 0.1, 2.0, z1 - 0.1, g, 0, 0.9);

    const cols = [7.0, 10.5], rows = [-6.8, -4.2, -1.6];
    let fi = 0;
    rows.forEach(rz => cols.forEach(cx => {
      const food = cfg.scene.foods[fi] || { kind: 'drink', name: '', image: '' };
      const t = new THREE.Group(); t.position.set(cx, 0, rz); g.add(t);
      box(2.4, 0.9, 0.9, checkerMat, 0, 0.45, 0, t);
      box(2.5, 0.04, 1.0, M(COL.white), 0, 0.92, 0, t);
      dish(food.kind, t, 0.94);
      miniFlag(1.05, 0.94, 0.3, t);
      // bảng ảnh món phía sau bàn
      cyl(0.025, 0.025, 1.9, M(COL.wood), -0.62, 0.95, -0.62, t, 6); cyl(0.025, 0.025, 1.9, M(COL.wood), 0.62, 0.95, -0.62, t, 6);
      const bd = new THREE.Mesh(G('PlaneGeometry', 1.1, 0.8), new THREE.MeshBasicMaterial({ color: food.image ? 0xffffff : 0x2f6b3f, toneMapped: false }));
      bd.position.set(0, 1.65, -0.6); t.add(bd); foodBoards[fi] = bd;
      if (!food.image) {
        const ph = canvasTex(256, 186, (c, w, h) => { c.fillStyle = '#2f6b3f'; c.fillRect(0, 0, w, h); c.fillStyle = '#f3dca3'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `bold 40px ${FD}`; c.fillText(food.name || 'Món Việt', w / 2, h / 2); });
        bd.material.map = ph; bd.material.color.set(0xffffff); bd.material.needsUpdate = true;
      }
      box(1.2, 0.9, 0.04, M(COL.wood), 0, 1.65, -0.64, t);
      signPlane(food.name || 'Món Việt', 1.2, 0.26, '#7a0f18', '#f3dca3', 0, 1.06, -0.2, t, 0, false).position.set(0, 1.12, -0.58);
      rect(cx - 1.25, cx + 1.25, rz - 0.55, rz + 0.55);
      fi++;
    }));
  })();

  /* ---------- Cổng chào ---------- */
  const emblemState = { img: null, plates: [] };
  function drawPlate(g, w, h, kind) {
    const gr = g.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#d2c47e'); gr.addColorStop(1, '#bba95c');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#c8161d'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = '#c8161d';
    for (let x = 22; x < w - 22; x += 14) { g.fillRect(x, 18, 8, 4); g.fillRect(x, h - 22, 8, 4); }
    for (let y = 22; y < h - 22; y += 14) { g.fillRect(18, y, 4, 8); g.fillRect(w - 22, y, 4, 8); }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#c8161d';
    const E = cfg.scene.embassy;
    if (kind === 'top') {
      const es = h * 0.3;
      if (emblemState.img) g.drawImage(emblemState.img, w / 2 - es / 2 * 0.96, 30, es * 0.96, es);
      else {
        g.beginPath(); g.arc(w / 2, 30 + es / 2, es / 2, 0, 7); g.fill();
        g.fillStyle = '#ffde00'; g.beginPath();
        for (let i = 0; i < 10; i++) { const r = (i % 2 ? 0.1 : 0.25) * es, a = -Math.PI / 2 + (i * Math.PI) / 5; g.lineTo(w / 2 + Math.cos(a) * r, 30 + es / 2 + Math.sin(a) * r); }
        g.fill(); g.fillStyle = '#c8161d';
      }
      let y = 30 + es + h * 0.1;
      g.font = `bold ${h * 0.12}px ${FB}`;
      let s = h * 0.12; while (g.measureText(E.nameVi).width > w - 70 && s > 14) { s -= 2; g.font = `bold ${s}px ${FB}`; }
      g.fillText(E.nameVi, w / 2, y);
      y += h * 0.1;
      let fs = h * 0.07; g.font = `bold ${fs}px ${FB}`;
      let lines = wrap(g, E.nameFr, w - 80);
      while (lines.length > 2 && fs > 10) { fs -= 2; g.font = `bold ${fs}px ${FB}`; lines = wrap(g, E.nameFr, w - 80); }
      lines.forEach((l, i) => g.fillText(l, w / 2, y + i * fs * 1.25));
    } else {
      g.font = `bold ${h * 0.2}px ${FB}`; g.fillText('ĐỊA CHỈ / ADRESSE', w / 2, h * 0.28);
      let fs = h * 0.26; g.font = `bold ${fs}px ${FB}`;
      while (g.measureText(E.address).width > w - 70 && fs > 12) { fs -= 2; g.font = `bold ${fs}px ${FB}`; }
      g.fillText(E.address, w / 2, h * 0.64);
    }
  }
  function embassySign(x, z, rotY) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; root.add(g);
    [-1.45, 1.45].forEach(px => cyl(0.05, 0.05, 3.0, M(0xb08d2e, { metalness: 0.5, roughness: 0.4 }), px, 1.5, 0, g, 10));
    [[3.0, 1.7, 2.1, 'top'], [3.0, 0.7, 0.85, 'addr']].forEach(([w, h, y, kind]) => {
      const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * h / w);
      const ctx = c.getContext('2d'); drawPlate(ctx, c.width, c.height, kind);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      emblemState.plates.push({ c, t, kind });
      [0, Math.PI].forEach(r => { const p = flatPlane(t, w, h, 0, y, r ? -0.04 : 0.04, g, r, false); });
      box(w + 0.06, h + 0.06, 0.06, M(0x6f5a1a), 0, y, 0, g);
    });
    rect(x - 1.6, x + 1.6, z - 0.2, z + 0.2);
  }
  embassySign(-7.4, 10.9, 0);
  if (cfg.scene.emblemImage) env.loadImage(cfg.scene.emblemImage, img => {
    emblemState.img = img;
    emblemState.plates.forEach(p => { drawPlate(p.c.getContext('2d'), p.c.width, p.c.height, p.kind); p.t.needsUpdate = true; });
  });

  const archTile = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#b3151f'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#e3b04b'; g.lineWidth = 2.5;
    [44, 33, 22, 11].forEach(r => { g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.stroke(); });
    [[0, 0], [w, 0], [0, h], [w, h]].forEach(([x, y]) => { [40, 28, 16].forEach(r => { g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); }); });
    g.fillStyle = '#e3b04b'; g.beginPath(); g.arc(w / 2, h / 2, 4, 0, 7); g.fill();
  }, [1 / 0.8, 1 / 0.8]);

  function paperFlower(x, y, z, s, c1, c2, parent, rotY = 0) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rotY; g.scale.setScalar(s); parent.add(g);
    [[0.5, c1, 0], [0.4, c2, 0.012], [0.28, c1, 0.024], [0.14, COL.gold, 0.036]].forEach(([r, c, zz]) => {
      const d = new THREE.Mesh(G('CircleGeometry', r, 14), new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, side: THREE.DoubleSide }));
      d.position.z = zz; g.add(d);
    });
  }
  function fan(x, y, z, r, c, parent, rotZ = 0) {
    const d = new THREE.Mesh(G('CircleGeometry', r, 20, 0, Math.PI), new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, side: THREE.DoubleSide }));
    d.position.set(x, y, z); d.rotation.z = rotZ; parent.add(d);
    const e = new THREE.Mesh(G('RingGeometry', r * 0.92, r, 20, 1, 0, Math.PI), new THREE.MeshBasicMaterial({ color: COL.gold, side: THREE.DoubleSide }));
    e.position.set(x, y, z + 0.004); e.rotation.z = rotZ; parent.add(e);
  }
  function coin(x, y, z, parent) {
    const c = cyl(0.2, 0.2, 0.03, M(COL.gold, { metalness: 0.5, roughness: 0.4 }), x, y, z, parent, 20); c.rotation.x = Math.PI / 2;
    box(0.09, 0.09, 0.035, M(0x7a5a10), x, y, z, parent);
  }

  (function gate() {
    const g = new THREE.Group(); g.position.set(0, 0, 10.6); root.add(g);
    const s = new THREE.Shape();
    s.moveTo(-2.6, 0); s.lineTo(-2.6, 1.7); s.absarc(0, 1.7, 2.6, Math.PI, 0, true); s.lineTo(2.6, 0); s.lineTo(1.9, 0); s.lineTo(1.9, 1.7);
    s.absarc(0, 1.7, 1.9, 0, Math.PI, false); s.lineTo(-1.9, 0); s.closePath();
    const eg = new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: false, curveSegments: 40 });
    const arch = new THREE.Mesh(eg, [new THREE.MeshStandardMaterial({ map: archTile, roughness: 0.8 }), M(COL.redDeep)]);
    arch.position.z = -0.15; arch.castShadow = true; g.add(arch);
    [1.9, 2.6].forEach(r => { const t = new THREE.Mesh(G('TorusGeometry', r, 0.04, 6, 64, Math.PI), M(COL.gold, { metalness: 0.4 })); t.position.set(0, 1.7, 0.16); g.add(t); const t2 = t.clone(); t2.position.z = -0.16; g.add(t2); });

    // biển hình quạt phía trên cổng
    const fanTex = canvasTex(1024, 1024, (c, w, h) => {
      const gr = c.createLinearGradient(0, 0, 0, h / 2); gr.addColorStop(0, '#d11f2a'); gr.addColorStop(1, '#8f1119');
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(243,220,163,.35)'; c.lineWidth = 3;
      for (let r = 120; r < 520; r += 48) { c.beginPath(); c.arc(w / 2, h / 2, r, Math.PI, 0); c.stroke(); }
      c.fillStyle = '#f3dca3'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = `italic 700 190px ${FD}`; c.fillText('Xuân Quê hương', w / 2, 270);
      c.font = `bold 120px ${FD}`; c.fillStyle = '#e3b04b'; c.fillText('Đinh Mùi 2027', w / 2, 410);
      c.font = `${34}px ${FB}`; c.fillStyle = '#f3dca3'; c.fillText('Gắn kết cộng đồng, lan tỏa bản sắc Việt Nam', w / 2, 490);
    });
    const fanSign = new THREE.Mesh(G('CircleGeometry', 1.75, 56, Math.PI * 0.1, Math.PI * 0.8), new THREE.MeshBasicMaterial({ map: fanTex, side: THREE.DoubleSide, toneMapped: false }));
    fanSign.position.set(0, 3.7, 0.2); g.add(fanSign);
    const fanBack = fanSign.clone(); fanBack.position.z = -0.2; fanBack.rotation.y = Math.PI; g.add(fanBack);
    const fanEdge = new THREE.Mesh(G('RingGeometry', 1.7, 1.78, 56, 1, Math.PI * 0.1, Math.PI * 0.8), new THREE.MeshBasicMaterial({ color: COL.gold, side: THREE.DoubleSide }));
    fanEdge.position.set(0, 3.7, 0.205); g.add(fanEdge);

    // hoa giấy, quạt, đồng tiền, lồng đèn trên vòm
    [[-2.25, 0.5], [-2.25, 1.3], [-2.2, 2.1], [-1.7, 3.1], [-0.8, 3.75], [2.25, 0.5], [2.25, 1.3], [2.2, 2.1], [1.7, 3.1], [0.8, 3.75]].forEach(([x, y], i) => {
      paperFlower(x, y, 0.2, 0.55 + (i % 3) * 0.1, i % 2 ? 0xd9232d : 0xc41a24, i % 2 ? 0xf0a0a8 : 0xe3b04b, g);
      paperFlower(x, y, -0.2, 0.55 + (i % 3) * 0.1, i % 2 ? 0xd9232d : 0xc41a24, i % 2 ? 0xf0a0a8 : 0xe3b04b, g, Math.PI);
    });
    fan(-2.0, 2.85, 0.19, 0.42, 0xe3b04b, g, 0.6); fan(2.0, 2.85, 0.19, 0.42, 0xe3b04b, g, -0.6);
    fan(-2.45, 1.75, 0.19, 0.36, 0xc41a24, g, Math.PI / 2); fan(2.45, 1.75, 0.19, 0.36, 0xc41a24, g, -Math.PI / 2);
    [[-2.45, 0.95], [2.45, 0.95], [-2.0, 3.3], [2.0, 3.3], [0, 4.6]].forEach(([x, y]) => coin(x, y, 0.2, g));
    [[-2.9, 3.0], [2.9, 3.0]].forEach(([x, y]) => lantern(x, y, 0.25, 1.9, g));
    [[-3.1, 1.6], [3.1, 1.6]].forEach(([x, y]) => lantern(x, y, 0.25, 1.3, g));

    // chữ 2027 có bóng đèn, bên trái chân cổng
    const numTex = canvasTex(512, 256, (c, w, h) => {
      c.fillStyle = '#5a0c12'; c.fillRect(0, 0, w, h);
      c.strokeStyle = '#ffd98a'; c.lineWidth = 6; c.strokeRect(10, 10, w - 20, h - 20);
      c.fillStyle = '#e3b04b'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = `bold 190px ${FD}`; c.fillText('2027', w / 2, h / 2 + 8);
    });
    box(1.7, 0.86, 0.12, M(0x5a0c12), -3.9, 0.55, 0.3, g);
    flatPlane(numTex, 1.6, 0.8, -3.9, 0.55, 0.365, g);
    for (let i = 0; i < 14; i++) { const t = i / 13; sph(0.04, fairyMat, -4.75 + t * 1.7, 0.1, 0.37, g, 6, 4); sph(0.04, fairyMat, -4.75 + t * 1.7, 1.0, 0.37, g, 6, 4); }

    // linh vật dê (Mùi) cầm câu chúc, bên phải chân cổng
    const gt = new THREE.Group(); gt.position.set(3.7, 0, 0.45); g.add(gt);
    const cream = M(0xf6e8cc), red = M(0xc41a24, { roughness: 0.6 });
    const body = mesh(G('CapsuleGeometry', 0.3, 0.55, 6, 12), red, 0, 0.75, 0, gt); body.castShadow = true;
    cyl(0.33, 0.33, 0.04, M(COL.gold), 0, 0.82, 0, gt, 16);
    sph(0.34, cream, 0, 1.58, 0, gt, 16, 12);
    [-0.2, 0.2].forEach((o, i) => {
      const h = mesh(G('ConeGeometry', 0.06, 0.4, 8), M(COL.gold), o, 1.98, 0, gt); h.rotation.z = o > 0 ? -0.5 : 0.5;
      const e = sph(0.1, cream, o * 1.7, 1.6, -0.02, gt, 8, 6); e.scale.set(0.5, 1, 0.5); e.rotation.z = o > 0 ? -0.8 : 0.8;
      sph(0.035, M(COL.dark), o * 0.55, 1.62, 0.31, gt, 6, 6);
      sph(0.05, M(COL.pink), o * 1.2, 1.5, 0.3, gt, 6, 6);
    });
    const beard = mesh(G('ConeGeometry', 0.05, 0.16, 6), M(0xe8dcc2), 0, 1.3, 0.3, gt); beard.rotation.x = Math.PI;
    [-0.18, 0.18].forEach(o => cyl(0.07, 0.07, 0.4, M(0x3a2a22), o, 0.2, 0, gt, 8));
    const arm = cyl(0.06, 0.06, 0.45, red, 0.34, 0.95, 0.12, gt, 8); arm.rotation.z = -0.5; arm.rotation.x = -0.4;
    const scrollTex = canvasTex(128, 256, (c, w, h) => { c.fillStyle = '#d11f2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e3b04b'; c.lineWidth = 6; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = '#f3dca3'; c.textAlign = 'center'; c.font = `bold 34px ${FD}`; ['Chúc', 'mừng', 'năm', 'mới'].forEach((t, i) => c.fillText(t, w / 2, 70 + i * 48)); });
    flatPlane(scrollTex, 0.3, 0.6, 0.55, 1.05, 0.38, gt, 0, true);
    gt.rotation.y = -0.3;

    // hàng rào tre hai bên, treo nón lá và câu đối chữ thoi
    [-1, 1].forEach(sd => {
      const px = [3.3, 4.6, 5.9];
      px.forEach(x => cyl(0.045, 0.05, 2.1, M(COL.bamboo), sd * x, 1.05, 0, g, 6));
      [0.5, 1.5].forEach(y => { const r = cyl(0.035, 0.035, 2.7, M(COL.bamboo), sd * 4.6, y, 0, g, 6); r.rotation.z = Math.PI / 2; });
      [[3.3, 4.6], [4.6, 5.9]].forEach(([a, b]) => [1, -1].forEach(dir => {
        const dd = cyl(0.025, 0.025, 1.9, M(COL.bamboo), sd * (a + b) / 2, 1.0, 0, g, 5); dd.rotation.z = dir * 0.62;
      }));
      [1.75, 1.3].forEach((y, i) => {
        const n = new THREE.Mesh(G('ConeGeometry', 0.3, 0.17, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xf1e3bd, side: THREE.DoubleSide, roughness: 0.9 }));
        n.position.set(sd * (3.3 + i * 0.0), y, 0.12); n.rotation.x = Math.PI / 2; g.add(n);
        const dec = new THREE.Mesh(G('CircleGeometry', 0.08, 12), new THREE.MeshBasicMaterial({ color: i ? 0xf2a5b8 : 0x3d7d48 })); dec.position.set(sd * 3.3, y, 0.215); g.add(dec);
      });
      for (let i = 0; i < 4; i++) {
        const d = box(0.3, 0.3, 0.03, M(0xc41a24), sd * 5.9, 1.9 - i * 0.38, 0.1, g); d.rotation.z = Math.PI / 4;
        sph(0.03, M(COL.gold), sd * 5.9, 1.9 - i * 0.38, 0.13, g, 6, 4);
      }
      rect(sd > 0 ? 2.6 : -6.0, sd > 0 ? 6.0 : -2.6, 10.45, 10.75);
      blossomTree(sd * 3.0, 0.9, sd > 0 ? COL.mai : COL.pink, g, 1.0, false);
    });
    rect(-2.65, -1.85, 10.4, 10.8); rect(1.85, 2.65, 10.4, 10.8);

    // thảm đỏ từ cổng tới bàn đón tiếp
    const carpet = mesh(G('PlaneGeometry', 2.3, 3.4), M(0xa5121f, { roughness: 1 }), 0, 0.02, -2.1, g, false);
    carpet.rotation.x = -Math.PI / 2; carpet.position.z = -2.15;
    [-1.15, 1.15].forEach(x => { const l = mesh(G('PlaneGeometry', 0.07, 3.4), M(COL.gold), x, 0.022, -2.15, g, false); l.rotation.x = -Math.PI / 2; });
  })();

  /* ---------- Cờ đuôi nheo ---------- */
  (function bunting() {
    const tri = new THREE.BufferGeometry();
    tri.setAttribute('position', new THREE.Float32BufferAttribute([-0.1, 0, 0, 0.1, 0, 0, 0, -0.22, 0], 3));
    tri.computeVertexNormals();
    const strings = [[-2.9, 4.1, -11.9, 3.3], [2.9, 4.1, 11.9, 3.3]];
    const per = 18;
    const inst = new THREE.InstancedMesh(tri, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }), strings.length * per);
    const d = new THREE.Object3D(); const cols = [0xd9232d, 0xf0c332, 0x2f9a4a, 0xf2a5b8];
    let k = 0;
    strings.forEach(([ax, ay, bx, by]) => {
      const pts = [];
      for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push(new THREE.Vector3(ax + (bx - ax) * t, ay + (by - ay) * t - Math.sin(t * Math.PI) * 0.45, 10.75)); }
      root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x20120f })));
      for (let i = 0; i < per; i++) {
        const t = (i + 0.5) / per;
        d.position.set(ax + (bx - ax) * t, ay + (by - ay) * t - Math.sin(t * Math.PI) * 0.45, 10.75);
        d.rotation.set(0, 0, 0); d.scale.setScalar(1); d.updateMatrix();
        inst.setMatrixAt(k, d.matrix); inst.setColorAt(k, new THREE.Color(cols[i % 4])); k++;
      }
    });
    root.add(inst);
  })();

  /* ---------- Khách tham dự, chân chạm đất ---------- */
  const people = [];
  const addP = (x, z, mode = 'stand', o = {}) => people.push({ x, z, mode, ...o });
  for (let gx = -3.4; gx <= 3.4; gx += 0.82) for (let gz = -6.0; gz <= -2.3; gz += 0.82)
    if (rnd() > 0.14) addP(gx + (rnd() - 0.5) * 0.4, gz + (rnd() - 0.5) * 0.4);
  cocktailPos.forEach(([tx, tz]) => {
    const n = 3 + Math.floor(rnd() * 2);
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2; addP(tx + Math.cos(a) * 0.95, tz + Math.sin(a) * 0.95); }
  });
  [7.0, 10.5].forEach(cx => [-6.8, -4.2, -1.6].forEach(rz => {
    addP(cx - 0.6, rz + 0.95); addP(cx + 0.55, rz + 0.95); addP(cx + (rnd() - 0.5) * 0.8, rz - 0.85, 'stand', { staff: true });
  }));
  [[7.0, -3.4], [8.6, -3.2], [10.0, -3.4], [8.4, -0.9]].forEach(([x, z]) => addP(x, z));
  [[-8.0, 0.1], [-8.1, 1.2], [-8.0, 4.4], [-8.1, 5.8], [-7.6, 2.8]].forEach(([x, z]) => addP(x, z));
  seated.forEach(([x, z]) => addP(x, z, 'chair'));
  [-2.35, -1.45, 0.55, 1.45].forEach(o => addP(8.2 + o, 3.95, 'chair'));
  addP(-1.6, 6.0); addP(1.8, 5.7); addP(-0.6, 8.9); addP(0.9, 9.3);
  addP(-3.6, 8.4); addP(-4.5, 8.6);
  addP(-0.5, 6.7, 'stand', { staff: true }); addP(0.6, 6.7, 'stand', { staff: true });

  const bodyGeo = G('CapsuleGeometry', 0.2, 0.85, 4, 8);
  const headGeo = G('SphereGeometry', 0.15, 10, 8);
  const bodies = new THREE.InstancedMesh(bodyGeo, new THREE.MeshStandardMaterial({ roughness: 0.9 }), people.length);
  const heads = new THREE.InstancedMesh(headGeo, new THREE.MeshStandardMaterial({ roughness: 0.8 }), people.length);
  bodies.castShadow = heads.castShadow = true;
  const coats = [0x2d3a2f, 0x1c1c22, 0xd8d1c4, 0x7a1f2a, 0x3b4a7a, 0xf1efe8, 0x8a8f98, 0xe0a3b5, 0xa8141f];
  const skins = [0xf0c8a0, 0xd9a679, 0xb9855a, 0x8d5a3c];
  const dm = new THREE.Object3D();
  people.forEach((p, i) => {
    const s = 0.93 + rnd() * 0.17;
    if (p.mode === 'chair') {
      dm.position.set(p.x, 0.5 + 0.31, p.z); dm.scale.set(1, 0.62, 1);
    } else {
      dm.position.set(p.x, 0.625 * s, p.z); dm.scale.set(1, s, 1);
    }
    dm.rotation.set(0, 0, 0); dm.updateMatrix(); bodies.setMatrixAt(i, dm.matrix);
    bodies.setColorAt(i, new THREE.Color(p.staff ? COL.red : coats[Math.floor(rnd() * coats.length)]));
    dm.position.set(p.x, p.mode === 'chair' ? 0.5 + 0.62 + 0.14 : 1.37 * s, p.z); dm.scale.set(1, 1, 1); dm.updateMatrix();
    heads.setMatrixAt(i, dm.matrix);
    heads.setColorAt(i, new THREE.Color(skins[Math.floor(rnd() * skins.length)]));
  });
  root.add(bodies, heads);

  flushLanterns();

  /* Gộp các khối tĩnh cùng vật liệu thành một lưới để máy yếu vẫn mượt */
  (function mergeStatic() {
    root.updateMatrixWorld(true);
    const cached = new Set(Object.values(matCache));
    const groups = new Map(); const remove = [];
    root.traverse(o => {
      if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || !cached.has(o.material)) return;
      let geo = o.geometry.clone();
      if (geo.index) geo = geo.toNonIndexed();
      geo.applyMatrix4(o.matrixWorld);
      Object.keys(geo.attributes).forEach(n => { if (!['position', 'normal', 'uv'].includes(n)) geo.deleteAttribute(n); });
      if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
      const key = o.material.uuid + (o.castShadow ? 'c' : 'n');
      if (!groups.has(key)) groups.set(key, { mat: o.material, cast: o.castShadow, list: [] });
      groups.get(key).list.push(geo);
      remove.push(o);
    });
    remove.forEach(o => o.parent.remove(o));
    groups.forEach(({ mat, cast, list }) => {
      const m = new THREE.Mesh(mergeGeometries(list, false), mat);
      m.castShadow = cast; m.receiveShadow = true; m.matrixAutoUpdate = false;
      root.add(m);
    });
  })();

  return {
    root, obstacles, beamMats, lanternMat, fairyMat, bldMat, backdropMat, steamPuffs, useLed
  };
}
