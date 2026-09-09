# Totem INTEG

Aplicacao web estatica para um totem interativo da Incubadora Tecnologica de Guarapuava (INTEG/UNICENTRO). A aplicacao apresenta a identidade da INTEG, exibe carrosseis de empresas e conduz o visitante por um quiz institucional.

## Funcionalidades

- Tela inicial com logo, titulo institucional e empresas incubadas e graduadas.
- Carrosseis animados com os logotipos das empresas.
- Entrada em tela cheia apos o primeiro toque ou clique.
- Navegacao para o quiz pelo botao **Iniciar o Quiz**.
- Oito perguntas carregadas dinamicamente pelo JavaScript.
- Uma pergunta exibida por vez, seguindo a ordem definida no arquivo de perguntas.
- Cada resposta correta vale 10 pontos.
- Alternativa correta destacada em verde.
- Alternativa errada destacada em vermelho e a correta em verde.
- Resultado final com a pontuacao obtida e a pontuacao maxima.
- Botao para recomecar o quiz.
- Confirmacao antes de sair do quiz.
- Layout responsivo para celulares, tablets, computadores, notebooks e telas grandes/totens.

## Acesso online

Acesse a aplicacao hospedada em:

https://luyjoao.github.io/totem_integ/

## Como executar

A aplicacao nao possui dependencias ou etapa de compilacao. Ela pode ser aberta diretamente no navegador:

1. Abra o arquivo `index.html` na raiz do projeto.
2. Toque ou clique na tela inicial para iniciar o modo tela cheia.
3. Clique em **Iniciar o Quiz**.

Para evitar restricoes do navegador com arquivos locais, tambem e possivel iniciar um servidor estatico na raiz do projeto:

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
|-- index.html                    # Entrada da aplicacao
|-- perguntas-quiz.txt            # Versao copiavel das perguntas
|-- README.md
`-- src/
    |-- html/
    |   `-- quizPage.html          # Tela do quiz
    |-- css/
    |   |-- index.css              # Estilos da tela inicial
    |   `-- quizPage.css           # Estilos do quiz e responsividade
    |-- js/
    |   |-- index.js               # Tela cheia e navegacao inicial
    |   |-- perguntasQuiz.js       # Perguntas, alternativas e respostas
    |   `-- quizPage.js             # Fluxo, selecao e pontuacao do quiz
    `-- assets/
        |-- images/                # Logos e imagens usadas na interface
        `-- logo empresas/         # Arquivos de identidade visual
```

## Como alterar as perguntas

Edite `src/js/perguntasQuiz.js`. Cada item deve seguir este formato:

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

O campo `answer` usa indice iniciado em zero:

- `0` corresponde a primeira alternativa.
- `1` corresponde a segunda alternativa.
- `2` corresponde a terceira alternativa.
- `3` corresponde a quarta alternativa.

A pontuacao e definida em `src/js/quizPage.js` pela constante `pointsPerQuestion`. Atualmente, cada acerto vale 10 pontos.

## Fluxo do quiz

1. A pagina carrega as perguntas de `window.questions`.
2. A primeira pergunta e exibida automaticamente.
3. O participante escolhe uma alternativa.
4. O sistema mostra o resultado visual da escolha e bloqueia novas alternativas.
5. O botao **Proxima Pergunta** carrega a proxima questao.
6. Ao terminar, a pontuacao total e exibida.
7. O botao **Recomecar Quiz** reinicia a pagina.

## Tela cheia e saida

Na tela inicial, o primeiro toque ou clique solicita tela cheia. O botao invisivel no canto superior direito alterna o modo de tela cheia apos tres cliques rapidos.

No quiz, o botao **Sair do Quiz** solicita confirmacao antes de retornar para a tela inicial.

## Responsividade

Os estilos em `src/css/quizPage.css` possuem faixas para:

- Celulares: ate 600px.
- Tablets: de 601px a 1199px.
- Computadores e notebooks: de 1200px a 1599px.
- Monitores grandes e totens 4K: a partir de 1600px.

A barra de rolagem vertical permanece disponivel como fallback quando o conteudo nao couber na altura da tela.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Fullscreen API
- Layout responsivo com media queries

Nao e necessario instalar Node.js, npm ou outras bibliotecas para executar a aplicacao.
