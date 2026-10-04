/* Catalogue, reviews and dossier content. Every string carries fr / es / en. */
window.DATA = (function () {
  var IMG = "assets/img/";

  var products = [
    {
      id: "classique",
      sku: "AOP-BAE-CL-500",
      price: 18.9,
      unit: { fr: "500 ml", es: "500 ml", en: "500 ml" },
      perLitre: 37.8,
      hero: IMG + "bottle-olives.jpg",
      gallery: ["bottle-olives.jpg", "pouring.jpg", "grove.jpg"],
      rating: 4.8,
      count: 126,
      stock: 240,
      flag: { fr: "Le plus vendu", es: "Más vendido", en: "Best seller" },
      name: { fr: "Sélection Classique", es: "Selección Clásica", en: "Classic Selection" },
      tagline: {
        fr: "Le coupage traditionnel de l'AOP, celui qu'on verse tous les jours.",
        es: "El coupage tradicional de la DOP, el de todos los días.",
        en: "The appellation's traditional blend — the one you pour every day."
      },
      desc: {
        fr: "Un assemblage de Picuda, Hojiblanca et Picual récolté en début de campagne et moulu à froid le jour même. C'est l'huile de table de Baena : assez de caractère pour tenir seule sur du pain, assez d'équilibre pour ne pas écraser un poisson ou une salade.",
        es: "Un coupage de Picuda, Hojiblanca y Picual recogido al inicio de campaña y molturado en frío el mismo día. Es el aceite de mesa de Baena: con carácter suficiente para sostenerse solo sobre el pan y con el equilibrio necesario para no tapar un pescado o una ensalada.",
        en: "A blend of Picuda, Hojiblanca and Picual picked early in the season and cold-milled the same day. This is Baena's everyday oil: enough character to hold its own on bread, enough balance to leave fish or a salad alone."
      },
      notes: {
        fr: "Fruité vert, tomate et herbe coupée. Amertume moyenne, final légèrement piquant et amande douce.",
        es: "Frutado verde, tomatera y hierba recién cortada. Amargor medio, final ligeramente picante y almendra dulce.",
        en: "Green fruitiness, tomato leaf and cut grass. Medium bitterness, lightly peppery finish, sweet almond."
      },
      use: {
        fr: "Crudités, salades, poissons au four, salmorejo, tartines du matin.",
        es: "Crudités, ensaladas, pescados al horno, salmorejo, tostadas del desayuno.",
        en: "Raw vegetables, salads, baked fish, salmorejo, morning toast."
      },
      varieties: "Picuda 60% · Hojiblanca 25% · Picual 15%",
      acidity: "0,18°",
      harvest: { fr: "Récolte précoce, novembre", es: "Cosecha temprana, noviembre", en: "Early harvest, November" }
    },
    {
      id: "premium",
      sku: "AOP-BAE-PR-3x250",
      price: 42.0,
      unit: { fr: "3 × 250 ml", es: "3 × 250 ml", en: "3 × 250 ml" },
      perLitre: 56.0,
      hero: IMG + "varieties.jpg",
      gallery: ["varieties.jpg", "olives-picuda.jpg", "bowl-pour.jpg"],
      rating: 4.9,
      count: 68,
      stock: 90,
      flag: { fr: "Monovariétaux", es: "Monovarietales", en: "Single varietal" },
      name: { fr: "Coffret Dégustation Premium", es: "Estuche Cata Premium", en: "Premium Tasting Box" },
      tagline: {
        fr: "Trois monovariétaux pour comprendre ce que change une variété d'olive.",
        es: "Tres monovarietales para entender qué cambia una variedad de aceituna.",
        en: "Three single-varietal oils that show what the olive variety actually changes."
      },
      desc: {
        fr: "Picuda, Hojiblanca et Picual embouteillées séparément, chacune issue d'un seul moulin de l'appellation. Le coffret reprend la dégustation guidée proposée au moulin : on goûte dans l'ordre, du plus doux au plus amer, et la différence est immédiate. Fiche de dégustation et grille d'arômes incluses.",
        es: "Picuda, Hojiblanca y Picual embotelladas por separado, cada una de una sola almazara de la denominación. El estuche reproduce la cata guiada de la almazara: se prueban en orden, de la más suave a la más amarga, y la diferencia se nota de inmediato. Incluye ficha de cata y rueda de aromas.",
        en: "Picuda, Hojiblanca and Picual bottled separately, each from a single mill within the appellation. The box recreates the guided tasting held at the mill: taste them in order, mildest to most bitter, and the difference is immediate. Tasting sheet and aroma wheel included."
      },
      notes: {
        fr: "Picuda : pomme verte et amande. Hojiblanca : artichaut et fruits secs. Picual : tomate verte, amertume franche.",
        es: "Picuda: manzana verde y almendra. Hojiblanca: alcachofa y frutos secos. Picual: tomatera y amargor franco.",
        en: "Picuda: green apple and almond. Hojiblanca: artichoke and nuts. Picual: green tomato, clean bitterness."
      },
      use: {
        fr: "Dégustation à la cuillère, fromages de chèvre, burrata, cadeau gastronomique.",
        es: "Cata a cuchara, quesos de cabra, burrata, regalo gastronómico.",
        en: "Spoon tasting, goat cheese, burrata, a gift for someone who cooks."
      },
      varieties: "Picuda · Hojiblanca · Picual",
      acidity: "0,14° – 0,21°",
      harvest: { fr: "Récolte précoce, novembre", es: "Cosecha temprana, noviembre", en: "Early harvest, November" }
    },
    {
      id: "cadeau",
      sku: "AOP-BAE-CA-SET",
      price: 34.5,
      unit: { fr: "500 ml + accessoires", es: "500 ml + accesorios", en: "500 ml + accessories" },
      perLitre: null,
      hero: IMG + "bottle-stone.jpg",
      gallery: ["bottle-stone.jpg", "bottle-cloth.jpg", "table-bread.jpg"],
      rating: 4.7,
      count: 54,
      stock: 120,
      flag: { fr: "Prêt à offrir", es: "Listo para regalar", en: "Gift ready" },
      name: { fr: "Coffret Cadeau", es: "Kit de Regalo", en: "Gift Set" },
      tagline: {
        fr: "La bouteille, deux verres de dégustation et le carnet de recettes.",
        es: "La botella, dos vasitos de cata y el cuaderno de recetas.",
        en: "The bottle, two tasting glasses and the recipe book."
      },
      desc: {
        fr: "La Sélection Classique accompagnée de deux verres de dégustation bleu cobalt — ceux qu'utilisent les panels officiels pour ne pas juger une huile sur sa couleur — et d'un carnet de vingt recettes andalouses traduites en français. Emballage en carton recyclé, message personnalisable à la commande.",
        es: "La Selección Clásica acompañada de dos vasitos de cata azul cobalto —los que usan los paneles oficiales para no juzgar un aceite por su color— y un cuaderno de veinte recetas andaluzas traducidas al francés. Embalaje de cartón reciclado y mensaje personalizable en el pedido.",
        en: "The Classic Selection with two cobalt-blue tasting glasses — the ones official panels use so the oil is not judged by its colour — and a booklet of twenty Andalusian recipes translated into French. Recycled card packaging, personal message at checkout."
      },
      notes: {
        fr: "Même huile que la Sélection Classique : fruité vert, amertume moyenne, final amande.",
        es: "El mismo aceite que la Selección Clásica: frutado verde, amargor medio, final de almendra.",
        en: "Same oil as the Classic Selection: green fruitiness, medium bitterness, almond finish."
      },
      use: {
        fr: "Noël, crémaillère, remerciement professionnel, retour de voyage.",
        es: "Navidad, inauguración de casa, agradecimiento profesional, vuelta de viaje.",
        en: "Christmas, housewarming, a professional thank-you, back from a trip."
      },
      varieties: "Picuda 60% · Hojiblanca 25% · Picual 15%",
      acidity: "0,18°",
      harvest: { fr: "Récolte précoce, novembre", es: "Cosecha temprana, noviembre", en: "Early harvest, November" }
    },
    {
      id: "bidon",
      sku: "AOP-BAE-BI-5L",
      price: 74.0,
      unit: { fr: "Bidon 5 L", es: "Lata 5 L", en: "5 L tin" },
      perLitre: 14.8,
      hero: IMG + "bottle-field.jpg",
      gallery: ["bottle-field.jpg", "grove-wide.jpg", "chef-plate.jpg"],
      rating: 4.9,
      count: 41,
      stock: 60,
      flag: { fr: "Format maison", es: "Formato hogar", en: "Household format" },
      name: { fr: "Bidon 5 L", es: "Lata 5 L", en: "5 L Tin" },
      tagline: {
        fr: "Le même coupage, en métal : meilleur prix au litre et zéro casse au transport.",
        es: "El mismo coupage, en metal: mejor precio por litro y cero roturas en el transporte.",
        en: "The same blend in metal: better price per litre and nothing to break in transit."
      },
      desc: {
        fr: "Pour les foyers qui cuisinent à l'huile d'olive toute l'année et pour les professionnels en petit volume. Le fer-blanc protège l'huile de la lumière mieux que le verre et supprime le risque de casse, le point faible de l'expédition vers la France. Bouchon verseur et date de moulinage imprimée sur le fond.",
        es: "Para hogares que cocinan con aceite de oliva todo el año y para profesionales de pequeño volumen. La hojalata protege el aceite de la luz mejor que el vidrio y elimina el riesgo de rotura, el punto débil del envío a Francia. Tapón vertedor y fecha de molturación impresa en la base.",
        en: "For households that cook with olive oil all year and for small-volume professionals. Tinplate shields the oil from light better than glass and removes the breakage risk that is the weak point of shipping to France. Pouring cap, milling date printed on the base."
      },
      notes: {
        fr: "Fruité vert, tomate et herbe coupée. Amertume moyenne, final légèrement piquant.",
        es: "Frutado verde, tomatera y hierba cortada. Amargor medio, final ligeramente picante.",
        en: "Green fruitiness, tomato leaf and cut grass. Medium bitterness, lightly peppery finish."
      },
      use: {
        fr: "Cuisine quotidienne, friture douce, conserves maison, petite restauration.",
        es: "Cocina diaria, fritura suave, conservas caseras, pequeña restauración.",
        en: "Everyday cooking, gentle frying, home preserving, small kitchens."
      },
      varieties: "Picuda 60% · Hojiblanca 25% · Picual 15%",
      acidity: "0,18°",
      harvest: { fr: "Récolte précoce, novembre", es: "Cosecha temprana, noviembre", en: "Early harvest, November" }
    }
  ];

  var accessories = [
    {
      id: "verres",
      sku: "AOP-BAE-AC-VER",
      price: 14.0,
      hero: IMG + "bowl-pour.jpg",
      name: { fr: "Verres de dégustation (×2)", es: "Vasitos de cata (×2)", en: "Tasting glasses (×2)" },
      tagline: {
        fr: "Verre cobalt normalisé, celui des panels officiels.",
        es: "Vidrio cobalto normalizado, el de los paneles oficiales.",
        en: "Standard cobalt glass, as used by official panels."
      }
    },
    {
      id: "carnet",
      sku: "AOP-BAE-AC-CAR",
      price: 9.5,
      hero: IMG + "table-bread.jpg",
      name: { fr: "Carnet de recettes andalouses", es: "Cuaderno de recetas andaluzas", en: "Andalusian recipe book" },
      tagline: {
        fr: "Vingt recettes, du salmorejo aux tartines d'apéritif.",
        es: "Veinte recetas, del salmorejo a las tostas de aperitivo.",
        en: "Twenty recipes, from salmorejo to apéritif toasts."
      }
    }
  ];

  var reviews = {
    classique: [
      {
        n: "Marie L.", c: "Lyon", r: 5, d: "2026-02-14",
        t: {
          fr: "Nous avons visité le moulin en octobre pendant notre séjour en Andalousie. De retour à Lyon, c'est la seule huile que mon mari accepte sur ses tomates. La bouteille est arrivée en quatre jours, bien calée.",
          es: "Visitamos la almazara en octubre durante nuestro viaje por Andalucía. De vuelta en Lyon, es el único aceite que mi marido acepta en sus tomates. La botella llegó en cuatro días, bien protegida.",
          en: "We visited the mill in October during our trip through Andalusia. Back in Lyon, this is the only oil my husband will have on his tomatoes. The bottle arrived in four days, well packed."
        }
      },
      {
        n: "Thomas B.", c: "Nantes", r: 5, d: "2026-01-29",
        t: {
          fr: "Je cherchais une huile dont je puisse lire l'origine sur l'étiquette, pas un assemblage européen anonyme. Ici le moulin est nommé et la date de moulinage est imprimée. Ça change tout.",
          es: "Buscaba un aceite cuyo origen pudiera leer en la etiqueta, no una mezcla europea anónima. Aquí aparece la almazara y la fecha de molturación. Eso lo cambia todo.",
          en: "I wanted an oil whose origin I could read on the label, not an anonymous European blend. Here the mill is named and the milling date is printed. That changes everything."
        }
      },
      {
        n: "Sylvie M.", c: "Bordeaux", r: 4, d: "2025-12-08",
        t: {
          fr: "Très bon rapport qualité-prix. Un peu plus amère que l'huile que j'achetais avant, mais c'est justement ce que je voulais. Je reprends le bidon la prochaine fois.",
          es: "Muy buena relación calidad-precio. Algo más amarga que el aceite que compraba antes, pero es justo lo que quería. La próxima vez me llevo la lata.",
          en: "Very good value. A little more bitter than the oil I used to buy, but that is exactly what I wanted. Next time I am taking the tin."
        }
      }
    ],
    premium: [
      {
        n: "Camille D.", c: "Paris", r: 5, d: "2026-03-02",
        t: {
          fr: "J'ai filmé la dégustation pour mes abonnés et la Picuda a fait l'unanimité. Le coffret est beau sans en faire trop, et la fiche de dégustation aide vraiment à mettre des mots sur ce qu'on goûte.",
          es: "Grabé la cata para mis seguidores y la Picuda gustó por unanimidad. El estuche es bonito sin excederse, y la ficha de cata ayuda de verdad a poner palabras a lo que pruebas.",
          en: "I filmed the tasting for my followers and the Picuda won unanimously. The box is beautiful without trying too hard, and the tasting sheet genuinely helps you name what you taste."
        }
      },
      {
        n: "Julien M.", c: "Lyon", r: 5, d: "2026-01-11",
        t: {
          fr: "Chef de cuisine. J'ai pris le coffret pour faire goûter mon équipe à l'aveugle. Trois huiles, trois usages différents en cuisine. La Picual part sur les légumes rôtis, la Picuda en finition.",
          es: "Jefe de cocina. Compré el estuche para hacer una cata a ciegas con mi equipo. Tres aceites, tres usos distintos. La Picual va a las verduras asadas; la Picuda, al acabado.",
          en: "Head chef. I bought the box for a blind tasting with my team. Three oils, three different jobs in the kitchen. The Picual goes on roast vegetables, the Picuda for finishing."
        }
      }
    ],
    cadeau: [
      {
        n: "Hélène P.", c: "Strasbourg", r: 5, d: "2025-12-21",
        t: {
          fr: "Offert à mes parents pour Noël avec le message personnalisé. Emballage soigné, rien de cassé, et le carnet de recettes a été la bonne surprise.",
          es: "Regalado a mis padres en Navidad con el mensaje personalizado. Embalaje cuidado, nada roto, y el cuaderno de recetas fue la sorpresa.",
          en: "Given to my parents at Christmas with the personal message. Careful packaging, nothing broken, and the recipe book was the nice surprise."
        }
      },
      {
        n: "Antoine R.", c: "Marseille", r: 4, d: "2026-02-03",
        t: {
          fr: "Les verres bleus sont une excellente idée, je ne savais pas qu'on jugeait une huile sans en voir la couleur. Livraison conforme, trois jours.",
          es: "Los vasitos azules son una gran idea, no sabía que un aceite se juzga sin ver su color. Entrega correcta, tres días.",
          en: "The blue glasses are a great idea — I had no idea oil is judged without seeing its colour. Delivery as promised, three days."
        }
      }
    ],
    bidon: [
      {
        n: "Nathalie G.", c: "Toulouse", r: 5, d: "2026-02-19",
        t: {
          fr: "On cuisine à l'huile d'olive tous les jours, le bidon dure environ quatre mois chez nous. Prix au litre imbattable pour une AOP et aucun souci de casse.",
          es: "Cocinamos con aceite de oliva a diario; la lata nos dura unos cuatro meses. Precio por litro imbatible para una DOP y ningún problema de rotura.",
          en: "We cook with olive oil every day — the tin lasts us about four months. Unbeatable price per litre for a protected origin, and no breakage worries."
        }
      }
    ]
  };

  /* Content pillars — section 6.1.3 of the case document. */
  var pillars = [
    {
      k: "p1",
      t: { fr: "Choisir une huile d'olive de qualité", es: "Elegir un aceite de oliva de calidad", en: "Choosing a good olive oil" },
      a: {
        fr: ["Comment reconnaître une huile d'olive vierge extra de qualité ?", "Huile vierge, vierge extra ou raffinée : quelles différences ?", "Pourquoi l'amertume et le piquant sont-ils importants ?", "Comment conserver son huile d'olive après ouverture ?", "5 erreurs fréquentes quand on achète de l'huile d'olive."],
        es: ["Cómo reconocer un virgen extra de calidad", "Virgen, virgen extra o refinado: diferencias", "Por qué el amargor y el picante importan", "Cómo conservar el aceite una vez abierto", "5 errores frecuentes al comprar aceite"],
        en: ["How to recognise a quality extra virgin olive oil", "Virgin, extra virgin or refined: the differences", "Why bitterness and pungency matter", "Storing olive oil once opened", "5 common mistakes when buying olive oil"]
      }
    },
    {
      k: "p2",
      t: { fr: "Baena et l'Andalousie", es: "Baena y Andalucía", en: "Baena and Andalusia" },
      a: {
        fr: ["Baena : un terroir d'huile d'olive au cœur de l'Andalousie.", "La Picuda, l'olive emblématique de Baena.", "Du verger au moulin : comment naît une huile AOP Baena ?", "Que visiter à Baena autour de l'huile d'olive ?", "Pourquoi Baena possède-t-elle autant de variétés d'olives ?"],
        es: ["Baena: un terruño de aceite en el corazón de Andalucía", "La Picuda, la aceituna emblemática de Baena", "Del olivar a la almazara: cómo nace un AOVE DOP Baena", "Qué visitar en Baena en torno al aceite", "Por qué Baena tiene tantas variedades de aceituna"],
        en: ["Baena: an olive oil terroir in the heart of Andalusia", "Picuda, the olive that defines Baena", "From grove to mill: how a DOP Baena oil is made", "What to visit in Baena around olive oil", "Why Baena has so many olive varieties"]
      }
    },
    {
      k: "p3",
      t: { fr: "Gastronomie française et méditerranéenne", es: "Gastronomía francesa y mediterránea", en: "French and Mediterranean cooking" },
      a: {
        fr: ["Huile d'olive et cuisine française : 7 accords à découvrir.", "Quelle huile d'olive choisir pour un fromage de chèvre ?", "Huile d'olive, tomates et herbes : le goût du Sud dans l'assiette.", "Comment utiliser une huile premium sans la masquer ?", "Cuisine française et cuisine andalouse : des produits qui se rencontrent."],
        es: ["Aceite y cocina francesa: 7 maridajes", "Qué aceite elegir para un queso de cabra", "Aceite, tomate y hierbas: el sabor del sur", "Cómo usar un aceite premium sin taparlo", "Cocina francesa y andaluza: productos que se encuentran"],
        en: ["Olive oil and French cooking: 7 pairings", "Which olive oil for goat cheese?", "Oil, tomatoes and herbs: the taste of the South", "Using a premium oil without masking it", "French and Andalusian cooking: where they meet"]
      }
    },
    {
      k: "p4",
      t: { fr: "Alimentation et style méditerranéen", es: "Alimentación y estilo mediterráneo", en: "Mediterranean eating" },
      a: {
        fr: ["Qu'est-ce que le régime méditerranéen ?", "Quelle place occupe l'huile d'olive dans l'alimentation méditerranéenne ?", "Polyphénols et huile d'olive : que faut-il réellement savoir ?", "Huile d'olive au quotidien : quantité, conservation et usages.", "Mieux manger sans renoncer au plaisir."],
        es: ["Qué es la dieta mediterránea", "Qué lugar ocupa el aceite en la dieta mediterránea", "Polifenoles y aceite: qué conviene saber", "Aceite a diario: cantidad, conservación y usos", "Comer mejor sin renunciar al placer"],
        en: ["What the Mediterranean diet actually is", "Olive oil's place in Mediterranean eating", "Polyphenols and olive oil: what is worth knowing", "Olive oil day to day: quantity, storage, uses", "Eating better without giving up pleasure"]
      }
    },
    {
      k: "p5",
      t: { fr: "Durabilité, origine et traçabilité", es: "Sostenibilidad, origen y trazabilidad", en: "Sustainability, origin and traceability" },
      a: {
        fr: ["Pourquoi connaître l'origine de son huile d'olive ?", "De l'olivier à la bouteille : comprendre la traçabilité.", "Verre ou métal : quel emballage choisir ?", "Terroir, producteurs et savoir-faire : ce que protège une AOP.", "Comment consommer une huile d'olive de façon plus responsable ?"],
        es: ["Por qué conocer el origen de tu aceite", "Del olivo a la botella: entender la trazabilidad", "Vidrio o metal: qué envase elegir", "Terruño, productores y saber hacer: qué protege una DOP", "Cómo consumir aceite de forma más responsable"],
        en: ["Why knowing your oil's origin matters", "From tree to bottle: understanding traceability", "Glass or metal: which packaging to choose", "Terroir, growers and know-how: what a PDO protects", "Consuming olive oil more responsibly"]
      }
    },
    {
      k: "p6",
      t: { fr: "Recettes", es: "Recetas", en: "Recipes" },
      a: {
        fr: ["Vinaigrette méditerranéenne à l'huile d'olive AOP Baena.", "Tomates rôties, chèvre et huile d'olive andalouse.", "Poisson au four, citron et huile d'olive vierge extra.", "Tartines méditerranéennes pour l'apéritif.", "Salmorejo de Cordoue : la recette andalouse originale."],
        es: ["Vinagreta mediterránea con AOVE DOP Baena", "Tomates asados, queso de cabra y aceite andaluz", "Pescado al horno, limón y virgen extra", "Tostas mediterráneas de aperitivo", "Salmorejo cordobés: la receta original"],
        en: ["Mediterranean vinaigrette with DOP Baena oil", "Roast tomatoes, goat cheese and Andalusian oil", "Baked fish, lemon and extra virgin olive oil", "Mediterranean toasts for the apéritif", "Córdoba salmorejo: the original recipe"]
      }
    },
    {
      k: "p7",
      t: { fr: "AOP et qualité certifiée", es: "DOP y calidad certificada", en: "PDO and certified quality" },
      a: {
        fr: ["AOP : que garantit réellement ce label européen ?", "AOP, IGP, bio : quelles différences ?", "Pourquoi l'origine change-t-elle le goût d'une huile d'olive ?", "Comment reconnaître le logo AOP sur un produit ?", "AOP Baena : quand terroir, variété et savoir-faire se rencontrent."],
        es: ["DOP: qué garantiza realmente este sello europeo", "DOP, IGP y ecológico: diferencias", "Por qué el origen cambia el sabor de un aceite", "Cómo reconocer el logo DOP en un producto", "DOP Baena: terruño, variedad y saber hacer"],
        en: ["PDO: what the European label actually guarantees", "PDO, PGI and organic: the differences", "Why origin changes how an olive oil tastes", "Spotting the PDO logo on a product", "DOP Baena: terroir, variety and know-how"]
      }
    }
  ];

  /* Promotional calendar — the Annex asks for promotional actions, not content topics. */
  var promoCal = [
    { m: { fr: "Janvier", es: "Enero", en: "January" }, t: { fr: "Bonnes résolutions", es: "Propósitos de año nuevo", en: "New year resolutions" }, d: { fr: "−15 % sur le Bidon 5 L, le format de la cuisine quotidienne. Guide « cuisiner méditerranéen » offert.", es: "−15 % en la Lata 5 L, el formato del día a día. Guía «cocinar mediterráneo» de regalo.", en: "15% off the 5 L tin, the everyday format. Free Mediterranean cooking guide." } },
    { m: { fr: "Février", es: "Febrero", en: "February" }, t: { fr: "Relance post-fêtes", es: "Reactivación tras fiestas", en: "Post-holiday re-engagement" }, d: { fr: "Rappel de réachat aux acheteurs de novembre : port offert dès 45 €.", es: "Recordatorio de recompra a los compradores de noviembre: envío gratis desde 45 €.", en: "Repurchase reminder to November buyers: free shipping from €45." } },
    { m: { fr: "Mars", es: "Marzo", en: "March" }, t: { fr: "Parrainage", es: "Member get member", en: "Member gets member" }, d: { fr: "10 € pour le parrain et 10 € pour le filleul, cumulables sur trois parrainages.", es: "10 € para el padrino y 10 € para el ahijado, acumulables en tres referidos.", en: "€10 for the referrer and €10 for the friend, stacking across three referrals." } },
    { m: { fr: "Avril", es: "Abril", en: "April" }, t: { fr: "Pâques", es: "Semana Santa", en: "Easter" }, d: { fr: "Coffret Cadeau en précommande avec message personnalisé offert.", es: "Kit de Regalo en preventa con mensaje personalizado gratis.", en: "Gift Set pre-order with a free personal message." } },
    { m: { fr: "Mai", es: "Mayo", en: "May" }, t: { fr: "Avant le départ", es: "Antes del viaje", en: "Before the trip" }, d: { fr: "Campagne « réservez votre visite au moulin » : code de 10 % remis sur place après la dégustation.", es: "Campaña «reserva tu visita a la almazara»: código del 10 % entregado tras la cata.", en: "Book-your-mill-visit campaign: a 10% code handed over after the tasting." } },
    { m: { fr: "Juin", es: "Junio", en: "June" }, t: { fr: "Apéritif d'été", es: "Aperitivo de verano", en: "Summer apéritif" }, d: { fr: "Pack apéro : Sélection Classique + verres de dégustation à prix groupé.", es: "Pack aperitivo: Selección Clásica + vasitos de cata a precio conjunto.", en: "Apéro pack: Classic Selection plus tasting glasses at a bundle price." } },
    { m: { fr: "Juillet", es: "Julio", en: "July" }, t: { fr: "Captation en destination", es: "Captación en destino", en: "Capture in destination" }, d: { fr: "QR en dégustation d'hôtel et à l'aéroport : −10 % sur la première commande livrée en France.", es: "QR en degustaciones de hotel y aeropuerto: −10 % en el primer pedido a Francia.", en: "QR at hotel tastings and the airport: 10% off the first order delivered in France." } },
    { m: { fr: "Août", es: "Agosto", en: "August" }, t: { fr: "Souvenir de voyage", es: "Recuerdo del viaje", en: "Holiday memory" }, d: { fr: "Remarketing sur les leads de juillet : port offert sans minimum pendant dix jours.", es: "Remarketing sobre los leads de julio: envío gratis sin mínimo durante diez días.", en: "Remarketing to July leads: free shipping with no minimum for ten days." } },
    { m: { fr: "Septembre", es: "Septiembre", en: "September" }, t: { fr: "Rentrée", es: "Vuelta a la rutina", en: "Back to routine" }, d: { fr: "Abonnement trimestriel : −8 % permanents et livraison calée sur 90 jours de consommation.", es: "Suscripción trimestral: −8 % permanente y entrega ajustada a 90 días de consumo.", en: "Quarterly subscription: a standing 8% off, delivery timed to 90 days of use." } },
    { m: { fr: "Octobre", es: "Octubre", en: "October" }, t: { fr: "Semaine du Goût", es: "Semana del Gusto", en: "Semaine du Goût" }, d: { fr: "Coffret Dégustation mis en avant, atelier de cata en ligne gratuit pour les acheteurs.", es: "Estuche de Cata destacado y taller de cata online gratuito para compradores.", en: "Tasting Box in the spotlight, free online tasting workshop for buyers." } },
    { m: { fr: "Novembre", es: "Noviembre", en: "November" }, t: { fr: "Nouvelle récolte + Black Friday", es: "Nueva cosecha + Black Friday", en: "New harvest + Black Friday" }, d: { fr: "Accès anticipé à l'huile nouvelle pour les abonnés, puis bundle Classique + Coffret à −20 %.", es: "Acceso anticipado al aceite nuevo para suscriptores y bundle Clásica + Estuche al −20 %.", en: "Early access to the new oil for subscribers, then a Classic + Box bundle at 20% off." } },
    { m: { fr: "Décembre", es: "Diciembre", en: "December" }, t: { fr: "Noël", es: "Navidad", en: "Christmas" }, d: { fr: "Coffrets en avant, emballage de saison offert, date limite de commande affichée au 19.", es: "Estuches destacados, envoltorio de temporada gratis y fecha límite de pedido visible el 19.", en: "Gift boxes featured, seasonal wrap free, order cut-off shown as the 19th." } }
  ];

  return { products: products, accessories: accessories, reviews: reviews, pillars: pillars, promoCal: promoCal };
})();
