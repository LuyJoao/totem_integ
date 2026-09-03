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

  if (overlay) {
    overlay.addEventListener('click', () => {
      requestFullscreen();
      overlay.style.display = 'none';
    });
  }

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
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'F12') {
      event.preventDefault();
    }

    if (event.ctrlKey && event.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(event.key)) {
      event.preventDefault();
    }

    if (event.ctrlKey && ['u', 'U', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
    }
  });
});