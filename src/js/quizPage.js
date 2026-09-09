document.addEventListener('DOMContentLoaded', () => {
  // --- GARANTIR E REATIVAR TELA CHEIA NO CARREGAMENTO ---
  function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  // Tenta reentrar em Fullscreen imediatamente
  requestFullscreen();

  // Reativa tela cheia no primeiro clique/toque caso o navegador bloqueie o auto-fullscreen
  const autoFullscreenHandler = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      requestFullscreen();
    }
    document.removeEventListener('click', autoFullscreenHandler);
    document.removeEventListener('touchend', autoFullscreenHandler);
  };
  document.addEventListener('click', autoFullscreenHandler);
  document.addEventListener('touchend', autoFullscreenHandler);

  // --- LÓGICA DE SAÍDA E MODAL DO QUIZ ---
  const exitSelectors = ['#exit-button', '.exit-text', '.exit-button button', '.exit-area button'];
  let exitBtn = null;
  for (const sel of exitSelectors) {
    exitBtn = document.querySelector(sel);
    if (exitBtn) break;
  }

  if (exitBtn) {
    const handleExit = (e) => {
      e.preventDefault();
      if (exitBtn.disabled) return;
      exitBtn.disabled = true;

      // Cria overlay de confirmação
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      overlay.tabIndex = -1;

      const modal = document.createElement('div');
      modal.className = 'confirm-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');

      const message = document.createElement('p');
      message.textContent = 'Deseja realmente sair do Quiz?';

      const actions = document.createElement('div');
      actions.className = 'confirm-actions';

      const btnNo = document.createElement('button');
      btnNo.type = 'button';
      btnNo.className = 'confirm-cancel';
      btnNo.textContent = 'Não';

      const btnYes = document.createElement('button');
      btnYes.type = 'button';
      btnYes.className = 'confirm-confirm';
      btnYes.textContent = 'Sim';

      actions.appendChild(btnNo);
      actions.appendChild(btnYes);
      modal.appendChild(message);
      modal.appendChild(actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      btnNo.focus();

      function cleanUp() {
        exitBtn.disabled = false;
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.removeEventListener('keydown', onKeyDown);
      }

      function onKeyDown(evt) {
        if (evt.key === 'Escape') {
          cleanUp();
        }
      }

      document.addEventListener('keydown', onKeyDown);

      btnNo.addEventListener('click', cleanUp);
      btnNo.addEventListener('touchend', cleanUp);

      const confirmExit = () => {
        setTimeout(() => window.location.href = '../../index.html', 150);
      };

      btnYes.addEventListener('click', confirmExit);
      btnYes.addEventListener('touchend', confirmExit);
    };

    exitBtn.addEventListener('click', handleExit);
    exitBtn.addEventListener('touchend', handleExit);
  }
});