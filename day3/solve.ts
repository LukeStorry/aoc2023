import { solve } from "../runner/typescript";
import { sum } from "lodash";

type Coordinate = [number, number];
type NumberWithCoordinates = {
  number: number;
  coordinates: Coordinate[];
};
type CharWithCoordinate = {
  char: string;
  coordinate: Coordinate;
};
type ParseResult = {
  symbols: CharWithCoordinate[];
  numbers: NumberWithCoordinates[];
};

function getNumbersFromLine(line: string, y: number): NumberWithCoordinates[] {
  const numbers: NumberWithCoordinates[] = [];
  let currentNumber = "";
  let currentNumbersCoordinates: Coordinate[] = [];

  line.split("").forEach((char, x) => {
    if (/\d/.test(char)) {
      currentNumber += char;
      currentNumbersCoordinates.push([x, y]);
    }

    // Save number if next char or end of line
    if (!/\d/.test(char) || x === line.length - 1) {
      numbers.push({
        number: Number(currentNumber),
        coordinates: currentNumbersCoordinates,
      });
      currentNumber = "";
      currentNumbersCoordinates = [];
    }
  });

  return numbers;
}

function getSymbolsFromLine(line: string, y: number): CharWithCoordinate[] {
  return line
    .split("")
    .map((char, x) => ({ char, coordinate: [x, y] as Coordinate }))
    .filter(({ char }) => /[^0-9.]/.test(char));
}

function parser(input: string): ParseResult {
  const lines = input.split("\n");
  const symbols = lines.flatMap(getSymbolsFromLine);
  const numbers = lines.flatMap(getNumbersFromLine);
  return { symbols, numbers };
}

function isAdjacent(a: Coordinate, bs: Coordinate[]) {
  return bs.some(
    (b) => Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1
  );
}

function part1({ numbers, symbols }: ParseResult) {
  const numbersAdjacentToSymbols = numbers
    .filter(({ coordinates: number }) =>
      symbols.some(({ coordinate: symbol }) => isAdjacent(symbol, number))
    )
    .map(({ number }) => number);

  return sum(numbersAdjacentToSymbols);
}

function part2({ symbols, numbers }: ParseResult) {
  const gearRatios = symbols
    .filter(({ char }) => char === "*")
    .map(({ coordinate: gear }) =>
      numbers.filter(({ coordinates: number }) => isAdjacent(gear, number))
    )
    .filter((numbers) => numbers.length == 2)
    .map((nearbyNumbers) =>
      nearbyNumbers.map(({ number }) => number).reduce((a, b) => a * b)
    );

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
