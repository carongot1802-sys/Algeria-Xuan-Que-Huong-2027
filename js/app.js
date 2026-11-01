import { loadConfig, applyTheme } from './content.js';

const C = await loadConfig();
applyTheme(C);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, attrs = {}, html = '') => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (html) e.innerHTML = html;
  return e;
};
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ROUTES = ['/', '/noi-dung', '/proposal', '/moodboard', '/khong-gian', '/cam-on'];
let current = null;
const inited = new Set();
let space = null;
let slides = null;

/* ================= Định tuyến ================= */
function routeFromHash() {
  const h = location.hash.replace(/^#/, '') || '/';
  return ROUTES.includes(h) ? h : '/';
}

function show(route) {
  if (route === current) return;
  const prev = current;
  current = route;
  $$('.view').forEach(v => v.classList.toggle('is-active', v.dataset.route === route));
  const idx = ROUTES.indexOf(route);
  $$('#stepper a').forEach(a => {
    const s = Number(a.dataset.step);
    a.classList.toggle('active', s === idx);
    a.classList.toggle('done', s < idx);
    if (s === idx) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const active = $('#stepper a.active');
  if (active) active.scrollIntoView({ inline: 'center', block: 'nearest' });
  window.scrollTo(0, 0);

  if (prev === '/khong-gian' && space) { space.api.stop(); space.tourStop(); }
  if (route === '/proposal') initOnce('proposal', initProposal);
  if (route === '/moodboard') initOnce('moodboard', initMoodboard);
  if (route === '/khong-gian') { if (space) space.api.start(); else initSpace(); }
}
function initOnce(key, fn) { if (inited.has(key)) return; inited.add(key); fn(); }

/* ================= Chữ chung ================= */
function initText() {
  document.title = `Kế hoạch truyền thông ${C.eventName}`;
  $('#heroOrg').textContent = C.org;
  $('#heroEvent').textContent = C.eventSub;
  $('#heroBtn').textContent = C.hero.button || 'Bắt đầu xem';
  const ct = C.content;
  $('#ctTitle').textContent = ct.title;
  $('#ctLead').textContent = ct.lead;
  $('#docsTitle').textContent = ct.docsTitle;
  $('#docsDesc').textContent = ct.docsDesc;
  $('#propTitle').textContent = ct.proposalTitle;
  $('#propDesc').textContent = ct.proposalDesc;
  $('#propGo').textContent = ct.proposalButton;
  $('#pTitle').textContent = C.proposal.title;
  $('#pLead').textContent = C.proposal.lead;
  $('#mTitle').textContent = C.moodboard.title;
  $('#mLead').textContent = C.moodboard.lead;
  $('#thOrg').textContent = C.org;
  $('#thTitle').textContent = C.thanks.title;
  $('#thMsg').textContent = C.thanks.message;
  $('#thSign').textContent = C.thanks.sign;
  $('#siteFoot').textContent = C.footer;
}

function initHero() {
  const hero = $('#hero');
  hero.style.setProperty('--hero-fit', C.hero.fit || 'cover');
  if (!C.hero.image) return;
  const img = new Image();
  img.onload = () => {
    hero.style.setProperty('--hero-img', `url("${C.hero.image}")`);
    hero.classList.add('has-image');
  };
  img.src = C.hero.image;
}

async function fileExists(url) {
  if (!/^https?:$/.test(location.protocol)) return true;
  try { return (await fetch(url, { method: 'HEAD' })).ok; } catch { return false; }
}

async function initDocs() {
  const list = $('#docList');
  for (const d of C.documents) {
    const li = el('li');
    const ok = d.file && await fileExists(d.file);
    li.innerHTML = ok
      ? `<a href="${esc(d.file)}" download><span><b>${esc(d.label)}</b><small>${esc(d.note)}</small></span><span class="tag">Tải về</span></a>`
      : `<span class="off"><span><b>${esc(d.label)}</b><small>Chưa có file, hãy tải lên trong trang quản trị</small></span><span class="tag">Chưa tải lên</span></span>`;
    list.appendChild(li);
  }
}

/* ================= Proposal ================= */
function initProposal() {
  const host = $('#slideHost');
  const { canvaEmbedUrl, slideImages } = C.proposal;
  if (canvaEmbedUrl) {
    host.appendChild(el('iframe', { src: canvaEmbedUrl, title: 'Slide proposal', allowfullscreen: '', loading: 'lazy', allow: 'fullscreen' }));
  } else if (slideImages.length) {
    let i = 0;
    const img = el('img', { class: 'slide-img', alt: '' });
    const ctrl = el('div', { class: 'slide-ctrl' }, `
      <button type="button" id="sPrev">Trước</button>
      <div class="slide-bar"><i id="sBar"></i></div>
      <span id="sCount"></span>
      <button type="button" id="sNext">Sau</button>`);
    host.append(img, ctrl);
    const render = () => {
      img.src = slideImages[i]; img.alt = `Slide ${i + 1}`;
      $('#sCount', ctrl).textContent = `${i + 1} / ${slideImages.length}`;
      $('#sBar', ctrl).style.width = `${((i + 1) / slideImages.length) * 100}%`;
      $('#sPrev', ctrl).disabled = i === 0;
      $('#sNext', ctrl).textContent = i === slideImages.length - 1 ? 'Sang Moodboard' : 'Sau';
    };
    const next = () => { if (i < slideImages.length - 1) { i++; render(); } else location.hash = '#/moodboard'; };
    const prev = () => { if (i > 0) { i--; render(); } };
    $('#sPrev', ctrl).onclick = prev; $('#sNext', ctrl).onclick = next;
    slides = { next, prev };
    let x0 = null;
    host.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    host.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    });
    render();
  } else {
    host.innerHTML = `<div class="slide-empty"><b>Slide proposal sẽ hiện ở đây</b><span>Dán link nhúng Canva hoặc tải ảnh slide lên trong trang quản trị, mục Proposal.</span></div>`;
  }
  $('#slideFull').onclick = () => { if (host.requestFullscreen) host.requestFullscreen(); };
}
document.addEventListener('keydown', e => {
  if (current === '/proposal' && slides) {
    if (e.key === 'ArrowRight') slides.next();
    if (e.key === 'ArrowLeft') slides.prev();
  }
});

/* ================= Moodboard ================= */
const viewer = { items: [], i: 0 };
function showViewer() {
  const it = viewer.items[viewer.i];
  $('#lightboxImg').src = it.src; $('#lightboxImg').alt = it.caption || '';
  $('#lightboxCap').textContent = it.caption || '';
  $('#lbCount').textContent = viewer.items.length > 1 ? `${viewer.i + 1} / ${viewer.items.length}` : '';
  $('#lbPrev').hidden = $('#lbNext').hidden = viewer.items.length < 2;
}
function openViewer(items, i = 0) {
  viewer.items = items; viewer.i = i; showViewer();
  const d = $('#lightbox'); if (!d.open) d.showModal();
}
const moveViewer = d => { viewer.i = (viewer.i + d + viewer.items.length) % viewer.items.length; showViewer(); };
function imageFigure(item, group) {
  const fig = el('figure');
  const img = el('img', { src: item.src, alt: item.caption || '', loading: 'lazy', tabindex: '0' });
  const open = () => openViewer(group, group.indexOf(item));
  img.addEventListener('click', open);
  img.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  fig.appendChild(img);
  if (item.caption) fig.appendChild(el('figcaption', { class: 'cap' }, esc(item.caption)));
  return fig;
}
const placeholder = (title, hint) => el('div', { class: 'ph' }, `<b>${esc(title)}</b><span>${esc(hint)}</span>`);

function fillGallery(host, items, hintTitle, hintText, n = 4) {
  const group = items.filter(it => it.src);
  if (group.length) group.forEach(it => host.appendChild(imageFigure(it, group)));
  else for (let i = 0; i < n; i++) host.appendChild(placeholder(hintTitle, hintText));
}

function initMoodboard() {
  const m = C.moodboard;
  fillGallery($('#moodGrid'), m.images, 'Ảnh moodboard', 'Thêm ảnh trong trang quản trị, mục Moodboard', 6);

  const kv = $('#keyVisual');
  if (m.keyVisual.image) {
    const group = [{ src: m.keyVisual.image, caption: m.keyVisual.caption }];
    kv.append(...imageFigure(group[0], group).childNodes);
  } else kv.appendChild(placeholder('Key visual', 'Thêm ảnh key visual trong trang quản trị'));

  const pal = $('#palette');
  m.palette.forEach(p => pal.appendChild(el('div', { class: 'swatch' },
    `<i style="background:${esc(p.hex)}"></i><div><b>${esc(p.name)} ${esc(p.hex)}</b><span>${esc(p.role)}</span></div>`)));

  fillGallery($('#fontTitle'), m.fonts.title, 'Font chữ tiêu đề', 'Tải ảnh thiết kế font trong trang quản trị, ghi tên font ở chú thích', 2);
  fillGallery($('#fontBody'), m.fonts.body, 'Font chữ nội dung', 'Tải ảnh thiết kế font trong trang quản trị, ghi tên font ở chú thích', 2);
  fillGallery($('#elementGrid'), m.elements, 'Element', 'Lồng đèn, hoa đào, hoa mai, họa tiết', 6);
}
$('#lightboxClose').onclick = () => $('#lightbox').close();
$('#lbPrev').onclick = () => moveViewer(-1);
$('#lbNext').onclick = () => moveViewer(1);
$('#lightbox').addEventListener('keydown', e => { if (e.key === 'ArrowLeft') moveViewer(-1); if (e.key === 'ArrowRight') moveViewer(1); });
(() => { let x0 = null; const lb = $('#lightbox');
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50 && viewer.items.length > 1) moveViewer(dx < 0 ? 1 : -1); }); })();
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') e.currentTarget.close(); });

/* ================= Không gian 3D ================= */
const VIEW_BUTTONS = [['overview', 'Toàn cảnh'], ['gate', 'Từ cổng vào'], ['audience', 'Góc khán giả'], ['stage', 'Từ sân khấu'], ['top', 'Nhìn từ trên cao']];

async function initSpace() {
  const loading = $('#spaceLoading');
  let mod;
  try { mod = await import('./scene3d.js'); }
  catch (err) {
    console.error(err);
    loading.textContent = 'Không tải được thư viện 3D. Hãy kiểm tra kết nối mạng rồi tải lại trang.';
    return;
  }
  try {
    await Promise.race([
      Promise.all([
        ...C.theme._families.map(f => document.fonts.load(`700 40px "${f}"`, 'Xuân Quê hương Đinh Mùi ĐẠI SỨ QUÁN')),
        document.fonts.load('700 40px "Be Vietnam Pro"', 'ĐẠI SỨ QUÁN VIỆT NAM ALGÉRIE')
      ]),
      new Promise(r => setTimeout(r, 2500))
    ]);
  } catch (e) { /* bỏ qua, dùng font dự phòng */ }

  const zones = C.zones;
  const legend = $('#legend'), legendList = $('#legendList'), panel = $('#panel');
  let activeId = null, tourTimer = null, tourIdx = -1;
  const isMobile = () => matchMedia('(max-width: 760px)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  let api;
  try {
    api = mod.createScene($('#spaceCanvas'), {
      cfg: C, zones, hotspotLayer: $('#hotspots'),
      onSelect: id => handleSelect(id),
      onMode: m => handleMode(m)
    });
  } catch (err) {
    console.error(err);
    loading.textContent = 'Thiết bị này chưa hỗ trợ dựng 3D (WebGL). Hãy thử trình duyệt khác.';
    return;
  }

  function stopTour() {
    if (tourTimer) { clearInterval(tourTimer); tourTimer = null; }
    $('#tourBtn').classList.remove('on'); $('#tourBtn').textContent = 'Tham quan tự động';
  }
  function tourStep() { tourIdx = (tourIdx + 1) % zones.length; api.selectZone(zones[tourIdx].id); }
  function startTour() {
    stopTour(); legend.classList.add('closed');
    tourIdx = activeId ? zones.findIndex(z => z.id === activeId) : -1;
    tourStep(); tourTimer = setInterval(tourStep, 6500);
    $('#tourBtn').classList.add('on'); $('#tourBtn').textContent = 'Dừng tham quan';
  }

  function handleMode(m) {
    $$('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
    $('#joy').hidden = !(m === 'walk' && coarse);
    $('#spaceHint').textContent = m === 'walk'
      ? 'Kéo để nhìn quanh, dùng W A S D hoặc phím mũi tên để đi, giữ Shift để đi nhanh, bấm vào sàn để đi tới đó.'
      : 'Kéo để xoay, cuộn để phóng to, giữ chuột phải hoặc dùng phím W A S D để di chuyển, nhấp đúp vào sàn để bay tới đó.';
    if (m === 'walk') $('#spaceHint').classList.remove('gone');
  }

  function handleSelect(id) {
    activeId = id;
    const isFood = !!id && id.startsWith('food:');
    $$('#legendList button').forEach(b => b.classList.toggle('on', b.dataset.zone === (isFood ? 'buffet' : id)));
    if (!id) { panel.hidden = true; return; }
    const food = $('#panelFood');
    if (isFood) {
      const f = C.scene.foods[Number(id.slice(5))] || {};
      const bz = zones.find(z => z.id === 'buffet');
      $('#panelNo').textContent = `Khu ${bz ? bz.no : ''}, buffet món Việt`;
      $('#panelName').textContent = f.name || 'Món ăn';
      $('#panelDesc').textContent = f.note || 'Xin mời!';
      $('#panelPlan').hidden = true;
      if (f.image) { food.src = f.image; food.alt = f.name || ''; food.hidden = false; } else food.hidden = true;
    } else {
      const z = zones.find(x => x.id === id);
      $('#panelNo').textContent = `Khu ${z.no} trên ${zones.length}`;
      $('#panelName').textContent = z.name;
      $('#panelDesc').textContent = z.desc;
      $('#panelPlan').textContent = z.plan; $('#panelPlan').hidden = !z.plan;
      food.hidden = true;
    }
    panel.hidden = false; panel.scrollTop = 0;
    $('#spaceHint').classList.add('gone');
    if (isMobile()) legend.classList.add('closed');
  }

  zones.forEach(z => {
    const li = el('li');
    const b = el('button', { type: 'button', 'data-zone': z.id }, `<i>${z.no}</i><span>${esc(z.name)}</span>`);
    b.onclick = () => { stopTour(); api.selectZone(z.id); };
    li.appendChild(b); legendList.appendChild(li);
  });
  $('#legendToggle').onclick = () => {
    legend.classList.toggle('closed');
    $('#legendToggle').setAttribute('aria-expanded', String(!legend.classList.contains('closed')));
  };
  if (isMobile()) legend.classList.add('closed');

  const vb = $('#viewButtons');
  VIEW_BUTTONS.forEach(([key, label], i) => {
    const b = el('button', { type: 'button' }, label);
    if (i === 0) b.classList.add('on');
    b.onclick = () => {
      stopTour(); api.selectZone(null, { fly: false }); api.setView(key);
      $$('#viewButtons button').forEach(x => x.classList.toggle('on', x === b));
    };
    vb.appendChild(b);
  });

  $$('#timeSeg button').forEach(b => b.onclick = () => {
    api.setTime(b.dataset.time);
    $$('#timeSeg button').forEach(x => x.classList.toggle('on', x === b));
  });
  $$('#modeSeg button').forEach(b => b.onclick = () => { stopTour(); api.setMode(b.dataset.mode); });
  $('#confettiBtn').onclick = () => api.confetti();
  $('#tourBtn').onclick = () => (tourTimer ? stopTour() : startTour());
  $('#panelClose').onclick = () => { stopTour(); api.selectZone(null, { fly: false }); };
  const step = d => {
    stopTour();
    const cur = activeId && activeId.startsWith('food:') ? 'buffet' : activeId;
    const i = zones.findIndex(z => z.id === cur);
    api.selectZone(zones[(i + d + zones.length) % zones.length].id);
  };
  $('#panelPrev').onclick = () => step(-1);
  $('#panelNext').onclick = () => step(1);
  $('#spaceCanvas').addEventListener('pointerdown', () => {
    stopTour();
    $$('#viewButtons button').forEach(x => x.classList.remove('on'));
  });

  /* Cần điều khiển cho điện thoại */
  const joy = $('#joy'), knob = $('#joyKnob');
  let jid = null;
  const jmove = e => {
    const r = joy.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const max = r.width / 2 - 8, len = Math.hypot(dx, dy);
    if (len > max) { dx = dx / len * max; dy = dy / len * max; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    api.setMove(dx / max, -dy / max);
  };
  joy.addEventListener('pointerdown', e => { e.stopPropagation(); jid = e.pointerId; joy.setPointerCapture(jid); jmove(e); });
  joy.addEventListener('pointermove', e => { if (e.pointerId === jid) jmove(e); });
  const jend = e => { if (e.pointerId !== jid) return; jid = null; knob.style.transform = ''; api.setMove(0, 0); };
  joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);

  $('#endBtn').addEventListener('click', () => { stopTour(); });

  space = { api, tourStop: stopTour };
  loading.classList.add('gone');
  if (current === '/khong-gian') api.start();
  setTimeout(() => $('#spaceHint').classList.add('gone'), 10000);
}

/* ================= Khởi động ================= */
initText();
initHero();
initDocs();
window.addEventListener('hashchange', () => show(routeFromHash()));
show(routeFromHash());
