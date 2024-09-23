// Récupération des données saisies 
document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("loginform").classList.remove("hidden");
    document.getElementById("registerform").classList.add("hidden");
  });
  
  document.getElementById("show-signup").addEventListener("click", function() {
    document.getElementById("registerform").classList.remove("hidden");
    document.getElementById("loginform").classList.add("hidden");
  });
  
  //----------------------------------------------INSCRIPTION-----------------------------------------------------//
  
  
          // Fonction pour gérer l'inscription
  document.getElementById('registerform').addEventListener('submit', async function(event) {
      event.preventDefault();
              
      const username = document.getElementById('registerUsername').value;
      const password = document.getElementById('registerPassword').value;
  
      const response = await fetch('http://192.168.64.194:3000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
      if (response.ok) {
          alert('Inscription réussie !');
      } else {
          alert(`Erreur : ${data.message}`);
      }
  });
  
  
  ///----------------------------------------LOGIN-------------------------------------------------------------------///
  
  const maxAttempts = 3; // Nombre maximum de tentatives
  const blockDuration = 60000; // Durée de blocage (60 secondes)
  
  // Charger les tentatives et le temps de blocage depuis le localStorage
  let attempts = localStorage.getItem('loginAttempts') ? parseInt(localStorage.getItem('loginAttempts')) : 0;
  let blockTime = localStorage.getItem('blockTime') ? parseInt(localStorage.getItem('blockTime')) : 0;
  
  document.getElementById('loginform').addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const now = new Date().getTime();
  
      // Vérifier si l'utilisateur est bloqué
      if (blockTime > now) {
          const timeRemaining = Math.ceil((blockTime - now) / 1000);
          alert(`Trop de tentatives. Veuillez réessayer dans ${timeRemaining} secondes.`);
          return;
      }
  
      console.log("Lancement login");
  
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
  
      try {
          const response = await fetch('http://192.168.64.194:3000/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
          });
  
          const data = await response.json();
  
          if (response.ok) {
              localStorage.setItem('token', data.token);
              alert('Connexion réussie !');
              attempts = 0; // Réinitialiser les tentatives après une connexion réussie
              localStorage.removeItem('loginAttempts'); // Supprimer les tentatives du localStorage
              localStorage.removeItem('blockTime'); // Supprimer le temps de blocage du localStorage
              window.location.href = "accueil-page/accueil.html";
          } else {
              attempts++;
              alert(`Erreur : ${data.message}`);
          }
  
          // Enregistrer le nombre de tentatives dans le localStorage
          localStorage.setItem('loginAttempts', attempts);
  
          // Bloquer après trop de tentatives
          if (attempts >= maxAttempts) {
              blockTime = new Date().getTime() + blockDuration;
              localStorage.setItem('blockTime', blockTime); // Stocker le temps de blocage dans le localStorage
              alert(`Trop de tentatives. Vous êtes bloqué pour ${blockDuration / 1000} secondes.`);
          }
  
      } catch (error) {
          console.error("Erreur lors de la requête", error);
          alert("Une erreur s'est produite lors de la connexion.");
      }
  });
  
  
  //----------------------------------------BACKGROUND------------------------------------------------------//
  
  //Changement d'arrière plan
  document.addEventListener('DOMContentLoaded', function() {
      var images = document.querySelectorAll('.background-images img');
      var index = 0;
  
      // Pour que la première image soit visible uniquement
      images.forEach((img, idx) => {
          if (idx === 0) {
              img.style.display = 'block'; // La première image est visible
          } else {
              img.style.display = 'none'; // Permet de cacher les autres images
          }
      });
  
      function changeBackgroundImage() {
          // Masquer l'image actuelle
          images[index].style.display = 'none';
          // Passer à l'image suivante
          index = (index + 1) % images.length;
          // Afficher la nouvelle image
          images[index].style.display = 'block';
      }
  
      // Durée d'image avant remplacement
      setInterval(changeBackgroundImage, 5000);
  
  });