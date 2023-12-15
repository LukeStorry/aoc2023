import { solve } from "../runner/typescript";
import { sum, range, groupBy } from "lodash";

function hash(s: string): number {
  const ascii = range(s.length).map((i) => s.charCodeAt(i));
  return ascii.reduce((h, v) => ((h + v) * 17) % 256, 0);
}

function part1(input: string) {
  return sum(input.split(",").map(hash));
}

function calculateBoxPower(lenses: string[][]): number {
  const boxIndex = hash(lenses[0][0]);
  let slots = [];
  for (const [label, focalLength] of lenses) {
    if (!focalLength) {
      slots = slots.filter(([l]) => l !== label);
      continue;
    }
    let slotIndex = slots.findIndex(([l]) => l === label);
    if (slotIndex === -1) slotIndex = slots.length;
    slots[slotIndex] = [label, Number(focalLength)];
  }
  const slotPowers = slots.map(([, f], i) => f * (i + 1));
  return (Number(boxIndex) + 1) * sum(slotPowers);
}

function part2(input: string) {
  const lenses = input.split(",").map((step) => step.split(/-|=/));
  const lensPerBox = Object.values(groupBy(lenses, ([l]) => hash(l)));
  return sum(lensPerBox.map(calculateBoxPower));
}

solve({
  part1,
  part2,
  testInput: "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7",
  part1Tests: [[, 1320]],
  part2Tests: [[, 145]],
});
