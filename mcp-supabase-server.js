#!/usr/bin/env node

// Servidor MCP de Supabase para Claude Code
// Este script ejecuta el servidor MCP de Supabase con la configuración del proyecto

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cargar variables de entorno desde .env.local
function loadEnvLocal() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    });
  }
}

// Cargar variables de entorno
loadEnvLocal();

// Configuración del proyecto
const PROJECT_REF = 'lbnhwxgrwiffqhhfzakb'; // Tu project reference
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('❌ Error: SUPABASE_ACCESS_TOKEN no está configurado');
  console.log('💡 Necesitas crear un Personal Access Token en Supabase:');
  console.log('   1. Ve a https://supabase.com/dashboard/account/tokens');
  console.log('   2. Crea un nuevo token');
  console.log('   3. Agrégalo a tu .env.local como SUPABASE_ACCESS_TOKEN=tu_token');
  process.exit(1);
}

console.log('🚀 Iniciando servidor MCP de Supabase...');
console.log(`📦 Project Reference: ${PROJECT_REF}`);
console.log(`🔐 Access Token: ${SUPABASE_ACCESS_TOKEN.substring(0, 10)}...`);

// Ejecutar el servidor MCP de Supabase
const isWindows = process.platform === 'win32';
const command = isWindows ? 'npx.cmd' : 'npx';

const serverProcess = spawn(command, [
  '-y',
  '@supabase/mcp-server-supabase@latest',
  '--read-only',
  `--project-ref=${PROJECT_REF}`
], {
  stdio: 'inherit',
  shell: isWindows,
  env: {
    ...process.env,
    SUPABASE_ACCESS_TOKEN: SUPABASE_ACCESS_TOKEN
  }
});

serverProcess.on('error', (error) => {
  console.error('❌ Error al iniciar el servidor MCP:', error.message);
});

serverProcess.on('close', (code) => {
  console.log(`🔄 Servidor MCP terminó con código: ${code}`);
});

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor MCP...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor MCP...');
  serverProcess.kill('SIGTERM');
});