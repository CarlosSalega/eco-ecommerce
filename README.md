# Eco Ecommerce - Cosmetics eCommerce Store

Un ecommerce moderno y minimalista para venta de productos de belleza y cosméticos. Built with Next.js 15, TypeScript, TailwindCSS, Shadcn UI, Prisma y NeonDB (PostgreSQL).

## Características

### Para Clientes

- Catálogo de productos con filtros por categoría
- Carrito persistente (localStorage)
- Autenticación sin contraseña vía WhatsApp + OTP
- Checkout completo con información de envío
- Opciones de entrega (Retiro/Envío)
- Integración con Mercado Pago Checkout Pro

### Para Administradores

- Panel de control con estadísticas
- CRUD de productos
- CRUD de categorías
- Gestión de pedidos
- Autenticación email + password

## Requisitos Previos

- Node.js 20+
- pnpm (recomendado)
- SQLite (local) / PostgreSQL (producción)
- Cuenta de Mercado Pago (para producción)

## Instalación Local

### 1. Clonar el proyecto

\`\`\`bash
git clone <your-repo>
cd belleza-ecommerce
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
pnpm install
\`\`\`

### 3. Configurar base de datos

\`\`\`bash
pnpm db:push
\`\`\`

### 4. Sembrar datos iniciales

\`\`\`bash
pnpm db:seed
\`\`\`

### 5. Iniciar servidor de desarrollo

\`\`\`bash
pnpm dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Acceso Admin

**URL:** http://localhost:3000/admin/login

**Credenciales por defecto:**

- Email: `admin@belleza.com`
- Contraseña: `admin123`

## Variables de Entorno

Copia `.env.local.example` a `.env.local` y ajusta según necesario:

\`\`\`env

# Database

DATABASE_URL="file:./dev.db"

# Admin Auth

ADMIN_DEFAULT_EMAIL="admin@belleza.local"
ADMIN_DEFAULT_PASSWORD="changeme123"

# OTP

OTP_EXPIRY_MINUTES=10

# Mercado Pago (simulado)

NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="TEST-PUBLIC-KEY"
MERCADO_PAGO_ACCESS_TOKEN="TEST-ACCESS-TOKEN"

# App

NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

## Flujo de Compra

### 1. Cliente

1. Explora el catálogo en `/shop`
2. Añade productos al carrito
3. Accede a `/cart` para ver el carrito
4. Procede a `/checkout`
5. Inicia sesión con número de WhatsApp
6. Recibe OTP (se muestra en consola en desarrollo)
7. Completa información de envío
8. Completa pago (simulado)
9. Recibe confirmación

### 2. Admin

1. Accede a `/admin/login`
2. Usa credenciales por defecto
3. Gestiona productos, categorías y pedidos

## Estructura de Carpetas

\`\`\`
belleza-ecommerce/
├── app/ # Rutas principales
│ ├── admin/ # Panel administrativo
│ ├── api/ # Endpoints API
│ ├── cart/ # Página del carrito
│ ├── checkout/ # Página de checkout
│ ├── product/ # Detalle de producto
│ ├── shop/ # Catálogo
│ └── page.tsx # Home
├── components/ # Componentes reutilizables
│ └── ui/ # Componentes Shadcn
├── lib/ # Utilidades
│ ├── auth.ts # Auth helpers
│ └── cart.ts # Cart helpers
├── prisma/
│ └── schema.prisma # Schema de BD
├── public/ # Assets estáticos
└── scripts/
└── seed.js # Script para semilla de datos
\`\`\`

## Endpoints API

### Autenticación

- `POST /api/auth/send-code` - Enviar OTP al WhatsApp
- `POST /api/auth/verify-code` - Verificar código OTP

### Productos

- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear producto (admin)
- `GET /api/products/[id]` - Obtener producto específico
- `PUT /api/products/[id]` - Actualizar producto (admin)
- `DELETE /api/products/[id]` - Eliminar producto (admin)

### Órdenes

- `POST /api/orders/create` - Crear nueva orden
- `GET /api/orders` - Obtener todas las órdenes (admin)

### Admin

- `POST /api/admin/login` - Login admin
- `GET /api/admin/stats` - Obtener estadísticas dashboard

## Próximos Pasos para Producción

### 1. Configurar BD PostgreSQL

\`\`\`bash

# Cambiar provider en prisma/schema.prisma

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}
\`\`\`

### 2. Conectar Integraciones Reales

#### Mercado Pago

- Registrarse en [Mercado Pago](https://www.mercadopago.com.ar)
- Obtener API keys
- Implementar checkout en `/components/checkout-payment.tsx`

#### Vercel Blob (para imágenes)

- Conectar integración en Vercel
- Reemplazar localStorage de imágenes con Blob

#### WhatsApp Business API

- Registrarse en [WhatsApp Business](https://www.whatsapp.com/business)
- Implementar envío de OTP real

### 3. Mejorar Seguridad

- [ ] Implementar JWT con expiración
- [ ] Hash de contraseñas con bcrypt (ya incluido)
- [ ] Rate limiting en endpoints
- [ ] Validación de inputs
- [ ] CORS configuration

### 4. Testing

\`\`\`bash

# Instalar dependencias de testing

pnpm add -D @testing-library/react vitest

# Crear tests

# app/**tests**/

# components/**tests**/

\`\`\`

### 5. Deployment a Vercel

\`\`\`bash

# Conectar repo a Vercel

vercel link

# Configurar variables de entorno en Vercel dashboard

# Conectar PostgreSQL (Neon, PlanetScale, etc)

# Deployar

vercel deploy
\`\`\`

## Integración con Vercel Blob

1. Conectar Blob desde Vercel Dashboard
2. Crear componente de upload:

\`\`\`tsx
import { put } from '@vercel/blob';

const blob = await put(file.name, file, {
access: 'public',
});
\`\`\`

## Scripts Disponibles

\`\`\`bash

# Desarrollo

pnpm dev # Iniciar servidor dev
pnpm build # Build para producción
pnpm start # Iniciar servidor prod
pnpm lint # Lint con ESLint

# Base de datos

pnpm db:push # Sincronizar schema
pnpm db:studio # Abrir Prisma Studio
pnpm db:seed # Ejecutar seed script
\`\`\`

## Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS v4 + Shadcn UI
- **BD:** Prisma + SQLite (local) / PostgreSQL (producción)
- **Imágenes:** Next.js Image (local) / Vercel Blob (producción)
- **Auth:** Custom (WhatsApp OTP + Email/Password)
- **Pagos:** Mercado Pago (simulado/real)
- **Despliegue:** Vercel

## Consideraciones de Seguridad

- OTP en desarrollo se loguea en consola - cambiar en producción
- Contraseñas hasheadas con bcrypt
- Variables sensibles en .env.local
- CORS y rate limiting (a implementar)
- Validación de inputs en APIs
- RLS en PostgreSQL (cuando migre)

## Soporte

Para problemas, contacta al equipo de desarrollo o abre un issue en el repositorio.

## Licencia

MIT

---

**Creado con Next.js 15, TypeScript, TailwindCSS y Prisma**
