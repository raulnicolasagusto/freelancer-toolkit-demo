# 🔗 Configuración MCP con Supabase

Esta guía te ayuda a configurar el Model Context Protocol (MCP) para que Claude Code pueda interactuar directamente con tu base de datos de Supabase.

## 📋 Pasos de Configuración

### 1. Crear Personal Access Token

1. **Ve a Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/account/tokens
   ```

2. **Crea un nuevo token:**
   - Clic en "Generate new token"
   - Nombre: `Claude Code MCP`
   - Copia el token generado

3. **Agregar al archivo .env.local:**
   ```env
   SUPABASE_ACCESS_TOKEN=sbp_tu_token_personal_aqui
   ```

### 2. Verificar Configuración del Proyecto

Asegúrate de que tu `.env.local` tenga todas las variables:

```env
# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://lbnhwxgrwiffqhhfzakb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Personal Access Token (para MCP)
SUPABASE_ACCESS_TOKEN=sbp_tu_token_personal_aqui

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Probar el Servidor MCP

```bash
# Opción 1: Usando el script npm configurado
npm run mcp:supabase

# Opción 2: Directamente con npx
npx @supabase/mcp-server-supabase --read-only --project-ref=lbnhwxgrwiffqhhfzakb
```

### 4. Configurar en Claude Code

```bash
# Agregar el servidor MCP local a Claude Code
claude mcp add --transport stdio supabase-local "npm run mcp:supabase"
```

### 5. Verificar la Conexión

```bash
# Listar servidores MCP configurados
claude mcp list

# Probar la conexión
claude mcp test supabase-local
```

## 🛠️ Uso del MCP

Una vez configurado, Claude Code podrá:

- **📊 Leer esquemas de base de datos**
- **🔍 Consultar datos directamente**
- **⚡ Generar queries SQL optimizadas**
- **🔄 Sincronizar cambios en tiempo real**

## 🔒 Seguridad

- **Modo read-only:** El servidor está configurado en modo solo lectura
- **Token personal:** Solo tu tienes acceso al token
- **Scope limitado:** Solo accede al proyecto específico

## ❓ Troubleshooting

### Error: "Access token not found"
```bash
# Verificar que la variable esté configurada
echo $SUPABASE_ACCESS_TOKEN
```

### Error: "Project not found"
- Verificar que el project-ref sea correcto: `lbnhwxgrwiffqhhfzakb`
- Verificar que el token tenga permisos para el proyecto

### Error: "MCP server not responding"
```bash
# Reiniciar el servidor MCP
claude mcp remove supabase-local
claude mcp add --transport stdio supabase-local "npm run mcp:supabase"
```

## 📚 Recursos Adicionales

- [Documentación oficial de Supabase MCP](https://supabase.com/docs/guides/getting-started/mcp)
- [Claude Code MCP Guide](https://docs.anthropic.com/en/docs/claude-code/mcp)

---

🎉 **¡Listo!** Ahora Claude Code puede trabajar directamente con tu base de datos Supabase.