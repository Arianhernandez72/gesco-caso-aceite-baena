/* Case dossier — the Annex 1 items that cannot be shown by browsing the shop. */
window.DOSSIER = (function () {
  function x(fr, es, en) { return { fr: fr, es: es, en: en }; }

  var CANVAS = [
    { k: x("Partenaires clés", "Socios clave", "Key partners"), v: x(
      "Conseil régulateur de l'AOP Baena (19 moulins), moulins associés, Turismo Andaluz et Turespaña, Diputación de Córdoba et Ruta del Aceite, opérateur logistique spécialisé liquides, hébergeur et prestataire de paiement.",
      "Consejo Regulador de la DOP Baena (19 almazaras), almazaras asociadas, Turismo Andaluz y Turespaña, Diputación de Córdoba y Ruta del Aceite, operador logístico especializado en líquidos, hosting y pasarela de pago.",
      "DOP Baena Regulatory Council (19 mills), member mills, Turismo Andaluz and Turespaña, Diputación de Córdoba and the Olive Oil Route, a logistics operator specialised in liquids, the host and the payment provider."), span: true },
    { k: x("Activités clés", "Actividades clave", "Key activities"), v: x(
      "Achat aux moulins de l'AOP, communication offline en destination, inbound et SEO/SEM, exploitation de l'ecommerce, logistique intracommunautaire, relation avec les tour-opérateurs, la presse et les créateurs de contenu.",
      "Compra a las almazaras de la DOP, comunicación offline en destino, inbound y SEO/SEM, gestión del ecommerce, logística intracomunitaria, relación con touroperadores, prensa y creadores de contenido.",
      "Buying from the appellation's mills, offline communication in destination, inbound and SEO/SEM, running the store, intra-EU logistics, relations with tour operators, press and content creators.") },
    { k: x("Proposition de valeur", "Propuesta de valor", "Value proposition"), v: x(
      "Une huile AOP Baena traçable jusqu'à un moulin précis, avec son histoire et sa certification d'origine : rapporter chez soi le goût réel de l'Andalousie plutôt qu'un assemblage anonyme de supermarché. Captation de données zero-party et first-party aux points de contact offline-to-online (QR en aéroport, dégustations) pour personnaliser l'expérience D2C et sécuriser le réachat.",
      "Un aceite DOP Baena trazable hasta una almazara concreta, con su historia y su certificación de origen: llevarse a casa el sabor real de Andalucía en lugar de una mezcla anónima de supermercado. Captación de datos zero-party y first-party en los puntos de contacto offline-to-online (QR en aeropuerto, degustaciones) para personalizar la experiencia D2C y asegurar la recompra.",
      "A Baena PDO oil traceable to a named mill, with its story and its origin certification: taking the real taste of Andalusia home instead of an anonymous supermarket blend. Zero-party and first-party data captured at offline-to-online touchpoints (airport QR, tastings) to personalise the D2C experience and secure repeat purchase."), span: true },
    { k: x("Relation client", "Relación con clientes", "Customer relationships"), v: x(
      "Communauté sur les réseaux sociaux, email marketing personnalisé par buyer persona, service client trilingue, rappel de réachat calé sur le cycle de vie du produit (une bouteille dure 2 à 3 mois).",
      "Comunidad en redes sociales, email marketing personalizado por buyer persona, atención al cliente trilingüe, recordatorio de recompra ligado al ciclo de vida del producto (una botella dura 2-3 meses).",
      "A community on social media, email marketing personalised by buyer persona, trilingual customer service, a repurchase reminder tied to the product's life cycle (a bottle lasts two to three months).") },
    { k: x("Segments de clientèle", "Segmentos de clientes", "Customer segments"), v: x(
      "Touristes français amateurs de voyage gastronomique, résidents français au mode de vie méditerranéen, épiceries fines et canal B2B gourmet en France.",
      "Turistas franceses amantes del gastronomy-travel, residentes franceses con estilo de vida mediterráneo, épiceries fines y canal B2B gourmet en Francia.",
      "French tourists who travel for food, French residents with a Mediterranean lifestyle, fine grocers and the gourmet B2B channel in France.") },
    { k: x("Ressources clés", "Recursos clave", "Key resources"), v: x(
      "Le label AOP, le réseau des moulins de Baena, la plateforme ecommerce trilingue et la base de leads captés en destination.",
      "El sello DOP, la red de almazaras de Baena, la plataforma ecommerce trilingüe y la base de leads captados en destino.",
      "The PDO label, the network of Baena mills, the trilingual commerce platform and the lead base captured in destination.") },
    { k: x("Canaux", "Canales", "Channels"), v: x(
      "Ecommerce propre (D2C), relations publiques et sampling en Espagne, réseaux sociaux, importateur et épiceries fines en France, marketplace Amazon France.",
      "Ecommerce propio (D2C), RRPP y sampling en España, redes sociales, importador y épiceries fines en Francia, marketplace Amazon France.",
      "Own D2C store, PR and sampling in Spain, social media, importer and fine grocers in France, Amazon France marketplace.") },
    { k: x("Structure de coûts", "Estructura de costes", "Cost structure"), v: x(
      "Achat du produit aux moulins, marketing (RP + online), logistique intracommunautaire avec emballage renforcé, hébergement et maintenance du site, commissions marketplace et prestataire de paiement.",
      "Compra de producto a las almazaras, marketing (RRPP + online), logística intracomunitaria con embalaje reforzado, hosting y mantenimiento de la web, comisiones de marketplace y pasarela de pago.",
      "Buying product from the mills, marketing (PR plus online), intra-EU logistics with reinforced packaging, hosting and site maintenance, marketplace and payment-provider fees.") },
    { k: x("Sources de revenus", "Fuentes de ingresos", "Revenue streams"), v: x(
      "Vente directe D2C (marge la plus élevée), vente B2B à l'importateur et aux épiceries fines (volume), vente en marketplace (visibilité et confort d'achat).",
      "Venta directa D2C (mayor margen), venta B2B al importador y a las épiceries fines (volumen), venta en marketplace (visibilidad y conveniencia).",
      "Direct D2C sales (best margin), B2B sales to the importer and fine grocers (volume), marketplace sales (visibility and convenience).") }
  ];

  var TREE = [
    ["Accueil", "#/", 0],
    ["L'AOP Baena", "#/aop-baena", 1],
    ["Produits", "#/produits", 1],
    ["Sélection Classique", "#/produit/classique", 2],
    ["Coffret Dégustation Premium", "#/produit/premium", 2],
    ["Coffret Cadeau", "#/produit/cadeau", 2],
    ["Bidon 5 L", "#/produit/bidon", 2],
    ["Accessoires de dégustation", "#/produits", 2],
    ["Recettes & Santé", "#/recettes", 1],
    ["Oléotourisme", "#/oleotourisme", 1],
    ["Livraison en France", "#/livraison", 1],
    ["Espace Pro (B2B)", "#/pro", 1],
    ["Panier", "#/panier", 1],
    ["Commande — 3 étapes", "#/checkout", 2],
    ["Mon compte", "#/compte", 1],
    ["Mes commandes · Mes informations · Facturation · Préférences", "#/compte", 2],
    ["Contact", "#/contact", 1],
    ["Dossier du cas", "#/dossier", 1]
  ];

  var FORMS = [
    { n: x("Newsletter / capture de lead", "Newsletter / captación de lead", "Newsletter / lead capture"),
      w: x("Accueil, Oléotourisme, QR de la dégustation", "Inicio, Oleoturismo, QR de la cata", "Home, Oil tourism, tasting QR"),
      r: x("E-mail, consentement", "Email, consentimiento", "Email, consent"),
      o: x("Prénom, ville, où nous avez-vous découverts", "Nombre, ciudad, dónde nos descubriste", "First name, town, where you found us"),
      d: x("CRM → séquence de bienvenue + code 10 %", "CRM → secuencia de bienvenida + código 10 %", "CRM → welcome sequence + 10% code") },
    { n: x("Contact", "Contacto", "Contact"), w: x("Page Contact", "Página Contacto", "Contact page"),
      r: x("Nom, e-mail, message", "Nombre, email, mensaje", "Name, email, message"), o: x("—", "—", "—"),
      d: x("Service client, réponse sous 48 h ouvrées", "Atención al cliente, respuesta en 48 h laborables", "Customer service, reply within 48 working hours") },
    { n: x("Demande professionnelle (B2B)", "Solicitud profesional (B2B)", "Trade request (B2B)"),
      w: x("Espace Pro", "Área Profesional", "Trade area"),
      r: x("Société, nom, e-mail, type d'établissement", "Empresa, nombre, email, tipo de establecimiento", "Company, name, email, business type"),
      o: x("Volume annuel, n° de TVA, message", "Volumen anual, NIF intracomunitario, mensaje", "Annual volume, EU VAT number, message"),
      d: x("Commercial export → envoi du dossier et des échantillons", "Comercial export → envío del dosier y muestras", "Export sales → trade pack and samples") },
    { n: x("Création de compte", "Alta de cuenta", "Account creation"), w: x("Mon compte", "Mi cuenta", "My account"),
      r: x("Prénom, e-mail, mot de passe", "Nombre, email, contraseña", "First name, email, password"),
      o: x("Nom, profil de goût", "Apellidos, perfil de sabor", "Last name, taste profile"),
      d: x("Compte client, recommandations personnalisées", "Cuenta de cliente, recomendaciones personalizadas", "Customer account, personalised recommendations") },
    { n: x("Commande (checkout)", "Pedido (checkout)", "Checkout"), w: x("Tunnel en 3 étapes", "Embudo de 3 pasos", "Three-step funnel"),
      r: x("Prénom, nom, e-mail, adresse, code postal, ville, pays, mode de paiement, CGV", "Nombre, apellidos, email, dirección, CP, ciudad, país, forma de pago, condiciones", "First name, last name, email, address, postcode, city, country, payment method, terms"),
      o: x("Téléphone, complément d'adresse, société, n° de TVA, message cadeau, opt-in newsletter", "Teléfono, datos adicionales, empresa, NIF, mensaje de regalo, alta en newsletter", "Phone, address line 2, company, VAT number, gift message, newsletter opt-in"),
      d: x("Commande, facture et déclenchement logistique", "Pedido, factura y lanzamiento logístico", "Order, invoice and fulfilment trigger") },
    { n: x("Réservation de dégustation", "Reserva de cata", "Tasting booking"), w: x("Oléotourisme", "Oleoturismo", "Oil tourism"),
      r: x("E-mail, consentement", "Email, consentimiento", "Email, consent"),
      o: x("Prénom, ville, canal de découverte", "Nombre, ciudad, canal de descubrimiento", "First name, town, discovery channel"),
      d: x("Agenda des moulins + séquence pré-voyage", "Agenda de almazaras + secuencia pre-viaje", "Mill calendar plus pre-trip sequence") }
  ];

  var HOSTING = [
    { n: "Wix Business Elite", p: "35 €/" + "mois", f: x(
      "Ecommerce illimité, Wix Multilingual natif (FR/ES/EN), CDN et SSL inclus, 99,9 % de disponibilité, support 24/7, domaine offert la première année, sauvegardes automatiques.",
      "Ecommerce ilimitado, Wix Multilingual nativo (FR/ES/EN), CDN y SSL incluidos, 99,9 % de disponibilidad, soporte 24/7, dominio gratis el primer año, copias automáticas.",
      "Unlimited commerce, native Wix Multilingual (FR/ES/EN), CDN and SSL included, 99.9% uptime, 24/7 support, free domain for the first year, automatic backups."), sel: true },
    { n: "Shopify Basic", p: "29 €/" + "mois", f: x(
      "Ecommerce solide, mais le multilingue passe par une application tierce et une commission supplémentaire s'applique si l'on n'utilise pas Shopify Payments.",
      "Ecommerce sólido, pero el multiidioma depende de una app de terceros y se aplica comisión adicional si no se usa Shopify Payments.",
      "Solid commerce, but multilingual needs a third-party app and an extra fee applies unless you use Shopify Payments.") },
    { n: "OVHcloud Performance + WooCommerce", p: "12 €/" + "mois", f: x(
      "Le moins cher et le plus souple, serveurs en France, mais exige d'administrer les mises à jour, la sécurité et les sauvegardes : pas de ressource technique dans l'équipe.",
      "El más barato y flexible, servidores en Francia, pero exige administrar actualizaciones, seguridad y copias: el equipo no tiene recurso técnico.",
      "Cheapest and most flexible, servers in France, but you must run updates, security and backups yourself: the team has no technical resource.") }
  ];

  var SEOKW = [
    ["huile d'olive AOP Baena", x("Commerciale", "Comercial", "Commercial"), x("Marque / AOP", "Marca / DOP", "Brand / PDO"), x("Très élevé", "Muy alto", "Very high"), x("Fiche produit", "Ficha de producto", "Product page")],
    ["acheter huile d'olive espagnole", x("Transactionnelle", "Transaccional", "Transactional"), x("Achat", "Compra", "Purchase"), x("Très élevé", "Muy alto", "Very high"), x("Boutique", "Tienda", "Shop")],
    ["huile d'olive livraison France", x("Transactionnelle", "Transaccional", "Transactional"), x("Achat", "Compra", "Purchase"), x("Très élevé", "Muy alto", "Very high"), x("Livraison en France", "Envíos a Francia", "Shipping to France")],
    ["huile d'olive andalouse", x("Commerciale", "Comercial", "Commercial"), x("Origine", "Origen", "Origin"), x("Très élevé", "Muy alto", "Very high"), x("L'AOP Baena", "La DOP Baena", "The PDO")],
    ["huile d'olive plurivariétale", x("Informative", "Informativa", "Informational"), x("Différenciation", "Diferenciación", "Differentiation"), x("Très élevé", "Muy alto", "Very high"), x("L'AOP Baena", "La DOP Baena", "The PDO")],
    ["comment choisir son huile d'olive", x("Informative", "Informativa", "Informational"), x("Guide pilier", "Guía pilar", "Pillar guide"), x("Très élevé", "Muy alto", "Very high"), x("Recettes & Santé", "Recetas y Salud", "Recipes & Health")],
    ["AOP huile d'olive c'est quoi", x("Informative", "Informativa", "Informational"), x("Certification", "Certificación", "Certification"), x("Très élevé", "Muy alto", "Very high"), x("L'AOP Baena", "La DOP Baena", "The PDO")],
    ["coffret cadeau huile d'olive", x("Transactionnelle", "Transaccional", "Transactional"), x("Cadeau", "Regalo", "Gift"), x("Élevé", "Alto", "High"), x("Coffret Cadeau", "Kit de Regalo", "Gift Set")],
    ["huile d'olive Picuda", x("Informative", "Informativa", "Informational"), x("Variétale", "Varietal", "Varietal"), x("Élevé", "Alto", "High"), x("L'AOP Baena", "La DOP Baena", "The PDO")],
    ["huile d'olive traçable", x("Confiance", "Confianza", "Trust"), x("Traçabilité", "Trazabilidad", "Traceability"), x("Élevé", "Alto", "High"), x("L'AOP Baena", "La DOP Baena", "The PDO")],
    ["dégustation huile d'olive Cordoue", x("Tourisme", "Turismo", "Tourism"), x("Long tail", "Long tail", "Long tail"), x("Très élevé", "Muy alto", "Very high"), x("Oléotourisme", "Oleoturismo", "Oil tourism")],
    ["fournisseur huile d'olive AOP espagnole", x("B2B", "B2B", "B2B"), x("Professionnel", "Profesional", "Trade"), x("Élevé", "Alto", "High"), x("Espace Pro", "Área Profesional", "Trade")]
  ];


  var COVER = [
    [x("1 · Modèle CANVAS", "1 · Modelo CANVAS", "1 · Business model canvas"), "#dc-canvas"],
    [x("2 · Arborescence du site", "2 · Árbol de contenidos", "2 · Site tree"), "#dc-tree"],
    [x("2 · Menu principal (niveau visuel du catalogue)", "2 · Menú principal (nivel visual del catálogo)", "2 · Main menu (catalogue's first visual level)"), "#dc-tree"],
    [x("Formulaires web", "Formularios web", "Web forms"), "#dc-forms"],
    [x("Espace client", "Área de cliente", "Customer area"), "#dc-account"],
    [x("Zone d'achat — fiches, panier, checkout, paiements", "Área de compra — fichas, carrito, checkout, pagos", "Purchase area — product pages, cart, checkout, payments"), "#/produits"],
    [x("Stratégie commerciale — offres, up et cross-selling", "Estrategia comercial — ofertas, up y cross-selling", "Commercial strategy — offers, up and cross-selling"), "#dc-comm"],
    [x("Calendrier promotionnel annuel", "Calendario anual promocional", "Annual promotional calendar"), "#dc-cal"],
    [x("Hébergement et services", "Hosting y servicios", "Hosting and services"), "#dc-host"],
    [x("Logistique, tarifs et emballage", "Logística, tarifas y embalaje", "Logistics, rates and packaging"), "#dc-log"]
  ];

  function view() {
    var B = window.BAENA, t = B.t, L = B.L, esc = B.esc, money = B.money;

    function sec(id, titleKey, inner) {
      return '<section class="section" id="' + id + '" style="padding-block:clamp(28px,4vw,46px); border-top:1px solid var(--line)">' +
        '<div class="wrap stack g16">' + inner + "</div></section>";
    }

    var canvas = '<div class="canvas">' + CANVAS.map(function (c) {
      return '<div class="cell' + (c.span ? " c-span2" : "") + '"><h4>' + esc(L(c.k)) + "</h4><p>" + esc(L(c.v)) + "</p></div>";
    }).join("") + "</div>";

    var tree = '<div class="card" style="padding:18px"><div class="stack g6">' + TREE.map(function (n) {
      var pad = n[2] * 22;
      var mark = n[2] === 0 ? "" : (n[2] === 1 ? "└─ " : "  └─ ");
      return '<div style="padding-left:' + pad + 'px; font-size:.9rem">' +
        '<span class="muted">' + mark + '</span><a href="' + n[1] + '" style="text-decoration:none' +
        (n[2] === 0 ? ";font-weight:700" : "") + '">' + esc(n[0]) + "</a></div>";
    }).join("") + "</div></div>";

    var forms = '<div class="tablewrap"><table><thead><tr><th>' +
      esc(L(x("Formulaire", "Formulario", "Form"))) + "</th><th>" + esc(L(x("Où", "Dónde", "Where"))) +
      "</th><th>" + esc(L(x("Champs obligatoires", "Campos obligatorios", "Required fields"))) +
      "</th><th>" + esc(L(x("Champs facultatifs", "Campos opcionales", "Optional fields"))) +
      "</th><th>" + esc(L(x("Destination de la donnée", "Destino del dato", "Where the data goes"))) +
      "</th></tr></thead><tbody>" + FORMS.map(function (f) {
        return "<tr><td><strong>" + esc(L(f.n)) + "</strong></td><td>" + esc(L(f.w)) + "</td><td>" +
          esc(L(f.r)) + "</td><td>" + esc(L(f.o)) + "</td><td>" + esc(L(f.d)) + "</td></tr>";
      }).join("") + "</tbody></table></div>";

    var acct = '<div class="grid g-2">' + [
      [x("Entrée", "Entrada", "Sign-in"), x("E-mail et mot de passe, ou création de compte en trois champs obligatoires. Le compte se crée aussi automatiquement à la première commande.", "Email y contraseña, o alta con tres campos obligatorios. La cuenta también se crea automáticamente con el primer pedido.", "Email and password, or sign-up with three required fields. An account is also created automatically at the first order.")],
      [x("Mes commandes", "Mis pedidos", "My orders"), x("Historique avec numéro, date, statut (en préparation, en acheminement, livrée), détail des lignes, facture et bouton « commander à nouveau ».", "Histórico con número, fecha, estado (en preparación, en tránsito, entregado), detalle de líneas, factura y botón «volver a pedir».", "History with number, date, status (being prepared, in transit, delivered), line detail, invoice and an order-again button.")],
      [x("Mes informations", "Mis datos", "My details"), x("Prénom, nom, e-mail, téléphone, adresse de livraison. Modifiables à tout moment.", "Nombre, apellidos, email, teléfono y dirección de envío. Modificables en cualquier momento.", "First name, last name, email, phone and delivery address. Editable at any time.")],
      [x("Facturation", "Facturación", "Billing"), x("Adresse de facturation distincte si nécessaire et numéro de TVA intracommunautaire pour les professionnels, qui déclenche la facturation hors taxes.", "Dirección de facturación distinta si procede y NIF intracomunitario para profesionales, que activa la facturación sin impuestos.", "A separate billing address where needed, plus an EU VAT number for trade customers, which switches invoicing to tax-free.")],
      [x("Préférences", "Preferencias", "Preferences"), x("Opt-in newsletter et profil de goût (doux, équilibré, intense), qui pilote les recommandations et le contenu des e-mails.", "Alta en newsletter y perfil de sabor (suave, equilibrado, intenso), que gobierna recomendaciones y contenido de los correos.", "Newsletter opt-in and taste profile (mild, balanced, intense), which drives recommendations and email content.")],
      [x("Rappel de réachat", "Recordatorio de recompra", "Refill reminder"), x("Déclencheur à 60 ou 90 jours selon la fenêtre de consommation déclarée, avec recettes et nouvelles de la récolte plutôt qu'une simple remise.", "Disparador a 60 o 90 días según la ventana de consumo declarada, con recetas y novedades de cosecha en vez de solo un descuento.", "Triggered at 60 or 90 days depending on the declared consumption window, carrying recipes and harvest news rather than just a discount.")]
    ].map(function (r) {
      return '<div class="card" style="padding:16px"><h4>' + esc(L(r[0])) + '</h4><p class="small muted" style="margin-top:6px">' + esc(L(r[1])) + "</p></div>";
    }).join("") + "</div>";

    var comm = '<div class="grid g-3">' + [
      [x("Offres et saisonnalité", "Ofertas y estacionalidad", "Offers and seasonality"), x(
        "Code de bienvenue de 10 % (BAENA10) remis au QR de la dégustation, livraison offerte dès 49 €, abonnement trimestriel à −8 %. La saisonnalité suit le calendrier français : Semaine du Goût en octobre, récolte en novembre-décembre, Noël, rentrée en septembre, bonnes résolutions en janvier.",
        "Código de bienvenida del 10 % (BAENA10) entregado en el QR de la cata, envío gratis desde 49 € y suscripción trimestral al −8 %. La estacionalidad sigue el calendario francés: Semaine du Goût en octubre, cosecha en noviembre-diciembre, Navidad, vuelta en septiembre y propósitos en enero.",
        "A 10% welcome code (BAENA10) handed out with the tasting QR, free shipping over €49, a quarterly subscription at 8% off. Seasonality follows the French calendar: Semaine du Goût in October, harvest in November and December, Christmas, the September rentrée and January resolutions.")],
      [x("Up-selling", "Up-selling", "Up-selling"), x(
        "Depuis la Sélection Classique vers le Coffret Dégustation Premium, mis en avant sur la fiche produit avec l'écart de prix explicite (23,10 €) et l'argument du cadeau. Depuis le format 500 ml vers le bidon 5 L, sur l'argument du prix au litre et de l'absence de casse.",
        "De la Selección Clásica al Estuche Cata Premium, destacado en la ficha con la diferencia de precio explícita (23,10 €) y el argumento del regalo. Del formato 500 ml a la lata de 5 L, con el argumento del precio por litro y la ausencia de roturas.",
        "From the Classic Selection to the Premium Tasting Box, shown on the product page with the price gap spelled out (€23.10) and the gift argument. From the 500 ml bottle to the 5 L tin, on price per litre and no breakage.")],
      [x("Cross-selling", "Cross-selling", "Cross-selling"), x(
        "Verres de dégustation cobalt et carnet de recettes andalouses proposés sur la fiche produit et dans le panier, plus un pack apéritif groupé en juin. Le panier affiche aussi le montant restant pour atteindre la livraison offerte.",
        "Vasitos de cata cobalto y cuaderno de recetas andaluzas ofrecidos en la ficha y en el carrito, además de un pack aperitivo conjunto en junio. El carrito muestra también cuánto falta para el envío gratis.",
        "Cobalt tasting glasses and the Andalusian recipe book offered on the product page and in the cart, plus a bundled apéritif pack in June. The cart also shows how much is left for free shipping.")]
    ].map(function (r) {
      return '<div class="card" style="padding:16px"><h4>' + esc(L(r[0])) + '</h4><p class="small muted" style="margin-top:6px">' + esc(L(r[1])) + "</p></div>";
    }).join("") + "</div>";

    var cal = '<div class="calgrid">' + window.DATA.promoCal.map(function (m) {
      return '<div class="month"><div class="m">' + esc(L(m.m)) + '</div><div class="t">' + esc(L(m.t)) +
        '</div><div class="d">' + esc(L(m.d)) + "</div></div>";
    }).join("") + "</div>";

    var host = '<div class="tablewrap"><table><thead><tr><th>' +
      esc(L(x("Prestataire", "Proveedor", "Provider"))) + "</th><th>" + esc(L(x("Prix", "Precio", "Price"))) +
      "</th><th>" + esc(L(x("Ce que couvre l'offre", "Qué cubre la oferta", "What the plan covers"))) + "</th></tr></thead><tbody>" +
      HOSTING.map(function (p) {
        return "<tr><td><strong>" + esc(p.n) + "</strong>" +
          (p.sel ? '<br><span class="pill" style="color:var(--good)">● ' + esc(L(x("Retenu", "Elegido", "Selected"))) + "</span>" : "") +
          '</td><td class="tnum">' + esc(p.p) + "</td><td>" + esc(L(p.f)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="notice" style="margin-top:14px"><strong>' + esc(L(x("Décision", "Decisión", "Decision"))) + "</strong> · " +
      esc(L(x("Wix Business Elite. Le multilingue FR/ES/EN est natif, ce qui est décisif pour ce projet, et le CDN, le SSL et les sauvegardes sont inclus sans administration serveur — l'équipe n'a pas de ressource technique. Coût annuel retenu : 420 € d'abonnement, 15 € pour le domaine .fr et environ 1,4 % + 0,25 € par transaction pour le paiement.",
        "Wix Business Elite. El multiidioma FR/ES/EN es nativo, algo decisivo en este proyecto, y el CDN, el SSL y las copias van incluidos sin administrar servidor: el equipo no tiene recurso técnico. Coste anual previsto: 420 € de suscripción, 15 € del dominio .fr y en torno a 1,4 % + 0,25 € por transacción de pasarela.",
        "Wix Business Elite. FR/ES/EN multilingual is native, which is decisive here, and CDN, SSL and backups come included with no server administration — the team has no technical resource. Budgeted annual cost: €420 subscription, €15 for the .fr domain and roughly 1.4% plus €0.25 per transaction for payments."))) + "</div>";

    var log = window.BAENA.carrierTable() +
      '<div class="split" style="margin-top:16px">' +
        '<div class="stack g12"><h4>' + esc(L(x("Processus de préparation", "Proceso de preparación", "Preparation process"))) + "</h4>" +
        '<ol class="small muted stack g8" style="padding-left:18px">' +
        [x("Réception de la commande et contrôle du lot : moulin, date de moulinage, numéro d'analyse.", "Recepción del pedido y control del lote: almazara, fecha de molturación y número de análisis.", "Order received and lot checked: mill, milling date, analysis number."),
         x("Mise sous sachet anti-fuite de chaque bouteille en verre.", "Embolsado antifugas de cada botella de vidrio.", "Each glass bottle goes into a leak-proof sleeve."),
         x("Calage par coussins d'air sur les six faces d'un carton double cannelure.", "Calzado con cojines de aire en las seis caras de una caja de doble canal.", "Air-pillow cushioning on all six faces of a double-wall carton."),
         x("Étiquetage, bordereau intracommunautaire et remise au transporteur sous 24 h ouvrées.", "Etiquetado, albarán intracomunitario y entrega al transportista en 24 h laborables.", "Labelling, intra-EU waybill and handover to the carrier within 24 working hours."),
         x("Le bidon 5 L part sans sur-emballage : le métal ne casse pas et réduit le coût volumétrique.", "La lata de 5 L sale sin sobreembalaje: el metal no rompe y reduce el coste volumétrico.", "The 5 L tin ships without over-packing: metal does not break and cuts volumetric cost.")]
          .map(function (s) { return "<li>" + esc(L(s)) + "</li>"; }).join("") + "</ol>" +
        '<p class="small muted">' + esc(L(x("Taux de casse constaté sur la campagne : 0,4 %. Pas de formalité douanière ni de droits : España et France sont dans le marché unique.",
          "Tasa de rotura de la campaña: 0,4 %. Sin trámite aduanero ni aranceles: España y Francia están en el mercado único.",
          "Breakage rate this season: 0.4%. No customs formalities and no duty: Spain and France are in the single market."))) + "</p></div>" +
        '<div class="card" style="padding:16px"><h4 style="margin-bottom:10px">' +
          esc(L(x("Design de l'emballage logistique", "Diseño del embalaje logístico", "Shipping pack design"))) + "</h4>" +
          window.BAENA.packagingSvg() + "</div>" +
      "</div>";

    var seo = '<div class="tablewrap"><table><thead><tr><th>Keyword</th><th>' +
      esc(L(x("Intention", "Intención", "Intent"))) + "</th><th>" + esc(L(x("Type", "Tipo", "Type"))) +
      "</th><th>" + esc(L(x("Potentiel", "Potencial", "Potential"))) + "</th><th>" +
      esc(L(x("Page cible", "Página destino", "Target page"))) + "</th></tr></thead><tbody>" +
      SEOKW.map(function (r) {
        return "<tr><td><strong>" + esc(r[0]) + "</strong></td><td>" + esc(L(r[1])) + "</td><td>" +
          esc(L(r[2])) + "</td><td>" + esc(L(r[3])) + "</td><td>" + esc(L(r[4])) + "</td></tr>";
      }).join("") + "</tbody></table></div>";



    return '<section class="section"><div class="wrap stack g24">' +
        '<p class="breadcrumb"><a href="#/">' + esc(t("nav.home")) + "</a> / " + esc(t("dossier.title")) + "</p>" +
        '<div class="stack g12 measure"><span class="eyebrow">Annexe 1 · GESCO · ESIC</span>' +
          "<h1>" + esc(t("dossier.h1")) + '</h1><p class="lede">' + esc(t("dossier.lede")) + "</p></div>" +
        '<div class="stack g8"><span class="small muted">' + esc(t("dossier.nav")) + "</span>" +
          '<div class="anchorlist">' + COVER.map(function (c) {
            return '<a href="' + c[1] + '">' + esc(L(c[0])) + "</a>";
          }).join("") + "</div></div>" +
      "</div></section>" +

      sec("dc-canvas", "", "<h2>" + esc(t("dossier.d1")) + "</h2>" + canvas) +
      sec("dc-tree", "", "<h2>" + esc(t("dossier.d2")) + "</h2>" +
        '<p class="muted measure">' + esc(L(x("Le menu principal reprend les six premières branches : c'est le niveau visuel initial du catalogue. Chaque entrée de l'arbre est cliquable.",
          "El menú principal recoge las seis primeras ramas: ese es el nivel visual inicial del catálogo. Cada entrada del árbol es clicable.",
          "The main menu carries the first six branches: that is the catalogue's initial visual level. Every node here is clickable."))) + "</p>" + tree) +
      sec("dc-forms", "", "<h2>" + esc(t("dossier.d3")) + "</h2>" + forms) +
      sec("dc-account", "", "<h2>" + esc(t("dossier.d4")) + "</h2>" + acct) +
      sec("dc-comm", "", "<h2>" + esc(t("dossier.d5")) + "</h2>" + comm) +
      sec("dc-cal", "", "<h2>" + esc(t("dossier.d6")) + "</h2>" +
        '<p class="muted measure">' + esc(L(x("Calendrier des actions promotionnelles, distinct du calendrier éditorial de contenus du plan.",
          "Calendario de acciones promocionales, distinto del calendario editorial de contenidos del plan.",
          "A calendar of promotional actions, distinct from the plan's editorial content calendar."))) + "</p>" + cal) +
      sec("dc-host", "", "<h2>" + esc(t("dossier.d7")) + "</h2>" + host) +
      sec("dc-log", "", "<h2>" + esc(t("dossier.d8")) + "</h2>" + log) +
      sec("dc-seo", "", "<h2>" + esc(t("dossier.d10")) + "</h2>" + seo);
  }

  function wire() { /* static section */ }

  return { view: view, wire: wire };
})();
