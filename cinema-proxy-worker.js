// Cloudflare Worker: proxy خاص بـ CINÉMA archive (يسمح فقط بمصادر IMDb/Cinemeta المستخدمة في الصفحة)
// النشر: Cloudflare Dashboard → Workers → Create → الصق الكود → Deploy، ثم ضع الرابط في window.CINEMA_PROXY داخل الصفحة.
const ALLOWED = ['v3.sg.media-imdb.com', 'v3-cinemeta.strem.io', 'api.agregarr.org'];
export default {
  async fetch(req) {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET', 'Cache-Control': 'public, max-age=86400' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const target = new URL(req.url).searchParams.get('url');
    let u; try { u = new URL(target); } catch (e) { return new Response('bad url', { status: 400, headers: cors }); }
    if (u.protocol !== 'https:' || !ALLOWED.includes(u.hostname)) return new Response('forbidden', { status: 403, headers: cors });
    const r = await fetch(u.toString(), { cf: { cacheTtl: 86400, cacheEverything: true } });
    return new Response(r.body, { status: r.status, headers: { ...cors, 'Content-Type': r.headers.get('Content-Type') || 'application/json' } });
  }
};
