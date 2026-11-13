(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var brl = function (n) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  function whatsUrl(msg) {
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(msg || S.mensagemPadrao);
  }

  /* ---------- Links de WhatsApp ---------- */
  $$(".js-whats").forEach(function (a) {
    a.href = whatsUrl();
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$(".js-whats-text").forEach(function (a) { a.textContent = S.whatsappTexto; });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Menu mobile + header ---------- */
  var burger = $("#burger"), nav = $("#nav"), header = $("#header");
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", false);
    });
  });
  var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 20); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Catálogo (cards + Swiper) ---------- */
  var list = $("#catalogList");
  list.innerHTML = S.servicos.map(function (s) {
    var preco = s.preco != null
      ? '<span class="price">' + brl(s.preco) + "</span>"
      : '<span class="price price--ask">Sob consulta</span>';
    var btnAdd = s.preco != null
      ? '<button type="button" class="btn btn--sm btn--soft" data-add="' + s.id + '"><i class="fa-solid fa-plus"></i> Orçamento</button>'
      : "";
    return (
      '<div class="swiper-slide">' +
      '<article class="card' + (s.destaque ? " card--hot" : "") + '">' +
      '<div class="card__media"><img src="' + s.img + '" alt="' + esc(s.nome) + '" loading="lazy" style="object-position:' + (s.pos || "center") + '" />' +
      '<span class="card__tag">' + esc(s.tag) + "</span></div>" +
      '<div class="card__body">' +
      '<div class="card__icon"><i class="' + s.icone + '"></i></div>' +
      "<h3>" + esc(s.nome) + "</h3><small>" + esc(s.subtitulo) + "</small>" +
      "<p>" + esc(s.descricao) + "</p>" +
      '<div class="card__foot">' + preco +
      '<div class="card__btns">' + btnAdd +
      '<a class="btn btn--sm btn--whats" target="_blank" rel="noopener" href="' +
      whatsUrl("Olá, Islane! Tenho interesse em: " + s.nome + (s.preco != null ? " (" + brl(s.preco) + ")" : "") + ". Pode me ajudar?") +
      '"><i class="fa-brands fa-whatsapp"></i> Pedir</a></div></div>' +
      "</div></article></div>"
    );
  }).join("");

  new Swiper(".catalog", {
    slidesPerView: 1.15,
    spaceBetween: 18,
    grabCursor: true,
    watchOverflow: true,
    pagination: { el: ".catalog .swiper-pagination", clickable: true },
    navigation: { nextEl: ".catalog .swiper-button-next", prevEl: ".catalog .swiper-button-prev" },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      1000: { slidesPerView: 3, spaceBetween: 24 },
      1250: { slidesPerView: 4, spaceBetween: 24 }
    }
  });

  /* ---------- Orçamento ---------- */
  var qty = {};
  var items = S.servicos.filter(function (s) { return s.preco != null; });
  items.forEach(function (s) { qty[s.id] = 0; });

  $("#quoteItems").innerHTML = items.map(function (s) {
    return (
      '<div class="qitem" data-id="' + s.id + '">' +
      '<div class="qitem__info"><i class="' + s.icone + '"></i><div><b>' + esc(s.nome) + "</b><small>" + brl(s.preco) + "</small></div></div>" +
      '<div class="stepper"><button type="button" data-dec="' + s.id + '" aria-label="Diminuir">−</button>' +
      '<output id="q-' + s.id + '">0</output>' +
      '<button type="button" data-inc="' + s.id + '" aria-label="Aumentar">+</button></div></div>'
    );
  }).join("");

  function byId(id) { return S.servicos.filter(function (s) { return s.id === id; })[0]; }

  // Se tiver mão + pé, troca pares por combo (R$ 50)
  function compute() {
    var m = qty.mao || 0, p = qty.pe || 0, c = qty.combo || 0;
    var pairs = Math.min(m, p);
    var lines = [];
    var total = 0;
    var combos = c + pairs;
    var restM = m - pairs, restP = p - pairs;
    if (combos > 0 && byId("combo")) { lines.push({ nome: byId("combo").nome, q: combos, un: byId("combo").preco }); total += combos * byId("combo").preco; }
    if (restM > 0) { lines.push({ nome: byId("mao").nome, q: restM, un: byId("mao").preco }); total += restM * byId("mao").preco; }
    if (restP > 0) { lines.push({ nome: byId("pe").nome, q: restP, un: byId("pe").preco }); total += restP * byId("pe").preco; }
    var original = m * byId("mao").preco + p * byId("pe").preco + c * byId("combo").preco;
    return { lines: lines, total: total, saved: original - total, pairs: pairs };
  }

  function refresh() {
    items.forEach(function (s) { $("#q-" + s.id).textContent = qty[s.id]; });
    $$(".qitem").forEach(function (el) { el.classList.toggle("is-on", qty[el.dataset.id] > 0); });
    var r = compute();
    $("#quoteTotal").textContent = brl(r.total);
    $("#comboTip").hidden = r.pairs === 0;
  }

  document.addEventListener("click", function (e) {
    var inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), add = e.target.closest("[data-add]");
    if (inc) { qty[inc.dataset.inc]++; refresh(); }
    if (dec) { qty[dec.dataset.dec] = Math.max(0, qty[dec.dataset.dec] - 1); refresh(); }
    if (add) {
      qty[add.dataset.add]++; refresh();
      $("#orcamento").scrollIntoView({ behavior: "smooth" });
    }
  });

  /* ---------- Seletor de data e horário (Flatpickr) ---------- */
  var ag = S.agenda || {};
  var whenPicker = null;
  if (window.flatpickr) {
    if (flatpickr.l10ns && flatpickr.l10ns.pt) flatpickr.localize(flatpickr.l10ns.pt);
    whenPicker = flatpickr("#qWhen", {
      enableTime: true,
      time_24hr: true,
      minuteIncrement: ag.intervaloMin || 30,
      minDate: "today",
      minTime: ag.horaMin || "08:00",
      maxTime: ag.horaMax || "20:00",
      defaultHour: 9,
      dateFormat: "Y-m-d H:i",
      altInput: true,
      altFormat: "l, d/m/Y - H:i",
      altInputClass: "fp-input",
      disableMobile: true, // mesmo visual no celular e no computador
      disable: [function (date) { return (ag.diasDeFolga || []).indexOf(date.getDay()) !== -1; }],
      locale: { firstDayOfWeek: 0 }
    });
  }

  $("#quoteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var r = compute();
    if (!r.lines.length) {
      alert("Escolha ao menos um serviço para montar o orçamento 💛");
      return;
    }
    var nome = $("#qName").value.trim(),
        quando = whenPicker ? whenPicker.altInput.value.trim() : $("#qWhen").value.trim(),
        obs = $("#qNotes").value.trim();
    var msg = "Olá, Islane! Vim pelo seu site e gostaria de solicitar:\n\n";
    r.lines.forEach(function (l) { msg += "• " + l.q + "x " + l.nome + " (" + brl(l.un) + ")\n"; });
    msg += "\nTotal estimado: " + brl(r.total);
    if (r.saved > 0) msg += " (já com desconto do combo)";
    if (nome) msg += "\nNome: " + nome;
    if (quando) msg += "\nPreferência de data/horário: " + quando;
    if (obs) msg += "\nObservações: " + obs;
    window.open(whatsUrl(msg), "_blank", "noopener");
  });
  refresh();

  /* ---------- Galeria (filtro + GLightbox) ---------- */
  var gal = $("#gallery");
  gal.innerHTML = S.galeria.map(function (g) {
    return (
      '<a href="' + g.src + '" class="glightbox gitem" data-cat="' + g.cat + '" data-gallery="galeria" data-title="' + esc(g.titulo) + '">' +
      '<img src="' + g.src + '" alt="' + esc(g.titulo) + '" loading="lazy" />' +
      '<span class="gitem__cap">' + esc(g.titulo) + "</span></a>"
    );
  }).join("");

  var lightbox = GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });

  $("#galleryFilters").addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    $$(".chip").forEach(function (c) { c.classList.toggle("is-active", c === b); });
    var f = b.dataset.filter;
    $$(".gitem").forEach(function (it) {
      var show = f === "all" || it.dataset.cat.split(" ").indexOf(f) !== -1;
      it.classList.toggle("is-hidden", !show);
      // GLightbox só deve navegar pelos itens visíveis
      it.classList.toggle("glightbox", show);
    });
    lightbox.destroy();
    lightbox = GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });
  });

  /* ---------- Animações ---------- */
  AOS.init({ duration: 700, once: true, offset: 60 });

  /* ---------- Mensagem de aniversário ---------- */
  var b = S.aniversario;
  if (b && b.ativo && !sessionStorage.getItem("bday-visto")) {
    $("#bdayMsg").textContent = b.texto;
    var box = $("#bday");
    box.hidden = false;
    var close = function () { box.hidden = true; sessionStorage.setItem("bday-visto", "1"); };
    $("#bdayClose").addEventListener("click", close);
    $("#bdayOk").addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
  }
})();
