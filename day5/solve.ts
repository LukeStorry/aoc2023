import { solve } from "../runner/typescript";
import { min, chunk } from "lodash";

solve({
  parser: (input: string) => {
    function createMapper(lines: string): (x: number) => number {
      const numbers = lines.split("\n").slice(1);
      const ranges = numbers.map((line) => line.match(/\d+/g).map(Number));

      return (x: number) => {
        for (const [dest, source, len] of ranges) {
          if (x >= source && x <= source + len) {
            const result = dest + (x - source);
            return result;
          }
        }
        return x;
      };
    }

    const seeds = input.split("\n")[0].match(/\d+/g).map(Number);
    const [
      seedToSoil,
      soilToFertilizer,
      fertilizerToWater,
      waterToLight,
      lightToTemperature,
      temperatureToHumidity,
      humidityToLocation,
    ] = input.split("\n\n").slice(1).map(createMapper);

    function getLocation(seed: number) {
      const soil = seedToSoil(seed);
      const fert = soilToFertilizer(soil);
      const water = fertilizerToWater(fert);
      const light = waterToLight(water);
      const temperature = lightToTemperature(light);
      const humidity = temperatureToHumidity(temperature);
      const location = humidityToLocation(humidity);
      return location;
    }

    return {
      seeds,
      getLocation,
    };
  },
  part1: ({ getLocation, seeds }) => {
    return min(seeds.map(getLocation));
  },

  part2: ({ getLocation, seeds }) => {
    let min = Infinity;
    for (const [start, length] of chunk(seeds, 2)) {
      for (let seed = start; seed < start + length; seed++) {
        const location = getLocation(seed);
        if (location < min) min = location;
      }
      console.log("chunkDone ", min);
    }

    return min;
  },
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
