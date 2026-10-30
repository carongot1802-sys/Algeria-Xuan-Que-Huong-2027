import { CONFIG as C } from './config.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, attrs = {}, html = '') => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (html) e.innerHTML = html;
  return e;
};

const ROUTES = ['/', '/noi-dung', '/proposal', '/moodboard', '/khong-gian'];
let current = null;
const inited = new Set();
let space = null; // { api, tourStop }
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
  if (route === '/khong-gian') {
    if (space) space.api.start();
    else initSpace();
  }
}

function initOnce(key, fn) {
  if (inited.has(key)) return;
  inited.add(key);
  fn();
}

/* ================= Trang chung ================= */
function initText() {
  document.title = `Kế hoạch truyền thông ${C.eventName}`;
  $('#heroOrg').textContent = C.org;
  $('#heroEvent').textContent = C.eventSub;
  $('#siteFoot').textContent = `${C.org}. Kế hoạch truyền thông ${C.eventName}. ${C.team}.`;
}

function initHero() {
  const hero = $('#hero');
  hero.style.setProperty('--hero-fit', C.hero.fit || 'cover');
  const img = new Image();
  img.onload = () => {
    hero.style.setProperty('--hero-img', `url("${C.hero.image}")`);
    hero.classList.add('has-image');
  };
  img.src = C.hero.image;
}

async function fileExists(url) {
  if (!/^https?:$/.test(location.protocol)) return true; // chạy file trực tiếp thì không kiểm tra được
  try { return (await fetch(url, { method: 'HEAD' })).ok; } catch { return false; }
}

async function initDocs() {
  const list = $('#docList');
  for (const d of C.documents) {
    const li = el('li');
    const ok = await fileExists(d.file);
    if (ok) {
      li.innerHTML = `<a href="${d.file}" download><span><b>${d.label}</b><small>${d.note || ''}</small></span><span class="tag">Tải về</span></a>`;
    } else {
      li.innerHTML = `<span class="off"><span><b>${d.label}</b><small>Chưa có file, hãy tải lên ${d.file}</small></span><span class="tag">Chưa tải lên</span></span>`;
    }
    list.appendChild(li);
  }
}

/* ================= Proposal ================= */
function initProposal() {
  const host = $('#slideHost');
  const { canvaEmbedUrl, slideImages } = C.proposal;

  if (canvaEmbedUrl) {
    const f = el('iframe', {
      src: canvaEmbedUrl, title: 'Slide proposal', allowfullscreen: '', loading: 'lazy',
      allow: 'fullscreen'
    });
    host.appendChild(f);
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
      img.src = slideImages[i];
      img.alt = `Slide ${i + 1}`;
      $('#sCount', ctrl).textContent = `${i + 1} / ${slideImages.length}`;
      $('#sBar', ctrl).style.width = `${((i + 1) / slideImages.length) * 100}%`;
      $('#sPrev', ctrl).disabled = i === 0;
      $('#sNext', ctrl).textContent = i === slideImages.length - 1 ? 'Sang Moodboard' : 'Sau';
    };
    const next = () => { if (i < slideImages.length - 1) { i++; render(); } else location.hash = '#/moodboard'; };
    const prev = () => { if (i > 0) { i--; render(); } };
    $('#sPrev', ctrl).onclick = prev;
    $('#sNext', ctrl).onclick = next;
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
    host.innerHTML = `<div class="slide-empty"><b>Slide proposal sẽ hiện ở đây</b><span>Dán link nhúng Canva vào canvaEmbedUrl trong js/config.js, hoặc bỏ ảnh slide vào assets/slides rồi liệt kê trong slideImages.</span></div>`;
  }

  $('#slideFull').onclick = () => {
    if (host.requestFullscreen) host.requestFullscreen();
  };
}

document.addEventListener('keydown', e => {
  if (current === '/proposal' && slides) {
    if (e.key === 'ArrowRight') slides.next();
    if (e.key === 'ArrowLeft') slides.prev();
  }
});

/* ================= Moodboard ================= */
function lightbox(src, cap) {
  const d = $('#lightbox');
  $('#lightboxImg').src = src;
  $('#lightboxImg').alt = cap || '';
  $('#lightboxCap').textContent = cap || '';
  d.showModal();
}

function imageFigure(item, withCaption = true) {
  const fig = el('figure');
  const img = el('img', { src: item.src, alt: item.caption || '', loading: 'lazy' });
  img.addEventListener('click', () => lightbox(item.src, item.caption));
  fig.appendChild(img);
  if (withCaption && item.caption) fig.appendChild(el('figcaption', { class: 'cap' }, item.caption));
  return fig;
}

function placeholder(title, hint) {
  return el('div', { class: 'ph' }, `<b>${title}</b><span>${hint}</span>`);
}

function initMoodboard() {
  const m = C.moodboard;

  const grid = $('#moodGrid');
  if (m.images.length) m.images.forEach(it => grid.appendChild(imageFigure(it)));
  else for (let i = 1; i <= 6; i++) grid.appendChild(placeholder('Ảnh moodboard', `Bỏ ảnh vào assets/moodboard rồi liệt kê trong config.js (ô ${i})`));

  const kv = $('#keyVisual');
  if (m.keyVisual.image) {
    kv.appendChild(imageFigure({ src: m.keyVisual.image, caption: m.keyVisual.caption }).firstChild);
    kv.appendChild(el('figcaption', { class: 'cap' }, m.keyVisual.caption));
  } else {
    kv.appendChild(placeholder('Key visual', 'Điền đường dẫn ảnh vào moodboard.keyVisual.image trong config.js'));
  }

  const pal = $('#palette');
  m.palette.forEach(p => {
    pal.appendChild(el('div', { class: 'swatch' }, `<i style="background:${p.hex}"></i><div><b>${p.name} ${p.hex}</b><span>${p.role}</span></div>`));
  });

  const t = m.typography;
  $('#typeSpec').innerHTML = `
    <p class="big" style="font-family:'${t.display}',serif">${t.sample}</p>
    <p>Chữ tiêu đề ${t.display}. Chữ nội dung ${t.body}.</p>`;

  const els = $('#elementGrid');
  if (m.elements.length) m.elements.forEach(it => els.appendChild(imageFigure(it)));
  else for (let i = 1; i <= 6; i++) els.appendChild(placeholder('Element', 'Lồng đèn, hoa đào, hoa mai, họa tiết'));
}

$('#lightboxClose').onclick = () => $('#lightbox').close();
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') e.currentTarget.close(); });

/* ================= Không gian 3D ================= */
const VIEW_BUTTONS = [
  ['overview', 'Toàn cảnh'],
  ['gate', 'Từ cổng vào'],
  ['audience', 'Góc khán giả'],
  ['stage', 'Từ sân khấu'],
  ['top', 'Nhìn từ trên cao']
];

async function initSpace() {
  const loading = $('#spaceLoading');
  let mod;
  try {
    mod = await import('./scene3d.js');
  } catch (err) {
    console.error(err);
    loading.textContent = 'Không tải được thư viện 3D. Hãy kiểm tra kết nối mạng rồi tải lại trang.';
    return;
  }

  const zones = C.zones;
  const legend = $('#legend');
  const legendList = $('#legendList');
  const panel = $('#panel');
  let activeId = null;
  let tourTimer = null;
  let tourIdx = -1;
  const isMobile = () => matchMedia('(max-width: 760px)').matches;

  let api;
  try {
    api = mod.createScene($('#spaceCanvas'), {
      zones,
      hotspotLayer: $('#hotspots'),
      onSelect: id => handleSelect(id)
    });
  } catch (err) {
    console.error(err);
    loading.textContent = 'Thiết bị này chưa hỗ trợ dựng 3D (WebGL). Hãy thử trình duyệt khác.';
    return;
  }

  function stopTour() {
    if (tourTimer) { clearInterval(tourTimer); tourTimer = null; }
    $('#tourBtn').classList.remove('on');
    $('#tourBtn').textContent = 'Tham quan tự động';
  }
  function tourStep() {
    tourIdx = (tourIdx + 1) % zones.length;
    api.selectZone(zones[tourIdx].id);
  }
  function startTour() {
    stopTour();
    legend.classList.add('closed');
    tourIdx = activeId ? zones.findIndex(z => z.id === activeId) : -1;
    tourStep();
    tourTimer = setInterval(tourStep, 6500);
    $('#tourBtn').classList.add('on');
    $('#tourBtn').textContent = 'Dừng tham quan';
  }

  function handleSelect(id) {
    activeId = id;
    $$('#legendList button').forEach(b => b.classList.toggle('on', b.dataset.zone === id));
    if (!id) { panel.hidden = true; return; }
    const z = zones.find(x => x.id === id);
    $('#panelNo').textContent = `Khu ${z.no} trên ${zones.length}`;
    $('#panelName').textContent = z.name;
    $('#panelDesc').textContent = z.desc;
    $('#panelPlan').textContent = z.plan;
    const ref = $('#panelRef');
    if (z.ref) {
      const img = $('#panelImg');
      img.onerror = () => { ref.hidden = true; };
      img.src = z.ref;
      img.alt = `Ảnh tham khảo ${z.name}`;
      ref.hidden = false;
    } else ref.hidden = true;
    panel.hidden = false;
    panel.scrollTop = 0;
    $('#spaceHint').classList.add('gone');
    if (isMobile()) legend.classList.add('closed');
  }

  zones.forEach(z => {
    const li = el('li');
    const b = el('button', { type: 'button', 'data-zone': z.id }, `<i>${z.no}</i><span>${z.name}</span>`);
    b.onclick = () => { stopTour(); api.selectZone(z.id); };
    li.appendChild(b);
    legendList.appendChild(li);
  });
  $('#legendToggle').onclick = () => {
    legend.classList.toggle('closed');
    $('#legendToggle').setAttribute('aria-expanded', String(!legend.classList.contains('closed')));
  };
  if (isMobile()) legend.classList.add('closed');

  const vb = $('#viewButtons');
  VIEW_BUTTONS.forEach(([key, label], i) => {
    const b = el('button', { type: 'button', 'data-view': key }, label);
    if (i === 0) b.classList.add('on');
    b.onclick = () => {
      stopTour();
      api.selectZone(null, { fly: false });
      api.setView(key);
      $$('#viewButtons button').forEach(x => x.classList.toggle('on', x === b));
    };
    vb.appendChild(b);
  });

  $$('#timeSeg button').forEach(b => {
    b.onclick = () => {
      api.setTime(b.dataset.time);
      $$('#timeSeg button').forEach(x => x.classList.toggle('on', x === b));
    };
  });

  $('#tourBtn').onclick = () => (tourTimer ? stopTour() : startTour());
  $('#panelClose').onclick = () => { stopTour(); api.selectZone(null, { fly: false }); };
  $('#panelPrev').onclick = () => {
    stopTour();
    const i = zones.findIndex(z => z.id === activeId);
    api.selectZone(zones[(i - 1 + zones.length) % zones.length].id);
  };
  $('#panelNext').onclick = () => {
    stopTour();
    const i = zones.findIndex(z => z.id === activeId);
    api.selectZone(zones[(i + 1) % zones.length].id);
  };
  $('#spaceCanvas').addEventListener('pointerdown', () => {
    stopTour();
    $$('#viewButtons button').forEach(x => x.classList.remove('on'));
  });

  space = { api, tourStop: stopTour };
  loading.classList.add('gone');
  if (current === '/khong-gian') api.start();
  setTimeout(() => $('#spaceHint').classList.add('gone'), 9000);
}

/* ================= Khởi động ================= */
initText();
initHero();
initDocs();
window.addEventListener('hashchange', () => show(routeFromHash()));
show(routeFromHash());
