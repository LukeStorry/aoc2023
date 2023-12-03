import { solve } from "../runner/typescript";
import { max, sum, groupBy } from "lodash";

type NumberWithCoordinate = {
  number: number;
  coordinates: [number, number][];
};

type ParseResult = {
  lines: string[];
  numbersWithCoordinates: NumberWithCoordinate[];
};

function parser(input: string): ParseResult {
  const lines = input.split("\n");

  const numbersWithCoordinates: NumberWithCoordinate[] = [];

  lines.forEach((line, y) => {
    let currentNumber = "";
    let currentNumbersCoordinates: [number, number][] = [];

    line.split("").forEach((char, x) => {
      if (/\d/.test(char)) {
        currentNumber += char;
        currentNumbersCoordinates.push([x, y]);
      } else {
        if (currentNumber !== "") {
          numbersWithCoordinates.push({
            number: Number(currentNumber),
            coordinates: currentNumbersCoordinates,
          });
        }
        currentNumber = "";
        currentNumbersCoordinates = [];
      }
    });
    // end of line - may still have a number!
    if (currentNumber !== "") {
      numbersWithCoordinates.push({
        number: Number(currentNumber),
        coordinates: currentNumbersCoordinates,
      });
    }
  });
  return { lines, numbersWithCoordinates };
}

function part1({ lines, numbersWithCoordinates }: ParseResult): number {
  function isAdjacentToSymbol(x: number, y: number) {
    const neighbors =
      (lines[y - 1]?.[x - 1] ?? "") +
      (lines[y - 1]?.[x] ?? "") +
      (lines[y - 1]?.[x + 1] ?? "") +
      (lines[y]?.[x - 1] ?? "") +
      (lines[y]?.[x + 1] ?? "") +
      (lines[y + 1]?.[x - 1] ?? "") +
      (lines[y + 1]?.[x] ?? "") +
      (lines[y + 1]?.[x + 1] ?? "");

    return /[^0-9.]/.test(neighbors);
  }

  const numbersAdjacentToSymbols = numbersWithCoordinates
    .filter((n) => n.coordinates.some(([x, y]) => isAdjacentToSymbol(x, y)))
    .map(({ number }) => number);

  return sum(numbersAdjacentToSymbols);
}

function part2({ lines, numbersWithCoordinates }: ParseResult): any {
  const gearRatios = [];
  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === "*") {
        const nearbyNumbers = numbersWithCoordinates.filter(({ coordinates }) =>
          coordinates.some(
            ([x2, y2]) => Math.abs(x2 - x) <= 1 && Math.abs(y2 - y) <= 1
          )
        );
        if (nearbyNumbers.length > 1) {
          const gearRatio = nearbyNumbers
            .map(({ number }) => number)
            .reduce((a, b) => a * b);

          gearRatios.push(gearRatio);
        }
      }
    });
  });

  return sum(gearRatios);
}

solve({
  parser,
  part1,
  part2,
  part1Tests: [
    [
      "467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..",
      4361,
    ],
  ],
  part2Tests: [
    [
      "467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..",
      467835,
    ],
  ],
});
