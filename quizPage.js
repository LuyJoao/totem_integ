document.addEventListener('DOMContentLoaded', () => {
  const exitSelectors = ['#exit-button', '.exit-text', '.exit-button button', '.exit-area button'];
  let exitBtn = null;
  for (const sel of exitSelectors) {
    exitBtn = document.querySelector(sel);
    if (exitBtn) break;
  }

  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      // evita cliques repetidos
      if (exitBtn.disabled) return;
      exitBtn.disabled = true;

      // cria overlay de confirmação
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

      // foco inicial
      btnNo.focus();

      function cleanUp() {
        exitBtn.disabled = false;
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.removeEventListener('keydown', onKeyDown);
      }

      function onKeyDown(e) {
        if (e.key === 'Escape') {
          cleanUp();
        }
      }

      document.addEventListener('keydown', onKeyDown);

      btnNo.addEventListener('click', () => {
        cleanUp();
      });

      btnYes.addEventListener('click', () => {
        // pequeno delay para o usuário ver o clique
        setTimeout(() => window.location.href = 'index.html', 150);
      });
    });
  }
});
