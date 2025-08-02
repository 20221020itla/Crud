# 📝 CRUD Sencillo - Gestor de Tareas

Un gestor de tareas simple y elegante construido con HTML, CSS y JavaScript vanilla. Permite crear, leer, actualizar y eliminar tareas con una interfaz moderna y responsiva.

## ✨ Características

- **CRUD Completo**: Crear, Leer, Actualizar y Eliminar tareas
- **Interfaz Moderna**: Diseño limpio y responsivo
- **Persistencia Local**: Las tareas se guardan en el navegador
- **Prioridades**: Sistema de prioridades (Baja, Media, Alta)
- **Estado de Completado**: Marcar tareas como completadas
- **Notificaciones**: Feedback visual para todas las acciones
- **Modal de Confirmación**: Para eliminar tareas de forma segura
- **Responsive**: Funciona perfectamente en móviles y tablets

## 🚀 Cómo usar

1. **Abrir la aplicación**: Simplemente abre el archivo `index.html` en tu navegador
2. **Agregar tareas**: Completa el formulario y haz clic en "Agregar Tarea"
3. **Editar tareas**: Haz clic en "Editar" en cualquier tarea
4. **Completar tareas**: Haz clic en "Completar" para marcar como terminada
5. **Eliminar tareas**: Haz clic en "Eliminar" y confirma la acción
6. **Limpiar todo**: Usa "Limpiar Todo" para eliminar todas las tareas

## 📁 Estructura del Proyecto

```
CRUDsencillo/
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos CSS
├── script.js       # Lógica JavaScript
└── README.md       # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Grid y Flexbox
- **JavaScript ES6+**: Lógica de la aplicación
- **LocalStorage**: Persistencia de datos
- **CSS Grid**: Layout responsivo

## 📱 Funcionalidades Detalladas

### Crear Tareas
- Título obligatorio
- Descripción opcional
- Selección de prioridad
- Fecha de creación automática

### Gestionar Tareas
- Ver todas las tareas en tiempo real
- Contador de tareas (total, completadas, pendientes)
- Filtrado visual por estado

### Editar Tareas
- Modificar título, descripción y prioridad
- Botón de cancelar edición
- Scroll automático al formulario

### Eliminar Tareas
- Modal de confirmación
- Eliminación individual
- Opción de limpiar todas las tareas

### Persistencia
- Datos guardados en localStorage
- Persistencia entre sesiones
- No se pierden datos al cerrar el navegador

## 🎨 Características de Diseño

- **Gradiente de fondo**: Fondo atractivo con gradiente
- **Tarjetas elevadas**: Efecto de sombra en las tarjetas
- **Animaciones suaves**: Transiciones y hover effects
- **Colores por prioridad**: Código de colores para prioridades
- **Responsive design**: Adaptable a cualquier dispositivo

## 🔧 Funciones JavaScript Principales

- `TaskManager`: Clase principal que gestiona toda la lógica
- `createTask()`: Crear nuevas tareas
- `updateTask()`: Actualizar tareas existentes
- `deleteTask()`: Eliminar tareas
- `toggleComplete()`: Cambiar estado de completado
- `renderTasks()`: Renderizar lista de tareas
- `showNotification()`: Mostrar notificaciones

## 📊 Almacenamiento de Datos

Las tareas se almacenan en el navegador usando `localStorage` con la siguiente estructura:

```javascript
{
  id: "timestamp",
  title: "Título de la tarea",
  description: "Descripción opcional",
  priority: "baja|media|alta",
  completed: false,
  createdAt: "2024-01-01T12:00:00.000Z"
}
```

## 🌟 Características Avanzadas

- **Prevención XSS**: Escape de HTML para seguridad
- **Validación de formularios**: Campos requeridos y validación
- **Notificaciones dinámicas**: Feedback visual para todas las acciones
- **Scroll suave**: Navegación fluida en la interfaz
- **Optimización de rendimiento**: Renderizado eficiente

## 🚀 Instalación y Uso

1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador web
3. ¡Comienza a gestionar tus tareas!

No se requiere instalación de dependencias ni configuración adicional.

## 📝 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

---

¡Disfruta gestionando tus tareas de forma simple y eficiente! 🎉 