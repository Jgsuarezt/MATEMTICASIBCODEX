# Captación y visibilidad de Matemáticas IB

## Qué se implementó

- Oferta visible: AA y AI, SL y HL, Gabriel Suárez, virtual y Quito, $20 USD por 60 minutos.
- Consulta guiada por asignatura, modalidad y objetivo; mensajes de WhatsApp preparados sin enviar automáticamente.
- Acceso fijo a contacto en móvil y preselección desde páginas de servicio.
- Páginas sustantivas de modalidad online, asesoría de IA y comparación AA/AI. Enlaces internos y explicaciones breves que pueden entenderse sin ejecutar JavaScript.
- Canonical a `https://matematicasib.com/`, títulos y descripciones únicos, vista previa social, favicon, breadcrumbs y JSON-LD de persona, organización, servicios y FAQ visibles. No se simulan reseñas ni estrellas de resultados.
- Sitemap con las 13 páginas, robots abierto a rastreo incluido OAI-SearchBot, rutas canónicas sin extensión y redirecciones permanentes de las antiguas `.html`.
- `llms.txt` como índice opcional de información pública. No es un requisito de Google ni garantiza que ChatGPT u otro asistente cite el sitio.
- GitHub Pages y previews de Netlify con `noindex` para que no compitan con el dominio principal. La configuración de producción permite indexar.
- Carga diferida de imágenes no prioritarias y scripts; no se necesitan librerías ni fuentes externas.
- Eventos de intención de contacto y conservación de parámetros UTM de campaña durante la sesión. No hay un proveedor de analítica instalado ni un panel de resultados. No se almacenan nombres ni mensajes del formulario en estos eventos.
- Las reseñas heredadas se conservaron en `notes/testimonios-para-verificar.html`, excluidas del paquete publicado, a la espera de enlaces de origen y autorización para publicarlas. También se retiraron la puntuación agregada 5/5 con 24 reseñas y las promesas de nota no verificables.

## Publicación (pendiente del propietario)

1. Publicar el contenido del ZIP en el sitio de Netlify que sirva `matematicasib.com`; mantener ese como dominio principal con HTTPS y redirigir el hostname alternativo desde la configuración de dominio de Netlify. No mover el dominio a otro sitio por accidente. La redirección a hostname principal depende de la configuración DNS/Netlify, no del ZIP.
2. Si se quiere publicar en otro dominio definitivo, cambiar de forma coherente canonical, JSON-LD, Open Graph, sitemap y llms.txt antes de indexarlo. El ZIP está preparado para el dominio que ya existe, no para competir desde otro subdominio.
3. Verificar la propiedad en Google Search Console (preferiblemente dominio, mediante DNS) y Bing Webmaster Tools. Enviar `https://matematicasib.com/sitemap.xml`. Las cuentas y DNS del propietario son necesarias; no enviar contraseñas en el chat. El sitio no contiene un token de verificación inventado.
4. Inspeccionar la portada, páginas AA/AI, la página local y online. Revisar redirecciones y cobertura de indexación. Estas comprobaciones de producción no se han realizado con la versión nueva, todavía sin desplegar.
5. Revisar o crear un Perfil de Empresa de Google si el negocio cumple sus requisitos: negocio de área de servicio, teléfono y cobertura reales. No publicar un domicilio que no atienda público ni inventar horarios. Pedir reseñas auténticas a clientes con autorización, sin incentivos y sin enviar solicitudes desde esta tarea.
6. Validar formación, experiencia, precio, cobertura y disponibilidad del sitio. Estos datos se conservaron del sitio original, no se auditaron certificados externos. No se inventaron nuevos resultados de alumnos.

## Medición y mejora durante 4–8 semanas

Antes de activar analítica: elegir una herramienta con el propietario, configurar su identificador en Netlify y ajustar privacidad/consentimiento según el proveedor y la jurisdicción. No existe ninguna herramienta de analítica activa en esta entrega. `window.dataLayer` es solo una cola local de eventos, no un envío a Google.

Eventos actuales: `contact_intent` con `placement`, `page_path` y, cuando procede, asignatura, modalidad, objetivo y UTM. Un clic o mensaje preparado es intención, no conversación recibida, clase reservada ni ingreso. No enviar nombres, teléfonos de alumnos o texto libre a analítica. Distinguir las conversiones reales en un registro seguro de negocio.

Registrar semanalmente: consultas recibidas, modalidad, origen declarado, clases confirmadas, ingresos, visitas orgánicas, consultas de búsqueda y páginas que generan contacto. Calcular reservas/consultas recibidas. Comparar virtual y presencial por igual. No sacar conclusiones con una muestra pequeña.

Publicar periódicamente explicaciones propias, ejemplos resueltos originales y preguntas reales de alumnos, con revisión del profesor y fuentes cuando correspondan. Priorizar problemas concretos (una guía de Casio, un ejemplo de reflexión de IA, cómo revisar un ejercicio) sobre docenas de páginas repetidas por barrio. No republicar exámenes protegidos sin permiso.

## Búsqueda con IA: alcance real

Google indica que se aplican las mismas bases SEO a AI Overviews y AI Mode: contenido útil, indexable y elegible para fragmentos; no exige una etiqueta ni un schema especial para IA. OpenAI distingue OAI-SearchBot (búsqueda) de GPTBot (entrenamiento). Permitir rastreo no garantiza inclusión ni recomendaciones. Esta entrega no añade una preferencia específica sobre entrenamiento a GPTBot.

Fuentes consultadas:
- https://developers.google.com/search/docs/appearance/ai-features
- https://platform.openai.com/docs/bots

## Qué falta y no se debe prometer

No se ha desplegado esta versión en producción, verificado Search Console ni medido posicionamiento o clientes. No se puede prometer un puesto en Google, menciones en chats de IA, un plazo de indexación o una cantidad de ventas. El paso útil siguiente es publicar, verificar dominio y empezar a medir consultas reales.
