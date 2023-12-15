from re import split
from functools import reduce
from runner.python import solve


def hash(s: str) -> int:
  return reduce(lambda hs, val: ((hs + ord(val)) * 17) % 256, s, 0)


def part1(input: str) -> int:
  return sum(hash(s) for s in input.split(","))


def part2(input: str) -> int:
  boxes, focals = [[] for _ in range(256)], {}
  for step in input.split(","):
    label, focal = split(r"-|=", step)
    box = boxes[hash(label)]
    if focal:
      focals[label] = int(focal)
      if label not in box:
        box.append(label)
    elif label in box:
      box.remove(label)

  return sum(
    i * sum(j * focals[label] for j, label in enumerate(lenses, 1))
    for i, lenses in enumerate(boxes, 1)
  )


testInput = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7"
solve(part1, testInput, 1320, part2, testInput, 145)
