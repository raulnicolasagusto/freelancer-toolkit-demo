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

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

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

### Documentos importantes

- para aplicar componentes de shadcn o cambios y mas , hay reglas en el archivo que esta en .claude/ule-next-shadcn-coding-standards.md
- para aplicar o revisar codigo de tailwind css, hay reglas en el archivo .claude/rule-tailwind-v4-ext.md
