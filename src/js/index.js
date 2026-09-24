function initializeIndexScreen() {
  if (window.__totemIndexInitialized) return;
  window.__totemIndexInitialized = true;

  const overlay = document.getElementById('start-overlay');
  const exitBtn = document.getElementById('exit-fullscreen-btn');
  const startBtn = document.getElementById('startBtn');
  const screens = {
    home: document.getElementById('screen-home'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result')
  };

  function showScreen(screenName) {
    Object.entries(screens).forEach(([name, element]) => {
      if (!element) return;
      element.classList.toggle('active', name === screenName);
    });

    if (overlay) {
      overlay.style.display = screenName === 'home' ? 'flex' : 'none';
      overlay.style.pointerEvents = screenName === 'home' ? 'auto' : 'none';
    }
  }

  function requestFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  }

  function exitFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

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

  if (exitBtn) {
    let clickCount = 0;
    let clickTimer = null;

    const handleSecretClick = (event) => {
      event.preventDefault();
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1500);

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

  if (startBtn) {
    const handleStartQuiz = (event) => {
      event.preventDefault();
      requestFullscreen();
      if (typeof window.resetQuiz === 'function') {
        window.resetQuiz();
      }
      showScreen('quiz');
    };

    startBtn.addEventListener('click', handleStartQuiz);
    startBtn.addEventListener('touchend', handleStartQuiz);
  }

  window.showScreen = showScreen;
  window.requestFullscreen = requestFullscreen;
  window.exitFullscreen = exitFullscreen;

  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && ['u', 'U', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
    }
  });

  showScreen('home');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeIndexScreen);
} else {
  initializeIndexScreen();
}