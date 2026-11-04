import { loadConfig, applyTheme } from './content.js?v=9';

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
const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
function initProposal() {
  try { buildProposal(); } catch (err) {
    console.error(err);
    $('#propBody').innerHTML = `<p class="pintro">Không dựng được nội dung Proposal (${esc(err.message)}). Hãy tải lại trang bằng Ctrl+F5. Nếu vẫn lỗi, kiểm tra các file trong thư mục js đã được cập nhật đủ.</p>`;
  }
}
function buildProposal() {
  const P = C.proposal, O = P.overview, T = P.timeline;
  $('#pTitle').textContent = P.title;
  $('#pLead').textContent = P.lead;
  const lines = a => (a && a.length) ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="tl-none">Không có hoạt động</p>';
  const sec = (id, no, title, body) =>
    `<section class="psec rv" id="${id}"><header class="psec-h"><span class="pno">${no}</span><h3>${esc(title)}</h3></header>${body}</section>`;
  const part = (n, title) => `<div class="ppart rv"><span>Phần ${n}</span><h3>${esc(title)}</h3></div>`;

  const info = `<dl class="ledger">${O.info.map(r => `<div class="rv"><dt>${esc(r.k)}</dt><dd>${esc(r.v)}</dd></div>`).join('')}</dl>`;
  const goals = `<p class="purpose rv"><b>Mục đích</b>${esc(O.purpose)}</p>
    <div class="trio">${O.goals.map((g, i) => `<article class="gcard rv" style="--i:${i}"><span class="gno">${i + 1}</span><h4>${esc(g.k)}</h4><p>${esc(g.v)}</p></article>`).join('')}</div>`;
  const aud = `<p class="pintro rv">${esc(O.audienceIntro)}</p>
    <div class="audgrid">${O.audiences.map((x, i) => `<article class="acard rv" style="--i:${i % 2}"><h4>${esc(x.group)}</h4>
      <p><small>Đặc điểm và nhu cầu</small>${esc(x.need)}</p><p><small>Nội dung và cách tiếp cận</small>${esc(x.approach)}</p></article>`).join('')}</div>`;
  const msg = `<blockquote class="keymsg rv"><small>Thông điệp trung tâm</small>${esc(O.keyMessage)}</blockquote>
    <div class="hook rv"><div><small>Ý tưởng triển khai</small><b>“${esc(O.hookName)}”</b></div><p>${esc(O.hook)}</p></div>
    <div class="pillars">${O.pillars.map((x, i) => `<article class="pill rv" style="--i:${i}"><span class="pill-no">Trụ cột ${i + 1}</span><h4>${esc(x.name)}</h4>
      <p>${esc(x.focus)}</p><p class="pill-act"><small>Hoạt động</small>${esc(x.activities)}</p></article>`).join('')}</div>`;
  const phases = `<ol class="phases">${O.phases.map((x, i) => `<li class="rv" style="--i:${i}"><span class="ph-dot">${i + 1}</span><h4>${esc(x.k)}</h4><p>${esc(x.v)}</p></li>`).join('')}</ol>`;
  const chans = `<div class="chans">${O.channels.map((x, i) => `<article class="chan rv" style="--i:${i}"><h4>${esc(x.k)}</h4><p>${esc(x.v)}</p></article>`).join('')}</div>`;
  const tl = `<p class="pintro rv">${esc(T.note)}</p>
    <div class="tl-head rv" aria-hidden="true"><span></span><b>Offline</b><b>Online</b></div>
    ${T.groups.map(g => `<div class="tl-group"><h4 class="tl-gname rv">${esc(g.name)}</h4>${g.rows.map(r => `
      <div class="tl-row rv"><div class="tl-when"><i></i><b>${esc(r.when)}</b></div>
        <div class="tl-col off" data-l="Offline">${lines(r.offline)}</div><div class="tl-col on" data-l="Online">${lines(r.online)}</div></div>`).join('')}</div>`).join('')}`;

  const parts = [
    ['pp-1', part('I', O.title)],
    ['sec-info', 'Thông tin chung', info], ['sec-goal', 'Mục đích và mục tiêu', goals], ['sec-aud', 'Đối tượng và cách tiếp cận', aud],
    ['sec-msg', 'Thông điệp, ý tưởng chủ đạo và nội dung trọng tâm', msg], ['sec-phase', 'Hoạt động theo ba giai đoạn', phases], ['sec-chan', 'Kênh triển khai', chans],
    ['pp-2', part('II', T.title)], ['sec-time', 'Timeline online và offline', tl]
  ];
  let n = 0, html = '', navHtml = '';
  parts.forEach(it => {
    if (it[0].startsWith('pp-')) { html += it[1]; navHtml += `<span class="toc-part">${it[0] === 'pp-1' ? 'Phần I' : 'Phần II'}</span>`; return; }
    n++; html += sec(it[0], String(n).padStart(2, '0'), it[1], it[2]);
    navHtml += `<button type="button" data-target="${it[0]}"${n === 1 ? ' class="on"' : ''}>${esc(it[1].replace(/^Thông điệp.*/, 'Thông điệp và trụ cột'))}</button>`;
  });
  $('#propBody').innerHTML = html;
  $('#pToc').innerHTML = navHtml;
  initToc('#pToc', '/proposal');
  initReveal('#propBody');
  const bar = $('#pBar i');
  const prog = () => {
    if (current !== '/proposal') return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
  };
  window.addEventListener('scroll', prog, { passive: true }); prog();
}

/* Hiện dần từng khối khi cuộn tới. Mặc định mọi khối đều hiện, chỉ khi hiệu ứng chạy được mới ẩn trước rồi hiện dần */
function initReveal(rootSel) {
  const root = $(rootSel), items = $$(rootSel + ' .rv');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach(i => i.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0 });
  root.classList.add('rv-on');
  items.forEach(i => io.observe(i));
  setTimeout(() => { if (!items.some(i => i.classList.contains('in'))) root.classList.remove('rv-on'); }, 2000);   // phòng khi trình duyệt không báo
}

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

function initToc(navSel = '#toc', route = '/moodboard') {
  const btns = $$(navSel + ' button');
  const secs = btns.map(b => $('#' + b.dataset.target));
  btns.forEach(b => b.onclick = () => { const t = $('#' + b.dataset.target); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  const mark = () => {
    const y = window.innerHeight * 0.32;
    let cur = 0;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < y) cur = i; });
    btns.forEach((b, i) => b.classList.toggle('on', i === cur));
  };
  window.addEventListener('scroll', () => { if (current === route) mark(); }, { passive: true });
  mark();
}

function initMoodboard() {
  initToc();
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

  /* Sản phẩm truyền thông: phông nền và hai mặt brochure, mỗi mặt là một ảnh riêng */
  const pr = m.products || {};
  fillGallery($('#prodBackdrop'), (pr.backdrop || []).filter(x => x.src), 'Thiết kế phông nền sân khấu', 'Tải ảnh thiết kế phông trong trang quản trị, mục Moodboard', 1);
  const b = C.brochure || {};
  const sides = [{ src: b.front, caption: b.frontLabel || 'Mặt trước' }, { src: b.back, caption: b.backLabel || 'Mặt sau' }].filter(x => x.src);
  $('#prodBroTitle').textContent = b.title || 'Brochure';
  const bh = $('#prodBrochure');
  if (sides.length) sides.forEach(it => bh.appendChild(imageFigure(it, sides)));
  else { bh.appendChild(placeholder('Brochure mặt tiếng Việt', 'Tải ảnh trong trang quản trị')); bh.appendChild(placeholder('Brochure mặt tiếng Pháp', 'Tải ảnh trong trang quản trị')); }
}
$('#lightboxClose').onclick = () => $('#lightbox').close();
$('#lbPrev').onclick = () => moveViewer(-1);
$('#lbNext').onclick = () => moveViewer(1);
$('#lightbox').addEventListener('keydown', e => { if (e.key === 'ArrowLeft') moveViewer(-1); if (e.key === 'ArrowRight') moveViewer(1); });
(() => { let x0 = null; const lb = $('#lightbox');
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50 && viewer.items.length > 1) moveViewer(dx < 0 ? 1 : -1); }); })();
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') e.currentTarget.close(); });

/* ================= Hái lộc đầu xuân ================= */
const locBag = { order: [], last: -1 };
function nextLoc() {
  const list = (C.scene.lixiMessages || []).filter(x => String(x).trim());
  if (!list.length) return 'Chúc bạn một năm mới an khang.';
  if (locBag.order.length === 0 || locBag.n !== list.length) {
    // xáo trộn Fisher-Yates, đảm bảo thông điệp đầu của lượt mới không trùng thông điệp cuối của lượt trước
    const a = list.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    if (a.length > 1 && a[a.length - 1] === locBag.last) [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
    locBag.order = a; locBag.n = list.length;
  }
  const i = locBag.order.pop(); locBag.last = i;
  return list[i];
}
const cardBag = { order: [], last: -1 };
function nextCard() {
  const imgs = (C.scene.lixiCards || []).map(x => (typeof x === 'string' ? x : x && x.src)).filter(Boolean);
  if (!imgs.length) return '';
  if (!cardBag.order.length) {
    const a = imgs.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    if (a.length > 1 && a[a.length - 1] === cardBag.last) [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
    cardBag.order = a;
  }
  const i = cardBag.order.pop(); cardBag.last = i; return imgs[i];
}
function openLoc() {
  const d = $('#locDlg'), card = $('#locCard');
  $('#locTitle').textContent = C.scene.lixiTitle || 'Hái lộc đầu xuân';
  const msg = nextLoc();
  $('#locMsg').innerHTML = esc(msg).split('\n').map(l => `<span>${l}</span>`).join('');
  const img = nextCard();
  card.classList.toggle('has-img', !!img);
  $('#locImg').src = img || '';
  card.dataset.pos = C.scene.lixiTextPos || 'middle';
  card.style.setProperty('--loc-ink', C.scene.lixiTextColor || '#fbe9b8');
  const sp = $('#locSparks');
  if (!sp.childElementCount) for (let i = 0; i < 18; i++) {
    const e = document.createElement('i');
    e.style.cssText = `left:${6 + Math.random() * 88}%;top:${8 + Math.random() * 84}%;--d:${(Math.random() * 1.2).toFixed(2)}s;--s:${(0.5 + Math.random() * 0.9).toFixed(2)}`;
    sp.appendChild(e);
  }
  card.classList.remove('reveal'); void card.offsetWidth; card.classList.add('reveal');
  if (!d.open) d.showModal();
}
$('#locAgain').onclick = openLoc;
$('#locClose').onclick = () => $('#locDlg').close();
$('#locDlg').addEventListener('click', e => { if (e.target.id === 'locDlg') e.currentTarget.close(); });

/* ================= Brochure: lật hai mặt, cầm theo ================= */
let held = false;
try { held = sessionStorage.getItem('brochureHeld') === '1'; } catch (e) { /* bỏ qua */ }
let broSide = 0;
function broRender() {
  const b = C.brochure || {};
  $('#broFlip').classList.toggle('flipped', broSide === 1);
  $('#broLabel').textContent = broSide ? (b.backLabel || 'Mặt sau') : (b.frontLabel || 'Mặt trước');
  $('#broTake').textContent = held ? 'Bỏ brochure xuống' : 'Cầm theo brochure';
  $('#broTake').classList.toggle('btn-gold', !held);
  $('#broTake').classList.toggle('btn-line', held);
  $('#heldChip').hidden = !held || !space;
}
function openBrochure(side = 0) {
  const b = C.brochure || {};
  $('#broImgF').src = b.front || ''; $('#broImgB').src = b.back || '';
  $('#broNote').textContent = b.note || '';
  $('#broTurn').hidden = !(b.front && b.back);
  broSide = side; broRender();
  const d = $('#broDlg'); if (!d.open) d.showModal();
}
$('#broTurn').onclick = () => { broSide = broSide ? 0 : 1; broRender(); };
$('#broFlip').onclick = () => { if (C.brochure && C.brochure.front && C.brochure.back) { broSide = broSide ? 0 : 1; broRender(); } };
$('#broTake').onclick = () => {
  held = !held;
  try { sessionStorage.setItem('brochureHeld', held ? '1' : '0'); } catch (e) { /* bỏ qua */ }
  broRender();
  if (held) $('#broDlg').close();
};
$('#broClose').onclick = () => $('#broDlg').close();
$('#broDlg').addEventListener('click', e => { if (e.target.id === 'broDlg') e.currentTarget.close(); });
$('#heldChip').onclick = () => openBrochure(0);

/* ================= Không gian 3D ================= */
const VIEW_BUTTONS = [['overview', 'Toàn cảnh'], ['gate', 'Từ cổng vào'], ['audience', 'Góc khán giả'], ['stage', 'Từ sân khấu'], ['top', 'Nhìn từ trên cao']];

async function initSpace() {
  const loading = $('#spaceLoading');
  let mod;
  try { mod = await import('./scene3d.js?v=9'); }
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
    $('#joy').hidden = !(coarse || isMobile());
    $('#spaceHint').textContent = m === 'walk'
      ? 'Kéo để nhìn quanh, dùng W A S D hoặc phím mũi tên để đi, giữ Shift để đi nhanh, bấm vào sàn để đi tới đó.'
      : 'Kéo để xoay, cuộn để phóng to, giữ chuột phải hoặc dùng phím W A S D để di chuyển, nhấp đúp vào sàn để bay tới đó.';
    if (m === 'walk') $('#spaceHint').classList.remove('gone');
  }

  function handleSelect(id) {
    activeId = id;
    if (id && id.startsWith('loc:')) { panel.hidden = true; openLoc(); return; }
    if (id === 'brochure') { panel.hidden = true; openBrochure(0); return; }
    const isFood = !!id && id.startsWith('food:');
    $$('#legendList button').forEach(b => b.classList.toggle('on', b.dataset.zone === (isFood ? 'buffet' : id)));
    if (!id) { panel.hidden = true; return; }
    if (isFood) {
      const f = C.scene.foods[Number(id.slice(5))] || {};
      const bz = zones.find(z => z.id === 'buffet');
      $('#panelNo').textContent = `Khu ${bz ? bz.no : ''}, buffet món Việt`;
      $('#panelName').textContent = f.name || 'Món ăn';
      $('#panelDesc').textContent = f.note || 'Xin mời!';
      $('#panelPlan').hidden = true;
    } else {
      const z = zones.find(x => x.id === id);
      $('#panelNo').textContent = `Khu ${z.no} trên ${zones.length}`;
      $('#panelName').textContent = z.name;
      $('#panelDesc').textContent = z.desc;
      $('#panelPlan').textContent = z.plan; $('#panelPlan').hidden = !z.plan;
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
  $('#joy').hidden = !(coarse || isMobile());

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
    const mag = Math.min(1, len / max), dead = 0.14;
    const k = mag < dead ? 0 : Math.pow((mag - dead) / (1 - dead), 1.25);   // vùng chết nhỏ và tăng tốc từ từ, tránh giật
    const ang = Math.atan2(dx, -dy);
    api.setMove(Math.sin(ang) * k, Math.cos(ang) * k);
  };
  joy.addEventListener('pointerdown', e => { e.stopPropagation(); jid = e.pointerId; joy.setPointerCapture(jid); jmove(e); });
  joy.addEventListener('pointermove', e => { if (e.pointerId === jid) jmove(e); });
  const jend = e => { if (e.pointerId !== jid) return; jid = null; knob.style.transform = ''; api.setMove(0, 0); };
  joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);

  $('#endBtn').addEventListener('click', () => { stopTour(); });

  space = { api, tourStop: stopTour };
  $('#heldChip').hidden = !held;
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
