/**
 * Aerial Optic — Realtime D1 sync via WebSocket
 */
(function () {
  var WS_URL = 'wss://api.opsidian.com/ws/site/f4ca0937-7fe4-4889-9b2a-dea22d48e70e';
  var ws;
  var delay = 1000;

  function connect() {
    try { ws = new WebSocket(WS_URL); } catch (e) { return; }
    ws.onopen = function () { delay = 1000; };
    ws.onmessage = function () { location.reload(); };
    ws.onclose = function () { setTimeout(connect, delay); delay = Math.min(delay * 2, 30000); };
    ws.onerror = function () { ws.close(); };
  }

  if ('WebSocket' in window) connect();
})();
