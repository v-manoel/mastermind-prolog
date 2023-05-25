% Auxiliar predicates module


% Predicate: element(/3)
% Params: ElementIndex, List, Element
% Returns the n-th element of a list 
element(0, [Head|_], Head):-
	!.

element(Index, [_|Tail], Element):-
	NovoIndex is Index - 1,
	element(NovoIndex, Tail, Element),
	!.

% Predicate: list_cmp(/2)
% Params: List1, List2
% Checks if two lists have same elements
list_cmp([],[]).

list_cmp([Head|FirstTail], [Head|SecondTail]):-
	list_cmp(FirstTail, SecondTail).

% Predicate: delete(/3)
% Params: Element, List, RestList
% Removes an element from a list, and Returns the result list without the element
delete(_, [], _):-
	false.

delete(Element, [Element|Tail], Tail).

delete(Element, [Head|Tail], [Head|Rest]):-
	Element \= Head,
	delete(Element, Tail, Rest),
	!.

% Predicate: sum(/2)
% Params: List, Result
% Sums all list elements
sum([], 0).

sum([Head|Tail], Sum):-
	sum(Tail, PartialSum),
	Sum is Head + PartialSum.