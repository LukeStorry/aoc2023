import { max, sum } from "lodash";
import { solve } from "../runner/typescript";

type Game = {
  id: number;
  sets: { [colour: string]: number }[];
};

function parseSet(set: string) {
  return Object.fromEntries(
    set
      .split(",")
      .map((s) => s.trim().split(" "))
      .map(([number, colour]) => [colour, Number(number)])
  );
}

function parseGame(input: string): Game[] {
  return input.split("\n").map((line) => ({
    id: Number(line.match(/\d+/)),
    sets: line.split(":")[1].split(";").map(parseSet),
  }));
}

function isPossible({ sets }: Game) {
  const [RED, GREEN, BLUE] = [12, 13, 14];
  return sets.every(
    (set) =>
      (set.red ?? 0) <= RED &&
      (set.green ?? 0) <= GREEN &&
      (set.blue ?? 0) <= BLUE
  );
}
function part1(games: Game[]) {
  return sum(games.filter(isPossible).map(({ id }) => id));
}

function minimumDice({ sets }: Game) {
  return {
    red: max(sets.map((set) => set.red)),
    green: max(sets.map((set) => set.green)),
    blue: max(sets.map((set) => set.blue)),
  };
}
function part2(games: Game[]): number {
  return sum(games.map(minimumDice).map((s) => s.red * s.green * s.blue));
}

solve({
  parser: parseGame,
  part1,
  part2,
  part1Tests: [
    [
      "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
      8,
    ],
  ],
  part2Tests: [
    [
      "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
      2286,
    ],
  ],
});
