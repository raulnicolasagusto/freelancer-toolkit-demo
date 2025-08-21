-- =============================================
-- ACTUALIZACIÓN PARA INTEGRACIÓN CLERK + SUPABASE
-- Third-Party Authentication Setup
-- =============================================

-- Primero eliminar las políticas existentes que usan la función get_user_id_by_clerk()
-- ya que no funcionarán con Third-Party Auth

-- Eliminar políticas existentes de usuarios
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Eliminar políticas existentes de snippets
DROP POLICY IF EXISTS "Users can view own snippets" ON snippets;
DROP POLICY IF EXISTS "Users can view public snippets" ON snippets;
DROP POLICY IF EXISTS "Users can insert own snippets" ON snippets;
DROP POLICY IF EXISTS "Users can update own snippets" ON snippets;
DROP POLICY IF EXISTS "Users can delete own snippets" ON snippets;

-- Eliminar políticas existentes de otras tablas
DROP POLICY IF EXISTS "Users can manage own notes" ON notes;
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can manage own resources" ON resources;
DROP POLICY IF EXISTS "Users can manage own categories" ON categories;
DROP POLICY IF EXISTS "Users can view own activity logs" ON activity_logs;

-- =============================================
-- FUNCIÓN HELPER PARA CLERK THIRD-PARTY AUTH
-- =============================================

-- Función para obtener el Clerk User ID del JWT de Third-Party Auth
CREATE OR REPLACE FUNCTION get_clerk_user_id()
RETURNS text AS $$
BEGIN
  RETURN (auth.jwt() ->> 'sub');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el UUID del usuario en nuestra tabla users usando Clerk ID
CREATE OR REPLACE FUNCTION get_user_id_from_clerk()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT id FROM users 
    WHERE clerk_user_id = get_clerk_user_id()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- NUEVAS POLÍTICAS RLS PARA CLERK THIRD-PARTY AUTH
-- =============================================

-- POLÍTICAS PARA TABLA USERS
-- Los usuarios pueden ver sus propios datos usando el Clerk ID del JWT
CREATE POLICY "Users can view own data" ON users
  FOR SELECT 
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE 
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT 
  WITH CHECK (clerk_user_id = get_clerk_user_id());

-- POLÍTICAS PARA TABLA SNIPPETS
-- Ver snippets propios + snippets públicos
CREATE POLICY "Users can view own snippets" ON snippets
  FOR SELECT 
  USING (user_id = get_user_id_from_clerk());

CREATE POLICY "Users can view public snippets" ON snippets
  FOR SELECT 
  USING (is_public = true);

-- Gestionar solo snippets propios
CREATE POLICY "Users can insert own snippets" ON snippets
  FOR INSERT 
  WITH CHECK (user_id = get_user_id_from_clerk());

CREATE POLICY "Users can update own snippets" ON snippets
  FOR UPDATE 
  USING (user_id = get_user_id_from_clerk());

CREATE POLICY "Users can delete own snippets" ON snippets
  FOR DELETE 
  USING (user_id = get_user_id_from_clerk());

-- POLÍTICAS PARA TABLA NOTES
CREATE POLICY "Users can manage own notes" ON notes
  FOR ALL 
  USING (user_id = get_user_id_from_clerk());

-- POLÍTICAS PARA TABLA TASKS
CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL 
  USING (user_id = get_user_id_from_clerk());

-- POLÍTICAS PARA TABLA RESOURCES
CREATE POLICY "Users can manage own resources" ON resources
  FOR ALL 
  USING (user_id = get_user_id_from_clerk());

-- POLÍTICAS PARA TABLA CATEGORIES
CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL 
  USING (user_id = get_user_id_from_clerk());

-- POLÍTICAS PARA TABLA ACTIVITY_LOGS
CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT 
  USING (user_id = get_user_id_from_clerk());

-- =============================================
-- FUNCIÓN PARA DEBUG - Ver contenido del JWT
-- =============================================

-- Esta función te ayuda a debug qué contiene el JWT de Clerk
CREATE OR REPLACE FUNCTION debug_jwt()
RETURNS jsonb AS $$
BEGIN
  RETURN auth.jwt();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ACTUALIZAR FUNCIÓN LOG_ACTIVITY
-- =============================================

-- Primero eliminar los triggers que dependen de la función
DROP TRIGGER IF EXISTS log_snippets_activity ON snippets;
DROP TRIGGER IF EXISTS log_notes_activity ON notes;
DROP TRIGGER IF EXISTS log_tasks_activity ON tasks;
DROP TRIGGER IF EXISTS log_resources_activity ON resources;

-- Ahora eliminar la función
DROP FUNCTION IF EXISTS log_activity() CASCADE;

-- Recrear la función de log (sin cambios, pero necesaria para recrear triggers)
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

-- Recrear los triggers de actividad
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
-- CONFIRMACIÓN
-- =============================================

SELECT 'Clerk Third-Party Auth policies updated successfully!' as status;

-- Para debug: consultar el contenido del JWT
-- SELECT debug_jwt();