-- Actualización de tabla snippets para soportar Markdown y Snippets con tabs
-- Ejecutar este SQL en el SQL Editor de Supabase

-- 1. Agregar campo 'type' para diferenciar entre 'snippet' y 'markdown'
ALTER TABLE snippets ADD COLUMN type VARCHAR(20) DEFAULT 'snippet' NOT NULL;

-- 2. Agregar campo 'observations' para la sección de observaciones
ALTER TABLE snippets ADD COLUMN observations TEXT;

-- 3. Agregar campo 'tabs' para almacenar múltiples tabs en snippets (JSON)
ALTER TABLE snippets ADD COLUMN tabs JSONB DEFAULT '[]'::jsonb;

-- 4. Modificar campo 'code' para que permita contenido markdown también
-- (Ya es TEXT, pero nos aseguramos)
ALTER TABLE snippets ALTER COLUMN code TYPE TEXT;

-- 5. Agregar constraint para validar el tipo
ALTER TABLE snippets ADD CONSTRAINT snippets_type_check 
CHECK (type IN ('snippet', 'markdown'));

-- 6. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_snippets_type ON snippets(type);

-- 7. Actualizar registros existentes para que sean 'snippet' por defecto
UPDATE snippets SET type = 'snippet' WHERE type IS NULL;

-- 8. Actualizar trigger de actividad para incluir nuevos campos
-- (El trigger existente debería funcionar automáticamente)

-- 9. Verificar la estructura actualizada
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'snippets' 
-- ORDER BY ordinal_position;

-- Estructura final esperada de la tabla snippets:
/*
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- title: varchar - Título del snippet/markdown
- description: text - Descripción opcional
- language: varchar - Lenguaje de programación (para snippets)
- code: text - Código del snippet o contenido markdown
- type: varchar - Tipo: 'snippet' o 'markdown'
- observations: text - Observaciones del usuario
- tabs: jsonb - Array de tabs (para snippets con múltiples archivos)
- tags: text[] - Array de tags
- is_public: boolean - Si es público o privado
- is_favorite: boolean - Marcado como favorito
- created_at: timestamptz
- updated_at: timestamptz
*/