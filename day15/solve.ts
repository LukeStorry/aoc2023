import { solve } from "../runner/typescript";
import { sum, range } from "lodash";

function hash(s: string): number {
  const ascii = range(s.length).map((i) => s.charCodeAt(i));
  return ascii.reduce((h, v) => ((h + v) * 17) % 256, 0);
}

function part1(input: string) {
  return sum(input.split(",").map(hash));
}

function part2(input: string) {
  const lenses = input.split(",").map((step) => step.split(/-|=/));
  const boxes = range(256).map(() => []);

  for (const lens of lenses) {
    const [label, focalLength] = lens;
    const boxIndex = hash(label);
    if (!focalLength) {
      boxes[boxIndex] = boxes[boxIndex].filter(([l]) => l !== label);
    } else {
      let slotIndex = boxes[boxIndex].findIndex(([l]) => l === label);
      if (slotIndex === -1) slotIndex = boxes[boxIndex].length;
      boxes[boxIndex][slotIndex] = lens;
    }
  }

  const boxPowers = boxes.map(
    (slots, i) => (i + 1) * sum(slots.map(([, f], i) => f * (i + 1)))
  );
  return sum(boxPowers);
}

solve({
  part1,
  part2,
  testInput: "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7",
  part1Tests: [[, 1320]],
  part2Tests: [[, 145]],
});
