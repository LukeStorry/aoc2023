import { solve } from "../runner/typescript";
import { max, sum, groupBy } from "lodash";

solve({
  parser: (input: string) => {
    function lineParser(line: string) {
      console.log(line);

      const values = line.matchAll(/\d/g)[0];
      console.log(values);
      console.log("\n");

      return values;
    }

    const lines = input.split("\n");
    const firstLine = lines[0];
    const first = lineParser(firstLine);

    return [first];
    return lines.slice(0, lines.length).map(lineParser);
    return lines.map(lineParser);
  },
  part1: (values) => {
    function doSomething(value) {
      console.log(value);
      const result = value + value;

      console.log(value);
      console.log("\n");

      return result;
    }

    const out1 = doSomething(values[0]);

    console.log(out1);

    return sum(values.map(doSomething));
  },
  // part2: (values) => {
  //   function doSomething(a) {
  //     return a;
  //   }

  //   const out1 = doSomething(values[0]);

  //   console.log(out1);

  //   return values.map(doSomething);
  // },
  part1Tests: [
    ["aaa", 0],
    // ["a", 0],
  ],
  part2Tests: [
    // ["aaa", 0],
    // ["a", 0],
  ],
});
