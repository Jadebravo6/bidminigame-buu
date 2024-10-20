const maxSlotSize = 7;















$(document).ready(function () {
  const $slots = $("#example1 ul");
  const fixedNumber = Math.floor(Math.random() * maxSlotSize);
  let currentSlotIndex = 0;
  let useFixedNumber = true;
  let spinningCount = 0;
  let clickCount = 0;
  let startSeqs = {};
  let startNum = 0;






  // Créer un objet Audio pour le son de défilement
  const scrollSound = new Audio('../assets/k.wav');
    // Créer un objet Audio pour le son de défilement
    const buttonSound = new Audio('../assets/button.mp3');
  
  scrollSound.loop = true;


  // Définir le volume du son (0.1 correspond à 10% du volume maximal)
scrollSound.volume = 0.5;

  // Créer un objet Audio pour le son à jouer lorsque les slots s'arrêtent
const stopSound = new Audio('../assets/ding.wav');

  const checkAllSlotsReturned = () => {
    if (spinningCount === $slots.length) {


      $("#btn-example1").prop("disabled", true);
      scrollSound.pause();



    }
  };

  const rebootProcess = () => {
    location.reload();
    $("#btn-example1").prop("disabled", false);
  };

  $("#recommencerBtn").click(rebootProcess);


  // Ajouter les événements click pour les boutons de rechargement et de redirection
  $("#reloadButton").click(function() {
    location.reload();
  });

  $("#homeButton").click(function() {
    window.location.href = "http://cbid.biderclic.com"; // Remplace "index.html" par l'URL de la page d'accueil
  });










  const showJackpotMessage = () => {
    const congratDom = document.getElementById("congrat");
    congratDom.classList.remove("animate__headShake");
    congratDom.classList.add("animate__tada");
    document.querySelector(".dimmer").style.zIndex = 99;
    congratDom.style.display = "flex";
  
    // Utiliser js-confetti pour lancer les confettis
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      confettiRadius: 20,
      confettiNumber: 200,
      confettiColors: ["#FFD700", "#FFC700", "#FFB700", "#FFA700", "#FF9700"],
    });
  
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Afficher le loader
  
    // Code pour envoyer la requête API
    const parseJwt = (token) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    };
  
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mjg3NjMzMTIsImV4cCI6MTcyODg0OTcxMiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImlkZW50aWZpZXIiOiIyNDM5MDAwMDAwMjYiLCJnZW5kZXIiOiJGIiwiYmlydGhEYXRlIjp7ImRhdGUiOiIyMDA5LTA2LTAzIDIwOjI2OjQ2LjAwMDAwMCIsInRpbWV6b25lX3R5cGUiOjMsInRpbWV6b25lIjoiVVRDIn0sImdpdmVuTmFtZSI6IsOJbWlsaWUiLCJmYW1pbHlOYW1lIjoiQ0FSVEVSIiwiYXZhdGFyIjoiL3VwbG9hZHMvaW1hZ2VzL2F2YXRhci82NmE2MTcyZmQ3ZmI1MzQ0Mjc4OTAxLmpwZyIsInVzZXJuYW1lIjoiRW15IiwiaWQiOiIxZWY0YTk3ZS03ZTAyLTY2ODQtOTcyOS1jM2E3YmM1ZTNiNTQiLCJzdGF0dXMiOjEsImNyZWF0ZWRBdCI6eyJkYXRlIjoiMjAyNC0wNy0xOCAwODo1MDowOC4wMDAwMDAiLCJ0aW1lem9uZV90eXBlIjozLCJ0aW1lem9uZSI6IlVUQyJ9LCJpdEFjdGl2YXRlZCI6dHJ1ZSwicGhvbmUiOiIyNDM5MDAwMDAwMjYiLCJlbWFpbCI6bnVsbCwibG9naW5Db3VudCI6Mjc1LCJmaXJzdExvZ2luIjp7ImRhdGUiOiIxOTcwLTAyLTIyIDAzOjM2OjE2LjAwMDAwMCIsInRpbWV6b25lX3R5cGUiOjMsInRpbWV6b25lIjoiVVRDIn0sImN1cnJlbmN5Ijp7ImlkIjoiMWVmNGE5N2UtNzMyMS02ZGI0LThhZjItYzNhN2JjNWUzYjU0IiwibmFtZSI6IlVTRCJ9LCJ3YWxsZXQiOiIxZWY0YTk4OC0zNGFiLTY3OWMtYmYyMi1jM2E3YmM1ZTNiNTQiLCJiaWRQcmljZXMiOlt7IlVTRCI6MSwiYmlkcyI6MTAwMH0seyJFVVIiOjEsImJpZHMiOjEwMDB9LHsiQ0ZBIjoxMDAsImJpZHMiOjE1MH1dLCJjb3VudHJ5IjoiQ0QiLCJmbGFnIjp7Im5hbWUiOiJDb25nbyAtIEtpbnNoYXNhIiwiY29kZSI6IkNEIiwidW5pY29kZSI6IlUrMUYxRTggVSsxRjFFOSIsImltYWdlIjoiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9jb3VudHJ5LWZsYWctZW1vamktanNvbkAyLjAuMC9kaXN0L2ltYWdlcy9DRC5zdmcifX0.LPDXbbbL49ZbEjllZ6wb6n8KljGrJmgyKh3R5pnF-nMZ-Xr774oiqZ8SqjymBa2fE7BOOfSAjOCiU-hsGbbVYqO9FvEswxXGS9FRKLPsriXGp5nl8iDk3KAbGuozGg-HfETiCoVw6hxdalw61KW8T9okoLYY8U-EFQSOIV8UbVkqvujKBnkd4RmvdxvmwKldcnrsXBjrlLIWGSEPbVnxW8a5mTsSQeXwu74wEx_j0UbrD2X3nrVqY_i6DecEn5ZcMJPG-K5f-Vz0CGEb6aUc9t1ejBitqBHB00d-Mh0jjkEyP-XpJ7vKE4z4g9aqLYzvaTL1mwPqdjfknii7Svfnig";
    const bonus = '100'; // Remplacez par la valeur du bonus que vous voulez
  
//090000026 test

    // Décoder le token et stocker les informations dans user
    const decodedToken = parseJwt(token);
    const user = {
      id: decodedToken.id,
      wallet: decodedToken.wallet
    };
  
    // Première requête POST
    fetch('https://api.biderclic.com/api/bank/earnings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        appGame: '🎰Bid slots machine',
        bonus: bonus,
        wallet: `/api/bank/wallets/${user.wallet}`
      })
    })
      .then(response => response.json())
      .then(data => {
        const earningId = data.id;
  
        // Deuxième requête POST
        return fetch(`https://api.biderclic.com/api/bank/earnings/${earningId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            itApproved: true
          })
        });
      })
      .then(response => response.json())
      .then(data => {
        loader.style.display = 'none'; // Cacher le loader
  
        // Retirer le message de jackpot après un délai
        setTimeout(() => {
          document.querySelector(".dimmer").style.zIndex = -1;
          congratDom.style.display = "none";
  
          // Afficher la dimmer et la modal
          const dimmer = document.querySelector('.dimmer');
          dimmer.style.display = 'block';
          dimmer.style.zIndex = 99; // Assombrir l'arrière-plan
  
          const modal = document.getElementById('myModal');
          modal.style.display = 'block';
  
          // Activer les boutons de la modale
          const buttons = modal.querySelectorAll(".reloadButton");
          buttons.forEach(button => {
            button.disabled = false;
          });
  
          // Empêcher la fermeture de la modal en cliquant en dehors
          window.onclick = function(event) {
            if (event.target === modal) {
              event.stopPropagation();
            }
          };
          
        }, 1500); // Ajustez le délai en fonction de la durée de l'animation du message de jackpot
      })
      .catch((error) => {
        loader.style.display = 'none';
        console.error('Erreur:', error);
      });
  };
  
  









  const showSorryMessage = () => {
    console.log("Try again");
  
    // Afficher le message de désolé après un délai de 2 secondes
    setTimeout(() => {
      const sorryDom = document.getElementById("congrat");
      sorryDom.classList.remove("animate__tada");
      sorryDom.classList.add("animate__headShake");
      sorryDom.querySelector("h1").innerHTML = "Sorry !";
      sorryDom.querySelector("p").innerHTML = "Try again";
      document.querySelector(".dimmer").style.zIndex = 99;
      sorryDom.style.display = "flex";
  
      setTimeout(() => {
        document.querySelector(".dimmer").style.zIndex = -1;
        sorryDom.style.display = "none";
        rebootProcess();
      }, 3000);
    }, 2000); // Délai de 2000 millisecondes (2 secondes)
  };
  

  const stopSlotsRotation = () => {
    $slots.eq(currentSlotIndex).stopSpin();
    currentSlotIndex = (currentSlotIndex + 1) % $slots.length;

  };

  $("#btn-example1").click(function () {
    const allSpinning = $slots.is(":animated");
    clickCount++;


    



    

    

    if (allSpinning) {
      buttonSound.play();
      $slots.stopSpin();
    } else {
      const endNums = [];
      const result = [];
      spinningCount = 0;

      $slots.each((index, slot) => {
        const endNum = useFixedNumber
          ? fixedNumber
          : Math.floor(Math.random() * maxSlotSize) % maxSlotSize;
        endNums.push(endNum);

        $(slot).playSpin({
          endNum,
          manualStop: true,
          onFinish: (totalNum) => {
            spinningCount++;

            result.push(totalNum);
            console.log(totalNum,result);
            console.log(AleatoireIconList[totalNum], AleatoireIconList[endNum]);


            if (spinningCount === $slots.length) {
              const sameNumber = result.every((num) => num === result[0]);
              sameNumber ? showJackpotMessage() : showSorryMessage();
            }

            checkAllSlotsReturned();
          },
        });
      });


      if (!scrollSound.paused) {
        scrollSound.currentTime = 0; // Revenir au début du son s'il joue déjà
      }
      scrollSound.play();

      scrollSound.play();
      $("#btn-example1").on("click", stopSlotsRotation);
    }
  });

  $.fn.playSpin = function (options) {
    if (this.length === 0) {
      return this;
    }

    if ($(this).is(":animated")) {
      return this;
    }

    startSeqs[`mainSeq${++startNum}`] = {};
    $(this).attr("data-playslot", startNum);

    const total = this.length;
    let thisSeq = 0;
    const endNums = $.isArray(options.endNum)
      ? options.endNum
      : [options.endNum || 0];

    while (endNums.length < this.length) {
      endNums.push(0);
    }

    startSeqs[`mainSeq${startNum}`].totalSpinning = total;

    return this.each(function () {
      const endNum = endNums[thisSeq++];
      startSeqs[`mainSeq${startNum}`][`subSeq${thisSeq}`] = { spinning: true };
      const track = {
        total: total,
        mainSeq: startNum,
        subSeq: thisSeq,
      };
      new SlotMachine(this, { ...options, endNum }, track).init();
    });
  };

  $.fn.stopSpin = function () {
    if (this.length && $(this).is(":animated")) {
      const slot = $(this).attr("data-playslot");
      if (slot) {
        $.each(startSeqs[`mainSeq${slot}`], (index, obj) => {
          obj.spinning = false;
        });
      }
    }
  };

  class SlotMachine {
    constructor(el, options, track) {
      // Initialisation des propriétés de l'instance
      this.$el = $(el); // Élément jQuery contenant les slots
      this.options = $.extend({}, this.defaultOptions, options); // Options de configuration
      this.track = track; // Informations de suivi du slot en cours
    }
  
    // Options par défaut de la machine à sous
    get defaultOptions() {
      return {
        easing: "swing", // Type d'interpolation pour l'animation (swing est une valeur courante)
        time: 4000, // Temps total de l'animation en millisecondes
        loops: 5, // Nombre de boucles avant de terminer l'animation
        manualStop: false, // Indicateur si l'arrêt est manuel
        useStopTime: false, // Utilisation du temps d'arrêt (non utilisé dans cet exemple)
        stopTime: 1000, // Temps d'arrêt (non utilisé dans cet exemple)
        stopSeq: "random", // Séquence d'arrêt des slots ("random", "leftToRight", "rightToLeft")
        endNum: 0, // Numéro final où s'arrête chaque slot
        onEnd: $.noop, // Fonction à exécuter à la fin de chaque animation de slot
        onFinish: $.noop, // Fonction à exécuter à la fin de toutes les animations de slots
      };
    }
  
    // Méthode d'initialisation de la machine à sous
    init() {
      this.setup(); // Configuration initiale des slots
      this.startSpin(); // Démarrage de l'animation des slots
    }
  
    // Configuration initiale des slots
    setup() {
      const $li = this.$el.find("li").first(); // Première li dans la liste des slots
      this.liHeight = $li.innerHeight() + 19.2; // Hauteur d'une li incluant les marges
      this.liCount = this.$el.children().length; // Nombre total de li dans la liste des slots
      this.listHeight = (this.liHeight - 18) * this.liCount; // Hauteur totale de la liste des slots
      this.spinSpeed = this.options.time / this.options.loops; // Vitesse de rotation des slots
  
      $li.clone().appendTo(this.$el); // Cloner la première li et l'ajouter à la fin des slots
  
      // Vérifier si l'arrêt des slots doit être manuel en fonction de stopSeq
      if (
        (this.options.stopSeq === "leftToRight" && this.track.subSeq !== 1) ||
        (this.options.stopSeq === "rightToLeft" &&
          this.track.total !== this.track.subSeq)
      ) {
        this.options.manualStop = true; // Activer l'arrêt manuel des slots
      }
    }
  
    // Démarrer l'animation des slots
    startSpin() {
      this.$el
        .css("top", -this.listHeight)
        .animate({ top: "0px" }, this.spinSpeed, "linear", () =>
          this.lowerSpeed()
        );
    }
  
    // Réduire la vitesse de rotation des slots
    lowerSpeed() {
      this.loopCount = (this.loopCount || 0) + 1; // Incrémenter le compteur de boucles
  
      // Vérifier s'il reste des boucles à exécuter ou si l'arrêt est manuel et en cours
      if (
        this.loopCount < this.options.loops ||
        (this.options.manualStop &&
          startSeqs[`mainSeq${this.track.mainSeq}`][
            `subSeq${this.track.subSeq}`
          ].spinning)
      ) {
        this.startSpin(); // Continuer à tourner les slots
      } else {
        this.endSpin(); // Arrêter l'animation des slots
      }
    }
  
    // Arrêter l'animation des slots
    endSpin() {
      // Déterminer le numéro final où chaque slot s'arrête
      this.options.endNum = Math.max(
        1,
        Math.min(this.options.endNum || 1, this.liCount)
      );
      const finalPos = -(this.liHeight * this.options.endNum - this.liHeight); // Position finale des slots
      const finalTime = 2000; // Temps final de l'animation en millisecondes
  
      // Animer les slots vers leur position finale
      this.$el
        .css("top", -this.listHeight)
        .animate({ top: finalPos }, finalTime, this.options.easing, () => {
          this.$el.find("li").last().remove(); // Supprimer le dernier élément li cloné20
          this.endAnimation(this.options.endNum); // Terminer l'animation des slots
          if ($.isFunction(this.options.onEnd)) {
            this.options.onEnd(this.options.endNum); // Appeler la fonction onEnd si elle est définie
          }
          if (startSeqs[`mainSeq${this.track.mainSeq}`].totalSpinning === 0) {
            let totalNum = "";
            // Calculer le nombre total combiné des slots
            $.each(
              startSeqs[`mainSeq${this.track.mainSeq}`],
              (index, subSeqs) => {
                if (typeof subSeqs === "object") {
                  totalNum += subSeqs.endNum.toString();
                }
              }
            );
            if ($.isFunction(this.options.onFinish)) {
              this.options.onFinish(totalNum); // Appeler la fonction onFinish si elle est définie
            }
          }

              // Appeler le son stopSound lorsque l'animation est terminée
      stopSound.play();
        });
    }
  
    // Terminer l'animation d'un slot individuel
    endAnimation(endNum) {
      // Désactiver le spinning pour le slot suivant dans la séquence d'arrêt
      if (
        (this.options.stopSeq === "leftToRight" &&
          this.track.total !== this.track.subSeq) ||
        (this.options.stopSeq === "rightToLeft" && this.track.subSeq !== 1)
      ) {
        startSeqs[`mainSeq${this.track.mainSeq}`][
          `subSeq${this.track.subSeq + 1}`
        ].spinning = false;
      }
  
      // Décrémenter le nombre total de slots en rotation pour la séquence principale
      startSeqs[`mainSeq${this.track.mainSeq}`].totalSpinning--;
      // Assigner le numéro final à la séquence de slot actuelle
      startSeqs[`mainSeq${this.track.mainSeq}`][
        `subSeq${this.track.subSeq}`
      ].endNum = endNum;
    }
  }
  
});
     // Démarrer l'animation des slots