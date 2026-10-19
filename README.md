# CIMED WEB — V2 pruebas

Proyecto independiente de Café Aurora.

## Fuente
- El primer commit conserva el `index.html` original de la V1 sin modificaciones.
- Las cinco subpáginas de la V2 se añadieron sin modificaciones en un commit propio (`Material-v2`, fuera del repositorio). Los ajustes técnicos están en commits posteriores y no alteran el diseño visual.
- El `index.html` de `Material-v2` (V1 original + sección añadida tras `</body>`) no se usa: los enlaces a las subpáginas se integraron en los bloques existentes de la V1.

## Estructura
```
index.html                                   Portada (vistas #cirugia-estetica, #medicina-estetica, #blog)
cirugia-estetica-rubi/cirugia-facial/        Cirugía facial
cirugia-estetica-rubi/cirugia-mamaria/       Cirugía mamaria
cirugia-estetica-rubi/cirugia-corporal/      Cirugía corporal
medicina-estetica-rubi/facial/               Medicina estética facial
medicina-regenerativa-rubi/                  Medicina regenerativa
```
Las rutas son relativas y con URLs limpias (carpeta + `index.html`). Para revisarlas en local hay que servir la carpeta (por ejemplo `python -m http.server`); abriendo los archivos con doble clic, los enlaces a carpetas muestran el listado de archivos.

## GitHub Pages
Repositorio: `jmarbot/cimed-web`, rama `main`, carpeta raíz.
URL de pruebas: https://jmarbot.github.io/cimed-web/

## Estado de la versión de pruebas (las 6 páginas)
- `<meta name="robots" content="noindex, nofollow">` en el `<head>`.
- Formularios desactivados: no envían, no recogen ni almacenan datos, y muestran un aviso visible.
- Botón «Capa SEO» oculto. Para revisarlo en desarrollo, añadir `?capa-seo` a la URL.
- Enlaces legales (privacidad, cookies, aviso legal) marcados como no operativos (`aria-disabled`).
- Contacto: WhatsApp y teléfono (+34 670 68 27 77), con enlace `tel:`.
- Medicina regenerativa: los botones de reserva en Doctoralia se sustituyeron provisionalmente por WhatsApp.
- Datos estructurados apuntando al dominio de pruebas `https://jmarbot.github.io/cimed-web/`.

## Antes de publicar en el dominio definitivo (centrosmc.com)
Requiere autorización explícita del usuario.
- [ ] **Retirar la línea `<meta name="robots" content="noindex, nofollow">`** del `<head>` de las 6 páginas.
- [ ] Sustituir `https://jmarbot.github.io/cimed-web/` por el dominio definitivo en los datos estructurados (JSON-LD) de las 6 páginas.
- [ ] Conectar los formularios a un canal seguro aprobado y revisado legalmente, retirar el aviso «Formulario no operativo» y quitar los `disabled`.
- [ ] Incorporar las páginas legales definitivas y quitar `aria-disabled` de sus enlaces.
- [ ] Decidir si la capa SEO se elimina del HTML de producción.
- [ ] Validar dirección (Carrer d’Antoni de Borja, 15, 08191 Rubí) y correo (info@institucioncimed.com), que solo aparecen en medicina regenerativa y están marcados como pendientes.
- [ ] Decidir si se recupera la reserva online (Doctoralia) con un enlace confirmado por el centro.
- [ ] Revisión médica de todas las páginas: nombre del revisor y fecha real de revisión (se retiraron las fechas provisionales).
- [ ] Confirmar el listado de intervenciones y tratamientos marcados «Pendiente de confirmar».
- [ ] Validar afirmaciones clínicas, legales y comerciales (presupuesto cerrado, seguimiento hasta el alta, regulación AEMPS del PRP, seguridad, contraindicaciones, normativa de publicidad sanitaria).
- [ ] Crear la página de medicina estética corporal (hoy sus enlaces llevan a la vista Medicina estética).
- [ ] Revisar textos provisionales de la portada: horario, perfiles médicos y nº de colegiado, fotografías, reseñas, especialidades y equipos, autor y fecha del blog, chip «Citas esta semana».
- [ ] Añadir favicon cuando el centro facilite el logotipo.
- [ ] Probar navegación, botones, móvil y accesibilidad en la URL de pruebas.
