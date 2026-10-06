/* Card grande da empresa: abre ao clicar em um .partner-card e só fecha no X.
   Enquanto aberto, o body recebe a classe "empresa-aberta", que pausa os carrosséis. */
(function () {
  const modal = document.getElementById('empresa-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.empresa-close');
  const logoImg = modal.querySelector('.empresa-logo img');
  const nomeEl = modal.querySelector('.empresa-nome');
  const descEl = modal.querySelector('.empresa-desc');
  const cardEl = modal.querySelector('.empresa-card');

  function keyFromCard(card) {
    const img = card.querySelector('img');
    if (!img) return null;
    const src = img.getAttribute('src') || '';
    return src.split('/').pop().replace(/\.[^.]+$/, '');
  }

  function open(card) {
    const key = keyFromCard(card);
    const data = (window.empresas && window.empresas[key]) || {};
    const img = card.querySelector('img');

    logoImg.src = img.getAttribute('src');
    logoImg.alt = data.nome || img.alt || '';
    nomeEl.textContent = data.nome || img.alt || '';

    descEl.textContent = data.descricao || '';
    descEl.style.display = data.descricao ? '' : 'none';

    cardEl.scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('empresa-aberta');
  }

  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('empresa-aberta');
  }

  document.addEventListener('click', function (event) {
    const card = event.target.closest('.partner-card');
    if (card && !modal.contains(card)) open(card);
  });

  closeBtn.addEventListener('click', close);

  // Expõe para o resto do sistema, se precisar fechar por código.
  window.closeEmpresaModal = close;
})();