import { solve } from "../runner/typescript";

type P = {
  directions: (0 | 1)[];
  nodesMap: Map<string, readonly [string, string]>;
};
function parser(input: string): P {
  const directions = input
    .split("\n")[0]
    .split("")
    .map((lr) => (lr === "L" ? 0 : 1));

  const nodeMatches = input.matchAll(/(\w{3}).*(\w{3}).*(\w{3})/g);
  const nodes = Array.from(nodeMatches).map(
    ([_, name, left, right]) => [name, [left, right]] as const
  );
  const nodesMap = new Map(nodes);

  return { directions, nodesMap };
}

function part1({ directions, nodesMap }: P): number {
  let step = 0;
  let currentNode = "AAA";
  while (currentNode !== "ZZZ") {
    const direction = directions[step % directions.length];
    currentNode = nodesMap.get(currentNode)[direction];
    step++;
  }
  return step;
}

function part2({ directions, nodesMap }: P): number {
  let step = 0;
  let currentNodes = Array.from(nodesMap.keys()).filter((n) => n.endsWith("A"));
  while (currentNodes.some((n) => !n.endsWith("Z"))) {
    const direction = directions[step % directions.length];
    currentNodes = currentNodes.map((n) => nodesMap.get(n)[direction]);
    step++;
  }
  return step;
}

solve({
  parser: parser,
  part1: part1,
  part2: part2,

  part1Tests: [
    ["RL\n\nAAA = (BBB, CCC)\nBBB = (DDD, EEE)\nCCC = (ZZZ, GGG)", 2],
    ["LLR\n\nAAA = (BBB, BBB)\nBBB = (AAA, ZZZ)\nZZZ = (ZZZ, ZZZ)", 6],
  ],
  part2Tests: [
    [
      "LR\n\n11A = (11B, XXX)\n11B = (XXX, 11Z)\n11Z = (11B, XXX)\n22A = (22B, XXX)\n22B = (22C, 22C)\n22C = (22Z, 22Z)\n22Z = (22B, 22B)\nXXX = (XXX, XXX)",
      6,
    ],
  ],
});
