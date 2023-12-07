import { solve } from "../runner/typescript";
import { max, sum, groupBy, countBy, range } from "lodash";

type Hand = {
  cards: string;
  bid: number;
  originalCards?: string;
};

const cardOrder = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "*",
];

const typeOrders = [
  "FIVE_OF_A_KIND",
  "FOUR_OF_A_KIND",
  "FULL_HOUSE",
  "THREE_OF_A_KIND",
  "TWO_PAIR",
  "ONE_PAIR",
  "HIGH_CARD",
] as const;
type Type = (typeof typeOrders)[number];

function parser(input: string) {
  const handParser: (line: string) => Hand = (line: string) => {
    const [cards, bid] = line.split(" ");
    return { cards, bid: Number(bid) };
  };
  return input.split("\n").map(handParser);
}

function getType(cards: string): Type {
  const count = countBy(cards);
  const kinds = Object.values(count);
  switch (kinds.length) {
    case 1:
      return "FIVE_OF_A_KIND";
    case 2: {
      const fourOfAKind = kinds.includes(4);
      return fourOfAKind ? "FOUR_OF_A_KIND" : "FULL_HOUSE";
    }
    case 3: {
      const threeOfAKind = kinds.includes(3);
      return threeOfAKind ? "THREE_OF_A_KIND" : "TWO_PAIR";
    }
    case 4:
      return "ONE_PAIR";
    default:
      return "HIGH_CARD";
  }
}

// positive if A wins, negatie if B
function compare(handA: Hand, handB: Hand): number {
  const typeA = getType(handA.cards);
  const typeB = getType(handB.cards);
  const typeOrderA = typeOrders.indexOf(typeA);
  const typeOrderB = typeOrders.indexOf(typeB);

  if (typeOrderA < typeOrderB) return 1;
  if (typeOrderA > typeOrderB) return -1;

  // Tiebreakers
  const originalA = handA.originalCards ?? handA.cards;
  const originalB = handB.originalCards ?? handB.cards;
  for (let i = 0; i < cardOrder.length; i++) {
    const rankA = cardOrder.indexOf(originalA[i]);
    const rankB = cardOrder.indexOf(originalB[i]);
    if (rankA < rankB) return 1;
    if (rankA > rankB) return -1;
  }
  return 0;
}

function part1(hands: Hand[]) {
  const sortedHands = hands.sort(compare);
  const winnings = sortedHands.map((hand, i) => {
    console.log(i + 1, hand.cards, getType(hand.cards));
    return hand.bid * (i + 1);
  });
  return sum(winnings);
}

function replaceJokers(hand: Hand) {
  if (!hand.cards.includes("J")) return hand;

  const originalCards = hand.cards.replaceAll("J", "*");
  const possibilities = cardOrder
    .filter((c) => c !== "J")
    .map((card) => hand.cards.replaceAll("J", card));

  const sortedHands = possibilities
    .map((cards) => ({ ...hand, cards, originalCards }))
    .toSorted(compare);
  const bestPossibility = sortedHands.at(-1);

  return bestPossibility;
}

function part2(hands: Hand[]) {
  const replaced = hands.map(replaceJokers);
  const sortedHands = replaced.sort(compare);
  const winnings = sortedHands.map((hand, i) => {
    console.log(i + 1, hand.cards, getType(hand.cards));
    return hand.bid * (i + 1);
  });
  // const winnings = sortedHands.map(({ bid }, i) => bid * (i + 1));
  return sum(winnings);
}

solve({
  parser: parser,
  part1: part1,
  part2,

  part1Tests: [["32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483", 6440]],
  part2Tests: [["32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483", 5905]],
});
