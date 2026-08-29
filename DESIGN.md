---
name: Skinergy
description: Estudio boutique de bienestar facial y corporal — energía cálida sobre editorial en calma
colors:
  coral:
    value: "#FF5757"
  coral-deep:
    value: "#E23E3E"
  coral-soft:
    value: "#FFB4A8"
  cream:
    value: "#F8F4F1"
  cream-warm:
    value: "#EFE6DE"
  ink:
    value: "#1F1B18"
  ink-soft:
    value: "#5C554F"
  white:
    value: "#FFFFFF"
typography:
  display:
    fontFamily: "Fraunces, serif"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "Manrope, sans-serif"
    fontWeight: 700
    fontSize: "11.5px"
    letterSpacing: "0.22em"
rounded:
  content: "6px"
  pill: "100px"
  chip: "22px"
spacing:
  wrap-max: "1240px"
  wrap-narrow-max: "820px"
  wrap-pad: "32px"
  wrap-pad-mobile: "20px"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "16px 26px"
  button-primary-hover:
    backgroundColor: "{colors.coral-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  card-treatment:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.content}"
    padding: "26px 24px"
---

# Design System: Skinergy

## Overview

**Creative North Star: "El Estudio Editorial Cálido"**

Skinergy se lee como una revista de bienestar boutique, no como una app de agendamiento. El fondo es crema cálido, no blanco de clínica; el titular es una serif elegante (Fraunces) con un itálico coral que puntúa las frases clave; el cuerpo es un sans-serif (Manrope) discreto que deja respirar el contenido. El coral aparece con disciplina — en un eyebrow, un subrayado líquido, un borde de hover — nunca como fondo dominante de sección.

La energía del nombre "Skinergy" vive en el movimiento, no en el color: fotos de tratamientos en blanco y negro que despiertan a color al pasar el cursor, botones con relleno líquido y un leve magnetismo hacia el puntero, tarjetas que se inclinan en 3D siguiendo el mouse. Todo eso ocurre sobre una base editorial en calma — mucho aire, jerarquía tipográfica clara, sin ruido decorativo.

Rechazos confirmados: nada de estética clínica/médica (sin azules fríos, sin cruces, sin iconografía de procedimiento); nada de dashboard denso — el sitio es de lectura y decisión, no una herramienta de trabajo.

**Key Characteristics:**
- Crema cálido como lienzo, coral como acento raro y preciso
- Serif display (Fraunces) + sans body (Manrope), itálico coral como voz de énfasis
- Plano en reposo; la sombra y el color aparecen como respuesta a la interacción
- Radios de dos familias: 6px en contenido (cards, tabla), pill 100px en controles (botones, nav activo, chips)
- Foto en blanco y negro → color a la interacción, como metáfora directa de "energía"

## Colors

Paleta de un solo acento (coral) sobre una base neutra cálida cream/ink — no hay familia secundaria ni terciaria.

### Primary
- **Coral** (`#FF5757`): fondo de botón primario, punto del eyebrow, acentos de marca en reposo.
- **Coral Deep** (`#E23E3E`): estado hover del botón primario, itálico de énfasis (`em`), precios y descuentos, texto del wordmark del logo.
- **Coral Soft** (`#FFB4A8`): variante del eyebrow y wordmark sobre fondos oscuros (`.on-dark`).

### Neutral
- **Cream** (`#F8F4F1`): fondo base del sitio y del header.
- **Cream Warm** (`#EFE6DE`): fondo de superficies secundarias (menú mobile, chips, hover de filas de tabla).
- **Ink** (`#1F1B18`): color de texto principal, fondo de header de tabla de precios.
- **Ink Soft** (`#5C554F`): texto secundario/metadatos (duración, descripciones cortas).
- **White** (`#FFFFFF`): fondo de cards (treatment cards, testimonios, FAQ items, filas de tabla).

### Named Rules
**The One Accent Rule.** El coral nunca es un color de fondo de sección grande; aparece en puntos, bordes, texto de énfasis y estados de hover — su escasez es lo que lo hace notarse.

## Typography

**Display Font:** Fraunces (serif)
**Body Font:** Manrope (sans-serif)

**Character:** Fraunces le da al sitio una voz editorial y cálida en titulares (`h1`, `h2`, `h3`, `.serif`, y el itálico de énfasis); Manrope mantiene el cuerpo y las etiquetas legibles y contemporáneas, sin competir con el titular.

### Hierarchy
- **Display / Hero** (Fraunces 500, `clamp(38px,5.4vw,64px)` en hero de página interior, line-height 1.05): titular principal de cada página.
- **Headline** (Fraunces 500, `clamp(28px,4vw,44px)`): título de sección (`.section-head h2`).
- **Title** (Fraunces 500, 17.5–21px): título de card, precio destacado.
- **Body** (Manrope 400, 13.5–15.5px, line-height 1.6–1.65): descripciones, párrafos de card, subtítulo de sección.
- **Label / Eyebrow** (Manrope 700, 11.5px, letter-spacing 0.22em, uppercase): etiqueta de categoría sobre titulares, encabezados de tabla.

### Named Rules
**The Italic Emphasis Rule.** El itálico (`em`) es siempre Fraunces en coral-deep — es la única forma de énfasis dentro de un párrafo; no se usa bold para lo mismo.

## Layout

Contenedor centrado `max-width:1240px` (`.wrap`) con padding lateral `32px` (`20px` bajo 700px, respetando `env(safe-area-inset)`); una variante angosta `.wrap-narrow` a `820px` para contenido de lectura (FAQ, texto largo). Los bloques de sección abren con `.section-head` (máx. 640px) y un margen inferior de 52px antes de la grilla de contenido. Grillas de cards responden a 3 columnas en desktop y colapsan a 1 columna bajo 900px.

## Elevation & Depth

Sistema plano por defecto: cards, botones ghost y superficies en reposo no llevan sombra (`box-shadow:none`). La sombra aparece únicamente como respuesta a la interacción — hover de card, hover de botón, header al hacer scroll — y siempre en el mismo tono (coral en elementos de marca, `--line-rgb` neutro en cards/header), nunca como jerarquía estática.

### Shadow Vocabulary
- **Card hover** (`box-shadow:0 22px 40px -20px rgba(31,27,24,.28)`): elevación de treatment card al pasar el mouse.
- **Testimonial hover** (`box-shadow:0 20px 32px -22px rgba(31,27,24,.28)`): elevación más contenida para cards de testimonio.
- **Button primary hover** (`box-shadow:0 10px 22px -10px rgba(226,62,62,.5)`): sombra coral bajo el botón principal.
- **Header scrolled** (`box-shadow:0 1px 0 rgba(31,27,24,.06)`): línea de sombra mínima cuando el header se compacta.

### Named Rules
**The Flat-by-Default Rule.** Nada tiene sombra en reposo. La sombra es siempre una señal de vida — aparece cuando el usuario interactúa, no para establecer jerarquía visual permanente.

## Shapes

Dos familias de radio conviven a propósito: **6px** en superficies de contenido (treatment cards, tabla de precios, esquinas de foto) transmite un borde de tarjeta editorial, casi recto; **100px (pill)** en todo control interactivo (botones, cápsula de nav activo, chips de certificación) marca visualmente qué es "tocable". Círculos perfectos (`50%`) se reservan para puntos decorativos (el punto del eyebrow, el bullet de lista).

## Components

### Buttons
- **Shape:** pill completo (`border-radius:100px`).
- **Primary:** fondo coral, texto blanco, relleno líquido coral-deep que sube desde abajo al hover (`background-size` animado) más un leve magnetismo hacia el cursor (`translate3d` con `--mag-x/--mag-y`); sombra coral solo en hover.
- **Ghost:** transparente con borde `rgba(ink,.25)`, relleno líquido de ink (o cream sobre fondos oscuros) al hover, sin sombra.
- **Hover / Focus:** transición de relleno 0.85s, `outline` coral-deep de 2px en `focus-visible`.

### Cards / Containers
- **Corner Style:** 6px; la foto interna de treatment card recorta solo las esquinas superiores (`6px 6px 0 0`).
- **Background:** blanco sobre el lienzo cream de la página.
- **Shadow Strategy:** plana en reposo, ver Elevation & Depth; en hover suma inclinación 3D sutil siguiendo el mouse (`rotateX/rotateY`) y un glow radial coral bajo el cursor.
- **Border:** `1px solid rgba(31,27,24,.08)` en reposo, coral en hover.
- **Internal Padding:** 24–30px.

### Chips / Pills
- **Style:** fondo cream-warm, texto ink, borde `rgba(ink,.1)`, radio pill.
- **State:** la cápsula del link activo en nav usa el mismo lenguaje pero con `backdrop-filter:blur(9px)` — "vidrio líquido" en vez de fondo sólido.

### Tabla de precios
- **Header:** fondo ink, texto cream, uppercase trackeado.
- **Body:** fondo blanco, fila con hover cream-warm, celda de descuento en coral-deep bold.

### Navigation
- Grid de 3 columnas (`1fr auto 1fr`) para mantener el grupo de links centrado sin importar el ancho relativo de logo y CTA. Link activo como cápsula de vidrio (blur + fondo `rgba(ink,.15)`); hover como burbuja tenue sin subrayado. En mobile, overlay a pantalla completa cream-warm con glow coral fijo en la esquina, no un dropdown.

## Do's and Don'ts

### Do:
- **Do** usar el coral con moderación — como punto, borde o texto de énfasis, nunca como fondo de sección grande.
- **Do** mantener las cards y controles planos en reposo; introducir sombra/color solo como respuesta a hover o scroll.
- **Do** usar pill (100px) para todo lo interactivo/tocable y 6px para superficies de contenido.
- **Do** preservar el itálico coral-deep en Fraunces como único mecanismo de énfasis inline.

### Don't:
- **Don't** introducir azules fríos, iconografía médica/clínica ni lenguaje visual de dashboard.
- **Don't** aplicar sombra permanente a cards o botones en estado de reposo.
- **Don't** inventar una familia de color secundaria/terciaria — el sistema es de un solo acento.
