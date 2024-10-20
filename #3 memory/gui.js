// gui.js

$(document).ready(function() {
    // Fonction pour afficher la modal de démarrage
    function showStartModal() {
        $('#modal-content').fadeIn(500);
    }

    // Fonction pour cacher la modal et commencer le jeu
    function startGame() {
        $('.modal').fadeOut(500, function() {
            $('#game-screen').fadeIn(500); // Affiche la zone de jeu
            // Déclenche un événement personnalisé pour indiquer que le jeu doit démarrer
            $(document).trigger('startGame');
        });
    }

    // Fonction pour afficher la modal d'informations
    function showInfoModal() {
        const infoModal = document.getElementById('info-modal');
        infoModal.style.display = 'flex';
    }

    // Fonction pour cacher la modal d'informations
    function hideInfoModal() {
        const infoModal = document.getElementById('info-modal');
        infoModal.style.display = 'none';
    }

    // Afficher la modal de démarrage au chargement
    showStartModal();

    // Clic sur le bouton "Play" pour commencer le jeu
    $('#play-button').on('click', function() {
        startGame();
    });

    // Clic sur le bouton "Info" pour afficher la modal d'informations
    $('#info-button').on('click', function() {
        showInfoModal();
    });

    // Clic sur le bouton de fermeture de la modal d'informations
    $('#info-close-btn').on('click', function() {
        hideInfoModal();
    });

    // Fermer la modal d'informations si l'utilisateur clique en dehors
    window.addEventListener('click', function(event) {
        const infoModal = document.getElementById('info-modal');
        if (event.target === infoModal) {
            hideInfoModal();
        }
    });

    // Clic sur le bouton Quitter pour quitter le jeu
    $('#quit-button').on('click', function() {
        window.location.href = 'index.html'; // Ou autre URL de destination
    });

    // Clic sur le bouton de fermeture de la modal de niveau
    $('#level-close-btn').on('click', function() {
        $('#level-modal').fadeOut(500);
    });
});
