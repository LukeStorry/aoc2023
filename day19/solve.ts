import { solve } from "../runner/typescript";
import { sum, cloneDeep, fromPairs, zip, values, multiply } from "lodash";

type Rule = {
  field?: "x" | "m" | "a" | "s";
  op?: ">" | "<";
  value?: number;
  action: string;
};
type Part = { x: number; m: number; a: number; s: number };
type P = { workflows: Record<string, Rule[]>; parts: Part[] };

const RE_PARTS = /{x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)}/g;
const RE_WORKFLOW = /(?<name>[a-z]+){(?<rules>[^}]*)}/g;
const RE_RULE =
  /(?:(?<field>[xmas])?(?<op>[<>])?(?<val>\d+)?:)*(?<action>[A-Za-z]+)/g;

function parser(input: string): P {
  const parts = Array.from(input.matchAll(RE_PARTS)).map(
    ([_, x, m, a, s]) =>
      fromPairs(zip(["x", "m", "a", "s"], [x, m, a, s].map(Number))) as Part
  );
  const workflows = Array.from(input.matchAll(RE_WORKFLOW)).map(
    ([_, name, rulesString]) => {
      const rules = Array.from(rulesString.matchAll(RE_RULE)).map(
        ({ groups }) => ({ ...groups, value: Number(groups.val) })
      );
      return [name, rules];
    }
  );

  return { parts, workflows: fromPairs(workflows) };
}

function part1({ parts, workflows }: P): number {
  function isPartAcceptable(part: Part): boolean {
    let next = "in";
    while (true) {
      next = workflows[next].find(
        ({ op, field, value }: Rule) =>
          !op || (op == "<" ? part[field] < value : part[field] > value)
      ).action;
      if (next === "A") return true;
      if (next === "R") return false;
    }
  }

  return sum(parts.filter(isPartAcceptable).map((p) => sum(values(p))));
}

function part2({ workflows }: P): number {
  type Ranges = { [key in keyof Part]: { min: number; max: number } };
  function checkRange(previous: Ranges, flowName: string): Ranges[] {
    if (flowName === "A") return [previous];
    if (flowName === "R") return [];
    return workflows[flowName].flatMap(({ field, value, op, action }: Rule) => {
      let newRanges = cloneDeep(previous);
      const newRange = newRanges[field];
      const previousRange = previous[field];
      if (op === ">") {
        if (!(newRange.max > value)) return [];
        newRange.min = Math.max(newRange.min, value + 1);
        previousRange.max = Math.min(previousRange.max, value);
      }
      if (op === "<") {
        if (!(newRange.min < value)) return [];
        newRange.max = Math.min(newRange.max, value - 1);
        previousRange.min = Math.max(previousRange.min, value);
      }
      return checkRange(newRanges, action);
    });
  }

  const initialRanges = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };
  const ranges = checkRange(initialRanges, "in");

  function getSize({ x, m, a, s }: Ranges): number {
    return [x, m, a, s]
      .map((range) => range.max - range.min + 1)
      .reduce(multiply);
  }

  return sum(ranges.map(getSize));
}

solve({
  parser,
  part1,
  part2,
  testInput:
    "px{a<2006:qkq,m>2090:A,rfg}\npv{a>1716:R,A}\nlnx{m>1548:A,A}\nrfg{s<537:gd,x>2440:R,A}\nqs{s>3448:A,lnx}\nqkq{x<1416:A,crn}\ncrn{x>2662:A,R}\nin{s<1351:px,qqz}\nqqz{s>2770:qs,m<1801:hdj,R}\ngd{a>3333:R,R}\nhdj{m>838:A,pv}\n\n{x=787,m=2655,a=1222,s=2876}\n{x=1679,m=44,a=2067,s=496}\n{x=2036,m=264,a=79,s=2244}\n{x=2461,m=1339,a=466,s=291}\n{x=2127,m=1623,a=2188,s=1013}",

  part1Tests: [[, 19114]],
  part2Tests: [[, 167409079868000]],
});
