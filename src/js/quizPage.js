document.addEventListener('DOMContentLoaded', () => {
  // --- GERENCIAMENTO DE TELA CHEIA EM TOTEM ---
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

  // Reativa tela cheia no primeiro toque/clique da página
  const handleAutoFullscreen = () => {
    forceFullscreen();
    document.removeEventListener('click', handleAutoFullscreen);
    document.removeEventListener('touchend', handleAutoFullscreen);
  };
  document.addEventListener('click', handleAutoFullscreen);
  document.addEventListener('touchend', handleAutoFullscreen);
  forceFullscreen();

  // --- BOTÃO SECRETO INVISÍVEL (3 CLIQUES PARA ALTERNAR FULLSCREEN) ---
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
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
      }
    };

    secretExitBtn.addEventListener('click', handleSecretClick);
    secretExitBtn.addEventListener('touchend', handleSecretClick);
  }

  // --- ESTRUTURA DO QUIZ ---
  const questionNumber = document.querySelector('.num-question');
  const optionsContainer = document.querySelector('.question-container');
  const nextButton = document.querySelector('.next-button');
  const title = document.querySelector('.Title');
  const quizContainer = document.querySelector('.quiz-container');

  // Perguntas padrão caso window.questions não esteja definido
  const defaultQuestions = [
    {
      question: "O que significa a sigla INTEG?",
      options: [
        "Instituto de Tecnologia de Guarapuava",
        "Incubadora Tecnológica de Guarapuava",
        "Integração Empresarial de Guarapuava",
        "Inovação e Tecnologia Geral"
      ],
      answer: 1
    },
    {
      question: "A INTEG é vinculada a qual instituição de ensino?",
      options: ["UTFPR", "UNICENTRO", "UEPG", "UFPR"],
      answer: 1
    },
    {
      question: "Qual o principal objetivo de uma incubadora de empresas?",
      options: [
        "Vender produtos importados",
        "Apoiar e desenvolver novas empresas e startups",
        "Oferecer cursos apenas teóricos",
        "Financiar empréstimos bancários"
      ],
      answer: 1
    },
    {
      question: "O que são empresas graduadas em uma incubadora?",
      options: [
        "Empresas que faliram durante o processo",
        "Empresas que concluíram o processo de incubação com sucesso",
        "Empresas que acabaram de entrar no programa",
        "Estudantes que estagiam na incubadora"
      ],
      answer: 1
    },
    {
      question: "Onde está localizada a INTEG?",
      options: ["Curitiba", "Ponta Grossa", "Guarapuava", "Cascavel"],
      answer: 2
    }
  ];

  const quizQuestions = (Array.isArray(window.questions) && window.questions.length > 0)
    ? window.questions
    : defaultQuestions;

  const pointsPerQuestion = 10;
  let currentQuestion = 0;
  let score = 0;
  let selectedOption = null;

  function showQuestion() {
    const question = quizQuestions[currentQuestion];
    selectedOption = null;

    if (questionNumber) {
      questionNumber.textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
    }

    // Atualiza o texto da pergunta preservando o número da questão
    if (title) {
      title.textContent = question.question;
    }

    optionsContainer.innerHTML = '';
    nextButton.disabled = true;
    nextButton.textContent = currentQuestion === quizQuestions.length - 1
      ? 'FINALIZAR QUIZ'
      : 'PRÓXIMA PERGUNTA';

    question.options.forEach((option, optionIndex) => {
      const optionButton = document.createElement('button');
      optionButton.type = 'button';
      optionButton.className = 'options-container';
      optionButton.textContent = option;

      const handleSelectOption = (e) => {
        e.preventDefault();
        if (selectedOption !== null) return;

        selectedOption = optionIndex;
        nextButton.disabled = false;
        const correctOption = question.answer;
        const optionButtons = optionsContainer.querySelectorAll('.options-container');

        optionButtons.forEach((button, index) => {
          button.disabled = true;
          if (index === correctOption) {
            button.classList.add('correct');
          }
        });

        if (optionIndex !== correctOption) {
          optionButton.classList.add('incorrect');
        }
      };

      optionButton.addEventListener('click', handleSelectOption);
      optionButton.addEventListener('touchend', handleSelectOption);
      optionsContainer.appendChild(optionButton);
    });
  }

  function showResult() {
    if (title) title.textContent = 'Quiz concluído';
    optionsContainer.innerHTML = `<p class="result-text" style="font-size: 1.8rem; text-align: center; margin: 2rem 0;">Você marcou <strong>${score}</strong> de <strong>${quizQuestions.length * pointsPerQuestion}</strong> pontos!</p>`;
    selectedOption = null;
    nextButton.textContent = 'RECOMEÇAR QUIZ';
    nextButton.disabled = false;

    const handleRestart = (e) => {
      e.preventDefault();
      window.location.reload();
    };

    nextButton.onclick = null;
    nextButton.addEventListener('click', handleRestart);
    nextButton.addEventListener('touchend', handleRestart);
  }

  const handleNextQuestion = (e) => {
    e.preventDefault();
    if (selectedOption === null) return;

    if (selectedOption === quizQuestions[currentQuestion].answer) {
      score += pointsPerQuestion;
    }

    currentQuestion += 1;
    if (currentQuestion < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  };

  if (nextButton) {
    nextButton.addEventListener('click', handleNextQuestion);
    nextButton.addEventListener('touchend', handleNextQuestion);
  }

  if (quizQuestions.length > 0) {
    showQuestion();
  } else if (quizContainer) {
    quizContainer.textContent = 'Não foi possível carregar as perguntas.';
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
});