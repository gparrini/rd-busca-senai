(function () {
  "use strict";

  var RD_BASE = "https://recursosdidaticos.senai.br/recurso-didatico/";
  var PAGE = 48;

  var ICONS = {
    media: '<path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm6 4v8l6-4-6-4z"/>',
    book: '<path fill="currentColor" d="M5 3h11a3 3 0 0 1 3 3v15H7a3 3 0 0 1-3-3V5a2 2 0 0 1 1-2zm2 14a1 1 0 0 0 0 2h10v-2H7z"/>',
    doc: '<path fill="currentColor" d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2z"/>',
    target: '<path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>',
    puzzle: '<path fill="currentColor" d="M10 2a2.5 2.5 0 0 1 2.5 2.5V5H17a2 2 0 0 1 2 2v4.5h.5a2.5 2.5 0 0 1 0 5H19V20a2 2 0 0 1-2 2h-3.5v-1a2 2 0 0 0-4 0v1H6a2 2 0 0 1-2-2v-4.5h1a2 2 0 0 0 0-4H4V7a2 2 0 0 1 2-2h1.5v-.5A2.5 2.5 0 0 1 10 2z"/>',
    route: '<path fill="currentColor" d="M6 3a3 3 0 0 1 1 5.83V15a3 3 0 0 0 3 3h3.17A3 3 0 1 1 13.17 20H10a5 5 0 0 1-5-5V8.83A3 3 0 0 1 6 3zm9-1h5v5h-2V5.41l-4.3 4.3-1.4-1.42L16.58 4H15V2z"/>',
    curso: '<path fill="currentColor" d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm-7 9.18v4L12 20l7-3.82v-4L12 16l-7-3.82z"/>',
    uc: '<path fill="currentColor" d="M12 2 2 7l10 5 10-5-10-5zm-8.4 9L2 12l10 5 10-5-1.6-1-8.4 4.2L3.6 11zm0 5L2 17l10 5 10-5-1.6-1-8.4 4.2L3.6 16z"/>',
    tipo: '<path fill="currentColor" d="M3 3h8l10 10-8 8L3 11V3zm4 2.5A1.5 1.5 0 1 0 7 8.5a1.5 1.5 0 0 0 0-3z"/>',
    area: '<path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>',
    search: '<path fill="currentColor" d="M10 2a8 8 0 0 1 6.32 12.9l5.39 5.39-1.42 1.42-5.39-5.39A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>'
  };
  function svg(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>"; }

  // Categorias do RD (slug da planilha) com rótulo, cor da paleta SENAI e ícone
  var CATEGORIAS = {
    "recurso-midia":         { label: "Recurso de Mídia",         cor: "#1670fa", icon: "media" },
    "publicacao":            { label: "Publicação",               cor: "#bf340f", icon: "book" },
    "documento-orientador":  { label: "Documento Orientador",     cor: "#164194", icon: "doc" },
    "situacao-aprendizagem": { label: "Situação de Aprendizagem", cor: "#f5631a", icon: "target" },
    "atividade-pedagogica":  { label: "Atividade Pedagógica",     cor: "#008257", icon: "puzzle" },
    "trilha-digital":        { label: "Trilha Digital",           cor: "#7a3fd1", icon: "route" }
  };
  var CAT_ORDER = Object.keys(CATEGORIAS);

  // ---------- Busca: sinônimos, siglas e palavras ignoradas ----------
  // termo digitado -> [rótulo exibido ao usuário, ...termos equivalentes (sem acento)]
  var SINONIMOS = {
    sa: ["Situação de Aprendizagem", "situacao de aprendizagem"],
    sas: ["Situação de Aprendizagem", "situacao de aprendizagem"],
    pe: ["Plano de Ensino", "plano de ensino"],
    pa: ["Plano de Aula", "plano de aula"],
    pc: ["Plano de Curso", "plano de curso"],
    ld: ["Livro Didático", "livro didatico"],
    ti: ["Tecnologia da Informação", "tecnologia da informacao"],
    ia: ["Inteligência Artificial", "inteligencia artificial"],
    ra: ["Realidade Aumentada", "realidade aumentada"],
    rv: ["Realidade Virtual", "realidade virtual"],
    nr: ["Norma Regulamentadora", "norma regulamentadora"],
    sst: ["Segurança do Trabalho", "seguranca do trabalho"],
    clp: ["Controlador Lógico Programável", "controlador logico", "plc"],
    plc: ["CLP", "clp", "controlador logico"],
    cad: ["Desenho Assistido por Computador", "desenho assistido"],
    apostila: ["Livro / Manual", "livro", "manual", "guia de estudo"],
    ebook: ["Livro", "livro"],
    videoaula: ["Vídeo", "video"],
    filme: ["Vídeo", "video"],
    slide: ["Apresentações", "apresentac"],
    slides: ["Apresentações", "apresentac"],
    ppt: ["Apresentações", "apresentac"],
    powerpoint: ["Apresentações", "apresentac"],
    prova: ["Itens de Avaliação / Questionários", "avaliac", "questionario"],
    avaliacao: ["Itens de Avaliação / Questionários", "avaliac", "questionario"],
    teste: ["Questionários / Exercícios", "questionario", "exercicio", "avaliac"],
    quiz: ["Questionários", "questionario", "exercicio"],
    exercicio: ["Exercícios / Atividades", "exercicio", "atividade"],
    exercicios: ["Exercícios / Atividades", "exercicio", "atividade"],
    jogo: ["Jogos / Gamificação", "jogo", "gamifica"],
    jogos: ["Jogos / Gamificação", "jogo", "gamifica"],
    game: ["Jogos", "jogo", "gamifica"],
    games: ["Jogos", "jogo", "gamifica"],
    simulacao: ["Simuladores", "simula"],
    lab: ["Laboratórios", "laboratorio"],
    audio: ["Áudios / Podcasts", "audio", "podcast"],
    podcast: ["Podcasts / Áudios", "podcast", "audio"],
    planilha: ["Excel / Planilhas", "planilha", "excel"],
    excel: ["Planilhas", "excel", "planilha"]
  };
  var STOP = { de: 1, da: 1, "do": 1, das: 1, dos: 1, e: 1, em: 1, para: 1, a: 1, o: 1, as: 1, os: 1, no: 1, na: 1, nos: 1, nas: 1, com: 1, por: 1, ao: 1, um: 1, uma: 1 };

  // ---------- Dados ----------
  var RAW = window.RD_DATA || { dic: {}, rows: [] };
  var D = RAW.dic;
  var catInfo = (D.cat || []).map(function (slug) { return CATEGORIAS[slug] || { label: slug, cor: "#617379", icon: "doc" }; });

  // UC sintética para materiais gerais do curso (sem UC informada)
  var NO_UC = D.uc.length;
  D.uc.push("Materiais gerais do curso (sem UC)");

  var FACETS = ["curso", "uc", "cat", "tipo", "area", "dep"];
  var DIC = { curso: D.curso, uc: D.uc, cat: catInfo.map(function (c) { return c.label; }), tipo: D.tipo, area: D.area, dep: D.dep };

  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function pad(s) { return " " + norm(s).replace(/[^a-z0-9]+/g, " ").trim() + " "; }
  function names(facet, idxs) { return idxs.map(function (i) { return DIC[facet][i]; }).join(" "); }

  var data = RAW.rows.map(function (r) {
    var rec = {
      id: r[0], titulo: r[1], download: r[8] === 1, autor: r[9] >= 0 ? D.autor[r[9]] : "", data: r[10],
      f: { cat: [r[2]], tipo: r[3], area: r[4], curso: r[5], uc: r[6].length ? r[6] : [NO_UC], dep: r[7] >= 0 ? [r[7]] : [] }
    };
    rec._t = pad(rec.titulo);
    rec._f = pad([names("curso", r[5]), names("uc", r[6]), names("tipo", r[3]), names("area", r[4]), catInfo[r[2]].label].join(" "));
    rec._s = rec._t + rec._f + pad(rec.id + " " + rec.autor + " " + (r[7] >= 0 ? D.dep[r[7]] : ""));
    return rec;
  });

  // nomes normalizados e contagem total por valor de faceta (para sugestões)
  var NP = {}, GCOUNT = {};
  FACETS.forEach(function (f) {
    NP[f] = DIC[f].map(pad);
    GCOUNT[f] = DIC[f].map(function () { return 0; });
  });
  data.forEach(function (r) { FACETS.forEach(function (f) { r.f[f].forEach(function (v) { GCOUNT[f][v]++; }); }); });

  // Vocabulário (palavra sem acento -> forma exibida + frequência) para corrigir erros de digitação
  var VOCAB = (function () {
    var m = new Map();
    function add(text) {
      String(text).split(/[^0-9A-Za-zÀ-ÿ]+/).forEach(function (w) {
        if (w.length < 3) return;
        var k = norm(w), e = m.get(k);
        if (e) e.n++; else m.set(k, { k: k, d: w.toLowerCase(), n: 1 });
      });
    }
    data.forEach(function (r) { add(r.titulo); });
    ["curso", "uc", "tipo", "area", "dep", "cat"].forEach(function (f) { DIC[f].forEach(add); });
    return Array.from(m.values());
  })();

  // ---------- Estado ----------
  var state = { q: "", curso: -1, uc: -1, cat: -1, tipo: -1, area: -1, dep: -1, dl: false, ordem: "auto", limit: PAGE };
  var ui = { cursoQ: "", ucQ: "", gcUcQ: "", tiposAll: false, ucAll: false, exact: false, groups: [], hl: [] };
  var qMatch = null;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    q: $("q"), clearQ: $("clearQ"), acMain: $("acMain"), list: $("list"), count: $("count"), stats: $("stats"), ordem: $("ordem"),
    active: $("activeFilters"), notice: $("notice"), reset: $("resetFilters"), openFilters: $("openFilters"),
    filters: document.querySelector(".filters"), quick: $("quickCats"),
    cursoQ: $("cursoQ"), cursoList: $("cursoList"), ucQ: $("ucQ"), ucList: $("ucList"),
    catList: $("catList"), tipoList: $("tipoList"), area: $("area"), dep: $("dep"), dl: $("dl"), updated: $("updated"),
    guide: $("guide"), steps: $("steps"), guideStart: $("guideStart"), guideQ: $("guideQ"), acGuide: $("acGuide"), guidePopular: $("guidePopular"),
    guideCourse: $("guideCourse"), gcName: $("gcName"), gcMeta: $("gcMeta"), gcCats: $("gcCats"),
    gcUcPick: $("gcUcPick"), gcUcQ: $("gcUcQ"), gcUcs: $("gcUcs"), gcUcSel: $("gcUcSel")
  };

  // ---------- Utilidades ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function fmtN(n) { return n.toLocaleString("pt-BR"); }
  function fmtData(n) { if (!n) return ""; var s = String(n); return s.slice(6, 8) + "/" + s.slice(4, 6) + "/" + s.slice(0, 4); }
  function plural(n, s, p) { return fmtN(n) + " " + (n === 1 ? s : p); }
  function byName(dicArr) { return function (a, b) { return dicArr[a].localeCompare(dicArr[b], "pt-BR"); }; }
  function hlFrom(groups) {
    var hl = [];
    groups.forEach(function (g) { g.alts.forEach(function (a) { if (a.length > 2) hl.push(a); }); });
    return hl.sort(function (a, b) { return b.length - a.length; });
  }

  function highlight(text, hl) {
    hl = hl || ui.hl;
    var safe = esc(text);
    if (!hl.length) return safe;
    var n = norm(safe), out = "", i = 0;
    while (i < safe.length) {
      var hit = 0;
      if (safe[i] === "&") { var e = safe.indexOf(";", i) + 1; out += safe.slice(i, e); i = e; continue; }
      for (var k = 0; k < hl.length; k++) if (n.substr(i, hl[k].length) === hl[k]) { hit = hl[k].length; break; }
      if (hit) { out += "<mark>" + safe.substr(i, hit) + "</mark>"; i += hit; }
      else { out += safe[i]; i++; }
    }
    return out;
  }

  // ---------- Motor de busca ----------
  // variações simples de plural/gênero: "simuladores" -> "simulador", "elétrica" -> "eletric"
  function stems(t) {
    var out = [];
    if (t.length >= 6 && /oes$/.test(t)) out.push(t.slice(0, -3) + "ao");
    if (t.length >= 6 && /(res|zes|les)$/.test(t)) out.push(t.slice(0, -2));
    else if (t.length >= 5 && /s$/.test(t)) out.push(t.slice(0, -1));
    var base = out.length ? out[out.length - 1] : t;
    if (base.length >= 6 && /[ao]$/.test(base)) out.push(base.slice(0, -1));
    return out;
  }

  // distância de edição (conta troca de letras vizinhas como 1); interrompe acima de max
  function dist(a, b, max) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur = [i];
      var rowMin = i;
      for (j = 1; j <= lb; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[lb];
  }

  function existsInVocab(alts) {
    for (var a = 0; a < alts.length; a++) {
      if (alts[a].indexOf(" ") !== -1 || alts[a].length < 3) return true;
      for (var i = 0; i < VOCAB.length; i++) if (VOCAB[i].k.indexOf(alts[a]) !== -1) return true;
    }
    return false;
  }

  function fuzzy(t) {
    var max = t.length >= 7 ? 2 : 1, best = null, bestD = max + 1;
    for (var i = 0; i < VOCAB.length; i++) {
      var w = VOCAB[i];
      if (Math.abs(w.k.length - t.length) > max) continue;
      var d = dist(t, w.k, max);
      if (d < bestD || (d === bestD && best && w.n > best.n)) { best = w; bestD = d; }
    }
    return bestD <= max ? best : null;
  }

  // transforma o texto em grupos de termos; um grupo casa se qualquer uma das alternativas casar
  function parseQuery(text, exact) {
    var tokens = norm(text).replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
    var content = tokens.filter(function (t) { return !STOP[t]; });
    if (!content.length) content = tokens;
    return content.map(function (t) {
      var g = { t: t, alts: [t], syn: null, fixed: null, strict: false };
      var s = SINONIMOS[t];
      if (s) { g.syn = s[0]; g.alts = g.alts.concat(s.slice(1)); g.strict = t.length <= 3; }
      g.alts = g.alts.concat(stems(t));
      if (!exact && !s && t.length >= 4 && !/\d/.test(t) && !existsInVocab(g.alts)) {
        var c = fuzzy(t);
        if (c) { g.fixed = c.d; g.alts = [c.k].concat(stems(c.k)); }
      }
      g.alts = g.alts.filter(function (a, i, arr) { return arr.indexOf(a) === i; });
      return g;
    });
  }

  // siglas casam só a palavra inteira; termos de até 2 letras, o início de palavra
  function hit(s, alt, strict) {
    if (strict) return s.indexOf(" " + alt + " ") !== -1;
    if (alt.length <= 2) return s.indexOf(" " + alt) !== -1;
    return s.indexOf(alt) !== -1;
  }
  function groupHit(s, g) {
    for (var a = 0; a < g.alts.length; a++) if (hit(s, g.alts[a], g.strict && a === 0)) return true;
    return false;
  }
  function matchGroups(groups) {
    if (!groups.length) return null;
    var m = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
      var s = data[i]._s, ok = 1;
      for (var k = 0; k < groups.length; k++) if (!groupHit(s, groups[k])) { ok = 0; break; }
      m[i] = ok;
    }
    return m;
  }

  function computeQ() {
    ui.groups = parseQuery(state.q, ui.exact);
    ui.hl = hlFrom(ui.groups);
    qMatch = matchGroups(ui.groups);
  }

  function score(r, groups, phrase) {
    var s = 0;
    for (var k = 0; k < groups.length; k++) {
      var g = groups[k], w = g.fixed ? 0.7 : 1;
      if (groupHit(r._t, g)) s += 10 * w; else if (groupHit(r._f, g)) s += 4 * w; else s += 1;
    }
    if (phrase && r._t.indexOf(phrase) !== -1) s += 20;
    if (groups.length && r._t.indexOf(" " + groups[0].alts[0]) === 0) s += 3;
    return s;
  }

  // ---------- Filtragem ----------
  function pass(i, skip, opt) {
    opt = opt || {};
    var qm = opt.qm !== undefined ? opt.qm : qMatch;
    if (qm && !qm[i]) return false;
    var r = data[i];
    if (state.dl && !opt.noDl && !r.download) return false;
    if (opt.noFacets) return true;
    for (var k = 0; k < FACETS.length; k++) {
      var f = FACETS[k];
      if (f === skip || state[f] < 0) continue;
      if (r.f[f].indexOf(state[f]) === -1) return false;
    }
    return true;
  }
  function countWhere(skip, opt) { var n = 0; for (var i = 0; i < data.length; i++) if (pass(i, skip, opt)) n++; return n; }

  function facetCounts(facet) {
    var c = {};
    for (var i = 0; i < data.length; i++) {
      if (!pass(i, facet)) continue;
      var v = data[i].f[facet];
      for (var k = 0; k < v.length; k++) c[v[k]] = (c[v[k]] || 0) + 1;
    }
    return c;
  }
  function sortedByCount(counts, dicArr) {
    return Object.keys(counts).map(Number).sort(function (a, b) { return counts[b] - counts[a] || dicArr[a].localeCompare(dicArr[b], "pt-BR"); });
  }

  // ---------- Autocompletar ----------
  function matchFacet(f, groups, limit) {
    // com várias palavras, aceita valores que casam com parte delas (o resto continua como busca)
    var res = [], hits = {}, pre = {};
    for (var i = 0; i < DIC[f].length; i++) {
      if (!GCOUNT[f][i] || (f === "uc" && i === NO_UC)) continue;
      var s = NP[f][i], m = 0, p = 0;
      for (var k = 0; k < groups.length; k++) {
        if (!groupHit(s, groups[k])) continue;
        m++;
        if (groups[k].alts.some(function (a) { return s.indexOf(" " + a) !== -1; })) p++;
      }
      if (m) { res.push(i); hits[i] = m; pre[i] = p; }
    }
    res.sort(function (a, b) { return hits[b] - hits[a] || pre[b] - pre[a] || GCOUNT[f][b] - GCOUNT[f][a]; });
    return res.slice(0, limit).map(function (i) { return { kind: "facet", facet: f, v: i, label: DIC[f][i], count: GCOUNT[f][i] }; });
  }
  function topFacet(f, limit) {
    return GCOUNT[f].map(function (_, i) { return i; }).filter(function (i) { return !(f === "uc" && i === NO_UC); })
      .sort(function (a, b) { return GCOUNT[f][b] - GCOUNT[f][a]; }).slice(0, limit)
      .map(function (i) { return { kind: "facet", facet: f, v: i, label: DIC[f][i], count: GCOUNT[f][i] }; });
  }

  function optHtml(it, i, idp, hl) {
    var a = ' role="option" id="' + idp + i + '" data-i="' + i + '"';
    if (it.kind === "text") {
      return '<div class="ac__opt ac__opt--text"' + a + '><span class="ac__ic">' + svg("search") + '</span><span class="ac__main"><span class="ac__name">Buscar “<strong>' +
        esc(it.text) + '</strong>” em todo o acervo</span></span><span class="ac__meta">' + fmtN(it.count) + "</span></div>";
    }
    if (it.kind === "res") {
      var r = it.r, ci = catInfo[r.f.cat[0]], tipo = r.f.tipo.length ? D.tipo[r.f.tipo[0]] : "";
      return '<a class="ac__opt" href="' + RD_BASE + encodeURIComponent(r.id) + '" target="_blank" rel="noopener"' + a + ">" +
        '<span class="ac__ic ac__ic--solid" style="background:' + ci.cor + '">' + svg(ci.icon) + '</span><span class="ac__main"><span class="ac__name">' + highlight(r.titulo, hl) +
        '</span><span class="ac__sub">' + esc(ci.label + (tipo ? " · " + tipo : "")) + '</span></span><span class="ac__go" aria-hidden="true">↗</span></a>';
    }
    var icon = it.facet === "cat" ? '<span class="ac__ic ac__ic--solid" style="background:' + catInfo[it.v].cor + '">' + svg(catInfo[it.v].icon) + "</span>"
      : '<span class="ac__ic">' + svg(it.facet === "dep" ? "area" : it.facet) + "</span>";
    return '<div class="ac__opt"' + a + ">" + icon + '<span class="ac__main"><span class="ac__name">' + highlight(it.label, hl) + "</span></span>" +
      '<span class="ac__meta" title="recursos">' + fmtN(it.count) + "</span></div>";
  }

  function AC(o) {
    var items = [], active = -1;
    function open() {
      var res = o.provider(o.input.value), hl = res.hl || [];
      items = [];
      var html = res.sections.filter(function (s) { return s.items.length; }).map(function (s) {
        return '<div class="ac__sec" role="presentation">' + (s.label ? '<p class="ac__label" role="presentation">' + esc(s.label) + "</p>" : "") +
          s.items.map(function (it) { return optHtml(it, items.push(it) - 1, o.idp, hl); }).join("") + "</div>";
      }).join("");
      if (!items.length) {
        if (res.empty) { o.panel.innerHTML = '<p class="ac__empty">' + res.empty + "</p>"; show(); } else close();
        return;
      }
      o.panel.innerHTML = html; show(); setActive(-1);
    }
    function show() { o.panel.hidden = false; o.input.setAttribute("aria-expanded", "true"); }
    function close() { o.panel.hidden = true; o.input.setAttribute("aria-expanded", "false"); active = -1; o.input.removeAttribute("aria-activedescendant"); }
    function setActive(i) {
      active = i;
      var opts = o.panel.querySelectorAll("[data-i]");
      for (var k = 0; k < opts.length; k++) opts[k].classList.toggle("is-active", k === i);
      if (i >= 0 && opts[i]) { o.input.setAttribute("aria-activedescendant", o.idp + i); opts[i].scrollIntoView({ block: "nearest" }); }
      else o.input.removeAttribute("aria-activedescendant");
    }
    function pick(i) {
      var it = items[i]; close();
      if (it.kind === "res") { window.open(RD_BASE + it.r.id, "_blank", "noopener"); return; }
      o.onPick(it);
    }
    o.input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (o.panel.hidden) open();
        if (!items.length) return;
        var next = e.key === "ArrowDown" ? active + 1 : (active < 0 ? items.length - 1 : active - 1);
        setActive((next + items.length) % items.length);
      } else if (e.key === "Enter") {
        if (!o.panel.hidden && active >= 0) { e.preventDefault(); pick(active); }
        else { close(); if (o.onEnter) o.onEnter(); }
      } else if (e.key === "Escape") close();
    });
    o.input.addEventListener("focus", open);
    if (o.live) {
      var t;
      o.input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(open, 120); });
    }
    o.input.addEventListener("blur", function () { setTimeout(close, 150); });
    o.panel.addEventListener("mousedown", function (e) { e.preventDefault(); });
    o.panel.addEventListener("click", function (e) {
      var x = e.target.closest("[data-i]"); if (!x) return;
      var i = Number(x.getAttribute("data-i"));
      if (items[i].kind === "res") { close(); return; } // o link abre o RD normalmente
      e.preventDefault(); pick(i);
    });
    return { refresh: function () { if (document.activeElement === o.input) open(); }, close: close };
  }

  // sugestões da busca principal
  function mainProvider(text) {
    var t = text.trim();
    if (!t) {
      return { sections: [
        { label: "Cursos com mais materiais", items: topFacet("curso", 5) },
        { label: "Tipos de material mais comuns", items: topFacet("tipo", 5) }
      ] };
    }
    var same = t === state.q;
    var groups = same ? ui.groups : parseQuery(t, ui.exact);
    var qm = same ? qMatch : matchGroups(groups);
    var total = 0, top = [], phrase = pad(t).trim();
    for (var i = 0; i < data.length; i++) if (!qm || qm[i]) { total++; top.push(data[i]); }
    top.forEach(function (r) { r._sc = score(r, groups, phrase); });
    top.sort(function (a, b) { return b._sc - a._sc || b.data - a.data; });
    return {
      hl: same ? ui.hl : hlFrom(groups),
      sections: [
        { label: "", items: [{ kind: "text", text: t, count: total }] },
        { label: "Cursos", items: matchFacet("curso", groups, 4) },
        { label: "Unidades curriculares", items: matchFacet("uc", groups, 4) },
        { label: "Tipos e categorias", items: matchFacet("cat", groups, 2).concat(matchFacet("tipo", groups, 3)) },
        { label: "Áreas tecnológicas", items: matchFacet("area", groups, 2) },
        { label: "Materiais", items: top.slice(0, 5).map(function (r) { return { kind: "res", r: r }; }) }
      ]
    };
  }

  // tira da busca os termos que viraram filtro ("mecatrônica scorm" + curso Mecatrônica -> "scorm")
  function pickFacet(it, keepQuery) {
    change(function () {
      if (keepQuery !== false) {
        var rest = ui.groups.filter(function (g) { return !groupHit(NP[it.facet][it.v], g); }).map(function (g) { return g.t; });
        state.q = rest.join(" "); el.q.value = state.q; computeQ();
      }
      state[it.facet] = it.v;
      if (it.facet === "curso") state.uc = -1;
    });
  }

  var acMain = AC({
    input: el.q, panel: el.acMain, idp: "acm-", provider: mainProvider,
    onPick: function (it) { if (it.kind === "facet") pickFacet(it); else flushSearch(); scrollToResults(); },
    onEnter: function () { flushSearch(); scrollToResults(); }
  });

  AC({
    input: el.guideQ, panel: el.acGuide, idp: "acg-", live: true,
    provider: function (text) {
      var t = text.trim();
      if (!t) return { sections: [{ label: "Cursos com mais materiais", items: topFacet("curso", 6) }] };
      var groups = parseQuery(t), cursos = matchFacet("curso", groups, 8);
      return {
        hl: hlFrom(groups),
        sections: [{ label: "Cursos", items: cursos }, { label: "Ou comece pela unidade curricular", items: cursos.length < 3 ? matchFacet("uc", groups, 4) : [] }],
        empty: "Nenhum curso encontrado para “" + esc(t) + "”. Tente parte do nome, como “mecânica” ou “logística”."
      };
    },
    onPick: function (it) { el.guideQ.value = ""; pickFacet(it, false); }
  });

  // ---------- Render: filtros laterais ----------
  function chip(facet, i, label, n, pressed, dot) {
    return '<button type="button" class="chip" data-facet="' + facet + '" data-v="' + i + '" aria-pressed="' + pressed + '">' +
      (dot ? '<span class="chip__dot" style="background:' + dot + '"></span>' : "") +
      '<span class="chip__label">' + esc(label) + '</span><span class="chip__count">' + fmtN(n) + "</span></button>";
  }

  function renderSearchList(facet, qText, listEl, noun) {
    var counts = facetCounts(facet), dicArr = DIC[facet], sel = state[facet];
    var ids = sortedByCount(counts, dicArr), total = ids.length;
    var nq = norm(qText.trim());
    if (nq) ids = ids.filter(function (i) { return norm(dicArr[i]).indexOf(nq) !== -1; }).sort(byName(dicArr));
    var max = 40, shown = ids.slice(0, max);
    if (sel >= 0) { shown = shown.filter(function (i) { return i !== sel; }); shown.unshift(sel); }
    var html = shown.map(function (i) { return chip(facet, i, dicArr[i], counts[i] || 0, i === sel); }).join("");
    if (!shown.length) html = '<p class="empty-hint">' + (nq ? "Nenhum resultado para “" + esc(qText) + "”." : "Nenhuma opção com os filtros atuais.") + "</p>";
    else if (ids.length > max) html += '<p class="empty-hint">Mostrando ' + max + " de " + fmtN(ids.length) + ". Digite para encontrar " + noun + ".</p>";
    listEl.innerHTML = html;
    return total;
  }

  function catIds(counts, sel) {
    return CAT_ORDER.map(function (slug) { return D.cat.indexOf(slug); }).filter(function (i) { return i >= 0 && (counts[i] || i === sel); });
  }

  function renderCats() {
    var counts = facetCounts("cat");
    el.catList.innerHTML = catIds(counts, state.cat).map(function (i) {
      return chip("cat", i, catInfo[i].label, counts[i] || 0, i === state.cat, catInfo[i].cor);
    }).join("") || '<p class="empty-hint">Nenhuma categoria.</p>';
  }

  function renderTipos() {
    var counts = facetCounts("tipo"), ids = sortedByCount(counts, D.tipo);
    var lim = 12, extra = ids.length - lim;
    var shown = ui.tiposAll ? ids : ids.slice(0, lim);
    if (state.tipo >= 0 && shown.indexOf(state.tipo) === -1) shown.push(state.tipo);
    el.tipoList.innerHTML = (shown.map(function (i) { return chip("tipo", i, D.tipo[i], counts[i] || 0, i === state.tipo); }).join("") ||
      '<p class="empty-hint">Nenhum tipo disponível.</p>') +
      (extra > 0 ? '<button type="button" class="link-btn" id="moreTipos">' + (ui.tiposAll ? "Ver menos" : "Ver todos (+" + extra + ")") + "</button>" : "");
  }

  function renderSelect(facet, selectEl, allLabel) {
    var counts = facetCounts(facet), dicArr = DIC[facet];
    var ids = dicArr.map(function (_, i) { return i; }).filter(function (i) { return counts[i] || i === state[facet]; }).sort(byName(dicArr));
    selectEl.innerHTML = '<option value="-1">' + allLabel + "</option>" + ids.map(function (i) {
      return '<option value="' + i + '"' + (i === state[facet] ? " selected" : "") + ">" + esc(dicArr[i]) + " (" + fmtN(counts[i] || 0) + ")</option>";
    }).join("");
  }

  function renderActive() {
    var tags = [];
    if (state.q) tags.push(["q", "Busca: “" + state.q + "”"]);
    FACETS.forEach(function (f) { if (state[f] >= 0) tags.push([f, DIC[f][state[f]]]); });
    if (state.dl) tags.push(["dl", "Com download liberado"]);
    el.active.innerHTML = tags.map(function (t) {
      return '<button type="button" class="tag-remove" data-remove="' + t[0] + '" aria-label="Remover filtro ' + esc(t[1]) + '">' +
        '<span class="tag-remove__label">' + esc(t[1]) + '</span><span aria-hidden="true">×</span></button>';
    }).join("") + (tags.length > 1 ? '<button type="button" class="link-btn" data-remove="all">Limpar tudo</button>' : "");
  }

  function renderQuick() {
    var counts = facetCounts("cat");
    el.quick.innerHTML = CAT_ORDER.map(function (slug) {
      var i = D.cat.indexOf(slug); if (i < 0) return "";
      var c = catInfo[i];
      return '<button type="button" class="quick" data-facet="cat" data-v="' + i + '" aria-pressed="' + (i === state.cat) + '">' +
        '<span class="quick__icon" style="background:' + c.cor + '">' + svg(c.icon) + "</span>" +
        '<span class="quick__label">' + esc(c.label) + '</span><span class="quick__count">' + fmtN(counts[i] || 0) + "</span></button>";
    }).join("");
  }

  // ---------- Render: caminho guiado (Curso -> UC -> Materiais) ----------
  function renderGuide() {
    var show = !(state.q && state.curso < 0);
    el.guide.hidden = !show;
    if (!show) return;
    var step = state.curso < 0 ? 1 : state.uc < 0 ? 2 : 3;
    el.steps.innerHTML = ["Curso", "Unidade curricular", "Materiais"].map(function (s, i) {
      var n = i + 1, cls = n < step ? "is-done" : n === step ? "is-current" : "";
      return '<li class="step ' + cls + '"' + (n === step ? ' aria-current="step"' : "") + '><span class="step__n">' + (n < step ? "✓" : n) + "</span>" + s + "</li>";
    }).join("");

    el.guideStart.hidden = step !== 1;
    el.guideCourse.hidden = step === 1;

    if (step === 1) {
      var cc = facetCounts("curso");
      el.guidePopular.innerHTML = sortedByCount(cc, D.curso).slice(0, 8).map(function (i) {
        return '<button type="button" class="chip" data-facet="curso" data-v="' + i + '">' + esc(D.curso[i]) + '<span class="chip__count">' + fmtN(cc[i]) + "</span></button>";
      }).join("");
      return;
    }

    var ucCounts = facetCounts("uc");
    var nUcs = Object.keys(ucCounts).filter(function (k) { return Number(k) !== NO_UC; }).length;
    el.gcName.textContent = D.curso[state.curso];
    el.gcMeta.textContent = plural(countWhere("uc"), "material", "materiais") + " em " + plural(nUcs, "unidade curricular", "unidades curriculares");

    var catC = facetCounts("cat");
    el.gcCats.innerHTML = catIds(catC, state.cat).map(function (i) {
      return chip("cat", i, catInfo[i].label, catC[i] || 0, i === state.cat, catInfo[i].cor);
    }).join("");

    var nCurso = countWhere("uc");
    el.gcUcPick.hidden = step !== 2 || !nCurso;
    el.gcUcSel.hidden = step !== 3;
    if (step === 2) renderUcTiles(ucCounts);
    else {
      el.gcUcSel.innerHTML = '<span class="guide__ucsel-label">Unidade curricular</span><strong>' + esc(D.uc[state.uc]) + "</strong>" +
        '<span class="guide__ucsel-n">' + plural(countWhere(), "material", "materiais") + "</span>" +
        '<button type="button" class="link-btn" data-remove="uc">Trocar unidade</button>';
    }
  }

  function renderUcTiles(counts) {
    counts = counts || facetCounts("uc");
    // principais UCs do curso primeiro (mais materiais); ao filtrar, ordem alfabética
    var ids = sortedByCount(counts, D.uc).filter(function (i) { return i !== NO_UC; });
    var nq = norm(ui.gcUcQ.trim());
    if (nq) ids = ids.filter(function (i) { return norm(D.uc[i]).indexOf(nq) !== -1; }).sort(byName(D.uc));
    var lim = 12, shown = ui.ucAll || nq ? ids : ids.slice(0, lim);
    var html = shown.map(function (i) {
      return '<button type="button" class="uc-tile" data-facet="uc" data-v="' + i + '"><span class="uc-tile__name">' + esc(D.uc[i]) +
        '</span><span class="uc-tile__n">' + plural(counts[i], "material", "materiais") + "</span></button>";
    }).join("");
    if (!nq && counts[NO_UC]) {
      html += '<button type="button" class="uc-tile uc-tile--geral" data-facet="uc" data-v="' + NO_UC + '"><span class="uc-tile__name">Materiais gerais do curso</span>' +
        '<span class="uc-tile__n">' + plural(counts[NO_UC], "material sem UC", "materiais sem UC") + "</span></button>";
    }
    if (!html) html = '<p class="empty-hint">Nenhuma unidade curricular com “' + esc(ui.gcUcQ) + "”.</p>";
    el.gcUcs.innerHTML = html;
    var more = !nq && ids.length > lim
      ? '<button type="button" class="link-btn guide__more" id="ucAll">' + (ui.ucAll ? "Ver menos" : "Ver todas as " + ids.length + " unidades") + "</button>" : "";
    var holder = $("ucMore"); if (holder) holder.innerHTML = more;
  }

  // ---------- Render: avisos da busca ----------
  function renderNotice() {
    var fixed = ui.groups.filter(function (g) { return g.fixed; });
    var syn = ui.groups.filter(function (g) { return g.syn; });
    var html = "";
    if (fixed.length) {
      html += '<div class="notice">' + svg("search") + "<p>Mostrando resultados para <strong>" +
        fixed.map(function (g) { return esc(g.fixed); }).join(", ") + "</strong>. " +
        '<button type="button" class="link-btn" id="exactSearch">Buscar exatamente “' + esc(fixed.map(function (g) { return g.t; }).join(" ")) + "”</button></p></div>";
    }
    if (syn.length) {
      html += '<div class="notice notice--soft"><p>Também buscamos por ' + syn.map(function (g) {
        return "<strong>" + esc(g.syn) + "</strong> (" + esc(g.t.toUpperCase()) + ")";
      }).join(", ") + ".</p></div>";
    }
    el.notice.innerHTML = html;
  }

  // ---------- Render: resultados ----------
  function moreLabel(facet, idxs) {
    idxs = idxs.filter(function (i) { return !(facet === "uc" && i === NO_UC); });
    if (!idxs.length) return "";
    var first = DIC[facet][state[facet] >= 0 && idxs.indexOf(state[facet]) !== -1 ? state[facet] : idxs[0]];
    return first + (idxs.length > 1 ? " +" + (idxs.length - 1) : "");
  }

  function card(r) {
    var ci = catInfo[r.f.cat[0]];
    var tipo = r.f.tipo.length ? D.tipo[r.f.tipo[0]] + (r.f.tipo.length > 1 ? " +" + (r.f.tipo.length - 1) : "") : "";
    var area = r.f.area.length ? D.area[r.f.area[0]] : "";
    var subs = [];
    if (state.uc < 0) subs.push(moreLabel("uc", r.f.uc));
    if (state.curso < 0) subs.push(moreLabel("curso", r.f.curso));
    subs = subs.filter(Boolean);
    var dep = r.f.dep.length ? r.f.dep[0] : -1;

    return '<article class="card" style="--c:' + ci.cor + '">' +
      '<span class="card__icon" aria-hidden="true">' + svg(ci.icon) + "</span>" +
      '<div class="card__head"><span class="card__kind"><span class="card__cat">' + esc(ci.label) + "</span>" +
      (tipo ? '<span class="card__sep"> · </span><span class="card__tipo">' + esc(tipo) + "</span>" : "") + "</span>" +
      (area ? '<span class="card__pill" title="Área tecnológica: ' + esc(area) + '">' + esc(area) + "</span>" : "") + "</div>" +
      '<h3 class="card__title"><a class="card__link" href="' + RD_BASE + encodeURIComponent(r.id) + '" target="_blank" rel="noopener" ' +
      'aria-label="' + esc(r.titulo + " (" + ci.label + "). Abre no RD em nova aba") + '">' + highlight(r.titulo) + "</a></h3>" +
      subs.map(function (s, i) { return '<p class="card__sub' + (i ? " card__sub--2" : "") + '" title="' + esc(s) + '">' + highlight(s) + "</p>"; }).join("") +
      '<div class="card__foot">' +
      (dep >= 0 ? '<button type="button" class="card__dep" data-facet="dep" data-v="' + dep + '" title="Ver materiais de ' + esc(D.dep[dep]) + '">' + esc(D.dep[dep]) + "</button>" : "") +
      (r.data ? "<span>" + fmtData(r.data) + "</span>" : "") +
      (r.download ? "" : '<span class="badge" title="O RD não permite baixar este recurso; ele pode ser visualizado lá">Só visualização</span>') +
      "</div></article>";
  }

  function effectiveOrder() {
    if (state.ordem !== "auto") {
      if (state.ordem === "uc" && state.curso < 0) return "recentes";
      if (state.ordem === "relevancia" && !state.q) return "recentes";
      return state.ordem;
    }
    if (state.q) return "relevancia";
    if (state.uc >= 0) return "cat";
    if (state.curso >= 0) return "uc";
    return "recentes";
  }

  function renderOrdem() {
    var eff = effectiveOrder();
    var opts = [["relevancia", "Mais relevantes", !!state.q], ["uc", "Agrupar por unidade curricular", state.curso >= 0],
      ["cat", "Agrupar por categoria", true], ["recentes", "Mais recentes", true], ["az", "Título A–Z", true]];
    el.ordem.innerHTML = opts.filter(function (o) { return o[2]; }).map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === eff ? " selected" : "") + ">" + o[1] + "</option>";
    }).join("");
  }

  // Resultado vazio: sugere o que afrouxar, já com a quantidade de resultados de cada opção
  function renderEmpty() {
    var opts = [];
    FACETS.forEach(function (f) {
      if (state[f] < 0) return;
      var n = countWhere(f);
      if (n) opts.push({ n: n, attr: 'data-relax="facet:' + f + '"', label: "Sem o filtro “" + DIC[f][state[f]] + "”" });
    });
    if (state.dl) { var nd = countWhere(null, { noDl: true }); if (nd) opts.push({ n: nd, attr: 'data-relax="dl"', label: "Incluir recursos só para visualização" }); }
    if (ui.groups.length > 1) {
      ui.groups.forEach(function (g, i) {
        var n = countWhere(null, { qm: matchGroups(ui.groups.filter(function (_, k) { return k !== i; })) });
        if (n) opts.push({ n: n, attr: 'data-relax="term:' + i + '"', label: "Buscar sem a palavra “" + g.t + "”" });
      });
    }
    var hasFacets = FACETS.some(function (f) { return state[f] >= 0; }) || state.dl;
    if (state.q && hasFacets) {
      var ng = countWhere(null, { noFacets: true, noDl: true });
      if (ng) opts.push({ n: ng, attr: 'data-relax="global"', label: "Buscar “" + state.q + "” em todo o acervo" });
    }
    if (state.q && ui.exact) {
      var nf = countWhere(null, { qm: matchGroups(parseQuery(state.q, false)) });
      if (nf) opts.push({ n: nf, attr: 'data-relax="fuzzy"', label: "Permitir correção de digitação" });
    }
    opts.sort(function (a, b) { return b.n - a.n; });

    var where = FACETS.filter(function (f) { return state[f] >= 0; }).map(function (f) { return "<strong>" + esc(DIC[f][state[f]]) + "</strong>"; });
    var msg = state.q ? "Não encontramos “<strong>" + esc(state.q) + "</strong>”" + (where.length ? " em " + where.join(" + ") : "") + "."
      : "Nenhum recurso com essa combinação de filtros.";

    el.list.innerHTML = '<div class="empty"><h3>Nenhum recurso encontrado</h3><p>' + msg + "</p>" +
      (opts.length ? '<p class="empty__hint">Experimente:</p><div class="relax">' + opts.slice(0, 5).map(function (o) {
        return '<button type="button" class="relax__btn" ' + o.attr + "><span>" + esc(o.label) + '</span><span class="chip__count">' + plural(o.n, "recurso", "recursos") + "</span></button>";
      }).join("") + "</div>"
        : '<p class="empty__hint">Confira a grafia ou use palavras mais gerais, como o nome da unidade curricular.</p>' +
          '<button type="button" class="btn btn--outline" data-remove="all">Limpar filtros</button>') + "</div>";
  }

  function renderList() {
    var items = [];
    for (var i = 0; i < data.length; i++) if (pass(i)) items.push(data[i]);
    el.count.innerHTML = "<strong>" + fmtN(items.length) + "</strong> " + (items.length === 1 ? "recurso encontrado" : "recursos encontrados");
    if (!items.length) { renderEmpty(); return; }

    var ord = effectiveOrder();
    var byTitle = function (a, b) { return a.titulo.localeCompare(b.titulo, "pt-BR", { numeric: true }); };
    var byDate = function (a, b) { return b.data - a.data || b.id - a.id; };
    var grouped = false, groupTitle = null;

    if (ord === "relevancia") {
      var phrase = pad(state.q).trim();
      items.forEach(function (r) { r._sc = score(r, ui.groups, phrase); });
      items.sort(function (a, b) { return b._sc - a._sc || byDate(a, b); });
    } else if (ord === "az") items.sort(byTitle);
    else if (ord === "uc") {
      grouped = true;
      groupTitle = function (k) { return esc(k === NO_UC ? "Materiais gerais do curso (sem unidade curricular)" : D.uc[k]); };
      items.forEach(function (r) {
        r._g = state.uc >= 0 && r.f.uc.indexOf(state.uc) !== -1 ? state.uc : r.f.uc[0];
        r._gs = r._g === NO_UC ? "￿" : D.uc[r._g];
      });
      items.sort(function (a, b) { return a._gs.localeCompare(b._gs, "pt-BR") || byTitle(a, b); });
    } else if (ord === "cat") {
      grouped = true;
      groupTitle = function (k) { return '<span class="group__dot" style="background:' + catInfo[k].cor + '"></span>' + esc(catInfo[k].label); };
      items.forEach(function (r) { r._g = r.f.cat[0]; r._gs = CAT_ORDER.indexOf(D.cat[r._g]); });
      items.sort(function (a, b) { return a._gs - b._gs || byDate(a, b); });
    } else items.sort(byDate);

    var page = items.slice(0, state.limit), html;
    if (grouped) {
      var totals = {}, groups = [], cur = null;
      items.forEach(function (r) { totals[r._g] = (totals[r._g] || 0) + 1; });
      page.forEach(function (r) {
        if (!cur || cur.key !== r._g) { cur = { key: r._g, items: [] }; groups.push(cur); }
        cur.items.push(r);
      });
      html = groups.map(function (g) {
        return '<section class="group"><div class="group__head"><h2 class="group__title">' + groupTitle(g.key) + '</h2><span class="group__meta">' +
          plural(totals[g.key], "recurso", "recursos") + '</span></div><div class="grid">' + g.items.map(card).join("") + "</div></section>";
      }).join("");
    } else html = '<div class="grid">' + page.map(card).join("") + "</div>";

    if (items.length > page.length) {
      html += '<div class="more"><p>Mostrando ' + fmtN(page.length) + " de " + fmtN(items.length) + "</p>" +
        '<button type="button" class="btn btn--primary" id="loadMore">Mostrar mais ' + Math.min(PAGE, items.length - page.length) + "</button></div>";
    }
    el.list.innerHTML = html;
  }

  // ---------- Estado na URL ----------
  var KEYS = { q: "q", curso: "curso", uc: "uc", cat: "categoria", tipo: "tipo", area: "area", dep: "departamento" };
  function writeHash() {
    var p = [];
    Object.keys(KEYS).forEach(function (k) {
      var v = k === "q" ? state.q : (state[k] >= 0 ? DIC[k][state[k]] : "");
      if (v) p.push(KEYS[k] + "=" + encodeURIComponent(v));
    });
    if (state.dl) p.push("download=1");
    try { history.replaceState(null, "", p.length ? "#" + p.join("&") : location.pathname + location.search); } catch (e) {}
  }
  function readHash() {
    var h = (location.hash || "").replace(/^#/, "");
    if (!h) return;
    h.split("&").forEach(function (pair) {
      var kv = pair.split("="), key = kv[0], v;
      try { v = decodeURIComponent((kv[1] || "").replace(/\+/g, " ")); } catch (e) { return; }
      if (key === "download") { state.dl = v === "1"; return; }
      Object.keys(KEYS).forEach(function (k) {
        if (KEYS[k] !== key) return;
        if (k === "q") state.q = v; else state[k] = DIC[k].indexOf(v);
      });
    });
  }

  // ---------- Ciclo ----------
  function render() {
    el.clearQ.hidden = !el.q.value;
    el.dl.checked = state.dl;
    renderQuick();
    var nc = renderSearchList("curso", ui.cursoQ, el.cursoList, "o seu curso");
    el.cursoQ.placeholder = "Filtrar entre " + fmtN(nc) + " cursos…";
    var nu = renderSearchList("uc", ui.ucQ, el.ucList, "a sua unidade curricular");
    el.ucQ.placeholder = "Filtrar entre " + fmtN(nu) + " unidades…";
    renderCats();
    renderTipos();
    renderSelect("area", el.area, "Todas as áreas");
    renderSelect("dep", el.dep, "Todos os departamentos");
    renderGuide();
    renderActive();
    renderNotice();
    renderOrdem();
    renderList();
    writeHash();
  }

  function change(fn) { fn(); state.limit = PAGE; render(); }

  function removeFilter(what) {
    change(function () {
      if (what === "all") {
        state.q = ""; el.q.value = ""; state.dl = false; ui.exact = false;
        FACETS.forEach(function (f) { state[f] = -1; });
        ui.cursoQ = ui.ucQ = ui.gcUcQ = ""; el.cursoQ.value = el.ucQ.value = el.gcUcQ.value = "";
        computeQ();
      } else if (what === "q") { state.q = ""; el.q.value = ""; ui.exact = false; computeQ(); }
      else if (what === "dl") state.dl = false;
      else { state[what] = -1; if (what === "curso") state.uc = -1; if (what === "uc") { ui.gcUcQ = ""; el.gcUcQ.value = ""; } }
    });
  }

  function relax(how) {
    change(function () {
      var p = how.split(":");
      if (p[0] === "facet") state[p[1]] = -1;
      else if (p[0] === "dl") state.dl = false;
      else if (p[0] === "term") {
        state.q = ui.groups.filter(function (_, k) { return k !== Number(p[1]); }).map(function (g) { return g.t; }).join(" ");
        el.q.value = state.q; computeQ();
      } else if (p[0] === "global") { FACETS.forEach(function (f) { state[f] = -1; }); state.dl = false; }
      else if (p[0] === "fuzzy") { ui.exact = false; computeQ(); }
    });
  }

  function renderStats() {
    var cursos = {}, ucs = {};
    data.forEach(function (r) { r.f.curso.forEach(function (c) { cursos[c] = 1; }); r.f.uc.forEach(function (u) { if (u !== NO_UC) ucs[u] = 1; }); });
    el.stats.innerHTML =
      "<li><strong>" + fmtN(data.length) + "</strong>recursos públicos</li>" +
      "<li><strong>" + fmtN(Object.keys(cursos).length) + "</strong>cursos</li>" +
      "<li><strong>" + fmtN(Object.keys(ucs).length) + "</strong>unidades curriculares</li>" +
      "<li><strong>" + fmtN(D.tipo.length) + "</strong>tipos de material</li>";
    if (RAW.geradoEm) el.updated.textContent = "Base atualizada em " + RAW.geradoEm + ".";
  }

  function scrollToResults() { $("resultados").scrollIntoView({ behavior: "smooth", block: "start" }); }

  // ---------- Eventos ----------
  var debounce;
  function flushSearch() {
    clearTimeout(debounce);
    var v = el.q.value.trim();
    if (v === state.q) return;
    change(function () { state.q = v; ui.exact = false; computeQ(); });
  }
  el.q.addEventListener("input", function () {
    el.clearQ.hidden = !el.q.value;
    clearTimeout(debounce);
    debounce = setTimeout(function () { flushSearch(); acMain.refresh(); }, 160);
  });
  el.clearQ.addEventListener("click", function () { removeFilter("q"); el.q.focus(); });

  function listFilter(input, key, fn) {
    var t;
    input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { ui[key] = input.value; fn(); }, 120); });
  }
  listFilter(el.cursoQ, "cursoQ", function () { renderSearchList("curso", ui.cursoQ, el.cursoList, "o seu curso"); });
  listFilter(el.ucQ, "ucQ", function () { renderSearchList("uc", ui.ucQ, el.ucList, "a sua unidade curricular"); });
  listFilter(el.gcUcQ, "gcUcQ", function () { renderUcTiles(); });

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-facet]");
    if (b && !b.closest(".ac")) {
      var f = b.getAttribute("data-facet"), v = Number(b.getAttribute("data-v"));
      change(function () {
        state[f] = state[f] === v ? -1 : v;
        if (f === "curso") { state.uc = -1; ui.cursoQ = ""; el.cursoQ.value = ""; ui.ucAll = false; ui.gcUcQ = ""; el.gcUcQ.value = ""; }
        if (f === "uc") { ui.ucQ = ""; el.ucQ.value = ""; }
      });
      if (b.classList.contains("quick")) scrollToResults();
      return;
    }
    var rm = e.target.closest("[data-remove]");
    if (rm) { removeFilter(rm.getAttribute("data-remove")); return; }
    var rx = e.target.closest("[data-relax]");
    if (rx) { relax(rx.getAttribute("data-relax")); return; }
    var btn = e.target.closest("button"), id = btn ? btn.id : "";
    if (id === "moreTipos") { ui.tiposAll = !ui.tiposAll; renderTipos(); }
    else if (id === "ucAll") { ui.ucAll = !ui.ucAll; renderUcTiles(); }
    else if (id === "loadMore") { state.limit += PAGE; renderList(); }
    else if (id === "exactSearch") { change(function () { ui.exact = true; computeQ(); }); }
  });

  el.area.addEventListener("change", function () { change(function () { state.area = Number(el.area.value); }); });
  el.dep.addEventListener("change", function () { change(function () { state.dep = Number(el.dep.value); }); });
  el.dl.addEventListener("change", function () { change(function () { state.dl = el.dl.checked; }); });
  el.ordem.addEventListener("change", function () { state.ordem = el.ordem.value; state.limit = PAGE; renderList(); });
  el.reset.addEventListener("click", function () { removeFilter("all"); });
  el.openFilters.addEventListener("click", function () {
    var open = el.filters.classList.toggle("is-open");
    el.openFilters.textContent = open ? "Fechar filtros" : "Filtros";
  });
  // atalho: "/" foca a busca
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/input|select|textarea/i.test((document.activeElement || {}).tagName || "")) { e.preventDefault(); el.q.focus(); }
  });

  readHash();
  el.q.value = state.q;
  computeQ();
  renderStats();
  render();
})();
