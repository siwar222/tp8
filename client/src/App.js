import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (err) {
      console.error('Erreur fetchTasks:', err.message);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(API, { title: newTask });
      setTasks(prev => [res.data, ...prev]); // utilise la réponse serveur (avec _id)
      setNewTask('');
    } catch (err) {
      console.error('Erreur handleAddTask:', err.message);
    }
  };

  const toggleComplete = async (id, current) => {
    try {
      const res = await axios.put(`${API}/${id}`, { completed: !current });
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error('Erreur toggleComplete:', err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Erreur deleteTask:', err.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Liste des tâches</h1>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Ajouter une tâche"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleAddTask} style={{ padding: '8px 12px' }}>Ajouter</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {tasks.map((task) => (
          <li key={task._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            borderBottom: '1px solid #eee'
          }}>
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task._id, task.completed)}
              />
              <span style={{ marginLeft: 8, textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </span>
            </div>
            <div>
              <button onClick={() => deleteTask(task._id)} style={{ marginLeft: 8 }}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
