import networkx as nx
from runner.python import solve
from itertools import combinations


def parse(input: str):
  graph = nx.Graph()
  for line in input.splitlines():
    frm, tos = line.split(": ")
    for to in tos.split(" "):
      graph.add_edge(frm, to, capacity=1.0)
  return graph


def part1(input):
  graph = parse(input)
  nodes = list(graph.nodes.keys())
  for frm, to in combinations(nodes, 2):
    cuts_made, [group1, group2] = nx.minimum_cut(graph, frm, to)
    if cuts_made == 3:
      return len(group1) * len(group2)


solve(
  part1,
  "jqt: rhn xhk nvd\nrsh: frs pzl lsr\nxhk: hfx\ncmg: qnr nvd lhk bvb\nrhn: xhk bvb hfx\nbvb: xhk hfx\npzl: lsr hfx nvd\nqnr: nvd\nntq: jqt hfx bvb xhk\nnvd: lhk\nlsr: lhk\nrzs: qnr cmg lsr rsh\nfrs: qnr lhk lsr",
  54,
  # part2,
  # " ",
  # 2,
)
