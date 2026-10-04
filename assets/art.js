/* AOP Baena — illustration system: icons, logo, product packshots, spot art,
   hero landscape and the eight scroll-driven scenes of the oil's journey.
   Everything is vector, drawn from one palette so every image belongs together. */
window.ART = (function () {
  "use strict";

  var uid = 0;
  function U(p) { uid += 1; return (p || "a") + uid; }
  function f(n) { return Math.round(n * 10) / 10; }
  function E(t, a, c) {
    var s = "<" + t;
    for (var k in a) if (a[k] !== null && a[k] !== undefined) s += " " + k + '="' + a[k] + '"';
    return c === undefined ? s + "/>" : s + ">" + c + "</" + t + ">";
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function rgb(h) { h = h.replace("#", ""); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(a, b, t) {
    var A = rgb(a), B = rgb(b);
    return "rgb(" + Math.round(lerp(A[0], B[0], t)) + "," + Math.round(lerp(A[1], B[1], t)) + "," + Math.round(lerp(A[2], B[2], t)) + ")";
  }
  var SERIF = "'Playfair Display', Georgia, serif";
  var SANS = "'Instrument Sans', system-ui, sans-serif";

  /* One palette for every image on the site. */
  var C = {
    sky1: "#EDE3C6", sky2: "#F8F3E4", sun: "#F3D27C",
    hillFar: "#D3DCBC", hillMid: "#B2C48F", field: "#9EB474", fieldDk: "#8AA25F",
    can1: "#56722A", can2: "#67853A", can3: "#7C9A49", leafHi: "#B7C994",
    trunk: "#6F5B3C", trunkDk: "#514129",
    olG: "#A2B661", olV: "#5D3047", olB: "#2D2420",
    oil1: "#E7C552", oil2: "#CDA22B", oil3: "#A87F1A",
    glass1: "#1C270B", glass2: "#3D5421", label: "#FBF6E8", gold: "#B89130",
    m1: "#EEF0EB", m2: "#C3CAC0", m3: "#8F998D", mDk: "#5E665C",
    wall: "#F2EBDB", wall2: "#E8DFCA", floor: "#DDD2B8",
    wood: "#C09463", woodDk: "#9B7146", paste: "#7F7B3F",
    cobalt1: "#1D357A", cobalt2: "#3E62BC", kraft: "#CDAA7E", kraftDk: "#B48E60",
    tomato: "#D45A40", crumb: "#F3DAA8", crust: "#C1863F", white: "#FDFCF7",
    deep: "#2D3B15", ink: "#25301A"
  };

  /* ------------------------------------------------------------ icons */
  var IC = {
    bag: '<path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
    user: '<circle cx="12" cy="8.2" r="3.6"/><path d="M4.8 20c1.3-3.7 4.1-5.4 7.2-5.4s5.9 1.7 7.2 5.4"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5S14.4 18.1 12 20.5M12 3.5C9.6 5.9 8.4 8.7 8.4 12s1.2 6.1 3.6 8.5"/>',
    chev: '<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>',
    arrow: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    leaf: '<path d="M5 19C5 10.5 10.5 5 19 5c0 8.5-5.5 14-14 14z"/><path d="M5 19l7.5-7.5"/>',
    drop: '<path d="M12 3.5c3.2 4.6 6 7.8 6 11.1a6 6 0 0 1-12 0c0-3.3 2.8-6.5 6-11.1z"/>',
    truck: '<path d="M3 6.5h11v9.5H3zM14 9.5h4.2l2.8 3.2v3.3H14"/><circle cx="7" cy="17.6" r="1.9"/><circle cx="17.2" cy="17.6" r="1.9"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9c-1.5-3-5-4-5-1.6C7 9 12 9 12 9zM12 9c1.5-3 5-4 5-1.6C17 9 12 9 12 9z"/>',
    tin: '<path d="M7 7.5h10a1 1 0 0 1 1 1V20H6V8.5a1 1 0 0 1 1-1z"/><path d="M9.5 7.5V5.2h5v2.3M6 11.5h12"/>',
    trio: '<path d="M5.5 20v-7.5l1-1.8V7.2h1.4v3.5l1 1.8V20zM11.3 20v-7.5l1-1.8V7.2h1.4v3.5l1 1.8V20zM17.1 20v-7.5l1-1.8V7.2"/><path d="M19.5 7.2v3.5l1 1.8V20h-3.4"/>',
    seal: '<circle cx="12" cy="10" r="6"/><path d="M9.4 10l1.8 1.8 3.4-3.6M8.5 15.2L7.4 21l4.6-2.4 4.6 2.4-1.1-5.8"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.2 2"/>',
    thermo: '<path d="M10 14.2V5.5a2 2 0 0 1 4 0v8.7a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
    star: '<path d="M12 3.8l2.5 5.2 5.6.7-4.1 3.9 1 5.6L12 16.5l-5 2.7 1-5.6-4.1-3.9 5.6-.7z"/>',
    check: '<path d="M5 12.5l4.3 4.3L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    pin: '<path d="M12 21s6.5-6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    mail: '<rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="M4 7l8 6 8-6"/>',
    shield: '<path d="M12 3.5l7 2.8v5.3c0 4.4-3 7.7-7 8.9-4-1.2-7-4.5-7-8.9V6.3z"/><path d="M9 12l2.2 2.2L15.3 10"/>',
    scale: '<path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z"/>',
    olive: '<ellipse cx="11" cy="14" rx="4.5" ry="5.8" transform="rotate(-25 11 14)"/><path d="M13.2 8.6C14 6 16.2 4.4 19 4.2c-.3 2.8-2.1 4.7-4.6 5.2"/>',
    tree: '<path d="M12 21v-6.5M12 14.5c-2.5 0-3-2.2-1.5-3.3M12 14.5c2.6 0 3.2-2.3 1.6-3.5"/><path d="M5.5 11.2a3.6 3.6 0 0 1 2.4-6.1A4.3 4.3 0 0 1 16 5.2a3.6 3.6 0 0 1 2.6 6.1A3.8 3.8 0 0 1 12 13a3.8 3.8 0 0 1-6.5-1.8z"/>',
    store: '<path d="M4 9.5L5.5 4h13L20 9.5M4 9.5V20h16V9.5M4 9.5c0 1.6 1.3 2.8 2.7 2.8S9.3 11 9.3 9.5c0 1.6 1.3 2.8 2.7 2.8s2.7-1.2 2.7-2.8c0 1.6 1.3 2.8 2.6 2.8S20 11 20 9.5M9.5 20v-5h5v5"/>',
    book: '<path d="M5 4.5h11a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11"/>',
    sparkle: '<path d="M12 4l1.7 5.3L19 11l-5.3 1.7L12 18l-1.7-5.3L5 11l5.3-1.7z"/>',
    glass: '<path d="M8 4.5h8c0 3-1 5-1 7.5 0 2.5 2.5 4 2.5 6.5a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3c0-2.5 2.5-4 2.5-6.5S8 7.5 8 4.5z"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="1.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    phone: '<path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C10.6 18.5 5.5 13.4 5 5.6A1.5 1.5 0 0 1 6.5 4z"/>',
    insta: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6"/>',
    fb: '<path d="M13.5 20v-7h2.6l.4-3h-3V8.2c0-.9.3-1.5 1.6-1.5h1.5V4.1a19 19 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8V10H8v3h2.7v7"/>',
    linkedin: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.5 1-2.5 2.3-2.5S16 11.5 16 13v3"/>',
    pinterest: '<circle cx="12" cy="12" r="8.5"/><path d="M11 9.5c.4-1.3 1.6-2 3-1.7 1.6.3 2.4 1.8 2 3.6-.4 1.7-1.7 2.8-3.1 2.4-.8-.2-1.2-.9-1.1-1.6L10.2 19"/>'
  };
  function icon(n, cls) {
    return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (IC[n] || "") + "</svg>";
  }

  /* ------------------------------------------------------------ logo */
  function logoMark(cls) {
    return '<svg class="' + (cls || "logo-mark") + '" viewBox="0 0 40 40" aria-hidden="true">' +
      '<circle cx="20" cy="20" r="18.6" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".38"/>' +
      '<path d="M20 7.2c4.6 6.3 8.6 10.6 8.6 15.3a8.6 8.6 0 0 1-17.2 0c0-4.7 4-9 8.6-15.3z" fill="var(--logo-drop, #5C7A2B)"/>' +
      '<path d="M15.6 26.8c.3-4.8 3.1-8.3 7.6-9.4-.4 4.6-3.2 8.2-7.6 9.4z" fill="var(--logo-leaf, #F7F1DF)"/>' +
      '<path d="M15.6 26.8l4.6-4.7" stroke="var(--logo-drop, #5C7A2B)" stroke-width=".9" stroke-linecap="round"/>' +
      '<circle cx="23.6" cy="13.4" r="1.15" fill="var(--logo-gold, #CDA22B)"/></svg>';
  }
  function logo() {
    return logoMark() + '<span class="logo-word"><span class="logo-name">Baena</span><span class="logo-tag">AOP · Andalousie</span></span>';
  }

  /* ------------------------------------------------------------ shared defs */
  function packDefs(P) {
    return "<defs>" +
      '<radialGradient id="' + P + 'bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#FDFBF4"/><stop offset=".6" stop-color="#F1F2E6"/><stop offset="1" stop-color="#DEE5CC"/></radialGradient>' +
      '<linearGradient id="' + P + 'fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4E9D4" stop-opacity="0"/><stop offset="1" stop-color="#D5DDBF" stop-opacity=".85"/></linearGradient>' +
      '<radialGradient id="' + P + 'sh" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#26310F" stop-opacity=".30"/><stop offset=".7" stop-color="#26310F" stop-opacity=".08"/><stop offset="1" stop-color="#26310F" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + P + 'gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#121A06"/><stop offset=".28" stop-color="#3C5320"/><stop offset=".55" stop-color="#2A3B12"/><stop offset="1" stop-color="#0F1505"/></linearGradient>' +
      '<linearGradient id="' + P + 'glc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7E8F55" stop-opacity=".55"/><stop offset=".35" stop-color="#C9D3A4" stop-opacity=".22"/><stop offset="1" stop-color="#5E6E36" stop-opacity=".55"/></linearGradient>' +
      '<linearGradient id="' + P + 'au" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9C7518"/><stop offset=".45" stop-color="#E6C35A"/><stop offset="1" stop-color="#8E6A12"/></linearGradient>' +
      '<linearGradient id="' + P + 'oil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B98E1F"/><stop offset=".45" stop-color="#E8C653"/><stop offset="1" stop-color="#A47C17"/></linearGradient>' +
      '<linearGradient id="' + P + 'mt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8F998D"/><stop offset=".3" stop-color="#EEF0EB"/><stop offset=".62" stop-color="#C3CAC0"/><stop offset="1" stop-color="#737D70"/></linearGradient>' +
      '<linearGradient id="' + P + 'mv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF0EB"/><stop offset=".55" stop-color="#C3CAC0"/><stop offset="1" stop-color="#8F998D"/></linearGradient>' +
      '<linearGradient id="' + P + 'co" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14286A"/><stop offset=".4" stop-color="#3E62BC"/><stop offset="1" stop-color="#172C70"/></linearGradient>' +
      '<linearGradient id="' + P + 'kr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B48E60"/><stop offset=".5" stop-color="#D6B78E"/><stop offset="1" stop-color="#AC8556"/></linearGradient>' +
      '<linearGradient id="' + P + 'gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#34481A"/><stop offset=".5" stop-color="#4E6A27"/><stop offset="1" stop-color="#2E4016"/></linearGradient>' +
      "</defs>";
  }
  function studio(P) {
    return E("rect", { width: 400, height: 440, fill: "url(#" + P + "bg)" }) +
      E("rect", { y: 330, width: 400, height: 110, fill: "url(#" + P + "fl)" }) +
      E("ellipse", { cx: 200, cy: 393, rx: 150, ry: 15, fill: "url(#" + P + "sh)" });
  }

  /* A marasca-style olive-oil bottle. o: {name, vol, band, bandTxt, clear, fill(0..1), P} */
  function bottle(P, cx, base, h, w, o) {
    o = o || {};
    var top = base - h, capH = h * 0.075, neckTop = top + capH, neckBot = neckTop + h * 0.1, shBot = neckBot + h * 0.13;
    var nw = w * 0.31, r = w * 0.09, x0 = cx - w / 2, x1 = cx + w / 2;
    var body = "M" + f(cx - nw / 2) + " " + f(neckTop) + "L" + f(cx - nw / 2) + " " + f(neckBot) +
      "C" + f(cx - nw / 2) + " " + f(neckBot + h * 0.05) + " " + f(x0) + " " + f(shBot - h * 0.065) + " " + f(x0) + " " + f(shBot) +
      "L" + f(x0) + " " + f(base - r) + "Q" + f(x0) + " " + f(base) + " " + f(x0 + r) + " " + f(base) +
      "L" + f(x1 - r) + " " + f(base) + "Q" + f(x1) + " " + f(base) + " " + f(x1) + " " + f(base - r) +
      "L" + f(x1) + " " + f(shBot) + "C" + f(x1) + " " + f(shBot - h * 0.065) + " " + f(cx + nw / 2) + " " + f(neckBot + h * 0.05) + " " + f(cx + nw / 2) + " " + f(neckBot) +
      "L" + f(cx + nw / 2) + " " + f(neckTop) + "Z";
    var id = U("bt"), s = "";
    s += E("clipPath", { id: id }, E("path", { d: body }));
    if (o.clear) {
      var fillH = (base - shBot + h * 0.02) * clamp(o.fill === undefined ? 1 : o.fill, 0, 1);
      s += E("path", { d: body, fill: "#EEF0DD", opacity: ".55" });
      s += E("g", { "clip-path": "url(#" + id + ")" },
        E("rect", { "data-r": o.fillRef || null, x: f(x0 - 2), y: f(base - fillH), width: f(w + 4), height: f(fillH + 2), fill: "url(#" + o.P + "oil)" }));
      s += E("path", { d: body, fill: "url(#" + o.P + "glc)" });
    } else {
      s += E("path", { d: body, fill: "url(#" + o.P + "gl)" });
    }
    s += E("g", { "clip-path": "url(#" + id + ")" },
      E("rect", { x: f(x0 + w * 0.13), y: f(neckBot), width: f(w * 0.075), height: f(base - neckBot - 10), fill: "#fff", opacity: ".2", rx: 3 }) +
      E("rect", { x: f(x1 - w * 0.17), y: f(shBot + 6), width: f(w * 0.035), height: f(base - shBot - 18), fill: "#fff", opacity: ".09", rx: 2 }));
    /* cap + collar */
    s += E("g", { "data-r": o.capRef || null },
      E("rect", { x: f(cx - nw / 2 - 2.5), y: f(top), width: f(nw + 5), height: f(capH), rx: 2.5, fill: "url(#" + o.P + "au)" }) +
      E("path", { d: "M" + f(cx - nw / 2) + " " + f(top + capH * 0.33) + "h" + f(nw) + "M" + f(cx - nw / 2) + " " + f(top + capH * 0.66) + "h" + f(nw), stroke: "#7D5E10", "stroke-width": ".8", opacity: ".45" }));
    s += E("rect", { x: f(cx - nw / 2 - 1), y: f(neckTop + 1), width: f(nw + 2), height: f(h * 0.018), fill: "url(#" + o.P + "au)", opacity: ".85" });
    /* label */
    if (o.label !== false) {
      var ly = shBot + (base - shBot) * 0.17, lh = (base - shBot) * 0.56, lx = x0 + w * 0.07, lw = w * 0.86;
      var lab = E("rect", { x: f(lx), y: f(ly), width: f(lw), height: f(lh), fill: C.label, rx: 1.5 }) +
        E("rect", { x: f(lx + 3), y: f(ly + 3), width: f(lw - 6), height: f(lh - 6), fill: "none", stroke: C.gold, "stroke-width": ".7", rx: 1 });
      if (o.band) lab += E("rect", { x: f(lx), y: f(ly + lh * 0.74), width: f(lw), height: f(lh * 0.14), fill: o.band });
      lab += E("text", { x: f(cx), y: f(ly + lh * 0.2), "text-anchor": "middle", "font-family": SANS, "font-size": f(w * 0.072), "letter-spacing": f(w * 0.02), fill: C.gold, "font-weight": 600 }, "AOP");
      lab += E("text", { x: f(cx), y: f(ly + lh * 0.42), "text-anchor": "middle", "font-family": SERIF, "font-size": f(w * 0.17), "font-weight": 600, fill: C.ink }, "Baena");
      lab += E("path", { d: "M" + f(cx - lw * 0.2) + " " + f(ly + lh * 0.5) + "h" + f(lw * 0.4), stroke: C.gold, "stroke-width": ".7" });
      if (o.name) lab += E("text", { x: f(cx), y: f(ly + lh * 0.63), "text-anchor": "middle", "font-family": SANS, "font-size": f(w * 0.066), fill: "#4A5235", "letter-spacing": ".3" }, o.name);
      if (o.bandTxt) lab += E("text", { x: f(cx), y: f(ly + lh * 0.845), "text-anchor": "middle", "font-family": SANS, "font-size": f(w * 0.07), fill: "#FFFDF6", "font-weight": 600, "letter-spacing": f(w * 0.012) }, o.bandTxt);
      else if (o.vol) lab += E("text", { x: f(cx), y: f(ly + lh * 0.86), "text-anchor": "middle", "font-family": SANS, "font-size": f(w * 0.064), fill: "#7A7A62" }, o.vol);
      s += E("g", { "data-r": o.labelRef || null, style: o.labelRef ? "transform-box:fill-box;transform-origin:0 50%" : null }, lab);
    }
    return s;
  }

  function sealBadge(x, y, r, ref) {
    return E("g", { "data-r": ref || null, style: ref ? "transform-box:fill-box;transform-origin:50% 50%" : null },
      E("circle", { cx: x, cy: y, r: r, fill: "#B33A2C" }) +
      E("circle", { cx: x, cy: y, r: f(r * 0.78), fill: "#E9B92D" }) +
      E("circle", { cx: x, cy: y, r: f(r * 0.62), fill: "none", stroke: "#B33A2C", "stroke-width": f(r * 0.06) }) +
      E("path", { d: "M" + f(x - r * 0.3) + " " + f(y + r * 0.05) + "l" + f(r * 0.22) + " " + f(r * 0.22) + "l" + f(r * 0.4) + " " + f(-r * 0.44), fill: "none", stroke: "#B33A2C", "stroke-width": f(r * 0.12), "stroke-linecap": "round" }));
  }

  function oliveBranch(x, y, s, rot, ripe) {
    var g = "";
    g += E("path", { d: "M0 0C30 -6 70 -4 110 -18", stroke: "#6A5A3A", "stroke-width": 2.2, fill: "none", "stroke-linecap": "round" });
    var leaves = [[18, -3, -28], [34, -5, 30], [52, -7, -24], [68, -9, 26], [86, -13, -20], [100, -16, 22], [112, -19, -8]];
    leaves.forEach(function (l, i) {
      g += E("ellipse", { cx: l[0], cy: l[1] + (i % 2 ? 7 : -7), rx: 17, ry: 4.2, fill: i % 3 ? "#6E8C3B" : "#58742B", transform: "rotate(" + l[2] + " " + l[0] + " " + (l[1] + (i % 2 ? 7 : -7)) + ")" });
      g += E("path", { d: "M" + (l[0] - 12) + " " + (l[1] + (i % 2 ? 7 : -7)) + "h24", stroke: "#B7C994", "stroke-width": ".6", opacity: ".6", transform: "rotate(" + l[2] + " " + l[0] + " " + (l[1] + (i % 2 ? 7 : -7)) + ")" });
    });
    var ols = [[44, 6], [60, 4], [78, 0]];
    ols.forEach(function (o, i) {
      var col = ripe ? (i === 1 ? C.olV : C.olB) : (i === 2 ? "#7F9446" : C.olG);
      g += E("ellipse", { cx: o[0], cy: o[1], rx: 5.2, ry: 7, fill: col, transform: "rotate(-20 " + o[0] + " " + o[1] + ")" });
      g += E("ellipse", { cx: o[0] - 1.6, cy: o[1] - 2.4, rx: 1.4, ry: 2, fill: "#fff", opacity: ".35" });
    });
    return E("g", { transform: "translate(" + x + " " + y + ") rotate(" + (rot || 0) + ") scale(" + s + ")" }, g);
  }

  /* ------------------------------------------------------------ packshots */
  var PACKS = {
    classique: function (P) {
      return bottle(P, 200, 390, 318, 104, { P: P, name: "Sélection Classique", vol: "500 ml" }) +
        oliveBranch(250, 384, .62, -8, false);
    },
    premium: function (P) {
      var s = "";
      /* lid leaning behind */
      s += E("g", { transform: "rotate(-7 300 380)" },
        E("rect", { x: 210, y: 92, width: 170, height: 290, rx: 4, fill: "url(#" + P + "gr)" }) +
        E("rect", { x: 222, y: 104, width: 146, height: 266, rx: 2, fill: "none", stroke: C.gold, "stroke-width": "1" }) +
        E("text", { x: 295, y: 200, "text-anchor": "middle", "font-family": SANS, "font-size": 9, "letter-spacing": 3, fill: C.gold }, "AOP") +
        E("text", { x: 295, y: 232, "text-anchor": "middle", "font-family": SERIF, "font-size": 30, fill: "#E9D9A6" }, "Baena") +
        E("path", { d: "M262 248h66", stroke: C.gold, "stroke-width": ".8" }) +
        E("text", { x: 295, y: 268, "text-anchor": "middle", "font-family": SANS, "font-size": 8.5, "letter-spacing": 1.6, fill: "#D9C88E" }, "DÉGUSTATION"));
      /* box inner back */
      s += E("path", { d: "M58 250h244l18 -14H76z", fill: "#D9CFB4" });
      s += E("rect", { x: 58, y: 250, width: 244, height: 142, fill: "#E9E1CB" });
      var bands = [["#6B3A55", "PICUDA"], ["#7E9A49", "HOJIBLANCA"], ["#C29A2A", "PICUAL"]];
      [112, 180, 248].forEach(function (x, i) {
        s += bottle(P, x, 318, 236, 64, { P: P, band: bands[i][0], bandTxt: bands[i][1], name: "250 ml" });
      });
      /* box front */
      s += E("rect", { x: 50, y: 306, width: 260, height: 88, rx: 2, fill: "#F3EDDC" });
      s += E("rect", { x: 50, y: 306, width: 260, height: 6, fill: "#E2D8BD" });
      s += E("rect", { x: 60, y: 318, width: 240, height: 66, fill: "none", stroke: C.gold, "stroke-width": ".9" });
      s += E("text", { x: 180, y: 345, "text-anchor": "middle", "font-family": SERIF, "font-size": 17, fill: C.ink }, "Coffret Dégustation");
      s += E("text", { x: 180, y: 368, "text-anchor": "middle", "font-family": SANS, "font-size": 9, "letter-spacing": 2, fill: "#7A7A62" }, "3 × 250 ML · MONOVARIÉTAUX");
      return s;
    },
    cadeau: function (P) {
      var s = "";
      s += bottle(P, 288, 390, 312, 98, { P: P, name: "Sélection Classique", vol: "500 ml" });
      /* kraft box, open, booklet inside */
      s += E("path", { d: "M44 268h170l16 -12H60z", fill: "#BF9C6E" });
      s += E("g", { transform: "rotate(-9 120 290)" },
        E("rect", { x: 78, y: 196, width: 86, height: 118, rx: 2, fill: "#3F5720" }) +
        E("rect", { x: 85, y: 203, width: 72, height: 104, fill: "none", stroke: C.gold, "stroke-width": ".8" }) +
        E("text", { x: 121, y: 244, "text-anchor": "middle", "font-family": SERIF, "font-size": 12, fill: "#EADBA8" }, "Recettes") +
        E("text", { x: 121, y: 259, "text-anchor": "middle", "font-family": SERIF, "font-size": 12, fill: "#EADBA8" }, "andalouses"));
      s += E("path", { d: "M44 268c30-16 58-4 86-10s60-14 84 8z", fill: "#F5EFDF", opacity: ".95" });
      s += E("rect", { x: 40, y: 270, width: 180, height: 122, rx: 2, fill: "url(#" + P + "kr)" });
      s += E("rect", { x: 118, y: 270, width: 22, height: 122, fill: "#5C7A2B" });
      s += E("rect", { x: 40, y: 318, width: 180, height: 16, fill: "#5C7A2B" });
      s += E("path", { d: "M129 318c-18-22-40-18-34-4 4 9 22 8 34 4zM131 318c18-22 40-18 34-4-4 9-22 8-34 4z", fill: "#6E8C3B" });
      /* two cobalt tasting glasses in front */
      [[96, 392, 1], [172, 396, .94]].forEach(function (g) {
        s += tastingGlass(P, g[0], g[1], 64 * g[2]);
      });
      return s;
    },
    bidon: function (P) {
      var s = "", x0 = 104, x1 = 252, top = 118, base = 390, d = 40, k = 16;
      /* side face */
      s += E("path", { d: "M" + x1 + " " + top + "l" + d + " " + (-k) + "V" + (base - k) + "l" + (-d) + " " + k + "z", fill: "#2C3D14" });
      s += E("path", { d: "M" + x1 + " " + (top + 52) + "l" + d + " " + (-k) + "V" + (base - k - 40) + "l" + (-d) + " " + k + "z", fill: "#E1D7BC" });
      /* top face */
      s += E("path", { d: "M" + x0 + " " + top + "l" + d + " " + (-k) + "H" + (x1 + d) + "l" + (-d) + " " + k + "z", fill: "url(#" + P + "mv)" });
      /* handle */
      s += E("path", { d: "M150 " + (top - 6) + "C150 70 214 70 214 " + (top - 10), fill: "none", stroke: "url(#" + P + "mt)", "stroke-width": 8, "stroke-linecap": "round" });
      s += E("rect", { x: 236, y: top - 30, width: 22, height: 20, rx: 3, fill: "url(#" + P + "au)" });
      s += E("ellipse", { cx: 247, cy: top - 30, rx: 11, ry: 3.5, fill: "#E7C860" });
      /* front face */
      s += E("rect", { x: x0, y: top, width: x1 - x0, height: base - top, fill: "#3B5220" });
      s += E("rect", { x: x0, y: top + 52, width: x1 - x0, height: base - top - 92, fill: C.label });
      s += E("rect", { x: x0 + 8, y: top + 60, width: x1 - x0 - 16, height: base - top - 108, fill: "none", stroke: C.gold, "stroke-width": ".9" });
      s += E("text", { x: (x0 + x1) / 2, y: top + 25, "text-anchor": "middle", "font-family": SANS, "font-size": 9, "letter-spacing": 3, fill: C.gold }, "AOP");
      s += E("text", { x: (x0 + x1) / 2, y: top + 44, "text-anchor": "middle", "font-family": SERIF, "font-size": 20, fill: "#EADBA8" }, "Baena");
      s += E("text", { x: (x0 + x1) / 2, y: top + 150, "text-anchor": "middle", "font-family": SERIF, "font-size": 62, "font-weight": 600, fill: C.ink }, "5 L");
      s += E("text", { x: (x0 + x1) / 2, y: top + 176, "text-anchor": "middle", "font-family": SANS, "font-size": 8.5, "letter-spacing": 1.2, fill: "#5A6142" }, "HUILE D'OLIVE");
      s += E("text", { x: (x0 + x1) / 2, y: top + 189, "text-anchor": "middle", "font-family": SANS, "font-size": 8.5, "letter-spacing": 1.2, fill: "#5A6142" }, "VIERGE EXTRA");
      s += oliveBranch(x0 + 26, top + 222, .5, -6, true);
      s += E("rect", { x: x0, y: top, width: 18, height: base - top, fill: "#fff", opacity: ".1" });
      s += E("rect", { x: x1 - 10, y: top, width: 10, height: base - top, fill: "#000", opacity: ".12" });
      s += sealBadge(x1 - 26, base - 22, 11);
      return s;
    },
    verres: function (P) {
      return tastingGlass(P, 158, 390, 168) + tastingGlass(P, 262, 394, 150, true) +
        E("ellipse", { cx: 158, cy: 222, rx: 52, ry: 9, fill: "#E8EEF3", opacity: ".75", stroke: "#B9C4CF", "stroke-width": "1" });
    },
    carnet: function (P) {
      var s = "";
      s += E("path", { d: "M262 92l26 -10v296l-26 12z", fill: "#E8E0CA" });
      s += E("path", { d: "M266 96l18 -7v284l-18 8z", fill: "#F7F2E4" });
      s += E("rect", { x: 112, y: 92, width: 150, height: 298, rx: 3, fill: "url(#" + P + "gr)" });
      s += E("rect", { x: 112, y: 92, width: 14, height: 298, fill: "#000", opacity: ".14" });
      s += E("rect", { x: 134, y: 110, width: 116, height: 262, fill: "none", stroke: C.gold, "stroke-width": "1" });
      s += E("text", { x: 192, y: 158, "text-anchor": "middle", "font-family": SANS, "font-size": 8, "letter-spacing": 3, fill: C.gold }, "AOP BAENA");
      s += E("text", { x: 192, y: 196, "text-anchor": "middle", "font-family": SERIF, "font-size": 21, fill: "#F0E2B2" }, "Recettes");
      s += E("text", { x: 192, y: 220, "text-anchor": "middle", "font-family": SERIF, "font-size": 21, fill: "#F0E2B2" }, "andalouses");
      s += E("path", { d: "M166 234h52", stroke: C.gold, "stroke-width": ".8" });
      s += E("text", { x: 192, y: 252, "text-anchor": "middle", "font-family": SANS, "font-size": 8, "letter-spacing": 1.5, fill: "#CDBF8E" }, "20 RECETTES");
      s += oliveBranch(148, 330, .62, -10, true);
      return s;
    }
  };

  function tastingGlass(P, cx, base, h, lid) {
    var w = h * 0.62, top = base - h;
    var d = "M" + f(cx - w * 0.36) + " " + f(top) + "C" + f(cx - w * 0.36) + " " + f(top + h * 0.3) + " " + f(cx - w * 0.56) + " " + f(top + h * 0.42) + " " + f(cx - w * 0.54) + " " + f(top + h * 0.7) +
      "C" + f(cx - w * 0.52) + " " + f(base - h * 0.02) + " " + f(cx - w * 0.2) + " " + f(base) + " " + f(cx) + " " + f(base) +
      "C" + f(cx + w * 0.2) + " " + f(base) + " " + f(cx + w * 0.52) + " " + f(base - h * 0.02) + " " + f(cx + w * 0.54) + " " + f(top + h * 0.7) +
      "C" + f(cx + w * 0.56) + " " + f(top + h * 0.42) + " " + f(cx + w * 0.36) + " " + f(top + h * 0.3) + " " + f(cx + w * 0.36) + " " + f(top) + "Z";
    var s = E("path", { d: d, fill: "url(#" + P + "co)" });
    s += E("ellipse", { cx: cx, cy: top, rx: f(w * 0.36), ry: f(h * 0.045), fill: "#4B6CC4", stroke: "#8EA6E0", "stroke-width": ".8" });
    s += E("path", { d: "M" + f(cx - w * 0.3) + " " + f(top + h * 0.2) + "C" + f(cx - w * 0.44) + " " + f(top + h * 0.45) + " " + f(cx - w * 0.42) + " " + f(top + h * 0.75) + " " + f(cx - w * 0.3) + " " + f(base - h * 0.1), stroke: "#fff", "stroke-width": f(h * 0.03), opacity: ".28", fill: "none", "stroke-linecap": "round" });
    if (lid) s += E("ellipse", { cx: cx, cy: f(top - 2), rx: f(w * 0.46), ry: f(h * 0.05), fill: "#E8EEF3", opacity: ".8", stroke: "#B9C4CF", "stroke-width": ".8" });
    return s;
  }

  function pack(id, opts) {
    opts = opts || {};
    var P = U("pk");
    var vb = opts.vb || "0 0 400 440";
    var draw = PACKS[id] || PACKS.classique;
    return '<svg class="pack' + (opts.cls ? " " + opts.cls : "") + '" viewBox="' + vb + '" role="img" aria-label="' + (opts.label || "") + '" preserveAspectRatio="xMidYMid meet">' +
      packDefs(P) + (opts.bare ? "" : studio(P)) + '<g class="pack-obj">' + draw(P) + "</g></svg>";
  }

  /* ------------------------------------------------------------ spot illustrations */
  function varietySpot(kind) {
    var P = U("vs"), s = "";
    var conf = {
      picuda: { c1: "#7A4560", c2: "#3E2234", rx: 9, ry: 15, tip: 4, n: 5 },
      hojiblanca: { c1: "#8C9C4A", c2: "#4A3550", rx: 12, ry: 14, tip: 1, n: 5 },
      picual: { c1: "#9DB050", c2: "#2E2722", rx: 10.5, ry: 15, tip: 6, n: 5 }
    }[kind] || {};
    s += "<defs>" + E("radialGradient", { id: P + "g", cx: "50%", cy: "45%", r: "60%" },
      '<stop offset="0" stop-color="#FBF8EF"/><stop offset="1" stop-color="#E2E9D0"/>') + "</defs>";
    s += E("rect", { width: 320, height: 240, fill: "url(#" + P + "g)" });
    s += E("ellipse", { cx: 160, cy: 205, rx: 110, ry: 10, fill: "#26310F", opacity: ".08" });
    s += oliveBranch(46, 92, 1.55, 8, kind !== "picual");
    var pos = [[118, 170, -18], [150, 178, 12], [182, 168, -6], [212, 180, 22], [244, 172, -14]];
    pos.forEach(function (p, i) {
      var t = i / (conf.n - 1), col = mix(conf.c1, conf.c2, kind === "hojiblanca" ? t : (i % 2 ? .65 : .2));
      var d = "M0 " + (-conf.ry) + "C" + (conf.rx * 1.05) + " " + (-conf.ry + conf.tip) + " " + conf.rx + " " + (conf.ry * 0.7) + " 0 " + conf.ry +
        "C" + (-conf.rx) + " " + (conf.ry * 0.7) + " " + (-conf.rx * 1.05) + " " + (-conf.ry + conf.tip) + " 0 " + (-conf.ry) + "Z";
      s += E("g", { transform: "translate(" + p[0] + " " + p[1] + ") rotate(" + p[2] + ")" },
        E("path", { d: d, fill: col }) + E("ellipse", { cx: -conf.rx * 0.35, cy: -conf.ry * 0.35, rx: 2.2, ry: 4, fill: "#fff", opacity: ".32" }));
    });
    return '<svg class="spot" viewBox="0 0 320 240" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">' + s + "</svg>";
  }

  function dishSpot(kind) {
    var P = U("ds"), s = "";
    s += "<defs>" + E("radialGradient", { id: P + "g", cx: "50%", cy: "40%", r: "70%" },
      '<stop offset="0" stop-color="#FBF8EF"/><stop offset="1" stop-color="#E5EAD5"/>') +
      E("linearGradient", { id: P + "o", x1: 0, y1: 0, x2: 1, y2: 0 }, '<stop offset="0" stop-color="#B98E1F"/><stop offset=".5" stop-color="#E8C653"/><stop offset="1" stop-color="#A47C17"/>') + "</defs>";
    s += E("rect", { width: 320, height: 240, fill: "url(#" + P + "g)" });
    s += E("ellipse", { cx: 160, cy: 196, rx: 118, ry: 14, fill: "#26310F", opacity: ".09" });
    if (kind === "salmorejo") {
      s += E("ellipse", { cx: 160, cy: 168, rx: 104, ry: 34, fill: "#CBB89A" });
      s += E("path", { d: "M58 150c0 36 46 52 102 52s102-16 102-52z", fill: "#E9DCC2" });
      s += E("ellipse", { cx: 160, cy: 150, rx: 102, ry: 30, fill: "#F5EEDC" });
      s += E("ellipse", { cx: 160, cy: 150, rx: 86, ry: 23, fill: "#E58A5E" });
      s += E("path", { d: "M110 148c20-8 44 6 64-2s34-6 44 2", stroke: "url(#" + P + "o)", "stroke-width": 4, fill: "none", "stroke-linecap": "round" });
      [[132, 142], [176, 154], [196, 140], [148, 158]].forEach(function (p) {
        s += E("rect", { x: p[0], y: p[1], width: 9, height: 6, rx: 1.5, fill: "#B44A3C", transform: "rotate(15 " + p[0] + " " + p[1] + ")" });
      });
      s += E("ellipse", { cx: 160, cy: 147, rx: 7, ry: 4, fill: "#FBF4D8" });
    } else if (kind === "tomate") {
      s += E("ellipse", { cx: 160, cy: 170, rx: 112, ry: 30, fill: "#FDFCF7" });
      s += E("ellipse", { cx: 160, cy: 166, rx: 92, ry: 22, fill: "#F2EFE4" });
      [[118, 158], [160, 152], [200, 160], [142, 170], [182, 172]].forEach(function (p, i) {
        s += E("ellipse", { cx: p[0], cy: p[1], rx: 18, ry: 13, fill: i % 2 ? "#D45A40" : "#C94A33" }) +
          E("ellipse", { cx: p[0], cy: p[1] - 2, rx: 11, ry: 7, fill: "#E9785C" }) +
          E("circle", { cx: p[0] - 4, cy: p[1] - 2, r: 1.4, fill: "#F6D7A5" }) + E("circle", { cx: p[0] + 3, cy: p[1], r: 1.4, fill: "#F6D7A5" });
      });
      s += E("ellipse", { cx: 160, cy: 160, rx: 22, ry: 13, fill: "#FAF6EA" }) + E("ellipse", { cx: 160, cy: 156, rx: 22, ry: 6, fill: "#FFFFFF" });
      s += E("path", { d: "M100 150c30 14 80 14 120 2", stroke: "url(#" + P + "o)", "stroke-width": 3, fill: "none", opacity: ".9", "stroke-linecap": "round" });
      s += E("ellipse", { cx: 214, cy: 150, rx: 7, ry: 2.6, fill: "#5E7A2B", transform: "rotate(-30 214 150)" }) + E("ellipse", { cx: 108, cy: 166, rx: 7, ry: 2.6, fill: "#5E7A2B", transform: "rotate(25 108 166)" });
    } else if (kind === "vinaigrette") {
      s += E("rect", { x: 128, y: 70, width: 64, height: 110, rx: 14, fill: "#EEF2E4", opacity: ".8", stroke: "#C9D2B6", "stroke-width": 1.5 });
      s += E("rect", { x: 131, y: 120, width: 58, height: 57, rx: 11, fill: "url(#" + P + "o)", opacity: ".92" });
      s += E("rect", { x: 131, y: 150, width: 58, height: 27, rx: 11, fill: "#9A5A3A", opacity: ".72" });
      s += E("rect", { x: 140, y: 56, width: 40, height: 18, rx: 3, fill: "#B89130" });
      s += oliveBranch(206, 186, .55, -16, false);
      s += E("circle", { cx: 98, cy: 176, r: 16, fill: "#F2D96B" }) + E("circle", { cx: 98, cy: 176, r: 11, fill: "#F7E79C" });
    } else {
      s += oliveBranch(70, 110, 1.4, 6, true);
      s += E("path", { d: "M218 54c8 12 16 20 16 30a16 16 0 0 1-32 0c0-10 8-18 16-30z", fill: "url(#" + P + "o)" });
    }
    return '<svg class="spot" viewBox="0 0 320 240" aria-hidden="true" preserveAspectRatio="xMidYMid slice">' + s + "</svg>";
  }

  /* ------------------------------------------------------------ landscape */
  function grove(P, y0, rows, seed, w) {
    var r = rng(seed || 7), s = "";
    for (var i = 0; i < rows; i++) {
      var y = y0 + i * (9 + i * 3), sz = 4 + i * 2.1, gap = 18 + i * 9, off = (i % 2) * gap / 2;
      for (var x = -20 + off; x < (w || 800) + 20; x += gap) {
        var jx = x + (r() - .5) * 4, jy = y + (r() - .5) * 2;
        s += E("ellipse", { cx: f(jx), cy: f(jy + sz * .5), rx: f(sz * 1.15), ry: f(sz * .28), fill: "#5D7130", opacity: ".22" });
        s += E("path", { d: "M" + f(jx) + " " + f(jy + sz * .5) + "v" + f(-sz * .6), stroke: C.trunk, "stroke-width": f(.6 + i * .35) });
        s += E("ellipse", { cx: f(jx), cy: f(jy - sz * .25), rx: f(sz * 1.05), ry: f(sz * .78), fill: i % 2 ? C.can2 : C.can1 });
        s += E("ellipse", { cx: f(jx - sz * .3), cy: f(jy - sz * .5), rx: f(sz * .45), ry: f(sz * .3), fill: C.leafHi, opacity: ".45" });
      }
    }
    return s;
  }
  function village(x, y, s) {
    var g = "", r = rng(31);
    var houses = [[0, 0, 22, 14], [18, -6, 18, 16], [34, 2, 24, 12], [54, -4, 20, 15], [70, 3, 26, 11], [92, -2, 18, 14], [-18, 5, 20, 10], [106, 6, 22, 9], [44, -16, 16, 14]];
    houses.forEach(function (h) {
      g += E("rect", { x: h[0], y: h[1] - h[3], width: h[2], height: h[3], fill: "#FBF7EC" });
      g += E("rect", { x: h[0], y: h[1] - h[3], width: h[2], height: 2.4, fill: "#D9C7A4" });
      if (r() > .4) g += E("rect", { x: h[0] + h[2] * .35, y: h[1] - h[3] * .55, width: 3, height: 4, fill: "#C9BFA4" });
    });
    g += E("rect", { x: 58, y: -46, width: 12, height: 32, fill: "#F3ECDB" }) + E("path", { d: "M56 -46h16l-8 -9z", fill: "#D9C7A4" });
    g += E("rect", { x: 20, y: -34, width: 30, height: 18, fill: "#EFE6D2" }) + E("path", { d: "M20 -34h30v-4h-4v3h-4v-3h-4v3h-5v-3h-4v3h-5v-3h-4z", fill: "#EFE6D2" });
    return E("g", { transform: "translate(" + x + " " + y + ") scale(" + s + ")", opacity: ".95" }, g);
  }
  function backdrop(P, opt) {
    opt = opt || {};
    var s = "<defs>" +
      E("linearGradient", { id: P + "sky", x1: 0, y1: 0, x2: 0, y2: 1 }, '<stop offset="0" stop-color="' + C.sky1 + '"/><stop offset="1" stop-color="' + C.sky2 + '"/>') +
      E("radialGradient", { id: P + "sun", cx: "50%", cy: "50%", r: "50%" }, '<stop offset="0" stop-color="#F7DE92" stop-opacity=".9"/><stop offset="1" stop-color="#F7DE92" stop-opacity="0"/>') +
      "</defs>";
    s += E("rect", { width: 800, height: 560, fill: "url(#" + P + "sky)" });
    s += E("circle", { cx: 628, cy: 128, r: 120, fill: "url(#" + P + "sun)" });
    s += E("circle", { cx: 628, cy: 128, r: 40, fill: C.sun, opacity: ".95" });
    s += E("path", { d: "M0 296C110 258 214 276 330 252S556 228 676 256 780 252 800 244V560H0z", fill: C.hillFar });
    s += village(470, 252, .95);
    s += E("path", { d: "M0 352C150 318 296 344 420 324S652 300 800 330V560H0z", fill: C.hillMid });
    s += grove(P, 340, 4, opt.seed || 11);
    s += E("path", { d: "M0 430C204 408 498 420 800 398V560H0z", fill: C.field });
    for (var i = 0; i < 6; i++) s += E("path", { d: "M0 " + (448 + i * 20) + "C220 " + (430 + i * 20) + " 520 " + (440 + i * 20) + " 800 " + (420 + i * 20), stroke: C.fieldDk, "stroke-width": 1.4, fill: "none", opacity: ".5" });
    return s;
  }
  function interior(P, opt) {
    opt = opt || {};
    var s = "<defs>" +
      E("linearGradient", { id: P + "wl", x1: 0, y1: 0, x2: 0, y2: 1 }, '<stop offset="0" stop-color="' + C.wall + '"/><stop offset="1" stop-color="' + C.wall2 + '"/>') +
      E("linearGradient", { id: P + "sky", x1: 0, y1: 0, x2: 0, y2: 1 }, '<stop offset="0" stop-color="' + C.sky1 + '"/><stop offset="1" stop-color="' + C.sky2 + '"/>') +
      "</defs>";
    s += E("rect", { width: 800, height: 560, fill: "url(#" + P + "wl)" });
    var wx = opt.win === undefined ? 80 : opt.win;
    if (wx !== false) {
      var arch = "M" + wx + " 300V150a70 70 0 0 1 140 0V300z";
      var cid = U("win");
      s += E("clipPath", { id: cid }, E("path", { d: arch }));
      s += E("g", { "clip-path": "url(#" + cid + ")" },
        E("rect", { x: wx, y: 70, width: 140, height: 240, fill: "url(#" + P + "sky)" }) +
        E("path", { d: "M" + wx + " 236c40-16 80-6 140-20V300H" + wx + "z", fill: C.hillFar }) +
        E("path", { d: "M" + wx + " 262c50-12 90-2 140-14V300H" + wx + "z", fill: C.hillMid }) +
        E("circle", { cx: wx + 100, cy: 168, r: 14, fill: C.sun, opacity: ".9" }));
      s += E("path", { d: arch, fill: "none", stroke: "#D6CAB0", "stroke-width": 7 });
      s += E("path", { d: "M" + (wx + 70) + " 80V300M" + wx + " 210H" + (wx + 140), stroke: "#D6CAB0", "stroke-width": 3 });
    }
    s += E("rect", { y: 318, width: 800, height: 12, fill: "#E2D7BF" });
    s += E("path", { d: "M0 400H800V560H0z", fill: C.floor });
    for (var i = 0; i < 9; i++) s += E("path", { d: "M" + (i * 100 - 40) + " 560L" + (400 + (i * 100 - 400) * .55) + " 400", stroke: "#CFC3A6", "stroke-width": 1, opacity: ".7" });
    [430, 470, 520].forEach(function (y) { s += E("path", { d: "M0 " + y + "H800", stroke: "#CFC3A6", "stroke-width": 1, opacity: ".6" }); });
    return s;
  }

  /* Big olive tree. Returns {svg, olives:[[x,y]]} */
  function bigTree(P, cx, gy, s) {
    s = s || 1;
    var g = "", r = rng(5);
    var T = function (x, y) { return f(cx + x * s) + " " + f(gy + y * s); };
    g += E("ellipse", { cx: cx, cy: gy + 4, rx: 170 * s, ry: 12 * s, fill: "#4E6327", opacity: ".25" });
    g += E("path", { d: "M" + T(-20, 0) + "C" + T(-14, -34) + " " + T(-26, -66) + " " + T(-12, -96) + "C" + T(-4, -114) + " " + T(-16, -128) + " " + T(-26, -140) + "L" + T(-8, -146) + "C" + T(2, -132) + " " + T(8, -120) + " " + T(4, -100) +
      "C" + T(18, -124) + " " + T(32, -134) + " " + T(46, -142) + "L" + T(54, -132) + "C" + T(36, -118) + " " + T(22, -100) + " " + T(18, -74) + "C" + T(14, -46) + " " + T(22, -22) + " " + T(28, 0) + "Z", fill: C.trunk });
    g += E("path", { d: "M" + T(-6, -10) + "C" + T(-2, -40) + " " + T(-12, -70) + " " + T(2, -96), stroke: C.trunkDk, "stroke-width": 3 * s, fill: "none", opacity: ".55" });
    var can = "";
    var blobs = [[0, -184, 168, 74, C.can1], [-92, -164, 96, 54, C.can2], [94, -170, 100, 56, C.can2], [-10, -224, 124, 58, C.can3], [-56, -206, 74, 42, C.can1], [62, -210, 78, 44, C.can1], [10, -150, 120, 40, C.can2]];
    blobs.forEach(function (b) { can += E("ellipse", { cx: f(cx + b[0] * s), cy: f(gy + b[1] * s), rx: f(b[2] * s), ry: f(b[3] * s), fill: b[4] }); });
    for (var i = 0; i < 70; i++) {
      var a = r() * Math.PI * 2, rr = Math.sqrt(r()), lx = cx + Math.cos(a) * 150 * rr * s, ly = gy - 186 * s + Math.sin(a) * 66 * rr * s;
      can += E("ellipse", { cx: f(lx), cy: f(ly), rx: f(7 * s), ry: f(2.1 * s), fill: r() > .5 ? C.leafHi : "#8EA65A", opacity: ".75", transform: "rotate(" + Math.round(r() * 180) + " " + f(lx) + " " + f(ly) + ")" });
    }
    var olives = [];
    for (var j = 0; j < 26; j++) {
      var a2 = r() * Math.PI * 2, r2 = .35 + r() * .62, ox = cx + Math.cos(a2) * 140 * r2 * s, oy = gy - 172 * s + Math.abs(Math.sin(a2)) * 54 * r2 * s;
      olives.push([f(ox), f(oy)]);
    }
    return { svg: g, canopy: can, olives: olives };
  }
  function olive(x, y, s, fill, ref, extra) {
    return E("g", { "data-r": ref || null, transform: "translate(" + x + " " + y + ")" },
      E("ellipse", { rx: f(4.4 * s), ry: f(6 * s), fill: fill, transform: "rotate(-18)" }) +
      E("ellipse", { cx: f(-1.4 * s), cy: f(-2 * s), rx: f(1.2 * s), ry: f(1.8 * s), fill: "#fff", opacity: ".32" }) + (extra || ""));
  }

  /* ------------------------------------------------------------ scenes */
  /* Each scene: build(P) -> svg string; update(q, t) mutates nodes found by q("ref"). */
  var SCENES = [];

  /* 1 · L'oliveraie — véraison */
  SCENES.push({
    build: function (P) {
      var t = bigTree(P, 300, 470, 1.18);
      var s = backdrop(P, { seed: 3 }) + t.svg + '<g class="sway">' + t.canopy;
      t.olives.forEach(function (o, i) { s += olive(o[0], o[1], 1.15, C.olG, "o" + i); });
      s += "</g>";
      s += '<g class="sway-slow">' + oliveBranch(560, 120, 1.25, 20, false) + "</g>";
      return s;
    },
    update: function (q, t) {
      for (var i = 0; i < 26; i++) {
        var n = q("o" + i); if (!n) continue;
        var k = clamp(t * 1.5 - (i % 7) * 0.07, 0, 1);
        var col = k < .5 ? mix(C.olG, C.olV, k * 2) : mix(C.olV, C.olB, (k - .5) * 2);
        n.firstChild.setAttribute("fill", col);
      }
    }
  });

  /* 2 · La récolte — falling into nets */
  SCENES.push({
    build: function (P) {
      var t = bigTree(P, 290, 450, 1.08);
      this._ol = t.olives;
      var s = backdrop(P, { seed: 9 });
      s += E("path", { d: "M70 452L520 452L590 520L10 520Z", fill: "#3F5A20", opacity: ".78" });
      for (var i = 0; i < 12; i++) s += E("path", { d: "M" + (70 + i * 40) + " 452L" + (10 + i * 52) + " 520", stroke: "#6E8C3B", "stroke-width": .8, opacity: ".7" });
      s += E("path", { d: "M50 476H555M30 498H575", stroke: "#6E8C3B", "stroke-width": .8, opacity: ".7" });
      s += t.svg + '<g data-r="can">' + t.canopy;
      t.olives.forEach(function (o, i) { if (i >= 16) s += olive(o[0], o[1], 1.05, i % 2 ? C.olV : C.olB); });
      s += "</g>";
      for (var j = 0; j < 16; j++) s += olive(t.olives[j][0], t.olives[j][1], 1.05, j % 3 ? C.olV : C.olB, "f" + j);
      /* crate */
      s += E("g", { transform: "translate(618 418)" },
        E("rect", { x: 0, y: 0, width: 132, height: 82, fill: C.woodDk }) +
        E("clipPath", { id: P + "cr" }, E("rect", { x: 6, y: -40, width: 120, height: 82 })) +
        E("g", { "clip-path": "url(#" + P + "cr)" }, E("g", { "data-r": "pile" }, (function () {
          var p = "", rr = rng(23);
          for (var k = 0; k < 40; k++) p += olive(f(12 + rr() * 108), f(10 + rr() * 30), 1, rr() > .5 ? C.olV : C.olB);
          return p;
        })())) +
        E("rect", { x: 0, y: 26, width: 132, height: 16, fill: C.wood }) + E("rect", { x: 0, y: 46, width: 132, height: 16, fill: C.wood }) + E("rect", { x: 0, y: 66, width: 132, height: 16, fill: C.wood }) +
        E("rect", { x: 0, y: 26, width: 8, height: 56, fill: C.woodDk }) + E("rect", { x: 124, y: 26, width: 8, height: 56, fill: C.woodDk }));
      return s;
    },
    update: function (q, t) {
      var ol = this._ol; if (!ol) return;
      var can = q("can");
      if (can) can.setAttribute("transform", "translate(" + f(Math.sin(t * 70) * 3.2 * (1 - t)) + " 0)");
      for (var j = 0; j < 16; j++) {
        var n = q("f" + j); if (!n) continue;
        var p = clamp((t - j * 0.035) / 0.34, 0, 1), sx = +ol[j][0], sy = +ol[j][1];
        var ex = 90 + ((j * 37) % 420), ey = 462 + (j % 4) * 11;
        var x = lerp(sx, ex, p), y = sy + (ey - sy) * p * p;
        n.setAttribute("transform", "translate(" + f(x) + " " + f(y) + ") rotate(" + Math.round(p * 220) + ")");
      }
      var pile = q("pile"); if (pile) pile.setAttribute("transform", "translate(0 " + f(lerp(46, 0, ease(t))) + ")");
    }
  });

  /* 3 · Moins de 24 h — to the mill */
  SCENES.push({
    build: function (P) {
      var s = backdrop(P, { seed: 21 });
      s += E("path", { d: "M-10 486C200 456 440 474 820 444", stroke: "#E9DFC6", "stroke-width": 54, fill: "none" });
      s += E("path", { d: "M-10 486C200 456 440 474 820 444", stroke: "#FFFDF6", "stroke-width": 2.4, "stroke-dasharray": "18 18", fill: "none", opacity: ".8" });
      /* the mill */
      s += E("g", { transform: "translate(668 404)" },
        E("rect", { x: 0, y: -62, width: 104, height: 62, fill: "#FBF7EC" }) + E("path", { d: "M-6 -62h116l-14 -18H8z", fill: "#C97A4E" }) +
        E("rect", { x: 74, y: -112, width: 14, height: 52, fill: "#F1EADA" }) + E("rect", { x: 40, y: -34, width: 24, height: 34, fill: "#8B6A45" }) +
        E("rect", { x: 12, y: -46, width: 16, height: 14, fill: "#BFD3D6" }) + E("rect", { x: 76, y: -46, width: 16, height: 14, fill: "#BFD3D6" }));
      /* truck */
      var tr = "";
      tr += E("rect", { x: 0, y: -40, width: 136, height: 12, fill: C.woodDk });
      [4, 48, 92].forEach(function (x) {
        tr += E("rect", { x: x, y: -68, width: 40, height: 28, fill: C.wood }) + E("path", { d: "M" + x + " -58h40M" + x + " -49h40", stroke: C.woodDk, "stroke-width": 1.2 });
        var rr = rng(x + 3);
        for (var k = 0; k < 6; k++) tr += olive(f(x + 6 + rr() * 28), f(-70 + rr() * 4), .9, rr() > .5 ? C.olV : C.olB);
      });
      tr += E("path", { d: "M136 -28V-72H170Q178 -72 182 -64L196 -40V-28Z", fill: "#FBF8EE" });
      tr += E("path", { d: "M146 -66H168L180 -44H146Z", fill: "#BFD3D6" });
      tr += E("rect", { x: -4, y: -30, width: 204, height: 10, rx: 2, fill: "#3B4232" });
      tr += E("rect", { x: 190, y: -38, width: 7, height: 5, fill: C.oil1 });
      tr += E("path", { d: "M136 -50H122", stroke: "#5C7A2B", "stroke-width": 3 });
      [36, 160].forEach(function (x, i) {
        tr += E("g", { transform: "translate(" + x + " -14)" },
          E("circle", { r: 14, fill: "#262920" }) + E("g", { "data-r": "w" + i }, E("circle", { r: 6, fill: C.m2 }) + E("path", { d: "M-6 0H6M0 -6V6", stroke: C.mDk, "stroke-width": 1.4 })));
      });
      s += E("g", { "data-r": "truck" }, tr);
      /* clock */
      s += E("g", { transform: "translate(118 120)" },
        E("circle", { r: 52, fill: "#FFFDF6", stroke: "#D8CFB8", "stroke-width": 2 }) +
        E("circle", { r: 40, fill: "none", stroke: "#E9E1CC", "stroke-width": 7 }) +
        E("circle", { "data-r": "arc", r: 40, fill: "none", stroke: C.oil2, "stroke-width": 7, "stroke-dasharray": "251.3", "stroke-dashoffset": "251.3", transform: "rotate(-90)", "stroke-linecap": "round" }) +
        E("path", { "data-r": "hand", d: "M0 4V-30", stroke: C.ink, "stroke-width": 3, "stroke-linecap": "round" }) +
        E("circle", { r: 4, fill: C.ink }) +
        E("text", { y: 26, "text-anchor": "middle", "font-family": SANS, "font-size": 12, "font-weight": 600, fill: "#5A6142" }, "24 h"));
      return s;
    },
    update: function (q, t) {
      var e = ease(t), x = lerp(-40, 450, e), y = 474 - (x / 800) * 26;
      var tr = q("truck"); if (tr) tr.setAttribute("transform", "translate(" + f(x) + " " + f(y) + ")");
      for (var i = 0; i < 2; i++) { var w = q("w" + i); if (w) w.setAttribute("transform", "rotate(" + Math.round(x * 3) + ")"); }
      var a = q("arc"); if (a) a.setAttribute("stroke-dashoffset", f(251.3 * (1 - e * .92)));
      var h = q("hand"); if (h) h.setAttribute("transform", "rotate(" + Math.round(e * 330) + ")");
    }
  });

  /* 4 · Lavage et broyage */
  SCENES.push({
    build: function (P) {
      var s = interior(P, { win: 600 });
      s += "<defs>" + E("linearGradient", { id: P + "mt", x1: 0, y1: 0, x2: 1, y2: 0 }, '<stop offset="0" stop-color="#8F998D"/><stop offset=".3" stop-color="#EEF0EB"/><stop offset=".62" stop-color="#C3CAC0"/><stop offset="1" stop-color="#737D70"/>') + "</defs>";
      /* inclined conveyor */
      s += E("path", { d: "M40 440L290 236", stroke: "#3B4232", "stroke-width": 18, "stroke-linecap": "round" });
      s += E("path", { d: "M40 440L290 236", stroke: "#575F4C", "stroke-width": 12, "stroke-linecap": "round" });
      s += E("path", { d: "M70 450V420M180 450V330", stroke: C.mDk, "stroke-width": 6 });
      for (var i = 0; i < 9; i++) s += olive(0, 0, 1.05, i % 2 ? C.olV : C.olB, "c" + i);
      /* washer spray */
      s += E("g", { "data-r": "spray" }, (function () {
        var d = ""; for (var k = 0; k < 10; k++) d += E("circle", { cx: 300 + (k % 5) * 16, cy: 200 + Math.floor(k / 5) * 14, r: 2.2, fill: "#A8C7D0", opacity: ".8" });
        return d;
      })());
      s += E("path", { d: "M290 196H390", stroke: C.mDk, "stroke-width": 5, "stroke-linecap": "round" });
      /* hopper */
      s += E("path", { d: "M276 226H444L404 296H316Z", fill: "url(#" + P + "mt)" });
      s += E("rect", { x: 270, y: 220, width: 180, height: 10, rx: 2, fill: C.m2 });
      /* crusher */
      s += E("circle", { cx: 360, cy: 360, r: 70, fill: "url(#" + P + "mt)" });
      s += E("circle", { cx: 360, cy: 360, r: 50, fill: "#2F342A" });
      s += E("g", { transform: "translate(360 360)" }, E("g", { "data-r": "rot" },
        E("rect", { x: -42, y: -5, width: 84, height: 10, rx: 3, fill: C.m2 }) + E("rect", { x: -5, y: -42, width: 10, height: 84, rx: 3, fill: C.m2 }) +
        E("rect", { x: -32, y: -4, width: 64, height: 8, rx: 3, fill: C.m3, transform: "rotate(45)" }) + E("rect", { x: -32, y: -4, width: 64, height: 8, rx: 3, fill: C.m3, transform: "rotate(-45)" }) +
        E("circle", { r: 9, fill: C.m1 })));
      s += E("rect", { x: 330, y: 428, width: 60, height: 22, fill: C.mDk });
      /* pipe + tank of paste */
      s += E("path", { d: "M428 372H540V400", stroke: "url(#" + P + "mt)", "stroke-width": 20, fill: "none" });
      s += E("path", { "data-r": "stream", d: "M540 404V470", stroke: C.paste, "stroke-width": 9, "stroke-linecap": "round" });
      s += E("rect", { x: 480, y: 410, width: 230, height: 100, rx: 6, fill: "url(#" + P + "mt)" });
      s += E("clipPath", { id: P + "tk" }, E("rect", { x: 492, y: 420, width: 206, height: 80, rx: 4 }));
      s += E("rect", { x: 492, y: 420, width: 206, height: 80, rx: 4, fill: "#3A3E31" });
      s += E("g", { "clip-path": "url(#" + P + "tk)" }, E("g", { "data-r": "paste" },
        E("rect", { x: 492, y: 0, width: 206, height: 120, fill: C.paste }) +
        (function () { var d = "", rr = rng(4); for (var k = 0; k < 40; k++) d += E("circle", { cx: f(496 + rr() * 200), cy: f(4 + rr() * 110), r: f(1 + rr() * 1.6), fill: rr() > .5 ? "#6B6834" : "#99944F" }); return d; })()));
      return s;
    },
    update: function (q, t) {
      for (var i = 0; i < 9; i++) {
        var n = q("c" + i); if (!n) continue;
        var u = ((i / 9) + t * 2.2) % 1, x = lerp(52, 286, u), y = lerp(424, 228, u);
        n.setAttribute("transform", "translate(" + f(x) + " " + f(y - 8) + ")");
      }
      var r = q("rot"); if (r) r.setAttribute("transform", "rotate(" + Math.round(t * 1080) + ")");
      var p = q("paste"); if (p) p.setAttribute("transform", "translate(0 " + f(lerp(500, 432, ease(t))) + ")");
      var st = q("stream"); if (st) st.setAttribute("opacity", t > .04 ? "1" : "0");
      var sp = q("spray"); if (sp) sp.setAttribute("transform", "translate(0 " + f((t * 300) % 14) + ")");
    }
  });

  /* 5 · Malaxage à froid, sous 27 °C */
  SCENES.push({
    build: function (P) {
      var s = interior(P, { win: 600 });
      s += "<defs>" + E("linearGradient", { id: P + "mt", x1: 0, y1: 0, x2: 0, y2: 1 }, '<stop offset="0" stop-color="#EEF0EB"/><stop offset=".5" stop-color="#C3CAC0"/><stop offset="1" stop-color="#8F998D"/>') + "</defs>";
      s += E("path", { d: "M150 400V440M520 400V440", stroke: C.mDk, "stroke-width": 12 });
      s += E("rect", { x: 100, y: 232, width: 470, height: 176, rx: 88, fill: "url(#" + P + "mt)" });
      s += E("rect", { x: 160, y: 270, width: 350, height: 100, rx: 50, fill: "#3A3E31" });
      s += E("clipPath", { id: P + "win" }, E("rect", { x: 166, y: 276, width: 338, height: 88, rx: 44 }));
      s += E("g", { "clip-path": "url(#" + P + "win)" },
        E("rect", { x: 166, y: 276, width: 338, height: 88, fill: C.paste }) +
        E("path", { "data-r": "swirl", d: "M150 320C190 300 230 340 270 320S350 300 390 320 470 340 520 316", stroke: "#A7A25B", "stroke-width": 5, fill: "none", opacity: ".8" }) +
        E("path", { d: "M166 320H504", stroke: C.m2, "stroke-width": 6 }) +
        (function () { var d = ""; for (var k = 0; k < 7; k++) d += E("ellipse", { "data-r": "b" + k, cx: 200 + k * 46, cy: 320, rx: 10, ry: 40, fill: C.m1, opacity: ".9" }); return d; })());
      s += E("rect", { x: 160, y: 270, width: 350, height: 100, rx: 50, fill: "none", stroke: "#DCE1D8", "stroke-width": 3 });
      s += E("path", { d: "M120 410H560", stroke: "#8FB2BB", "stroke-width": 5, "stroke-dasharray": "2 10", "stroke-linecap": "round" });
      s += E("rect", { x: 64, y: 286, width: 40, height: 70, rx: 4, fill: "#5C7A2B" });
      /* thermometer */
      var tx = 668, Ty = function (T) { return 400 - (T - 10) * 7; };
      s += E("rect", { x: tx - 46, y: Ty(40) - 26, width: 108, height: 316, rx: 14, fill: "#FFFDF6", stroke: "#DDD3BC", "stroke-width": 1.5 });
      s += E("rect", { x: tx - 12, y: Ty(40), width: 24, height: Ty(10) - Ty(40) + 20, rx: 12, fill: "#F0ECE0", stroke: "#CFC6AE" });
      s += E("rect", { x: tx - 12, y: Ty(40), width: 24, height: Ty(27) - Ty(40), rx: 12, fill: "#E6A08A", opacity: ".35" });
      s += E("path", { d: "M" + (tx - 20) + " " + Ty(27) + "H" + (tx + 22), stroke: "#C65A3A", "stroke-width": 2, "stroke-dasharray": "4 3" });
      s += E("circle", { cx: tx, cy: Ty(10) + 26, r: 21, fill: "#C65A3A" });
      s += E("rect", { "data-r": "merc", x: tx - 6, y: Ty(18), width: 12, height: Ty(10) - Ty(18) + 24, rx: 6, fill: "#C65A3A" });
      [15, 20, 25, 30, 35].forEach(function (T) {
        s += E("path", { d: "M" + (tx + 14) + " " + Ty(T) + "h8", stroke: "#9A937E", "stroke-width": 1.2 }) +
          E("text", { x: tx + 26, y: Ty(T) + 4, "font-family": SANS, "font-size": 11, fill: "#6E6A58" }, T);
      });
      s += E("text", { "data-r": "temp", x: tx - 2, y: Ty(40) - 6, "text-anchor": "middle", "font-family": SERIF, "font-size": 20, "font-weight": 600, fill: C.ink }, "18 °C");
      return s;
    },
    update: function (q, t) {
      var T = 18 + 9 * ease(t), Ty = function (v) { return 400 - (v - 10) * 7; };
      var m = q("merc"); if (m) { m.setAttribute("y", f(Ty(T))); m.setAttribute("height", f(Ty(10) - Ty(T) + 24)); }
      var tt = q("temp"); if (tt) tt.textContent = Math.round(T) + " °C";
      var ph = t * 18;
      for (var k = 0; k < 7; k++) { var b = q("b" + k); if (b) b.setAttribute("rx", f(3 + 11 * Math.abs(Math.cos(ph + k * .7)))); }
      var sw = q("swirl"); if (sw) sw.setAttribute("transform", "translate(" + f(-((t * 400) % 80)) + " 0)");
    }
  });

  /* 6 · Extraction à froid et décantation */
  SCENES.push({
    build: function (P) {
      var s = interior(P, { win: false });
      s += "<defs>" + E("linearGradient", { id: P + "mt", x1: 0, y1: 0, x2: 0, y2: 1 }, '<stop offset="0" stop-color="#EEF0EB"/><stop offset=".5" stop-color="#C3CAC0"/><stop offset="1" stop-color="#8F998D"/>') +
        E("linearGradient", { id: P + "oil", x1: 0, y1: 0, x2: 1, y2: 0 }, '<stop offset="0" stop-color="#B98E1F"/><stop offset=".45" stop-color="#E8C653"/><stop offset="1" stop-color="#A47C17"/>') + "</defs>";
      /* 5 kg -> 1 L infographic */
      s += E("g", { transform: "translate(72 92)" },
        E("rect", { x: -18, y: -40, width: 330, height: 84, rx: 12, fill: "#FFFDF6", stroke: "#DDD3BC" }) +
        [0, 1, 2, 3, 4].map(function (i) { return olive(10 + i * 26, 0, 1.6, i % 2 ? C.olV : C.olB); }).join("") +
        E("text", { x: 62, y: 34, "text-anchor": "middle", "font-family": SANS, "font-size": 12, "font-weight": 600, fill: "#5A6142" }, "≈ 5 kg") +
        E("path", { d: "M150 0H196M186 -8L196 0L186 8", stroke: C.oil2, "stroke-width": 3, fill: "none", "stroke-linecap": "round" }) +
        E("path", { d: "M244 -22c6 9 12 15 12 23a12 12 0 0 1-24 0c0-8 6-14 12-23z", fill: "url(#" + P + "oil)" }) +
        E("text", { x: 244, y: 34, "text-anchor": "middle", "font-family": SANS, "font-size": 12, "font-weight": 600, fill: "#5A6142" }, "1 L"));
      /* decanter */
      s += E("rect", { x: 96, y: 218, width: 60, height: 96, rx: 6, fill: "#5C7A2B" });
      s += E("clipPath", { id: P + "dc" }, E("path", { d: "M156 222H560L660 248V286L560 312H156Z" }));
      s += E("path", { d: "M156 222H560L660 248V286L560 312H156Z", fill: "url(#" + P + "mt)" });
      s += E("g", { "clip-path": "url(#" + P + "dc)" }, E("g", { "data-r": "stripes" },
        (function () { var d = ""; for (var k = -2; k < 26; k++) d += E("path", { d: "M" + (156 + k * 24) + " 222l-30 90", stroke: "#fff", "stroke-width": 5, opacity: ".35" }); return d; })()));
      s += E("path", { d: "M180 312V370M520 312V370", stroke: C.mDk, "stroke-width": 10 });
      /* oil outlet */
      s += E("path", { d: "M236 312V330", stroke: C.m3, "stroke-width": 14 });
      s += E("path", { "data-r": "ostream", d: "M236 334V420", stroke: "url(#" + P + "oil)", "stroke-width": 8, "stroke-linecap": "round" });
      for (var k = 0; k < 4; k++) s += E("ellipse", { "data-r": "dr" + k, cx: 236, cy: 340, rx: 3.2, ry: 4.5, fill: C.oil1 });
      s += E("rect", { x: 170, y: 400, width: 132, height: 118, rx: 8, fill: "url(#" + P + "mt)" });
      s += E("rect", { x: 186, y: 418, width: 24, height: 86, rx: 6, fill: "#3A3E31" });
      s += E("clipPath", { id: P + "gl" }, E("rect", { x: 188, y: 420, width: 20, height: 82, rx: 5 }));
      s += E("g", { "clip-path": "url(#" + P + "gl)" }, E("rect", { "data-r": "olv", x: 188, y: 502, width: 20, height: 90, fill: C.oil1 }));
      /* water + solids outlet */
      s += E("path", { d: "M622 296V330", stroke: C.m3, "stroke-width": 12 });
      s += E("path", { "data-r": "wstream", d: "M622 334V430", stroke: "#8C7A55", "stroke-width": 6, "stroke-linecap": "round", opacity: ".8" });
      s += E("rect", { x: 566, y: 420, width: 112, height: 96, rx: 6, fill: "#6F6A55" });
      s += E("rect", { "data-r": "wlv", x: 572, y: 500, width: 100, height: 10, fill: "#8C7A55" });
      return s;
    },
    update: function (q, t) {
      var st = q("stripes"); if (st) st.setAttribute("transform", "translate(" + f((t * 900) % 24) + " 0)");
      var on = t > .03 ? "1" : "0";
      ["ostream", "wstream"].forEach(function (r) { var n = q(r); if (n) n.setAttribute("opacity", on === "1" ? (r === "wstream" ? ".8" : "1") : "0"); });
      for (var k = 0; k < 4; k++) { var d = q("dr" + k); if (d) d.setAttribute("cy", f(340 + (((k * .25) + t * 4) % 1) * 70)); }
      var lv = q("olv"); if (lv) lv.setAttribute("y", f(lerp(500, 426, ease(t))));
      var w = q("wlv"); if (w) { var hh = lerp(8, 64, ease(t)); w.setAttribute("y", f(510 - hh)); w.setAttribute("height", f(hh)); }
    }
  });

  /* 7 · Mise en bouteille */
  SCENES.push({
    build: function (P) {
      var s = interior(P, { win: 70 });
      s += packDefs(P);
      s += E("rect", { x: 300, y: 96, width: 200, height: 92, rx: 10, fill: "url(#" + P + "mt)" });
      s += E("rect", { x: 318, y: 114, width: 70, height: 30, rx: 4, fill: "#2F342A" });
      s += E("circle", { cx: 428, cy: 130, r: 7, fill: "#7FB069" }) + E("circle", { cx: 452, cy: 130, r: 7, fill: C.oil1 });
      s += E("rect", { x: 388, y: 188, width: 24, height: 30, fill: C.m3 });
      s += E("path", { d: "M394 218h12l-3 10h-6z", fill: C.mDk });
      s += E("path", { "data-r": "pour", d: "M400 230V300", stroke: "url(#" + P + "oil)", "stroke-width": 5, "stroke-linecap": "round" });
      /* conveyor */
      s += E("rect", { x: 40, y: 448, width: 720, height: 20, rx: 10, fill: "#3B4232" });
      for (var i = 0; i < 18; i++) s += E("circle", { cx: 58 + i * 40, cy: 458, r: 6, fill: "#5E665C" });
      s += E("path", { d: "M90 468V520M710 468V520", stroke: C.mDk, "stroke-width": 10 });
      /* bottles */
      s += bottle(P, 190, 448, 220, 74, { P: P, name: "Sélection Classique", vol: "500 ml" });
      s += bottle(P, 400, 448, 220, 74, { P: P, clear: true, fill: 0, fillRef: "fill", capRef: "cap", labelRef: "label", name: "Sélection Classique", vol: "500 ml" });
      s += bottle(P, 610, 448, 220, 74, { P: P, clear: true, fill: 0, label: false });
      s += sealBadge(420, 330, 14, "seal");
      return s;
    },
    update: function (q, t) {
      var base = 448, h = 220, shBot = base - h + h * .075 + h * .1 + h * .13, full = base - shBot + h * .02;
      var fl = q("fill"); if (fl) { var fh = full * ease(seg(t, 0, .55)); fl.setAttribute("y", f(base - fh)); fl.setAttribute("height", f(fh + 2)); }
      var pr = q("pour"); if (pr) { pr.setAttribute("opacity", t < .55 ? "1" : "0"); pr.setAttribute("d", "M400 230V" + f(base - full * ease(seg(t, 0, .55)))); }
      var lb = q("label"); if (lb) { var k = ease(seg(t, .55, .72)); lb.setAttribute("transform", "scale(" + f(Math.max(k, .001)) + " 1)"); lb.setAttribute("opacity", k > 0 ? "1" : "0"); }
      var cp = q("cap"); if (cp) { var c = ease(seg(t, .7, .84)); cp.setAttribute("transform", "translate(0 " + f(lerp(-70, 0, c)) + ")"); cp.setAttribute("opacity", c > 0 ? "1" : "0"); }
      var se = q("seal"); if (se) { var sv = ease(seg(t, .84, 1)); se.setAttribute("transform", "scale(" + f(lerp(1.8, 1, sv)) + ")"); se.setAttribute("opacity", f(sv)); }
    }
  });

  /* 8 · À table */
  SCENES.push({
    build: function (P) {
      var s = backdrop(P, { seed: 41 });
      s += packDefs(P);
      s += E("rect", { y: 318, width: 800, height: 40, fill: "#EDE5D2" }) + E("rect", { y: 316, width: 800, height: 6, fill: "#F6F0E1" });
      for (var i = 0; i < 9; i++) s += E("rect", { x: 20 + i * 92, y: 326, width: 46, height: 26, rx: 13, fill: "#E2D8C1" });
      s += E("rect", { y: 358, width: 800, height: 202, fill: "#EFE7D5" });
      s += E("path", { d: "M0 358H800V560H0z", fill: "#F7F2E6" }) ;
      s += E("path", { d: "M0 372H800M0 388H800", stroke: "#C9D4B0", "stroke-width": 5, opacity: ".7" });
      /* olives bowl */
      s += E("ellipse", { cx: 128, cy: 470, rx: 74, ry: 22, fill: "#26310F", opacity: ".1" });
      s += E("path", { d: "M58 440c0 30 32 44 70 44s70-14 70-44z", fill: "#E9DCC2" });
      s += E("ellipse", { cx: 128, cy: 440, rx: 70, ry: 17, fill: "#F5EEDC" });
      var rr = rng(17);
      for (var k = 0; k < 14; k++) s += olive(f(84 + rr() * 88), f(432 + rr() * 12), 1.2, rr() > .5 ? C.olV : C.olB);
      /* plate + bread */
      s += E("ellipse", { cx: 410, cy: 488, rx: 186, ry: 44, fill: "#26310F", opacity: ".1" });
      s += E("ellipse", { cx: 410, cy: 478, rx: 180, ry: 46, fill: C.white });
      s += E("ellipse", { cx: 410, cy: 476, rx: 146, ry: 34, fill: "#F1EEE4" });
      s += E("path", { d: "M300 470c-6-26 30-40 110-40s124 10 114 36c-8 22-50 30-114 30s-104-6-110-26z", fill: C.crust });
      s += E("path", { d: "M312 466c-2-18 30-28 98-28s108 8 100 26c-6 16-44 22-100 22s-96-4-98-20z", fill: C.crumb });
      [[352, 458], [394, 452], [446, 462], [472, 454], [416, 470], [370, 474]].forEach(function (p) { s += E("ellipse", { cx: p[0], cy: p[1], rx: 5, ry: 2.6, fill: "#E2BD7D" }); });
      s += E("path", { d: "M330 462c30-10 70 4 100-6s50 0 66 4", stroke: C.tomato, "stroke-width": 10, fill: "none", opacity: ".45", "stroke-linecap": "round" });
      s += E("ellipse", { "data-r": "puddle", cx: 400, cy: 460, rx: 2, ry: 1, fill: "url(#" + P + "oil)", opacity: ".9" });
      /* tomato halves */
      s += E("ellipse", { cx: 650, cy: 474, rx: 40, ry: 22, fill: "#B8402C" }) + E("ellipse", { cx: 650, cy: 468, rx: 34, ry: 16, fill: "#E2694E" });
      [[640, 466], [654, 470], [662, 462]].forEach(function (p) { s += E("ellipse", { cx: p[0], cy: p[1], rx: 3, ry: 2, fill: "#F6D7A5" }); });
      s += oliveBranch(560, 520, .9, -10, false);
      /* tilted bottle */
      s += E("g", { "data-r": "btl", transform: "translate(560 210) rotate(-118)" }, bottle(P, 0, 120, 250, 82, { P: P, name: "Sélection Classique", vol: "500 ml" }));
      s += E("path", { "data-r": "stream", d: "M446 280C428 336 410 402 402 456", stroke: "url(#" + P + "oil)", "stroke-width": 5, fill: "none", "stroke-linecap": "round", "stroke-dasharray": "14 6", class: "flow" });
      return s;
    },
    update: function (q, t) {
      var on = t > .04 && t < .9;
      var st = q("stream"); if (st) st.setAttribute("opacity", on ? "1" : "0");
      var pd = q("puddle"); if (pd) { var k = ease(seg(t, .05, .95)); pd.setAttribute("rx", f(4 + 58 * k)); pd.setAttribute("ry", f(2 + 12 * k)); }
      var b = q("btl"); if (b) b.setAttribute("transform", "translate(560 " + f(lerp(200, 214, ease(seg(t, 0, .2)))) + ") rotate(" + f(lerp(-104, -118, ease(seg(t, 0, .2)))) + ")");
    }
  });

  function sceneSvg(i, t, cls) {
    var P = U("sc"), sc = SCENES[i];
    var svg = '<svg class="scene' + (cls ? " " + cls : "") + '" viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + sc.build(P) + "</svg>";
    return svg;
  }
  /* Mount a scene into a host element and return an updater bound to it. */
  function mountScene(host, i, t) {
    if (!host || !SCENES[i]) return function () {};
    host.innerHTML = sceneSvg(i);
    var root = host.firstChild, cache = {}, sc = SCENES[i];
    function q(r) { if (!(r in cache)) cache[r] = root.querySelector('[data-r="' + r + '"]'); return cache[r]; }
    var upd = function (tt) { sc.update(q, clamp(tt, 0, 1)); };
    upd(t === undefined ? 0 : t);
    return upd;
  }

  /* ------------------------------------------------------------ hero */
  function hero() {
    var P = U("hr"), s = "<defs>" +
      E("linearGradient", { id: P + "sky", x1: 0, y1: 0, x2: 0, y2: 1 }, '<stop offset="0" stop-color="#EAE2C8"/><stop offset=".55" stop-color="#F6F0E0"/><stop offset="1" stop-color="#F8F3E6"/>') +
      E("radialGradient", { id: P + "sun", cx: "50%", cy: "50%", r: "50%" }, '<stop offset="0" stop-color="#F7DB8A" stop-opacity=".95"/><stop offset=".4" stop-color="#F7DB8A" stop-opacity=".35"/><stop offset="1" stop-color="#F7DB8A" stop-opacity="0"/>') +
      E("linearGradient", { id: P + "ledge", x1: 0, y1: 0, x2: 0, y2: 1 }, '<stop offset="0" stop-color="#F1EAD8"/><stop offset="1" stop-color="#DCD1B6"/>') +
      "</defs>";
    s += E("rect", { width: 1440, height: 760, fill: "url(#" + P + "sky)" });
    s += E("g", { "data-depth": ".05" }, E("circle", { cx: 1010, cy: 210, r: 260, fill: "url(#" + P + "sun)" }) + E("circle", { cx: 1010, cy: 210, r: 58, fill: "#F4D47E" }));
    s += E("g", { "data-depth": ".12" },
      E("path", { d: "M0 430C180 382 340 404 520 372S860 330 1060 360 1340 350 1440 340V760H0z", fill: "#D7E0C2" }) +
      village(780, 362, 1.25));
    s += E("g", { "data-depth": ".22" },
      E("path", { d: "M0 500C240 452 470 482 700 452S1100 420 1440 456V760H0z", fill: "#B9CA97" }) +
      (function () { var g = "", r = rng(77);
        for (var i = 0; i < 5; i++) { var y = 478 + i * (12 + i * 4), sz = 5 + i * 2.4, gap = 22 + i * 11, off = (i % 2) * gap / 2;
          for (var x = -20 + off; x < 1460; x += gap) { var jx = x + (r() - .5) * 5;
            g += E("ellipse", { cx: f(jx), cy: f(y - sz * .2), rx: f(sz * 1.1), ry: f(sz * .8), fill: i % 2 ? C.can2 : C.can1 });
            g += E("ellipse", { cx: f(jx - sz * .3), cy: f(y - sz * .5), rx: f(sz * .45), ry: f(sz * .3), fill: C.leafHi, opacity: ".45" }); } }
        return g; })());
    s += E("g", { "data-depth": ".34" }, E("path", { d: "M0 610C300 576 760 596 1440 560V760H0z", fill: "#A3B97A" }) +
      (function () { var g = ""; for (var i = 0; i < 5; i++) g += E("path", { d: "M0 " + (632 + i * 26) + "C360 " + (606 + i * 26) + " 840 " + (618 + i * 26) + " 1440 " + (588 + i * 26), stroke: "#90A866", "stroke-width": 2, fill: "none", opacity: ".55" }); return g; })());
    /* ledge + bottle + bowl */
    var B = U("hb");
    s += E("g", { "data-depth": ".5", class: "hero-still" },
      packDefs(B) +
      E("path", { d: "M820 640H1440V760H780z", fill: "url(#" + P + "ledge)" }) +
      E("path", { d: "M780 760L820 640H1440V652H828L792 760z", fill: "#FBF7EC", opacity: ".7" }) +
      E("ellipse", { cx: 1090, cy: 652, rx: 120, ry: 12, fill: "#26310F", opacity: ".16" }) +
      E("g", { transform: "translate(890 214) scale(1.12)" }, bottle(B, 180, 390, 392, 128, { P: B, name: "Sélection Classique", vol: "500 ml" })) +
      E("ellipse", { cx: 1290, cy: 668, rx: 86, ry: 14, fill: "#26310F", opacity: ".14" }) +
      E("path", { d: "M1210 636c0 30 36 42 80 42s80-12 80-42z", fill: "#E9DCC2" }) + E("ellipse", { cx: 1290, cy: 636, rx: 80, ry: 18, fill: "#F5EEDC" }) +
      (function () { var g = "", r = rng(9); for (var k = 0; k < 16; k++) g += olive(f(1236 + r() * 108), f(626 + r() * 12), 1.6, r() > .5 ? C.olV : C.olB); return g; })() +
      oliveBranch(940, 666, 1.2, -6, false));
    s += E("g", { "data-depth": ".7", class: "sway-slow" }, oliveBranch(1460, 40, 2.1, 152, true));
    return '<svg class="hero-art" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + s + "</svg>";
  }

  function landscape(cls) {
    var P = U("ls");
    return '<svg class="' + (cls || "land") + '" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<g transform="translate(0 -170)">' + backdrop(P, { seed: 55 }) + "</g></svg>";
  }

  return {
    icon: icon, logo: logo, logoMark: logoMark, pack: pack,
    varietySpot: varietySpot, dishSpot: dishSpot,
    sceneCount: SCENES.length, sceneSvg: sceneSvg, mountScene: mountScene,
    hero: hero, landscape: landscape, oliveBranch: oliveBranch
  };
})();
