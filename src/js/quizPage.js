document.addEventListener('DOMContentLoaded', () => {
  const questionNumber = document.querySelector('.num-question');
  const questionText = document.querySelector('.question-text');
  const optionsContainer = document.querySelector('.question-container');
  const nextButton = document.querySelector('.next-button');
  const title = document.querySelector('.Title');
  const quizContainer = document.querySelector('.quiz-container');
  const quizQuestions = Array.isArray(window.questions) ? window.questions : [];
  const pointsPerQuestion = 10;
  let currentQuestion = 0;
  let score = 0;
  let selectedOption = null;

  function showQuestion() {
    const question = quizQuestions[currentQuestion];
    selectedOption = null;
    questionNumber.textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
    questionText.textContent = question.question;
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
      optionButton.addEventListener('click', () => {
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
      });
      optionsContainer.appendChild(optionButton);
    });
  }

  function showResult() {
    title.textContent = 'Quiz concluído';
    optionsContainer.innerHTML = `<p class="result-text">Você marcou ${score} de ${quizQuestions.length * pointsPerQuestion} pontos.</p>`;
    selectedOption = null;
    nextButton.textContent = 'RECOMEÇAR QUIZ';
    nextButton.disabled = false;
    nextButton.onclick = () => window.location.reload();
  }

  nextButton.addEventListener('click', () => {
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
  });

  if (quizQuestions.length > 0) {
    showQuestion();
  } else {
    quizContainer.textContent = 'Não foi possível carregar as perguntas.';
  }

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
        setTimeout(() => window.location.href = '../index.html', 150);
      });
    });
  }
});