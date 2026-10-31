import { CONFIG } from './config.js';

/* Gộp nội dung đã chỉnh trong data/content.json lên bản mặc định.
   Đối tượng thì gộp từng mục, danh sách thì thay hẳn. */
export function mergeDeep(base, over) {
  if (Array.isArray(over)) return over;
  if (over && typeof over === 'object' && base && typeof base === 'object' && !Array.isArray(base)) {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = k in base ? mergeDeep(base[k], over[k]) : over[k];
    return out;
  }
  return over === undefined ? base : over;
}

export async function loadConfig(bust = true) {
  const base = JSON.parse(JSON.stringify(CONFIG));
  try {
    const r = await fetch('data/content.json' + (bust ? '?t=' + Date.now() : ''), { cache: 'no-store' });
    if (r.ok) return mergeDeep(base, await r.json());
  } catch (e) { /* dùng bản mặc định */ }
  return base;
}

/* Tải các font Google mà admin chọn (ngoài hai font mặc định) */
export function loadFonts(families) {
  const have = new Set(['Be Vietnam Pro', 'Cormorant Garamond']);
  const need = [...new Set(families)].filter(f => f && !have.has(f));
  need.forEach(f => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;700&display=swap`;
    document.head.appendChild(l);
  });
}
