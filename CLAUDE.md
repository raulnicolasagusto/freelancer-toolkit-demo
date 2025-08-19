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

### Documentos importantes

- para aplicar componentes de shadcn o cambios y mas , hay reglas en el archivo que esta en .claude/ule-next-shadcn-coding-standards.md
- para aplicar o revisar codigo de tailwind css, hay reglas en el archivo .claude/rule-tailwind-v4-ext.md
