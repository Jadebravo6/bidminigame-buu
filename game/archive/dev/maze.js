// Code JavaScript pour générer le labyrinthe

window.addEventListener('load', function() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    
    const width = 25; // Largeur du labyrinthe
    const height = 25; // Hauteur du labyrinthe
    
    // Taille de chaque cellule du labyrinthe
    const cellSize = 20;
    
    // Fonction pour créer une grille de cellules
    function createGrid(width, height) {
        const grid = [];
        for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(true); // true représente un mur
            }
            grid.push(row);
        }
        return grid;
    }
    
    // Fonction pour dessiner la grille sur le canvas
    function drawGrid(grid) {
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (grid[i][j]) {
                    ctx.fillStyle = '#ffffff'; // Couleur des murs
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        }
    }
    
    // Fonction pour générer le labyrinthe
    function generateMaze() {
        const grid = createGrid(width, height);
        // Ici, vous devriez implémenter l'algorithme de génération de labyrinthe
        // Par exemple, l'algorithme Recursive Backtracker
        // Pour cet exemple simple, on laisse le labyrinthe plein de murs
        return grid;
    }
    
    // Générer le labyrinthe
    const mazeGrid = generateMaze();
    
    // Dessiner le labyrinthe sur le canvas
    drawGrid(mazeGrid);
});
