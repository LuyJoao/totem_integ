# Totem INTEG

Aplicação web estática para um totem interativo da Incubadora Tecnológica de Guarapuava (INTEG/UNICENTRO). A interface apresenta a identidade institucional da INTEG, exibe carrosséis com empresas incubadas e graduadas e conduz o visitante por um quiz sobre a incubadora.

## Funcionalidades

- Tela inicial com logo, identidade visual da INTEG, título institucional e seções de empresas incubadas e graduadas.
- Carrosséis animados com logotipos de empresas em movimento contínuo.
- Solicitação automática de tela cheia ao abrir a aplicação e ao iniciar o quiz.
- Overlays de início e confirmação ao sair do quiz.
- Fluxo de telas com home, quiz e resultado em uma única página.
- 12 perguntas configuradas em JavaScript, carregadas em ordem pela variável `window.questions`.
- Seleção de uma alternativa por vez, bloqueando respostas posteriores após a escolha.
- Destaque visual da alternativa correta em verde e da resposta errada em vermelho.
- Cálculo de pontuação com total de 100 pontos distribuídos igualmente entre as perguntas.
- Tela final exibindo a pontuação obtida e permitindo reinício do quiz.
- Botão secreto no canto superior direito para alternar tela inteira com três cliques rápidos.
- Bloqueio de menu de contexto e teclas comuns de inspeção para manter o totem em ambiente de apresentação.
- Layout responsivo para celulares, tablets, notebooks e telas maiores/totens.

## Acesso online

Acesse a aplicação hospedada em:

https://totem-integ.web.app/index.html

## Como executar

A aplicação não possui dependências externas nem etapa de build. Ela pode ser aberta diretamente no navegador:

1. Abra o arquivo `index.html` na raiz do projeto.
2. Clique ou toque na tela inicial para iniciar a experiência em tela cheia.
3. Clique em **Iniciar o Quiz**.

Para evitar restrições de arquivos locais em alguns navegadores, também é possível rodar um servidor estático na raiz do projeto:

```powershell
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000/
```

## Estrutura do projeto

```text
.
|-- index.html                     # Estrutura principal da aplicação com os 3 módulos de tela
|-- README.md
|-- src/
|   |-- css/
|   |   |-- index.css              # Estilos da tela inicial e carrosséis
|   |   |-- quizPage.css           # Estilos do quiz, botões, modal e responsividade
|   |   `-- resultPage.css         # Estilos da tela de resultado
|   |
|   |-- js/
|   |   |-- index.js               # Controle da home, telas e fullscreen
|   |   |-- perguntasQuiz.js       # Banco de perguntas e respostas do quiz
|   |   |-- quizPage.js            # Lógica do quiz, pontuação e modal de saída
|   |   `-- resultPage.js          # Renderização do resultado e reinício do quiz
|   |
|   `-- assets/
|       |-- images/               # Imagens e logos usados na interface
|       `-- logo empresas/        # Arquivos gráficos de identidade visual
```

## Como alterar as perguntas

Edite o arquivo `src/js/perguntasQuiz.js`. Cada item do array deve seguir este formato:

```js
{
  question: "Texto da pergunta",
  options: [
    "Primeira alternativa",
    "Segunda alternativa",
    "Terceira alternativa",
    "Quarta alternativa"
  ],
  answer: 1
}
```

O campo `answer` usa índice baseado em zero:

- `0` = primeira alternativa
- `1` = segunda alternativa
- `2` = terceira alternativa
- `3` = quarta alternativa

A pontuação é calculada em `src/js/quizPage.js` com:

```js
const maxScore = 100;
const pointsPerQuestion = maxScore / quizQuestions.length;
```

Ou seja, o valor do acerto é distribuído igualmente entre todas as questões, com arredondamento simples final para apresentação.

## Fluxo real da aplicação

1. A página carrega a estrutura HTML e os scripts de cada tela.
2. A tela inicial exibe o logo, a mensagem de abertura e os carrosséis de empresas.
3. O primeiro clique ou toque ativa a solicitação de tela cheia e oculta o overlay inicial.
4. O botão **Iniciar o Quiz** chama `window.resetQuiz()` e abre a tela de perguntas.
5. O quiz exibe uma pergunta por vez e aguarda a escolha do visitante.
6. Ao selecionar uma opção, a alternativa correta é marcada em verde e a resposta errada em vermelho.
7. O botão **PRÓXIMA PERGUNTA** fica habilitado somente após seleção.
8. Quando todas as perguntas forem respondidas, o sistema salva o resultado em `sessionStorage` e mostra a tela final.
9. A tela final exibe a pontuação e oferece a opção de recomecar ou sair do quiz.

## Tela cheia e saída

- Na tela inicial, o primeiro toque ou clique solicita tela cheia.
- O botão invisível no canto superior direito alterna entre maximizar e sair da tela cheia após três cliques rápidos.
- O botão **Sair do Quiz** abre um modal de confirmação para voltar ao início.
- A mesma lógica existe na tela de resultado para confirmar a saída do quiz.

## Responsividade

Os estilos em `src/css/index.css`, `src/css/quizPage.css` e `src/css/resultPage.css` usam media queries para adaptar a interface a diferentes larguras de tela, incluindo:

- celulares
- tablets
- notebooks
- monitores widescreen
- totens e telas grandes

A aplicação também evita zoom de página e bloqueia ações de inspeção do navegador para manter a apresentação estável em ambiente de totem.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Fullscreen API (com prefixos de compatibilidade)
- Media queries para responsividade
- SessionStorage para persistência do resultado do quiz

Não é necessário instalar Node.js, npm ou qualquer biblioteca para executar esta aplicação.

## Observações importantes

- O arquivo principal do projeto é `index.html`.
- O conjunto de perguntas está em `src/js/perguntasQuiz.js` e pode ser alterado sem necessidade de recompilar.
- A lógica de navegação, cálculo e tela cheia está distribuída entre `src/js/index.js`, `src/js/quizPage.js` e `src/js/resultPage.js`.
- O comportamento atual da interface foi projetado para uso em totens e exibição em tela cheia, não como uma aplicação tradicional de múltiplas páginas.
