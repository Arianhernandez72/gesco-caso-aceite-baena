/* Product differentials, buying arguments and extra reviews for the redesigned shop. */
(function () {
  var D = window.DATA;
  var X = {
    classique: {
      icon: "drop",
      diff: { fr: "Coupage polyvalent, au quotidien", es: "Coupage polivalente, para cada día", en: "Versatile blend, for every day" },
      why: {
        fr: ["Le coupage historique de l'appellation : Picuda, Hojiblanca, Picual", "Assez de caractère pour le pain, assez d'équilibre pour le poisson", "Moulin et date de moulinage imprimés sur l'étiquette"],
        es: ["El coupage histórico de la denominación: Picuda, Hojiblanca, Picual", "Carácter para el pan, equilibrio para el pescado", "Almazara y fecha de molturación impresas en la etiqueta"],
        en: ["The appellation's historic blend: Picuda, Hojiblanca, Picual", "Enough character for bread, enough balance for fish", "Mill and milling date printed on the label"]
      }
    },
    premium: {
      icon: "trio",
      diff: { fr: "Trois variétés à comparer", es: "Tres variedades para comparar", en: "Three varieties to compare" },
      why: {
        fr: ["Trois monovariétaux d'un seul moulin chacun", "La dégustation guidée du moulin, reproduite chez vous", "Fiche de dégustation et roue des arômes incluses"],
        es: ["Tres monovarietales, cada uno de una sola almazara", "La cata guiada de la almazara, en tu casa", "Ficha de cata y rueda de aromas incluidas"],
        en: ["Three single-varietal oils, each from one mill", "The mill's guided tasting, at your table", "Tasting sheet and aroma wheel included"]
      }
    },
    cadeau: {
      icon: "gift",
      diff: { fr: "Prêt à offrir", es: "Listo para regalar", en: "Ready to give" },
      why: {
        fr: ["Bouteille, deux verres cobalt et carnet de vingt recettes", "Coffret kraft recyclé, message personnalisé offert", "Livré prêt à offrir, sans prix apparent"],
        es: ["Botella, dos vasitos cobalto y cuaderno de veinte recetas", "Caja kraft reciclada, mensaje personalizado gratis", "Llega lista para regalar, sin precio visible"],
        en: ["Bottle, two cobalt glasses and a twenty-recipe booklet", "Recycled kraft box, free personal message", "Arrives gift-ready, with no price showing"]
      }
    },
    bidon: {
      icon: "tin",
      diff: { fr: "Meilleur prix au litre", es: "Mejor precio por litro", en: "Best price per litre" },
      why: {
        fr: ["14,80 € le litre, contre 37,80 € en bouteille", "Le métal protège de la lumière et ne casse pas", "Bouchon verseur, environ quatre mois pour un foyer"],
        es: ["14,80 € el litro, frente a 37,80 € en botella", "El metal protege de la luz y no se rompe", "Tapón vertedor, unos cuatro meses para un hogar"],
        en: ["€14.80 a litre, against €37.80 in a bottle", "Metal keeps light out and never breaks", "Pouring cap, about four months for a household"]
      }
    },
    verres: {
      icon: "glass",
      diff: { fr: "Le verre des panels officiels", es: "El vaso de los paneles oficiales", en: "The official panel glass" },
      why: {
        fr: ["Verre cobalt normalisé : on juge l'huile sans sa couleur", "Couvercle pour concentrer les arômes", "Lot de deux, lavable au lave-vaisselle"],
        es: ["Vidrio cobalto normalizado: se juzga sin ver el color", "Tapa para concentrar los aromas", "Juego de dos, apto para lavavajillas"],
        en: ["Standard cobalt glass: judge oil without its colour", "Lid to concentrate the aromas", "Set of two, dishwasher safe"]
      }
    },
    carnet: {
      icon: "book",
      diff: { fr: "Vingt recettes andalouses", es: "Veinte recetas andaluzas", en: "Twenty Andalusian recipes" },
      why: {
        fr: ["Du salmorejo de Cordoue aux tartines d'apéritif", "Traduit en français, mesures métriques", "Imprimé sur papier recyclé"],
        es: ["Del salmorejo cordobés a las tostas de aperitivo", "Traducido al francés, medidas métricas", "Impreso en papel reciclado"],
        en: ["From Córdoba salmorejo to apéritif toasts", "Translated into French, metric measures", "Printed on recycled paper"]
      }
    }
  };
  D.products.concat(D.accessories).forEach(function (p) {
    var x = X[p.id]; if (!x) return;
    p.icon = x.icon; p.diff = x.diff; p.why = x.why;
    delete p.hero; delete p.gallery;
  });

  D.extraReviews = [
    { n: "Pierre & Anne V.", c: "Annecy", r: 5, p: "classique",
      t: { fr: "Découverte lors d'une dégustation à l'hôtel à Marbella. Le QR nous a permis de commander dès notre retour. Exactement le même goût.", es: "La descubrimos en una degustación del hotel en Marbella. El QR nos permitió pedirla al volver. El mismo sabor.", en: "Found at a hotel tasting in Marbella. The QR let us order as soon as we got home. Exactly the same taste." } },
    { n: "Laure F.", c: "Rennes", r: 5, p: "premium",
      t: { fr: "Offert à mon père, passionné de cuisine. Il a refait la dégustation trois fois pour trouver sa variété. C'est la Hojiblanca.", es: "Se lo regalé a mi padre, apasionado de la cocina. Repitió la cata tres veces para encontrar su variedad. Es la Hojiblanca.", en: "A gift for my dad, a keen cook. He redid the tasting three times to find his variety. It's the Hojiblanca." } },
    { n: "Karim B.", c: "Lille", r: 4, p: "bidon",
      t: { fr: "Bidon arrivé intact, bien plus pratique que six bouteilles. J'aurais aimé un format 3 L entre les deux.", es: "La lata llegó intacta, mucho más práctica que seis botellas. Me gustaría un formato de 3 L intermedio.", en: "The tin arrived intact, far handier than six bottles. I'd like a 3 L size in between." } },
    { n: "Élodie B.", c: "Paris · épicerie fine", r: 5, p: "classique",
      t: { fr: "Référencée en boutique depuis le printemps. Les clients reviennent pour la bouteille, et l'argumentaire AOP fait le reste.", es: "En mi tienda desde la primavera. Los clientes vuelven por la botella y el argumento DOP hace el resto.", en: "Stocked in my shop since spring. Customers come back for the bottle, and the PDO story does the rest." } }
  ];
})();
