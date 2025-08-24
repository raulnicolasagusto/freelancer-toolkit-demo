You are a senior full-stack Engineer assigned to build a modern web application from scratch. In this case we need to implement this new section on this app, without touching others part of the code.

## Objetive 

  En la seccion de Notas tendremos practicamente un app muy parecida a Google Keep, busca en internet y mira como es la app. Visualmente deber quedar como la imagen que te muestro en assets/NOTAS.png,
  debe tener animaciones suaves y lindas, tener un renderizado en vivo, es decir que al tocar las vistas previas de las notas , las misma se abran como modales saves. Tenemos que tener una funcion de 
  notas completa con vista previa de todos los tipos de notas, como listas, con link, con imagen ( en esta nota la imagen se ve en mitad de la nota arriba y la mitad de abajo es el contenido de la nota),
  etc. 

-Al crear la nota , tendremos abajo de donde estamos escribiendo para crearla , 10 iconos, los cuales son: Formato de texto ( el cual tendra opcione simples como H1, H2,B para texto en negrita, I para texti en cursiva, U subrayada para activar el subrayado ), un icono para cambiar las opciones de fondo de la nota, y poder elegir el un fondo predeterminado, que nosotros tendremos en una carpeta con varias imagenes, esto sera implementado mas adelante), un icono de una campanita que ser de recordatorio ( implementaremos esta funcionalidad mas adelante), icono para fijar la nota, icono para agregar una imagen a la nota, icono para añadir dibujo( esto abrira un canvas simple para dibujar), icono de flecha izquierda para volver los cambios en la nota, icono de flecha derecha para ir adelante en los cambios. Todos estas funcionalidades, seran implementadas mas adelante. Por ahora solo mostraremos los iconos, y si vamos a implementa que al pasar el mouse por sobre los iconos, nos mostrara en texto que es cada uno, por ejemplo si paso el mouse sobre el icono de  las opciones de formato, aparecera el texto que dice "opciones de formato".

## Structure

En esta seccion de "Mis Notas", el sidebar tendra tal cual ya hicimos en Snippets, para crear carpetas. Para crearla vamos a usar:
-TaildwindCSS 4 que ya lo tenemos en nuestro projecto.

-🔹 Animaciones:

  Framer Motion → ideal para animaciones suaves como:
  
  Aparición/desaparición de notas.
  
  Reordenamiento de tarjetas.
  
  Transiciones al abrir/cerrar una nota.
  
  🔹 Gestión de notas (drag & drop / grid)

  React Beautiful DnD o @dnd-kit/core → para drag & drop de notas (como arrastrar tarjetas en Keep).
  
  Masonry layout → para el efecto de grid tipo Pinterest/Keep:
  CSS Grid con auto-flow denso para hacerlo nativo.

- Debemos guardar todo en la base de datos de Supabase.
- IndexedDB/localStorage → para guardarlas offline, parecido a cómo Keep funciona sin conexión.

-react-textarea-autosize → textarea que crece según escribes (como en Google Keep).
 -react-colorful → selector de color simple para elegir colores de notas.
- react-hotkeys-hook → para atajos de teclado (ej: abrir nueva nota con N)

   

## Tasks ( deben ser lo mas especificas posibles )

  Planificar paso por paso la creacion, hacerla lo mas simple posible la principio, luego iremos agregando funcionalidades. 
  
## Output Requirements ( que se espera que la AI nos devuelva )

  Grid responsivo de notas.

  Animaciones suaves al agregar/eliminar.
  
  Reordenamiento con drag & drop.
  
  Notas con colores, etiquetas, y edición inline.
  
  Persistencia offline.

  En esta parte de la implementacion, debemos tener creado todo lo visual de esta seccion, es decir el Frontend, y tambien tener planificado en un archivo aparte, la estructura que tendra la base de datos, en este archivo, ya debera estar listo el codigo SQL para copiar y pegar en el sql edito de supabase.

## Notes ( observaciones para el agente )

  Recordar que para la base de datos de supabase, tu me tienes que dar los SQL para pasar al editor de Supabase ya que el mcp que tienes instalado, es de solo lectura y tu no puedes crear o escribir en
  la base de datos
