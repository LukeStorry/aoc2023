import networkx as nx
from itertools import combinations

input = open("day25/input.txt").read()
graph = nx.Graph()
for line in input.splitlines():
  frm, tos = line.split(": ")
  for to in tos.split(" "):
    graph.add_edge(frm, to, capacity=1.0)

nodes = list(graph.nodes.keys())
for frm, to in combinations(nodes, 2):
  cuts_made, [group1, group2] = nx.minimum_cut(graph, frm, to)
  if cuts_made == 3:
    print(len(group1) * len(group2))
    break
