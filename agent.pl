% Agent features module

% Predicate: code(/1)
% Params: List
% Generate a code with the game colors set
% -- used to generate all combinations of colors with code length
code(GuessCode):-
	code_length(CodeLength),
	code(GuessCode, CodeLength).

code([], 0):-
	!.

code([CodeHead|CodeTail], CodeLength):-
	color(CodeHead),
	RestCodeLength is CodeLength - 1,
	code(CodeTail, RestCodeLength).


% Predicate: compare_codes(/1)
% Params: List, List, Number, Number
% Check if a code A is compatible with a code B, comparring it and cheking if it correspond to the code B feedback  
compare_codes(LastGuessCode, GuessCode, CorrectPos, WrongPos):-
	compare_positions(LastGuessCode, GuessCode, CorrectPos),
	compare_colors(LastGuessCode, GuessCode, CorrectColors),
	WrongPos is CorrectColors - CorrectPos.

% Predicate: compare_positions(/3)
% Params: List, List, Number
% Count how much elements of the list A are equals to the correpondent position element of thelist B  
compare_positions([], [], 0).
compare_positions([Head|GuessTail], [Head|SecretTail], CorrectPos):-
	compare_positions(GuessTail, SecretTail, Match),
	CorrectPos is Match + 1,
	!.

compare_positions([GuessHead|GuessTail], [SecretHead|SecretTail], CorrectPos):-
	GuessHead \= SecretHead,
	compare_positions(GuessTail, SecretTail, CorrectPos).

% Predicate: compare_colors(/3)
% Params: List, List, Number
% Count how much elements of the list A there are in the list B  
compare_colors([], _, 0).
compare_colors([GuessHead|GuessTail], GuessCode, CorrectColors):-
	delete(GuessHead, GuessCode, RestGuessCode),
	compare_colors(GuessTail, RestGuessCode, Match),
	CorrectColors is Match + 1,
	!.

compare_colors([_|GuessTail], GuessCode, CorrectColors):-
	compare_colors(GuessTail, GuessCode, CorrectColors).

% Predicate: potential(/2)
% Params: List, List
% Check if a guess code is valid based on turnStates (it stores all past guess cod and its feedback)
potential(_, []).

potential(GuessCode, [guess(LastGuessCode, LastWrongPos, LastCorrectPos)|TurnStatesTail]):-
	compare_codes(LastGuessCode, GuessCode, WrongPos, CorrectPos),
	LastWrongPos == WrongPos,
	LastCorrectPos == CorrectPos,
	potential(GuessCode, TurnStatesTail).

% Predicate: potential_code(/2)
% Params: List, List
% Returns an code that can be the secret code in actual turn represented by TurnState.
potential_code(TurnStates, GuessCode):-
	code(GuessCode),
	potential(GuessCode, TurnStates),
	!.

potential_code(_,_):-
	writef('Nao existem combiacoes validas'),
	fail,
	!.

% Predicate: agent_guess(/2)
% Params: List, List
% represents the agent action. Here the action is generate a new guess code based on past experiences.
agent_guess(TurnStates, GuessCode):-
	potential_code(TurnStates, GuessCode),
	!.


