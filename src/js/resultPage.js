function initializeResultPage() {
  if (window.__totemResultInitialized) return;
  window.__totemResultInitialized = true;

  function forceFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => { });
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  }

  const secretExitBtn = document.getElementById('exit-fullscreen-btn-result') || document.getElementById('exit-fullscreen-btn');
  if (secretExitBtn) {
    let clickCount = 0;
    let clickTimer = null;

    const handleSecretClick = (event) => {
      event.preventDefault();
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 1500);

      if (clickCount === 3) {
        clickCount = 0;
        clearTimeout(clickTimer);
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          forceFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    };

    secretExitBtn.addEventListener('click', handleSecretClick);
    secretExitBtn.addEventListener('touchend', handleSecretClick);
  }

  const resultText = document.querySelector('.result-text');
  function renderResult() {
    const savedResult = JSON.parse(sessionStorage.getItem('quizResult') || '{}');
    const score = Number.isFinite(savedResult.score) ? savedResult.score : 0;
    const total = Number.isFinite(savedResult.total) ? savedResult.total : 100;

    if (resultText) {
      const formattedScore = Math.round(Number(score));
      const formattedTotal = Math.round(Number(total));
      resultText.innerHTML = `Você marcou <strong>${formattedScore}</strong> de <strong>${formattedTotal}</strong> pontos!`;
    }
  }

  window.renderResult = renderResult;
  renderResult();

  const nextButton = document.querySelector('#screen-result .next-button');
  const handleRestart = (event) => {
    event.preventDefault();
    if (typeof window.resetQuiz === 'function') {
      window.resetQuiz();
    }
    if (typeof window.showScreen === 'function') {
      window.showScreen('quiz');
    }
  };

  if (nextButton) {
    nextButton.addEventListener('click', handleRestart);
    nextButton.addEventListener('touchend', handleRestart);
  }

  const exitButton = document.querySelector('#screen-result .exit-text');
  if (exitButton) {
    const handleExitClick = (event) => {
      event.preventDefault();
      if (exitButton.disabled) return;
      exitButton.disabled = true;

      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';

      const modal = document.createElement('div');
      modal.className = 'confirm-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');

      const message = document.createElement('p');
      message.textContent = 'Deseja realmente sair do Quiz?';

      const actions = document.createElement('div');
      actions.className = 'confirm-actions';

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'confirm-cancel';
      cancelButton.textContent = 'Não';

      const confirmButton = document.createElement('button');
      confirmButton.type = 'button';
      confirmButton.className = 'confirm-confirm';
      confirmButton.textContent = 'Sim';

      actions.append(cancelButton, confirmButton);
      modal.append(message, actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      cancelButton.focus();

      const cleanUp = () => {
        exitButton.disabled = false;
        overlay.remove();
        document.removeEventListener('keydown', handleEscape);
      };

      const handleEscape = (keyEvent) => {
        if (keyEvent.key === 'Escape') cleanUp();
      };

      document.addEventListener('keydown', handleEscape);
      cancelButton.addEventListener('click', cleanUp);
      cancelButton.addEventListener('touchend', cleanUp);

      const confirmExit = (confirmEvent) => {
        confirmEvent.preventDefault();
        cleanUp();
        if (typeof window.resetQuiz === 'function') {
          window.resetQuiz();
        }
        if (typeof window.showScreen === 'function') {
          window.showScreen('home');
        }
      };

      confirmButton.addEventListener('click', confirmExit);
      confirmButton.addEventListener('touchend', confirmExit);
    };

    exitButton.addEventListener('click', handleExitClick);
    exitButton.addEventListener('touchend', handleExitClick);
  }

  document.addEventListener('contextmenu', (event) => event.preventDefault());
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && ['u', 'U', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === 'Escape') event.preventDefault();
  });

  forceFullscreen();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeResultPage);
} else {
  initializeResultPage();
}
