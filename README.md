# CIMED WEB — V1 pruebas

Proyecto independiente de Café Aurora.

## Fuente
El primer commit del repositorio conserva el `index.html` original facilitado por el usuario, sin modificaciones. Los ajustes técnicos para GitHub Pages están en commits posteriores y no alteran el diseño visual.

## GitHub Pages
Repositorio: `jmarbot/cimed-web`, rama `main`, carpeta raíz.
URL de pruebas prevista: https://jmarbot.github.io/cimed-web/

## Estado de la versión de pruebas
- `<meta name="robots" content="noindex, nofollow">` en el `<head>`: la versión de pruebas no se indexa.
- Formulario desactivado: no envía, no recoge ni almacena datos, y muestra un aviso visible de que no está operativo.
- Botón «Capa SEO» oculto. Para revisarlo en desarrollo, abrir la página con `?capa-seo` (por ejemplo `index.html?capa-seo`).
- Enlaces legales (privacidad, cookies, aviso legal) marcados como no operativos (`aria-disabled`): no navegan hasta que existan las páginas.
- WhatsApp y teléfono (+34 670 68 27 77) son reales y funcionales.

## Antes de publicar en el dominio definitivo (centrosmc.com)
Requiere autorización explícita del usuario.
- [ ] **Retirar la línea `<meta name="robots" content="noindex, nofollow">`** del `<head>`.
- [ ] Conectar el formulario a un canal seguro aprobado, retirar el aviso «Formulario no operativo» y quitar los `disabled`.
- [ ] Incorporar las páginas legales definitivas y quitar `aria-disabled` de sus enlaces.
- [ ] Sustituir `cimed.example` en los datos estructurados (JSON-LD) por el dominio definitivo.
- [ ] Decidir si la capa SEO se elimina del HTML de producción.
- [ ] Revisar textos provisionales: dirección, horario, perfiles médicos y nº de colegiado, fotografías, reseñas, listado de especialidades y equipos, revisor y autor del blog, chip «Citas esta semana» y fechas.
- [ ] Añadir favicon cuando el centro facilite el logotipo.
- [ ] Probar navegación, botones, móvil y accesibilidad en la URL de pruebas.
