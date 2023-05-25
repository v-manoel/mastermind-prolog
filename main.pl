% Main game module

% load game modules:
:-
	compile('utils.pl'),
	compile('settings.pl'),
	compile('agent.pl'),
	compile('controller.pl'),
	writef('\n\nMASTERMIND (AI, 2023)\n\n'),
	game_settings,
	writef('\nType: "game_help." for help.\n\n').

% Predicate: game_help(/0)
% Params:
% print game help
game_help:-
	writef('Help:\n\n'),
	writeln('Type "run().", to run a match with a random secret code'),
	writeln('Type "run(X).", to run a match with a X secret code'),
	writeln('Type "list_settings.", to see all game settings.'),
	writeln('Type "set_secret_code(X).", to change the secret code to X.'),
	writeln('Type "set_guess_limit(X).", to change the quess limit to X.'),
	writeln('Type "set_code_length(X).", to change the length of code to X.'),
	writeln('Type "set_code_visibility(X).", where X=true to show codes, X=false to hide codes.').
