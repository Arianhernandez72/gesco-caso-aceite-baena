# AOP Baena — Web ecommerce (Caso GESCO, Comunicación y Omnicanalidad)

Tienda ecommerce ficticia del Aceite de Oliva de Baena (DOP) dirigida al mercado
francés, desarrollada como Anexo 1 del caso grupal GESCO "El turismo extranjero
en España, como instrumento de promoción de los alimentos y bebidas españoles"
(ESIC Business & Marketing School).

## Contenido

- `index.html` — página única con el shell de la tienda.
- `assets/app.js` — router, carrito, checkout, cuenta de cliente y lógica de la tienda.
- `assets/art.js` — sistema de ilustración/visuales del sitio (escenas, packshots, hero).
- `assets/data.js`, `assets/data2.js` — catálogo de productos, reseñas, contenidos del dossier.
- `assets/dossier.js` — sección "Dossier del caso" (CANVAS, árbol del sitio, formularios,
  logística, hosting, SEO) que cubre los apartados con asterisco del Anexo 1.
- `assets/i18n.js`, `assets/i18n2.js` — textos de interfaz en francés, español e inglés.
- `assets/styles.css` — sistema de diseño (paleta, tipografía, componentes).
- `assets/img/`, `assets/creatives/` — imágenes del sitio y creatividades de campaña.

## Cómo verlo

Es una página estática sin build: abrir `index.html` en un navegador, o servirlo
con cualquier servidor estático (`npx serve .`, Live Server de VS Code, etc.).

No requiere Node, npm ni dependencias de compilación.
