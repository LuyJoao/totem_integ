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
      overlay.style.pointerEvents = 'none'; // Garante que cliques futuros passem diretamente para os botões abaixo
    };

    overlay.addEventListener('click', handleOverlayStart);
    overlay.addEventListener('touchend', handleOverlayStart);
  }

  // Botão secreto invisível no canto superior direito para alternar Fullscreen
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        requestFullscreen();
      } else {
        exitFullscreen();
      }
    });
  }

  // --- NAVEGAÇÃO PARA O QUIZ ---
  if (startBtn) {
    const handleStartQuiz = (event) => {
      event.preventDefault(); // Evita execução duplicada por eventos touch + click sequenciais
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
    // Ctrl+U (Exibir Código Fonte) e Ctrl+P (Imprimir)
    if (event.ctrlKey && ['u', 'U', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
    }

    // Tecla ESC (Evita sair de tela cheia se um teclado estiver conectado)
    if (event.key === 'Escape') {
      event.preventDefault();
    }
  });

});