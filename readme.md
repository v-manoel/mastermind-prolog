# Mastermind: A Prolog Game

## Sobre:

O projeto consiste em um resolvedor para o jogo Masterming. O resolvedor tentará adivinhar uma senha que você pensou seguindo as regras do Mastermind. O agente solucionador do jogo Mastermind é um programa em Prolog que gera chutes sequenciais com base nas informações fornecidas pelo usuário. O agente solucionador utiliza um algoritmo inteligente para otimizar suas tentativas e reduzir o número de possibilidades a serem testadas. A cada chute, o usuário fornece o feedback na forma de uma lista contendo a quantidade de cores na posição correta e na posição incorreta, assim a cada iteração o agente tenta concluir a partir do histórico de respostas quais cores pertencem a cada posição, até que o usuário dê um feeback em que todas as posições estão no local correto, significando que o agente acertou a senha.

---

## O Solucionador:

O solucionador do prolog é baseado no algoritmo proposto por [Donald Knuth](https://stackoverflow.com/questions/62430071/donald-knuth-algorithm-mastermind). Nesta abordagem o agente utiliza o histórico de chutes realizados e feedbacks recebidos para estes chutes para delimitar o número de novos possíveis chutes.

- ### Solution Steps:

  Considere o cenário em que o código secreto é definido: `[1,3,1,4]`. O processo de solução por parte do agente, seguirá os seguintes passos:

  1. Forneça a primeira combinação válida do conjunto de soluções possíveis: `guess -> [1,1,1,1]`.

  2. Obtenha o feedback (`feedback -> [2,0]`) e atualize a memória do agente, através da lista de estados de turno, definindo o chute dado e feedback fornecido: `turn_states -> [([1,1,1,1], 2, 0)]`

  3. Remova do conjunto de soluções possíveis aqueles que sejam incompatíveis com os feedbacks já recebidos e retorne o primeiro válido:

     A solução `[1,1,1,2]`, por exemplo, deve ser desconsiderada, pois possui 3 números `1`, o que não corresponde ao feedback recebido anteriormente, que indicava que existiam apenas 2 números `1` no código secreto.

     A primeira solução válida do conjunto de soluções então seria o código `[1,1,2,2]`.

  4. Retorne ao step 2.

  5. Obtenha o feedback (`feedback -> [1,1]`) e atualize a memória do agente, através da lista de estados de turno, definindo o chute dado e feedback fornecido: `turn_states -> [([1,1,1,1], 2, 0), ([1,1,2,2], 1, 1)]`.

  6. Remova do conjunto de soluções possíveis aqueles que sejam incompatíveis com os feedbacks já recebidos e retorne o primeiro válido:

     A solução `[1,2,3,3]`, por exemplo, deve ser desconsiderada, pois embora corresponda a última informação recebida que indicava que havia 1 número na posição correta e outro na incorreta, quando comparado ao chute que foi fornecido (`[1,1,2,2]`), descumpre o primeiro feedback fornecido que indicava haver dois números `1`no código secreto.

     A primeira solução válida do conjunto de soluções então seria o código `[1,3,1,3]`.

  E assim o processo é repetido até que o agente consiga alcançar a solução correta, pela delimitação do conjunto de soluções possíveis.

## Arquitetura da Solução:

A arquitetura deste projeto no GitHub foi implementada como uma **API-based application**, dividida em frontend e backend.

### Backend

O backend foi escrito em Python e utiliza a biblioteca _prologMQI_ para realizar consultas _SWI Prolog_ a partir da aplicação Python. Foram definidos modelos (models) para representar diferentes elementos do jogo. Além disso, foi utilizado o padrão Singleton para garantir uma única instância do objeto responsável por fazer a interface entre o Python e o Prolog.
Foi definida uma API _Flask_ para gerenciar as requisições enviadas pelo usuário.

A API possui os seguintes endpoints:

- **POST /start**: Este endpoint recebe o código secreto informado pelo usuário e retorna o chute do agente (agente de inteligência artificial) e o código secreto definidos na base do Prolog.

- **POST /feedback**: Neste endpoint, é recebido o feedback do último chute do agente, informado pelo usuário. Em resposta, o endpoint retorna o novo chute do agente e o status do jogo.

- **GET /status**: Este endpoint retorna o status atual do jogo, o último chute do agente, o último feedback recebido, o código secreto do jogo e a lista de estados do agente.

### Frontend

O frontend foi desenvolvido utilizando JavaScript, CSS e HTML puro. Ele consiste em uma única visualização que permite que o usuário interaja com o jogo.

<div align="center">
  <img alt="Game Board" src="https://github.com/v-manoel/mastermind-prolog/assets/62719753/1343bfb8-ccfe-46ea-8f70-632709934f6c" width="60%" style="border: 1px solid black">
</div>

Na visualização do usuário as cores, que é conhecido apenas pelos seus códigos no backend, são apresentadas de acordo com o seguinte mapping (color: id):

<div align="center">
  <img alt="Color Mapping" src="https://github.com/v-manoel/mastermind-prolog/assets/62719753/12f99276-6268-4525-9cab-69ed6b47706f" width="50%" style="border: 1px solid black">
</div>

A representação do feedback é feita da mesma forma, enquanto no backend da aplicação o feedback é um objeto com dois componentes (o primeiro representando a quantidade de cores nas posições corretas no código especulado e a segunda a quantidade de cores na posição incorreta), na página web é realizado o seguinte mapeamento.

<div align="center">
  <img alt="Feedback Mapping" src="https://github.com/v-manoel/mastermind-prolog/assets/62719753/75bcbf18-d706-4814-a624-9cac28111f71" width="30%" style="border: 1px solid black">
</div>

- Verde: Significa que o chute fornecido possui uma cor e na posição correta.
- Vermelho: Significa que o chute fornecido possui uma cor certa na posição errada.
- Cinza: Significa que o chute fornecido não possui cor correta, nem posição correta.

---

## Contéudo:

O projeto divide seu conteúdo em diferentes branches estruturadas como:

- console-mode: nessa branch é possível executar apenas o solucionador prolog diretamente no console ou na ferramenta SWI-Prolog. Aqui podemos observar o funcionamento do agente e como o mesmo opera para adivinhar a senha escolhida pelo usuário a partir dos feedback dados.
- main: Execução completa do projeto, a partir de um Api-based-Application. Aqui o usuário interage com o agente através de uma interface onde o mesmo seleciona as cores que deseja para a senha, e ao clicar em "start", o solucionador apresenta em tela as cores do chute realizado e captando o feedback do usuário para esse mesmo chute. Esse processo se repete até que o agente acerta a senha ou identifique que houve inconsistência nos feedback e que não existe resposta possível.
- testes: Branch de validação do projeto. Foram definidos cenários de testes, onde escolhemos senhas e observamos se o comportamento do agente é de acordo com o esperado para determinados feedbacks do usuário. Se o usuário apresenta feedbacks corretos o agente precisa acertar a senha, entretanto o agente precisa identificar caso o usuário apresente feedbacks inconsistentes/contraditórios no que se refere a dar inicialmente feedbacks que indiquem um resultado, e em seguida apresente feedbacks que indiquem um resultado diferente para a mesma cor, reduzindo a lista de possibilidades que o agente considera até chegar a zero e consequentemente encerrar o jogo.

---

## Pré requisitos:

Para executar o programa você deve instalar:

- Python, versão 3 ou superior.
- [Swipl](https://www.swi-prolog.org/).
- Dependências definidas no arquivo `requirements.txt`

Ou possuir o `docker` instalado no seu sistema operacional:

---

## Como Executar?

- ### Sem docker:

Após instalar as dependências definidas em `requeriments.txt`, siga para o diretório **backend/src** e execute o arquivo **app.py**, utilize o comando `python3 app.py`.
Depois utilizando um servidor web abra a página `mastermind.html` e é só jogar !!!

- ### Utilizando docker:
  Basta navegar até a raiz do projeto e executar o comando `docker compose build && docker compose up -d`, para construir e iniciar a aplicação.

Após isto, basta acessar localhost:80/index.html e se divertir !
