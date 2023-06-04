## Files Description:

O jogo está implementado a partir de uma série de bases de conhecimento que estabelecem as regras e fatos necessários para o correto funcionamento do jogo. O projeto utiliza a seguinte estrutura de arquivos prolog _(\*.pl)_:

- #### **utils**

  A base utils define uma série de regras auxiliares que permitem a manipulação de estruturas utilizadas por outros predicados do jogo.

  - `element/3`: Responsável por encontrar o elemento de índice `x` de uma lista fornecida.

    Possui 3 parâmetros: O índice do elemento desejado, a lista para busca do element e o elemento a ser encontrado/definido.

  - `list_cmp/2`: Compara o conteúdo da cabeça e cauda de duas listas e determina se são iguais (todos os átomos das listas são os mesmos).

    São esperados 2 parâmetros correspondentes as listas para realizar a comparação.

  - `delete/3`: Encontra um elemento fornecido, numa lista informada e retornar o resto da lista, sem o elemento fornecido.

    Os parâmetros aqui são, o elemento a ser removido, a lista e o elemento para se setar o resultado.

  - `sum/2`: Soma todos os elementos de uma lista.

    Possui 2 parâmetros: a lista e o resultado da soma.

- #### **settings**

  Nesta base são definidas algumas regras e fatos que definem as características do mastermind.

  Alguns predicados são declarados como dinâmicos, para que possam ser modificados durante a execução do jogo. Como alguns dos fatos devem ser únicos na base, predicados auxiliares _(set\_\*)_ são utilizados para garantir que todos os outros fatos serão excluídos antes que o novo seja setado e que todas as regras para definição do fato sejam atendidos, de acordo com as regras do jogo - por exemplo, o código secreto deve ser uma lista composta apenas pelas cores previamente definidas através do fato `color/1`.

  - `guess_limit/1`: Fato dinâmico, que determina o número máximo de tentativas que o agente terá para tentar acertar o código secreto.

  - `secret_code/1`: Fato dinâmico que define a lista de cores que representa o código secreto no mastermind.

  - `code_visibility/1`: Fato booleano dinâmico que define se o código secreto será impresso no terminal a cada novo chute do agente, ou não.

  - `code_lengh/1`: Fato estático que define o tamanho do código secreto e dos chutes realizados pelo agente. O valor padrão deste fato é `4`.

  - `color/1`: Representa as cores presentes no game, este é um fato estático e por padrão são definidas 6 cores.

  - `colors/1`: Agrupa todos os fatos `color` em uma lista, com todas as cores definidas no jogo. Possui um único parâmetro que define a lista de cores resultante.

  - `random_colors_list/1`: Define uma lista de tamanho `code_lengh`, com cores aleatórias da lista definida em `colors`. O processo é realizado gerando indices aleatórios e obtendo o elemento correspondente da lista `colors` a partir do predicado auxiliar `element/3` definido em _utils.pl_.

- #### **controller**

  A base de conhecimento _controller_, funciona como engine do jogo, implementando as regras de execução e transições entre os estados do jogo. Este é o ponto de comunicação entre o usuário e o agente resolvedor do mastermind.
  o _controller_ implementa os seguintes predicados dinâmicos¹:

  - `feedback/1`: Fato dinâmico que define o último feedback fornecido pelo usuário.

    O feedback é uma lista com dois componentes/elementos. O primeiro é geralmente referenciado como **CorrectPos** e é um número que representa o número de cores na posição correta, presentes no chute do agente. O segundo componente, o **WrongPos**, representa a quantidade de cores que são corretas mas estão nas posições erradas.

  - `turn_states/1`: Fato dinâmico que define uma lista de `guess/3`:

    - O _turn_states_ representa os estados do jogo, ou experiência do agente, cada fato _guess_ presente na lista define o chute dado pelo agente e o feedback correspondente.

  - `current_guess_code/1`: Fato dinâmico que define a nova tentativa do agente acertar o código secreto a partir do feedback recebido e a experiência anterior, definida em _turn_states_.

  - `game_result/1`: Fato dinâmico que define o status do fim do jogo, se o agente perdeu pois alcançou o número de tentativas máximo, se ele acertou o código secreto, ou se o jogo foi interrompido abruptamente pois uma sequência de feedbacks inválidos foi recebido e não existem mais combinações possíveis que permitam que o agente ganhe o jogo. (neste caso o valor de game_result não é definido, mas o predicado `turn/1` retorna **false**, ao invés de **true**).

  Além destes, são definidos os predicados:

  - `reset_game/0`: Faz o _retractAll_ de todos os fatos dinâmicos, permitindo que o jogo seja executado novamente.

  - `run/1 & run/0`: É a regra que inicia o jogo, são definidas duas versões da regra _run_, na primeira delas você informa como parâmetro o código secreto que será utilizado na partida. A segunda regra _run/0_ irá gerá um código aleatório.

  Após definição do código o predicado invoca o predicado agent*step, que permitirá que o agente faça seu chute inicial, quando ele ainda não possui experiências armazenadas em \_turn_states*.

  - `agent_step/0`: Este predicado consulta o fato definido em _turn_states_ e informa o resultado da operação ao predicado `agent_guess/2` definido em _agent.pl_, que fará um novo chute.

  - `turn/1`: Predicado que proporciona a interação principal do jogo entre usuário e agente. O usuário invoca esse predicado para fornecer um novo feedback ao chute do agente.

  Em turn é então avaliado se o agente ganhou ou perdeu o jogo por meio do novo feedback fornecido, invocado o predicado _guess_check_. Caso não, a lista de estados é atualizada, por meio do predicado _update_state_ e um novo chute é solicitado por meio do predicado _turn_.

  - `update_state/2`: Este predicado recebe duas listas: o chute do agente (`current_guess_code/1`) e seu feedback (`feedback`) e faz o append destas informações na lista `turn_states`, conforme a estrutura de _guess_ (`guess(guess_code, CorrectPos, WrongPos)`)

  - `guess_check/2`: O _guess_check_ avalia se o jogo já terminou, são definidas três regras, a primeira verifica se a lista de estados de turno (`turn_states`) já possui tamanho igual ao definido em `guess_limit`, o que significa que o agente perdeu o jogo por exceder o número de tentativas de chute.

  A segunda regra verifica se o feedback fornecido indica que as 4 cores definidas pelo agente no seu último chute são as corretas e estão na posição correta.

  Por fim se nenhuma das regras anteriores for verdade, isto indica que o agente ainda não ganhou o jogo e por isto a terceira regra retorna `fail`².

- #### **agent**

  A base de conhecimento \_agent, define as regras utilizadas pelo agente resolvedor para realizar um novo chute e tentar adivinhar o código secreto. A base é composta pelas seguintes regras:

  - `code/2`: O predicado é responsável por definir e setar no primeiro parâmetro uma combinação de _n_ cores. _n_ é o tamanho da lista, que corresponde a `code_lenght`. Note que o predicado é executado recursivamente até que todas as combinações possíveis sejam encontradas. No caso da modelagem deste problema, onde o código de cores é definido como tamanho 4 e temos 6 cores possíveis para cada slot do código, temos que este predicado gerará um conjunto de 6⁴ (1296) combinações possíveis.

  - `potential/2`: Recebe uma lista de cores - uma das 1296 combinações definidas em `code` e a lista de estados do jogo (`turn_states`) e realiza a comparação da combinação com cada um dos chutes realizados anteriormente, verificando se a comparação dos chutes é igual ao feedback fornecido em cada turno.

  - `compare_codes/4`: Recebe duas listas - os elementos devem ser átomos definidos no fato `color` em _settings.pl_ - e invoca os predicados `compare_colors`e `compare_positions`, setar aos dois últimos parâmetros o resultado de `compare_positions` e o número de elementos na posição incorreta (`compare_colors - compare_positions`).

  - `compare_colors/3`: Recebe duas listas - os elementos devem ser átomos definidos no fato `color` em _settings.pl_ - e verifica/retorna a quantidade de elementos iguais nas duas listas.

  - `compare_positions/3`: Recebe duas listas - os elementos devem ser átomos definidos no fato `color` em _settings.pl_ - e verifica/retorna a quantidade de elementos iguais e nas mesmas posições nas duas listas.

  - `potential_code/2`: Executa o predicado `potential`, para cada um das combinações definidas em `code`. Caso nenhuma solução seja encontrada, significa que uma sequência de feedbacks inválidas foi fornecida.

  - `agent_guess/2`: Responsável apenas por invocar o predicado `potential_code`, recebe a lista de `turn_states` do _controller.pl_ e retorna o novo chute.

¹ <small> Assim como em _settings.pl_ são definidos predicados _(set\_\*)_, que validam que os novos valores dos predicados dinâmicos sejam definidos corretamente, um exemplo disto pode ser visto no predito `set_feedback/1`, que define uma serie de regras que devem ser atendidas para que um novo feedback seja fornecido. </small>

² <small> O fato de retornar _false/fail_, quando o agente ainda não ganhou o jogo faz com que seja necessário utilizar a diretiva de **not** (`/+`), quando se deseja verificar se o jogo deve continuar. </small>