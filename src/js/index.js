document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('start-overlay');
  const exitBtn = document.getElementById('exit-fullscreen-btn');

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

  // Primeiro toque entra em Fullscreen e esconde o overlay inicial
  if (overlay) {
    overlay.addEventListener('click', () => {
      requestFullscreen();
      overlay.style.display = 'none';
    });
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

  // --- TRAVAS DE SEGURANÇA PARA TOTEM ---

  // 1. Desativa o menu de contexto (clique direito / toque longo)
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  // 2. Bloqueia atalhos de teclado de inspeção e navegação
  document.addEventListener('keydown', (event) => {
    // Tecla F12 (DevTools)
    if (event.key === 'F12') {
      event.preventDefault();
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (Ferramentas de Desenvolvedor)
    if (event.ctrlKey && event.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(event.key)) {
      event.preventDefault();
    }

    // Ctrl+U (Exibir Código Fonte) e Ctrl+P (Imprimir)
    if (event.ctrlKey && ['u', 'U', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
    }

    // Tecla ESC (Evita sair de tela cheia se um teclado estiver conectado)
    if (event.key === 'Escape') {
      event.preventDefault();
    }
  });

  // Redireciona para a página do quiz quando o botão Iniciar for clicado
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      window.location.href = 'html/quizPage.html';
    });
  }
});