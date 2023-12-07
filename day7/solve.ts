import { solve } from "../runner/typescript";
import { sum, countBy, range, zip } from "lodash";

type Hand = {
  cards: string;
  bid: number;
  originalCards?: string;
};

const cardTypes = [...range(2, 10).map(String), "T", "J", "Q", "K", "A"];

const handTypes = [
  "high card",
  "one pair",
  "two pair",
  "three of a kind",
  "full house",
  "four of a kind",
  "five of a kind",
] as const;
type HandType = (typeof handTypes)[number];

function parser(input: string) {
  return input.split("\n").map((line: string) => {
    const [cards, bid] = line.split(" ");
    return { cards, bid: Number(bid) };
  });
}

function getType(cards: string): HandType {
  const cardCounts = Object.values(countBy(cards));
  switch (cardCounts.length) {
    case 1:
      return "five of a kind";
    case 2:
      return cardCounts.includes(4) ? "four of a kind" : "full house";
    case 3:
      return cardCounts.includes(3) ? "three of a kind" : "two pair";
    case 4:
      return "one pair";
    default:
      return "high card";
  }
}

// positive if A wins, negative if B
function handSortFn(handA: Hand, handB: Hand): number {
  const typeStrengthA = handTypes.indexOf(getType(handA.cards));
  const typeStrengthB = handTypes.indexOf(getType(handB.cards));
  if (typeStrengthA > typeStrengthB) return 1;
  if (typeStrengthA < typeStrengthB) return -1;

  const tiebreakersA = (handA.originalCards ?? handA.cards).split("");
  const tiebreakersB = (handB.originalCards ?? handB.cards).split("");
  for (const [a, b] of zip(tiebreakersA, tiebreakersB)) {
    const strengthA = cardTypes.indexOf(a);
    const strengthB = cardTypes.indexOf(b);
    if (strengthA > strengthB) return 1;
    if (strengthA < strengthB) return -1;
  }
  return 0;
}

function part1(hands: Hand[]) {
  const winnings = hands
    .toSorted(handSortFn)
    .map(({ bid }, i) => bid * (i + 1));
  return sum(winnings);
}

function replaceJokers(hand: Hand) {
  if (!hand.cards.includes("J")) return hand;

  const originalCards = hand.cards.replaceAll("J", "*");
  const possibilities = cardTypes
    .filter((c) => c !== "J")
    .map((card) => ({
      ...hand,
      cards: hand.cards.replaceAll("J", card),
      originalCards,
    }));

  const bestPossibility = possibilities.toSorted(handSortFn).at(-1);
  return bestPossibility;
}

function part2(hands: Hand[]) {
  const winnings = hands
    .map(replaceJokers)
    .toSorted(handSortFn)
    .map(({ bid }, i) => bid * (i + 1));
  return sum(winnings);
}

solve({
  parser,
  part1,
  part2,
  part1Tests: [["32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483", 6440]],
  part2Tests: [["32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483", 5905]],
});
