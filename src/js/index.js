document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('start-overlay');
  const exitBtn = document.getElementById('exit-fullscreen-btn');
  const startBtn = document.getElementById('startBtn');

  // --- GERENCIAMENTO DE TELA CHEIA ---
  function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  // Primeiro toque/clique entra em Fullscreen e remove a camada do overlay
  if (overlay) {
    const handleOverlayStart = (event) => {
      event.preventDefault();
      requestFullscreen();
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
    };

    overlay.addEventListener('click', handleOverlayStart);
    overlay.addEventListener('touchend', handleOverlayStart);
  }

  // --- BOTÃO SECRETO (REQUER 3 CLIQUES RÁPIDOS) ---
  if (exitBtn) {
    let clickCount = 0;
    let clickTimer = null;

    const handleSecretClick = (event) => {
      event.preventDefault();
      clickCount++;

      // Reseta o contador se demorar mais de 1.5 segundos entre os cliques
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1500);

      // Ao atingir 3 cliques, alterna o modo Tela Cheia
      if (clickCount === 3) {
        clickCount = 0;
        clearTimeout(clickTimer);

        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          requestFullscreen();
        } else {
          exitFullscreen();
        }
      }
    };

    exitBtn.addEventListener('click', handleSecretClick);
    exitBtn.addEventListener('touchend', handleSecretClick);
  }

  // --- NAVEGAÇÃO PARA O QUIZ ---
  if (startBtn) {
    const handleStartQuiz = (event) => {
      event.preventDefault();
      window.location.href = 'src/html/quizPage.html';
    };

    startBtn.addEventListener('click', handleStartQuiz);
    startBtn.addEventListener('touchend', handleStartQuiz);
  }

  // --- TRAVAS DE SEGURANÇA PARA TOTEM ---

  // 1. Desativa o menu de contexto (clique direito / toque longo)
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  // 2. Bloqueia atalhos de teclado de inspeção e navegação
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && ['u', 'U', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
    }

  });

});