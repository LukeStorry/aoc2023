import { solve } from "../runner/typescript";
import { max, sum, groupBy, fromPairs } from "lodash";

type P = {
  workflows: Record<string, Rule[]>;
  parts: [number, number, number, number][];
};
type Rule = {
  property?: number;
  operator?: string;
  value?: number;
  action: string;
};

function parseWorkflow(line: string): [string, Rule[]] {
  const [name, values] = line.split("{");
  const rules = values
    .slice(0, -1)
    .split(",")
    .map((rule) => {
      if (!rule.includes(":")) return { action: rule };
      const [condition, action] = rule.split(":");
      return {
        property: "xmas".indexOf(condition[0]),
        operator: condition[1],
        value: parseInt(condition.slice(2)),
        action,
      };
    });

  return [name, rules];
}

function parsePart(line: string): [number, number, number, number] {
  return Array.from(line.matchAll(/\d+/g)).map(Number) as any;
}

function parser(input: string) {
  const [workflows, parts] = input.split("\n\n");

  return {
    workflows: fromPairs(workflows.split("\n").map(parseWorkflow)),
    parts: parts.split("\n").map(parsePart),
  };
}

function check(workflows: Record<string, Rule[]>, part: number[]): boolean {
  let current = "in";
  while (true) {
    if (current === "A") return true;
    if (current === "R") return false;
    const rules = workflows[current];
    const rule = rules.find((rule) => {
      if (!rule.operator) return true;
      const value = part[rule.property];
      switch (rule.operator) {
        case "<":
          return value < rule.value;
        case ">":
          return value > rule.value;
        case "=":
          return value === rule.value;
        default:
          throw new Error("Invalid operator");
      }
    });
    if (!rule) throw new Error("No rule found");
    current = rule.action;
  }
}

function part1({ parts, workflows }: P): number {
  const accepted = parts.filter((part) => check(workflows, part));
  return sum(accepted.flat());
}

function part2(values: any[]): any[] {
  function func2(a) {
    return a;
  }

  const out1 = func2(values[0]);

  console.log(out1);

  return values.map(func2);
}

solve({
  parser: parser,
  part1: part1,
  testInput:
    "px{a<2006:qkq,m>2090:A,rfg}\npv{a>1716:R,A}\nlnx{m>1548:A,A}\nrfg{s<537:gd,x>2440:R,A}\nqs{s>3448:A,lnx}\nqkq{x<1416:A,crn}\ncrn{x>2662:A,R}\nin{s<1351:px,qqz}\nqqz{s>2770:qs,m<1801:hdj,R}\ngd{a>3333:R,R}\nhdj{m>838:A,pv}\n\n{x=787,m=2655,a=1222,s=2876}\n{x=1679,m=44,a=2067,s=496}\n{x=2036,m=264,a=79,s=2244}\n{x=2461,m=1339,a=466,s=291}\n{x=2127,m=1623,a=2188,s=1013}",
  // part2: part2,

  part1Tests: [
    [, 19114],
    // ["a", 0],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});
