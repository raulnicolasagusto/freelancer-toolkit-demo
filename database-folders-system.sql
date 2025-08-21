-- Sistema de Carpetas para Snippets y Notes
-- Ejecutar este SQL en el SQL Editor de Supabase

-- 1. Crear tabla folders
CREATE TABLE IF NOT EXISTS folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    parent_folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('snippets', 'notes')),
    color VARCHAR(7) DEFAULT '#6366f1',
    icon VARCHAR(50) DEFAULT 'folder',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agregar campo folder_id a snippets
ALTER TABLE snippets ADD COLUMN folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;

-- 3. Agregar campo folder_id a notes (preparando para futuro)
ALTER TABLE notes ADD COLUMN folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;

-- 4. Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_type ON folders(type);
CREATE INDEX IF NOT EXISTS idx_folders_parent ON folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_snippets_folder ON snippets(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_folder ON notes(folder_id);

-- 5. RLS Policies para folders
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver y gestionar solo sus carpetas
CREATE POLICY "Users can manage own folders" ON folders 
FOR ALL USING (user_id = get_user_id_from_clerk());

-- 6. Trigger para updated_at en folders
CREATE TRIGGER update_folders_updated_at 
    BEFORE UPDATE ON folders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Trigger para log de actividad en folders
CREATE TRIGGER log_folders_activity 
    AFTER INSERT OR UPDATE OR DELETE ON folders 
    FOR EACH ROW EXECUTE FUNCTION log_activity();

-- 8. Función helper para obtener carpetas con jerarquía
CREATE OR REPLACE FUNCTION get_folder_path(folder_id_param UUID)
RETURNS TEXT AS $$
DECLARE
    path TEXT := '';
    current_folder RECORD;
BEGIN
    -- Si no hay folder_id, retornar raíz
    IF folder_id_param IS NULL THEN
        RETURN '/';
    END IF;
    
    -- Construir path recursivo
    WITH RECURSIVE folder_hierarchy AS (
        -- Base case: folder actual
        SELECT id, name, parent_folder_id, 1 as level
        FROM folders 
        WHERE id = folder_id_param
        
        UNION ALL
        
        -- Recursive case: padres
        SELECT f.id, f.name, f.parent_folder_id, fh.level + 1
        FROM folders f
        INNER JOIN folder_hierarchy fh ON f.id = fh.parent_folder_id
    )
    SELECT string_agg(name, '/' ORDER BY level DESC) INTO path
    FROM folder_hierarchy;
    
    RETURN '/' || COALESCE(path, '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Insertar carpetas de ejemplo (opcional)
-- INSERT INTO folders (user_id, name, type, color, icon) 
-- VALUES 
--     (get_user_id_from_clerk(), 'Frontend', 'snippets', '#3b82f6', 'monitor'),
--     (get_user_id_from_clerk(), 'Backend', 'snippets', '#10b981', 'server'),
--     (get_user_id_from_clerk(), 'Ideas', 'notes', '#f59e0b', 'lightbulb'),
--     (get_user_id_from_clerk(), 'Proyectos', 'notes', '#8b5cf6', 'briefcase');

-- 10. Verificar estructura
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name IN ('folders', 'snippets', 'notes')
-- ORDER BY table_name, ordinal_position;

/*
Estructura final:

TABLE: folders
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- name: varchar - Nombre de la carpeta
- parent_folder_id: uuid (FK -> folders.id) - Para anidación
- type: varchar - 'snippets' | 'notes' 
- color: varchar - Color hex
- icon: varchar - Nombre del icono
- created_at: timestamptz
- updated_at: timestamptz

UPDATED: snippets
- folder_id: uuid (FK -> folders.id) - NULL = raíz

UPDATED: notes  
- folder_id: uuid (FK -> folders.id) - NULL = raíz
*/