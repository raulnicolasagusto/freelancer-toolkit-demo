-- Migration: Add reminder fields to notes table
-- Date: 2024-08-24

-- Agregar campos de recordatorio a la tabla notes
ALTER TABLE notes 
ADD COLUMN reminder_date DATE,
ADD COLUMN reminder_time TIME,
ADD COLUMN reminder_location TEXT;

-- Crear índice para consultas de recordatorios por fecha
CREATE INDEX idx_notes_reminder_date ON notes(reminder_date) WHERE reminder_date IS NOT NULL;