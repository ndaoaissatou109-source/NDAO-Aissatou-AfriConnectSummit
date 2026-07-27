// Attend que le document HTML soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", function () {

  /* ========================================================
     1. COMPTE À REBOURS (SÉCURISÉ POUR TOUTES LES PAGES)
     ======================================================== */
  // Date cible de l'événement (15 Octobre 2026 à 09h00)
  const targetDate = new Date("2026-10-15T09:00:00").getTime();

  // Fonction qui calcule et met à jour le temps restant
  function updateCountdown() {
    // Récupération des éléments HTML du compteur
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // Sécurité : si la page actuelle n'a pas de compteur (ex: intervenants.html), on stoppe la fonction
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Récupère la date/heure actuelle
    const now = new Date().getTime();
    // Calcule la différence entre la date cible et maintenant
    const difference = targetDate - now;

    // Si la date est dépassée, on affiche des 00
    if (difference <= 0) {
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minutesEl.innerText = "00";
      secondsEl.innerText = "00";
      return;
    }

    // Calculs mathématiques pour convertir les millisecondes en jours, heures, minutes et secondes
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Maintient un format à deux chiffres (ex: "09" au lieu de "9")
    daysEl.innerText = String(days).padStart(2, "0");
    hoursEl.innerText = String(hours).padStart(2, "0");
    minutesEl.innerText = String(minutes).padStart(2, "0");
    secondsEl.innerText = String(seconds).padStart(2, "0");
  }

  // Démarre le minuteur uniquement si la balise avec l'ID "days" existe sur la page
  if (document.getElementById("days")) {
    updateCountdown(); // Premier appel immédiat
    setInterval(updateCountdown, 1000); // Mise à jour toutes les secondes (1000ms)
  }


  /* ========================================================
     2. ANIMATION DES STATISTIQUES (SÉCURISÉE)
     ======================================================== */
  // Sélectionne tous les éléments de chiffres et la section des statistiques
  const statNumbers = document.querySelectorAll(".pro-stat-number");
  const statsSection = document.querySelector(".pro-stats-section");

  // Sécurité : s'assure que la section et les chiffres existent sur la page
  if (statNumbers.length > 0 && statsSection) {
    const animationDuration = 2000; // Durée totale de l'animation en millisecondes (2 sec)

    // Fonction d'incrémentation fluide d'un chiffre
    function animateNumber(element) {
      const target = parseInt(element.getAttribute("data-target"), 10); // Valeur finale cible
      const prefix = element.getAttribute("data-prefix") || ""; // Préfixe facultatif (ex: "+")
      const startTime = performance.now();

      // Fonction d'animation exécutée à chaque rafraîchissement d'image
      function updateCount(currentTime) {
        const elapsedTime = currentTime - startTime; // Temps écoulé
        const progress = Math.min(elapsedTime / animationDuration, 1); // Progression entre 0 et 1
        const currentValue = Math.floor(progress * target); // Calcul de la valeur actuelle

        element.textContent = `${prefix}${currentValue}`;

        // Continue l'animation tant que la durée n'est pas atteinte
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          element.textContent = `${prefix}${target}`; // Valeur finale garantie
        }
      }
      requestAnimationFrame(updateCount);
    }

    // Utilisation d'un IntersectionObserver pour ne lancer l'animation que quand l'utilisateur fait défiler jusqu'à la section
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Lance l'animation sur chaque chiffre
          statNumbers.forEach(statElement => animateNumber(statElement));
          // Arrête d'observer une fois l'animation jouée
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 }); // Déclenche à 50% de visibilité de la section

    statsObserver.observe(statsSection);
  }


  /* ========================================================
     3. GESTION DU PLANNING ET ONGLETS (SÉCURISÉE)
     ======================================================== */
  // Sélectionne tous les boutons d'onglets et les cartes/tableaux de contenu
  const ongletsBtns = document.querySelectorAll(".onglet-btn");
  const contenusPlanning = document.querySelectorAll(".contenu-planning");

  // Sécurité : exécute uniquement si des onglets sont présents sur la page (ex: programme.html)
  if (ongletsBtns.length > 0) {
    ongletsBtns.forEach((btn) => {
      // Ajoute l'écouteur d'événement clic sur chaque bouton
      btn.addEventListener("click", function (e) {
        e.preventDefault(); // Empêche le saut de page par défaut

        // Récupère l'identifiant de la journée ciblée via l'attribut data-jour (ex: "jour-1")
        const jourCible = this.getAttribute("data-jour");

        // Enlève la classe "actif" de tous les boutons
        ongletsBtns.forEach((b) => b.classList.remove("actif"));
        // Cache tous les plannings
        contenusPlanning.forEach((c) => c.classList.remove("actif"));

        // Active le bouton sur lequel l'utilisateur a cliqué
        this.classList.add("actif");

        // Recherche le tableau correspondant à l'ID du jour et l'affiche
        const tableauCible = document.getElementById(jourCible);
        if (tableauCible) {
          tableauCible.classList.add("actif");
        }
      });
    });
  }


  /* ========================================================
     4. FILTRAGE DYNAMIQUE DES INTERVENANTS (SÉCURISÉ)
     ======================================================== */
  // Sélectionne tous les boutons de filtres (Tous, IA, Business, Design, Data)
  const filtresBtns = document.querySelectorAll(".btn-filtre");
  // Sélectionne toutes les cartes des intervenants (Speakers)
  const cartesSpeakers = document.querySelectorAll(".carte-speaker");

  // Sécurité : s'assure que les boutons et les cartes existent sur la page actuelle
  if (filtresBtns.length > 0 && cartesSpeakers.length > 0) {
    
    // Parcourt chaque bouton pour ajouter l'événement de clic
    filtresBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        
        // 1. GESTION DU BOUTON ACTIF
        // Retire la classe "actif" de tous les boutons de filtre
        filtresBtns.forEach((b) => b.classList.remove("actif"));
        // Ajoute la classe "actif" uniquement sur le bouton sur lequel on vient de cliquer
        this.classList.add("actif");

        // 2. RÉCUPÉRATION DE LA CATÉGORIE
        // Récupère la valeur du filtre (ex: "tous", "ia", "business", "design", "data")
        const filtreCible = this.getAttribute("data-filter");

        // 3. FILTRAGE DES CARTES SPEAKERS
        cartesSpeakers.forEach((speaker) => {
          // Récupère la catégorie propre à la carte de l'intervenant
          const categorieSpeaker = speaker.getAttribute("data-category");

          // Si le filtre choisi est "tous" OU qu'il correspond exactement à la catégorie de la carte
          if (filtreCible === "tous" || filtreCible === categorieSpeaker) {
            // Affiche la carte
            speaker.style.display = "block";
          } else {
            // Masque la carte si elle ne correspond pas au filtre
            speaker.style.display = "none";
          }
        });

      });
    });

  }


  /* ========================================================
     5. GESTION DU MENU BURGER MOBILE
     ======================================================== */
  const boutonBurger = document.getElementById("bouton-burger");
  const liensMenu = document.getElementById("liens-menu");

  if (boutonBurger && liensMenu) {
    boutonBurger.addEventListener("click", function () {
      boutonBurger.classList.toggle("actif");
      liensMenu.classList.toggle("actif");
    });

    const liens = liensMenu.querySelectorAll("a");
    liens.forEach((lien) => {
      lien.addEventListener("click", () => {
        boutonBurger.classList.remove("actif");
        liensMenu.classList.remove("actif");
      });
    });
  }

}); 

/* ========================================================
     6. VALIDATION DU FORMULAIRE SANS RECHARGEMENT (AJAX)
     ======================================================== */
  // Sélection du formulaire et du conteneur de message
  const contactForm = document.querySelector(".contact-form");
  const formMessage = document.getElementById("form-message");

  // Sécurité : s'assure que le formulaire existe bien sur la page actuelle (ex: contact.html)
  if (contactForm) {
    
    // Écoute l'événement de soumission ("submit") du formulaire
    contactForm.addEventListener("submit", function (e) {
      
      // 1. Empêche le rechargement par défaut de la page HTML
      e.preventDefault();

      // Récupération du bouton d'envoi
      const btnSubmit = contactForm.querySelector("button[type='submit']");
      const originalBtnText = btnSubmit ? btnSubmit.innerHTML : "";

      // 2. Change l'état du bouton pendant le chargement
      if (btnSubmit) {
        btnSubmit.innerHTML = `<i class="bi bi-arrow-repeat spin"></i> Envoi en cours...`;
        btnSubmit.disabled = true; // Désactive le bouton pour éviter les clics multiples
      }

      // 3. Simulation de l'envoi des données (délai de 1.2 seconde)
      setTimeout(() => {
        
        // Affiche le message de confirmation dans la div #form-message
        if (formMessage) {
          formMessage.className = "form-message succes";
          formMessage.innerHTML = `<i class="bi bi-check-circle-fill"></i> Félicitations ! Votre inscription a bien été enregistrée.`;
          formMessage.style.display = "block";
          
          // Fait défiler la page doucement vers le message de succès
          formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // 4. Vide tous les champs du formulaire après envoi
        contactForm.reset();

        // 5. Rétablit le texte initial du bouton d'envoi
        if (btnSubmit) {
          btnSubmit.innerHTML = originalBtnText;
          btnSubmit.disabled = false;
        }

      }, 1200); // 1200 millisecondes = 1.2s

    });
  }

  /* ========================================================
   GESTION DU DARK MODE COMPLÈTE
   ======================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // On cible l'ID exact de ton HTML : "bouton-theme"
  const themeToggleBtn = document.getElementById("bouton-theme");

  if (themeToggleBtn) {
    const themeIcon = themeToggleBtn.querySelector("i");

    // 1. Appliquer le thème sauvegardé au chargement
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      if (themeIcon) {
        themeIcon.className = "bi bi-sun-fill"; // Passe en icône Soleil
      }
    }

    // 2. Écouter le clic sur le bouton
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");

      // Sauvegarde du choix dans le navigateur
      localStorage.setItem("theme", isDark ? "dark" : "light");

      // Bascule l'icône Lune <-> Soleil
      if (themeIcon) {
        themeIcon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btnRetourHaut = document.getElementById("bouton-retour-haut");

  if (btnRetourHaut) {
    // Affiche le bouton dès qu'on descend de 300px
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        btnRetourHaut.classList.add("visible");
      } else {
        btnRetourHaut.classList.remove("visible");
      }
    });

    // Remonte tout en douceur
    btnRetourHaut.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});