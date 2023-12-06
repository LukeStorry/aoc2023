import { solve } from "../runner/typescript";
import { max, sum, groupBy } from "lodash";

type Parsed = {};
function parser(input: string) {
  function lineParser(line: string): Parsed[] {
    console.log(line);

    const values = line.match(/\d/g).map(Number);
    console.log(values);
    console.log("\n");

    return values;
  }

  const lines = input.split("\n");
  // const firstLine = lines[0];
  // const first = lineParser(firstLine);

  // return [first];
  // return lines.slice(0, lines.length).map(lineParser);
  const result = lines.map(lineParser);
  return result;
}

function part1(values: any[]): number {
  function func(value) {
    console.log(value);
    const result = value + value;

    console.log(value);
    console.log("\n");

    return result;
  }

  const out1 = func(values[0]);

  console.log(out1);

  return sum(values.map(func));
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
  // part2: part2,

  part1Tests: [
    ["aaa", 0],
    // ["a", 0],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});
