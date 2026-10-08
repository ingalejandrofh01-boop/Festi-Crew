# Festi Crew

App web para ir a festivales con amigos: cartel con votos, plan del grupo con choques de horario, quién va, boletos, punto de encuentro y próximos eventos. Un solo archivo (`index.html`), sin instalar nada.

- **Sin configurar**: funciona en *modo local* (los datos se quedan en tu navegador).
- **Con Firebase**: todo se sincroniza en tiempo real entre tus amigos. Cada quien entra con su nombre.

---

## 1. Subirla a GitHub Pages (5 min)

1. Crea un repositorio nuevo en GitHub, por ejemplo `festi-crew` (público).
2. Sube todos los archivos (ver **Archivos** abajo): **Add file → Upload files → Commit**.
3. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
4. En 1–2 minutos tu app estará en `https://TU-USUARIO.github.io/festi-crew/`.

## Archivos

Sube **todo** al repositorio, con esta misma estructura:

```
index.html             la app
manifest.webmanifest   datos para instalarla (nombre, icono, colores)
sw.js                  hace que funcione sin señal
icons/                 iconos de la app
firestore.rules        reglas para Firebase (no hace falta subirlo, se pegan en la consola)
```

Lo más fácil: en GitHub, **Add file → Upload files** y arrastra los archivos y la carpeta `icons` juntos.

## Descargar la app en el celular

La app se instala desde el link de GitHub Pages (tiene que ser `https://`, no funciona abriendo el archivo directo):

- **iPhone**: abre el link en **Safari** → botón **Compartir** → **Agregar a pantalla de inicio**.
- **Android**: abre el link en **Chrome** → aparece el botón **Descargar app** (o menú **⋮ → Instalar app**).
- **Compu**: en Chrome o Edge, ícono de instalar a la derecha de la barra de direcciones.

Ya instalada se abre a pantalla completa con su icono, y si te quedas sin señal en el festival sigue abriendo con lo último que cargó (cartel, timeline, punto de encuentro). Los votos que hagas sin señal se envían solos cuando vuelve.

Al subir una versión nueva de `index.html`, la app se actualiza sola la siguiente vez que la abras con internet.

## 2. Conectar Firebase para el tiempo real (10 min, gratis)

1. Entra a <https://console.firebase.google.com> → **Agregar proyecto** (puedes desactivar Analytics).
2. **Authentication → Comenzar → Método de acceso → Anónimo → Habilitar**.
   (Es lo que permite entrar solo con un nombre, sin correo ni contraseña.)
3. **Firestore Database → Crear base de datos** → modo producción → región `nam5` o la más cercana.
4. En Firestore, pestaña **Reglas**: borra lo que haya, pega el contenido de `firestore.rules` y **Publicar**.
5. **Configuración del proyecto (engrane) → General → Tus apps → ícono `</>` (Web)** → registra la app. Te muestra un objeto `firebaseConfig`.
6. Abre `index.html`, busca `const FIREBASE_CONFIG = null;` y cámbialo por tu configuración:

   ```js
   const FIREBASE_CONFIG = {
     apiKey: "AIza...",
     authDomain: "mi-crew.firebaseapp.com",
     projectId: "mi-crew",
     storageBucket: "mi-crew.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```
7. Sube otra vez el `index.html` a GitHub.
8. En Firebase, **Authentication → Configuración → Dominios autorizados → Agregar dominio**: `TU-USUARIO.github.io`.

Listo: arriba de la app dirá **En vivo** en lugar de **Modo local**.

> La `apiKey` de Firebase no es secreta: identifica tu proyecto. Lo que protege los datos son las reglas de Firestore del paso 4.

## 3. Usarla con tu crew

1. Abre la app, pon tu nombre y elige tu color.
2. Si el crew está vacío, toca **Cargar Flow Fest y EDC** (trae el cartel completo del Flow Fest 2026 y EDC México 2027) o crea tu propio evento.
3. Toca **Invitar** y manda el link por WhatsApp. El link lleva el código del crew (`?crew=abc123`), así todos caen en el mismo grupo.
4. Cada quien vota en el **Cartel**. Cuando salgan los horarios, cualquiera los captura tocando al artista, y la pestaña **Plan** arma el itinerario del grupo y marca los choques.

Puedes tener varios crews (uno con la familia, otro con los de la uni): cada código es un grupo distinto.

## Qué hay en cada pestaña

| Pestaña | Para qué |
|---|---|
| Ahora | Modo festival: reloj, quién toca en este momento, qué sigue en el plan del crew y el punto de encuentro en grande. Tiene "Simular" para probarlo antes del evento |
| Cartel | Artistas por nivel o por género, filtros por día y género, "Lo quiero ver" con las caras de quién eligió, horario, escenario y foto |
| Timeline | Con horarios: línea del tiempo por escenario con zoom (1×, 2×, 3×) y marcas cada 15 min. Traza la **ruta del crew** entre escenarios, marca quién pierde en cada choque y avisa los traslados ("10 min para cruzar") y los tiempos libres. Sin horarios: ruta en orden estimado |
| Crew | Quién va, **match musical** (qué tanto coincides con cada amigo y tu alma gemela del festival), ranking, boletos, precios, punto de encuentro y **Mi pulsera** (credencial para captura) |
| Eventos | Próximos y pasados, cuenta regresiva, precios, liga de boletos, crear y editar |

### Importar horarios

Cuando el festival publique los horarios, en **Cartel → Importar horarios** pega una línea por artista:

```
18:00-18:50 Zion | Escenario Flow
23:40-01:10 Anuel AA | Escenario Flow
```

El escenario (después de `|`) es opcional. La vista previa te dice qué artistas reconoció antes de aplicar. Si el festival solo publica una imagen, pásasela a Claude y pídele que te la convierta a este formato.

## Notas

- Las fotos se reducen a 240 px antes de guardarse, para que la base de datos no crezca.
- El plan gratuito de Firebase (Spark) aguanta de sobra a un grupo de amigos.
- Datos del Flow Fest 2026: cartel oficial publicado por el festival; precios publicados por SDP Noticias. Horarios y escenarios aún no anunciados.
