# AOP Baena — Web ecommerce (Caso GESCO, Comunicación y Omnicanalidad)

Tienda ecommerce ficticia del Aceite de Oliva de Baena (DOP) dirigida al mercado
francés, desarrollada como Anexo 1 del caso grupal GESCO "El turismo extranjero
en España, como instrumento de promoción de los alimentos y bebidas españoles"
(ESIC Business & Marketing School).

## Contenido

- `index.html` — página única con el shell de la tienda.
- `assets/app.js` — router, carrito, checkout, cuenta de cliente y lógica de la tienda.
- `assets/art.js` — iconos, logotipo e ilustración vectorial (diagramas, variedades, recetas).
- `assets/photo.js` — portada con fotografía realista; packshots y escenas renderizadas en 3D.
- `assets/data.js`, `assets/data2.js` — catálogo de productos, reseñas, contenidos del dossier.
- `assets/dossier.js` — sección "Dossier del caso" (CANVAS, árbol del sitio, formularios,
  logística, hosting, SEO) que cubre los apartados con asterisco del Anexo 1.
- `assets/config.js` — dirección del script de Google que guarda los formularios en Google Sheets.
- `google-apps-script/Code.gs` — script para pegar en la hoja de cálculo (recibe los formularios).
- `assets/i18n.js`, `assets/i18n2.js` — textos de interfaz en francés, español e inglés.
- `assets/styles.css` — sistema de diseño (paleta, tipografía, componentes).
- `assets/photo/` — portada (`hero.jpg` para escritorio, `hero-m.jpg` para móvil: la botella
  en una terraza frente a un pueblo blanco y el olivar andaluz), seis fotos de producto
  (`p-*.jpg`) y las ocho fases del proceso, renderizadas con un estudio 3D propio (three.js),
  con dos fotogramas por fase que la página funde entre sí según avanza el scroll.

## Cómo verlo

Es una página estática sin build: abrir `index.html` en un navegador, o servirlo
con cualquier servidor estático (`npx serve .`, Live Server de VS Code, etc.).

No requiere Node, npm ni dependencias de compilación.

## Publicarla en GitHub Pages

1. En GitHub, abre el repositorio → **Settings** → **Pages**.
2. En **Source** elige **Deploy from a branch**; en **Branch**, la rama con la web
   (`claude/elegant-sagan-nyd51s`, o `main` cuando la fusiones) y la carpeta `/ (root)`. Pulsa **Save**.
3. En uno o dos minutos la web queda en `https://arianhernandez72.github.io/gesco-caso-aceite-baena/`.

GitHub Pages gratuito solo funciona con repositorios públicos.

## Guardar los formularios en Google Sheets

Los formularios (newsletter, visita al molino, alta de cuenta, espacio pro, contacto y la
casilla de novedades del checkout) envían cada respuesta como una fila a una hoja de Google.
Nunca se envían contraseñas ni datos de tarjeta.

1. Crea una hoja de cálculo nueva en Google Sheets (por ejemplo, «AOP Baena – formularios»).
2. En la hoja: **Extensiones** → **Apps Script**. Borra lo que aparezca, pega el contenido de
   `google-apps-script/Code.gs` y guarda.
3. **Implementar** → **Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
   Pulsa **Implementar**, autoriza el acceso con tu cuenta de Google y copia la **URL de la
   aplicación web** (termina en `/exec`).
4. Pega esa URL en `assets/config.js`, entre las comillas de `window.AOP_SHEETS_URL = "";`,
   y sube el cambio a la rama publicada.

Las respuestas aparecen en la pestaña **Formularios** de la hoja (se crea sola con la primera).
Si más adelante cambias el script, usa **Implementar** → **Gestionar implementaciones** → editar
→ **Nueva versión**, para que la URL siga siendo la misma.

