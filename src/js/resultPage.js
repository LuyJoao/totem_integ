document.addEventListener('DOMContentLoaded', () => {
  // Ativa a tela cheia quando o navegador permitir essa ação.
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

  // Alterna a tela cheia depois de três cliques no botão invisível.
  const secretExitBtn = document.getElementById('exit-fullscreen-btn');
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

  // Mostra a pontuação salva pelo quiz na tela de resultado.
  const resultText = document.querySelector('.result-text');
  const savedResult = JSON.parse(sessionStorage.getItem('quizResult') || '{}');
  const score = Number.isFinite(savedResult.score) ? savedResult.score : 0;
  const total = Number.isFinite(savedResult.total) ? savedResult.total : 0;

  if (resultText) {
    resultText.innerHTML = `Você marcou <strong>${score}</strong> de <strong>${total}</strong> pontos!`;
  }

  // Retorna ao início do quiz para permitir uma nova tentativa.
  const nextButton = document.querySelector('.next-button');
  const handleRestart = (event) => {
    event.preventDefault();
    window.location.href = 'quizPage.html';
  };

  if (nextButton) {
    nextButton.addEventListener('click', handleRestart);
    nextButton.addEventListener('touchend', handleRestart);
  }

  // Abre o modal de confirmação antes de sair para a página inicial.
  const exitButton = document.querySelector('.exit-text');
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

      // Fecha o modal e restaura o botão de saída.
      const cleanUp = () => {
        exitButton.disabled = false;
        overlay.remove();
        document.removeEventListener('keydown', handleEscape);
      };

      // Permite fechar o modal com a tecla Escape.
      const handleEscape = (keyEvent) => {
        if (keyEvent.key === 'Escape') cleanUp();
      };

      document.addEventListener('keydown', handleEscape);
      cancelButton.addEventListener('click', cleanUp);
      cancelButton.addEventListener('touchend', cleanUp);

      // Confirma a saída e retorna para a página inicial.
      const confirmExit = (confirmEvent) => {
        confirmEvent.preventDefault();
        window.location.href = '../../index.html';
      };

      confirmButton.addEventListener('click', confirmExit);
      confirmButton.addEventListener('touchend', confirmExit);
    };

    exitButton.addEventListener('click', handleExitClick);
    exitButton.addEventListener('touchend', handleExitClick);
  }

  // Bloqueia menu de contexto e atalhos de inspeção no totem.
  document.addEventListener('contextmenu', (event) => event.preventDefault());
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && ['u', 'U', 'p', 'P'].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === 'Escape') event.preventDefault();
  });

  forceFullscreen();
});
// Exibe a pontuação final e transforma o botão principal em opção de reinício.
function showResult() {
  if (title) title.textContent = 'Quiz concluído';
  optionsContainer.innerHTML = `<p class="result-text" text-align: center; margin: 2rem 0;">Você marcou <strong>${score}</strong> de <strong>${quizQuestions.length * pointsPerQuestion}</strong> pontos!</p>`;
  selectedOption = null;
  nextButton.textContent = 'RECOMEÇAR QUIZ';
  nextButton.disabled = false;

  // Reinicia o quiz recarregando a página.
  const handleRestart = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  nextButton.onclick = null;
  nextButton.addEventListener('click', handleRestart);
  nextButton.addEventListener('touchend', handleRestart);
}

// --- LÓGICA DE SAÍDA E MODAL DE CONFIRMAÇÃO ---
const exitSelectors = ['#exit-button', '.exit-text', '.exit-button button', '.exit-area button'];
  let exitBtn = null;
  for (const sel of exitSelectors) {
    exitBtn = document.querySelector(sel);
    if (exitBtn) break;
  }

if (exitBtn) {
  const handleExitClick = (e) => {
    e.preventDefault();
    if (exitBtn.disabled) return;
    exitBtn.disabled = true;

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
      if (evt.key === 'Escape') cleanUp();
    }

    document.addEventListener('keydown', onKeyDown);

    btnNo.addEventListener('click', cleanUp);
    btnNo.addEventListener('touchend', cleanUp);

    const confirmExit = (evt) => {
      evt.preventDefault();
      setTimeout(() => { window.location.href = '../../index.html'; }, 150);
    };

    btnYes.addEventListener('click', confirmExit);
    btnYes.addEventListener('touchend', confirmExit);
  };

  exitBtn.addEventListener('click', handleExitClick);
  exitBtn.addEventListener('touchend', handleExitClick);
}

  // --- TRAVAS DE SEGURANÇA PARA TOTEM ---
document.addEventListener('contextmenu', (event) => event.preventDefault());

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && ['u', 'U', 'p', 'P'].includes(event.key)) {
    event.preventDefault();
  }
  if (event.key === 'Escape') {
    event.preventDefault();
  }
});