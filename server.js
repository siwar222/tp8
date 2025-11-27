const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   // ⭐ AJOUT IMPORTANT

const Task = require('./models/Task');  // ⭐ IMPORT DU MODELE

const app = express();

// Activer CORS pour autoriser React à accéder au backend
app.use(cors());   

// Middleware pour lire le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost/todoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à la base de données MongoDB'))
.catch((err) => console.log('Erreur de connexion à MongoDB:', err));


//  ROUTE GET — Récupérer les tâches depuis MongoDB
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();     // on récupère toutes les tâches
  res.send(tasks);
});

//  ROUTE POST — Ajouter une tâche dans MongoDB
app.post('/tasks', async (req, res) => {
  const newTask = new Task({
    title: req.body.title,
    completed: false
  });

  await newTask.save();  // on sauvegarde dans la DB

  res.send({ message: 'Tâche ajoutée', task: newTask });
});

// Démarrage du serveur
app.listen(5000, () => {
  console.log("Serveur backend en cours d'exécution sur le port 5000");
});
