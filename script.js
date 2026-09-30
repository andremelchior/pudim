document.addEventListener('DOMContentLoaded', () => {
  const pudimFrame = document.getElementById('pudim-interactive');
  const pudimShadow = document.getElementById('pudim-shadow');
  const speechBubble = document.getElementById('speech-bubble');
  const wobbleCountEl = document.getElementById('wobble-count');
  
  const openRecipeBtn = document.getElementById('open-recipe-btn');
  const closeRecipeBtn = document.getElementById('close-recipe-btn');
  const recipeModal = document.getElementById('recipe-modal');
  const modalWobbleTrigger = document.getElementById('modal-wobble-trigger');

  let wobbleCount = parseInt(localStorage.getItem('pudim_wobbles') || '0', 10);
  wobbleCountEl.textContent = wobbleCount;

  const pudimQuotes = [
    'pudim.Jiggle();',
    'Console.WriteLine("Wooble wooble!");',
    'pudim.NivelCaldaDeCaramelo = 100.0;'
  ];

  let currentQuoteIndex = 0;
  let isFadeTransitioning = false;

  function jigglePudim(clientX, clientY) {
    wobbleCount++;
    wobbleCountEl.textContent = wobbleCount;
    localStorage.setItem('pudim_wobbles', wobbleCount);

    pudimFrame.classList.remove('jiggling');
    pudimShadow.classList.remove('jiggling-shadow');
    void pudimFrame.offsetWidth;
    pudimFrame.classList.add('jiggling');
    pudimShadow.classList.add('jiggling-shadow');

    if (!isFadeTransitioning) {
      isFadeTransitioning = true;
      speechBubble.classList.add('fading');

      setTimeout(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % pudimQuotes.length;
        speechBubble.textContent = pudimQuotes[currentQuoteIndex];
        speechBubble.classList.remove('fading');
        isFadeTransitioning = false;
      }, 200);
    }

    const posX = clientX || (pudimFrame.getBoundingClientRect().left + pudimFrame.offsetWidth / 2);
    const posY = clientY || (pudimFrame.getBoundingClientRect().top + pudimFrame.offsetHeight / 3);
    spawnCSharpParticles(posX, posY);
  }

  function spawnCSharpParticles(x, y) {
    const particleItems = [
      { text: 'C#', color: '#68217a' },
      { text: '.NET', color: '#512bd4' },
      { text: '#', color: '#8447b8' },
      { text: 'C#', color: '#512bd4' }
    ];

    const particleCount = 3 + Math.floor(Math.random() * 2);

    for (let i = 0; i < particleCount; i++) {
      const item = particleItems[Math.floor(Math.random() * particleItems.length)];
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.textContent = item.text;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.color = item.color;
      particle.style.fontSize = '0.85rem';

      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
      const distance = 40 + Math.random() * 45;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 30;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      document.body.appendChild(particle);

      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    }
  }

  pudimFrame.addEventListener('click', (e) => {
    jigglePudim(e.clientX, e.clientY);
  });

  pudimFrame.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      jigglePudim();
    }
  });

  openRecipeBtn.addEventListener('click', () => {
    recipeModal.showModal();
  });

  closeRecipeBtn.addEventListener('click', () => {
    recipeModal.close();
  });

  recipeModal.addEventListener('click', (e) => {
    if (e.target === recipeModal) {
      recipeModal.close();
    }
  });

  modalWobbleTrigger.addEventListener('click', () => {
    recipeModal.close();
    setTimeout(() => {
      jigglePudim();
    }, 150);
  });
});
