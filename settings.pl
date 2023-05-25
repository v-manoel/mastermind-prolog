% Game settings module

% Dynamic settings:
:-
    dynamic(secret_code/1),
	retractall(secret_code(_)),
	dynamic(guess_limit/1),
	dynamic(code_visibility/1),
	retractall(guess_limit(_)),
	retractall(code_visibility(_)).

% Fact: set default agent guess limit as 100
guess_limit(100).

% Fact: set default secret code lenght as 4
code_length(4).

% Fact: set default game colors set
color(1).
color(2).
color(3).
color(4).
color(5).
color(6).

% Fact: set secret code visibility as true
code_visibility(true).


% Predicate: random_colors_list(/2)
% Params: ListLength, List
% Generate a random colors list with the game colors set
random_colors_list(0, []).

random_colors_list(Length, [Head|Tail]):-
    colors(ColorsList),
    length(ColorsList, ColorsLength),
    Length > 0,
    Index is random(ColorsLength),
    element(Index, ColorsList, Head),
    RestLength is Length - 1,
    random_colors_list(RestLength, Tail),
    !.


% Predicate: game_settings(/0)
% Params: 
% Print the game settings options
game_settings:-
	guess_limit(GuessLimit),
	writef('Quantidade máxima de chutes: %q.\n', [GuessLimit]),
	colors(ColorsList),
	writef('Lista de cores possíveis: %q.\n', [ColorsList]),
	code_visibility(CodeVisibility),
	writef('Visibilidade do código secreto: %q.\n', [CodeVisibility]),
	!.


% Predicates for changing settings within the game:

% Predicate: set_secret_code(/1)
% Params: Number
% set the game secret code
set_secret_code(SecretCode):-
    is_list(SecretCode),
    length(SecretCode, Length),
    code_length(CodeLength),
    Length == CodeLength,
    retractall(secret_code(_)),
    assert(secret_code(SecretCode)),
    writef('Código Secreto definido como: %q. \n', [SecretCode]),
    !.

% Predicate: set_guess_limit(/1)
% Params: Number
% set the agent guess limit
set_guess_limit(GuessLimit):-
	number(GuessLimit),
	GuessLimit > 0,
	retractall(guess_limit(_)),
	assert(guess_limit(GuessLimit)),
	writef('Número de tentativas alterado para: %q.\n', [GuessLimit]),
	!.

% Predicate: colors(/1)
% Params: List
% return a list with the game colors set  
colors(ColorsList):-
	setof(Color, color(Color), ColorsList),
	!.

% Predicate: set_code_visibility(/1)
% Params: Boolean
% set secret code visibility as true/false
set_code_visibility(true):-
	writeln('Status do Código Secreto alterado para visivel.'),
	retractall(code_visibility(_)),
	assert(code_visibility(true)),
	!.

set_code_visibility(false):-
	writeln('Status do Código Secreto alterado para oculto.'),
	retractall(code_visibility(_)),
	assert(code_visibility(false)),
	!.
