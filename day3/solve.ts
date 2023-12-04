import { solve } from "../runner/typescript";
import { sum } from "lodash";

type Coordinate = { x: number; y: number };
type Part = { number: number; coordinates: Coordinate[] };
type Symbol = { char: string; coordinate: Coordinate };
type ParseResult = { symbols: Symbol[]; parts: Part[] };

/** Original looping parser */
function lineParser(line: string, y: number): Part[] {
  const parts: Part[] = [];

  let currentPartNumber = "";
  let currentPartCoordinates: Coordinate[] = [];
  line.split("").forEach((char: string, x: number) => {
    if (/\d/.test(char)) {
      currentPartNumber += char;
      currentPartCoordinates.push({ x, y });
    }

    // Save number if next char or end of line
    if (!!currentPartNumber && (!/\d/.test(char) || x === line.length - 1)) {
      parts.push({
        number: Number(currentPartNumber),
        coordinates: currentPartCoordinates,
      });
      currentPartNumber = "";
      currentPartCoordinates = [];
    }
  });

  return parts;
}

/** Original looping parser */
function parser(input: string): ParseResult {
  const lines = input.split("\n");
  const symbols = lines.flatMap((line: string, y: number): Symbol[] => {
    return line
      .split("")
      .map((char, x) => ({ char, coordinate: { x, y } }))
      .filter(({ char }) => /[^0-9.]/.test(char));
  });

  const parts = lines.flatMap(lineParser);
  return { symbols, parts };
}

/** Alternative Regex version of above functions */
function regexParser(input: string): ParseResult {
  const width = input.indexOf("\n");
  return Array.from(input.matchAll(/([0-9]+)|([^0-9.\n])|\n/gm)).reduce(
    ({ parts, symbols, y }, match) => {
      const [_, partNumber, symbolChar] = match;

      if (partNumber) {
        const part: Part = {
          number: Number(partNumber),
          coordinates: Array(match[0].length)
            .fill(match.index)
            .map((matchIndex, i) => ({
              x: matchIndex + i - y * (width + 1), // This was horrible to figure out
              y,
            })),
        };
        return { parts: [...parts, part], symbols, y };
      }

      if (symbolChar) {
        const symbol: Symbol = {
          char: symbolChar,
          coordinate: { x: match.index - y * (width + 1), y },
        };
        return { symbols: [...symbols, symbol], y, parts };
      }

      return { y: y + 1, parts, symbols };
    },
    { parts: [], symbols: [], y: 0 } as ParseResult & { y: number }
  );
}

function isAdjacent(coordinate: Coordinate, otherCoordinates: Coordinate[]) {
  return otherCoordinates.some(
    (other) =>
      Math.abs(coordinate.x - other.x) <= 1 &&
      Math.abs(coordinate.y - other.y) <= 1
  );
}

function part1({ parts, symbols }: ParseResult) {
  const adjacentParts = parts.filter(({ coordinates: partCoordinates }) =>
    symbols.some(({ coordinate: symbolCoordinates }) =>
      isAdjacent(symbolCoordinates, partCoordinates)
    )
  );
  return sum(adjacentParts.map(({ number }) => number));
}

function part2({ symbols, parts }: ParseResult) {
  const gearRatios = symbols
    .filter(({ char }) => char === "*")
    .map(({ coordinate: symbolCoordinates }) =>
      parts.filter(({ coordinates: partCoordinates }) =>
        isAdjacent(symbolCoordinates, partCoordinates)
      )
    )
    .filter((nearbyParts) => nearbyParts.length == 2)
    .map((nearbyParts) =>
      nearbyParts.map(({ number }) => number).reduce((a, b) => a * b)
    );

  return sum(gearRatios);
}

solve({
  // parser,
  parser: regexParser,
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
