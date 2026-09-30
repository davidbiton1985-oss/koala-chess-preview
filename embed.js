/*! Koala Chess — partner embed loader (docs/biton-chess/PARTNERS.md). Plain ES5, no dependencies.
 *
 *  <div id="koala-chess"></div>
 *  <script src="https://<host>/embed.js"
 *          data-src="https://<host>/partners/<partner>/index.html"   (the partner's build; required)
 *          data-key="<partner licence key>"                          (required for a partner build)
 *          data-lang="he|en"                                         (optional; default: the page's <html lang>)
 *          data-target="#koala-chess"                                (optional; default: right after this script)
 *          data-height="640"                                         (optional; px, or "auto" to follow the game)
 *          async></script>
 *
 *  The game posts `{ source: 'koala-chess', v: 1, type, ... }` messages (ready, licence, resize, route, game-end);
 *  the loader re-dispatches each on the container as a DOM event `koala-chess:<type>` (detail = the message), so
 *  the host page can listen: container.addEventListener('koala-chess:game-end', e => ...).
 *  To switch language from the page: KoalaChess.setLocale('en').
 */
(function () {
  var s = document.currentScript;
  if (!s) return;
  var d = s.dataset || {};
  if (!d.src) { if (window.console) console.error('[koala-chess] embed.js needs data-src'); return; }
  var url;
  try { url = new URL(d.src, location.href); } catch (e) { return; }
  url.searchParams.set('embed', '1');
  if (d.key) url.searchParams.set('key', d.key);
  var lang = d.lang || (document.documentElement.lang || '').slice(0, 2);
  if (lang === 'he' || lang === 'en') url.searchParams.set('lang', lang);

  var host = d.target ? document.querySelector(d.target) : null;
  if (!host) { host = document.createElement('div'); s.parentNode.insertBefore(host, s.nextSibling); }
  var frame = document.createElement('iframe');
  frame.src = url.href;
  frame.title = lang === 'en' ? 'Koala Chess' : 'שחמט קואלה';
  frame.allow = 'fullscreen; autoplay';
  frame.setAttribute('allowfullscreen', '');
  frame.setAttribute('loading', 'lazy');
  frame.style.cssText = 'display:block;inline-size:100%;border:0;border-radius:12px;block-size:' + (/^\d+$/.test(d.height || '') ? d.height : '640') + 'px';
  host.appendChild(frame);

  window.addEventListener('message', function (ev) {
    if (ev.source !== frame.contentWindow || ev.origin !== url.origin) return;
    var m = ev.data;
    if (!m || m.source !== 'koala-chess' || typeof m.type !== 'string') return;
    if (m.type === 'resize' && d.height === 'auto' && m.height > 320) frame.style.blockSize = Math.min(m.height, 2000) + 'px';
    var e;
    try { e = new CustomEvent('koala-chess:' + m.type, { detail: m }); } catch (x) { return; }
    host.dispatchEvent(e);
  });

  window.KoalaChess = window.KoalaChess || {};
  window.KoalaChess.setLocale = function (l) {
    if (frame.contentWindow) frame.contentWindow.postMessage({ target: 'koala-chess', type: 'set-locale', locale: l }, url.origin);
  };
})();
