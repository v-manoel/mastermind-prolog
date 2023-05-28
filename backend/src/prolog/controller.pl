% Game controller module

% initial game attributes:
:-
    dynamic(feedback/1),
	retractall(feedback(_)),
    dynamic(turn_states/1),
	retractall(turn_states(_)),
    dynamic(current_guess_code/1),
	retractall(current_guess_code(_)),
    dynamic(game_result/1),
	retractall(game_result(_)).

% Fact: set initial feedback as null
feedback([]).
% Fact: set initial turn states as null
turn_states([]).
% Fact: set initial guess code states as null
current_guess_code([]).

% Rule: reset_game(/0)
% Params: 
% Reset game attributes
reset_game():-
	retractall(feedback(_)),
    assert(feedback([])),
	retractall(turn_states(_)),
    assert(turn_states([])),
	retractall(current_guess_code(_)),
    assert(current_guess_code([])),
	retractall(game_result(_)),
    assert(game_result([])),
    !.

% Rule: set_game_result(/1)
% Params: String
% set the game result message
set_game_result(Result):-
	retractall(game_result(_)),
    assert(game_result(Result)),
    !.

% Rule: set_current_guess_code(/1)
% Params: List
% set the current guess code
set_current_guess_code(GuessCode):-
    retractall(current_guess_code(_)),
	assert(current_guess_code(GuessCode)),
	!.

% Rule: set_turn_states(/1)
% Params: List
% set the game turn states.
set_turn_states(TurnStates):-
    retractall(turn_states(_)),
	assert(turn_states(TurnStates)),
	!.

% Rule: set_feedback(/1)
% Params: List
% set the current guess feedback.
set_feedback(Feedback):-
    validate_feedback(Feedback),
    retractall(feedback(_)),
    assert(feedback(Feedback)),
    !.

% Rule: validate_feedback(/1)
% Params: List
% validates feedback format
validate_feedback(Feedback):-
    is_list(Feedback),
    length(Feedback, Length),
    Length == 2,
    sum(Feedback,Sum),
    code_length(CodeLength),
    Sum =< CodeLength,
    validate_feedback_components(Feedback),
    !.

validate_feedback(_):-
    fail,
    !.

validate_feedback_components([CorrectPos|[WrongPos|_]]):-
    CorrectPos >= 0,
    WrongPos >= 0,
    !.

% Rule: run(/0)
% Params: 
% Runs the game generating a random secret code
run():-
    code_length(CodeLength),
    random_colors_list(CodeLength,RandomSecret),
    run(RandomSecret),
	!.

% Rule: run(/1)
% Params: List
% Runs the game with a given secret code
run(SecretCode):-
    reset_game,
	set_secret_code(SecretCode),
    agent_step,
	!.

% Rule: agent_step(/0)
% Params: 
% Wait for the agent guess
agent_step:-
    turn_states(TurnStates),
    agent_guess(TurnStates, GuessCode),
    set_current_guess_code(GuessCode),
    !.

% Rule: turn(/1)
% Params: List
% Run a game turn for a given feedback
turn(Feedback):-
    set_feedback(Feedback),
    current_guess_code(GuessCode),
    turn_states(TurnStates),
    \+ guess_check(TurnStates, Feedback),
    update_state(GuessCode, Feedback),
    agent_step,
    !.

% Rule: update_state(/2)
% Params: List1, List2
% Updates the game states adding a new state to turn states list
update_state(GuessCode, [CorrectPos|[WrongPos|_]]):-
    turn_states(TurnStates),
    set_turn_states([guess(GuessCode, CorrectPos, WrongPos)|TurnStates]),
    !.

% Rule: guess_check(/2)
% Params: List1, List2
% Check if the agent win,loss or miss the game based on the TurnStates and new Feedback
guess_check(TurnStates, _):-
	guess_limit(GuessLimit),
	length(TurnStates, Length),
	NTurns is Length + 1,
	GuessLimit == NTurns,
    set_game_result('lose'),
	%writef('\tMatch ended: Agent Lose.\n'),
    !.

guess_check(_, [CorrectPos|_]):-
	code_length(CodeLength),
	CorrectPos == CodeLength,
    set_game_result('win'),
    !.

guess_check(_, _):- fail.

% Rule: public_code(/2)
% Params: List1, String
% %writefs the secret code if the visibility is set as true
public_code(SecretCode, SecretCode):-
	code_visibility(true).

public_code(_, 'oculto'):-
	code_visibility(false).