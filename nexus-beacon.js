/**
 * Nexus Beacon — telemetria do ecossistema Baluarte (issue Projeto-Baluarte#348).
 *
 * Envia estatísticas anônimas pro Nexus Central (Supabase do Baluarte) SEM
 * permissão de escrita direta: só pelas RPCs SECURITY DEFINER, gateadas pela
 * chave de ingestão deste site (anti-abuso; validada dentro da função).
 * Coleta: page_view por carga, tempo de tela por sessão e cliques em links.
 * Best-effort e silencioso: telemetria nunca quebra nem atrasa o site.
 */
(function () {
  'use strict';
  var SB = 'https://hcwzsxdcvmswebunznak.supabase.co/rest/v1/rpc';
  var ANON = 'sb_publishable_uR0aJkZN54dkQJY0Tnx6GA_-4ehyOCm'; // pública por design
  var SLUG = 'essence';
  var KEY = 'chave_essence_789';

  function rpc(nome, args, keepalive) {
    try {
      return fetch(SB + '/' + nome, {
        method: 'POST',
        keepalive: !!keepalive,
        headers: {
          apikey: ANON,
          authorization: 'Bearer ' + ANON,
          'content-type': 'application/json'
        },
        body: JSON.stringify(Object.assign({ p_slug: SLUG, p_key: KEY }, args))
      }).catch(function () {});
    } catch (e) { /* silencioso */ }
  }

  function stat(metrica, valor, dims, keepalive) {
    rpc('ingest_stat', { p_metrica: metrica, p_valor: valor, p_dimensoes: dims || {} }, keepalive);
  }

  /* page_view da carga */
  stat('page_views', 1, { pagina: location.pathname });

  /* cliques em links (conversão: pra onde os visitantes vão) */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var alvo = (a.getAttribute('href') || '').slice(0, 120);
    if (alvo && alvo !== '#') stat('cliques', 1, { alvo: alvo });
  }, { passive: true });

  /* tempo de tela: acumula só o tempo visível; flush ao esconder/fechar */
  var inicio = document.visibilityState === 'visible' ? Date.now() : 0;
  var acumulado = 0;
  function flush() {
    if (inicio) { acumulado += (Date.now() - inicio) / 1000; inicio = 0; }
    var seg = Math.round(acumulado);
    if (seg < 3) return;
    acumulado = 0;
    stat('tempo_tela_seg', seg, {}, true);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush();
    else if (!inicio) inicio = Date.now();
  });
  window.addEventListener('pagehide', flush);
})();
