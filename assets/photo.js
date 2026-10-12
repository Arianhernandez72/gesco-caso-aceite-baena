/* Photography. The hero is a photograph of the bottle in its Andalusian setting;
   the mill visit uses photographs too; product packshots and the process scenes are
   3D studio stills. Keeps the same call signatures so the rest of the site is unchanged. */
(function () {
  "use strict";
  var A = window.ART, P = "assets/photo/";
  /* Bump V whenever a photo changes so browsers and GitHub Pages' cache fetch the new file. */
  var V = "?v=20261006";

  /* ---- product packshots ---- */
  var PACK = { classique: "p-classique", premium: "p-premium", cadeau: "p-cadeau", bidon: "p-bidon", verres: "p-verres", carnet: "p-carnet" };
  /* The detail view is the same still, scaled up and panned to the label. */
  var DETAIL = { classique: "52% 40%", premium: "50% 56%", cadeau: "58% 46%", bidon: "48% 48%", verres: "50% 52%", carnet: "52% 44%" };

  A.pack = function (id, o) {
    o = o || {};
    var f = PACK[id] || PACK.classique;
    var cls = "pack" + (o.cls ? " " + o.cls : "");
    var style = "";
    if (o.vb === "detail") { style = ' style="object-fit:cover;transform:scale(1.85);transform-origin:' + (DETAIL[id] || "50% 45%") + '"'; }
    return '<img class="' + cls + '" src="' + P + f + '.jpg' + V + '" alt="' + (o.label || "").replace(/"/g, "&quot;") +
      '" loading="lazy" decoding="async"' + style + ">";
  };

  /* ---- hero: wide frame on desktop, a tighter crop of the same photo on phones ---- */
  A.hero = function () {
    return '<picture><source media="(max-width:820px)" srcset="' + P + 'hero-m.jpg' + V + '">' +
      '<img class="hero-art" src="' + P + 'hero.jpg' + V + '" alt="Bouteille d\'huile d\'olive AOP Baena, olives et pain sur une terrasse face à un village blanc et aux oliveraies d\'Andalousie" fetchpriority="high" decoding="async"></picture>';
  };

  /* ---- a wide landscape band ---- */
  A.landscape = function (cls) {
    return '<img class="' + (cls || "land") + '" src="' + P + 'hero-m.jpg' + V + '" alt="Terrasse andalouse face au village et aux oliveraies de Baena" loading="lazy" decoding="async">';
  };

  /* ---- the mill visit: photographs of the olive grove and a tasting on the terrace ---- */
  var TOUR = {
    cata: "Dégustation d'huile AOP Baena sur une terrasse face au village",
    olivar: "Oliviers centenaires dans les collines de Baena"
  };
  A.tourPhoto = function (id) {
    return '<img src="' + P + "t-" + id + '.jpg' + V + '" alt="' + TOUR[id].replace(/"/g, "&quot;") + '" loading="lazy" decoding="async">';
  };

  /* ---- the eight process stages: two frames crossfaded by scroll ---- */
  var STAGE_ALT = [
    "Olives mûrissant sur la branche", "Récolte sur filets sous l'olivier", "Transport des caisses au moulin",
    "Lavage et broyage au moulin", "Malaxage de la pâte sous 27 °C", "Extraction et décantation de l'huile",
    "Mise en bouteille et étiquetage", "L'huile versée sur une tartine"
  ];
  A.sceneCount = 8;

  /* Mounts stage i into host and returns an updater taking t in 0..1. */
  A.mountScene = function (host, i, t) {
    if (!host) return function () {};
    var n = (i % 8) + 1, alt = STAGE_ALT[i % 8];
    host.innerHTML =
      '<div class="ph">' +
        '<img class="ph-a" src="' + P + "s" + n + 'a.jpg' + V + '" alt="' + alt + '" loading="lazy" decoding="async">' +
        '<img class="ph-b" src="' + P + "s" + n + 'b.jpg' + V + '" alt="" aria-hidden="true" loading="lazy" decoding="async">' +
      "</div>";
    var imgs = host.querySelectorAll ? host.querySelectorAll("img") : [];
    var a = imgs[0], b = imgs[1];
    var upd = function (tt) {
      if (!a || !b) return;
      tt = tt < 0 ? 0 : tt > 1 ? 1 : tt;
      var k = tt < .18 ? 0 : tt > .82 ? 1 : (tt - .18) / .64;
      b.style.opacity = k;
      var z = 1 + tt * 0.07;
      a.style.transform = b.style.transform = "scale(" + z.toFixed(4) + ")";
    };
    upd(t === undefined ? 0 : t);
    return upd;
  };

  /* Spot illustrations keep their vector treatment: they are diagrams, not photos. */
})();
