# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Tech Stack Architecture

### Core Framework
- **Next.js 15.4.7** with App Router - Uses `src/app/` directory structure
- **React 19** - Latest React with concurrent features
- **TypeScript** - Strict configuration with `@/*` path alias for `src/*`

### Styling System
- **Tailwind CSS v4** - Uses new PostCSS plugin architecture (`@tailwindcss/postcss`)
- **shadcn/ui** - Component library with "new-york" style, neutral base color
- **CSS Variables** - Comprehensive theming system with light/dark mode support
- **Geist fonts** - Variable fonts for sans and mono typography

### Key Dependencies
- **Clerk** (`@clerk/nextjs`) - Authentication and user management
- **Supabase** (`@supabase/supabase-js`) - PostgreSQL database with real-time features
- **Framer Motion** - Animation library for smooth interactions
- **Lucide React** - Icon library
- **Utility Libraries**: `clsx`, `tailwind-merge`, `class-variance-authority`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and providers
│   ├── page.tsx           # Homepage component
│   └── globals.css        # Global styles with Tailwind imports
├── lib/
│   └── utils.ts           # Utility functions (cn helper for className merging)
└── components/            # Reusable components (to be created)
    └── ui/                # shadcn/ui components
```

## Configuration Details

### TypeScript
- Strict mode enabled with ES2017 target
- Path mapping: `@/*` → `./src/*`
- JSX preservation for Next.js handling

### shadcn/ui Setup
- Style: "new-york"
- Base color: "neutral" 
- CSS variables enabled for theming
- Aliases configured for components, utils, ui, lib, hooks

### Tailwind Configuration
- Uses Tailwind v4 with PostCSS plugin
- Custom theme variables defined in globals.css
- Dark mode support via CSS variables
- Includes `tw-animate-css` for additional animations

## Environment Variables Required

Crear archivo `.env.local` en la raíz del proyecto con:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_publishable_key
CLERK_SECRET_KEY=tu_clerk_secret_key

# Supabase Database (obtener desde Supabase Dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

**IMPORTANTE:** 
- Crear el archivo `.env.local` (no `.env`) según mejores prácticas de Next.js
- Las variables `NEXT_PUBLIC_*` son accesibles en el cliente
- Nunca commitear el archivo `.env.local` al repositorio
- Obtener las credenciales de Supabase desde: Dashboard > Settings > API

## Configuración de Supabase

### Estructura de Clientes
El proyecto usa la estructura oficial de Supabase para Next.js:

- `src/utils/supabase/client.ts` - Cliente para componentes del navegador
- `src/utils/supabase/server.ts` - Cliente para Server Components y API Routes

### Uso en Componentes

#### En Server Components:
```typescript
import { createClient } from '@/utils/supabase/server'

export default async function MyServerComponent() {
  const supabase = createClient()
  const { data } = await supabase.from('tabla').select('*')
  return <div>{/* renderizar data */}</div>
}
```

#### En Client Components:
```typescript
'use client'
import { createClient } from '@/utils/supabase/client'

export default function MyClientComponent() {
  const supabase = createClient()
  // usar supabase en efectos o handlers
}
```

### Integración con Clerk (Third-Party Auth)
- **IMPORTANTE:** Clerk se integra como Third-Party Authentication provider en Supabase
- Usar tokens de sesión de Clerk para autenticar con Supabase
- Las políticas RLS usan `auth.jwt()` para acceder a claims de Clerk
- Supabase maneja el almacenamiento de datos, Clerk maneja autenticación

## Configuración MCP (Model Context Protocol)

### Servidor MCP de Supabase
El proyecto incluye configuración para MCP que permite a Claude Code interactuar directamente con Supabase.

#### Variables Adicionales Requeridas:
```env
# Personal Access Token de Supabase (para MCP)
SUPABASE_ACCESS_TOKEN=tu_personal_access_token
```

#### Crear Personal Access Token:
1. Ve a https://supabase.com/dashboard/account/tokens
2. Clic en "Generate new token"
3. Dale un nombre descriptivo (ej: "Claude Code MCP")
4. Copia el token y agrégalo a `.env.local`

#### Ejecutar Servidor MCP:
```bash
# Opción 1: Usando script npm
npm run mcp:supabase

# Opción 2: Directamente con npx
npx @supabase/mcp-server-supabase --read-only --project-ref=lbnhwxgrwiffqhhfzakb
```

#### Configurar en Claude Code:
```bash
# Agregar servidor MCP local
claude mcp add --transport stdio supabase-local "npm run mcp:supabase"
```

### Características del MCP:
- **Read-only mode:** Seguro para desarrollo
- **Acceso directo a tablas:** Claude puede leer esquemas y datos
- **Generación de consultas:** Claude puede crear queries SQL optimizadas
- **Sincronización automática:** Los cambios se reflejan inmediatamente

## Development Guidelines

### Component Development
- Use the `cn()` utility from `@/lib/utils` for conditional styling
- Follow shadcn/ui patterns for component composition
- Leverage CSS variables for consistent theming
- Install shadcn/ui components as needed: `npx shadcn@latest add [component]`

### Styling Patterns
- Tailwind v4 syntax with CSS variables
- Dark mode classes automatically applied via `.dark` class
- Use semantic color tokens (e.g., `bg-background`, `text-foreground`)
- Responsive design with mobile-first approach

### File Organization
- Components in `src/components/` with ui subfolder for shadcn components
- Utilities and shared logic in `src/lib/`
- Type definitions should go in `src/types/` (when created)
- Follow Next.js App Router conventions for routing

## Sistema de Colores y Temas

### Archivo Principal de Colores
**Ubicación:** `src/lib/theme-colors.ts`

Este archivo contiene TODAS las constantes de colores organizadas por categorías:

- **SIDEBAR COLORS** - Fondo, bordes, navegación, usuario, badges
- **LOGO Y BRANDING** - Colores del logo y títulos principales
- **MAIN CONTENT AREA** - Fondos del área principal
- **DASHBOARD CONTENT** - Cards, títulos, estadísticas 
- **ICON COLORS** - Colores específicos por categoría de iconos
- **INTERACTIVE ELEMENTS** - Botones y elementos interactivos
- **ACTIVITY FEED** - Elementos de feed de actividad
- **TRANSITIONS** - Clases de transiciones

### Cambio de Temas
Para cambiar colores/temas:
1. Ir a `src/lib/theme-colors.ts`
2. Modificar las constantes en `THEME_COLORS`
3. Todos los componentes se actualizarán automáticamente

### Componentes que usan el sistema:
- `src/components/Sidebar.tsx` - Sidebar principal
- `src/app/page.tsx` - Dashboard principal
- `src/app/layout.tsx` - Layout principal

**IMPORTANTE:** Siempre usar las constantes de `THEME_COLORS` en lugar de hardcodear colores en componentes.

## Sistema de Internacionalización (i18n)

### Archivo Principal de i18n
**Ubicación:** `src/lib/i18n/index.ts`

### Idiomas Soportados
El sistema soporta 9 idiomas completamente traducidos:

- **🇪🇸 Español (es)** - Idioma base/por defecto
- **🇺🇸 English (en)** - Inglés
- **🇵🇹 Português (pt)** - Portugués  
- **🇮🇹 Italiano (it)** - Italiano
- **🇫🇷 Français (fr)** - Francés
- **🇩🇪 Deutsch (de)** - Alemán
- **🇷🇺 Русский (ru)** - Ruso
- **🇯🇵 日本語 (ja)** - Japonés
- **🇸🇦 العربية (ar)** - Árabe (con soporte RTL)

### Estructura de Archivos
```
src/lib/i18n/
├── index.ts              # Helper functions y configuración
└── locales/
    ├── es.ts            # Español (base)
    ├── en.ts            # English
    ├── pt.ts            # Português
    ├── it.ts            # Italiano
    ├── fr.ts            # Français
    ├── de.ts            # Deutsch
    ├── ru.ts            # Русский
    ├── ja.ts            # 日本語
    └── ar.ts            # العربية (RTL)
```

### Uso en Componentes

#### Importar función de traducción:
```typescript
import { t } from '@/lib/i18n';
```

#### Usar traducciones:
```typescript
// Texto simple
{t('sidebar.nav.dashboard')}

// Con variables/reemplazos
{t('dashboard.recentActivity.timeAgo.hoursAgo', { hours: '2' })}
```

#### Navegación anidada:
Las traducciones usan dot notation para acceder a objetos anidados:
- `t('app.name')` → 'DevToolkit'
- `t('sidebar.nav.snippets')` → 'Mis Snippets'
- `t('dashboard.header.title')` → 'Bienvenido de vuelta'

### Funciones Principales

- `t(key, replacements?)` - Obtener texto traducido
- `setLocale(locale)` - Cambiar idioma
- `getCurrentLocale()` - Obtener idioma actual
- `getSupportedLocales()` - Lista de idiomas disponibles
- `initializeI18n()` - Inicializar con detección automática

### Características Especiales

#### Soporte RTL
- El idioma árabe tiene soporte automático RTL
- Cambia `dir="rtl"` en el HTML automáticamente
- Diseño adaptativo para idiomas de derecha a izquierda

#### Detección Automática
- Detecta idioma del navegador automáticamente
- Fallback a español si el idioma no está soportado
- Guarda preferencia en localStorage

#### Variables en Textos
Soporta reemplazo de variables con sintaxis `{variable}`:
```typescript
// En el archivo de idioma:
"hoursAgo": "hace {hours} horas"

// En el componente:
t('time.hoursAgo', { hours: '2' }) // → "hace 2 horas"
```

### Componentes Actualizados
Los siguientes componentes ya usan el sistema i18n:
- `src/components/Sidebar.tsx` - Navegación, usuario, footer
- `src/app/page.tsx` - Dashboard completo
- `src/app/layout.tsx` - Layout principal

### Cambio de Idiomas
Para cambiar idiomas (implementación futura):
1. Crear selector de idiomas en UI
2. Llamar `saveLocalePreference(locale)`
3. El cambio es inmediato y se guarda automáticamente

**IMPORTANTE:** 
- Siempre usar `t()` para textos visibles al usuario
- NUNCA hardcodear strings de UI en componentes
- Las traducciones están completas para todos los idiomas
- El sistema detecta automáticamente el idioma del usuario

## Sistema de Autenticación (Clerk)

### Configuración
**Proveedor:** Clerk - Autenticación completa y gestión de usuarios
**Archivos principales:**
- Variables de entorno en `.env` (NEVER commit to repo)
- Middleware en `src/middleware.ts`
- Páginas de auth en `src/app/(auth)/`

### Características Implementadas

#### Páginas de Autenticación
- **Sign In** (`/sign-in`) - Inicio de sesión con estilos personalizados
- **Sign Up** (`/sign-up`) - Registro con verificación por email obligatoria
- **Verificación por Email** - Código de verificación integrado
- **Estilos Premium** - Totalmente integrados con nuestro sistema de colores

#### Protección de Rutas
- **Middleware automático** - Protege todas las rutas excepto auth
- **Redirección automática** - No autenticados van a `/sign-in`
- **Layout condicional** - Sidebar solo para usuarios autenticados

#### Integración con Sidebar
- **Datos reales del usuario** - Nombre, email, avatar de Clerk
- **Avatar dinámico** - Imagen del usuario o iniciales automáticas
- **Logout integrado** - Botón de cerrar sesión con hover/collapsed states
- **Loading states** - Manejo de estados de carga

### Componentes Principales

#### `src/components/ConditionalLayout.tsx`
- Muestra sidebar solo a usuarios autenticados
- Loading state mientras verifica autenticación
- Redirección automática

#### `src/components/Sidebar.tsx` 
- Integrado con `useUser()` de Clerk
- Muestra datos reales: nombre, email, avatar
- Botones de logout con animaciones

#### `src/middleware.ts`
- Protege automáticamente todas las rutas
- Rutas públicas: `/sign-in`, `/sign-up`, `/api/webhook/*`

### Configuración de Clerk Dashboard

#### Configuraciones Requeridas:
1. **Email Verification** - ACTIVADO (email verification code)
2. **Sign-up/Sign-in URLs:**
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

#### Variables de Entorno Requeridas:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Flujo de Usuario

1. **Usuario no autenticado** → Redirigido a `/sign-in`
2. **Nuevo usuario** → `/sign-up` → Verificación email → Dashboard
3. **Usuario existente** → `/sign-in` → Dashboard
4. **Usuario autenticado** → Dashboard con sidebar + datos reales
5. **Logout** → Redirigido a `/sign-in`

### Próximas Mejoras
- Personalización completa de páginas de auth
- Integración con base de datos de usuarios
- Roles y permisos
- Social logins adicionales

**IMPORTANTE:**
- NUNCA commitear el archivo `.env` al repositorio
- Usar `.env.example` como template
- Verificar que Clerk esté configurado en dashboard antes de testing

## Esquema de Base de Datos (Supabase)

### Estructura de Tablas

El proyecto implementa las siguientes entidades principales:

#### 1. **users** - Usuarios del sistema (sincronizados con Clerk)
```sql
Table: users
- id: uuid (PK) - ID único de Supabase
- clerk_user_id: varchar - ID del usuario en Clerk (UNIQUE)
- email: varchar - Email del usuario
- first_name: varchar - Nombre
- last_name: varchar - Apellido
- username: varchar - Nombre de usuario
- image_url: text - URL del avatar
- preferences: jsonb - Preferencias del usuario (idioma, tema, etc.)
- created_at: timestamptz - Fecha de creación
- updated_at: timestamptz - Última actualización
```

#### 2. **snippets** - Fragmentos de código
```sql
Table: snippets
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- title: varchar - Título del snippet
- description: text - Descripción opcional
- language: varchar - Lenguaje de programación
- code: text - Código del snippet
- tags: text[] - Array de tags
- is_public: boolean - Si es público o privado
- is_favorite: boolean - Marcado como favorito
- created_at: timestamptz
- updated_at: timestamptz
```

#### 3. **notes** - Notas/Apuntes
```sql
Table: notes
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- title: varchar - Título de la nota
- content: text - Contenido en markdown
- category: varchar - Categoría (personal, work, learning, etc.)
- tags: text[] - Array de tags
- is_pinned: boolean - Nota fijada
- color: varchar - Color de la nota (opcional)
- created_at: timestamptz
- updated_at: timestamptz
```

#### 4. **tasks** - Sistema de tareas/productividad
```sql
Table: tasks
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- title: varchar - Título de la tarea
- description: text - Descripción opcional
- status: varchar - Estado (pending, in_progress, completed)
- priority: varchar - Prioridad (low, medium, high, urgent)
- due_date: timestamptz - Fecha límite
- category: varchar - Categoría (personal, work, project, etc.)
- tags: text[] - Array de tags
- completed_at: timestamptz - Fecha de completado
- created_at: timestamptz
- updated_at: timestamptz
```

#### 5. **resources** - Enlaces y recursos útiles
```sql
Table: resources
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- title: varchar - Título del recurso
- url: text - URL del recurso
- description: text - Descripción
- category: varchar - Categoría (docs, tools, tutorials, etc.)
- tags: text[] - Array de tags
- favicon_url: text - URL del favicon
- is_favorite: boolean - Marcado como favorito
- created_at: timestamptz
- updated_at: timestamptz
```

#### 6. **categories** - Categorías personalizadas del usuario
```sql
Table: categories
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- name: varchar - Nombre de la categoría
- color: varchar - Color hex de la categoría
- icon: varchar - Nombre del icono (lucide)
- type: varchar - Tipo (snippets, notes, tasks, resources)
- created_at: timestamptz
- updated_at: timestamptz
```

#### 7. **activity_logs** - Log de actividad del usuario
```sql
Table: activity_logs
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- action: varchar - Acción realizada (created, updated, deleted)
- entity_type: varchar - Tipo de entidad (snippet, note, task, resource)
- entity_id: uuid - ID de la entidad afectada
- metadata: jsonb - Datos adicionales de la acción
- created_at: timestamptz
```

### Políticas RLS (Row Level Security)

Todas las tablas implementan RLS para seguridad a nivel de fila:

#### **users** (Clerk Third-Party Auth)
```sql
-- Políticas que usan Clerk ID directamente del JWT
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (clerk_user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');
```

#### **snippets** (Clerk Third-Party Auth)
```sql
-- Usuario puede ver sus snippets + snippets públicos de otros
CREATE POLICY "Users can view own snippets" ON snippets FOR SELECT USING (user_id = get_user_id_from_clerk());
CREATE POLICY "Users can view public snippets" ON snippets FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own snippets" ON snippets FOR ALL USING (user_id = get_user_id_from_clerk());
```

#### **notes, tasks, resources, categories, activity_logs** (Clerk Third-Party Auth)
```sql
-- Solo el usuario puede ver y gestionar sus propios datos
CREATE POLICY "Users can manage own data" ON [table_name] FOR ALL USING (user_id = get_user_id_from_clerk());
```

### Funciones Helper

#### Funciones Helper para Clerk Third-Party Auth
```sql
-- Obtener Clerk User ID del JWT
CREATE OR REPLACE FUNCTION get_clerk_user_id()
RETURNS text AS $$
BEGIN
  RETURN (auth.jwt() ->> 'sub');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obtener UUID del usuario en tabla users usando Clerk ID
CREATE OR REPLACE FUNCTION get_user_id_from_clerk()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT id FROM users 
    WHERE clerk_user_id = get_clerk_user_id()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Triggers y Funciones

#### Auto-actualizar `updated_at`
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (repetir para cada tabla)
```

#### Log de actividad automático
```sql
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (OLD.user_id, 'deleted', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSE
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
    VALUES (NEW.user_id, LOWER(TG_OP), TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers de actividad
CREATE TRIGGER log_snippets_activity AFTER INSERT OR UPDATE OR DELETE ON snippets FOR EACH ROW EXECUTE FUNCTION log_activity();
-- ... (repetir para cada tabla principal)
```

### Índices para Performance

```sql
-- Índices para mejorar rendimiento
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_snippets_user_id ON snippets(user_id);
CREATE INDEX idx_snippets_language ON snippets(language);
CREATE INDEX idx_snippets_public ON snippets(is_public);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_resources_user_id ON resources(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
```

## Configuración Requerida para Clerk + Supabase

### 1. Configurar Third-Party Auth en Supabase Dashboard
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Authentication** → **Third-Party Auth**
3. Agrega una nueva integración con **Clerk**
4. Configura el dominio de tu instancia de Clerk

### 2. Configurar Clerk para Supabase
1. Ve a [Clerk Connect with Supabase](https://dashboard.clerk.com/setup/supabase)
2. Conecta tu instancia de Clerk con Supabase
3. Agregar el claim `role: "authenticated"` a los session tokens

### 3. Ejecutar Scripts SQL
1. Ejecutar `database-setup.sql` para crear las tablas
2. Ejecutar `clerk-supabase-fix.sql` para actualizar las políticas RLS

**IMPORTANTE:** 
- **Clerk + Supabase requiere Third-Party Authentication**
- Usar `session.getToken()` de Clerk para autenticar con Supabase
- Las políticas RLS usan `auth.jwt() ->> 'sub'` para obtener Clerk User ID
- Todas las tablas usan UUID como PK para mejor escalabilidad
- RLS asegura que cada usuario solo acceda a sus datos
- Los logs de actividad son automáticos para auditoría
- Índices optimizan las consultas más frecuentes

### Documentos importantes

- para aplicar componentes de shadcn o cambios y mas , hay reglas en el archivo que esta en .claude/ule-next-shadcn-coding-standards.md
- para aplicar o revisar codigo de tailwind css, hay reglas en el archivo .claude/rule-tailwind-v4-ext.md
