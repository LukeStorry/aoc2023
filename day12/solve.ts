import { solve } from "../runner/typescript";
import { max, sum, groupBy } from "lodash";

type Row = readonly [string, readonly number[]];

function parser(input: string) {
  const lines = input.split("\n");
  const result = lines.map((line: string) => {
    const [springs, groups] = line.split(" ");
    return [springs, groups.split(",").map(Number)] as const;
  });
  return result;
}

const test = countArrangements(["?###????????", [3, 2, 1]]);
console.log(test);

function isValid(springs: string, groups: readonly number[]): boolean {
  const total = springs.split("").filter((s) => s === "#").length;
  if (total !== sum(groups)) return false;

  // groups of coninuous springs
  let currentGroupLen = 0;
  let currentGroupIndex = 0;
  for (const spring of springs.split("")) {
    if (spring === "#") {
      currentGroupLen++;
      continue;
    }

    if (currentGroupLen === 0) continue;
    if (currentGroupLen !== groups[currentGroupIndex]) {
      return false;
    }
    currentGroupLen = 0;
    currentGroupIndex += 1;
  }
  if (currentGroupLen === 0 || currentGroupLen === groups[currentGroupIndex]) {
    return true;
  }
  return false;
}

function countArrangements([springs, groups]: Row): number {
  const maxDamanged = sum(groups);
  const maxOperational = springs.length - maxDamanged;
  const found = [];
  const queue = [springs];
  while (queue.length > 0) {
    const current = queue.shift();

    const countDamaged = current.split("#").length - 1;
    if (countDamaged > maxDamanged) continue;
    const countOperational = current.split(".").length - 1;
    if (countOperational > maxOperational) continue;

    if (current.includes("?")) {
      queue.push(current.replace("?", "#"));
      queue.push(current.replace("?", "."));
    } else {
      if (isValid(current, groups)) found.push(current);
    }
  }
  console.log(found.length);
  return found.length;
}

function part1(rows: Row[]): number {
  const totals = rows.map(countArrangements);
  console.log({ totals });
  return sum(totals);
}

function part2(rows: Row[]): number {
  const totals = rows
    .map(
      ([springs, groups]) =>
        [
          `${springs}?${springs}?${springs}?${springs}?${springs}`,
          [...groups, ...groups, ...groups, ...groups, ...groups],
        ] as const
    )
    .map(countArrangements);
  console.log({ totals });
  return sum(totals);
}

const testInput =
  "???.### 1,1,3\n.??..??...?##. 1,1,3\n?#?#?#?#?#?#?#? 1,3,1,6\n????.#...#... 4,1,1\n????.######..#####. 1,6,5\n?###???????? 3,2,1";
solve({
  parser: parser,
  part1: part1,
  // part2: part2,

  part1Tests: [[testInput, 21]],
  part2Tests: [[testInput, 525152]],
});
