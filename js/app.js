(function () {
  "use strict";

  var RD_BASE = "https://recursosdidaticos.senai.br/recurso-didatico/";

  var ICONS = {
    doc: '<path fill="currentColor" d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2z"/>',
    book: '<path fill="currentColor" d="M5 3h11a3 3 0 0 1 3 3v15H7a3 3 0 0 1-3-3V5a2 2 0 0 1 1-2zm2 14a1 1 0 0 0 0 2h10v-2H7z"/>',
    calendar: '<path fill="currentColor" d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3V2zm12 8H5v9h14v-9z"/>',
    target: '<path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>',
    package: '<path fill="currentColor" d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.3L5.5 8 12 11.7 18.5 8 12 4.3zM5 9.7v6.1l6 3.4v-6.1l-6-3.4zm14 0l-6 3.4v6.1l6-3.4V9.7z"/>',
    folder: '<path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"/>',
    play: '<path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm-2 6v8l6-4-6-4z"/>'
  };

  // Categorias de recurso: label, cor (paleta SENAI) e ícone
  var TIPOS = {
    "plano-ensino":          { label: "Plano de ensino",          cor: "#1670fa", icon: "doc" },
    "plano-aula":            { label: "Plano de aula",            cor: "#0f59e6", icon: "calendar" },
    "situacao-aprendizagem": { label: "Situação de aprendizagem", cor: "#f5631a", icon: "target" },
    "livro":                 { label: "Livro digital",            cor: "#bf340f", icon: "book" },
    "scorm":                 { label: "SCORM",                    cor: "#008257", icon: "package" },
    "video":                 { label: "Vídeo",                    cor: "#e31a1a", icon: "play" },
    "fontes":                { label: "Arquivos-fonte",           cor: "#617379", icon: "folder" }
  };

  var data = (window.RD_RECURSOS || []).map(function (r) {
    var t = TIPOS[r.tipo] || { label: r.tipo, cor: "#617379", icon: "doc" };
    return Object.assign({}, r, {
      tipoInfo: t,
      _search: norm([r.titulo, r.curso, r.uc, t.label, String(r.id)].join(" "))
    });
  });

  var state = { q: "", curso: "", uc: "", tipo: "", ordem: "uc" };

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    q: $("q"), clearQ: $("clearQ"), curso: $("curso"), ucList: $("ucList"), tipoList: $("tipoList"),
    list: $("list"), count: $("count"), stats: $("stats"), ordem: $("ordem"),
    active: $("activeFilters"), reset: $("resetFilters"), openFilters: $("openFilters"),
    filters: document.querySelector(".filters"), theme: $("themeToggle")
  };

  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function uniq(arr) { return Array.from(new Set(arr)).sort(function (a, b) { return a.localeCompare(b, "pt-BR"); }); }
  function countBy(arr, key) {
    return arr.reduce(function (m, r) { m[r[key]] = (m[r[key]] || 0) + 1; return m; }, {});
  }

  // Destaca termos da busca sem quebrar o HTML escapado
  function highlight(text) {
    var safe = esc(text);
    var terms = norm(state.q).split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) return safe;
    var n = norm(safe), out = "", i = 0;
    while (i < safe.length) {
      var hit = null;
      for (var k = 0; k < terms.length; k++) {
        if (n.substr(i, terms[k].length) === terms[k]) { hit = terms[k].length; break; }
      }
      if (hit) { out += "<mark>" + safe.substr(i, hit) + "</mark>"; i += hit; }
      else { out += safe[i]; i++; }
    }
    return out;
  }

  function matchQuery(r) {
    if (!state.q) return true;
    var terms = norm(state.q).split(/\s+/).filter(Boolean);
    return terms.every(function (t) { return r._search.indexOf(t) !== -1; });
  }

  // Cada faceta é calculada ignorando o próprio filtro, para mostrar contagens úteis
  function filtered(skip) {
    return data.filter(function (r) {
      return matchQuery(r) &&
        (skip === "curso" || !state.curso || r.curso === state.curso) &&
        (skip === "uc" || !state.uc || r.uc === state.uc) &&
        (skip === "tipo" || !state.tipo || r.tipo === state.tipo);
    });
  }

  function renderStats() {
    el.stats.innerHTML =
      "<li><strong>" + data.length + "</strong>recursos</li>" +
      "<li><strong>" + uniq(data.map(function (r) { return r.curso; })).length + "</strong>cursos</li>" +
      "<li><strong>" + uniq(data.map(function (r) { return r.curso + r.uc; })).length + "</strong>unidades curriculares</li>";
  }

  function renderCursos() {
    var counts = countBy(filtered("curso"), "curso");
    var cursos = uniq(data.map(function (r) { return r.curso; }));
    el.curso.innerHTML = '<option value="">Todos os cursos</option>' + cursos.map(function (c) {
      return '<option value="' + esc(c) + '"' + (c === state.curso ? " selected" : "") + ">" + esc(c) + " (" + (counts[c] || 0) + ")</option>";
    }).join("");
  }

  function renderUcs() {
    var base = filtered("uc");
    var counts = countBy(base, "uc");
    var ucs = uniq(data.filter(function (r) { return !state.curso || r.curso === state.curso; }).map(function (r) { return r.uc; }))
      .filter(function (u) { return counts[u] || u === state.uc; });
    if (!ucs.length) { el.ucList.innerHTML = '<p class="empty-hint">Nenhuma unidade curricular encontrada.</p>'; return; }
    el.ucList.innerHTML = ucs.map(function (u) {
      return '<button type="button" class="chip" data-uc="' + esc(u) + '" aria-pressed="' + (u === state.uc) + '">' +
        '<span class="chip__label">' + esc(u) + '</span><span class="chip__count">' + (counts[u] || 0) + "</span></button>";
    }).join("");
  }

  function renderTipos() {
    var counts = countBy(filtered("tipo"), "tipo");
    el.tipoList.innerHTML = Object.keys(TIPOS).filter(function (k) { return counts[k] || k === state.tipo; }).map(function (k) {
      var t = TIPOS[k];
      return '<button type="button" class="chip" data-tipo="' + k + '" aria-pressed="' + (k === state.tipo) + '">' +
        '<span class="chip__dot" style="background:' + t.cor + '"></span>' + esc(t.label) +
        '<span class="chip__count">' + (counts[k] || 0) + "</span></button>";
    }).join("") || '<p class="empty-hint">Nenhum tipo disponível.</p>';
  }

  function renderActive() {
    var tags = [];
    if (state.q) tags.push(["q", "Busca: “" + state.q + "”"]);
    if (state.curso) tags.push(["curso", state.curso]);
    if (state.uc) tags.push(["uc", state.uc]);
    if (state.tipo) tags.push(["tipo", TIPOS[state.tipo].label]);
    el.active.innerHTML = tags.map(function (t) {
      return '<button type="button" class="tag-remove" data-remove="' + t[0] + '" aria-label="Remover filtro ' + esc(t[1]) + '">' + esc(t[1]) + "<span aria-hidden=\"true\">×</span></button>";
    }).join("");
  }

  function card(r) {
    var t = r.tipoInfo;
    var meta = state.uc ? r.curso : r.uc + " · " + r.curso.split("|")[0].trim();
    return '<a class="card" href="' + RD_BASE + encodeURIComponent(r.id) + '" target="_blank" rel="noopener" ' +
      'aria-label="' + esc(t.label + ": " + r.titulo + " — " + r.uc + ". Abre no RD em nova aba") + '">' +
      '<span class="card__icon" style="background:' + t.cor + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[t.icon] + "</svg></span>" +
      '<span class="card__body">' +
      '<span class="card__type" style="color:' + t.cor + '">' + esc(t.label) + "</span>" +
      '<h3 class="card__title">' + highlight(r.titulo) + "</h3>" +
      '<span class="card__meta" title="' + esc(r.uc + " — " + r.curso) + '">' + highlight(meta) + "</span>" +
      "</span>" +
      '<span class="card__go" aria-hidden="true">↗</span></a>';
  }

  function group(title, meta, items) {
    return '<section class="group"><div class="group__head"><h2 class="group__title">' + esc(title) +
      '</h2><span class="group__meta">' + esc(meta) + "</span></div>" +
      '<div class="grid">' + items.map(card).join("") + "</div></section>";
  }

  function renderList() {
    var items = filtered();
    el.count.innerHTML = "<strong>" + items.length + "</strong> " + (items.length === 1 ? "recurso encontrado" : "recursos encontrados");

    if (!items.length) {
      el.list.innerHTML = '<div class="empty"><h3>Nenhum recurso encontrado</h3><p>Tente outro termo ou remova algum filtro.</p>' +
        '<button type="button" class="btn btn--outline" data-remove="all">Limpar filtros</button></div>';
      return;
    }

    var tipoOrder = Object.keys(TIPOS);
    var byTitle = function (a, b) { return a.titulo.localeCompare(b.titulo, "pt-BR", { numeric: true }); };
    var byTipo = function (a, b) { return tipoOrder.indexOf(a.tipo) - tipoOrder.indexOf(b.tipo) || byTitle(a, b); };

    if (state.ordem === "az") {
      el.list.innerHTML = '<div class="grid">' + items.slice().sort(byTitle).map(card).join("") + "</div>";
      return;
    }

    var key = state.ordem === "tipo" ? "tipo" : "uc";
    var groups = {};
    items.forEach(function (r) {
      var k = key === "uc" ? r.curso + "||" + r.uc : r.tipo;
      (groups[k] = groups[k] || []).push(r);
    });
    var keys = Object.keys(groups).sort(function (a, b) {
      return key === "tipo" ? tipoOrder.indexOf(a) - tipoOrder.indexOf(b) : a.localeCompare(b, "pt-BR");
    });
    el.list.innerHTML = keys.map(function (k) {
      var g = groups[k].sort(key === "uc" ? byTipo : byTitle);
      var n = g.length + (g.length === 1 ? " recurso" : " recursos");
      if (key === "tipo") return group(TIPOS[k] ? TIPOS[k].label : k, n, g);
      var parts = k.split("||");
      return group(parts[1], parts[0].split("|")[0].trim() + " · " + n, g);
    }).join("");
  }

  function render() {
    el.clearQ.hidden = !state.q;
    renderCursos();
    renderUcs();
    renderTipos();
    renderActive();
    renderList();
  }

  function removeFilter(what) {
    if (what === "all") { state.q = ""; state.curso = ""; state.uc = ""; state.tipo = ""; el.q.value = ""; }
    else if (what === "q") { state.q = ""; el.q.value = ""; }
    else state[what] = "";
    render();
  }

  // Eventos
  var debounce;
  el.q.addEventListener("input", function () {
    clearTimeout(debounce);
    debounce = setTimeout(function () { state.q = el.q.value.trim(); render(); }, 120);
  });
  el.clearQ.addEventListener("click", function () { removeFilter("q"); el.q.focus(); });
  el.curso.addEventListener("change", function () { state.curso = el.curso.value; state.uc = ""; render(); });
  el.ordem.addEventListener("change", function () { state.ordem = el.ordem.value; renderList(); });
  el.ucList.addEventListener("click", function (e) {
    var b = e.target.closest("[data-uc]"); if (!b) return;
    var uc = b.getAttribute("data-uc");
    state.uc = state.uc === uc ? "" : uc;
    if (state.uc && !state.curso) {
      var r = data.find(function (x) { return x.uc === uc; });
      if (r) state.curso = r.curso;
    }
    render();
  });
  el.tipoList.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tipo]"); if (!b) return;
    var t = b.getAttribute("data-tipo");
    state.tipo = state.tipo === t ? "" : t;
    render();
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-remove]"); if (b) removeFilter(b.getAttribute("data-remove"));
  });
  el.reset.addEventListener("click", function () { removeFilter("all"); });
  el.openFilters.addEventListener("click", function () {
    var open = el.filters.classList.toggle("is-open");
    el.openFilters.textContent = open ? "Fechar filtros" : "Filtros";
  });

  // Tema claro/escuro (classe .dark, como no Design System SENAI)
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("rd-theme"); } catch (e) {}
  if (saved === "dark" || (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) root.classList.add("dark");
  el.theme.addEventListener("click", function () {
    var dark = root.classList.toggle("dark");
    try { localStorage.setItem("rd-theme", dark ? "dark" : "light"); } catch (e) {}
  });

  renderStats();
  render();
})();
