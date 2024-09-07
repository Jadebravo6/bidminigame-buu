var startSeqs = {};
var startNum = 0;

$(document).ready(function () {
  var $slots = $("#example1 ul"); // Sélectionnez tous les éléments de la liste
  var currentSlotIndex = 0; // Variable pour suivre l'index du slot actuellement en rotation
  var useFixedNumber = false; // Variable booléenne pour déterminer si les chiffres dans chaque slot seront fixes à 7 ou aléatoires
  var spinningCount = 0; // Nombre de slots actuellement en rotation
  var clickCount = 0;

  function checkAllSlotsReturned() {
    // Vérifie si tous les slots sont terminés
    if (spinningCount === $slots.length) {
      // Désactiver le bouton #btn-example1
      $("#btn-example1").prop("disabled", true);
    }
  }

  // Fonction pour redémarrer les emplacements et relancer le processus de rotation des slots
  function rebootProcess() {
    // Recharger la page
    location.reload();

    $("#btn-example1").prop("disabled", false);
  }

  // Gestionnaire d'événements pour le bouton "Recommencer"
  $("#recommencerBtn").click(function () {
    // Redémarrer le processus
    rebootProcess();
  });

  // Fonction pour afficher le message JACKPOT sur le canvas et lancer les confettis
  function showJackpotMessage() {
    var canvas = document.getElementById("jackpotCanvas");
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoyer le canvas
      ctx.font = 'bold 50px "Casino", sans-serif';
      ctx.fillStyle = "yellow";
      ctx.textAlign = "center";
      ctx.fillText("JACKPOT!!!!!!!!", canvas.width / 2, canvas.height / 2);

      // Utiliser js-confetti pour lancer les confettis
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        confettiRadius: 20, // Taille des confettis
        confettiNumber: 200, // Nombre de confettis
        confettiColors: ["#FFD700", "#FFC700", "#FFB700", "#FFA700", "#FF9700"], // Nuances de doré
      });
    }
  }

  // Fonction pour afficher un message lorsque aucun jackpot n'est obtenu
  function showSorryMessage() {
    var canvas = document.getElementById("jackpotCanvas");
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoyer le canvas
      ctx.font = 'bold 30px "Casino", sans-serif';
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText(
        "How sorry, try again!",
        canvas.width / 2,
        canvas.height / 2
      );
    }
  }

  // Fonction pour démarrer ou arrêter la rotation des slots avec le bouton #btn-example1
  // Gestionnaire d'événements pour démarrer ou arrêter la rotation des slots
  $("#btn-example1").click(function () {
    var $button = $(this);

    // Ajoutez la classe "clicked" au bouton lorsque cliqué
    $button.addClass("clicked");

    // Après un court délai, retirez la classe "clicked"
    setTimeout(function () {
      $button.removeClass("clicked");
    }, 400); // Délai correspondant à la durée de transition en millisecondes

    // Vérifie si tous les slots sont déjà en cours de rotation

    var allSpinning = $slots.is(":animated");
    clickCount++;

    // Affiche le nombre de clics dans la console
    console.log("Nombre de clics sur le bouton:", clickCount);

    // Si tous les slots sont déjà en cours de rotation, arrêtez-les
    if (allSpinning) {
      // Arrêtez tous les slots en rotation
      $slots.stopSpin();
    } else {
      // Sinon, commencez la rotation des slots
      var endNums = []; // Tableau pour stocker les chiffres finaux de chaque slot

      // Réinitialise le compteur de slots en rotation
      spinningCount = 0;

      // Commencez un spin pour chaque slot
      $slots.each(function (index, slot) {
        var endNum;
        if (useFixedNumber) {
          // Si useFixedNumber est true, chaque slot affichera 7
          endNum = 7;
        } else {
          // Sinon, générez un nombre aléatoire entre 0 et 4 pour chaque slot
          endNum = Math.floor(Math.random() * 7);
        }
        endNums.push(endNum); // Ajouter le chiffre final à endNums

        $(slot).playSpin({
          endNum: endNum, // Utiliser la valeur déterminée pour chaque slot
          manualStop: true, // Activer le stop manuel
          onFinish: function (totalNum) {
            console.log(totalNum); // Afficher le résultat total à la console

            // Incrémente le compteur de slots terminés
            spinningCount++;

            // Vérifie si tous les slots ont terminé leur animation
            if (spinningCount === $slots.length) {
              // Vérifiez si tous les chiffres dans endNums sont identiques
              var sameNumber = endNums.every(function (num) {
                return num === endNums[0];
              });

              // Si tous les chiffres sont identiques, affichez le message de jackpot
              if (sameNumber) {
                showJackpotMessage();
              } else {
                showSorryMessage(); // Afficher le message de désolé
              }
            }

            // Vérifie si tous les slots sont retournés
            checkAllSlotsReturned();
          },
        });
      });

      // Ajouter la fonction pour arrêter la rotation des slots lorsque le bouton est cliqué
      $("#btn-example1").click(stopSlotsRotation);
    }
  });

  // Fonction pour arrêter la rotation des slots
  function stopSlotsRotation() {
    // Arrêtez le slot actuel en rotation
    $slots.eq(currentSlotIndex).stopSpin();

    // Passez au slot suivant
    currentSlotIndex++;

    // Réinitialiser l'index si nous avons dépassé le dernier slot
    if (currentSlotIndex >= $slots.length) {
      currentSlotIndex = 0;
    }
  }
});

// Définition de la fonction playSpin dans le prototype jQuery
$.fn.playSpin = function (options) {
  if (this.length) {
    if ($(this).is(":animated")) return; // Retourne faux si cet élément est en cours d'animation
    startSeqs["mainSeq" + ++startNum] = {};
    $(this).attr("data-playslot", startNum);

    var total = this.length;
    var thisSeq = 0;

    if (typeof options == "undefined") {
      options = new Object();
    }

    var endNums = [];
    if (typeof options.endNum != "undefined") {
      if ($.isArray(options.endNum)) {
        endNums = options.endNum;
      } else {
        endNums = [options.endNum];
      }
    }

    for (var i = 0; i < this.length; i++) {
      if (typeof endNums[i] == "undefined") {
        endNums.push(0);
      }
    }

    startSeqs["mainSeq" + startNum]["totalSpinning"] = total;
    return this.each(function () {
      options.endNum = endNums[thisSeq];
      startSeqs["mainSeq" + startNum]["subSeq" + ++thisSeq] = {};
      startSeqs["mainSeq" + startNum]["subSeq" + thisSeq]["spinning"] = true;
      var track = {
        total: total,
        mainSeq: startNum,
        subSeq: thisSeq,
      };
      new slotMachine(this, options, track);
    });
  }
};

// Définition de la fonction stopSpin dans le prototype jQuery
$.fn.stopSpin = function () {
  if (this.length) {
    if (!$(this).is(":animated")) return; // Retourne faux si cet élément n'est pas en cours d'animation
    if ($(this)[0].hasAttribute("data-playslot")) {
      $.each(
        startSeqs["mainSeq" + $(this).attr("data-playslot")],
        function (index, obj) {
          obj["spinning"] = false;
        }
      );
    }
  }
};

// Définition du constructeur de la machine à sous
var slotMachine = function (el, options, track) {
  var slot = this;
  slot.$el = $(el);

  slot.defaultOptions = {
    easing: "swing",
    time: 4000,
    loops: 6,
    manualStop: false,
    useStopTime: false,
    stopTime: 5000,
    stopSeq: "random",
    endNum: 0,
    onEnd: $.noop,
    onFinish: $.noop,
  };

  slot.spinSpeed = 0;
  slot.loopCount = 0;

  slot.init = function () {
    slot.options = $.extend({}, slot.defaultOptions, options);
    slot.setup();
    slot.startSpin();
  };

  slot.setup = function () {
    var $li = slot.$el.find("li").first();
    slot.liHeight = $li.innerHeight() + 19.2;
    slot.liCount = slot.$el.children().length;
    slot.listHeight = (slot.liHeight - 18) * slot.liCount;
    slot.spinSpeed = slot.options.time / slot.options.loops;

    $li.clone().appendTo(slot.$el);

    if (slot.options.stopSeq == "leftToRight") {
      if (track.subSeq != 1) {
        slot.options.manualStop = true;
      }
    } else if (slot.options.stopSeq == "rightToLeft") {
      if (track.total != track.subSeq) {
        slot.options.manualStop = true;
      }
    }
  };

  slot.startSpin = function () {
    slot.$el
      .css("top", -slot.listHeight)
      .animate({ top: "0px" }, slot.spinSpeed, "linear", function () {
        slot.lowerSpeed();
      });
  };

  slot.lowerSpeed = function () {
    slot.loopCount++;

    if (
      slot.loopCount < slot.options.loops ||
      (slot.options.manualStop &&
        startSeqs["mainSeq" + track.mainSeq]["subSeq" + track.subSeq][
          "spinning"
        ])
    ) {
      slot.startSpin();
    } else {
      slot.endSpin();
    }
  };

  slot.endSpin = function () {
    // Si endNum n'est pas spécifié dans les options, on le fixe à 1 par défaut
    if (slot.options.endNum == 0) {
      slot.options.endNum = 1;
    }

    // Assure que endNum est dans la plage valide (entre 1 et le nombre total d'éléments de la liste)
    if (slot.options.endNum < 1 || slot.options.endNum > slot.liCount) {
      slot.options.endNum = 1;
    }

    // Calcule la position finale en fonction de endNum
    var finalPos = -(slot.liHeight * slot.options.endNum - slot.liHeight);

    // Réduit le temps final d'animation pour accélérer l'apparition du dernier élément
    var finalTime = 500; // Réglez cette valeur selon vos préférences pour ajuster la vitesse

    // Anime les éléments de la liste vers la position finale avec la nouvelle vitesse
    slot.$el
      .css("top", -slot.listHeight)
      .animate({ top: finalPos }, finalTime, slot.options.easing, function () {
        // Supprime le dernier élément de la liste après l'animation
        slot.$el.find("li").last().remove();

        // Notifie la fin de l'animation en appelant la fonction onEnd et onFinish si elles sont spécifiées dans les options
        slot.endAnimation(slot.options.endNum);
        if ($.isFunction(slot.options.onEnd)) {
          slot.options.onEnd(slot.options.endNum);
        }

        // Vérifie si toutes les animations sont terminées et appelle la fonction onFinish si nécessaire
        if (startSeqs["mainSeq" + track.mainSeq]["totalSpinning"] == 0) {
          var totalNum = "";
          $.each(
            startSeqs["mainSeq" + track.mainSeq],
            function (index, subSeqs) {
              if (typeof subSeqs == "object") {
                totalNum += subSeqs["endNum"].toString();
              }
            }
          );
          if ($.isFunction(slot.options.onFinish)) {
            slot.options.onFinish(totalNum);
          }
        }
      });
  };

  slot.endAnimation = function (endNum) {
    if (slot.options.stopSeq == "leftToRight" && track.total != track.subSeq) {
      startSeqs["mainSeq" + track.mainSeq]["subSeq" + (track.subSeq + 1)][
        "spinning"
      ] = false;
    } else if (slot.options.stopSeq == "rightToLeft" && track.subSeq != 1) {
      startSeqs["mainSeq" + track.mainSeq]["subSeq" + (track.subSeq - 1)][
        "spinning"
      ] = false;
    }
    startSeqs["mainSeq" + track.mainSeq]["totalSpinning"]--;
    startSeqs["mainSeq" + track.mainSeq]["subSeq" + track.subSeq]["endNum"] =
      endNum;
  };

  slot.randomRange = function (low, high) {
    return Math.floor(Math.random() * (1 + high - low)) + low;
  };

  this.init();
};
