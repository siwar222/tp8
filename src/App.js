import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  // Récupérer toutes les tâches depuis le backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      console.log('Tâches récupérées:', res.data);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Erreur fetchTasks:', err.message);
      alert('Erreur lors du chargement des tâches: ' + err.message);
    }
  };

  // Ajouter une tâche
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(API, { title: newTask });
      setNewTask('');
      // Recharger toutes les tâches pour s'assurer qu'elles sont à jour
      await fetchTasks();
    } catch (err) {
      console.error('Erreur handleAddTask:', err.message);
      alert('Erreur lors de l\'ajout de la tâche: ' + err.message);
    }
  };

  // Marquer une tâche comme terminée / non terminée
  const toggleComplete = async (id, current) => {
    try {
      const res = await axios.put(`${API}/${id}`, { completed: !current });
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error('Erreur toggleComplete:', err.message);
    }
  };

  // Supprimer une tâche
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Erreur deleteTask:', err.message);
    }
  };

  // Démarrer l'édition d'une tâche
  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  // Sauvegarder les modifications
  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      cancelEdit();
      return;
    }
    try {
      const res = await axios.put(`${API}/${id}`, { title: editTitle });
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      console.error('Erreur saveEdit:', err.message);
    }
  };

  // Filtrer les tâches
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // all
  });

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: '40px auto', 
      fontFamily: 'Arial, sans-serif',
      padding: '0 20px'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: 30 }}>
        Liste des tâches
      </h1>

      {/* Ajout de tâches */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginBottom: 20,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f9f9f9'
      }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleAddTask();
          }}
          placeholder="Ajouter une nouvelle tâche..."
          style={{ 
            flex: 1, 
            padding: 12, 
            borderRadius: 4, 
            border: '2px solid #ddd',
            fontSize: 16
          }}
        />
        <button
          onClick={handleAddTask}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Ajouter
        </button>
      </div>

      {/* Filtrage */}
      <div style={{ 
        marginBottom: 25, 
        display: 'flex', 
        gap: 10,
        justifyContent: 'center'
      }}>
        <button 
          onClick={() => setFilter('all')} 
          style={{ 
            cursor: 'pointer',
            padding: '10px 20px',
            border: '2px solid #2196F3',
            borderRadius: 4,
            backgroundColor: filter === 'all' ? '#2196F3' : 'white',
            color: filter === 'all' ? 'white' : '#2196F3',
            fontSize: 14,
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
        >
          Toutes ({tasks.length})
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          style={{ 
            cursor: 'pointer',
            padding: '10px 20px',
            border: '2px solid #4CAF50',
            borderRadius: 4,
            backgroundColor: filter === 'completed' ? '#4CAF50' : 'white',
            color: filter === 'completed' ? 'white' : '#4CAF50',
            fontSize: 14,
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
        >
          Terminées ({tasks.filter(t => t.completed).length})
        </button>
        <button 
          onClick={() => setFilter('pending')} 
          style={{ 
            cursor: 'pointer',
            padding: '10px 20px',
            border: '2px solid #FF9800',
            borderRadius: 4,
            backgroundColor: filter === 'pending' ? '#FF9800' : 'white',
            color: filter === 'pending' ? 'white' : '#FF9800',
            fontSize: 14,
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
        >
          Non terminées ({tasks.filter(t => !t.completed).length})
        </button>
      </div>

      {/* Liste des tâches */}
      {filteredTasks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: 40, 
          color: '#666',
          fontSize: 16 
        }}>
          {tasks.length === 0 
            ? 'Aucune tâche. Ajoutez-en une !' 
            : filter === 'completed' 
              ? 'Aucune tâche terminée' 
              : filter === 'pending' 
                ? 'Aucune tâche en attente' 
                : 'Aucune tâche'}
        </div>
      ) : (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map(task => (
          <li
            key={task._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 15,
              border: '1px solid #ddd',
              backgroundColor: task.completed ? '#f0f0f0' : 'white',
              borderRadius: 8,
              marginBottom: 10,
              gap: 12,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minHeight: 60
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1,
              minWidth: 0
            }}>
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={() => toggleComplete(task._id, task.completed)}
                style={{ 
                  marginRight: 12,
                  width: 20,
                  height: 20,
                  cursor: 'pointer'
                }}
                title={task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
              />
              {editingId === task._id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') saveEdit(task._id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  style={{
                    flex: 1,
                    padding: 4,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    marginRight: 8
                  }}
                  autoFocus
                />
              ) : (
                <span
                  style={{
                    marginLeft: 8,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'gray' : 'black',
                    flex: 1
                  }}
                >
                  {task.title}
                </span>
              )}
            </div>
            <div style={{ 
              display: 'flex', 
              gap: 10, 
              alignItems: 'center',
              flexShrink: 0,
              marginLeft: 10
            }}>
              {editingId === task._id ? (
                <>
                  <button
                    onClick={() => saveEdit(task._id)}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 'bold',
                      minWidth: 110,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#45a049';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#4CAF50';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ✓ Sauvegarder
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      backgroundColor: '#757575',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 'bold',
                      minWidth: 110,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#616161';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#757575';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ✕ Annuler
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(task)}
                    style={{
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 'bold',
                      minWidth: 110,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#0b7dda';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#2196F3';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="Modifier cette tâche"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
                        deleteTask(task._id);
                      }
                    }}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 'bold',
                      minWidth: 110,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#da190b';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#f44336';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="Supprimer cette tâche"
                  >
                    🗑️ Supprimer
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

export default App;
