document.addEventListener('DOMContentLoaded', () => {
  // --- GERENCIAMENTO DE TELA CHEIA EM TOTEM ---
  // Ativa o modo de tela cheia usando a API compatível com o navegador disponível.
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

  // Reativa tela cheia no primeiro toque ou clique da página e remove os ouvintes depois disso.
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

    // Conta três cliques no botão invisível para entrar ou sair da tela cheia.
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
      question: "Em que data a INTEG foi criada?",
      options: ["08/12/2002", "22/03/2001", "15/07/2010", "01/01/2000"],
      answer: 0
    },
    {
      question: "Qual é a natureza jurídica da INTEG?",
      options: [
        "Empresa privada com fins lucrativos",
        "Órgão público municipal",
        "Associação civil sem fins lucrativos, de utilidade pública",
        "Cooperativa de crédito"
      ],
      answer: 2
    },
    {
      question: "Qual certificação CERNE a INTEG conquistou em 2023?",
      options: ["CERNE 1", "CERNE 2", "CERNE 3", "CERNE 4"],
      answer: 2
    },
    {
      question: "O que é a NOVATEC?",
      options: [
        "Um evento anual de startups",
        "A Agência de Inovação Tecnológica da UNICENTRO",
        "Uma empresa incubada",
        "Um programa de bolsas do SEBRAE"
      ],
      answer: 1
    },
    {
      question: "Quais instituições apoiaram a criação da INTEG em 2001?",
      options: [
        "Apenas a Prefeitura de Guarapuava",
        "FIEP/SESI/SENAI, com apoio do SEBRAE, ACIG, Prefeitura e UNICENTRO",
        "Somente o Governo Federal",
        "Bancos privados da região"
      ],
      answer: 1
    },
    {
      question: "Qual é um dos principais objetivos da INTEG?",
      options: [
        "Vender produtos tecnológicos importados",
        "Fiscalizar empresas da região",
        "Apoiar a criação e o desenvolvimento de empresas de base tecnológica",
        "Financiar obras públicas"
      ],
      answer: 2
    },
    {
      question: "Qual destes é um segmento das empresas ligadas à INTEG?",
      options: [
        "Agricultura e agronegócios",
        "Mineração de carvão",
        "Transporte aéreo",
        "Construção naval"
      ],
      answer: 0
    },
    {
      question: "A INTEG está vinculada a qual instituição de ensino?",
      options: ["UTFPR", "UNICENTRO", "UEL", "UFPR"],
      answer: 1
    },
    {
      question: "Onde a INTEG está localizada?",
      options: ["Curitiba", "Ponta Grossa", "Guarapuava", "Cascavel"],
      answer: 2
    },
    {
      question: "Qual é o principal foco das empresas incubadas pela INTEG?",
      options: [
        "Produção agrícola em larga escala",
        "Negócios de base tecnológica e inovação",
        "Venda de veículos",
        "Atividades financeiras"
      ],
      answer: 1
    },
    {
      question: "Qual das opções abaixo melhor descreve a atuação da INTEG?",
      options: [
        "Apoiar a criação e o desenvolvimento de empresas inovadoras",
        "Fiscalizar empresas da região",
        "Produzir energia elétrica",
        "Executar projetos públicos de infraestrutura"
      ],
      answer: 0
    }
  ];

  const quizQuestions = (Array.isArray(window.questions) && window.questions.length > 0)
    ? window.questions
    : defaultQuestions;

  const maxScore = 100;
  const pointsPerQuestion = maxScore / quizQuestions.length;
  const formatScore = (value) => Number(value.toFixed(1));
  let currentQuestion = 0;
  let score = 0;
  let selectedOption = null;

  // Exibe a pergunta atual, atualiza o progresso e cria suas opções de resposta.
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

      // Marca a opção escolhida, revela a resposta correta e bloqueia novas escolhas.
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

  // Salva a pontuação e abre a página dedicada ao resultado do quiz.
  function showResult() {
    sessionStorage.setItem('quizResult', JSON.stringify({
      score: formatScore(score),
      total: maxScore
    }));
    window.location.href = 'resultPage.html';
  }

  // Valida a resposta atual, soma os pontos e avança para a próxima pergunta ou resultado.
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
    // Abre o modal de confirmação antes de sair do quiz.
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

      // Fecha o modal, reativa o botão de saída e remove o ouvinte do teclado.
      function cleanUp() {
        exitBtn.disabled = false;
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.removeEventListener('keydown', onKeyDown);
      }

      // Permite fechar o modal usando a tecla Escape.
      function onKeyDown(evt) {
        if (evt.key === 'Escape') cleanUp();
      }

      document.addEventListener('keydown', onKeyDown);

      btnNo.addEventListener('click', cleanUp);
      btnNo.addEventListener('touchend', cleanUp);

      // Redireciona para a página inicial depois da confirmação de saída.
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