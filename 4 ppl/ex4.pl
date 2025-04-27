/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
maximum_printing_depth(100).

:- current_prolog_flag(toplevel_print_options, A),
   (select(max_depth(_), A, B), ! ; A = B),
   maximum_printing_depth(MPD),
   set_prolog_flag(toplevel_print_options, [max_depth(MPD)|B]).

% Define the edges
edge(a, b).
edge(a, c).
edge(c, b).
edge(c, a).





% Signature: path(Node1, Node2, Path)/3
% Purpose: Path is a path, denoted by a list of nodes, from Node1 to Node2.

path(V, V, [V]).
path(Start, End, [Start | Path]) :-edge(Start, Next),path(Next, End, Path).






% Signature: cycle(Node, Cycle)/2
% Purpose: Cycle is a cyclic path, denoted a list of nodes, from Node1 to Node1.

cycle(Node , [Node | C]) :- edge(Node , N) , path(N,Node,C).




% Signature: nodes(Nodes)/1
% Purpose: Nodes are the nodes in the graph











% Signature: reverse(Graph1,Graph2)/2
% Purpose: The edges in Graph1 are reversed in Graph2

reverse([] ,[]) .
reverse([[X, Y] | Rest], [[Y, X] | ReversedRest]) :-reverse(Rest, ReversedRest).







% Signature: degree(Node, Graph, Degree)/3
% Purpose: Degree is the degree of node Node, denoted by a Church number (as defined in class)
zero(zero).
succ(N, s(N)).
degree(_,[],0).
degree(Node, [[Node, _] | Rest], Count) :- degree(Node, Rest, Temp) ,  succ(Temp, Count).
degree(Node, [[_, _] | Rest], Count) :- degree(Node , Rest , Count) .








% Signature: spanning_tree(Tree)/1
% Purpose: Tree is a spanning tree of the graph (as defined by the edge predicates), denoted by the pre-order list of nodes in the tree.





