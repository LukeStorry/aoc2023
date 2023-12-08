import { solve } from "../runner/typescript";
import { lowestCommonMultiple } from "../utils";
type P = { directions: string; nodes: Record<string, [string, string]> };
function parser(input: string): P {
  const directions = input.split("\n")[0];
  const nodes = {};
  const matches = input.matchAll(/(\w{3}).*(\w{3}).*(\w{3})/g);
  for (const [_, name, left, right] of matches) {
    nodes[name] = [left, right];
  }
  return { directions, nodes };
}

function followMap(start, end, { directions, nodes }: P): number {
  let current = start;
  let step = 0;
  while (!current.endsWith(end)) {
    const direction = directions[step % directions.length] === "L" ? 0 : 1;
    current = nodes[current][direction];
    step++;
  }
  return step;
}

function part1(input: P) {
  return followMap("AAA", "ZZZ", input);
}

function part2(input: P): number {
  let startNodes = Object.keys(input.nodes).filter((n) => n.endsWith("A"));
  const stepsUntilZ = startNodes.map((start) => followMap(start, "Z", input));
  return stepsUntilZ.reduce(lowestCommonMultiple);
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
