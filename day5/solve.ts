import { solve } from "../runner/typescript";
import { min, chunk, uniqBy } from "lodash";

type RangeMap = {
  start: number;
  end: number;
  delta?: number;
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

function part2BruteForce({ seeds: seedRanges, rangeMaps }: ParseResult): any {
  let minimum = Infinity;
  const getLocation = createLocationGetter(rangeMaps);
  for (let [start, length] of chunk(seedRanges, 2)) {
    const end = start + length - 1;
    for (let seed = start; seed <= end; seed++) {
      const location = getLocation(seed);
      if (location < minimum) {
        console.log("new minimum", location);
        minimum = location;
      }
    }
  }

  return minimum;
}

function part2Optimised({ seeds, rangeMaps }: ParseResult): any {
  const seedRanges: RangeMap[] = chunk(seeds, 2).map(([start, length]) => ({
    start,
    end: start + length - 1,
  }));

  const flattenedRanges = rangeMaps.reduce(combineRanges, seedRanges);

  const end = flattenedRanges
    .toSorted((a, b) => a.start - b.start)
    .slice(0, 20);
  console.log("end2", end);
  return min(flattenedRanges.map((range) => range.start));
}

function combineRanges(
  previousMaps: RangeMap[],
  nextMaps: RangeMap[]
): RangeMap[] {
  nextMaps.sort((a, b) => a.start - b.start);
  const combined: RangeMap[] = [];
  for (let previous of previousMaps) {
    const intersectionsWithPrevious = [];
    for (let next of nextMaps) {
      const intersectionWithNext = createIntersections(previous, next);
      intersectionsWithPrevious.push(...intersectionWithNext);
    }
    if (intersectionsWithPrevious.length === 0) {
      combined.push(previous);
    } else {
      combined.push(...intersectionsWithPrevious);
    }
  }

  combined.sort((a, b) => a.start - b.start);
  const unique = uniqBy(
    uniqBy(combined, (r) => r.start),
    (r) => r.end
  );
  if (unique.length !== combined.length) {
    // TODO: WHY??
    console.log("error!", combined.length - unique.length);
  }

  return combined;
}

function createIntersections(previous: RangeMap, next: RangeMap): RangeMap[] {
  if (previous.end < next.start || previous.start > next.end) {
    return []; // no intersection
  }
  const intersectionStart = Math.max(previous.start, next.start);
  const intersectionEnd = Math.min(previous.end, next.end);

  const before =
    intersectionStart > previous.start
      ? {
          start: previous.start,
          end: intersectionStart - 1,
        }
      : null;

  const intersection = {
    start: intersectionStart + (next.delta ?? 0),
    end: intersectionEnd + (next.delta ?? 0),
  };

  const after =
    intersectionEnd < previous.end
      ? {
          start: intersectionEnd + 1,
          end: previous.end,
        }
      : null;

  return [before, intersection, after].filter(Boolean);
}

solve({
  parser,
  part1,
  part2: part2BruteForce,
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
//   [{ start: 10, end: 100 }, { start: 0, end: 9, delta: 2 }, []],
//   // all after - none
//   [{ start: 10, end: 100 }, { start: 101, end: 110, delta: 2 }, []],
//   // all inside - one
//   [
//     { start: 10, end: 40 },
//     { start: 0, end: 100, delta: 2 },
//     [{ start: 12, end: 42 }],
//   ],
//   // overlap end
//   [
//     { start: 10, end: 1000 },
//     { start: 0, end: 100, delta: 2 },
//     [
//       { start: 12, end: 102 },
//       { start: 101, end: 1000 },
//     ],
//   ],
//   // overlap start
//   [
//     { start: 10, end: 1000 },
//     { start: 500, end: 1300, delta: 2 },
//     [
//       { start: 10, end: 499 },
//       { start: 502, end: 1002 },
//     ],
//   ],
//   // overlap both
//   [
//     { start: 10, end: 10000 },
//     { start: 500, end: 900, delta: 2 },
//     [
//       { start: 10, end: 499 },
//       { start: 502, end: 902 },
//       { start: 901, end: 10000 },
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
