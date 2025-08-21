-- Script para verificar configuración Clerk + Supabase
-- Ejecutar DESPUÉS de configurar Third-Party Auth

-- 1. Verificar contenido del JWT (debe mostrar datos de Clerk)
SELECT debug_jwt() as jwt_content;

-- 2. Obtener Clerk User ID del JWT
SELECT get_clerk_user_id() as clerk_user_id;

-- 3. Verificar si hay usuarios en la tabla
SELECT count(*) as total_users FROM users;

-- 4. Mostrar todos los usuarios (si los hay)
SELECT clerk_user_id, email, first_name, last_name, created_at 
FROM users 
LIMIT 5;

-- 5. Test de inserción manual (SOLO PARA TESTING)
-- Ejecutar SOLO si tienes un JWT válido
-- INSERT INTO users (clerk_user_id, email, first_name) 
-- VALUES (get_clerk_user_id(), 'test@example.com', 'Test User');