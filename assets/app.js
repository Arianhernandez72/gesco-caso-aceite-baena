/* AOP Baena storefront — router, header menus, cart drawer, scroll-driven story,
   checkout, customer area and the case dossier. All imagery comes from window.ART. */
(function () {
  "use strict";

  var D = window.DATA, I = window.I18N, A = window.ART;
  var LOCALES = { fr: "fr-FR", es: "es-ES", en: "en-IE" };
  var FREE_FROM = 49, VAT = 0.055, CODE = "BAENA10";
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HOVER = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- state ---------------- */
  var store = { lang: "fr", cart: [], user: null, orders: [], promo: false, coStep: 1, coData: {}, lastOrder: null };
  function save(k, v) { try { localStorage.setItem("baena." + k, JSON.stringify(v)); } catch (e) {} }
  function load(k, d) { try { var r = localStorage.getItem("baena." + k); return r ? JSON.parse(r) : d; } catch (e) { return d; } }
  // French is the market language: default, overridden only by an explicit saved choice.
  store.lang = (function () { var s = load("lang", null); return (s && I[s]) ? s : "fr"; })();
  store.cart = load("cart", []) || [];
  store.user = load("user", null);
  store.orders = load("orders", []) || [];

  /* ---------------- helpers ---------------- */
  function t(k, vars) {
    var s = (I[store.lang] && I[store.lang][k]) || (I.fr && I.fr[k]) || k;
    if (vars) for (var p in vars) s = s.split("{" + p + "}").join(vars[p]);
    return s;
  }
  function L(o) { return o ? (o[store.lang] || o.fr || "") : ""; }
  function money(n) { try { return new Intl.NumberFormat(LOCALES[store.lang], { style: "currency", currency: "EUR" }).format(n); } catch (e) { return n.toFixed(2) + " €"; } }
  function num(n) { try { return new Intl.NumberFormat(LOCALES[store.lang]).format(n); } catch (e) { return String(n); } }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function h(html) { var d = document.createElement("div"); d.innerHTML = html; return d; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function ic(n, c) { return A.icon(n, c); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function stars(r) {
    var s = '<span class="stars" aria-label="' + r + '/5">';
    for (var i = 0; i < 5; i++) s += ic("star", i < Math.round(r) ? "" : "off");
    return s + "</span>";
  }
  function findItem(id) {
    var all = D.products.concat(D.accessories);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function isAcc(p) { return !p.rating; }
  function crumb(label) {
    return '<p class="breadcrumb"><a href="#/">' + esc(t("nav.home")) + "</a><span>/</span>" + esc(label) + "</p>";
  }

  var toastTimer = null;
  function toast(msg) {
    var old = $(".toast"); if (old) old.remove();
    var el = h('<div class="toast" role="status">' + ic("check") + "<span>" + esc(msg) + "</span></div>").firstChild;
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { if (el.parentNode) el.remove(); }, 2600);
  }

  /* ---------------- cart ---------------- */
  function cartQty() { return store.cart.reduce(function (a, l) { return a + l.q; }, 0); }
  function cartSub() { return store.cart.reduce(function (a, l) { var it = findItem(l.id); return a + (it ? it.price * l.q : 0); }, 0); }
  function discount() { return store.promo ? cartSub() * 0.1 : 0; }
  function shipCost() {
    if (!store.cart.length) return 0;
    var m = store.coData.ship || "correos", base = m === "mbe" ? 12.9 : m === "dhl" ? 9.9 : 6.9;
    if (m === "correos" && cartSub() - discount() >= FREE_FROM) return 0;
    return base;
  }
  function cartTotal() { return Math.max(0, cartSub() - discount()) + shipCost(); }
  function addToCart(id, q, quiet) {
    q = q || 1;
    var ln = store.cart.filter(function (l) { return l.id === id; })[0];
    if (ln) ln.q += q; else store.cart.push({ id: id, q: q });
    save("cart", store.cart);
    paintBadge(true);
    if (!quiet) openCart();
  }
  function setQty(id, q) {
    store.cart = store.cart.filter(function (l) { if (l.id !== id) return true; l.q = q; return q > 0; });
    save("cart", store.cart); paintBadge();
    paintDrawer();
    if ((location.hash || "#/") === "#/panier") render();
  }

  /* ---------------- leads (db capability) ---------------- */
  var dbP = null;
  function getDb() {
    if (dbP) return dbP;
    dbP = (window.claude && window.claude.use) ? window.claude.use("db").catch(function () { return null; }) : Promise.resolve(null);
    return dbP;
  }
  function saveLead(kind, payload) {
    return getDb().then(function (db) {
      if (!db) return false;
      var id = kind + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
      payload.kind = kind; payload.lang = store.lang; payload.createdAt = new Date().toISOString();
      return db.collection("leads").doc(id).set(payload).then(function () { return true; });
    }).catch(function () { return false; });
  }

  /* ================================================================ chrome */
  function megaMenu() {
    var cards = D.products.map(function (p) {
      return '<a class="mega-card" href="#/produit/' + p.id + '">' + A.pack(p.id, { label: L(p.name) }) +
        "<strong>" + esc(L(p.name)) + '</strong><span class="mc-d">' + ic(p.icon) + esc(L(p.diff)) + "</span>" +
        '<span class="mc-p tnum">' + money(p.price) + "</span></a>";
    }).join("");
    return '<div class="menu mega" role="menu"><div class="mega-grid">' + cards + "</div>" +
      '<div class="mega-side"><span class="mega-h">' + esc(t("mega.h")) + "</span>" +
      menuLink("#/produits", "store", t("mega.all"), t("shop.lede").split(".")[0]) +
      menuLink("#/produit/verres", "glass", t("mega.acc"), L(findItem("verres").name)) +
      menuLink("#/produit/cadeau", "gift", t("mega.gifts"), L(findItem("cadeau").name)) +
      menuLink("#/#story", "leaf", t("mega.process"), t("story.h2")) +
      "</div></div>";
  }
  function menuLink(href, icon, title, sub) {
    return '<a href="' + href + '" role="menuitem"><span class="mi-ic">' + ic(icon) + '</span><span class="mi-t">' + esc(title) +
      (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span></a>";
  }

  function paintHeader() {
    var cur = location.hash || "#/";
    function cur_(r) { return (cur === r || cur.indexOf(r + "/") === 0) ? ' aria-current="page"' : ""; }
    var langs = [["fr", "Français"], ["es", "Español"], ["en", "English"]];
    $("#hdr").innerHTML =
      '<div class="topbar"><div class="wrap">' +
        '<span class="on">' + ic("truck") + esc(t("top.1")) + "</span>" +
        "<span>" + ic("gift") + esc(t("top.2")) + "</span>" +
        "<span>" + ic("seal") + esc(t("top.3")) + "</span>" +
      "</div></div>" +
      '<div class="hdr" id="hdrbar"><div class="wrap hdr-row">' +
        '<a class="logo" href="#/" aria-label="AOP Baena — ' + esc(t("nav.home")) + '">' + A.logo() + "</a>" +
        '<nav class="nav" aria-label="' + esc(t("nav.menu")) + '">' +
          '<div class="nav-item" data-dd><button class="nav-link" aria-expanded="false" aria-haspopup="true"' + (cur.indexOf("#/produit") === 0 ? ' aria-current="page"' : "") + ">" + esc(t("nav.shop")) + ic("chev") + "</button>" + megaMenu() + "</div>" +
          '<a class="nav-link" href="#/aop-baena"' + cur_("#/aop-baena") + ">" + esc(t("nav.aop")) + "</a>" +
          '<div class="nav-item" data-dd><button class="nav-link" aria-expanded="false" aria-haspopup="true">' + esc(t("nav.discover")) + ic("chev") + "</button>" +
            '<div class="menu" role="menu">' +
              menuLink("#/oleotourisme", "pin", t("nav.tour"), t("nav.tour.s")) +
              menuLink("#/recettes", "book", t("nav.recipes"), t("nav.recipes.s")) +
              menuLink("#/aop-baena", "seal", t("nav.aop"), t("nav.aop.s")) +
            "</div></div>" +
          '<a class="nav-link" href="#/livraison"' + cur_("#/livraison") + ">" + esc(t("nav.ship")) + "</a>" +
          '<a class="nav-link" href="#/pro"' + cur_("#/pro") + ">" + esc(t("nav.pro")) + "</a>" +
        "</nav>" +
        '<div class="hdr-tools">' +
          '<div class="dd" data-dd><button class="iconbtn" aria-expanded="false" aria-haspopup="true" aria-label="' + esc(t("lang.label")) + '">' +
            ic("globe") + '<span class="lang-code">' + store.lang.toUpperCase() + "</span>" + ic("chev", "chev") + "</button>" +
            '<div class="menu" role="menu">' + langs.map(function (l) {
              return '<a href="#" role="menuitemradio" aria-checked="' + (l[0] === store.lang) + '" data-lang="' + l[0] + '"><span class="mi-t">' + l[1] + "</span>" + (l[0] === store.lang ? ic("check", "check") : "") + "</a>";
            }).join("") + "</div></div>" +
          '<a class="iconbtn" href="#/compte" aria-label="' + esc(t("nav.account")) + '" title="' + esc(t("nav.account")) + '">' + ic("user") + "</a>" +
          '<button class="iconbtn" id="bagbtn" aria-label="' + esc(t("nav.cart")) + '" title="' + esc(t("nav.cart")) + '">' + ic("bag") + '<span class="badge-count" id="badge"' + (cartQty() ? "" : " hidden") + ">" + cartQty() + "</span></button>" +
          '<button class="iconbtn burger" id="burger" aria-label="' + esc(t("nav.menu")) + '" aria-expanded="false">' + ic("menu") + "</button>" +
        "</div>" +
      "</div></div>";
    wireDropdowns($("#hdr"));
    $$("[data-lang]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); setLang(a.getAttribute("data-lang")); });
    });
    $("#bagbtn").addEventListener("click", openCart);
    $("#burger").addEventListener("click", openMenu);
    schedule();
  }
  function paintBadge(bump) {
    var b = $("#badge"); if (!b) return;
    var q = cartQty(); b.textContent = q; b.hidden = !q;
    if (bump) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  }
  function setLang(l) {
    store.lang = l; save("lang", l);
    document.documentElement.setAttribute("lang", l);
    paintHeader(); paintFooter(); render(); paintDrawer();
  }

  /* Dropdowns: hover with intent delay on fine pointers, click/keyboard everywhere. */
  var openDD = null;
  function closeDD(except) {
    $$("[data-dd].open").forEach(function (d) {
      if (d === except) return;
      d.classList.remove("open");
      var b = d.querySelector("button"); if (b) b.setAttribute("aria-expanded", "false");
    });
    if (!except) openDD = null;
  }
  function wireDropdowns(root) {
    $$("[data-dd]", root).forEach(function (dd) {
      var btn = dd.querySelector("button"), timer = null;
      function open() { closeDD(dd); dd.classList.add("open"); btn.setAttribute("aria-expanded", "true"); openDD = dd; }
      function close() { dd.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
      btn.addEventListener("click", function (e) { e.stopPropagation(); if (dd.classList.contains("open")) close(); else open(); });
      if (HOVER) {
        dd.addEventListener("mouseenter", function () { clearTimeout(timer); timer = setTimeout(open, 90); });
        dd.addEventListener("mouseleave", function () { clearTimeout(timer); timer = setTimeout(close, 160); });
      }
      $$(".menu a", dd).forEach(function (a) { a.addEventListener("click", function () { close(); }); });
    });
  }
  document.addEventListener("click", function (e) { if (!e.target.closest("[data-dd]")) closeDD(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeDD(); closeSheets(); }
  });

  /* ---------------- sheets: cart drawer + mobile menu ---------------- */
  function openCart() { closeDD(); paintDrawer(); $("#scrim").classList.add("on"); $("#cartsheet").classList.add("on"); document.body.classList.add("lock"); var c = $("#cartsheet .sheet-close"); if (c) c.focus(); }
  function openMenu() { closeDD(); paintMenuSheet(); $("#scrim").classList.add("on"); $("#menusheet").classList.add("on"); document.body.classList.add("lock"); }
  function closeSheets() { ["#scrim", "#cartsheet", "#menusheet"].forEach(function (s) { var el = $(s); if (el) el.classList.remove("on"); }); document.body.classList.remove("lock"); }

  function paintDrawer() {
    var el = $("#cartsheet"); if (!el) return;
    var sub = cartSub(), missing = Math.max(0, FREE_FROM - (sub - discount()));
    var lines = store.cart.map(function (l) {
      var it = findItem(l.id); if (!it) return "";
      return '<div class="mline">' + A.pack(it.id, { label: L(it.name) }) +
        '<div class="stack g6" style="min-width:0"><strong style="font-size:.92rem">' + esc(L(it.name)) + "</strong>" +
          '<div class="qty sm" style="width:max-content"><button data-dq="' + it.id + '" data-d="-1" aria-label="-">' + ic("minus") + "</button><span>" + l.q +
          '</span><button data-dq="' + it.id + '" data-d="1" aria-label="+">' + ic("plus") + "</button></div></div>" +
        '<strong class="tnum">' + money(it.price * l.q) + "</strong></div>";
    }).join("");
    el.innerHTML =
      '<div class="sheet-h"><strong style="font-family:var(--font-display);font-size:1.25rem">' + esc(t("drawer.title")) + "</strong>" +
        '<button class="iconbtn sheet-close" aria-label="' + esc(t("common.close")) + '">' + ic("close") + "</button></div>" +
      '<div class="sheet-b">' +
        (store.cart.length ?
          '<div class="stack g8" style="padding:12px 0 6px"><span class="small">' +
            (missing > 0 ? esc(t("drawer.free", { x: money(missing) })) : "<strong>" + esc(t("drawer.freeok")) + "</strong>") + "</span>" +
            '<div class="freebar"><i style="width:' + Math.round(clamp((sub - discount()) / FREE_FROM, 0, 1) * 100) + '%"></i></div></div>' + lines :
          '<div class="stack g16" style="padding:40px 0; align-items:center; text-align:center"><span class="mi-ic" style="width:64px;height:64px;border-radius:50%">' + ic("bag") + "</span>" +
            '<p class="muted">' + esc(t("drawer.empty")) + "</p></div>") +
      "</div>" +
      '<div class="sheet-f">' +
        (store.cart.length ? '<div class="sumrow total" style="border:0;margin:0;padding:0"><span>' + esc(t("cart.sub")) + '</span><span class="tnum">' + money(sub) + "</span></div>" +
          '<a class="btn btn-block" href="#/checkout" data-close>' + esc(t("cart.checkout")) + ic("arrow", "ic-arrow") + "</a>" +
          '<a class="btn btn-block btn-ghost" href="#/panier" data-close>' + esc(t("drawer.view")) + "</a>"
          : '<a class="btn btn-block" href="#/produits" data-close>' + esc(t("cart.empty.cta")) + ic("arrow", "ic-arrow") + "</a>") +
      "</div>";
    $(".sheet-close", el).addEventListener("click", closeSheets);
    $$("[data-close]", el).forEach(function (a) { a.addEventListener("click", closeSheets); });
    $$("[data-dq]", el).forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-dq"), ln = store.cart.filter(function (l) { return l.id === id; })[0];
        if (ln) setQty(id, Math.max(0, ln.q + (+b.getAttribute("data-d"))));
      });
    });
  }
  function paintMenuSheet() {
    var el = $("#menusheet");
    el.innerHTML = '<div class="sheet-h"><a class="logo" href="#/" data-close>' + A.logo() + "</a>" +
      '<button class="iconbtn sheet-close" aria-label="' + esc(t("common.close")) + '">' + ic("close") + "</button></div>" +
      '<div class="sheet-b"><nav class="mnav">' +
        "<details open><summary>" + ic("store") + esc(t("nav.shop")) + ic("chev", "chev") + "</summary>" +
          D.products.map(function (p) { return '<a href="#/produit/' + p.id + '" data-close>' + ic(p.icon) + esc(L(p.name)) + "</a>"; }).join("") +
          '<a href="#/produits" data-close>' + ic("arrow") + esc(t("mega.all")) + "</a></details>" +
        '<a href="#/aop-baena" data-close>' + ic("seal") + esc(t("nav.aop")) + "</a>" +
        "<details><summary>" + ic("leaf") + esc(t("nav.discover")) + ic("chev", "chev") + "</summary>" +
          '<a href="#/oleotourisme" data-close>' + ic("pin") + esc(t("nav.tour")) + "</a>" +
          '<a href="#/recettes" data-close>' + ic("book") + esc(t("nav.recipes")) + "</a></details>" +
        '<a href="#/livraison" data-close>' + ic("truck") + esc(t("nav.ship")) + "</a>" +
        '<a href="#/pro" data-close>' + ic("store") + esc(t("nav.pro")) + "</a>" +
        '<a href="#/compte" data-close>' + ic("user") + esc(t("nav.account")) + "</a>" +
        '<a href="#/dossier" data-close>' + ic("book") + esc(t("ft.case")) + "</a>" +
      "</nav></div>" +
      '<div class="sheet-f"><div class="row g8">' + ["fr", "es", "en"].map(function (l) {
        return '<button class="btn btn-sm ' + (l === store.lang ? "" : "btn-ghost") + '" data-ml="' + l + '">' + l.toUpperCase() + "</button>";
      }).join("") + "</div></div>";
    $(".sheet-close", el).addEventListener("click", closeSheets);
    $$("[data-close]", el).forEach(function (a) { a.addEventListener("click", closeSheets); });
    $$("[data-ml]", el).forEach(function (b) { b.addEventListener("click", function () { setLang(b.getAttribute("data-ml")); paintMenuSheet(); }); });
  }

  function paintFooter() {
    var pays = ["Carte Bancaire", "Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay", "Alma 3×", "SEPA"];
    $("#ftr").innerHTML =
      '<div class="wrap" style="padding-block:56px 30px"><div class="ftr-grid">' +
        '<div class="stack g16"><a class="logo" href="#/">' + A.logo() + "</a>" +
          '<p class="small" style="opacity:.78; max-width:36ch">' + esc(t("ft.about")) + "</p>" +
          '<div class="social">' +
            '<a href="#/" aria-label="Instagram">' + ic("insta") + "</a>" + '<a href="#/" aria-label="Facebook">' + ic("fb") + "</a>" +
            '<a href="#/" aria-label="Pinterest">' + ic("pinterest") + "</a>" + '<a href="#/pro" aria-label="LinkedIn">' + ic("linkedin") + "</a>" +
          "</div></div>" +
        "<div><h4>" + esc(t("ft.shop")) + "</h4><div class='stack g8'>" +
          D.products.map(function (p) { return '<a href="#/produit/' + p.id + '">' + esc(L(p.name)) + "</a>"; }).join("") +
          '<a href="#/produits">' + esc(t("mega.all")) + "</a></div></div>" +
        "<div><h4>" + esc(t("ft.know")) + "</h4><div class='stack g8'>" +
          '<a href="#/aop-baena">' + esc(t("nav.aop")) + "</a>" + '<a href="#/recettes">' + esc(t("nav.recipes")) + "</a>" +
          '<a href="#/oleotourisme">' + esc(t("nav.tour")) + "</a>" + '<a href="#/pro">' + esc(t("nav.pro")) + "</a></div></div>" +
        "<div><h4>" + esc(t("ft.help")) + "</h4><div class='stack g8'>" +
          '<a href="#/livraison">' + esc(t("nav.ship")) + "</a>" + '<a href="#/compte">' + esc(t("nav.account")) + "</a>" +
          '<a href="#/contact">' + esc(t("ft.contact")) + "</a>" + '<a href="#/dossier">' + esc(t("ft.case")) + "</a></div></div>" +
      "</div>" +
      '<div style="margin-top:34px"><h4>' + esc(t("ft.pay")) + '</h4><div class="row g6">' +
        pays.map(function (p) { return '<span class="paychip">' + esc(p) + "</span>"; }).join("") + "</div></div>" +
      '<div class="row g16" style="margin-top:28px; padding-top:18px; border-top:1px solid rgba(232,230,216,.16)">' +
        '<span class="xs" style="opacity:.7">© 2026 Consejo Regulador DOP Baena · Córdoba</span>' +
        '<a class="xs" href="#/dossier">' + esc(t("ft.legal")) + "</a>" + '<a class="xs" href="#/dossier">' + esc(t("ft.privacy")) + "</a>" +
        '<a class="xs" href="#/dossier">' + esc(t("ft.cgv")) + "</a></div>" +
      '<p class="xs" style="opacity:.55; margin-top:14px; max-width:80ch">' + esc(t("ft.disclaimer")) + "</p></div>";
  }

  /* ================================================================ partials */
  function productCard(p) {
    var price = '<span class="price tnum">' + money(p.price) +
      (p.perLitre ? ' <span class="per">· ' + money(p.perLitre) + " " + esc(t("pdp.perlitre")) + "</span>" : "") + "</span>";
    return '<article class="pcard">' +
      '<a class="pcard-media" href="#/produit/' + p.id + '" aria-label="' + esc(L(p.name)) + '">' +
        (p.flag ? '<span class="flag">' + esc(L(p.flag)) + "</span>" : "") + A.pack(p.id, { label: L(p.name) }) + "</a>" +
      '<div class="quick"><button class="btn btn-sm btn-block" data-add="' + p.id + '">' + ic("bag") + esc(t("quick.add")) + "</button></div>" +
      '<div class="pcard-b">' +
        '<span class="diff">' + ic(p.icon) + esc(L(p.diff)) + "</span>" +
        '<h3><a href="#/produit/' + p.id + '">' + esc(L(p.name)) + "</a></h3>" +
        (p.rating ? '<span class="rate">' + stars(p.rating) + '<span class="tnum">' + num(p.rating) + " · " + p.count + " " + esc(t("pdp.reviews")) + "</span></span>" : "") +
        '<p class="small muted">' + esc(L(p.tagline)) + "</p>" +
        '<div class="pcard-f">' + price + '<button class="addbtn" data-add="' + p.id + '" aria-label="' + esc(t("pdp.add")) + " — " + esc(L(p.name)) + '">' + ic("plus") + "</button></div>" +
      "</div></article>";
  }

  function leadForm(idp) {
    return '<form class="stack g12" id="' + idp + '" novalidate>' +
      '<div class="formgrid">' +
        '<div class="field"><label for="' + idp + '-email">' + esc(t("lead.email")) + ' <span class="req">*</span></label>' +
          '<input id="' + idp + '-email" name="email" type="email" autocomplete="email" placeholder="vous@exemple.fr" required>' +
          '<span class="err" id="' + idp + '-email-err" hidden></span></div>' +
        '<div class="field"><label for="' + idp + '-name">' + esc(t("lead.name")) + ' <span class="opt">(' + esc(t("lead.opt")) + ")</span></label>" +
          '<input id="' + idp + '-name" name="name" type="text" autocomplete="given-name"></div>' +
        '<div class="field"><label for="' + idp + '-city">' + esc(t("lead.city")) + ' <span class="opt">(' + esc(t("lead.opt")) + ")</span></label>" +
          '<input id="' + idp + '-city" name="city" type="text" autocomplete="address-level2"></div>' +
        '<div class="field"><label for="' + idp + '-src">' + esc(t("lead.where")) + ' <span class="opt">(' + esc(t("lead.opt")) + ")</span></label>" +
          '<select id="' + idp + '-src" name="source"><option value=""></option>' +
          ["lead.w1", "lead.w2", "lead.w3", "lead.w4", "lead.w5"].map(function (k) { return '<option value="' + k + '">' + esc(t(k)) + "</option>"; }).join("") + "</select></div>" +
      "</div>" +
      '<label class="check"><input type="checkbox" id="' + idp + '-consent"><span>' + esc(t("lead.consent")) + ' <span class="req">*</span></span></label>' +
      '<span class="err" id="' + idp + '-consent-err" hidden></span>' +
      '<div><button class="btn" type="submit">' + esc(t("lead.submit")) + ic("arrow", "ic-arrow") + "</button></div>" +
      '<p class="hint">' + esc(t("common.required")) + " : *</p></form>";
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function wireLeadForm(idp, kind) {
    var f = $("#" + idp); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = $("#" + idp + "-email").value.trim(), consent = $("#" + idp + "-consent").checked;
      var ee = $("#" + idp + "-email-err"), ce = $("#" + idp + "-consent-err"), ok = true;
      if (!validEmail(email)) { ee.textContent = t("lead.err.email"); ee.hidden = false; ok = false; } else ee.hidden = true;
      if (!consent) { ce.textContent = t("lead.err.consent"); ce.hidden = false; ok = false; } else ce.hidden = true;
      if (!ok) return;
      var payload = { email: email };
      var n = $("#" + idp + "-name"); if (n && n.value.trim()) payload.name = n.value.trim();
      var c = $("#" + idp + "-city"); if (c && c.value.trim()) payload.city = c.value.trim();
      var s = $("#" + idp + "-src"); if (s && s.value) payload.source = t(s.value);
      f.querySelector('button[type="submit"]').disabled = true;
      saveLead(kind || "newsletter", payload).then(function (stored) {
        f.parentNode.replaceChild(h('<div class="notice ok">' + esc(stored ? t("lead.okdb") : t("lead.ok")) + "</div>").firstChild, f);
      });
    });
  }

  /* ================================================================ home */
  var STEP_ICONS = ["calendar", "tree", "clock", "drop", "thermo", "scale", "seal", "sparkle"];
  function viewHome() {
    var N = A.sceneCount, reviews = allReviews();
    var rvCard = function (r, hidden) {
      var initials = r.n.split(/[\s&]+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("");
      return '<article class="rv"' + (hidden ? ' aria-hidden="true"' : "") + ">" + stars(r.r) + "<p>« " + esc(L(r.t)) + " »</p>" +
        '<div class="rv-f"><span class="avatar">' + esc(initials) + "</span><span><strong class=\"small\">" + esc(r.n) + "</strong><small>" + esc(r.c) + "</small></span>" +
        '<span class="verified" style="margin-left:auto">' + ic("check") + esc(t("rv.verified")) + "</span></div></article>";
    };
    return '' +
      '<section class="hero" id="hero"><div class="hero-stage">' + A.hero() +
        '<div class="hero-copy"><div class="wrap"><div class="inner">' +
          '<span class="eyebrow">' + esc(t("hero.k")) + "</span>" +
          "<h1>" + esc(t("hero.h1")) + "</h1>" +
          '<p class="lede">' + esc(t("hero.p")) + "</p>" +
          '<div class="row g12"><a class="btn" href="#/produits">' + esc(t("hero.cta")) + ic("arrow", "ic-arrow") + "</a>" +
            '<a class="btn btn-ghost" href="#story" data-scroll="story">' + ic("leaf") + esc(t("hero.scroll")) + "</a></div>" +
          '<div class="hero-proof"><span>' + ic("seal") + esc(t("hero.b2")) + "</span><span>" + ic("tree") + esc(t("hero.b1")) + "</span><span>" + ic("truck") + esc(t("hero.b3")) + "</span></div>" +
        "</div></div></div>" +
        '<a class="scroll-cue" href="#story" data-scroll="story"><i></i>' + esc(t("hero.scroll")) + "</a>" +
      "</div></section>" +

      '<div class="wrap"><div class="trust">' + [["seal", "trust.1"], ["clock", "trust.2"], ["truck", "trust.3"], ["shield", "trust.4"]].map(function (x) {
        return '<div class="trust-i"><span class="ti">' + ic(x[0]) + "</span><span><strong>" + esc(t(x[1])) + "</strong><span>" + esc(t(x[1] + "s")) + "</span></span></div>";
      }).join("") + "</div></div>" +

      '<section class="story" id="story">' +
        '<div class="wrap story-intro"><div class="stack g12 measure"><span class="eyebrow">' + esc(t("story.k")) + "</span><h2>" + esc(t("story.h2")) + '</h2><p class="lede">' + esc(t("story.p")) + "</p></div></div>" +
        '<div class="story-track" id="track" style="height:calc(100vh + ' + N + ' * 85vh)">' +
          '<div class="wrap story-pin">' +
            '<div class="stage" id="stage">' +
              Array.apply(null, Array(N)).map(function (_, i) { return '<div class="layer' + (i === 0 ? " on" : "") + '" data-layer="' + i + '"></div>'; }).join("") +
              '<div class="stage-num"><b id="snum">01</b><span>/ 0' + N + "</span></div>" +
              '<div class="stage-bar"><i id="sbar"></i></div>' +
            "</div>" +
            '<div class="steps-col"><div class="step-texts">' +
              Array.apply(null, Array(N)).map(function (_, i) {
                var k = "s" + (i + 1);
                return '<div class="step-t' + (i === 0 ? " on" : "") + '" data-step="' + i + '"><span class="k">' + esc(t(k + ".k")) + "</span><h3>" + esc(t(k + ".h")) + "</h3><p>" + esc(t(k + ".p")) + "</p>" +
                  '<span class="chip">' + ic(STEP_ICONS[i]) + esc(t(k + ".c")) + "</span>" +
                  (i === N - 1 ? '<a class="btn" href="#/produits" style="align-self:flex-start">' + esc(t("s8.cta")) + ic("arrow", "ic-arrow") + "</a>" : "") + "</div>";
              }).join("") + "</div>" +
              '<ol class="rail">' + Array.apply(null, Array(N)).map(function (_, i) {
                return '<li><button data-goto="' + i + '"' + (i === 0 ? ' class="on"' : "") + "><b>0" + (i + 1) + "</b>" + esc(t("s" + (i + 1) + ".k").split("·").pop().trim()) + "</button></li>";
              }).join("") + "</ol>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section"><div class="wrap">' +
        '<div class="sec-head"><div class="stack g12 measure"><span class="eyebrow">' + esc(t("home.shop.eyebrow")) + "</span><h2>" + esc(t("home.shop.h2")) + '</h2><p class="lede">' + esc(t("home.shop.p")) + "</p></div>" +
          '<a class="link-arrow" href="#/produits">' + esc(t("home.shop.all")) + ic("arrow") + "</a></div>" +
        '<div class="grid g-4">' + D.products.map(productCard).join("") + "</div>" +
      "</div></section>" +

      '<section class="section" style="background:var(--sage-50); padding-block:clamp(56px,7vw,96px)"><div class="wrap">' +
        '<div class="sec-head"><div class="stack g12 measure"><span class="eyebrow">' + esc(t("stats.k")) + "</span><h2>" + esc(t("stats.h2")) + "</h2></div></div>" +
        '<div class="stats">' + [["olive", 20, "+", "home.stat1", "stat.d1"], ["store", 19, "", "home.stat2", "stat.d2"], ["tree", 60000, "", "home.stat3", "stat.d3"], ["seal", 1981, "", "home.stat4", "stat.d4"]].map(function (s) {
          return '<div class="stat" tabindex="0"><span class="si">' + ic(s[0]) + '</span><div class="n tnum" data-count="' + s[1] + '" data-prefix="' + s[2] + '"' + (s[1] === 1981 ? ' data-plain="1"' : "") + ">" + s[2] + (s[1] === 1981 ? s[1] : num(s[1])) + "</div>" +
            '<div class="l">' + esc(t(s[3])) + '</div><div class="d">' + esc(t(s[4])) + "</div></div>";
        }).join("") + "</div>" +
      "</div></section>" +

      '<section class="section" style="padding-bottom:clamp(40px,5vw,64px)"><div class="wrap">' +
        '<div class="sec-head"><div class="stack g12 measure"><span class="eyebrow">' + esc(t("rv.k")) + "</span><h2>" + esc(t("rv.h2")) + "</h2></div>" +
          '<span class="rate" style="font-size:.9rem">' + stars(5) + "<strong>" + esc(t("rv.avg")) + "</strong></span></div></div>" +
        '<div class="marquee" aria-label="' + esc(t("rv.k")) + '"><div class="mq-track">' +
          reviews.map(function (r) { return rvCard(r); }).join("") + reviews.map(function (r) { return rvCard(r, true); }).join("") +
        "</div></div>" +
      "</section>" +

      '<section class="section" style="padding-top:clamp(30px,4vw,56px)"><div class="wrap"><div class="split">' +
        '<div class="art-frame" id="tour-art"></div>' +
        '<div class="stack g16"><span class="eyebrow">' + esc(t("home.tour.eyebrow")) + "</span><h2>" + esc(t("home.tour.h2")) + "</h2>" +
          "<p class=\"muted\">" + esc(t("home.tour.p")) + "</p>" +
          '<div><a class="btn" href="#/oleotourisme">' + esc(t("home.tour.cta")) + ic("arrow", "ic-arrow") + "</a></div></div>" +
      "</div></div></section>" +

      '<section class="section" id="newsletter" style="padding-top:0"><div class="wrap"><div class="nl">' +
        '<svg class="branch" viewBox="0 0 340 200" aria-hidden="true">' + A.oliveBranch(10, 150, 2.6, -18, true) + "</svg>" +
        '<div class="split" style="position:relative">' +
          '<div class="stack g12"><span class="eyebrow">' + esc(t("home.lead.eyebrow")) + "</span><h2>" + esc(t("home.lead.h2")) + '</h2><p class="lede">' + esc(t("home.lead.p")) + "</p></div>" +
          '<div class="card pad" style="box-shadow:var(--shadow)">' + leadForm("lead-home") + "</div>" +
        "</div></div></div></section>";
  }
  function allReviews() {
    var out = [];
    Object.keys(D.reviews).forEach(function (k) { D.reviews[k].forEach(function (r) { out.push(r); }); });
    return out.concat(D.extraReviews || []);
  }

  /* ---------------- motion: header, hero parallax, story ---------------- */
  var motion = { story: null, hero: null, mx: 0, my: 0, raf: 0 };

  function wireHome() {
    wireLeadForm("lead-home", "newsletter");
    var ta = $("#tour-art"); if (ta) A.mountScene(ta, 3, .6);
    $$("[data-scroll]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("data-scroll"));
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 60, behavior: REDUCED ? "auto" : "smooth" });
      });
    });
    /* hero parallax */
    var hero = $("#hero");
    motion.hero = hero ? { el: hero, layers: $$("[data-depth]", hero).map(function (g) { return { g: g, d: +g.getAttribute("data-depth") }; }) } : null;
    if (hero && HOVER && !REDUCED) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        motion.mx = (e.clientX - r.left) / r.width - .5; motion.my = (e.clientY - r.top) / r.height - .5;
        schedule();
      });
      hero.addEventListener("mouseleave", function () { motion.mx = 0; motion.my = 0; schedule(); });
    }
    var art = hero && $(".hero-art", hero);
    if (art) {
      var mq = window.matchMedia("(max-width:820px)");
      var setPar = function () { art.setAttribute("preserveAspectRatio", mq.matches ? "xMaxYMax slice" : "xMidYMid slice"); };
      setPar(); if (mq.addEventListener) mq.addEventListener("change", setPar);
    }
    /* story */
    var track = $("#track");
    if (track) {
      var layers = $$("[data-layer]", track), upd = [];
      var mountOne = function (i) { if (layers[i] && !upd[i]) upd[i] = A.mountScene(layers[i], i, 0); };
      mountOne(0);
      var k = 1;
      (function next() { if (k >= layers.length) return; mountOne(k++); setTimeout(next, 40); })();
      motion.story = { track: track, layers: layers, upd: upd, mount: mountOne, idx: -1,
        texts: $$("[data-step]", track), rail: $$("[data-goto]", track), num: $("#snum"), bar: $("#sbar") };
      $$("[data-goto]", track).forEach(function (b) {
        b.addEventListener("click", function () {
          var i = +b.getAttribute("data-goto"), st = motion.story, pinH = $(".story-pin", track).offsetHeight;
          var total = track.offsetHeight - pinH, top = track.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: top + total * ((i + .1) / layers.length), behavior: REDUCED ? "auto" : "smooth" });
          st.idx = -1;
        });
      });
    }
    /* stats count-up, only for figures not visible at load */
    if ("IntersectionObserver" in window && !REDUCED) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target); countUp(en.target);
        });
      }, { threshold: .6 });
      $$("[data-count]").forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top > window.innerHeight) io.observe(n);
      });
    }
    schedule();
  }
  function countUp(n) {
    var target = +n.getAttribute("data-count"), pre = n.getAttribute("data-prefix") || "", plain = n.getAttribute("data-plain");
    var start = plain ? target - 60 : 0, t0 = performance.now(), dur = 1400;
    (function step(now) {
      var k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3), v = Math.round(start + (target - start) * e);
      n.textContent = pre + (plain ? v : num(v));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function schedule() { if (!motion.raf) motion.raf = requestAnimationFrame(frame); }
  function frame() {
    motion.raf = 0;
    var y = window.pageYOffset;
    var bar = $("#hdrbar"); if (bar) bar.classList.toggle("scrolled", y > 24);
    var hr = motion.hero;
    if (hr && hr.el.isConnected && !REDUCED) {
      var vis = y < hr.el.offsetHeight + 200;
      if (vis) hr.layers.forEach(function (l) {
        l.g.setAttribute("transform", "translate(" + (motion.mx * -60 * l.d).toFixed(1) + " " + (y * .35 * l.d + motion.my * -30 * l.d).toFixed(1) + ")");
      });
    }
    var st = motion.story;
    if (st && st.track.isConnected) {
      var r = st.track.getBoundingClientRect(), pin = $(".story-pin", st.track);
      var total = st.track.offsetHeight - (pin ? pin.offsetHeight : window.innerHeight);
      var N = st.layers.length, p = clamp(-r.top / Math.max(1, total), 0, 1);
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var sf = p * N, idx = Math.min(N - 1, Math.floor(sf)), lt = clamp((sf - idx) / .88, 0, 1);
        if (idx !== st.idx) {
          st.mount(idx);
          st.layers.forEach(function (l, i) { l.classList.toggle("on", i === idx); });
          st.texts.forEach(function (x, i) { x.classList.toggle("on", i === idx); });
          st.rail.forEach(function (b, i) { b.classList.toggle("on", i === idx); b.classList.toggle("done", i < idx); });
          if (st.num) st.num.textContent = "0" + (idx + 1);
          if (st.idx >= 0 && st.upd[st.idx]) st.upd[st.idx](idx > st.idx ? 1 : 0);
          st.idx = idx;
        }
        if (st.upd[idx]) st.upd[idx](idx === N - 1 && p >= .999 ? 1 : lt);
        if (st.bar) st.bar.style.width = (p * 100).toFixed(2) + "%";
      }
    }
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  /* topbar rotation on small screens */
  setInterval(function () {
    if (REDUCED || window.innerWidth > 760) return;
    var spans = $$(".topbar span"); if (spans.length < 2) return;
    var i = spans.findIndex(function (s) { return s.classList.contains("on"); });
    spans.forEach(function (s) { s.classList.remove("on"); });
    spans[(i + 1) % spans.length].classList.add("on");
  }, 3800);

  /* ================================================================ pages */
  function viewAop() {
    var secs = [["aop.s1.h", "aop.s1.p", "seal"], ["aop.s2.h", "aop.s2.p", "pin"], ["aop.s3.h", "aop.s3.p", "olive"], ["aop.s4.h", "aop.s4.p", "drop"]];
    var vs = [["picuda", "aop.v1", "aop.v1d"], ["hojiblanca", "aop.v2", "aop.v2d"], ["picual", "aop.v3", "aop.v3d"]];
    return '<section class="section"><div class="wrap stack g32">' + crumb(t("aop.title")) +
        '<div class="stack g12 measure"><h1>' + esc(t("aop.h1")) + '</h1><p class="lede">' + esc(t("aop.lede")) + "</p></div>" +
        '<div class="art-frame wide">' + A.landscape() + "</div>" +
        '<div class="grid g-2">' + secs.map(function (s) {
          return '<div class="pillar stack g12"><span class="pi">' + ic(s[2]) + "</span><h3>" + esc(t(s[0])) + '</h3><p class="muted">' + esc(t(s[1])) + "</p></div>";
        }).join("") + "</div>" +
      "</div></section>" +
      '<section class="section" style="background:var(--sage-50)"><div class="wrap stack g24">' +
        '<div class="stack g12"><span class="eyebrow">' + esc(t("aop.var.k")) + "</span><h2>" + esc(t("aop.varieties.h")) + "</h2></div>" +
        '<div class="grid g-3">' + vs.map(function (v) {
          return '<article class="vcard">' + A.varietySpot(v[0]) + '<div class="b"><h3>' + esc(t(v[1])) + '</h3><p class="small muted">' + esc(t(v[2])) + "</p></div></article>";
        }).join("") + "</div>" +
        '<div class="seo"><strong>SEO on-page</strong> · title: <em>Huile d\'Olive Vierge Extra AOP Baena | Livraison en France</em> · H1: <em>Huile d\'Olive Vierge Extra AOP Baena</em> · H2: <em>Une origine certifiée au cœur de l\'Andalousie</em> · URL: <em>/fr/huiles/huile-olive-vierge-extra-aop-baena/</em></div>' +
      "</div></section>";
  }

  var shopState = { filter: "all", sort: "feat" };
  function viewShop() {
    var items;
    if (shopState.filter === "oil") items = D.products.filter(function (p) { return p.id === "classique" || p.id === "bidon"; });
    else if (shopState.filter === "gift") items = D.products.filter(function (p) { return p.id === "premium" || p.id === "cadeau"; });
    else if (shopState.filter === "acc") items = D.accessories.slice();
    else items = D.products.concat(D.accessories);
    if (shopState.sort === "asc") items.sort(function (a, b) { return a.price - b.price; });
    if (shopState.sort === "desc") items.sort(function (a, b) { return b.price - a.price; });
    if (shopState.sort === "rating") items.sort(function (a, b) { return (b.rating || 0) - (a.rating || 0); });
    var filters = [["all", "shop.filter.all"], ["oil", "shop.filter.oil"], ["gift", "shop.filter.gift"], ["acc", "shop.filter.acc"]];
    return '<section class="section"><div class="wrap stack g24">' + crumb(t("shop.title")) +
      '<div class="stack g12 measure"><h1>' + esc(t("shop.h1")) + '</h1><p class="lede">' + esc(t("shop.lede")) + "</p></div>" +
      '<div class="row g12" style="justify-content:space-between">' +
        '<div class="filters" role="group">' + filters.map(function (f) {
          return '<button data-filter="' + f[0] + '"' + (shopState.filter === f[0] ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + ">" + esc(t(f[1])) + "</button>";
        }).join("") + "</div>" +
        '<div class="row g8"><label class="small muted" for="sort">' + esc(t("shop.sort")) + "</label>" +
          '<select id="sort" class="selectbox">' + [["feat", "shop.sort.feat"], ["asc", "shop.sort.asc"], ["desc", "shop.sort.desc"], ["rating", "shop.sort.rating"]].map(function (s) {
            return '<option value="' + s[0] + '"' + (shopState.sort === s[0] ? " selected" : "") + ">" + esc(t(s[1])) + "</option>";
          }).join("") + "</select></div>" +
      "</div>" +
      '<p class="small muted tnum">' + items.length + " " + esc(t("shop.count")) + "</p>" +
      '<div class="grid g-3">' + items.map(productCard).join("") + "</div></div></section>";
  }

  var DETAIL_VB = { classique: "130 186 140 154", premium: "50 220 260 286", cadeau: "30 170 220 242", bidon: "96 118 172 189", verres: "80 190 170 187", carnet: "116 96 154 169" };
  var USE_ART = { classique: ["scene", 7, .75], premium: ["variety", "hojiblanca"], cadeau: ["dish", "salmorejo"], bidon: ["scene", 7, .75], verres: ["variety", "picuda"], carnet: ["dish", "tomate"] };
  var pdpState = { view: 0, qty: 1, tab: "desc", id: null };
  function pdpView(p, v) {
    if (v === 1) return A.pack(p.id, { vb: "detail", label: L(p.name) });
    if (v === 2) {
      var u = USE_ART[p.id];
      if (u[0] === "variety") return A.varietySpot(u[1]);
      if (u[0] === "dish") return A.dishSpot(u[1]);
      return '<div class="scene-host" data-scene="' + u[1] + '" data-t="' + u[2] + '" style="width:100%;height:100%"></div>';
    }
    return A.pack(p.id, { label: L(p.name) });
  }
  function viewProduct(id) {
    var p = findItem(id); if (!p) return viewShop();
    if (pdpState.id !== id) { pdpState = { view: 0, qty: 1, tab: "desc", id: id }; }
    var revs = D.reviews[p.id] || [], premium = findItem("premium");
    function tabBody() {
      if (pdpState.tab === "notes") return "<p>" + esc(L(p.notes)) + '</p><p style="margin-top:10px"><strong>' + esc(t("pdp.use")) + "</strong> : " + esc(L(p.use)) + "</p>";
      if (pdpState.tab === "ship") return "<p>" + esc(t("pdp.ship.p")) + "</p>";
      if (pdpState.tab === "rev") return revs.map(function (r) {
        return '<div class="review"><div class="row g8">' + stars(r.r) + '<strong class="small">' + esc(r.n) + '</strong><span class="xs muted">' + esc(r.c) + " · " + esc(r.d) + "</span></div>" +
          '<p class="small" style="margin-top:6px">' + esc(L(r.t)) + "</p></div>";
      }).join("");
      return "<p>" + esc(L(p.desc || p.tagline)) + "</p>";
    }
    var tabs = [["desc", "pdp.tab.desc"]];
    if (p.notes) tabs.push(["notes", "pdp.tab.notes"]);
    tabs.push(["ship", "pdp.tab.ship"]);
    if (revs.length) tabs.push(["rev", "pdp.tab.rev"]);
    var views = [["pdp.v.front"], ["pdp.v.detail"], ["pdp.v.use"]];

    return '<section class="section" style="padding-top:clamp(28px,4vw,48px)"><div class="wrap stack g32">' +
      '<p class="breadcrumb"><a href="#/">' + esc(t("nav.home")) + '</a><span>/</span><a href="#/produits">' + esc(t("shop.title")) + "</a><span>/</span>" + esc(L(p.name)) + "</p>" +
      '<div class="pdp">' +
        '<div class="pdp-media"><div class="pdp-main" id="pdp-main" title="' + esc(t("pdp.zoom")) + '">' + pdpView(p, pdpState.view) + "</div>" +
          '<div class="thumbs" role="group">' + views.map(function (v, i) {
            return '<button data-view="' + i + '" aria-pressed="' + (i === pdpState.view) + '" aria-label="' + esc(t(v[0])) + '">' + pdpView(p, i) + "</button>";
          }).join("") + "</div></div>" +
        '<div class="stack g16">' +
          '<span class="diff">' + ic(p.icon) + esc(L(p.diff)) + "</span>" +
          "<h1 style=\"font-size:clamp(2rem,1.4rem + 2vw,2.8rem)\">" + esc(L(p.name)) + "</h1>" +
          (p.rating ? '<div class="row g12"><span class="rate">' + stars(p.rating) + '<span class="tnum">' + num(p.rating) + " · " + p.count + " " + esc(t("pdp.reviews")) + "</span></span>" +
            '<span class="pill ok">' + ic("check") + esc(t("pdp.stock")) + "</span></div>" : "") +
          '<p class="lede">' + esc(L(p.tagline)) + "</p>" +
          '<div class="price" style="font-size:1.9rem">' + money(p.price) + (p.perLitre ? ' <span class="per">· ' + money(p.perLitre) + " " + esc(t("pdp.perlitre")) + "</span>" : "") + "</div>" +
          '<div class="row g12">' +
            '<div class="qty" role="group" aria-label="' + esc(t("pdp.qty")) + '"><button data-q="-1" aria-label="-">' + ic("minus") + '</button><span id="pdp-qty">' + pdpState.qty + '</span><button data-q="1" aria-label="+">' + ic("plus") + "</button></div>" +
            '<button class="btn" id="pdp-add">' + ic("bag") + esc(t("pdp.add")) + "</button>" +
            '<button class="btn btn-ghost" id="pdp-buy">' + esc(t("pdp.buy")) + ic("arrow", "ic-arrow") + "</button>" +
          "</div>" +
          '<div class="card pad stack g12" style="background:var(--sage-50); border-color:var(--sage-200)"><strong>' + esc(t("pdp.why")) + '</strong><ul class="why" style="margin:0;padding:0">' +
            L(p.why).map(function (w) { return "<li>" + ic("check") + "<span>" + esc(w) + "</span></li>"; }).join("") + "</ul></div>" +
          (p.sku ? '<dl class="spec"><dt>' + esc(t("pdp.spec.sku")) + "</dt><dd>" + esc(p.sku) + "</dd>" +
            (p.unit ? "<dt>" + esc(t("pdp.spec.format")) + "</dt><dd>" + esc(L(p.unit)) + "</dd>" : "") +
            (p.varieties ? "<dt>" + esc(t("pdp.spec.var")) + "</dt><dd>" + esc(p.varieties) + "</dd>" : "") +
            (p.acidity ? "<dt>" + esc(t("pdp.spec.acid")) + "</dt><dd>" + esc(p.acidity) + "</dd>" : "") +
            (p.harvest ? "<dt>" + esc(t("pdp.spec.harv")) + "</dt><dd>" + esc(L(p.harvest)) + "</dd>" : "") +
            "<dt>" + esc(t("pdp.spec.origin")) + "</dt><dd>" + esc(t("pdp.spec.originv")) + "</dd></dl>" : "") +
          '<div class="tabs" role="tablist">' + tabs.map(function (x) {
            return '<button role="tab" data-tab="' + x[0] + '" aria-selected="' + (pdpState.tab === x[0]) + '">' + esc(t(x[1])) + "</button>";
          }).join("") + "</div>" +
          '<div class="small" style="min-height:90px">' + tabBody() + "</div>" +
        "</div>" +
      "</div>" +
      (p.id !== "premium" && !isAcc(p) ?
        '<div class="upsell">' + A.pack("premium", { label: L(premium.name) }) +
          '<div class="stack g8"><span class="eyebrow">Up-selling</span><h3>' + esc(t("pdp.upsell.h")) + '</h3><p class="small muted">' + esc(t("pdp.upsell.p")) + "</p>" +
          '<div><a class="btn btn-sm" href="#/produit/premium">' + esc(L(premium.name)) + " · " + money(premium.price) + ic("arrow", "ic-arrow") + "</a></div></div></div>" : "") +
      '<div class="stack g16"><span class="eyebrow">Cross-selling</span><h3>' + esc(t("pdp.cross.h")) + "</h3>" +
        '<div class="grid g-3">' + D.accessories.filter(function (x) { return x.id !== p.id; })
          .concat(D.products.filter(function (x) { return x.id !== p.id; }).slice(0, 3 - D.accessories.filter(function (x) { return x.id !== p.id; }).length))
          .map(productCard).join("") + "</div></div>" +
      "</div></section>";
  }

  function viewCart() {
    if (!store.cart.length) {
      return '<section class="section"><div class="wrap stack g16" style="align-items:flex-start">' + crumb(t("cart.title")) +
        "<h1>" + esc(t("cart.h1")) + '</h1><p class="lede">' + esc(t("cart.empty")) + "</p>" +
        '<a class="btn" href="#/produits">' + esc(t("cart.empty.cta")) + ic("arrow", "ic-arrow") + "</a></div></section>";
    }
    var sub = cartSub(), disc = discount(), ship = shipCost(), tot = cartTotal(), missing = Math.max(0, FREE_FROM - (sub - disc));
    return '<section class="section"><div class="wrap stack g24">' + crumb(t("cart.title")) + "<h1>" + esc(t("cart.h1")) + "</h1>" +
      '<div class="linecols"><div>' + store.cart.map(function (l) {
        var it = findItem(l.id); if (!it) return "";
        return '<div class="line">' + A.pack(it.id, { label: L(it.name) }) +
          '<div class="stack g6" style="min-width:0"><strong><a href="#/produit/' + it.id + '" style="text-decoration:none">' + esc(L(it.name)) + "</a></strong>" +
            '<span class="diff" style="font-size:.74rem">' + ic(it.icon) + esc(L(it.diff)) + "</span>" +
            '<div class="row g12"><div class="qty sm"><button data-cq="' + it.id + '" data-d="-1" aria-label="-">' + ic("minus") + "</button><span>" + l.q + '</span><button data-cq="' + it.id + '" data-d="1" aria-label="+">' + ic("plus") + "</button></div>" +
            '<button class="link-arrow" style="background:none;border:0;cursor:pointer;color:var(--muted);font-weight:500" data-rm="' + it.id + '">' + esc(t("cart.remove")) + "</button></div></div>" +
          '<strong class="tnum">' + money(it.price * l.q) + "</strong></div>";
      }).join("") +
        '<div class="row g8" style="margin-top:20px; max-width:440px"><input id="promo" placeholder="' + esc(t("cart.code")) + '" aria-label="' + esc(t("cart.code")) + '" style="flex:1 1 170px">' +
          '<button class="btn btn-sm btn-ghost" id="promo-go">' + esc(t("cart.apply")) + '</button></div><p class="err" id="promo-msg" hidden></p>' +
        '<div class="stack g16" style="margin-top:36px"><h3>' + esc(t("cart.cross")) + '</h3><div class="grid g-2">' + D.accessories.map(productCard).join("") + "</div></div>" +
      "</div>" +
      '<aside class="summary stack g6">' +
        '<div class="sumrow"><span>' + esc(t("cart.sub")) + '</span><span class="tnum">' + money(sub) + "</span></div>" +
        (disc ? '<div class="sumrow" style="color:var(--good)"><span>' + esc(t("cart.disc")) + " (" + CODE + ')</span><span class="tnum">−' + money(disc) + "</span></div>" : "") +
        '<div class="sumrow"><span>' + esc(t("cart.ship")) + '</span><span class="tnum">' + (ship === 0 ? esc(t("cart.free")) : money(ship)) + "</span></div>" +
        '<div class="sumrow total"><span>' + esc(t("cart.total")) + '</span><span class="tnum">' + money(tot) + "</span></div>" +
        '<p class="xs muted tnum">' + esc(t("cart.vat")) + " · " + money(tot - tot / (1 + VAT)) + "</p>" +
        '<div class="stack g6" style="margin:12px 0"><span class="small">' + (missing > 0 ? esc(t("cart.freehint", { x: num(Math.round(missing * 100) / 100) })) : esc(t("cart.freeok"))) + "</span>" +
          '<div class="freebar"><i style="width:' + Math.round(clamp((sub - disc) / FREE_FROM, 0, 1) * 100) + '%"></i></div></div>' +
        '<a class="btn btn-block" href="#/checkout">' + esc(t("cart.checkout")) + ic("arrow", "ic-arrow") + "</a>" +
        '<a class="btn btn-block btn-ghost" href="#/produits" style="margin-top:8px">' + esc(t("co.done.shop")) + "</a>" +
      "</aside></div></div></section>";
  }

  var SHIPOPTS = [
    { id: "correos", n: "Correos — Paq Internacional", p: 6.9, d: { fr: "5 à 9 jours", es: "5 a 9 días", en: "5 to 9 days" } },
    { id: "dhl", n: "DHL eCommerce", p: 9.9, d: { fr: "2 à 5 jours", es: "2 a 5 días", en: "2 to 5 days" } },
    { id: "mbe", n: "Mail Boxes Etc (MBE)", p: 12.9, d: { fr: "2 à 4 jours", es: "2 a 4 días", en: "2 to 4 days" } }
  ];
  var PAYOPTS = [
    { id: "cb", n: "Carte Bancaire" }, { id: "visa", n: "Visa / Mastercard" }, { id: "paypal", n: "PayPal" }, { id: "apple", n: "Apple Pay" },
    { id: "google", n: "Google Pay" }, { id: "alma", n: "Alma — 3× sans frais" }, { id: "sepa", n: "Virement SEPA" }
  ];
  function fld(id, label, type, req, ac, span) {
    return '<div class="field' + (span ? " span2" : "") + '"><label for="co-' + id + '">' + esc(t(label)) +
      (req ? ' <span class="req">*</span>' : ' <span class="opt">(' + esc(t("lead.opt")) + ")</span>") + "</label>" +
      '<input id="co-' + id + '" name="' + id + '" type="' + type + '" autocomplete="' + (ac || "off") + '"' + (req ? " required" : "") +
      ' value="' + esc(store.coData[id] || "") + '"><span class="err" id="co-' + id + '-err" hidden></span></div>';
  }
  function viewCheckout() {
    if (!store.cart.length && !store.lastOrder) return viewCart();
    if (store.coStep === 4 && store.lastOrder) {
      var o = store.lastOrder;
      return '<section class="section"><div class="wrap stack g24" style="max-width:720px">' +
        '<span class="mi-ic" style="width:64px;height:64px;border-radius:50%;background:var(--olive);color:var(--btn-ink)">' + ic("check") + "</span>" +
        "<h1>" + esc(t("co.done.h")) + '</h1><p class="lede">' + esc(t("co.done.p", { email: o.email })) + "</p>" +
        '<div class="card pad">' +
          '<div class="sumrow"><span>' + esc(t("co.done.num")) + '</span><strong class="tnum">' + esc(o.id) + "</strong></div>" +
          '<div class="sumrow"><span>' + esc(t("co.done.eta")) + "</span><span>" + esc(o.eta) + "</span></div>" +
          '<div class="sumrow"><span>' + esc(t("co.ship.h")) + "</span><span>" + esc(o.ship) + "</span></div>" +
          '<div class="sumrow"><span>' + esc(t("co.pay.h")) + "</span><span>" + esc(o.pay) + "</span></div>" +
          '<div class="sumrow total"><span>' + esc(t("cart.total")) + '</span><span class="tnum">' + money(o.total) + "</span></div></div>" +
        '<div class="row g12"><a class="btn" href="#/compte">' + esc(t("co.done.acct")) + ic("arrow", "ic-arrow") + "</a>" +
          '<a class="btn btn-ghost" href="#/produits">' + esc(t("co.done.shop")) + "</a></div></div></section>";
    }
    var s = store.coStep, d = store.coData;
    var steps = ["co.step1", "co.step2", "co.step3"].map(function (k, i) {
      var n = i + 1;
      return "<li" + (n === s ? ' aria-current="step"' : "") + (n < s ? ' class="done"' : "") + '><span class="dot">' + (n < s ? "✓" : n) + "</span>" + esc(t(k)) + "</li>";
    }).join("");
    var body;
    if (s === 1) {
      body = '<form id="co-form" class="stack g16" novalidate><h3>' + esc(t("co.contact.h")) + '</h3><div class="formgrid">' +
        fld("first", "co.first", "text", true, "given-name") + fld("last", "co.last", "text", true, "family-name") +
        fld("email", "co.email", "email", true, "email") + fld("phone", "co.phone", "tel", false, "tel") +
        fld("addr", "co.addr", "text", true, "street-address", true) + fld("addr2", "co.addr2", "text", false, "address-line2", true) +
        fld("zip", "co.zip", "text", true, "postal-code") + fld("city", "co.city", "text", true, "address-level2") +
        '<div class="field span2"><label for="co-country">' + esc(t("co.country")) + ' <span class="req">*</span></label>' +
          '<select id="co-country" name="country"><option value="FR" selected>France</option><option>Belgique</option><option>Suisse</option><option>Luxembourg</option><option>España</option></select></div></div>' +
        '<label class="check"><input type="checkbox" id="co-inv"><span>' + esc(t("co.invoice")) + "</span></label>" +
        '<div class="formgrid" id="co-inv-box" hidden>' + fld("bcompany", "co.company", "text", false, "organization") + fld("bvat", "co.vatno", "text", false, "off") +
          fld("baddr", "co.addr", "text", false, "off", true) + fld("bzip", "co.zip", "text", false, "off") + fld("bcity", "co.city", "text", false, "off") + "</div>" +
        '<label class="check"><input type="checkbox" id="co-optin"><span>' + esc(t("co.optin")) + "</span></label>" +
        '<p class="hint">' + esc(t("common.required")) + " : *</p>" +
        '<div class="row g12"><button class="btn" type="submit">' + esc(t("co.next")) + ic("arrow", "ic-arrow") + '</button><a class="btn btn-ghost" href="#/panier">' + esc(t("co.back")) + "</a></div></form>";
    } else if (s === 2) {
      body = '<form id="co-form" class="stack g16" novalidate><h3>' + esc(t("co.ship.h")) + '</h3><div class="stack g8">' + SHIPOPTS.map(function (o) {
          var sel = (d.ship || "correos") === o.id, free = o.id === "correos" && cartSub() - discount() >= FREE_FROM;
          return '<label class="payopt' + (sel ? " sel" : "") + '"><input type="radio" name="ship" value="' + o.id + '"' + (sel ? " checked" : "") + ">" +
            '<span style="flex:1"><strong>' + esc(o.n) + '</strong><br><span class="xs muted">' + esc(L(o.d)) + '</span></span><strong class="tnum">' + (free ? esc(t("cart.free")) : money(o.p)) + "</strong></label>";
        }).join("") + "</div>" +
        '<label class="check"><input type="checkbox" id="co-gift"' + (d.gift ? " checked" : "") + "><span>" + esc(t("co.gift")) + "</span></label>" +
        '<div class="field" id="co-gift-box"' + (d.gift ? "" : " hidden") + '><label for="co-giftmsg">' + esc(t("co.giftmsg")) + '</label><textarea id="co-giftmsg" maxlength="240">' + esc(d.giftmsg || "") + "</textarea></div>" +
        '<div class="notice">' + esc(t("ship.lede")) + "</div>" +
        '<div class="row g12"><button class="btn" type="submit">' + esc(t("co.next")) + ic("arrow", "ic-arrow") + '</button><button class="btn btn-ghost" type="button" id="co-prev">' + esc(t("co.back")) + "</button></div></form>";
    } else {
      var pay = d.pay || "cb";
      body = '<form id="co-form" class="stack g16" novalidate><h3>' + esc(t("co.pay.h")) + '</h3><div class="pay">' + PAYOPTS.map(function (o) {
          return '<label class="payopt' + (pay === o.id ? " sel" : "") + '"><input type="radio" name="pay" value="' + o.id + '"' + (pay === o.id ? " checked" : "") + ">" + esc(o.n) + "</label>";
        }).join("") + "</div>" +
        '<div id="card-box" class="formgrid"' + (pay === "cb" || pay === "visa" ? "" : " hidden") + ">" +
          fld("cardname", "co.cardname", "text", true, "cc-name", true) + fld("cardno", "co.cardno", "text", true, "cc-number", true) +
          fld("cardexp", "co.cardexp", "text", true, "cc-exp") + fld("cardcvc", "co.cardcvc", "text", true, "cc-csc") + "</div>" +
        '<label class="check"><input type="checkbox" id="co-terms"><span>' + esc(t("co.terms")) + ' <span class="req">*</span></span></label>' +
        '<p class="err" id="co-terms-err" hidden></p><div class="notice warn">' + esc(t("co.sim")) + "</div>" +
        '<div class="row g12"><button class="btn" type="submit">' + ic("shield") + esc(t("co.pay", { x: num(Math.round(cartTotal() * 100) / 100) })) + "</button>" +
          '<button class="btn btn-ghost" type="button" id="co-prev">' + esc(t("co.back")) + "</button></div></form>";
    }
    return '<section class="section"><div class="wrap stack g24"><h1>' + esc(t("co.h1")) + '</h1><ol class="steps">' + steps + "</ol>" +
      '<div class="linecols"><div>' + body + "</div>" +
        '<aside class="summary stack g6">' + store.cart.map(function (l) {
          var it = findItem(l.id); if (!it) return "";
          return '<div class="sumrow"><span>' + l.q + " × " + esc(L(it.name)) + '</span><span class="tnum">' + money(it.price * l.q) + "</span></div>";
        }).join("") +
        (discount() ? '<div class="sumrow" style="color:var(--good)"><span>' + esc(t("cart.disc")) + '</span><span class="tnum">−' + money(discount()) + "</span></div>" : "") +
        '<div class="sumrow"><span>' + esc(t("cart.ship")) + '</span><span class="tnum">' + (shipCost() === 0 ? esc(t("cart.free")) : money(shipCost())) + "</span></div>" +
        '<div class="sumrow total"><span>' + esc(t("cart.total")) + '</span><span class="tnum">' + money(cartTotal()) + "</span></div>" +
        '<p class="xs muted">' + esc(t("cart.vat")) + "</p></aside></div></div></section>";
  }

  function viewAccount() {
    if (!store.user) {
      return '<section class="section"><div class="wrap stack g24">' + crumb(t("acct.title")) + '<div class="split" style="align-items:start">' +
        '<div class="card pad stack g16"><h2>' + esc(t("acct.login.h")) + '</h2><p class="muted small">' + esc(t("acct.login.p")) + "</p>" +
          '<form id="login" class="stack g12" novalidate>' +
            '<div class="field"><label for="lg-email">' + esc(t("co.email")) + ' <span class="req">*</span></label><input id="lg-email" type="email" autocomplete="email" required></div>' +
            '<div class="field"><label for="lg-pass">' + esc(t("acct.pass")) + ' <span class="req">*</span></label><input id="lg-pass" type="password" autocomplete="current-password" required></div>' +
            '<span class="err" id="lg-err" hidden></span><button class="btn" type="submit">' + ic("user") + esc(t("acct.login")) + "</button></form>" +
          '<p class="hint">' + esc(t("acct.demo")) + "</p></div>" +
        '<div class="stack g16"><h2>' + esc(t("acct.new.h")) + '</h2><p class="muted">' + esc(t("acct.new.p")) + "</p>" +
          '<div class="card pad"><form id="signup" class="stack g12" novalidate><div class="formgrid">' +
            '<div class="field"><label for="su-first">' + esc(t("co.first")) + ' <span class="req">*</span></label><input id="su-first" required></div>' +
            '<div class="field"><label for="su-last">' + esc(t("co.last")) + ' <span class="opt">(' + esc(t("lead.opt")) + ')</span></label><input id="su-last"></div>' +
            '<div class="field span2"><label for="su-email">' + esc(t("co.email")) + ' <span class="req">*</span></label><input id="su-email" type="email" required></div>' +
            '<div class="field span2"><label for="su-pass">' + esc(t("acct.pass")) + ' <span class="req">*</span></label><input id="su-pass" type="password" required></div>' +
            '<div class="field span2"><label for="su-profile">' + esc(t("acct.pref.profile")) + ' <span class="opt">(' + esc(t("lead.opt")) + ")</span></label>" +
              '<select id="su-profile"><option value="">—</option><option>' + esc(t("acct.pref.soft")) + "</option><option>" + esc(t("acct.pref.bal")) + "</option><option>" + esc(t("acct.pref.int")) + "</option></select></div>" +
          '</div><span class="err" id="su-err" hidden></span><button class="btn" type="submit">' + esc(t("acct.create")) + ic("arrow", "ic-arrow") + "</button>" +
          '<p class="hint">' + esc(t("common.required")) + " : *</p></form></div></div></div></div></section>";
    }
    return '<section class="section"><div class="wrap stack g24">' + crumb(t("acct.title")) +
      '<div class="row g16" style="justify-content:space-between"><div class="row g16"><span class="avatar" style="width:56px;height:56px;font-size:1.2rem">' +
        esc((store.user.first || store.user.email || "?").charAt(0).toUpperCase()) + "</span><div><h1 style=\"font-size:2rem\">" + esc(t("acct.hello")) + ", " + esc(store.user.first || store.user.email) + "</h1>" +
        '<p class="muted small">' + esc(store.user.email) + "</p></div></div>" +
        '<button class="btn btn-ghost btn-sm" id="logout">' + esc(t("acct.logout")) + "</button></div>" +
      '<div class="tabs" role="tablist">' + [["orders", "acct.tab.orders"], ["info", "acct.tab.info"], ["bill", "acct.tab.bill"], ["pref", "acct.tab.pref"]].map(function (x) {
        return '<button role="tab" data-at="' + x[0] + '" aria-selected="' + ((store.user.tab || "orders") === x[0]) + '">' + esc(t(x[1])) + "</button>";
      }).join("") + "</div><div>" + acctBody() + "</div></div></section>";
  }
  function acctBody() {
    var tab = (store.user && store.user.tab) || "orders", orders = store.orders;
    if (tab === "orders") {
      var tbl = !orders.length ? '<p class="muted">' + esc(t("acct.orders.none")) + "</p>" :
        '<div class="tablewrap"><table><thead><tr><th>' + esc(t("acct.order")) + "</th><th>" + esc(t("acct.order.date")) + "</th><th>" + esc(t("acct.order.status")) + "</th><th>" + esc(t("acct.order.total")) + "</th><th></th></tr></thead><tbody>" +
        orders.map(function (o) {
          return "<tr><td><strong>" + esc(o.id) + '</strong><br><span class="xs muted">' + o.items.map(function (l) { var it = findItem(l.id); return l.q + " × " + esc(it ? L(it.name) : l.id); }).join("<br>") + "</span></td>" +
            "<td>" + esc(o.date) + '</td><td><span class="pill ok">' + ic("clock") + esc(t("acct.order." + o.status)) + '</span></td><td class="tnum">' + money(o.total) + "</td>" +
            '<td><button class="btn btn-sm btn-ghost" data-reorder="' + esc(o.id) + '">' + esc(t("acct.reorder")) + "</button></td></tr>";
        }).join("") + "</tbody></table></div>";
      return tbl + '<div class="card pad" style="margin-top:20px"><div class="row g16" style="align-items:flex-start"><span class="mi-ic">' + ic("calendar") + '</span><div class="stack g8" style="flex:1;min-width:220px"><h3>' + esc(t("acct.remind.h")) + '</h3><p class="small muted">' + esc(t("acct.remind.p")) + "</p>" +
        '<div class="row g8"><label class="small" for="remind">' + esc(t("acct.remind.when")) + '</label><select id="remind" class="selectbox">' + ["60", "90", "off"].map(function (v) {
          return '<option value="' + v + '"' + ((store.user.remind || "90") === v ? " selected" : "") + ">" + esc(t("acct.remind." + v)) + "</option>";
        }).join("") + "</select></div></div></div></div>";
    }
    if (tab === "info" || tab === "bill") {
      var pfx = tab === "bill" ? "b" : "i";
      return '<form class="stack g16" id="acct-form"><h3>' + esc(t(tab === "bill" ? "acct.bill.h" : "acct.tab.info")) + '</h3><div class="formgrid" style="max-width:640px">' +
        ["first", "last", "email", "phone", "addr", "zip", "city"].map(function (k) {
          var lbl = { first: "co.first", last: "co.last", email: "co.email", phone: "co.phone", addr: "co.addr", zip: "co.zip", city: "co.city" }[k];
          return '<div class="field' + (k === "addr" ? " span2" : "") + '"><label for="' + pfx + "-" + k + '">' + esc(t(lbl)) + '</label><input id="' + pfx + "-" + k + '" value="' + esc(store.user[pfx + k] || store.user[k] || "") + '"></div>';
        }).join("") +
        (tab === "bill" ? '<div class="field span2"><label for="b-vat">' + esc(t("co.vatno")) + '</label><input id="b-vat" value="' + esc(store.user.bvat || "") + '"></div>' : "") +
        '</div><div><button class="btn" type="submit">' + esc(t("acct.save")) + "</button></div></form>";
    }
    return '<form class="stack g16" id="acct-form"><h3>' + esc(t("acct.pref.h")) + '</h3><div class="stack g12" style="max-width:560px">' +
      '<label class="check"><input type="checkbox" id="pf-news"' + (store.user.news !== false ? " checked" : "") + "><span>" + esc(t("co.optin")) + "</span></label>" +
      '<div class="field"><label for="pf-profile">' + esc(t("acct.pref.profile")) + '</label><select id="pf-profile">' + ["acct.pref.soft", "acct.pref.bal", "acct.pref.int"].map(function (k) {
        return "<option" + (store.user.profile === t(k) ? " selected" : "") + ">" + esc(t(k)) + "</option>";
      }).join("") + '</select></div></div><div><button class="btn" type="submit">' + esc(t("acct.save")) + "</button></div></form>";
  }

  var PILLAR_IC = ["olive", "pin", "book", "leaf", "shield", "drop", "seal"];
  function viewRecipes() {
    var feat = [["salmorejo", "p6", 4], ["vinaigrette", "p6", 0], ["tomate", "p6", 1]];
    return '<section class="section"><div class="wrap stack g32">' + crumb(t("recipes.title")) +
      '<div class="stack g12 measure"><h1>' + esc(t("recipes.h1")) + '</h1><p class="lede">' + esc(t("recipes.lede")) + "</p></div>" +
      '<div class="grid g-3">' + feat.map(function (f) {
        var p = D.pillars.filter(function (x) { return x.k === f[1]; })[0];
        return '<article class="vcard">' + A.dishSpot(f[0]) + '<div class="b"><span class="eyebrow">' + esc(L(p.t)) + "</span><h3>" + esc(L(p.a)[f[2]]) + "</h3>" +
          '<span class="link-arrow">' + esc(t("recipes.read")) + ic("arrow") + "</span></div></article>";
      }).join("") + "</div>" +
      '<div class="grid g-2">' + D.pillars.map(function (p, i) {
        return '<div class="pillar"><div class="row g12"><span class="pi">' + ic(PILLAR_IC[i]) + "</span><h3>" + esc(L(p.t)) + "</h3></div><ul>" +
          L(p.a).map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div></div></section>";
  }

  function viewTour() {
    return '<section class="section"><div class="wrap stack g32">' + crumb(t("tour.title")) +
      '<div class="stack g12 measure"><h1>' + esc(t("tour.h1")) + '</h1><p class="lede">' + esc(t("tour.lede")) + "</p></div>" +
      '<div class="grid g-2"><div class="art-frame" data-scene-host="0" data-t=".9"></div><div class="art-frame" data-scene-host="4" data-t=".7"></div></div>' +
      '<div class="split" style="align-items:start">' +
        '<div class="stack g16"><h3>' + esc(t("tour.what")) + '</h3><ol class="stack g12" style="padding:0;margin:0;list-style:none">' +
          ["tour.w1", "tour.w2", "tour.w3", "tour.w4"].map(function (k, i) {
            return '<li class="row g12" style="flex-wrap:nowrap;align-items:flex-start"><span class="mi-ic" style="font-family:var(--font-display);font-weight:600">' + (i + 1) + "</span><span>" + esc(t(k)) + "</span></li>";
          }).join("") + "</ol>" +
          '<div class="grid g-2"><div class="pillar"><div class="row g8">' + ic("calendar") + "<h4>" + esc(t("tour.when")) + '</h4></div><p class="small muted" style="margin-top:8px">' + esc(t("tour.when.p")) + "</p></div>" +
            '<div class="pillar"><div class="row g8">' + ic("pin") + "<h4>" + esc(t("tour.where")) + '</h4></div><p class="small muted" style="margin-top:8px">' + esc(t("tour.where.p")) + "</p></div></div></div>" +
        '<div class="card pad stack g12"><h3>' + esc(t("tour.form.h")) + "</h3>" + leadForm("lead-tour") + "</div>" +
      "</div></div></section>";
  }

  function carrierTable() {
    var rows = [
      ["Correos — Paq Internacional / Correos Express", "CMR / DNT UE", { fr: "5 à 9 jours", es: "5 a 9 días", en: "5 to 9 days" }, "6,90 €"],
      ["Mail Boxes Etc (MBE)", { fr: "Bordereau UE standard", es: "Albarán UE estándar", en: "Standard EU waybill" }, { fr: "2 à 4 jours", es: "2 a 4 días", en: "2 to 4 days" }, "12,90 €"],
      ["DHL eCommerce", { fr: "Bordereau UE standard", es: "Albarán UE estándar", en: "Standard EU waybill" }, { fr: "2 à 5 jours", es: "2 a 5 días", en: "2 to 5 days" }, "9,90 €"]
    ];
    return '<div class="tablewrap"><table><thead><tr><th>' + esc(t("ship.c.name")) + "</th><th>" + esc(t("ship.c.liquid")) + "</th><th>" + esc(t("ship.c.doc")) + "</th><th>" + esc(t("ship.c.time")) + "</th><th>" + esc(t("ship.c.price")) + "</th></tr></thead><tbody>" +
      rows.map(function (r) {
        return "<tr><td><strong>" + esc(r[0]) + '</strong></td><td><span class="pill ok">' + ic("check") + "</span></td><td>" + esc(typeof r[1] === "object" ? L(r[1]) : r[1]) + "</td><td>" + esc(L(r[2])) + '</td><td class="tnum">' + esc(r[3]) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }
  function packagingSvg() {
    var cap = { fr: "Coupe de l'emballage expédié : carton double cannelure, coussins d'air sur six faces, sachet anti-fuite, calage central.",
      es: "Sección del embalaje: caja de doble canal, cojines de aire en seis caras, bolsa antifugas y calzo central.",
      en: "Cross-section of the shipping pack: double-wall carton, air pillows on six faces, leak-proof sleeve, centre brace." };
    return '<svg viewBox="0 0 320 240" role="img" aria-label="' + esc(L(cap)) + '" style="width:100%;height:auto;display:block">' +
      '<rect x="18" y="18" width="284" height="204" rx="8" fill="#E9D8B9" stroke="#B89466" stroke-width="2.5"/>' +
      '<rect x="30" y="30" width="260" height="180" rx="6" fill="#F6EEDC" stroke="#CDB58C" stroke-width="1.2" stroke-dasharray="5 4"/>' +
      '<g fill="#E5EBD5" stroke="#B5C696">' +
        '<rect x="40" y="40" width="56" height="34" rx="12"/><rect x="224" y="40" width="56" height="34" rx="12"/><rect x="40" y="166" width="56" height="34" rx="12"/><rect x="224" y="166" width="56" height="34" rx="12"/>' +
        '<rect x="40" y="88" width="40" height="64" rx="12"/><rect x="240" y="88" width="40" height="64" rx="12"/></g>' +
      '<rect x="122" y="52" width="76" height="150" rx="10" fill="#D7E0F0" opacity=".6" stroke="#8EA6C9" stroke-dasharray="3 3"/>' +
      '<path d="M146 60h28v18c0 6 10 10 10 22v92h-48V100c0-12 10-16 10-22z" fill="#3D5421"/>' +
      '<rect x="146" y="58" width="28" height="10" rx="2" fill="#C89D25"/>' +
      '<rect x="141" y="118" width="38" height="44" rx="2" fill="#FBF6E8"/>' +
      '<text x="160" y="137" text-anchor="middle" font-size="7" fill="#8A6E1C" font-family="sans-serif" letter-spacing="1.5">AOP</text>' +
      '<text x="160" y="150" text-anchor="middle" font-size="10" fill="#25301A" font-family="Georgia, serif">Baena</text>' +
      '<text x="160" y="232" text-anchor="middle" font-size="10" fill="#6E6A58" font-family="sans-serif">500 ml · 0,9 kg</text></svg>' +
      '<p class="xs muted" style="margin-top:8px">' + esc(L(cap)) + "</p>";
  }
  function viewShipping() {
    return '<section class="section"><div class="wrap stack g32">' + crumb(t("ship.title")) +
      '<div class="stack g12 measure"><h1>' + esc(t("ship.h1")) + '</h1><p class="lede">' + esc(t("ship.lede")) + "</p></div>" +
      '<div class="trust" style="margin-top:0">' + [["truck", "trust.3"], ["shield", "trust.4"], ["gift", "top.2"], ["seal", "trust.1"]].map(function (x) {
        return '<div class="trust-i"><span class="ti">' + ic(x[0]) + "</span><span><strong>" + esc(t(x[1])) + "</strong>" + (I.fr[x[1] + "s"] ? "<span>" + esc(t(x[1] + "s")) + "</span>" : "") + "</span></div>";
      }).join("") + "</div>" +
      "<h3>" + esc(t("ship.carriers")) + "</h3>" + carrierTable() +
      '<div class="split" style="align-items:start"><div class="stack g12"><h3>' + esc(t("ship.pack.h")) + "</h3><p>" + esc(t("ship.pack.p")) + "</p>" +
        "<h3 style=\"margin-top:12px\">" + esc(t("ship.vat.h")) + "</h3><p>" + esc(t("ship.vat.p")) + "</p></div>" +
        '<div class="card pad">' + packagingSvg() + "</div></div></div></section>";
  }

  function viewPro() {
    return '<section class="section"><div class="wrap stack g32">' + crumb(t("pro.title")) +
      '<div class="split" style="align-items:start"><div class="stack g16"><h1>' + esc(t("pro.h1")) + '</h1><p class="lede">' + esc(t("pro.lede")) + "</p>" +
        '<ul class="why" style="padding:0;margin:0">' + ["pro.b1", "pro.b2", "pro.b3", "pro.b4"].map(function (k) { return "<li>" + ic("check") + "<span>" + esc(t(k)) + "</span></li>"; }).join("") + "</ul>" +
        '<div class="grid g-4" style="gap:10px; margin-top:8px">' + D.products.map(function (p) {
          return '<a href="#/produit/' + p.id + '" class="pcard-media" style="border-radius:14px;border:1px solid var(--line)">' + A.pack(p.id, { label: L(p.name) }) + "</a>";
        }).join("") + "</div></div>" +
        '<div class="card pad stack g12"><h3>' + esc(t("pro.form.h")) + '</h3><form id="pro-form" class="stack g12" novalidate><div class="formgrid">' +
          '<div class="field span2"><label for="pr-company">' + esc(t("co.company")) + ' <span class="req">*</span></label><input id="pr-company" required></div>' +
          '<div class="field"><label for="pr-name">' + esc(t("co.first")) + ' <span class="req">*</span></label><input id="pr-name" required></div>' +
          '<div class="field"><label for="pr-email">' + esc(t("co.email")) + ' <span class="req">*</span></label><input id="pr-email" type="email" required></div>' +
          '<div class="field"><label for="pr-type">' + esc(t("pro.type")) + ' <span class="req">*</span></label><select id="pr-type">' + ["pro.t1", "pro.t2", "pro.t3", "pro.t4", "pro.t5"].map(function (k) { return "<option>" + esc(t(k)) + "</option>"; }).join("") + "</select></div>" +
          '<div class="field"><label for="pr-vol">' + esc(t("pro.vol")) + ' <span class="opt">(' + esc(t("lead.opt")) + ')</span></label><select id="pr-vol"><option>—</option><option>&lt; 100</option><option>100 – 500</option><option>500 – 2 000</option><option>&gt; 2 000</option></select></div>' +
          '<div class="field span2"><label for="pr-vat">' + esc(t("co.vatno")) + ' <span class="opt">(' + esc(t("lead.opt")) + ')</span></label><input id="pr-vat"></div>' +
          '<div class="field span2"><label for="pr-msg">' + esc(t("contact.msg")) + ' <span class="opt">(' + esc(t("lead.opt")) + ')</span></label><textarea id="pr-msg"></textarea></div>' +
        '</div><span class="err" id="pr-err" hidden></span><button class="btn" type="submit">' + esc(t("pro.send")) + ic("arrow", "ic-arrow") + "</button>" +
        '<p class="hint">' + esc(t("common.required")) + " : *</p></form></div></div></div></section>";
  }

  function viewContact() {
    return '<section class="section"><div class="wrap stack g24" style="max-width:760px">' + crumb(t("ft.contact")) + "<h1>" + esc(t("contact.h")) + "</h1>" +
      '<div class="card pad"><form id="ct-form" class="stack g12" novalidate><div class="formgrid">' +
        '<div class="field"><label for="ct-name">' + esc(t("co.first")) + ' <span class="req">*</span></label><input id="ct-name" required></div>' +
        '<div class="field"><label for="ct-email">' + esc(t("co.email")) + ' <span class="req">*</span></label><input id="ct-email" type="email" required></div>' +
        '<div class="field span2"><label for="ct-msg">' + esc(t("contact.msg")) + ' <span class="req">*</span></label><textarea id="ct-msg" required></textarea></div>' +
      '</div><span class="err" id="ct-err" hidden></span><button class="btn" type="submit">' + ic("mail") + esc(t("contact.send")) + "</button>" +
      '<p class="hint">' + esc(t("common.required")) + " : *</p></form></div>" +
      '<div class="grid g-2"><div class="pillar row g12">' + ic("pin") + '<span class="small">Consejo Regulador DOP Baena · Av. de Cervantes 2, 14850 Baena (Córdoba)</span></div>' +
        '<div class="pillar row g12">' + ic("phone") + '<span class="small tnum">+34 957 691 121 · bonjour@aopbaena.example</span></div></div></div></section>';
  }

  /* ================================================================ router */
  var first = true;
  function render() {
    var hash = location.hash || "#/";
    if (hash.indexOf("#/") !== 0) hash = "#/";
    var app = $("#app"), html, after = null;
    if (hash !== "#/checkout" && store.coStep === 4) { store.coStep = 1; store.lastOrder = null; }
    motion.story = null; motion.hero = null;

    if (hash.indexOf("#/produit/") === 0) { html = viewProduct(hash.slice(10)); after = wirePdp; }
    else if (hash === "#/produits") { html = viewShop(); after = wireShop; }
    else if (hash === "#/aop-baena") html = viewAop();
    else if (hash === "#/recettes") html = viewRecipes();
    else if (hash === "#/oleotourisme") { html = viewTour(); after = function () { wireLeadForm("lead-tour", "oleotourisme"); }; }
    else if (hash === "#/livraison") html = viewShipping();
    else if (hash === "#/pro") { html = viewPro(); after = wirePro; }
    else if (hash === "#/contact") { html = viewContact(); after = wireContact; }
    else if (hash === "#/panier") { html = viewCart(); after = wireCart; }
    else if (hash === "#/checkout") { html = viewCheckout(); after = wireCheckout; }
    else if (hash === "#/compte") { html = viewAccount(); after = wireAccount; }
    else if (hash === "#/dossier") { html = window.DOSSIER.view(); after = window.DOSSIER.wire; }
    else { html = viewHome(); after = wireHome; }

    app.innerHTML = html;
    app.classList.toggle("is-home", hash === "#/");
    if (!first && !REDUCED) { app.classList.remove("page-in"); void app.offsetWidth; app.classList.add("page-in"); }
    first = false;
    $$("[data-scene-host]", app).forEach(function (el) { A.mountScene(el, +el.getAttribute("data-scene-host"), +(el.getAttribute("data-t") || .5)); });
    if (after) after();
    $$("[data-add]", app).forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); addToCart(b.getAttribute("data-add"), 1); }); });
    paintHeader();
    document.title = pageTitle(hash);
  }
  function pageTitle(hash) {
    var base = "AOP Baena", map = { "#/produits": t("shop.title"), "#/aop-baena": t("aop.title"), "#/recettes": t("recipes.title"), "#/oleotourisme": t("tour.title"),
      "#/livraison": t("ship.title"), "#/pro": t("pro.title"), "#/panier": t("cart.title"), "#/checkout": t("co.title"), "#/compte": t("acct.title"), "#/dossier": t("dossier.title"), "#/contact": t("ft.contact") };
    if (hash.indexOf("#/produit/") === 0) { var p = findItem(hash.slice(10)); return (p ? L(p.name) + " | " : "") + base; }
    return (map[hash] ? map[hash] + " | " : "") + base;
  }

  /* ---------------- wiring ---------------- */
  function wireShop() {
    $$("[data-filter]").forEach(function (b) { b.addEventListener("click", function () { shopState.filter = b.getAttribute("data-filter"); render(); }); });
    var s = $("#sort"); if (s) s.addEventListener("change", function () { shopState.sort = s.value; render(); });
  }
  function wirePdp() {
    var id = (location.hash || "").slice(10);
    function mountHosts(root) { $$("[data-scene]", root).forEach(function (el) { A.mountScene(el, +el.getAttribute("data-scene"), +el.getAttribute("data-t")); }); }
    mountHosts($(".pdp-media"));
    $$("[data-view]").forEach(function (b) {
      b.addEventListener("click", function () {
        pdpState.view = +b.getAttribute("data-view");
        var p = findItem(id), m = $("#pdp-main"); m.classList.remove("zoom");
        m.innerHTML = pdpView(p, pdpState.view); mountHosts(m);
        $$("[data-view]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      });
    });
    var main = $("#pdp-main"); if (main) main.addEventListener("click", function () { if (pdpState.view !== 2) main.classList.toggle("zoom"); });
    $$("[data-q]").forEach(function (b) { b.addEventListener("click", function () { pdpState.qty = Math.max(1, pdpState.qty + (+b.getAttribute("data-q"))); $("#pdp-qty").textContent = pdpState.qty; }); });
    $$("[data-tab]").forEach(function (b) { b.addEventListener("click", function () { pdpState.tab = b.getAttribute("data-tab"); var y = window.pageYOffset; render(); window.scrollTo(0, y); }); });
    var add = $("#pdp-add"), buy = $("#pdp-buy");
    if (add) add.addEventListener("click", function () { addToCart(id, pdpState.qty); });
    if (buy) buy.addEventListener("click", function () { addToCart(id, pdpState.qty, true); location.hash = "#/panier"; });
  }
  function wireCart() {
    $$("[data-cq]").forEach(function (b) { b.addEventListener("click", function () {
      var id = b.getAttribute("data-cq"), ln = store.cart.filter(function (l) { return l.id === id; })[0];
      if (ln) setQty(id, Math.max(0, ln.q + (+b.getAttribute("data-d"))));
    }); });
    $$("[data-rm]").forEach(function (b) { b.addEventListener("click", function () { setQty(b.getAttribute("data-rm"), 0); }); });
    var go = $("#promo-go");
    if (go) go.addEventListener("click", function () {
      var v = $("#promo").value.trim().toUpperCase(), m = $("#promo-msg");
      if (v === CODE) { store.promo = true; render(); toast(t("cart.codeok")); } else { m.textContent = t("cart.codeko"); m.hidden = false; }
    });
  }
  function wireCheckout() {
    var prev = $("#co-prev"); if (prev) prev.addEventListener("click", function () { store.coStep = Math.max(1, store.coStep - 1); render(); });
    var inv = $("#co-inv"); if (inv) inv.addEventListener("change", function () { $("#co-inv-box").hidden = !inv.checked; });
    var gift = $("#co-gift"); if (gift) gift.addEventListener("change", function () { $("#co-gift-box").hidden = !gift.checked; });
    $$('input[name="ship"]').forEach(function (r) { r.addEventListener("change", function () { store.coData.ship = r.value; render(); }); });
    $$('input[name="pay"]').forEach(function (r) {
      r.addEventListener("change", function () {
        store.coData.pay = r.value;
        $$(".payopt").forEach(function (l) { l.classList.remove("sel"); }); r.closest(".payopt").classList.add("sel");
        var cb = $("#card-box"); if (cb) cb.hidden = !(r.value === "cb" || r.value === "visa");
      });
    });
    var f = $("#co-form"); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (store.coStep === 1) {
        var ok = true;
        ["first", "last", "email", "addr", "zip", "city"].forEach(function (k) {
          var el = $("#co-" + k), er = $("#co-" + k + "-err"), v = el.value.trim(), bad = !v || (k === "email" && !validEmail(v));
          if (bad) { er.textContent = k === "email" ? t("lead.err.email") : t("lead.req"); er.hidden = false; ok = false; } else { er.hidden = true; store.coData[k] = v; }
        });
        ["phone", "addr2"].forEach(function (k) { var el = $("#co-" + k); if (el) store.coData[k] = el.value.trim(); });
        store.coData.optin = $("#co-optin").checked;
        if (!ok) return;
        if (store.coData.optin) saveLead("checkout-optin", { email: store.coData.email, name: store.coData.first, city: store.coData.city });
        store.coStep = 2; render(); window.scrollTo(0, 0);
      } else if (store.coStep === 2) {
        store.coData.ship = (f.querySelector('input[name="ship"]:checked') || {}).value || "correos";
        store.coData.gift = $("#co-gift").checked; store.coData.giftmsg = $("#co-giftmsg").value;
        store.coStep = 3; render(); window.scrollTo(0, 0);
      } else {
        var terms = $("#co-terms"), te = $("#co-terms-err");
        if (!terms.checked) { te.textContent = t("lead.err.consent"); te.hidden = false; return; }
        te.hidden = true;
        var payId = (f.querySelector('input[name="pay"]:checked') || {}).value || "cb";
        if (payId === "cb" || payId === "visa") {
          var cok = true;
          ["cardname", "cardno", "cardexp", "cardcvc"].forEach(function (k) {
            var el = $("#co-" + k), er = $("#co-" + k + "-err");
            if (!el.value.trim()) { er.textContent = t("lead.req"); er.hidden = false; cok = false; } else er.hidden = true;
          });
          if (!cok) return;
        }
        placeOrder(payId);
      }
    });
  }
  function placeOrder(payId) {
    var shipName = SHIPOPTS.filter(function (o) { return o.id === (store.coData.ship || "correos"); })[0].n;
    var payName = PAYOPTS.filter(function (o) { return o.id === payId; })[0].n;
    var days = store.coData.ship === "mbe" ? 4 : store.coData.ship === "dhl" ? 5 : 9;
    var order = {
      id: "BAE-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 9000) + 1000),
      date: new Date().toISOString().slice(0, 10),
      eta: new Date(Date.now() + days * 864e5).toLocaleDateString(LOCALES[store.lang], { day: "numeric", month: "long", year: "numeric" }),
      items: store.cart.slice(), total: cartTotal(), ship: shipName, pay: payName, email: store.coData.email, status: "prep"
    };
    store.orders.unshift(order); save("orders", store.orders);
    if (!store.user) { store.user = { email: store.coData.email, first: store.coData.first, last: store.coData.last, tab: "orders" }; save("user", store.user); }
    store.lastOrder = order; store.cart = []; store.promo = false; save("cart", store.cart);
    store.coStep = 4; render(); paintBadge(); window.scrollTo(0, 0);
  }
  function wireAccount() {
    var lg = $("#login");
    if (lg) lg.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = $("#lg-email").value.trim(), pw = $("#lg-pass").value, er = $("#lg-err");
      if (!validEmail(em) || !pw) { er.textContent = t("lead.err.email"); er.hidden = false; return; }
      store.user = { email: em, first: em.split("@")[0], tab: "orders" }; save("user", store.user); render();
    });
    var su = $("#signup");
    if (su) su.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = $("#su-email").value.trim(), fn = $("#su-first").value.trim(), pw = $("#su-pass").value, er = $("#su-err");
      if (!fn || !pw || !validEmail(em)) { er.textContent = t("lead.err.email"); er.hidden = false; return; }
      store.user = { email: em, first: fn, last: $("#su-last").value.trim(), profile: $("#su-profile").value, tab: "orders" };
      save("user", store.user); saveLead("signup", { email: em, name: fn }); render();
    });
    var lo = $("#logout"); if (lo) lo.addEventListener("click", function () { store.user = null; save("user", null); render(); });
    $$("[data-at]").forEach(function (b) { b.addEventListener("click", function () { store.user.tab = b.getAttribute("data-at"); save("user", store.user); render(); }); });
    $$("[data-reorder]").forEach(function (b) {
      b.addEventListener("click", function () {
        var o = store.orders.filter(function (x) { return x.id === b.getAttribute("data-reorder"); })[0]; if (!o) return;
        o.items.forEach(function (l) { addToCart(l.id, l.q, true); }); location.hash = "#/panier";
      });
    });
    var rem = $("#remind"); if (rem) rem.addEventListener("change", function () { store.user.remind = rem.value; save("user", store.user); toast(t("acct.saved")); });
    var af = $("#acct-form");
    if (af) af.addEventListener("submit", function (e) {
      e.preventDefault();
      $$("#acct-form input, #acct-form select").forEach(function (el) {
        if (el.type === "checkbox") store.user.news = el.checked;
        else if (el.id === "pf-profile") store.user.profile = el.value;
        else store.user[el.id.replace("-", "")] = el.value;
      });
      save("user", store.user); toast(t("acct.saved"));
    });
  }
  function wirePro() {
    var f = $("#pro-form"); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = $("#pr-email").value.trim(), co = $("#pr-company").value.trim(), nm = $("#pr-name").value.trim(), er = $("#pr-err");
      if (!co || !nm || !validEmail(em)) { er.textContent = t("lead.err.email"); er.hidden = false; return; }
      er.hidden = true; f.querySelector('button[type="submit"]').disabled = true;
      saveLead("b2b", { email: em, name: nm, company: co, type: $("#pr-type").value, volume: $("#pr-vol").value, vat: $("#pr-vat").value, message: $("#pr-msg").value })
        .then(function () { f.parentNode.replaceChild(h('<div class="notice ok">' + esc(t("pro.ok")) + "</div>").firstChild, f); });
    });
  }
  function wireContact() {
    var f = $("#ct-form"); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = $("#ct-email").value.trim(), nm = $("#ct-name").value.trim(), ms = $("#ct-msg").value.trim(), er = $("#ct-err");
      if (!nm || !ms || !validEmail(em)) { er.textContent = t("lead.err.email"); er.hidden = false; return; }
      er.hidden = true; f.querySelector('button[type="submit"]').disabled = true;
      saveLead("contact", { email: em, name: nm, message: ms }).then(function () { f.parentNode.replaceChild(h('<div class="notice ok">' + esc(t("contact.ok")) + "</div>").firstChild, f); });
    });
  }

  /* ---------------- boot ---------------- */
  window.BAENA = { t: t, L: L, esc: esc, money: money, num: num, store: store, $: $, $$: $$, render: function () { render(); },
    carrierTable: carrierTable, packagingSvg: packagingSvg, icon: ic };
  document.documentElement.setAttribute("lang", store.lang);
  $("#scrim").addEventListener("click", closeSheets);
  window.addEventListener("hashchange", function () {
    var hsh = location.hash || "#/";
    if (hsh.indexOf("#/") !== 0) {
      var el = document.getElementById(hsh.slice(1));
      if (el) el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
      return;
    }
    closeSheets(); closeDD();
    if (hsh === "#/#story") { location.hash = "#/"; setTimeout(function () { var s = document.getElementById("story"); if (s) s.scrollIntoView(); }, 60); return; }
    render(); window.scrollTo(0, 0);
  });
  paintHeader(); paintFooter(); render();
})();
