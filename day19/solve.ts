import { solve } from "../runner/typescript";
import {
  max,
  sum,
  cloneDeep,
  fromPairs,
  zip,
  values,
  sumBy,
  uniq,
  multiply,
} from "lodash";

type Part = { x: number; m: number; a: number; s: number };
type Rule = {
  property?: "x" | "m" | "a" | "s";
  operator?: ">" | "<";
  value?: number;
  action: string;
};
type P = { workflows: Record<string, Rule[]>; parts: Part[] };

function parseWorkflow(line: string): [string, Rule[]] {
  const [name, values] = line.split("{");
  const rules = values
    .slice(0, -1)
    .split(",")
    .map((rule) => {
      if (!rule.includes(":")) return { action: rule };
      const [condition, action] = rule.split(":");
      return {
        property: condition[0] as "x" | "m" | "a" | "s",
        operator: condition[1] as ">" | "<",
        value: parseInt(condition.slice(2)),
        action,
      };
    });

  return [name, rules];
}

function parsePart(line: string): Part {
  const vals = Array.from(line.matchAll(/\d+/g)).map(Number);
  return fromPairs(zip("xmas".split(""), vals)) as any;
}

function parser(input: string) {
  const [workflows, parts] = input.split("\n\n");

  return {
    workflows: fromPairs(workflows.split("\n").map(parseWorkflow)),
    parts: parts.split("\n").map(parsePart),
  };
}

function check(workflows: Record<string, Rule[]>, part: Part): boolean {
  let current = "in";
  while (true) {
    if (current === "A") return true;
    if (current === "R") return false;
    const rules = workflows[current];
    const rule = rules.find((rule) => {
      if (!rule.operator) return true;
      const value = part[rule.property];
      return rule.operator == "<" ? value < rule.value : value > rule.value;
    });
    if (!rule) throw new Error("No rule found");
    current = rule.action;
  }
}

function part1({ parts, workflows }: P): number {
  const accepted = parts.filter((part) => check(workflows, part));
  return sumBy(accepted, (a) => sum(values(a)));
}

function part2({ workflows }: P): number {
  type Ranges = { [key in keyof Part]: { min: number; max: number } };

  function checkRange(previous: Ranges, flowName: string): Ranges[] {
    let result: Ranges[] = [];

    for (let rule of workflows[flowName]) {
      let newRanges = cloneDeep(previous);
      if (rule.operator) {
        if (
          rule.operator === ">" &&
          newRanges[rule.property].max > rule.value
        ) {
          newRanges[rule.property].min = Math.max(
            newRanges[rule.property].min,
            rule.value + 1
          );
          previous[rule.property].max = Math.min(
            previous[rule.property].max,
            rule.value
          );
        } else if (
          rule.operator === "<" &&
          newRanges[rule.property].min < rule.value
        ) {
          newRanges[rule.property].max = Math.min(
            newRanges[rule.property].max,
            rule.value - 1
          );
          previous[rule.property].min = Math.max(
            previous[rule.property].min,
            rule.value
          );
        } else continue;

        if (newRanges[rule.property].max < newRanges[rule.property].min)
          continue;
      }

      if (rule.action === "A") {
        result.push(newRanges);
      } else if (rule.action != "R") {
        const rest = checkRange(newRanges, rule.action);
        result.push(...rest);
      }
    }

    return result;
  }

  const ranges = checkRange(
    {
      x: { min: 1, max: 4000 },
      m: { min: 1, max: 4000 },
      a: { min: 1, max: 4000 },
      s: { min: 1, max: 4000 },
    },
    "in"
  );

  const sizes = ranges.map((rng: Ranges): number =>
    values(rng)
      .map((r) => r.max - r.min + 1)
      .reduce(multiply)
  );

  return sum(sizes);
}

solve({
  parser,
  // part1,
  part2,
  testInput:
    "px{a<2006:qkq,m>2090:A,rfg}\npv{a>1716:R,A}\nlnx{m>1548:A,A}\nrfg{s<537:gd,x>2440:R,A}\nqs{s>3448:A,lnx}\nqkq{x<1416:A,crn}\ncrn{x>2662:A,R}\nin{s<1351:px,qqz}\nqqz{s>2770:qs,m<1801:hdj,R}\ngd{a>3333:R,R}\nhdj{m>838:A,pv}\n\n{x=787,m=2655,a=1222,s=2876}\n{x=1679,m=44,a=2067,s=496}\n{x=2036,m=264,a=79,s=2244}\n{x=2461,m=1339,a=466,s=291}\n{x=2127,m=1623,a=2188,s=1013}",

  part1Tests: [[, 19114]],
  part2Tests: [[, 167409079868000]],
});
