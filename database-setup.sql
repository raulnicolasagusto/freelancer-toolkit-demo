-- =============================================
-- DevToolkit - Esquema de Base de Datos Completo
-- Supabase + Clerk Integration
-- =============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- FUNCIONES HELPER
-- =============================================

-- Función para auto-actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener UUID del usuario por Clerk ID
CREATE OR REPLACE FUNCTION get_user_id_by_clerk()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT id FROM users 
    WHERE clerk_user_id = auth.jwt() ->> 'sub'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para log de actividad automático
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

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- 1. USUARIOS (sincronizados con Clerk)
CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_user_id varchar NOT NULL UNIQUE,
  email varchar NOT NULL,
  first_name varchar,
  last_name varchar,
  username varchar,
  image_url text,
  preferences jsonb DEFAULT '{"language": "es", "theme": "light"}'::jsonb,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- 2. SNIPPETS de código
CREATE TABLE snippets (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar NOT NULL,
  description text,
  language varchar NOT NULL,
  code text NOT NULL,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- 3. NOTAS/Apuntes
CREATE TABLE notes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar NOT NULL,
  content text NOT NULL,
  category varchar DEFAULT 'general',
  tags text[] DEFAULT '{}',
  is_pinned boolean DEFAULT false,
  color varchar DEFAULT '#ffffff',
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- 4. TAREAS/Productividad
CREATE TABLE tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar NOT NULL,
  description text,
  status varchar DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority varchar DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  category varchar DEFAULT 'general',
  tags text[] DEFAULT '{}',
  completed_at timestamptz,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- 5. RECURSOS/Enlaces útiles
CREATE TABLE resources (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar NOT NULL,
  url text NOT NULL,
  description text,
  category varchar DEFAULT 'general',
  tags text[] DEFAULT '{}',
  favicon_url text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- 6. CATEGORÍAS personalizadas
CREATE TABLE categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  color varchar DEFAULT '#3b82f6',
  icon varchar DEFAULT 'Folder',
  type varchar NOT NULL CHECK (type IN ('snippets', 'notes', 'tasks', 'resources')),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW(),
  UNIQUE(user_id, name, type)
);

-- 7. LOG de actividad
CREATE TABLE activity_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action varchar NOT NULL,
  entity_type varchar NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT NOW()
);

-- =============================================
-- TRIGGERS AUTO-UPDATE
-- =============================================

-- Triggers para updated_at automático
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippets_updated_at 
  BEFORE UPDATE ON snippets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at 
  BEFORE UPDATE ON resources 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TRIGGERS DE ACTIVIDAD
-- =============================================

-- Triggers para log automático de actividad
CREATE TRIGGER log_snippets_activity 
  AFTER INSERT OR UPDATE OR DELETE ON snippets 
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_notes_activity 
  AFTER INSERT OR UPDATE OR DELETE ON notes 
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_tasks_activity 
  AFTER INSERT OR UPDATE OR DELETE ON tasks 
  FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_resources_activity 
  AFTER INSERT OR UPDATE OR DELETE ON resources 
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices usuarios
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_email ON users(email);

-- Índices snippets
CREATE INDEX idx_snippets_user_id ON snippets(user_id);
CREATE INDEX idx_snippets_language ON snippets(language);
CREATE INDEX idx_snippets_public ON snippets(is_public);
CREATE INDEX idx_snippets_favorite ON snippets(is_favorite);
CREATE INDEX idx_snippets_tags ON snippets USING GIN(tags);

-- Índices notas
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_pinned ON notes(is_pinned);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);

-- Índices tareas
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);

-- Índices recursos
CREATE INDEX idx_resources_user_id ON resources(user_id);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_favorite ON resources(is_favorite);
CREATE INDEX idx_resources_tags ON resources USING GIN(tags);

-- Índices categorías
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);

-- Índices logs de actividad
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS RLS - USUARIOS
-- =============================================

-- Los usuarios pueden ver y editar sus propios datos
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

-- =============================================
-- POLÍTICAS RLS - SNIPPETS
-- =============================================

-- Ver snippets propios + snippets públicos de otros
CREATE POLICY "Users can view own snippets" ON snippets
  FOR SELECT USING (user_id = get_user_id_by_clerk());

CREATE POLICY "Users can view public snippets" ON snippets
  FOR SELECT USING (is_public = true);

-- Gestionar solo snippets propios
CREATE POLICY "Users can insert own snippets" ON snippets
  FOR INSERT WITH CHECK (user_id = get_user_id_by_clerk());

CREATE POLICY "Users can update own snippets" ON snippets
  FOR UPDATE USING (user_id = get_user_id_by_clerk());

CREATE POLICY "Users can delete own snippets" ON snippets
  FOR DELETE USING (user_id = get_user_id_by_clerk());

-- =============================================
-- POLÍTICAS RLS - NOTAS
-- =============================================

CREATE POLICY "Users can manage own notes" ON notes
  FOR ALL USING (user_id = get_user_id_by_clerk());

-- =============================================
-- POLÍTICAS RLS - TAREAS
-- =============================================

CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL USING (user_id = get_user_id_by_clerk());

-- =============================================
-- POLÍTICAS RLS - RECURSOS
-- =============================================

CREATE POLICY "Users can manage own resources" ON resources
  FOR ALL USING (user_id = get_user_id_by_clerk());

-- =============================================
-- POLÍTICAS RLS - CATEGORÍAS
-- =============================================

CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (user_id = get_user_id_by_clerk());

-- =============================================
-- POLÍTICAS RLS - ACTIVITY LOGS
-- =============================================

CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT USING (user_id = get_user_id_by_clerk());

-- =============================================
-- DATOS INICIALES (OPCIONAL)
-- =============================================

-- Insertar categorías por defecto para nuevos usuarios
-- Esto se puede hacer via trigger o desde la aplicación

-- =============================================
-- COMENTARIOS DE TABLA
-- =============================================

COMMENT ON TABLE users IS 'Usuarios sincronizados con Clerk Auth';
COMMENT ON TABLE snippets IS 'Fragmentos de código reutilizable';
COMMENT ON TABLE notes IS 'Notas y apuntes del usuario';
COMMENT ON TABLE tasks IS 'Sistema de gestión de tareas';
COMMENT ON TABLE resources IS 'Enlaces y recursos útiles';
COMMENT ON TABLE categories IS 'Categorías personalizadas del usuario';
COMMENT ON TABLE activity_logs IS 'Log de actividad del usuario para auditoría';

-- =============================================
-- FINALIZACIÓN
-- =============================================

-- Confirmar que todo se ejecutó correctamente
SELECT 'DevToolkit Database Schema created successfully!' as status;

-- Mostrar resumen de tablas creadas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'snippets', 'notes', 'tasks', 'resources', 'categories', 'activity_logs')
ORDER BY table_name;