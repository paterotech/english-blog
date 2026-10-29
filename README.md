# English Blog

Blog de evidencias para la actividad de formación en inglés del SENA. Publica las evidencias de las actividades del proyecto, permite leerlas desde cualquier dispositivo y ofrece un panel de administración privado para crear, editar y moderar el contenido.

## Tecnologías

| Capa | Herramientas |
|---|---|
| Cliente | React 19, Vite 7, Tailwind CSS 4, React Router 7, axios, motion, moment, Quill 2, marked |
| Servidor | Node.js, Express 5, Mongoose 9 (MongoDB Atlas), JWT, Multer |
| Servicios | ImageKit (almacenamiento y optimización de imágenes), Google Gemini (generación de contenido) |

## Estructura del proyecto

```
EnglishBlog/
├── client/                 Aplicación React (Vite)
│   ├── public/             Archivos estáticos (robots.txt, favicon)
│   └── src/
│       ├── components/     Componentes reutilizables (Navbar, BlogCard, Comments…)
│       ├── context/        AppContext: estado global, blogs y sesión admin
│       ├── hooks/          usePageMeta (títulos y metadatos por página)
│       ├── pages/          Páginas públicas y panel de administración
│       └── assets/         Imágenes e iconos
└── server/                 API REST (Express)
    ├── configs/            Conexión a MongoDB e ImageKit
    ├── controllers/        Lógica de blogs, comentarios y administración
    ├── middleware/         Autenticación JWT y carga de archivos
    ├── models/             Esquemas de Mongoose (Blog, Comment)
    └── routes/             Definición de endpoints
```

## Requisitos

- Node.js 20 o superior
- Una base de datos MongoDB (Atlas o local)
- Una cuenta de ImageKit
- Una API key de Google Gemini

## Puesta en marcha local

1. Clonar el repositorio e instalar dependencias en cada carpeta:

```bash
git clone https://github.com/paterotech/english-blog.git
cd EnglishBlog

cd server
npm install

cd ../client
npm install
```

2. Crear los archivos de variables de entorno copiando las plantillas:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Completar `server/.env` con las credenciales reales (ver tabla abajo).

4. Levantar el servidor y el cliente en dos terminales distintas:

```bash
# Terminal 1
cd server
npm run server        # API en http://localhost:3000

# Terminal 2
cd client
npm run dev           # Cliente en http://localhost:5173
```

## Variables de entorno

### `server/.env`

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto 3000) |
| `MONGODB` | Cadena de conexión de MongoDB |
| `JWT_SECRET` | Secreto para firmar los tokens de sesión del admin |
| `ADMIN_EMAIL` | Correo del administrador |
| `ADMIN_PASSWORD` | Contraseña del administrador |
| `IMAGEKIT_PUBLIC_KEY` | Clave pública de ImageKit |
| `IMAGEKIT_PRIVATE_KEY` | Clave privada de ImageKit |
| `IMAGEKIT_URL_ENDPOINT` | Endpoint de tu cuenta de ImageKit |
| `GEMINI_API_KEY` | Clave de la API de Google Gemini |

### `client/.env`

| Variable | Descripción |
|---|---|
| `VITE_BASE_URL` | URL base de la API (local: `http://localhost:3000`) |

Los archivos `.env` están excluidos por `.gitignore` y nunca deben subirse al repositorio. En el repo solo se versionan los `.env.example` como plantilla.

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Inicio con presentación, categorías y últimas entradas |
| `/blogs` | Listado completo de blogs publicados con paginación |
| `/blog/:id` | Lectura de una entrada y formulario de comentarios |
| `/about` | Información de la actividad de formación |
| `/admin` | Panel privado: métricas, gestión de blogs y moderación de comentarios |

Los comentarios se publican con **aprobación manual**: cualquiera puede enviarlos, pero solo aparecen cuando el administrador los aprueba desde el panel.

## API

### Público

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/admin/login` | Inicio de sesión del administrador (devuelve JWT) |
| `GET` | `/api/blog/all` | Blogs publicados |
| `GET` | `/api/blog/:blogId` | Detalle de un blog publicado |
| `POST` | `/api/comment/add` | Enviar un comentario |
| `GET` | `/api/comment/blog/:blogId` | Comentarios aprobados de un blog |

### Privado (requiere `Authorization: Bearer <token>`)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Métricas del panel (blogs, borradores, comentarios) |
| `GET` | `/api/admin/blogs` | Todos los blogs, incluidos borradores |
| `GET` | `/api/admin/blogs/:blogId` | Detalle de un blog (incluye borradores) |
| `POST` | `/api/blog/add` | Crear blog (multipart, campo `image`) |
| `PUT` | `/api/blog/update/:id` | Actualizar blog |
| `POST` | `/api/blog/delete` | Eliminar blog y sus comentarios |
| `POST` | `/api/blog/toggle-publish/:id` | Publicar u ocultar un blog |
| `POST` | `/api/blog/generate` | Generar contenido con Gemini |
| `GET` | `/api/admin/comments` | Todos los comentarios |
| `PUT` | `/api/admin/comments/:id` | Aprobar u ocultar un comentario |
| `DELETE` | `/api/admin/comments/:id` | Eliminar un comentario |

## Scripts

### `client/`

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión compilada |
| `npm run lint` | Analiza el código con ESLint |

### `server/`

| Comando | Acción |
|---|---|
| `npm run server` | Desarrollo con recarga automática (nodemon) |
| `npm start` | Ejecución normal en producción |

## Despliegue

El proyecto se despliega como **dos proyectos de Vercel** apuntando al mismo repositorio, cada uno con su *Root Directory*.

### Cliente (`client/`)

- Root Directory: `client` · Framework: Vite · Build: `npm run build` · Output: `dist`
- Variable: `VITE_BASE_URL` con la URL pública de la API (sin `/` final). Se incrusta en el build, así que hay que **redesplegar** si cambia.
- `vercel.json` redirige todas las rutas a `index.html` para que funcione React Router.

### API (`server/`)

- Root Directory: `server` · Framework: Other
- `vercel.json` redirige todas las peticiones a la función `api/index.js`, que exporta la app de Express.
- `server.js` solo abre el puerto cuando no está en Vercel (`process.env.VERCEL`), y la conexión a Mongo se reutiliza entre invocaciones.
- Variables: todas las de `server/.env`, declaradas en **Settings → Environment Variables**. `PORT` no se define.
- Alternativa: Render/Railway como servicio Node con `npm start` (proceso permanente, sin límite de tamaño por petición).

### Consideraciones

- **Vercel limita a 4.5 MB el cuerpo de cada petición.** Un blog con mucho HTML o una imagen grande puede fallar con `413`; en ese caso conviene la API en Render.
- **MongoDB Atlas:** habilitar `0.0.0.0/0` en Network Access, porque las IPs de Vercel son dinámicas.
- Nunca subas los `.env` reales: las variables se configuran en el panel de cada plataforma.

## Autor

José Ricardo Peñarredonda Villadiego — actividad de formación en inglés, SENA.
