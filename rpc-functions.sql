-- Funciones RPC para manejar inserción con autenticación automática
-- Ejecutar este SQL en el SQL Editor de Supabase

-- 1. Función para crear carpetas
CREATE OR REPLACE FUNCTION create_folder_for_user(
  folder_name VARCHAR(100),
  folder_type VARCHAR(20),
  folder_parent_id UUID DEFAULT NULL,
  folder_color VARCHAR(7) DEFAULT '#6366f1',
  folder_icon VARCHAR(50) DEFAULT 'folder'
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  name VARCHAR(100),
  parent_folder_id UUID,
  type VARCHAR(20),
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO folders (user_id, name, parent_folder_id, type, color, icon)
  VALUES (get_user_id_from_clerk(), folder_name, folder_parent_id, folder_type, folder_color, folder_icon)
  RETURNING folders.id, folders.user_id, folders.name, folders.parent_folder_id, 
            folders.type, folders.color, folders.icon, folders.created_at, folders.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función para crear snippets
CREATE OR REPLACE FUNCTION create_snippet_for_user(
  snippet_title VARCHAR,
  snippet_type VARCHAR(20),
  snippet_code TEXT,
  snippet_language VARCHAR DEFAULT 'javascript',
  snippet_description TEXT DEFAULT '',
  snippet_observations TEXT DEFAULT NULL,
  snippet_tabs JSONB DEFAULT '[]'::jsonb,
  snippet_folder_id UUID DEFAULT NULL,
  snippet_tags TEXT[] DEFAULT '{}',
  snippet_is_public BOOLEAN DEFAULT FALSE,
  snippet_is_favorite BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  title VARCHAR,
  description TEXT,
  language VARCHAR,
  code TEXT,
  type VARCHAR(20),
  observations TEXT,
  tabs JSONB,
  folder_id UUID,
  tags TEXT[],
  is_public BOOLEAN,
  is_favorite BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO snippets (
    user_id, title, description, language, code, type, 
    observations, tabs, folder_id, tags, is_public, is_favorite
  )
  VALUES (
    get_user_id_from_clerk(), snippet_title, snippet_description, snippet_language, 
    snippet_code, snippet_type, snippet_observations, snippet_tabs, snippet_folder_id, 
    snippet_tags, snippet_is_public, snippet_is_favorite
  )
  RETURNING snippets.id, snippets.user_id, snippets.title, snippets.description, 
            snippets.language, snippets.code, snippets.type, snippets.observations,
            snippets.tabs, snippets.folder_id, snippets.tags, snippets.is_public, 
            snippets.is_favorite, snippets.created_at, snippets.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Función para obtener carpetas del usuario
CREATE OR REPLACE FUNCTION get_user_folders(folder_type VARCHAR(20))
RETURNS TABLE(
  id UUID,
  user_id UUID,
  name VARCHAR(100),
  parent_folder_id UUID,
  type VARCHAR(20),
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.user_id, f.name, f.parent_folder_id, f.type, f.color, f.icon, f.created_at, f.updated_at
  FROM folders f
  WHERE f.user_id = get_user_id_from_clerk() AND f.type = folder_type
  ORDER BY f.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Función para obtener snippets del usuario
CREATE OR REPLACE FUNCTION get_user_snippets(snippet_folder_id UUID DEFAULT NULL)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  title VARCHAR,
  description TEXT,
  language VARCHAR,
  code TEXT,
  type VARCHAR(20),
  observations TEXT,
  tabs JSONB,
  folder_id UUID,
  tags TEXT[],
  is_public BOOLEAN,
  is_favorite BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  IF snippet_folder_id IS NULL THEN
    -- Obtener snippets en la raíz (sin carpeta)
    RETURN QUERY
    SELECT s.id, s.user_id, s.title, s.description, s.language, s.code, s.type,
           s.observations, s.tabs, s.folder_id, s.tags, s.is_public, s.is_favorite,
           s.created_at, s.updated_at
    FROM snippets s
    WHERE s.user_id = get_user_id_from_clerk() AND s.folder_id IS NULL
    ORDER BY s.updated_at DESC;
  ELSE
    -- Obtener snippets de una carpeta específica
    RETURN QUERY
    SELECT s.id, s.user_id, s.title, s.description, s.language, s.code, s.type,
           s.observations, s.tabs, s.folder_id, s.tags, s.is_public, s.is_favorite,
           s.created_at, s.updated_at
    FROM snippets s
    WHERE s.user_id = get_user_id_from_clerk() AND s.folder_id = snippet_folder_id
    ORDER BY s.updated_at DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;