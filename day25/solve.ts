import { solve } from "../runner/typescript";
import { cloneDeep, keys } from "lodash";

type Graph = { [key: string]: string[] };
function parser(input: string): Graph {
  const graph = {};
  input.split("\n").forEach((line) => {
    const [from, to] = line.split(": ");
    const tos = to.split(" ");
    graph[from] = (graph[from] ?? []).concat(tos);
    tos.forEach((to) => {
      graph[to] = (graph[to] ?? []).concat(from);
    });
  });
  return graph;
}

function isConnected(graph: Graph): boolean {
  let nodes = Object.keys(graph);
  let visited: { [key: string]: boolean } = {};
  let stack: string[] = [nodes[0]];

  while (stack.length !== 0) {
    let node = stack.pop()!;
    if (!visited[node]) {
      visited[node] = true;
      for (let neighbor of graph[node]) {
        if (!visited[neighbor]) {
          stack.push(neighbor);
        }
      }
    }
  }
  return nodes.every((node) => visited[node]);
}

function findCuts(graph: Graph): [string, string][] {
  let edges: [string, string][] = [];
  for (let node in graph) {
    for (let neighbor of graph[node]) {
      // Ensure each edge is only included once
      if (
        !edges.some(
          ([n1, n2]) =>
            (n1 === node && n2 === neighbor) ||
            (n1 === neighbor && n2 === node),
        )
      ) {
        edges.push([node, neighbor]);
      }
    }
  }
  console.log({ edges: edges.length });

  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      for (let k = j + 1; k < edges.length; k++) {
        let graphCopy: Graph = cloneDeep(graph);
        let cuts = [edges[i], edges[j], edges[k]];
        cuts.forEach(([node, neighbor]) => {
          graphCopy[node] = graphCopy[node].filter((n) => n !== neighbor);
          graphCopy[neighbor] = graphCopy[neighbor].filter((n) => n !== node);
        });
        if (!isConnected(graphCopy)) {
          return cuts;
        }
      }
    }
  }
  throw new Error("No cuts found");
}

function findGroupSizes(graph: Graph, cuts: [string, string][]): number[] {
  cuts.forEach(([node, neighbor]) => {
    graph[node] = graph[node].filter((n) => n !== neighbor);
    graph[neighbor] = graph[neighbor].filter((n) => n !== node);
  });

  let visited = new Set<string>();
  let groupSizes: number[] = [];

  keys(graph).forEach((node) => {
    if (visited.has(node)) return;
    let size = 0;
    let stack: string[] = [node];
    while (stack.length > 0) {
      let next = stack.pop();
      if (visited.has(next)) continue;
      visited.add(next);
      size += 1;
      graph[next].filter((n) => !visited.has(n)).forEach((n) => stack.push(n));
    }
    groupSizes.push(size);
  });

  return groupSizes;
}

function part1(graph: Graph): number {
  const cuts = findCuts(graph);
  console.log({ cuts });
  const groupSizes = findGroupSizes(graph, cuts);
  console.log({ groupSizes });
  return groupSizes[0] * groupSizes[1];
}

solve({
  parser,
  part1,
  testInput:
    "jqt: rhn xhk nvd\nrsh: frs pzl lsr\nxhk: hfx\ncmg: qnr nvd lhk bvb\nrhn: xhk bvb hfx\nbvb: xhk hfx\npzl: lsr hfx nvd\nqnr: nvd\nntq: jqt hfx bvb xhk\nnvd: lhk\nlsr: lhk\nrzs: qnr cmg lsr rsh\nfrs: qnr lhk lsr",
  part1Tests: [[, 54]],
});
