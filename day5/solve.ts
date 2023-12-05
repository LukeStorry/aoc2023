import { solve } from "../runner/typescript";
import { min, chunk, create, isEqual } from "lodash";

type RangeMap = {
  start: number;
  end: number;
  delta: number;
};

type ParseResult = {
  seeds: number[];
  rangeMaps: RangeMap[][];
};

function parseRangeMap(lines: string): RangeMap[] {
  return lines
    .split("\n")
    .slice(1)
    .map((line) => line.match(/\d+/g).map(Number))
    .map(([dest, source, length]) => ({
      start: source,
      end: source + length - 1,
      delta: dest - source,
    }));
}

function parser(input: string): ParseResult {
  const seeds = input.split("\n")[0].match(/\d+/g).map(Number);
  const rangeMaps = input.split("\n\n").slice(1).map(parseRangeMap);
  return { seeds, rangeMaps };
}

function createLocationGetter(
  rangeMaps: RangeMap[][]
): (seed: number) => number {
  return (seed) =>
    rangeMaps.reduce((latest, rangeMap) => {
      const range = rangeMap.find(
        (range) => latest >= range.start && latest <= range.end
      );
      return range ? latest + range.delta : latest;
    }, seed);
}

function part1({ rangeMaps, seeds }: ParseResult): number {
  const getLocation = createLocationGetter(rangeMaps);
  return min(seeds.map(getLocation));
}

/// Part 2

function combineRanges(previous: RangeMap[], nextMaps: RangeMap[]): RangeMap[] {
  const combined = previous.flatMap((prev) => {
    const intersections = nextMaps.flatMap((n) => createIntersections(prev, n));
    return intersections.length ? intersections : [prev];
  });

  return combined;
}

function createIntersections(previous: RangeMap, next: RangeMap): RangeMap[] {
  if (previous.end < next.start || previous.start > next.end) {
    return []; // no intersection
  }
  const intersection = {
    start: Math.max(previous.start, next.start),
    end: Math.min(previous.end, next.end),
    delta: previous.delta + next.delta,
  };

  const before =
    intersection.start > previous.start
      ? {
          delta: previous.delta,
          start: previous.start,
          end: intersection.start - 1,
        }
      : null;

  const after =
    intersection.end < previous.end
      ? {
          delta: previous.delta,
          start: intersection.end + 1,
          end: previous.end,
        }
      : null;

  return [before, intersection, after]
    .filter(Boolean)
    .map(({ delta, start, end }) => ({
      start: start + delta,
      end: end + delta,
      delta: 0,
    }));
}

function part2({ seeds, rangeMaps }: ParseResult): any {
  const seedRanges: RangeMap[] = chunk(seeds, 2).map(([start, length]) => ({
    start,
    end: start + length - 1,
    delta: 0,
  }));

  const flattenedRanges = rangeMaps.reduce(combineRanges, seedRanges);

  // const end = flattenedRanges.toSorted((a, b) => a.start - b.start);
  // console.log("end", end);
  return min(flattenedRanges.map((range) => range.start));
}

solve({
  parser,
  part1,
  part2,
  part1Tests: [
    [
      "seeds: 79 14 55 13\n\nseed-to-soil map:\n50 98 2\n52 50 48\n\nsoil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n\nfertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n\nwater-to-light map:\n88 18 7\n18 25 70\n\nlight-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n\ntemperature-to-humidity map:\n0 69 1\n1 0 69\n\nhumidity-to-location map:\n60 56 37\n56 93 4",
      35,
    ],
  ],
  part2Tests: [
    [
      "seeds: 79 14 55 13\n\nseed-to-soil map:\n50 98 2\n52 50 48\n\nsoil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n\nfertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n\nwater-to-light map:\n88 18 7\n18 25 70\n\nlight-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n\ntemperature-to-humidity map:\n0 69 1\n1 0 69\n\nhumidity-to-location map:\n60 56 37\n56 93 4",
      46,
    ],
  ],
});

// const intersectionTests: [RangeMap, RangeMap, RangeMap[]][] = [
//   // all before - none
//   [{ start: 10, end: 100, delta: 0 }, { start: 0, end: 9, delta: 2 }, []],
//   // all after - none
//   [{ start: 10, end: 100, delta: 0 }, { start: 101, end: 110, delta: 2 }, []],
//   // all inside - one
//   [
//     { start: 10, end: 40, delta: 0 },
//     { start: 0, end: 100, delta: 2 },
//     [{ start: 10, end: 40, delta: 2 }],
//   ],
//   // overlap end
//   [
//     { start: 10, end: 1000, delta: 0 },
//     { start: 0, end: 100, delta: 2 },
//     [
//       { start: 10, end: 100, delta: 2 },
//       { start: 101, end: 1000, delta: 0 },
//     ],
//   ],
//   // overlap start
//   [
//     { start: 10, end: 1000, delta: 0 },
//     { start: 500, end: 1300, delta: 2 },
//     [
//       { start: 10, end: 499, delta: 0 },
//       { start: 500, end: 1000, delta: 2 },
//     ],
//   ],
//   // overlap both
//   [
//     { start: 10, end: 10000, delta: 0 },
//     { start: 500, end: 900, delta: 2 },
//     [
//       { start: 10, end: 499, delta: 0 },
//       { start: 500, end: 900, delta: 2 },
//       { start: 901, end: 10000, delta: 0 },
//     ],
//   ],
// ];
// intersectionTests.forEach(([previous, next, expected], i) => {
//   const actual = createIntersections(previous, next);
//   if (!isEqual(actual, expected)) {
//     console.error("failed test", i);
//     console.error(
//       "expected",
//       expected.map((r) => [r.start, r.end, r.delta])
//     );
//     console.error(
//       "actual",
//       actual.map((r) => [r.start, r.end, r.delta])
//     );
//     // throw new Error("failed");
//   }
// });
