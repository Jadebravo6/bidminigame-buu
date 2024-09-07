const http = require('http');
const fs = require('fs');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer((req, res) => {
    // Récupérer le chemin vers test.html
    const filePath = path.join(__dirname, 'test.html');

    // Lire le fichier test.html
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end(`Erreur de serveur : ${err}`);
        } else {
            // Définir les en-têtes de réponse
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

const io = socketio(server); // Initialize Socket.IO after server is created

const SPEED_FILE = path.join(__dirname, 'speed.json');

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('saveSpeed', (speed) => {
        fs.writeFile(SPEED_FILE, JSON.stringify({ speed }), (err) => {
            if (err) {
                console.error('Error saving speed:', err);
                socket.emit('saved', 'Error saving speed');
            } else {
                console.log('Speed saved:', speed);
                socket.emit('saved', 'Speed saved successfully');
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
