const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware pour désactiver CORS (uniquement pour le développement)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.post('/api/scores', (req, res) => {
  const scoreData = req.body;

  // Enregistrez les données du score dans un fichier JSON ou une base de données
  // (Exemple basique : enregistrement dans un fichier JSON)
  const scores = JSON.parse(fs.readFileSync('scores.json', 'utf-8')) || [];
  scores.push(scoreData);
  fs.writeFileSync('scores.json', JSON.stringify(scores, null, 2), 'utf-8');

  res.status(200).json({ message: 'Score enregistré avec succès.' });
});

app.listen(port, () => {
  console.log(`Serveur Node.js écoutant sur le port ${port}`);
});
