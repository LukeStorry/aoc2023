import { solve } from "../runner/typescript";
import { sum } from "lodash";

type Card = {
  win: number[];
  mine: number[];
};

function parser(input: string): Card[] {
  function lineParser(line: string) {
    const [win, mine] = line
      .split(":")[1]
      .split("|")
      .map((x) => x.match(/\d+/g).map(Number));

    return { win, mine };
  }
  return input.split("\n").map(lineParser);
}

function getWins({ win, mine }: Card) {
  return mine.filter((m) => win.includes(m)).length;
}

function part1(cards: Card[]): number {
  return sum(
    cards
      .map(getWins)
      .filter(Boolean)
      .map((wins) => 2 ** (wins - 1))
  );
}

function part2(cards: Card[]): number {
  const winsPerCard = cards.map(getWins);
  const amountPerCard = cards.map(() => 1);

  winsPerCard.forEach((wins, current) => {
    while (wins) {
      amountPerCard[current + wins] += amountPerCard[current];
      wins -= 1;
    }
  });

  return sum(amountPerCard);
}

solve({
  parser,
  part1,
  part2,
  part1Tests: [
    [
      "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\n    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\n    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\n    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\n    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\n    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
      13,
    ],
  ],
  part2Tests: [
    [
      "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\n    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\n    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\n    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\n    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\n    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
      30,
    ],
  ],
});
