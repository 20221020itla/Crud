// Clase para gestionar las tareas
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.editingId = null;
        this.deleteId = null;
        this.filteredTasks = null;
        this.init();
    }

    init() {
        this.loadTheme();
        this.renderTasks();
        this.setupEventListeners();
        this.updateTaskCount();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Formulario
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Botón cancelar
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Botón limpiar todo
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.clearAllTasks();
        });

        // Header buttons
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportTasks();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            this.importTasks();
        });

        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Modal de confirmación
        document.getElementById('confirmDelete').addEventListener('click', () => {
            this.confirmDelete();
        });

        document.getElementById('cancelDelete').addEventListener('click', () => {
            this.closeModal();
        });

        // Cerrar modal al hacer clic fuera
        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') {
                this.closeModal();
            }
        });
    }
        // Buscador
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

    // Manejar envío del formulario
    handleSubmit() {
        const formData = new FormData(document.getElementById('taskForm'));
        const taskData = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim(),
            priority: formData.get('priority'),
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (this.editingId) {
            // Actualizar tarea existente
            this.updateTask(this.editingId, taskData);
        } else {
            // Crear nueva tarea
            this.createTask(taskData);
        }
    }

    // Crear nueva tarea
    createTask(taskData) {
        const task = {
            id: Date.now().toString(),
            ...taskData
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.resetForm();
        this.showNotification('Tarea creada exitosamente', 'success');
    }

    // Actualizar tarea existente
    updateTask(id, taskData) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = {
                ...this.tasks[index],
                ...taskData,
                id: id,
                createdAt: this.tasks[index].createdAt
            };
            this.saveTasks();
            this.renderTasks();
            this.resetForm();
            this.editingId = null;
            this.showNotification('Tarea actualizada exitosamente', 'success');
        }
    }

    // Eliminar tarea
    deleteTask(id) {
        this.deleteId = id;
        this.showModal();
    }

    // Confirmar eliminación
    confirmDelete() {
        if (this.deleteId) {
            this.tasks = this.tasks.filter(task => task.id !== this.deleteId);
            this.saveTasks();
            this.renderTasks();
            this.deleteId = null;
            this.closeModal();
            this.showNotification('Tarea eliminada exitosamente', 'success');
        }
    }

    // Marcar tarea como completada
    toggleComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            const status = task.completed ? 'completada' : 'pendiente';
            this.showNotification(`Tarea marcada como ${status}`, 'info');
        }
    }

    // Editar tarea
    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingId = id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskPriority').value = task.priority;
            
            document.getElementById('submitBtn').textContent = 'Actualizar Tarea';
            document.getElementById('cancelBtn').style.display = 'block';
            
            // Scroll al formulario
            document.querySelector('.form-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }

    // Cancelar edición
    cancelEdit() {
        this.editingId = null;
        this.resetForm();
    }

    // Limpiar todas las tareas
    clearAllTasks() {
        if (this.tasks.length === 0) {
            this.showNotification('No hay tareas para eliminar', 'warning');
            return;
        }

        if (confirm('¿Estás seguro de que quieres eliminar todas las tareas?')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.showNotification('Todas las tareas han sido eliminadas', 'success');
        }
    }

    // Resetear formulario
    resetForm() {
        document.getElementById('taskForm').reset();
        document.getElementById('submitBtn').textContent = 'Agregar Tarea';
        document.getElementById('cancelBtn').style.display = 'none';
        this.editingId = null;
    }

    // Renderizar tareas
    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const tasksToShow = this.filteredTasks !== null ? this.filteredTasks : this.tasks;

        if (tasksToShow.length === 0) {
            tasksList.innerHTML = '<div class="empty-message">No hay tareas que coincidan con la búsqueda.</div>';
            this.updateTaskCount(tasksToShow);
            return;
        }

        tasksList.innerHTML = tasksToShow.map(task => this.createTaskHTML(task)).join('');
        this.updateTaskCount(tasksToShow);
    }

    // Crear HTML de una tarea
    createTaskHTML(task) {
        const date = new Date(task.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-header">
                    <div>
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                    </div>
                </div>
                
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                
                <div class="task-date">Creada: ${date}</div>
                
                <div class="task-actions">
                    <button class="complete-btn" onclick="taskManager.toggleComplete('${task.id}')">
                        ${task.completed ? 'Desmarcar' : 'Completar'}
                    </button>
                    <button class="edit-btn" onclick="taskManager.editTask('${task.id}')">
                        Editar
                    </button>
                    <button class="delete-btn" onclick="taskManager.deleteTask('${task.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    // Actualizar contador de tareas y estadísticas del header
    updateTaskCount() {
        // Permitir actualizar el contador según el array filtrado
        const tasksArr = arguments.length ? arguments[0] : this.tasks;
        const count = tasksArr.length;
        const completedCount = tasksArr.filter(task => task.completed).length;
        const pendingCount = count - completedCount;

        let countText = `${count} tarea${count !== 1 ? 's' : ''}`;
        if (count > 0) {
            countText += ` (${completedCount} completada${completedCount !== 1 ? 's' : ''}, ${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''})`;
        }
        document.getElementById('taskCount').textContent = countText;

        document.getElementById('totalTasks').textContent = this.tasks.length;
        document.getElementById('completedTasks').textContent = this.tasks.filter(task => task.completed).length;
        document.getElementById('pendingTasks').textContent = this.tasks.filter(task => !task.completed).length;

        const progressPercentage = this.tasks.length > 0 ? Math.round((this.tasks.filter(task => task.completed).length / this.tasks.length) * 100) : 0;
        document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        document.getElementById('progressText').textContent = `${progressPercentage}% completado`;
    }

    // Guardar tareas en localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.handleSearch(document.getElementById('searchInput').value);
    }
    // Buscar tareas
    handleSearch(query) {
        const value = query.trim().toLowerCase();
        if (value === '') {
            this.filteredTasks = null;
        } else {
            this.filteredTasks = this.tasks.filter(task =>
                task.title.toLowerCase().includes(value) ||
                (task.description && task.description.toLowerCase().includes(value))
            );
        }
        this.renderTasks();
    }

    // Mostrar modal de confirmación
    showModal() {
        document.getElementById('confirmModal').style.display = 'block';
    }

    // Cerrar modal
    closeModal() {
        document.getElementById('confirmModal').style.display = 'none';
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;

        // Colores según tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Agregar al DOM
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Exportar tareas
    exportTasks() {
        if (this.tasks.length === 0) {
            this.showNotification('No hay tareas para exportar', 'warning');
            return;
        }

        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `tareas_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Tareas exportadas exitosamente', 'success');
    }

    // Importar tareas
    importTasks() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const tasks = JSON.parse(e.target.result);
                        if (Array.isArray(tasks)) {
                            // Verificar que las tareas tengan la estructura correcta
                            const validTasks = tasks.filter(task => 
                                task.id && task.title && task.priority && 
                                typeof task.completed === 'boolean' && task.createdAt
                            );
                            
                            if (validTasks.length > 0) {
                                this.tasks = validTasks;
                                this.saveTasks();
                                this.renderTasks();
                                this.showNotification(`${validTasks.length} tareas importadas exitosamente`, 'success');
                            } else {
                                throw new Error('No se encontraron tareas válidas');
                            }
                        } else {
                            throw new Error('Formato inválido');
                        }
                    } catch (error) {
                        this.showNotification('Error al importar tareas. Verifica el formato del archivo.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    // Cambiar tema
    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const btnIcon = themeToggle.querySelector('.btn-icon');
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            btnIcon.textContent = '�';
            themeToggle.title = 'Cambiar a tema oscuro';
            localStorage.setItem('theme', 'light');
            this.showNotification('Tema claro activado', 'info');
        } else {
            body.classList.add('dark-theme');
            btnIcon.textContent = '🌑';
            themeToggle.title = 'Cambiar a tema claro';
            localStorage.setItem('theme', 'dark');
            this.showNotification('Tema oscuro activado', 'info');
        }
    }

    // Cargar tema guardado
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeToggle = document.getElementById('themeToggle');
        const btnIcon = themeToggle.querySelector('.btn-icon');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            btnIcon.textContent = '🌑';
            themeToggle.title = 'Cambiar a tema claro';
        } else {
            btnIcon.textContent = '�';
            themeToggle.title = 'Cambiar a tema oscuro';
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
    // Buscador
    document.getElementById('searchInput').addEventListener('input', (e) => {
        window.taskManager.handleSearch(e.target.value);
    });
});

// Función para exportar tareas (opcional)
function exportTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `tareas_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Función para importar tareas (opcional)
function importTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const tasks = JSON.parse(e.target.result);
                    if (Array.isArray(tasks)) {
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                        window.taskManager.tasks = tasks;
                        window.taskManager.renderTasks();
                        window.taskManager.showNotification('Tareas importadas exitosamente', 'success');
                    } else {
                        throw new Error('Formato inválido');
                    }
                } catch (error) {
                    window.taskManager.showNotification('Error al importar tareas', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
} 