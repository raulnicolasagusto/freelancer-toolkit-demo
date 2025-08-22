'use client';

import { useState, useEffect, useRef } from 'react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { Plus, X, Code, Sun, Moon } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import CodeMirrorEditor from './CodeMirrorEditor';

interface Tab {
  id: string;
  title: string;
  language: string;
  code: string;
}

interface SnippetEditorProps {
  onTitleChange: (title: string) => void;
  onTabsChange: (tabs: Tab[]) => void;
  onObservationsChange: (observations: string) => void;
  initialTabs?: Tab[];
  initialObservations?: string;
  isEditorDarkMode?: boolean;
  onThemeChange?: (isDark: boolean) => void;
}

export default function SnippetEditor({ onTitleChange, onTabsChange, onObservationsChange, initialTabs, initialObservations, isEditorDarkMode: propIsEditorDarkMode, onThemeChange }: SnippetEditorProps) {
  const [localIsEditorDarkMode, setLocalIsEditorDarkMode] = useState(true);
  
  const isEditorDarkMode = propIsEditorDarkMode !== undefined ? propIsEditorDarkMode : localIsEditorDarkMode;
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'example.js',
      language: 'JavaScript',
      code: `// Ejemplo de función JavaScript
function saludar(nombre) {
  return \`Hola, \${nombre}! Bienvenido a DevToolkit.\`;
}

// Uso de la función
const usuario = 'Developer';
console.log(saludar(usuario));

// Función asíncrona de ejemplo
async function obtenerDatos() {
  try {
    const response = await fetch('/api/datos');
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export { saludar, obtenerDatos };`
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('1');
  const [observations, setObservations] = useState('Agrega aquí tus observaciones sobre este conjunto de snippets...');
  const [isEditingObservations, setIsEditingObservations] = useState(false);
  
  // Refs para controlar la inicialización
  const isInitialized = useRef(false);
  const isTabsLoaded = useRef(false);
  const isObservationsLoaded = useRef(false);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  // Load initial data if provided (solo una vez)
  useEffect(() => {
    if (initialTabs && initialTabs.length > 0 && !isTabsLoaded.current) {
      setTabs(initialTabs);
      setActiveTab(initialTabs[0].id);
      isTabsLoaded.current = true;
      isInitialized.current = true;
    }
  }, [initialTabs]);

  useEffect(() => {
    if (initialObservations && !isObservationsLoaded.current) {
      setObservations(initialObservations);
      isObservationsLoaded.current = true;
    }
  }, [initialObservations]);

  useEffect(() => {
    // Update title based on first tab or observations (solo si no hay initialTabs)
    if (tabs.length > 0 && !isInitialized.current) {
      onTitleChange(`Snippet Collection - ${tabs.length} archivo${tabs.length !== 1 ? 's' : ''}`);
    }
    // Pass tabs to parent
    onTabsChange(tabs);
  }, [tabs, onTitleChange, onTabsChange]);

  useEffect(() => {
    // Pass observations to parent
    onObservationsChange(observations);
  }, [observations, onObservationsChange]);

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: `untitled.txt`,
      language: 'JavaScript',
      code: '// Nuevo snippet\n'
    };
    
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const removeTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (tabs.length === 1) return; // No eliminar el último tab
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const updateTab = (tabId: string, updates: Partial<Tab>) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  };

  const handleTitleEdit = (tabId: string, newTitle: string) => {
    updateTab(tabId, { title: newTitle });
  };

  const getCodeExample = (language: string): string => {
    const examples: { [key: string]: string } = {
      'JavaScript': `// Ejemplo de función JavaScript
function saludar(nombre) {
  return \`Hola, \${nombre}! Bienvenido a DevToolkit.\`;
}

// Uso de la función
const usuario = 'Developer';
console.log(saludar(usuario));

// Función asíncrona de ejemplo
async function obtenerDatos() {
  try {
    const response = await fetch('/api/datos');
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export { saludar, obtenerDatos };`,

      'TypeScript': `// Ejemplo de función TypeScript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

function saludar(nombre: string): string {
  return \`Hola, \${nombre}! Bienvenido a DevToolkit.\`;
}

// Función asíncrona con tipos
async function obtenerUsuario(id: number): Promise<Usuario | null> {
  try {
    const response = await fetch(\`/api/usuarios/\$\{id\}\`);
    const usuario: Usuario = await response.json();
    return usuario;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export { saludar, obtenerUsuario, type Usuario };`,

      'Python': `# Ejemplo de clase y funciones en Python
class Usuario:
    def __init__(self, nombre: str, email: str):
        self.nombre = nombre
        self.email = email
        self.activo = True
    
    def saludar(self) -> str:
        return f"Hola, {self.nombre}! Bienvenido a DevToolkit."
    
    def __str__(self) -> str:
        return f"Usuario(nombre='{self.nombre}', email='{self.email}')"

# Función para procesar datos
def procesar_datos(datos: list) -> dict:
    resultados = {
        'total': len(datos),
        'procesados': 0,
        'errores': []
    }
    
    for item in datos:
        try:
            # Procesamiento aquí
            resultados['procesados'] += 1
        except Exception as e:
            resultados['errores'].append(str(e))
    
    return resultados

# Ejemplo de uso
if __name__ == "__main__":
    usuario = Usuario("Developer", "dev@example.com")
    print(usuario.saludar())`,

      'Java': `// Ejemplo de clase en Java
public class Usuario {
    private String nombre;
    private String email;
    private boolean activo;
    
    public Usuario(String nombre, String email) {
        this.nombre = nombre;
        this.email = email;
        this.activo = true;
    }
    
    public String saludar() {
        return "Hola, " + nombre + "! Bienvenido a DevToolkit.";
    }
    
    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
    
    @Override
    public String toString() {
        return "Usuario{nombre='" + nombre + "', email='" + email + "', activo=" + activo + "}";
    }
    
    public static void main(String[] args) {
        Usuario usuario = new Usuario("Developer", "dev@example.com");
        System.out.println(usuario.saludar());
    }
}`,

      'C#': `// Ejemplo de clase en C#
using System;
using System.Collections.Generic;
using System.Linq;

namespace DevToolkit
{
    public class Usuario
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public bool Activo { get; set; }
        
        public Usuario(string nombre, string email)
        {
            Nombre = nombre;
            Email = email;
            Activo = true;
        }
        
        public string Saludar()
        {
            return $"Hola, {Nombre}! Bienvenido a DevToolkit.";
        }
        
        public override string ToString()
        {
            return $"Usuario(Nombre: '{Nombre}', Email: '{Email}', Activo: {Activo})";
        }
    }
    
    public static class ProcesadorDatos
    {
        public static Dictionary<string, int> ProcesarDatos(List<int> datos)
        {
            return new Dictionary<string, int>
            {
                ["total"] = datos.Count,
                ["suma"] = datos.Sum(),
                ["promedio"] = datos.Any() ? (int)datos.Average() : 0
            };
        }
    }
    
    class Program
    {
        static void Main(string[] args)
        {
            var usuario = new Usuario("Developer", "dev@example.com");
            Console.WriteLine(usuario.Saludar());
            Console.WriteLine(usuario.ToString());
            
            var datos = new List<int> { 1, 2, 3, 4, 5 };
            var resultados = ProcesadorDatos.ProcesarDatos(datos);
            Console.WriteLine(\$"Procesados {resultados["total"]} elementos");
        }
    }
}`,

      'Ruby': `# Ejemplo de clase en Ruby
class Usuario
  attr_accessor :nombre, :email, :activo
  
  def initialize(nombre, email)
    @nombre = nombre
    @email = email
    @activo = true
  end
  
  def saludar
    "Hola, #{@nombre}! Bienvenido a DevToolkit."
  end
  
  def activar
    @activo = true
  end
  
  def desactivar
    @activo = false
  end
  
  def to_s
    "Usuario(nombre: '#{@nombre}', email: '#{@email}', activo: #{@activo})"
  end
end

# Módulo para procesar datos
module ProcesadorDatos
  def self.procesar_datos(datos)
    {
      total: datos.length,
      suma: datos.sum,
      promedio: datos.empty? ? 0 : datos.sum / datos.length.to_f
    }
  end
end

# Ejemplo de uso
if __FILE__ == $0
  usuario = Usuario.new("Developer", "dev@example.com")
  puts usuario.saludar
  puts usuario.to_s
  
  datos = [1, 2, 3, 4, 5]
  resultados = ProcesadorDatos.procesar_datos(datos)
  puts "Total: #{resultados[:total]}, Suma: #{resultados[:suma]}"
end`,

      'Swift': `// Ejemplo de struct y clase en Swift
import Foundation

struct Usuario {
    var nombre: String
    var email: String
    var activo: Bool
    
    init(nombre: String, email: String) {
        self.nombre = nombre
        self.email = email
        self.activo = true
    }
    
    func saludar() -> String {
        return "Hola, \\(nombre)! Bienvenido a DevToolkit."
    }
    
    mutating func activar() {
        activo = true
    }
    
    mutating func desactivar() {
        activo = false
    }
}

class ProcesadorDatos {
    static func procesarDatos(_ datos: [Int]) -> [String: Int] {
        return [
            "total": datos.count,
            "suma": datos.reduce(0, +),
            "promedio": datos.isEmpty ? 0 : datos.reduce(0, +) / datos.count
        ]
    }
}

// Ejemplo de uso
let usuario = Usuario(nombre: "Developer", email: "dev@example.com")
print(usuario.saludar())

let datos = [1, 2, 3, 4, 5]
let resultados = ProcesadorDatos.procesarDatos(datos)
print("Total: \\(resultados["total"] ?? 0), Suma: \\(resultados["suma"] ?? 0)")`,

      'Kotlin': `// Ejemplo de clase en Kotlin
data class Usuario(
    var nombre: String,
    var email: String,
    var activo: Boolean = true
) {
    fun saludar(): String {
        return "Hola, \$nombre! Bienvenido a DevToolkit."
    }
    
    fun activar() {
        activo = true
    }
    
    fun desactivar() {
        activo = false
    }
}

object ProcesadorDatos {
    fun procesarDatos(datos: List<Int>): Map<String, Int> {
        return mapOf(
            "total" to datos.size,
            "suma" to datos.sum(),
            "promedio" to if (datos.isNotEmpty()) datos.average().toInt() else 0
        )
    }
}

fun main() {
    val usuario = Usuario("Developer", "dev@example.com")
    println(usuario.saludar())
    println(usuario)
    
    val datos = listOf(1, 2, 3, 4, 5)
    val resultados = ProcesadorDatos.procesarDatos(datos)
    println("Total: \${resultados["total"]}, Suma: \${resultados["suma"]}")
}`,

      'Bash': `#!/bin/bash
# Ejemplo de script Bash para DevToolkit

# Función para saludar
saludar() {
    local nombre="\$1"
    echo "Hola, \$nombre! Bienvenido a DevToolkit."
}

# Función para procesar archivos
procesar_archivos() {
    local directorio="\$1"
    local total=0
    local procesados=0
    
    echo "Procesando archivos en: \$directorio"
    
    for archivo in "\$directorio"/*; do
        if [[ -f "\$archivo" ]]; then
            ((total++))
            if [[ -r "\$archivo" ]]; then
                echo "Procesando: \$(basename "\$archivo")"
                ((procesados++))
            else
                echo "No se puede leer: \$(basename "\$archivo")"
            fi
        fi
    done
    
    echo "Resumen: \$procesados de \$total archivos procesados"
}

# Función para backup
crear_backup() {
    local origen="\$1"
    local destino="backup_\$(date +%Y%m%d_%H%M%S)"
    
    if [[ -d "\$origen" ]]; then
        cp -r "\$origen" "\$destino"
        echo "Backup creado: \$destino"
    else
        echo "Error: El directorio \$origen no existe"
        return 1
    fi
}

# Ejemplo de uso
main() {
    saludar "Developer"
    
    # Procesar archivos del directorio actual
    procesar_archivos "."
    
    # Crear backup si se proporciona argumento
    if [[ \$# -gt 0 ]]; then
        crear_backup "\$1"
    fi
}

# Ejecutar función principal si el script se ejecuta directamente
if [[ "\$\{BASH_SOURCE[0]\}" == "\$\{0\}" ]]; then
    main "\$@"
fi`,

      'C++': `// Ejemplo de clase en C++
#include <iostream>
#include <string>
#include <vector>

class Usuario {
private:
    std::string nombre;
    std::string email;
    bool activo;

public:
    Usuario(const std::string& nombre, const std::string& email) 
        : nombre(nombre), email(email), activo(true) {}
    
    std::string saludar() const {
        return "Hola, " + nombre + "! Bienvenido a DevToolkit.";
    }
    
    // Getters
    const std::string& getNombre() const { return nombre; }
    const std::string& getEmail() const { return email; }
    bool isActivo() const { return activo; }
    
    // Setters
    void setNombre(const std::string& nombre) { this.nombre = nombre; }
    void setActivo(bool activo) { this.activo = activo; }
};

int main() {
    Usuario usuario("Developer", "dev@example.com");
    std::cout << usuario.saludar() << std::endl;
    return 0;
}`,

      'PHP': `<?php
// Ejemplo de clase en PHP
class Usuario {
    private string \$nombre;
    private string \$email;
    private bool \$activo;
    
    public function __construct(string \$nombre, string \$email) {
        \$this->nombre = \$nombre;
        \$this->email = \$email;
        \$this->activo = true;
    }
    
    public function saludar(): string {
        return "Hola, {\$this->nombre}! Bienvenido a DevToolkit.";
    }
    
    // Getters y Setters
    public function getNombre(): string { return \$this->nombre; }
    public function getEmail(): string { return \$this->email; }
    public function isActivo(): bool { return \$this->activo; }
    
    public function setActivo(bool \$activo): void {
        \$this->activo = \$activo;
    }
}

// Función para procesar datos
function procesarDatos(array \$datos): array {
    return [
        'total' => count(\$datos),
        'procesados' => count(array_filter(\$datos))
    ];
}

// Ejemplo de uso
\$usuario = new Usuario("Developer", "dev@example.com");
echo \$usuario->saludar() . PHP_EOL;
?>`,

      'HTML': `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevToolkit - Ejemplo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <header>
        <h1>Bienvenido a DevToolkit</h1>
        <nav>
            <ul>
                <li><a href="#snippets">Snippets</a></li>
                <li><a href="#markdown">Markdown</a></li>
                <li><a href="#recursos">Recursos</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <div class="card">
            <h2>Snippets de Código</h2>
            <p>Organiza y gestiona tus fragmentos de código favoritos.</p>
        </div>
        
        <div class="card">
            <h2>Editor Markdown</h2>
            <p>Crea documentación con vista previa en tiempo real.</p>
        </div>
    </main>
    
    <footer>
        <p>&copy; 2024 DevToolkit. Todos los derechos reservados.</p>
    </footer>
</body>
</html>`,

      'CSS': `/* Ejemplo de estilos CSS para DevToolkit */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --border-radius: 8px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 24px;
  margin-bottom: 20px;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #2563eb;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .card {
    padding: 16px;
  }
}`,

      'Rust': `// Ejemplo de struct y funciones en Rust
#[derive(Debug, Clone)]
struct Usuario {
    nombre: String,
    email: String,
    activo: bool,
}

impl Usuario {
    fn new(nombre: String, email: String) -> Self {
        Usuario {
            nombre,
            email,
            activo: true,
        }
    }
    
    fn saludar(&self) -> String {
        format!("Hola, {}! Bienvenido a DevToolkit.", self.nombre)
    }
    
    fn activar(&mut self) {
        self.activo = true;
    }
    
    fn desactivar(&mut self) {
        self.activo = false;
    }
}

// Función para procesar datos
fn procesar_datos(datos: Vec<i32>) -> (usize, i32) {
    let total = datos.len();
    let suma: i32 = datos.iter().sum();
    (total, suma)
}

fn main() {
    let mut usuario = Usuario::new(
        "Developer".to_string(), 
        "dev@example.com".to_string()
    );
    
    println!("{}", usuario.saludar());
    println!("Usuario: {:?}", usuario);
    
    let datos = vec![1, 2, 3, 4, 5];
    let (total, suma) = procesar_datos(datos);
    println!("Total: {}, Suma: {}", total, suma);
}`,

      'Go': `// Ejemplo de struct y funciones en Go
package main

import (
    "fmt"
    "log"
)

type Usuario struct {
    Nombre string
    Email  string
    Activo bool
}

func NewUsuario(nombre, email string) *Usuario {
    return &Usuario{
        Nombre: nombre,
        Email:  email,
        Activo: true,
    }
}

func (u *Usuario) Saludar() string {
    return fmt.Sprintf("Hola, %s! Bienvenido a DevToolkit.", u.Nombre)
}

func (u *Usuario) Activar() {
    u.Activo = true
}

func (u *Usuario) Desactivar() {
    u.Activo = false
}

// Función para procesar datos
func procesarDatos(datos []int) (int, int) {
    total := len(datos)
    suma := 0
    for _, valor := range datos {
        suma += valor
    }
    return total, suma
}

func main() {
    usuario := NewUsuario("Developer", "dev@example.com")
    fmt.Println(usuario.Saludar())
    fmt.Printf("Usuario: %+v\n", usuario)
    
    datos := []int{1, 2, 3, 4, 5}
    total, suma := procesarDatos(datos)
    fmt.Printf("Total: %d, Suma: %d\n", total, suma)
}`,

      'SQL': `-- Ejemplo de esquema de base de datos para DevToolkit
CREATE DATABASE devtoolkit;
USE devtoolkit;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de snippets
CREATE TABLE snippets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    codigo TEXT NOT NULL,
    lenguaje VARCHAR(50) NOT NULL,
    tags JSON,
    favorito BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_snippets_usuario ON snippets(usuario_id);
CREATE INDEX idx_snippets_lenguaje ON snippets(lenguaje);
CREATE INDEX idx_snippets_favorito ON snippets(favorito);

-- Consulta de ejemplo
SELECT s.titulo, s.lenguaje, u.nombre as autor
FROM snippets s
JOIN usuarios u ON s.usuario_id = u.id
WHERE s.lenguaje = 'JavaScript' 
  AND s.favorito = TRUE
ORDER BY s.fecha_creacion DESC
LIMIT 10;`,

      'JSON': `{
  "devtoolkit": {
    "version": "1.0.0",
    "descripcion": "Herramienta de desarrollo para gestionar snippets y documentación",
    "autor": "DevToolkit Team",
    "licencia": "MIT",
    "configuracion": {
      "tema": "dark",
      "idioma": "es",
      "editor": {
        "fuente": "Monaco",
        "tamaño": 14,
        "numerosLinea": true,
        "autoguardado": {
          "activado": true,
          "intervalo": 5000
        }
      }
    },
    "snippets": [
      {
        "id": 1,
        "titulo": "Función de saludo",
        "lenguaje": "javascript",
        "codigo": "function saludar(nombre) { return \`Hola, \$\{nombre\}!\`; }",
        "tags": ["javascript", "funciones", "basico"],
        "favorito": true,
        "fechaCreacion": "2024-01-15T10:30:00Z"
      },
      {
        "id": 2,
        "titulo": "Consulta SQL básica",
        "lenguaje": "sql",
        "codigo": "SELECT * FROM usuarios WHERE activo = true;",
        "tags": ["sql", "consultas", "basico"],
        "favorito": false,
        "fechaCreacion": "2024-01-16T14:20:00Z"
      }
    ],
    "estadisticas": {
      "totalSnippets": 42,
      "lenguajesMasUsados": ["JavaScript", "Python", "SQL"],
      "ultimaActividad": "2024-01-20T16:45:00Z"
    }
  }
}`,

      'React': `// Ejemplo de componente React con hooks
import React, { useState, useEffect } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

interface Props {
  usuarioId: number;
}

const PerfilUsuario: React.FC<Props> = ({ usuarioId }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setCargando(true);
        const response = await fetch(\`/api/usuarios/\$\{usuarioId\}\`);
        
        if (!response.ok) {
          throw new Error('Error al cargar usuario');
        }
        
        const userData = await response.json();
        setUsuario(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, [usuarioId]);

  const handleToggleActivo = async () => {
    if (!usuario) return;
    
    try {
      const response = await fetch(\`/api/usuarios/\$\{usuario.id\}/toggle\`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setUsuario(prev => prev ? {...prev, activo: !prev.activo} : null);
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  if (cargando) return <div className="loading">Cargando usuario...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!usuario) return <div className="not-found">Usuario no encontrado</div>;

  return (
    <div className="perfil-usuario">
      <h2>Perfil de Usuario</h2>
      <div className="info">
        <p><strong>Nombre:</strong> {usuario.nombre}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p>
          <strong>Estado:</strong> 
          <span className={\`estado \$\{usuario.activo ? 'activo' : 'inactivo'\}\`}>
            {usuario.activo ? 'Activo' : 'Inactivo'}
          </span>
        </p>
      </div>
      
      <button 
        onClick={handleToggleActivo}
        className="btn-toggle"
      >
        {usuario.activo ? 'Desactivar' : 'Activar'} Usuario
      </button>
    </div>
  );
};

export default PerfilUsuario;`,

      'Vue': `<!-- Ejemplo de componente Vue 3 con Composition API -->
<template>
  <div class="perfil-usuario">
    <h2>Perfil de Usuario</h2>
    
    <div v-if="cargando" class="loading">
      Cargando usuario...
    </div>
    
    <div v-else-if="error" class="error">
      Error: {{ error }}
    </div>
    
    <div v-else-if="usuario" class="info">
      <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
      <p><strong>Email:</strong> {{ usuario.email }}</p>
      <p>
        <strong>Estado:</strong>
        <span :class="\`estado \$\{usuario.activo ? 'activo' : 'inactivo'\}\`">
          {{ usuario.activo ? 'Activo' : 'Inactivo' }}
        </span>
      </p>
      
      <button 
        @click="toggleActivo"
        class="btn-toggle"
        :disabled="actualizando"
      >
        {{ usuario.activo ? 'Desactivar' : 'Activar' }} Usuario
      </button>
    </div>
    
    <div v-else class="not-found">
      Usuario no encontrado
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Usuario {
  id: number
  nombre: string
  email: string
  activo: boolean
}

interface Props {
  usuarioId: number
}

const props = defineProps<Props>()

const usuario = ref<Usuario | null>(null)
const cargando = ref(true)
const error = ref<string | null>(null)
const actualizando = ref(false)

const cargarUsuario = async () => {
  try {
    cargando.value = true
    const response = await fetch(\`/api/usuarios/\$\{props.usuarioId\}\`)
    
    if (!response.ok) {
      throw new Error('Error al cargar usuario')
    }
    
    const userData = await response.json()
    usuario.value = userData
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    cargando.value = false
  }
}

const toggleActivo = async () => {
  if (!usuario.value) return
  
  try {
    actualizando.value = true
    const response = await fetch(\`/api/usuarios/\$\{usuario.value.id\}/toggle\`, {
      method: 'PATCH',
    })
    
    if (response.ok) {
      usuario.value.activo = !usuario.value.activo
    }
  } catch (err) {
    console.error('Error al actualizar usuario:', err)
  } finally {
    actualizando.value = false
  }
}

onMounted(() => {
  cargarUsuario()
})
</script>

<style scoped>
.perfil-usuario {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 20px;
}

.error {
  color: #dc2626;
}

.estado.activo {
  color: #16a34a;
}

.estado.inactivo {
  color: #dc2626;
}

.btn-toggle {
  padding: 8px 16px;
  margin-top: 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-toggle:hover {
  background: #2563eb;
}

.btn-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>`,

      'Angular': `// Ejemplo de componente Angular
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: \`
    <div class="perfil-usuario">
      <h2>Perfil de Usuario</h2>
      
      <div *ngIf="cargando" class="loading">
        Cargando usuario...
      </div>
      
      <div *ngIf="error && !cargando" class="error">
        Error: {{ error }}
      </div>
      
      <div *ngIf="usuario && !cargando && !error" class="info">
        <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
        <p>
          <strong>Estado:</strong>
          <span [class]="'estado ' + (usuario.activo ? 'activo' : 'inactivo')">
            {{ usuario.activo ? 'Activo' : 'Inactivo' }}
          </span>
        </p>
        
        <button 
          (click)="toggleActivo()"
          class="btn-toggle"
          [disabled]="actualizando"
        >
          {{ usuario.activo ? 'Desactivar' : 'Activar' }} Usuario
        </button>
      </div>
      
      <div *ngIf="!usuario && !cargando && !error" class="not-found">
        Usuario no encontrado
      </div>
    </div>
  \`,
  styles: [\`
    .perfil-usuario {
      padding: 20px;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .loading, .error, .not-found {
      text-align: center;
      padding: 20px;
    }
    
    .error {
      color: #dc2626;
    }
    
    .estado.activo {
      color: #16a34a;
    }
    
    .estado.inactivo {
      color: #dc2626;
    }
    
    .btn-toggle {
      padding: 8px 16px;
      margin-top: 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-toggle:hover {
      background: #2563eb;
    }
    
    .btn-toggle:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  \`]
})
export class PerfilUsuarioComponent implements OnInit {
  @Input() usuarioId!: number;
  
  usuario: Usuario | null = null;
  cargando = true;
  error: string | null = null;
  actualizando = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  async cargarUsuario() {
    try {
      this.cargando = true;
      this.error = null;
      
      const usuario = await this.http.get<Usuario>(\`/api/usuarios/\$\{this.usuarioId\}\`).toPromise();
      this.usuario = usuario || null;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      this.cargando = false;
    }
  }

  async toggleActivo() {
    if (!this.usuario) return;
    
    try {
      this.actualizando = true;
      
      await this.http.patch(\`/api/usuarios/\$\{this.usuario.id\}/toggle\`, {}).toPromise();
      this.usuario.activo = !this.usuario.activo;
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    } finally {
      this.actualizando = false;
    }
  }
}`,

      'Node.js': `// Ejemplo de servidor Node.js con Express
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Base de datos simulada
let usuarios = [
  { id: 1, nombre: 'Developer', email: 'dev@example.com', activo: true },
  { id: 2, nombre: 'Designer', email: 'design@example.com', activo: false },
  { id: 3, nombre: 'Manager', email: 'manager@example.com', activo: true }
];

// Rutas
app.get('/api/usuarios', (req, res) => {
  const { activo } = req.query;
  
  let resultados = usuarios;
  
  if (activo !== undefined) {
    const esActivo = activo === 'true';
    resultados = usuarios.filter(user => user.activo === esActivo);
  }
  
  res.json({
    success: true,
    data: resultados,
    total: resultados.length
  });
});

app.get('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  
  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: usuario
  });
});

app.post('/api/usuarios', (req, res) => {
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y email son requeridos'
    });
  }
  
  const nuevoUsuario = {
    id: Math.max(...usuarios.map(u => u.id)) + 1,
    nombre,
    email,
    activo: true
  };
  
  usuarios.push(nuevoUsuario);
  
  res.status(201).json({
    success: true,
    data: nuevoUsuario,
    message: 'Usuario creado exitosamente'
  });
});

app.patch('/api/usuarios/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  
  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  usuario.activo = !usuario.activo;
  
  res.json({
    success: true,
    data: usuario,
    message: \`Usuario \$\{usuario.activo ? 'activado' : 'desactivado'\} exitosamente\`
  });
});

app.delete('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  usuarios.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(\`🚀 Servidor ejecutándose en http://localhost:\$\{PORT\}\`);
  console.log(\`📚 API disponible en http://localhost:\$\{PORT\}/api/usuarios\`);
});

module.exports = app;`
    };

    return examples[language] || examples['JavaScript'];
  };

  const handleLanguageChange = (language: string) => {
    if (currentTab) {
      // Auto-update file extension based on language
      const extensions: { [key: string]: string } = {
        'JavaScript': '.js',
        'TypeScript': '.ts',
        'Python': '.py',
        'Java': '.java',
        'C++': '.cpp',
        'C#': '.cs',
        'PHP': '.php',
        'Ruby': '.rb',
        'Go': '.go',
        'Rust': '.rs',
        'Swift': '.swift',
        'Kotlin': '.kt',
        'HTML': '.html',
        'CSS': '.css',
        'JSON': '.json',
        'SQL': '.sql',
        'Bash': '.sh',
        'React': '.jsx'
      };
      
      const extension = extensions[language] || '.txt';
      const baseName = currentTab.title.split('.')[0];
      const newCode = getCodeExample(language);
      
      // Hacer TODAS las actualizaciones en una sola llamada
      updateTab(currentTab.id, { 
        language: language,
        code: newCode,
        title: `${baseName}${extension}`
      });
    }
  };

  const handleCodeChange = (code: string) => {
    if (currentTab) {
      updateTab(currentTab.id, { code });
    }
  };

  if (!currentTab) return null;

  return (
    <div className={`h-full flex ${isEditorDarkMode ? 'bg-gray-900' : THEME_COLORS.main.background}`}>
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className={`
          ${isEditorDarkMode ? 'bg-gray-800 border-gray-700' : `${THEME_COLORS.dashboard.card.background} border-b ${THEME_COLORS.dashboard.card.border}`}
          flex items-center
        `}>
          <div className="flex-1 flex items-center overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 cursor-pointer
                  border-b-2 ${THEME_COLORS.transitions.all}
                  ${activeTab === tab.id 
                    ? 'border-blue-500 bg-blue-500/5' 
                    : `border-transparent ${isEditorDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}`
                  }
                `}
              >
                <Code size={16} className={activeTab === tab.id ? 'text-blue-500' : (isEditorDarkMode ? 'text-gray-400' : THEME_COLORS.dashboard.metadata)} />
                
                <input
                  type="text"
                  value={tab.title}
                  onChange={(e) => handleTitleEdit(tab.id, e.target.value)}
                  className={`
                    bg-transparent border-none outline-none text-sm font-medium
                    ${activeTab === tab.id ? (isEditorDarkMode ? 'text-white' : THEME_COLORS.dashboard.title) : (isEditorDarkMode ? 'text-gray-300' : THEME_COLORS.dashboard.subtitle)}
                    min-w-[80px] max-w-[150px]
                  `}
                  onFocus={(e) => e.target.select()}
                />
                
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => removeTab(tab.id, e)}
                    className={`
                      p-1 rounded hover:bg-red-500/10 hover:text-red-500
                      ${THEME_COLORS.transitions.all}
                    `}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addTab}
            className={`
              flex items-center space-x-1 px-3 py-2 m-2 rounded-lg
              ${THEME_COLORS.topBar.actions.button.background}
              ${THEME_COLORS.topBar.actions.button.text} ${THEME_COLORS.topBar.actions.button.textHover}
              ${THEME_COLORS.transitions.all}
            `}
          >
            <Plus size={16} />
            <span className="text-sm">Tab</span>
          </button>
        </div>

        {/* Editor Header */}
        <div className={`
          ${isEditorDarkMode ? 'bg-gray-800 border-gray-700' : `${THEME_COLORS.dashboard.card.background} border-b ${THEME_COLORS.dashboard.card.border}`}
          p-4 flex items-center justify-between
        `}>
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${isEditorDarkMode ? 'text-gray-300' : THEME_COLORS.dashboard.subtitle}`}>
              Lenguaje:
            </span>
            <LanguageSelector
              value={currentTab.language}
              onChange={handleLanguageChange}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newTheme = !isEditorDarkMode;
                if (onThemeChange) {
                  onThemeChange(newTheme);
                } else {
                  setLocalIsEditorDarkMode(newTheme);
                }
              }}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isEditorDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title={isEditorDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isEditorDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <div className={`text-sm ${isEditorDarkMode ? 'text-gray-400' : THEME_COLORS.dashboard.metadata}`}>
              Líneas: {currentTab.code.split('\n').length}
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1">
          <CodeMirrorEditor
            value={currentTab.code}
            language={currentTab.language}
            onChange={handleCodeChange}
            isDarkMode={isEditorDarkMode}
          />
        </div>
      </div>

      {/* Observations Panel */}
      <div className={`
        w-80 border-l ${isEditorDarkMode ? 'border-gray-700 bg-gray-800' : `${THEME_COLORS.dashboard.card.border} ${THEME_COLORS.dashboard.card.background}`}
        flex flex-col
      `}>
        <div className={`p-4 border-b ${isEditorDarkMode ? 'border-gray-700' : THEME_COLORS.dashboard.card.border}`}>
          <h3 className={`font-semibold ${isEditorDarkMode ? 'text-white' : THEME_COLORS.dashboard.title}`}>
            Observaciones
          </h3>
          <p className={`text-sm ${isEditorDarkMode ? 'text-gray-400' : THEME_COLORS.dashboard.metadata} mt-1`}>
            Agrega notas sobre este conjunto de snippets
          </p>
        </div>
        
        <div className="flex-1 p-4">
          {isEditingObservations ? (
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              onBlur={() => setIsEditingObservations(false)}
              className={`
                w-full h-full resize-none bg-transparent border-none outline-none
                ${isEditorDarkMode ? 'text-white' : THEME_COLORS.dashboard.title}
                focus:ring-2 focus:ring-blue-500/20 rounded-lg p-2
              `}
              placeholder="Agrega tus observaciones aquí..."
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditingObservations(true)}
              className={`
                h-full cursor-text p-2 rounded-lg
                ${observations.includes('Agrega aquí') ? (isEditorDarkMode ? 'text-gray-500' : THEME_COLORS.dashboard.metadata) : (isEditorDarkMode ? 'text-gray-300' : THEME_COLORS.dashboard.subtitle)}
                ${isEditorDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}
                ${THEME_COLORS.transitions.all}
              `}
            >
              {observations}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}