import { loadConfig, FONT_OPTIONS } from './content.js';

const $ = (s, r = document) => r.querySelector(s);
let S = null;                       // bản nội dung đang chỉnh
const pending = new Map();          // đường dẫn file mới -> { b64, dataUrl }
let gh = null;                      // { owner, repo, branch, token }
let dirty = false;
let tab = 'general';

/* ---------- Tiện ích ---------- */
function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  kids.flat().forEach(c => e.append(c instanceof Node ? c : document.createTextNode(c ?? '')));
  return e;
}
function toast(msg, ms = 3200) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, ms);
}
function touch() { dirty = true; $('#btnPublish').textContent = 'Xuất bản *'; }
const slug = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'file';
const src = p => (pending.has(p) ? pending.get(p).dataUrl : p);

/* ---------- Ô nhập ---------- */
function field(label, obj, key, { area = false, type = 'text', ph = '' } = {}) {
  const inp = area ? h('textarea', { placeholder: ph }) : h('input', { type, placeholder: ph });
  inp.value = obj[key] ?? '';
  inp.addEventListener('input', () => { obj[key] = type === 'number' ? Number(inp.value) : inp.value; touch(); });
  return h('label', {}, label, inp);
}
function check(label, obj, key) {
  const c = h('input', { type: 'checkbox' }); c.checked = !!obj[key];
  c.addEventListener('change', () => { obj[key] = c.checked; touch(); });
  return h('label', { class: 'chk' }, c, label);
}

/* ---------- Ảnh và file ---------- */
async function prepImage(file, max = 1600) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const png = file.type === 'image/png';
  return { dataUrl: c.toDataURL(png ? 'image/png' : 'image/jpeg', 0.86), ext: png ? 'png' : 'jpg' };
}
async function addImageFile(file) {
  const { dataUrl, ext } = await prepImage(file);
  const base = slug(file.name.replace(/\.[^.]+$/, ''));
  const path = `assets/uploads/${Date.now().toString(36)}-${base}.${ext}`;
  pending.set(path, { b64: dataUrl.split(',')[1], dataUrl });
  touch();
  return path;
}
function pickFiles(accept, multiple, cb) {
  const i = h('input', { type: 'file', accept, multiple });
  i.addEventListener('change', async () => { try { await cb([...i.files]); } catch (e) { console.error(e); toast('Không đọc được file này'); } });
  i.click();
}
function imgField(label, obj, key, rerender) {
  const box = h('div', { class: 'imgbox' });
  const th = h('div', { class: 'thumb' });
  if (obj[key]) th.style.backgroundImage = `url("${src(obj[key])}")`;
  const info = h('div', {}, h('b', {}, label), h('small', {}, obj[key] || 'Chưa có ảnh'));
  const pick = h('button', { class: 'b b-line b-sm', type: 'button', onclick: () => pickFiles('image/*', false, async ([f]) => { if (!f) return; obj[key] = await addImageFile(f); rerender(); }) }, obj[key] ? 'Đổi ảnh' : 'Chọn ảnh');
  const del = h('button', { class: 'b b-line b-sm b-del', type: 'button', onclick: () => { obj[key] = ''; touch(); rerender(); } }, 'Xóa');
  info.append(h('div', { class: 'row2' }, pick, obj[key] ? del : ''));
  box.append(th, info);
  return box;
}

/* ---------- Danh sách thêm, bớt, đổi thứ tự ---------- */
function list(arr, renderRow, addButtons, rerender) {
  const wrap = h('div');
  arr.forEach((it, i) => {
    const ctrl = h('div', { class: 'ctrl' },
      h('button', { class: 'b b-line b-sm', type: 'button', disabled: i === 0, onclick: () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; touch(); rerender(); } }, 'Lên'),
      h('button', { class: 'b b-line b-sm', type: 'button', disabled: i === arr.length - 1, onclick: () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; touch(); rerender(); } }, 'Xuống'),
      h('button', { class: 'b b-line b-sm b-del', type: 'button', onclick: () => { arr.splice(i, 1); touch(); rerender(); } }, 'Xóa'));
    wrap.append(h('div', { class: 'item' }, renderRow(it, i), ctrl));
  });
  wrap.append(h('div', { class: 'row2' }, addButtons));
  return wrap;
}
function addImagesBtn(arr, label, rerender, mk = p => ({ src: p, caption: '' })) {
  return h('button', { class: 'b b-red b-sm', type: 'button', onclick: () => pickFiles('image/*', true, async files => {
    for (const f of files) arr.push(mk(await addImageFile(f)));
    rerender();
  }) }, label);
}
const imageRow = (it, rerender) => h('div', {}, imgField('Ảnh', it, 'src', rerender), field('Chú thích', it, 'caption'));

/* ---------- Các tab ---------- */
const TABS = [
  ['general', 'Chung'], ['content', 'Nội dung trình bày'], ['docs', 'Tài liệu'], ['proposal', 'Proposal'],
  ['mood', 'Moodboard'], ['theme', 'Chữ và màu'], ['scene', 'Không gian 3D'], ['loc', 'Hái lộc'], ['media', 'Brochure và sản phẩm truyền thông'], ['zones', 'Các khu 3D'], ['thanks', 'Lời cảm ơn']
];
const FONTS = ['Be Vietnam Pro', 'Cormorant Garamond', 'Playfair Display', 'Lora', 'Noto Serif', 'Merriweather', 'Montserrat', 'Roboto', 'Nunito', 'Quicksand', 'Dancing Script', 'Pacifico', 'Yeseva One'];

const VIEWS = {
  general() {
    return [h('h2', {}, 'Chung'),
      field('Tên chương trình', S, 'eventName'), field('Phụ đề (năm)', S, 'eventSub'),
      field('Đơn vị', S, 'org'), field('Nhóm thực hiện', S, 'team'),
      h('h3', {}, 'Trang mở đầu'),
      h('p', { class: 'hint' }, 'Ảnh thiết kế đã có sẵn tiêu đề. Nếu để trống, trang hiện bản tạm.'),
      imgField('Ảnh mở đầu', S.hero, 'image', render),
      h('label', {}, 'Cách hiện ảnh', (() => { const s = h('select', {}, h('option', { value: 'cover' }, 'Phủ kín màn hình, có thể bị cắt mép'), h('option', { value: 'contain' }, 'Hiện trọn ảnh, không cắt')); s.value = S.hero.fit; s.onchange = () => { S.hero.fit = s.value; touch(); }; return s; })()),
      field('Chữ trên nút bắt đầu', S.hero, 'button')];
  },
  content() {
    const c = S.content;
    return [h('h2', {}, 'Nội dung trình bày'),
      field('Tiêu đề trang', c, 'title'), field('Đoạn giới thiệu bên dưới', c, 'lead', { area: true }),
      h('h3', {}, 'Mục tài liệu'), field('Tên mục', c, 'docsTitle'), field('Chú thích', c, 'docsDesc', { area: true }),
      h('h3', {}, 'Mục Proposal'), field('Tên mục', c, 'proposalTitle'), field('Chú thích', c, 'proposalDesc', { area: true }), field('Chữ trên nút', c, 'proposalButton')];
  },
  docs() {
    return [h('h2', {}, 'Kho lưu trữ tài liệu mềm'),
      h('p', { class: 'hint' }, 'Tải file Word, PDF hoặc bất kỳ tài liệu nào. Người xem bấm vào để tải về. File chỉ lên GitHub khi bạn bấm Xuất bản.'),
      list(S.documents, it => h('div', {},
        field('Tên hiển thị', it, 'label'), field('Chú thích', it, 'note'),
        h('div', { class: 'row2' },
          h('button', { class: 'b b-line b-sm', type: 'button', onclick: () => pickFiles('.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.zip,.txt', false, async ([f]) => {
            if (!f) return;
            const buf = new Uint8Array(await f.arrayBuffer()); let bin = ''; buf.forEach(b => { bin += String.fromCharCode(b); });
            const ext = (f.name.split('.').pop() || 'bin').toLowerCase();
            const path = `assets/docs/${slug(f.name.replace(/\.[^.]+$/, ''))}.${ext}`;
            pending.set(path, { b64: btoa(bin), dataUrl: '' }); it.file = path; touch(); render();
          }) }, it.file ? 'Đổi file' : 'Chọn file'),
          h('small', { class: 'hint' }, it.file || 'Chưa có file'))),
        [h('button', { class: 'b b-red b-sm', type: 'button', onclick: () => { S.documents.push({ label: 'Tài liệu mới', file: '', note: '' }); touch(); render(); } }, 'Thêm tài liệu')], render)];
  },
  proposal() {
    const p = S.proposal;
    return [h('h2', {}, 'Proposal'), field('Tiêu đề', p, 'title'), field('Dòng giới thiệu', p, 'lead'),
      h('h3', {}, 'Cách 1, nhúng Canva'),
      h('p', { class: 'hint' }, 'Trên Canva chọn Chia sẻ, Xem thêm, Nhúng, rồi dán link dạng https://www.canva.com/design/XXXX/view?embed'),
      field('Link nhúng Canva', p, 'canvaEmbedUrl', { type: 'url', ph: 'https://www.canva.com/design/...' }),
      h('h3', {}, 'Cách 2, ảnh từng slide'),
      h('p', { class: 'hint' }, 'Chỉ dùng khi ô Canva ở trên để trống. Bấm qua slide cuối sẽ tự sang Moodboard.'),
      list(p.slideImages, (u, i) => h('div', { class: 'imgbox' }, h('div', { class: 'thumb', style: `background-image:url("${src(u)}")` }), h('div', {}, h('b', {}, `Slide ${i + 1}`))),
        [addImagesBtn(p.slideImages, 'Thêm ảnh slide', render, path => path)], render)];
  },
  mood() {
    const m = S.moodboard;
    return [h('h2', {}, 'Moodboard và visual cue'), field('Tiêu đề', m, 'title'), field('Dòng giới thiệu', m, 'lead'),
      h('h3', {}, 'Ảnh moodboard'),
      list(m.images, it => imageRow(it, render), [addImagesBtn(m.images, 'Thêm ảnh moodboard', render)], render),
      h('h3', {}, 'Key visual'), imgField('Ảnh key visual', m.keyVisual, 'image', render), field('Chú thích', m.keyVisual, 'caption'),
      h('h3', {}, 'Bảng màu'),
      list(m.palette, it => {
        const cp = h('input', { type: 'color' }); cp.value = /^#[0-9a-f]{6}$/i.test(it.hex) ? it.hex : '#a8141f';
        const hex = h('input', { type: 'text' }); hex.value = it.hex;
        cp.oninput = () => { it.hex = cp.value.toUpperCase(); hex.value = it.hex; touch(); };
        hex.oninput = () => { it.hex = hex.value; if (/^#[0-9a-f]{6}$/i.test(hex.value)) cp.value = hex.value; touch(); };
        return h('div', {}, h('div', { class: 'grid2' }, field('Tên màu', it, 'name'), h('label', {}, 'Mã màu', h('div', { class: 'row2' }, cp, hex))), field('Dùng cho', it, 'role'));
      }, [h('button', { class: 'b b-red b-sm', type: 'button', onclick: () => { m.palette.push({ name: 'Màu mới', hex: '#CCCCCC', role: '' }); touch(); render(); } }, 'Thêm màu')], render),
      h('h3', {}, 'Font'),
      h('p', { class: 'hint' }, 'Tải ảnh thiết kế font từ Canva. Ghi tên font vào ô Chú thích, tên này hiện ngay dưới ảnh trên trang web.'),
      h('b', {}, 'Chữ tiêu đề'),
      list(m.fonts.title, it => imageRow(it, render), [addImagesBtn(m.fonts.title, 'Thêm ảnh font tiêu đề', render)], render),
      h('b', {}, 'Chữ nội dung'),
      list(m.fonts.body, it => imageRow(it, render), [addImagesBtn(m.fonts.body, 'Thêm ảnh font nội dung', render)], render),
      h('h3', {}, 'Elements'),
      list(m.elements, it => imageRow(it, render), [addImagesBtn(m.elements, 'Thêm element', render)], render)];
  },
  theme() {
    const t = S.theme;
    const sel = (label, kind, key) => {
      const sl = h('select', {}, FONT_OPTIONS[kind].map(o => h('option', { value: o.label }, o.label + (o.custom ? ' (tải file font)' : ''))));
      sl.value = t[key]; sl.onchange = () => { t[key] = sl.value; touch(); };
      return h('label', {}, label, sl);
    };
    const colorRow = (label, key) => {
      const cp = h('input', { type: 'color' }); const hex = h('input', { type: 'text' });
      cp.value = /^#[0-9a-f]{6}$/i.test(t.colors[key]) ? t.colors[key] : '#000000'; hex.value = t.colors[key] || '';
      cp.oninput = () => { t.colors[key] = cp.value.toUpperCase(); hex.value = t.colors[key]; touch(); };
      hex.oninput = () => { t.colors[key] = hex.value; if (/^#[0-9a-f]{6}$/i.test(hex.value)) cp.value = hex.value; touch(); };
      return h('label', {}, label, h('div', { class: 'row2' }, cp, hex));
    };
    return [h('h2', {}, 'Chữ và màu'),
      h('h3', {}, 'Font chữ'),
      h('p', { class: 'hint' }, 'Font tiêu đề áp dụng cho mọi tiêu đề, tên chương trình, banner, biển và câu đối trong 3D. Font nội dung áp dụng cho đoạn mô tả và nút.'),
      sel('Font tiêu đề', 'heading', 'headingFont'), sel('Font nội dung', 'body', 'bodyFont'),
      h('h3', {}, 'File font cần tải lên'),
      h('p', { class: 'hint' }, 'Amarego, Assox, Best Swashed và Beautique Display Condensed không có trên Google Fonts, nên cần tải file font (.ttf, .otf hoặc .woff2) lên đây. Chưa tải thì web tạm dùng font thay thế. Chọn bản font có hỗ trợ tiếng Việt có dấu.'),
      ...t.customFonts.map(cf => h('div', { class: 'item' },
        h('div', {}, h('b', {}, cf.name), h('small', { class: 'hint' }, cf.file || ' Chưa tải file')),
        h('div', { class: 'ctrl' },
          h('button', { class: 'b b-line b-sm', type: 'button', onclick: () => pickFiles('.ttf,.otf,.woff,.woff2', false, async ([f]) => {
            if (!f) return;
            const buf = new Uint8Array(await f.arrayBuffer()); let bin = ''; buf.forEach(b => { bin += String.fromCharCode(b); });
            const ext = (f.name.split('.').pop() || 'ttf').toLowerCase();
            const path = `assets/fonts/${slug(cf.name)}.${ext}`;
            pending.set(path, { b64: btoa(bin), dataUrl: '' }); cf.file = path; touch(); render();
          }) }, cf.file ? 'Đổi file' : 'Tải file font'),
          cf.file ? h('button', { class: 'b b-line b-sm b-del', type: 'button', onclick: () => { cf.file = ''; touch(); render(); } }, 'Bỏ') : ''))),
      h('h3', {}, 'Màu chữ'),
      h('div', { class: 'grid2' },
        colorRow('Tên chương trình trên thanh trên', 'brand'), colorRow('Tiêu đề trang mở đầu', 'heroTitle'),
        colorRow('Dòng chữ nhỏ trang mở đầu', 'heroText'), colorRow('Tiêu đề các trang', 'pageTitle'),
        colorRow('Tiêu đề từng mục', 'sectionTitle'), colorRow('Đoạn mô tả, nội dung', 'body'),
        colorRow('Tiêu đề trang cảm ơn', 'thanksTitle'), colorRow('Nội dung trang cảm ơn', 'thanksText'),
        colorRow('Chân trang', 'footer')),
      h('h3', {}, 'Màu chữ trong 3D'),
      h('div', { class: 'grid2' },
        colorRow('Tên trên banner gian hàng', 'bannerTitle'), colorRow('Dòng phụ trên banner', 'bannerSub'),
        colorRow('Chữ câu đối', 'couplet'), colorRow('Chữ trên biển, bảng', 'sign'))];
  },
  scene() {
    const sc = S.scene, e = sc.embassy;
    return [h('h2', {}, 'Không gian 3D'),
      h('h3', {}, 'Phông nền sân khấu'),
      h('p', { class: 'hint' }, 'Tải thiết kế phông có nét giao thoa Việt Nam và Algeria. Ảnh sẽ hiện ngay trên sân khấu 3D.'),
      imgField('Ảnh phông nền', sc, 'backdropImage', render),
      h('div', { class: 'grid2' },
        h('label', {}, 'Chiều rộng phông (mét)', (() => { const i = h('input', { type: 'number', step: '0.1' }); i.value = sc.backdropSize[0]; i.oninput = () => { sc.backdropSize[0] = Number(i.value); touch(); }; return i; })()),
        h('label', {}, 'Chiều cao phông (mét)', (() => { const i = h('input', { type: 'number', step: '0.1' }); i.value = sc.backdropSize[1]; i.oninput = () => { sc.backdropSize[1] = Number(i.value); touch(); }; return i; })())),
      check('Dùng màn hình LED (phông tự phát sáng)', sc, 'useLed'),
      h('h3', {}, 'Chữ trên cổng chào'),
      field('Dòng chữ uốn theo vòm cổng (in hoa)', sc, 'gateText'),
      h('h3', {}, 'Bảng hiệu Đại sứ quán'),
      imgField('Quốc huy', sc, 'emblemImage', render),
      field('Tên tiếng Việt (in hoa)', e, 'nameVi'), field('Tên tiếng Pháp (in hoa)', e, 'nameFr', { area: true }), field('Địa chỉ', e, 'address'),
      h('h3', {}, 'Biển hiệu gian hàng, tiếng Việt và tiếng Pháp'),
      h('div', { class: 'grid2' }, field('Gian cà phê, tiếng Việt', sc.booths.coffee, 'vi'), field('Gian cà phê, tiếng Pháp', sc.booths.coffee, 'fr')),
      h('div', { class: 'grid2' }, field('Gian trà, tiếng Việt', sc.booths.tea, 'vi'), field('Gian trà, tiếng Pháp', sc.booths.tea, 'fr')),
      h('h3', {}, 'Câu đối'),
      h('p', { class: 'hint' }, 'Mỗi vế viết cách nhau bằng dấu cách, mỗi từ nằm một dòng dọc.'),
      field('Vế trái', sc.couplets, 'left'), field('Vế phải', sc.couplets, 'right'),
      h('h3', {}, 'Các món ở khu buffet'),
      ...sc.foods.map((f, i) => h('div', { class: 'item' }, h('div', {}, field(`Bàn ${i + 1}, tên món`, f, 'name'), field('Câu chú thích khi bấm vào bàn', f, 'note'), imgField('Ảnh món (hiện trong khung khi bấm vào bàn)', f, 'image', render)), h('div'))),
      h('p', { class: 'hint' }, 'Chỉnh xong phần 3D, xuất bản rồi tải lại trang web để thấy thay đổi.')];
  },
  loc() {
    const sc = S.scene, arr = sc.lixiMessages;
    const bulk = h('textarea', { placeholder: 'Dán nhiều thông điệp, mỗi dòng một thông điệp. Muốn kèm bản tiếng Pháp thì viết tiếng Việt, gõ dấu gạch đứng | rồi tiếng Pháp.', rows: 5 });
    return [h('h2', {}, 'Hái lộc đầu xuân'),
      h('p', { class: 'hint' }, 'Khách bấm vào cây đào hoặc cây mai cạnh bàn đón tiếp để hái một phong bao. Mỗi lần hiện một thông điệp khác, các thông điệp được trộn ngẫu nhiên và dùng hết một vòng rồi mới lặp lại.'),
      field('Dòng chữ treo trên cây', sc, 'lixiTitle'),
      h('h3', {}, `Thông điệp (${arr.length})`),
      list(arr, (it, i) => {
        const t = h('textarea', { rows: 2 }); t.value = it;
        t.addEventListener('input', () => { arr[i] = t.value; touch(); });
        return h('div', {}, h('label', {}, `Thông điệp ${i + 1}`, t));
      }, [h('button', { class: 'b b-red b-sm', type: 'button', onclick: () => { arr.push(''); touch(); render(); } }, 'Thêm thông điệp')], render),
      h('h3', {}, 'Thêm nhiều thông điệp cùng lúc'), bulk,
      h('div', { class: 'row2' }, h('button', { class: 'b b-line b-sm', type: 'button', onclick: () => {
        const lines = bulk.value.split('\n').map(x => x.trim()).filter(Boolean);
        lines.forEach(l => arr.push(l.split('|').map(x => x.trim()).join('\n')));
        if (lines.length) { touch(); render(); toast(`Đã thêm ${lines.length} thông điệp`); }
      } }, 'Thêm các dòng trên'))];
  },
  media() {
    const b = S.brochure, pr = S.moodboard.products;
    return [h('h2', {}, 'Brochure và sản phẩm truyền thông'),
      h('p', { class: 'hint' }, 'Brochure có hai mặt. Ở không gian 3D khách bấm vào brochure trên bàn đón tiếp sẽ thấy cửa sổ lật được hai mặt. Ở Moodboard, hai mặt hiện riêng biệt. Ảnh nên cùng tỉ lệ (mẫu hiện tại là A4 ngang).'),
      field('Tên brochure', b, 'title'),
      h('h3', {}, 'Mặt tiếng Việt'), imgField('Ảnh mặt tiếng Việt', b, 'front', render), field('Chú thích mặt này', b, 'frontLabel'),
      h('h3', {}, 'Mặt tiếng Pháp'), imgField('Ảnh mặt tiếng Pháp', b, 'back', render), field('Chú thích mặt này', b, 'backLabel'),
      field('Dòng ghi chú dưới cửa sổ brochure', b, 'note', { area: true }),
      h('h3', {}, 'Thiết kế phông nền sân khấu (hiện ở Moodboard)'),
      list(pr.backdrop, it => imageRow(it, render), [addImagesBtn(pr.backdrop, 'Thêm thiết kế phông nền', render)], render)];
  },
  zones() {
    return [h('h2', {}, 'Các khu 3D'), h('p', { class: 'hint' }, 'Chữ trong bảng giải thích khi bấm vào từng khu.'),
      ...S.zones.map(z => h('details', { class: 'zone' }, h('summary', {}, `${z.no}. ${z.name}`),
        h('div', { class: 'in' }, field('Tên khu', z, 'name'), field('Mô tả', z, 'desc', { area: true }), field('Gợi ý triển khai', z, 'plan', { area: true })))) ];
  },
  thanks() {
    return [h('h2', {}, 'Lời cảm ơn'), field('Tiêu đề', S.thanks, 'title'), field('Nội dung', S.thanks, 'message', { area: true }), field('Ký tên', S.thanks, 'sign')];
  }
};

function render() {
  const keepOpen = [...document.querySelectorAll('details.zone')].map(d => d.open);
  $('#tabs').replaceChildren(...TABS.map(([k, label]) => h('button', { class: k === tab ? 'on' : '', type: 'button', onclick: () => { tab = k; render(); window.scrollTo(0, 0); } }, label)));
  $('#main').replaceChildren(...VIEWS[tab]());
  document.querySelectorAll('details.zone').forEach((d, i) => { if (keepOpen[i]) d.open = true; });
}

/* ---------- Kết nối và xuất bản GitHub ---------- */
const hdr = () => ({ Authorization: `Bearer ${gh.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' });
const enc = p => p.split('/').map(encodeURIComponent).join('/');

async function ghFetch(path, opt = {}) {
  return fetch(`https://api.github.com/repos/${gh.owner}/${gh.repo}/${path}`, { ...opt, headers: { ...hdr(), ...(opt.headers || {}) } });
}
async function connect(owner, repo, token) {
  const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } });
  if (r.status === 401) throw new Error('Token không đúng hoặc đã hết hạn');
  if (r.status === 404) throw new Error('Không thấy repo này. Kiểm tra tên tài khoản, tên repo và quyền của token');
  if (!r.ok) throw new Error('GitHub báo lỗi ' + r.status);
  const j = await r.json();
  if (!j.permissions || !j.permissions.push) throw new Error('Token chưa có quyền ghi (Contents, Read and write)');
  gh = { owner, repo, token, branch: j.default_branch };
  $('#status').textContent = `Đã kết nối ${owner}/${repo}`; $('#status').classList.add('ok');
  $('#btnConnect').hidden = true;
}
async function putFile(path, b64, message) {
  for (let attempt = 0; attempt < 2; attempt++) {
    let sha;
    const g = await ghFetch(`contents/${enc(path)}?ref=${gh.branch}`);
    if (g.ok) sha = (await g.json()).sha;
    const r = await ghFetch(`contents/${enc(path)}`, { method: 'PUT', body: JSON.stringify({ message, content: b64, branch: gh.branch, ...(sha ? { sha } : {}) }) });
    if (r.ok) return;
    if (r.status !== 409 && r.status !== 422) throw new Error(`Không ghi được ${path} (${r.status})`);
  }
  throw new Error(`Xung đột khi ghi ${path}, hãy thử lại`);
}
function usedPaths(o, set = new Set()) {
  if (typeof o === 'string') set.add(o);
  else if (Array.isArray(o)) o.forEach(x => usedPaths(x, set));
  else if (o && typeof o === 'object') Object.values(o).forEach(x => usedPaths(x, set));
  return set;
}
const b64text = s => btoa(unescape(encodeURIComponent(s)));

async function publish() {
  if (!gh) { openConnect(); toast('Hãy kết nối GitHub trước'); return; }
  const btn = $('#btnPublish'); btn.disabled = true;
  try {
    const used = usedPaths(S);
    const files = [...pending.entries()].filter(([p]) => used.has(p));
    let n = 0;
    for (const [p, f] of files) { btn.textContent = `Đang tải file ${++n}/${files.length}`; await putFile(p, f.b64, `Tải ${p}`); }
    btn.textContent = 'Đang lưu nội dung';
    await putFile('data/content.json', b64text(JSON.stringify(S, null, 2)), 'Cập nhật nội dung trang');
    files.forEach(([p]) => pending.delete(p));
    dirty = false; btn.textContent = 'Xuất bản';
    toast('Đã xuất bản. Trang web cập nhật sau khoảng một phút.', 6000);
  } catch (e) { console.error(e); toast(e.message || 'Xuất bản không thành công', 6000); btn.textContent = 'Xuất bản *'; }
  btn.disabled = false;
}

function openConnect() {
  const d = $('#dlgConnect');
  const host = location.hostname.endsWith('.github.io') ? location.hostname.split('.')[0] : '';
  const repo = host ? location.pathname.split('/').filter(Boolean)[0] || '' : '';
  $('#cOwner').value ||= localStorage.getItem('xqh_owner') || host;
  $('#cRepo').value ||= localStorage.getItem('xqh_repo') || repo;
  $('#cToken').value ||= sessionStorage.getItem('xqh_token') || localStorage.getItem('xqh_token') || '';
  $('#cMsg').textContent = '';
  d.showModal();
}
$('#btnConnect').onclick = openConnect;
$('#cCancel').onclick = () => $('#dlgConnect').close();
$('#cOk').onclick = async () => {
  const owner = $('#cOwner').value.trim(), repo = $('#cRepo').value.trim(), token = $('#cToken').value.trim();
  if (!owner || !repo || !token) { $('#cMsg').textContent = 'Điền đủ ba ô'; return; }
  $('#cMsg').textContent = 'Đang kiểm tra...';
  try {
    await connect(owner, repo, token);
    localStorage.setItem('xqh_owner', owner); localStorage.setItem('xqh_repo', repo);
    sessionStorage.setItem('xqh_token', token);
    if ($('#cRemember').checked) localStorage.setItem('xqh_token', token); else localStorage.removeItem('xqh_token');
    $('#dlgConnect').close(); toast('Đã kết nối GitHub');
  } catch (e) { $('#cMsg').textContent = e.message; }
};
$('#btnPublish').onclick = publish;
window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

/* ---------- Khởi động ---------- */
S = await loadConfig();
render();
const saved = sessionStorage.getItem('xqh_token') || localStorage.getItem('xqh_token');
const o = localStorage.getItem('xqh_owner'), r = localStorage.getItem('xqh_repo');
if (saved && o && r) connect(o, r, saved).catch(() => {});
