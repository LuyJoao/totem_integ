# Contrato de Contexto — Totem INTEG

> **Para quem recebe este arquivo (Claude):** este documento é a fonte única de verdade sobre o projeto `totem_integ`. Ele descreve o que existe hoje, como se comporta, quais são os contratos internos (dados, globais JS, CSS, fluxo de telas) e o que **não** existe. Use-o antes de ler o código e antes de propor qualquer mudança. Não invente funcionalidades, integrações ou arquivos que não estão listados aqui. Se encontrar divergência entre este documento e o código, **aponte a divergência** e pergunte qual deve prevalecer — não "corrija" silenciosamente.
>
> Objetivo deste material: permitir que outra IA ou pessoa documente, mantenha ou evolua o totem sem quebrar o comportamento esperado em exposição pública (totem físico / tela cheia).

---

## 0. Metadados do projeto

| Campo | Valor |
|---|---|
| Nome | Totem INTEG |
| Cliente / instituição | Incubadora Tecnológica de Guarapuava (INTEG) — UNICENTRO |
| Tipo | Aplicação web estática (site de uma única página, 3 telas internas) |
| Idioma da interface | Português (pt-BR) |
| Repositório | `https://github.com/LuyJoao/totem_integ.git` |
| Branch principal | `main` |
| Publicação | `https://totem-integ.web.app/index.html` (Firebase Hosting, inferido pelo domínio; **não há `firebase.json` versionado**) |
| Build | Nenhum. Sem `package.json`, bundler, npm, testes ou lint |
| Dependências externas | Nenhuma (zero bibliotecas, zero CDN, zero fontes remotas) |
| Hardware alvo | Totem vertical 4K, mas com suporte responsivo a celular, tablet, notebook e monitor widescreen |
| Última alteração relevante | commit `0acf60c` — "adicionamos a pagina explicando cada empresa no totem" |

---

## 1. Resumo executivo

O projeto é um **totem interativo de divulgação institucional**. O visitante:

1. vê a tela inicial com a marca da INTEG, uma frase institucional, dois carrosséis infinitos de logotipos (empresas incubadas e empresas graduadas) e um QR Code de registro de presença;
2. toca na tela para entrar em tela cheia;
3. pode tocar em qualquer logo para abrir um **card grande** com nome e descrição da empresa;
4. pode iniciar um **quiz de 13 perguntas** sobre incubadoras, empreendedorismo e inovação;
5. responde uma pergunta por vez, recebendo feedback imediato (verde = correta, vermelho = errada);
6. ao final, vê a **pontuação de 0 a 100** e pode recomeçar ou sair.

Tudo roda em **um único `index.html`** na raiz. As telas são `div`s irmãs alternadas por classe `.active` — não há rotas, nem recarregamento de página.

---

## 2. Regras de ouro (contrato comportamental — não quebrar)

Estas regras definem a experiência aprovada. Qualquer refatoração deve preservá-las:

1. **Página única.** Home, quiz e resultado convivem no mesmo documento; a troca é feita por `window.showScreen('home' | 'quiz' | 'result')`.
2. **Uma pergunta por vez**, com exatamente 4 alternativas, e **uma única tentativa por pergunta** (após escolher, todas as alternativas são desabilitadas).
3. **Feedback imediato e definitivo**: a alternativa correta sempre fica verde (`#20A04E`), a escolha errada fica vermelha (`#E40016`).
4. **O botão de avançar nasce desabilitado** e só habilita após uma escolha.
5. **Pontuação total é sempre 100 pontos**, distribuída igualmente entre as perguntas (`100 / quantidadeDePerguntas`).
6. **Nunca exibir resposta correta antes da escolha** e nunca permitir trocar a resposta.
7. **Tela cheia** é solicitada no primeiro toque da home e novamente ao iniciar o quiz; existe um botão **invisível** no canto superior direito que alterna tela cheia com **3 toques em até 1,5 s**.
8. **Sair do quiz nunca é imediato**: sempre passa por um modal de confirmação ("Deseja realmente sair do Quiz?" → Não / Sim).
9. **O card da empresa só fecha pelo "X"** (não fecha com clique no fundo, nem com `Esc`).
10. **Ambiente de totem**: clique direito, `Ctrl+U` e `Ctrl+P` são bloqueados; `Esc` é bloqueado globalmente; seleção de texto e zoom por gesto estão desativados.
11. **Nenhum dado sai do navegador.** Não há backend, API, analytics, cookies ou requisições de rede (exceto o carregamento das próprias imagens e do QR Code estático).
12. **Reiniciar limpa tudo**: ao recomeçar ou sair, `sessionStorage.quizResult` é removido e o quiz volta à questão 1 com pontuação 0.
13. **Funciona por duplo clique no `index.html`** (protocolo `file://`) e também servido por HTTP estático. Não introduzir `fetch`, módulos ES (`type="module"`) ou qualquer coisa que exija servidor, a menos que solicitado.

---

## 3. Stack, execução e publicação

### 3.1 Tecnologias efetivamente usadas

- HTML5 semântico básico (`div`, `button`, `main`, `h1`).
- CSS3: Flexbox, `clamp()`, `min()/max()`, `@supports`, `@media`, `@keyframes`, `aspect-ratio`, variáveis CSS.
- JavaScript puro (ES5/ES2015 em scripts clássicos, sem módulos, sem `import`).
- `sessionStorage` para transportar a pontuação entre quiz e resultado.
- Fullscreen API com prefixos legados (`webkit`, `ms`).

### 3.2 Como rodar

```text
Opção A (recomendada para QA): abrir index.html direto no navegador.
Opção B (evita restrições de file://): python -m http.server 8000  →  http://localhost:8000/
```

Não há etapa de instalação.

### 3.3 Publicação

Site estático no Firebase Hosting. **Não existe configuração de deploy no repositório** (`firebase.json`, `.firebaserc` ou workflow de CI/CD). Publicar hoje é manual. Se o Claude for instruído a documentar o deploy, deve registrar isso como lacuna, não inventar comandos.

---

## 4. Mapa de arquivos (com status real)

```text
totem_integ/
├── index.html                      # ÚNICA página ativa. Contém as 3 telas, o QR, o modal de empresa e os <script>.
├── README.md                       # Documentação funcional existente (em pt-BR). Ver §11 sobre imprecisões.
├── DOCUMENTACAO_PROJETO.md         # Este contrato de contexto.
└── src/
    ├── css/
    │   ├── quizPage.css            # Estilos-base do quiz, alternativas, botão, modal de saída e carrossel legado.
    │   ├── resultPage.css          # Estilos-base do card de resultado e modal de saída.
    │   └── index.css               # Camada de override global: tokens, telas, logo, cards, home, QR, card da empresa e escala --qu.
    ├── js/
    │   ├── perguntasQuiz.js        # Fonte oficial das perguntas: window.questions (13 itens).
    │   ├── quizPage.js             # Motor do quiz: render, seleção, pontuação, avanço, modal de saída, fullscreen.
    │   ├── resultPage.js           # Render da pontuação, recomeçar, sair, fullscreen.
    │   ├── empresas.js             # Metadados das empresas: window.empresas (nome + descrição).
    │   ├── empresaModal.js         # Abre/fecha o card grande da empresa a partir do clique em .partner-card.
    │   └── index.js                # Orquestra telas, overlay inicial, fullscreen, botão secreto, bloqueios.
    ├── html/                       # ⚠️ LEGADO — não é usado pelo index.html
    │   ├── quizPage.html           # Versão standalone antiga do quiz (referencia só perguntasQuiz + quizPage).
    │   ├── resultPage.html         # Versão standalone antiga do resultado.
    │   └── finalPage.html          # ⚠️ ARQUIVO VAZIO (0 bytes).
    └── assets/
        ├── images/                 # 29 logos de empresas + logo_integ.png + qrcode.png (31 PNGs).
        └── logo empresas/          # Arquivos-fonte de marca: logo integ.pdf e logo integ.cdr.
```

**Ordem de carregamento dos scripts em `index.html` (importante para dependências):**

```html
1. src/js/perguntasQuiz.js   → define window.questions (dados puros)
2. src/js/quizPage.js        → consome window.questions; define window.resetQuiz
3. src/js/resultPage.js      → define window.renderResult
4. src/js/empresas.js        → define window.empresas (dados puros)
5. src/js/empresaModal.js    → IIFE; usa window.empresas e #empresa-modal
6. src/js/index.js           → define window.showScreen / requestFullscreen / exitFullscreen
```

`index.js` é o último e por isso `showScreen` só existe depois que os outros módulos já registraram seus `DOMContentLoaded`. Nenhum módulo chama `showScreen` durante a inicialização — o encadeamento só ocorre em interações do usuário. **Manter essa ordem.**

---

## 5. Arquitetura de runtime

### 5.1 Padrão de inicialização

Cada arquivo JS expõe uma função `initializeXxx()` com **guarda de idempotência global**:

```js
if (window.__totemQuizInitialized) return;      // quizPage.js
if (window.__totemIndexInitialized) return;     // index.js
if (window.__totemResultInitialized) return;    // resultPage.js
```

E cada um se auto-invoca assim:

```js
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeXxx);
} else {
  initializeXxx();
}
```

Consequência: os scripts podem ser incluídos em qualquer página sem duplicar listeners (as flags são por carregamento de documento). `empresaModal.js` é a exceção: é um IIFE que roda na hora e sai se `#empresa-modal` não existir.

### 5.2 As três telas

| Tela | id | Classe ativa | Papel |
|---|---|---|---|
| Home | `#screen-home` | `.screen.active` | Logo, título, subtítulo, botão de quiz, carrossel de incubadas e de graduadas |
| Quiz | `#screen-quiz` | `.screen.active` | Logo, número da questão, pergunta, 4 alternativas, botão avançar, "Sair do Quiz" |
| Resultado | `#screen-result` | `.screen.active` | Logo, card com pontuação, "Recomeçar Quiz", "Sair do Quiz" e os dois carrosséis |

`showScreen(nome)` percorre o mapa `{home, quiz, result}`, aplica/remove `.active` e controla o overlay inicial:

```js
overlay.style.display       = nome === 'home' ? 'flex' : 'none';
overlay.style.pointerEvents = nome === 'home' ? 'auto' : 'none';
```

Ou seja: **voltar para a home reexibe o overlay "Toque em qualquer lugar para iniciar o Totem"**. Isso é comportamento esperado (o totem volta ao estado de atração).

### 5.3 API global exposta (contrato entre arquivos)

| Global | Definido em | Tipo | Consumido por |
|---|---|---|---|
| `window.questions` | `perguntasQuiz.js` | `Array<Pergunta>` | `quizPage.js` |
| `window.empresas` | `empresas.js` | `Record<string, Empresa>` | `empresaModal.js` |
| `window.resetQuiz()` | `quizPage.js` | função | `index.js` (iniciar), `resultPage.js` (recomeçar/sair), modal de saída |
| `window.renderResult()` | `resultPage.js` | função | `quizPage.js` (ao finalizar) |
| `window.showScreen(nome)` | `index.js` | função | `quizPage.js`, `resultPage.js` |
| `window.requestFullscreen()` | `index.js` | função | interno + disponível |
| `window.exitFullscreen()` | `index.js` | função | interno + disponível |
| `window.closeEmpresaModal()` | `empresaModal.js` | função | uso opcional por código |
| `window.__totemIndexInitialized` | `index.js` | flag | guarda de init |
| `window.__totemQuizInitialized` | `quizPage.js` | flag | guarda de init |
| `window.__totemResultInitialized` | `resultPage.js` | flag | guarda de init |

**Regra:** nenhuma dessas globais pode ser renomeada sem atualizar todos os consumidores. Elas são a "API interna" do projeto.

---

## 6. Fluxos e comportamentos detalhados

### 6.1 Boot

1. Navegador carrega `index.html`, 3 CSS e 6 JS.
2. `quizPage.js` renderiza **a primeira pergunta já na inicialização** (mesmo com a tela de quiz oculta) e desabilita o botão avançar.
3. `resultPage.js` renderiza o resultado a partir do `sessionStorage` (ou "0 de 100" se não houver nada).
4. `index.js` garante `showScreen('home')` e liga os handlers.

### 6.2 Home e overlay inicial

- `#start-overlay` é fixo, cobre 100vw/100vh, `z-index: 9999`, fundo azul quase opaco, texto grande e `cursor: pointer`.
- No primeiro `click` **ou** `touchend`: `preventDefault()`, pede tela cheia e **oculta o overlay** (`display: none` + `pointer-events: none`).
- O overlay **não** desaparece sozinho e **não** tem timeout.

### 6.3 Tela cheia

Existem **duas implementações independentes** (dívida técnica conhecida, ver §11):

- `index.js` — para home/global, com `requestFullscreen()` e `exitFullscreen()`.
- `quizPage.js` e `resultPage.js` — cada um tem sua própria `forceFullscreen()` com prefixos `webkit`/`ms`.

Comportamentos:

- Ao iniciar o quiz, `index.js` chama `requestFullscreen()` antes de trocar de tela.
- `quizPage.js` registra um listener global de `click`/`touchend` que força tela cheia **uma única vez** e se remove em seguida; também tenta `forceFullscreen()` na init (pode falhar silenciosamente por falta de gesto do usuário — o `.catch(() => {})` engole o erro).
- O botão secreto `#exit-fullscreen-btn` é **invisível**, `10vw × 10vw`, fixo no canto superior direito, `z-index: 9998`, com `title="Atalho de Tela Cheia"`.
- **3 toques em até 1500 ms** alternam entre entrar e sair da tela cheia. O contador zera após 1,5 s ou após o terceiro toque.
- `quizPage.js` e `resultPage.js` procuram primeiro IDs alternativos (`#exit-fullscreen-btn-quiz`, `#exit-fullscreen-btn-result`) e caem no `#exit-fullscreen-btn` padrão. Ou seja, o botão é **compartilhado**, e cada módulo adiciona seu próprio contador — na prática há handlers sobrepostos no mesmo elemento (ver §11).

### 6.4 Iniciar o quiz

`#startBtn` ("Iniciar o Quiz"):

```js
preventDefault()
requestFullscreen()
window.resetQuiz()      // zera estado, limpa sessionStorage, renderiza questão 1
showScreen('quiz')
```

O botão responde a `click` **e** `touchend`; o `preventDefault()` evita o clique duplicado típico de dispositivos móveis.

### 6.5 Responder e avançar

- Cada alternativa é um `<button class="options-container">` criado dinamicamente em `.question-container`.
- Ao escolher (primeira vez): `selectedOption = índice`; **todos** os botões recebem `disabled = true`; a correta ganha `.correct`; se a escolhida for errada, ganha `.incorrect`; o botão avançar é habilitado.
- Escolhas posteriores são ignoradas (`if (selectedOption !== null) return;`).
- O texto do botão muda para **"FINALIZAR QUIZ"** na última pergunta.
- `handleNextQuestion` tem **debounce de 400 ms** (`lastNextAction`) para evitar avanço duplo por `click` + `touchend`.
- Só avança se `selectedOption !== null`.
- Ao avançar: se acertou, soma `pointsPerQuestion`; incrementa o índice; se acabaram as perguntas, chama `showResult()`.

### 6.6 Resultado

`showResult()` (em `quizPage.js`):

```js
sessionStorage.setItem('quizResult', JSON.stringify({ score: formatScore(score), total: 100 }));
window.renderResult();          // atualiza o texto
window.showScreen('result');    // troca a tela
```

`renderResult()` (em `resultPage.js`) faz o inverso: lê `quizResult`, valida com `Number.isFinite`, e escreve:

```html
Você marcou <strong>{Math.round(score)}</strong> de <strong>{Math.round(total)}</strong> pontos!
```

**Atenção contratual:** o `score` é armazenado arredondado a 1 casa (`formatScore`), mas **exibido arredondado para inteiro** (`Math.round`). Com 13 perguntas, o valor por acerto é ≈ 7,69, então a tela final mostra números inteiros como 8, 100, 92 etc.

### 6.7 Recomeçar

`#screen-result .next-button` ("RECOMEÇAR QUIZ") → `resetQuiz()` + `showScreen('quiz')`. Não passa pela home nem pelo overlay.

### 6.8 Sair do quiz (modal)

Disponível tanto no quiz (`#screen-quiz .exit-text`) quanto no resultado (`#screen-result .exit-text`).

1. O botão é desabilitado durante o modal (anti duplo-toque).
2. É criado dinamicamente `.confirm-overlay > .confirm-modal` com texto "Deseja realmente sair do Quiz?" e botões **Não** / **Sim**.
3. **Não** (ou `Esc`) fecha e reabilita o botão. Foco inicial vai para "Não".
4. **Sim**:
   - `quizPage.js`: `resetQuiz()` e, após `setTimeout(…, 150)`, `showScreen('home')` (o atraso evita conflito com a remoção do overlay).
   - `resultPage.js`: `resetQuiz()` e `showScreen('home')` imediatamente.
5. O modal tem `role="dialog"` e `aria-modal="true"`, mas **não** faz focus trap.

### 6.9 Card grande da empresa (modal)

- Qualquer clique em `.partner-card` **fora** do modal abre o card.
- A chave de busca é derivada do **nome do arquivo da imagem sem extensão**:

```js
src.split('/').pop().replace(/\.[^.]+$/, '')   // "src/assets/images/genoBit.png" → "genoBit"
```

- O modal copia `src` e `alt` da logo, preenche nome e descrição a partir de `window.empresas[chave]`. Se a empresa não existir no dicionário, cai em `alt` e não mostra descrição.
- Descrição vazia → parágrafo com `display: none`.
- Ao abrir: `.empresa-card` volta ao topo, modal recebe `.open` e `aria-hidden="false"`, e `document.body` recebe `.empresa-aberta`.
- `.empresa-aberta` **pausa os carrosséis** via `animation-play-state: paused`.
- Só fecha pelo botão `.empresa-close` ("×"), que remove `.open`, restaura `aria-hidden="true"` e remove `.empresa-aberta`.

### 6.10 Bloqueios de totem

Registrados em `index.js`, `quizPage.js` e `resultPage.js` (duplicados):

| Evento | Ação |
|---|---|
| `contextmenu` | `preventDefault()` (menu de contexto nunca abre) |
| `keydown` com `Ctrl+U` / `Ctrl+P` | `preventDefault()` (bloqueia "ver código-fonte" e "imprimir") |
| `keydown` `Escape` | `preventDefault()` (impede sair da tela cheia pelo teclado) |
| Seleção de texto | `user-select: none` + `-webkit-touch-callout: none` |
| Zoom por gesto | `<meta name="viewport" content="… maximum-scale=1.0, user-scalable=no">` |

---

## 7. Contratos de dados

### 7.1 `window.questions` — banco de perguntas

Arquivo: `src/js/perguntasQuiz.js`. Array de objetos:

```js
{
  question: string,        // enunciado
  options: [string, string, string, string],  // sempre 4 alternativas
  answer: number           // índice 0-based da alternativa correta
}
```

Regras:

- `answer` é **índice baseado em zero** (`0`..`3`).
- Sempre 4 opções (o layout foi desenhado para 4; mais opções quebram a altura do card).
- O código em `quizPage.js` **possui um array de fallback interno** (`defaultQuestions`, 12 perguntas) usado somente se `window.questions` não existir ou estiver vazio. **Esse fallback é diferente do conteúdo oficial** — ver §11.
- Quantidade atual: **13 perguntas** (12 temáticas + 1 bônus sobre "primeira atitude com uma ideia inovadora").

Temas cobertos: significado da sigla, data de criação, natureza jurídica, papel de incubadora, empresa incubada, objetivos, empreendedorismo, benefícios, inovação, networking, ações de desenvolvimento, importância no ecossistema, atitude inicial do empreendedor.

### 7.2 `window.empresas` — metadados das empresas

Arquivo: `src/js/empresas.js`. Dicionário:

```js
window.empresas = {
  chaveDoArquivoDaLogo: { nome: string, descricao: string }
}
```

- A **chave deve ser idêntica ao nome do PNG sem extensão** (case-sensitive): `terra_amazonica.png` → `terra_amazonica`; `idea.png` → `idea` (nome exibido "Idea Jogos").
- `descricao: ""` → o parágrafo não é renderizado.
- Hoje: **11 incubadas** (todas sem descrição) e **18 graduadas** (apenas 4 com descrição: Exatamente, Tecnoquisa, AEPA, Idea Jogos).
- Inconsistência de capitalização conhecida: o arquivo é `genoBit.png`/`hydroBrasil.png` e a chave é `genoBit`/`hydroBrasil`; manter exatamente assim.

### 7.3 `sessionStorage`

| Chave | Formato | Escrita | Leitura | Remoção |
|---|---|---|---|---|
| `quizResult` | `{"score": number, "total": number}` | `quizPage.js > showResult()` | `resultPage.js > renderResult()` | `resetQuiz()` |

- `total` é sempre `100`.
- `score` é um número com até 1 casa decimal.
- Sem o registro, a tela de resultado mostra **0 de 100**.
- Não há histórico, identificação de visitante, envio ou exportação de resultados.

---

## 8. Regra de pontuação

```js
const maxScore = 100;
const pointsPerQuestion = maxScore / quizQuestions.length;   // 100 / 13 ≈ 7,6923
const formatScore = (value) => Math.round(value * 10) / 10;  // 1 casa decimal
```

- Acerto soma `pointsPerQuestion`; erro soma 0.
- Pontuação máxima possível: exatamente `100` quando todas estão corretas (13 × 100/13), sujeita a ponto flutuante — o `Math.round` final normaliza.
- **Não há penalidade** por erro, nem tempo, nem limite de tentativas.
- Se o número de perguntas mudar, a pontuação se redistribui automaticamente; nada mais precisa ser alterado.

---

## 9. Design system e layout

### 9.1 Paleta

| Papel | Valor |
|---|---|
| Azul institucional (primário) | `#13317A` |
| Azul médio (gradiente) | `#1E4798` |
| Azul escuro (gradiente) | `#122864` |
| Azul de texto sobre card | `#122555` |
| Amarelo de destaque | `#ffcc00` |
| Fundo dos cards | `#F4F9FE` |
| Branco | `#FFFFFF` |
| Verde de acerto | `#20A04E` |
| Vermelho de erro | `#E40016` |
| Borda neutra | `#D5DFEC` |
| Texto claro da home | `#E9EFF6` |

Fundo global: `linear-gradient(180deg, #13317A 0%, #1E4798 50%, #122864 100%)`.

### 9.2 Tokens CSS (`:root` em `index.css`)

```css
--logo-size: 30vw;   /* fallback */
--card-size: 22vw;   /* fallback */
--qu: 1.6vw;         /* unidade de escala do quiz/resultado/modal */
--qr-size: 14vw;     /* quadrado branco do QR */

@supports (width: min(1vw, 1vh)) {
  --logo-size: max(5rem, min(38vw, 18vh));
  --card-size: max(4.5rem, min(22vw, 14vh));
  --qu:        min(1.6vw, 1.2vh);
  --qr-size:   max(6rem, min(14vw, 9vh));
}
```

**Conceito central:** escalar pela **menor dimensão da tela** (`min(vw, vh)`), não por breakpoints. Um totem vertical 4K e um celular usam a mesma lógica proporcional. A unidade `--qu` é o "módulo" de tamanho de todo o bloco de quiz, resultado e modal (`width: calc(var(--qu) * 50)` etc.). Ao criar componentes novos nessa área, **exprimir tamanhos em múltiplos de `--qu`**.

> `--qu: min(1.6vw, 1.2vh)` é bastante conservador: em 1080p retrato tende a ~12px, resultando em cards de ~600px de largura. Alterar esse valor altera **todas** as telas de quiz/resultado/modal simultaneamente.

### 9.3 Breakpoints

| Faixa | Onde | Efeito |
|---|---|---|
| `≤ 600px` | `quizPage.css`, `resultPage.css`, `index.css` | Celular: `clamp()` em tudo, cards de ~4,5–7rem, modal 80vw, `100dvh` |
| `601px–1599px` | idem | Notebook/desktop: tamanhos fixos confortáveis (quiz 30em, cards 6–8rem) |
| `≥ 601px` | `index.css` (bloco `--qu`) | Escala proporcional por `--qu`, sobrepondo os dois anteriores |
| `≥ 1600px` | — | Sem regra própria; cai no `min(vw, vh)` do `@supports` |

**Ordem de cascata dos CSS em `index.html`:** `quizPage.css` → `resultPage.css` → `index.css`. O `index.css` vence empates por vir por último e por usar seletores mais específicos com prefixo (`#screen-quiz …`, `#screen-result …`, `.screen .logo-area …`). **Qualquer novo override deve ir em `index.css`**, não nos outros dois.

### 9.4 Mapa de z-index

| Camada | z-index |
|---|---|
| `.empresa-modal` (card da empresa) | `9990` |
| Botão invisível de tela cheia | `9998` |
| `#start-overlay` (toque para iniciar) | `9999` |
| `.confirm-overlay` (sair do quiz) | `10000` |
| `#qr-presenca` | `100` |

O QR é `pointer-events: none` (não clicável). O botão invisível de 10vw no canto superior direito **se sobrepõe parcialmente** à área do QR — tocar no QR conta para o contador de 3 toques. Comportamento conhecido e aceito.

### 9.5 Carrosséis

- Estrutura: `.carousel-container` (janela com `overflow: hidden`) > `.carousel-track` (`display: flex; width: max-content`).
- Loop infinito **por duplicação manual do conteúdo no HTML**: a lista de empresas aparece **duas vezes** dentro do track, e a animação vai de `0` a `-50%` (esquerda) ou de `-50%` a `0` (direita).
- `track-left` = `scrollLeft` 50s linear infinite; `track-right` = `scrollRight` 50s linear infinite.
- Duplicar/remover uma empresa exige duplicar/remover **nas duas metades**, senão o loop "pula".
- `body.empresa-aberta` pausa todos os tracks.
- Classes reaproveitadas: a home usa `.partners-section`, o resultado idem, e existe um `#result-carousel` legado dentro da tela de quiz que está permanentemente `display: none`.

### 9.6 Card grande da empresa

- `.empresa-modal` fixo, `inset: 0`, fundo `rgba(0,0,0,.6)`, centralizado.
- `.empresa-card`: fundo `#F4F9FE`, `border-radius` grande, largura `calc(var(--qu) * 58)` no desktop e `92vw` no celular, `max-height: 88–90vh` com **scroll interno** (descrições longas rolam dentro do card).
- Contém: botão fechar circular azul, logo em caixa branca, `h2` com nome, `p` justificado com descrição.
- Não há animação de entrada/saída — abre e fecha instantaneamente.

---

## 10. Inventário de conteúdo

### 10.1 Empresas incubadas (11)

`citom`, `educador`, `genoBit`, `hydroBrasil`, `miceliar`, `palicare`, `zaaier`, `incluir`, `nano`, `prospecta`, `verde_serra`.

### 10.2 Empresas graduadas (18)

`exatamente`, `tecnoquisa`, `aluminnium`, `klara`, `citrodora`, `sace`, `lumabio`, `organic`, `honeyglass`, `umporum`, `terra_amazonica`, `enfermatech`, `aepapa`, `sec4us`, `idea`, `b2farm`, `kartech`, `expertin`.

### 10.3 Assets

| Arquivo | Uso |
|---|---|
| `src/assets/images/logo_integ.png` | Logo da INTEG no círculo branco das 3 telas |
| `src/assets/images/*.png` (29) | Logos das empresas nos carrosséis e no card grande |
| `src/assets/images/qrcode.png` | QR Code fixo "Registre sua presença" (todas as telas) |
| `src/assets/logo empresas/logo integ.pdf` | Fonte vetorial da marca (não usada em runtime) |
| `src/assets/logo empresas/logo integ.cdr` | Fonte CorelDRAW da marca (não usada em runtime) |

- O QR é **estático**: não há geração dinâmica, nem link de destino no código.
- Se `qrcode.png` faltar, o `onerror` do `<img>` esconde a imagem, mas **o rótulo "Registre sua presença" permanece**. O arquivo existe hoje.
- Logos são PNGs de tamanhos variados; o CSS normaliza com `object-fit: contain` em 80% do card.

---

## 11. Estado atual: dívidas técnicas, inconsistências e riscos

Esta seção existe para que o Claude **não trate sintomas como bugs novos** e saiba o que documentar como limitação.

| # | Item | Detalhe | Impacto |
|---|---|---|---|
| 1 | **Dois bancos de perguntas** | `perguntasQuiz.js` tem 13 perguntas (oficiais). `quizPage.js` tem `defaultQuestions` com 12 perguntas **diferentes** (inclui CERNE 3, NOVATEC, 08/12/2002), usado só como fallback. | Conteúdo divergente se `window.questions` falhar ao carregar. |
| 2 | **README desatualizado** | Diz "12 perguntas"; o real é 13. Também não menciona `empresas.js`, `empresaModal.js`, QR Code nem o card de empresa. | Documentação enganosa. |
| 3 | **Lógica de fullscreen triplicada** | `index.js`, `quizPage.js`, `resultPage.js` têm cópias próprias. O botão secreto tem **até 3 contadores independentes** no mesmo elemento. | Comportamento imprevisível em cliques isolados (1 toque em um handler conta para todos). |
| 4 | **`finalPage.html` vazio** | 0 bytes, não referenciado. | Lixo de repositório; pode confundir. |
| 5 | **`src/html/` legado** | `quizPage.html` e `resultPage.html` são versões antigas standalone, sem `index.js`, `empresas.js` ou modal. Não são o app real. | Risco de alguém editar o arquivo errado. |
| 6 | **`#result-carousel` morto** | Markup presente na tela de quiz, `display: none` permanente e sem regra que o exiba. | Código morto, ~40 cards duplicados no DOM. |
| 7 | **`.question-text` sobrescrito** | `quizPage.js` faz `title.textContent = …` em `.Title`, destruindo o `div.question-text` interno. | O elemento `.question-text` existe no HTML mas nunca é usado. |
| 8 | **Fonte Inter não carregada** | `font-family` cita `'Inter'`, mas não há `@font-face` nem link para Google Fonts. | Renderização real usa `Segoe UI`/`Roboto`/`Helvetica`. |
| 9 | **Sem config de deploy** | Nenhum `firebase.json`, `.firebaserc`, `robots.txt`, `manifest` ou service worker. | Deploy manual, sem PWA/offline. |
| 10 | **Escape bloqueado** | `preventDefault` em `Escape` impede sair da tela cheia pelo teclado; o modal da empresa **não** fecha com Esc. | Intencional para totem; atrapalha testes em desktop. |
| 11 | **Sem acessibilidade completa** | Modal de empresa sem `tabindex`/focus trap; alternativas desabilitadas após escolha; contraste bom, mas sem navegação por teclado no fluxo. | Uso é por toque; não é requisito atual. |
| 12 | **Estado só em memória + sessionStorage** | Recarregar a página no meio do quiz volta à home e zera tudo. | Esperado, mas não documentado antes. |
| 13 | **Duplicação de listas de empresas** | Cada logo é escrita 2× por carrossel: 58 cards na home + 58 no resultado + 32 no carrossel legado do quiz → ~150 `<img>` no DOM. | Peso de HTML e manutenção manual. |
| 14 | **Sem versionamento/`package.json`/testes** | Nenhuma automação de qualidade. | Toda validação é manual (§14). |

---

## 12. Escopo negativo (o que este projeto **não** tem)

Não descrever, não prometer e não assumir como existente:

- Backend, API, banco de dados, autenticação ou painel administrativo.
- Envio ou armazenamento de resultados/leituras de QR (o QR é apenas uma imagem).
- Ranking, certificado, e-mail, impressão de resultado.
- Rotas/URLs por tela (`#/quiz` etc.) ou histórico do navegador.
- Internacionalização (só pt-BR estático).
- Modo quiosque nativo, auto-start, watchdog ou integração com sistema operacional do totem.
- Analytics, cookies, LGPD/consentimento.
- Testes automatizados, CI/CD, lint, formatação, TypeScript.
- Acessibilidade WCAG completa ou navegação por teclado no fluxo do quiz.
- Tema claro/escuro ou troca de identidade visual por configuração.

---

## 13. Guia de manutenção (receitas seguras)

### 13.1 Adicionar ou editar uma pergunta

1. Editar **apenas** `src/js/perguntasQuiz.js`.
2. Manter o objeto com `question`, `options` (4 itens) e `answer` (0–3).
3. Não é necessário mexer na pontuação: `100 / length` se ajusta sozinho.
4. Atualizar também o `defaultQuestions` de `quizPage.js` **somente se** quiser manter o fallback fiel (recomendado; hoje está divergente).
5. Validar: contador `n/13` → `n/14`, botão muda para "FINALIZAR QUIZ" na última, pontuação final = 100 com todas corretas.

### 13.2 Adicionar uma empresa

1. Salvar o PNG em `src/assets/images/` com nome **sem acento, sem espaço, sem caracteres especiais**.
2. Adicionar `{ nome, descricao }` em `src/js/empresas.js` usando **exatamente** o nome do arquivo sem `.png` como chave.
3. Adicionar o `.partner-card` correspondente **em todas as listas onde ela deve aparecer**, sempre **duas vezes** (loop infinito):
   - home — incubadas ou graduadas;
   - resultado — incubadas ou graduadas;
   - (opcional/legado) `src/html/quizPage.html`.
4. Se a ordem importa visualmente, inserir na **mesma posição** nas duas metades.
5. Validar: o loop não "pula", o card abre com nome e descrição corretos.

### 13.3 Alterar textos institucionais

`index.html`, seção `.title-area`: `h1` ("Incubadora Tecnológica de Guarapuava"), `p` ("UNICENTRO") e `#sub-title` ("Transformando ideias em negócios inovadores desde 2002.").

### 13.4 Alterar cores ou escala global

- Cores: `src/css/index.css` (paleta) — os outros dois CSS têm cópias das cores base.
- Escala: tokens `--qu`, `--logo-size`, `--card-size`, `--qr-size` em `:root`.
- **Nunca** editar tamanhos individualmente sem considerar o efeito em 4K + celular.

### 13.5 Adicionar uma quarta tela

1. Criar `div.screen` com id novo em `index.html`.
2. Registrar no mapa `screens` de `index.js`.
3. Trocar via `window.showScreen('novoId')`.
4. Preferir estilos em `index.css` usando `--qu`.

### 13.6 Trocar o QR Code

Substituir `src/assets/images/qrcode.png` mantendo o nome. Sem alteração de código.

---

## 14. Checklist de aceitação (QA manual)

Executar em **celular (≤600px)**, **notebook (601–1599px)** e **tela grande/4K (≥1600px)**:

**Home**
- [ ] Overlay "Toque em qualquer lugar…" cobre a tela e desaparece no primeiro toque.
- [ ] Tela cheia é solicitada nesse toque.
- [ ] Logo, título, "UNICENTRO" e subtítulo legíveis e sem corte.
- [ ] Dois carrosséis animam em sentidos opostos, sem "pulo" no loop.
- [ ] QR Code e rótulo visíveis no canto superior direito em todas as telas.
- [ ] Clicar em um logo abre o card com nome correto; empresas sem descrição não mostram parágrafo.
- [ ] Com o card aberto, os carrosséis estão pausados.
- [ ] O card só fecha no "×".
- [ ] Clique direito não abre menu; `Ctrl+U` e `Ctrl+P` não funcionam.

**Quiz**
- [ ] "Iniciar o Quiz" leva à questão 1/13 com botão desabilitado.
- [ ] Alternativas desabilitam após a escolha; correta verde, errada vermelha.
- [ ] Botão habilita só após escolha e não avança duas perguntas num toque.
- [ ] Última questão mostra "FINALIZAR QUIZ".
- [ ] "Sair do Quiz" abre modal; "Não" volta ao quiz; "Sim" volta à home com overlay.
- [ ] Sair e reiniciar zera pontuação e `sessionStorage`.

**Resultado**
- [ ] Pontuação exibida como "Você marcou X de 100 pontos!" (inteiro).
- [ ] "RECOMEÇAR QUIZ" volta à questão 1/13 zerado.
- [ ] "Sair do Quiz" pede confirmação e volta à home.
- [ ] Carrosséis de incubadas e graduadas aparecem e animam.

**Tela cheia**
- [ ] 3 toques rápidos no canto superior direito alternam tela cheia.
- [ ] `Esc` não sai da tela cheia.
- [ ] Nenhum scroll horizontal indesejado em nenhuma tela.

---

## 15. Prompt pronto para enviar ao Claude

> Copie o bloco abaixo junto com este arquivo (ou referencie o caminho `DOCUMENTACAO_PROJETO.md`).

```text
Você é um(a) engenheiro(a) de software sênior + technical writer. Trabalhe no repositório
"totem_integ" (totem interativo estático da INTEG/UNICENTRO).

REGRA Nº1: leia DOCUMENTACAO_PROJETO.md por inteiro antes de qualquer ação. Ele é a fonte
única de verdade sobre o que existe, como se comporta, os contratos de dados/globais/CSS e o
que NÃO existe. Não invente funcionalidades, integrações, dependências ou arquivos.

TAREFA: produzir documentação técnica completa e fiel do projeto, em português do Brasil.

Entregáveis:
1. Um README.md reescrito e atualizado (substituindo o atual), contendo: visão geral, público,
   stack, como executar, estrutura de arquivos com o status real de cada um, fluxo das 3 telas,
   contratos de dados, regra de pontuação, design system/responsividade, manutenção e limitações.
2. Em docs/: (a) arquitetura.md — init, ordem dos scripts, globais expostas, mapa de telas,
   máquina de estados do quiz; (b) dados.md — schemas de window.questions, window.empresas e
   sessionStorage; (c) ui-design-system.md — paleta, tokens --qu/--logo-size/--card-size/--qr-size,
   breakpoints, z-index, carrosséis, modal; (d) manutencao.md — receitas para adicionar pergunta,
   empresa, tela; (e) limitacoes-e-dividas-tecnicas.md — a partir da seção 11 deste contrato,
   sem inventar e sem "consertar".
3. Um diagrama em Mermaid do fluxo home → quiz → resultado (incluindo modal de saída,
   recomeçar e tela cheia).

REGRAS DE ESCRITA:
- Documente APENAS o que está no código/documento. Se algo for inferência, marque "(inferido)".
- Toda afirmação sobre comportamento deve citar o arquivo e, quando útil, a função/linha.
- Liste explicitamente as inconsistências encontradas (README diz 12 perguntas, existem 13;
  finalPage.html vazio; src/html/ é legado; lógica de fullscreen triplicada; #result-carousel
  morto; fonte Inter não carregada; sem firebase.json). NÃO corrija o código nesta tarefa.
- Mantenha a terminologia do projeto (telas, cards, carrosséis, quiz, incubadas, graduadas).
- Não reformate CSS/HTML/JS; esta entrega é somente documentação.

ANTES DE COMEÇAR: se algum ponto do contrato conflitar com o código, pare, liste os conflitos
e pergunte qual prevalece. Não faça suposições silenciosas.
```

---

## 16. Glossário

| Termo | Significado no projeto |
|---|---|
| **INTEG** | Incubadora Tecnológica de Guarapuava, vinculada à UNICENTRO |
| **Incubada** | Empresa em processo de incubação, apoiada pela INTEG |
| **Graduada** | Empresa que já concluiu a incubação |
| **Totem** | Terminal público vertical, em tela cheia, sem teclado |
| **Card** | Quadrado branco com o logo de uma empresa dentro do carrossel |
| **Card grande** | Modal aberto ao clicar em um card, com nome, logo e descrição |
| **Track** | Faixa animada que contém os cards duplicados |
| **Overlay inicial** | Camada azul "Toque em qualquer lugar para iniciar o Totem" |
| **Botão secreto** | Área invisível de 10vw no canto superior direito (3 toques = tela cheia) |
| **`--qu`** | Unidade de escala responsiva baseada na menor dimensão da tela |
| **`quizResult`** | Chave de `sessionStorage` com `{ score, total }` |
