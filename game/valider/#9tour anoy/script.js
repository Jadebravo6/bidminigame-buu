$(document).ready(function() {
    // Fonction pour afficher la section de sélection des niveaux avec animation de fondu
    function showLevelSelection() {
        $('.modal-content').fadeOut(500, function() {
            $('.level-selection').fadeIn(500);
        });
    }

    // Fonction pour quitter le jeu et revenir à la page d'accueil
    function quitGame() {
        window.location.href = 'index.html'; // Ou autre URL de destination
    }

    // Ajouter un gestionnaire d'événements pour le bouton Quitter
    $('#quit-button').on('click', function() {
        quitGame();
    });

    // Fonction pour cacher les modals et afficher la zone de jeu
    function startGame() {
        $('.modal').fadeOut(500, function() {
            $('#canves').fadeIn(500); // Affiche la zone de jeu
        });
    }

    // Afficher la modal au chargement
    $('#modal-content').fadeIn(500);

    // Clic sur le bouton "Play" pour afficher la section de sélection des niveaux
    $('#play-button').on('click', function() {
        showLevelSelection();
    });

    const infoModal = document.getElementById('info-modal');
    const infoButton = document.getElementById('info-button');
    const infoCloseBtn = document.getElementById('info-close-btn');

    // Affiche la modal des instructions lorsque le bouton info est cliqué
    infoButton.addEventListener('click', () => {
        infoModal.style.display = 'flex';
    });
  
    // Ferme la modal des instructions lorsque le bouton de fermeture est cliqué
    infoCloseBtn.addEventListener('click', () => {
        infoModal.style.display = 'none';
    });
  
    // Ferme la modal des instructions lorsque l'utilisateur clique en dehors de la modal
    window.addEventListener('click', (event) => {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });

    var holding = [],
        moves,
        disksNum = 7,
        minMoves = 127,
        $canves = $('#canves'),
        $restart = $canves.find('.restart'),
        $tower = $canves.find('.tower'),
        $scorePanel = $canves.find('#score-panel'),
        $movesCount = $scorePanel.find('#moves-num'),
        $ratingStars = $scorePanel.find('i'),
        $timer = $canves.find('#timer'),
        rating = 3,
        timerInterval,
        timerSeconds = 0,
        timerLimit = 0; // Time limit for the current difficulty

    // Load sounds
    const beepSound = new Audio('sounds/beep.wav');
    const clickSound = new Audio('sounds/click.wav');
    const swipeSound = new Audio('sounds/swipe.wav'); // Load swipe sound

    // Difficulty times (in seconds)
    const difficultyTimes = {
        easy: 40,
        medium: 120,
        hard: 500,
        high: 200 // Added difficulty "high"
    };

    // Set Rating and final Score
    function setRating(moves) {
        if (moves === 127) {
            $ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
            rating = 2;
        } else if (moves >= 128 && moves <= 228) {
            $ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
            rating = 1;
        } else if (moves >= 229) {
            $ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
            rating = 0;
        }    
        return { score: rating };
    }

    // Start Timer
    function startTimer() {
        timerSeconds = timerLimit;
        $timer.text(formatTime(timerSeconds));
        timerInterval = setInterval(function() {
            timerSeconds--;
            $timer.text(formatTime(timerSeconds));
            beepSound.play(); // Play beep sound
            
            // Change background when timer reaches 30 seconds
            if (timerSeconds === 30) {
                $('body').css('background', 'linear-gradient(to bottom, #b63c17, #1d0d08)');
               // $('.tower').css('border-bottom', '5px solid #fff');
            
                // Change la couleur du pseudo-élément :before
           /*     var style = document.createElement('style');
                style.innerHTML = `
                    .tower::before {
                        background-color: #fff;
                    }
                `;
                document.head.appendChild(style); */ 
            }
            

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                $('#lose-modal').fadeIn(500); // Show lose modal when time is up
            }
        }, 1000);
    }

    // Format time in MM:SS
    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var seconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Stop Timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Reset Timer
    function resetTimer() {
        stopTimer();
        timerSeconds = timerLimit;
        $timer.text(formatTime(timerSeconds));
        startTimer();
    }

    // Init Game
    function initGame(tower) {
        $tower.html('');
        moves = 0;
        $movesCount.html(0);
        holding = [];
        for (var i = 1; i <= disksNum; i++) {
            tower.prepend($('<li class="disk disk-' + i + '" data-value="' + i + '"></li>'));
        }
        $ratingStars.each(function() {
            $(this).removeClass('fa-star-o').addClass('fa-star');
        });
        resetTimer();
    }

    // Game Logic
    function countMove() {
        moves++;
        $movesCount.html(moves);

        if (moves > minMoves - 1) {
            if ($tower.eq(1).children().length === disksNum || $tower.eq(2).children().length === disksNum) {
                $('#win-modal').fadeIn(500); // Show win modal
                stopTimer(); // Stop the timer when the game is won
            }
        }
        
        setRating(moves);
    }

    function tower(tower) {
        var $disks = tower.children(),
            $topDisk = tower.find(':last-child'),
            topDiskValue = $topDisk.data('value'),
            $holdingDisk = $canves.find('.hold');

        if ($holdingDisk.length !== 0) {
            // Disk is being placed
            if (topDiskValue === holding[0]) {
                $holdingDisk.removeClass('hold');
                swipeSound.volume = 0.1; // Set volume to a low level
                swipeSound.play(); // Play swipe sound
            } else if (topDiskValue === undefined || topDiskValue > holding[0]) {
                $holdingDisk.remove();
                tower.append($('<li class="disk disk-' + holding[0] + '" data-value="' + holding[0] + '"></li>'));
                countMove();
                swipeSound.volume = 0.1; // Set volume to a low level
                swipeSound.play(); // Play swipe sound
            }
        } else if ($topDisk.length !== 0) {
            // Disk is being picked up
            clickSound.play(); // Play click sound
            
            $topDisk.addClass('hold');
            holding[0] = topDiskValue;
        }
    }

    // Display Level Selection Modal
    function showLevelModal() {
        $('#level-modal').fadeIn(500);
    }

    // Event Handlers
    $(document).on('click', '.level-button', function() {
        var level = $(this).data('level');
        var difficulty = $(this).data('difficulty');
        disksNum = level;
        minMoves = Math.pow(2, disksNum) - 1;
        timerLimit = difficultyTimes[difficulty]; // Set time limit based on difficulty

        console.log(`Selected Level: ${level}`);
        console.log(`Selected Difficulty: ${difficulty}`);
        console.log(`Timer Limit: ${timerLimit} seconds`);

        $('#level-modal').fadeOut(500);
        startGame(); // Hide modals and show the game area
        initGame($tower.eq(0));
    });

    $canves.on('click', '.tower', function() {
        var $this = $(this);
        tower($this);
    });

    // Directly restart the game when the restart button is clicked
    $restart.on('click', function() {
        initGame($tower.eq(0)); // Restart the game without modal
        $('body').css('background', 'linear-gradient(to bottom, #e0e5e7, #b6bfc7)');
 // Reset the tower border color

        // Remove the dynamically added style for the pseudo-element :before
        $('style[data-custom-style]').remove();
    
        // Optionally, reset the tower before style to its original state if needed
        var initialStyle = document.createElement('style');
        initialStyle.setAttribute('data-custom-style', 'true'); // Add an attribute to identify this style
        initialStyle.innerHTML = `
            .tower::before {
                background-color: #00000; /* Reset to original color */
            }
        `;
        document.head.appendChild(initialStyle);

    });

    // Show the modal when the game is won or lost
    $('.modal').on('click', '.close', function() {
        $(this).closest('.modal').fadeOut(500);
    });

    // Hide the level selection modal when the close button is clicked
    $('#level-close-btn').on('click', function() {
        $('#level-modal').fadeOut(500);
    });
});
