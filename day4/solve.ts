import { solve } from "../runner/typescript";
import { sum } from "lodash";

solve({
  parser: (input: string) => {
    function lineParser(line: string) {
      const [win, mine] = line
        .split(":")[1]
        .split("|")
        .map((x) =>
          x
            .trim()
            .split(/ +/)
            .map((x) => parseInt(x))
        );

      return { win, mine };
    }
    return input.split("\n").map(lineParser);
  },
  part1: (cards) => {
    function doSomething({ win, mine }) {
      const winning = mine.filter((m) => win.includes(m)).length;
      return winning ? 2 ** (winning - 1) : 0;
    }

    return sum(cards.map(doSomething));
  },
  part2: (originalCards) => {
    //     const next = originalCards.slice(current.number, current.number + won);

    const winsPerCard = originalCards.map(
      (c) => c.mine.filter((m) => c.win.includes(m)).length
    );

    const amountPerCard = originalCards.map(() => 1);
    winsPerCard.forEach((w, i) => {
      if (!w) return;
      for (let j = i + 1; j < i + w + 1; j++) {
        amountPerCard[j] += amountPerCard[i];
      }
    });

    return sum(amountPerCard);
    // let total = 0;

    // const getWins = (card: number) =>
    //   card < originalCards.length ? winsPerCard[card] + getWins(card + 1) : 0;

    // winsPerCard.forEach((w, i) => {
    //   const ff = getWins(i);
    //   console.log(ff);
    //   total += ff;
    // });

    // const stack = [...originalCards];
    // let total = 0;
    // while (stack.length > 1) {
    //   total += 1;
    //   const current = stack.shift();
    //   const won = current.mine.filter((m) => current.win.includes(m)).length;

    //   // console.log({ won });
    //   if (won) {
    //     const next = originalCards.slice(current.number, current.number + won);
    //     stack.push(...next);
    //   }
    // }
    // return total;
  },
  part1Tests: [
    [
      "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\n    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\n    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\n    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\n    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\n    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
      13,
    ],
    // ["a", 0],
  ],
  part2Tests: [
    [
      "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\n    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\n    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\n    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\n    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\n    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
      30,
    ],
    // ["a", 0],
  ],
});
