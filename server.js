const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb://localhost/todoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à la base de données MongoDB'))
.catch((err) => console.log('Erreur de connexion à MongoDB:', err));

// Middleware pour lire le JSON
app.use(express.json());

// Route GET pour récupérer les tâches
app.get('/tasks', (req, res) => {
  // Pour l’instant, on renvoie une liste vide
  res.send([]);
});

// Route POST pour ajouter une tâche
app.post('/tasks', (req, res) => {
  // Pour l’instant, on répond juste un message
  res.send({ message: 'Tâche ajoutée' });
});

// Démarrage du serveur
app.listen(5000, () => {
  console.log("Serveur backend en cours d'exécution sur le port 5000");
});
