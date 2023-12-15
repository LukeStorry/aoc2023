from functools import reduce
from re import split

hash_reducer = lambda hs, val: ((hs + ord(val)) * 17) % 256
hash = lambda s: reduce(hash_reducer, s, 0)

input = open("day15/input.txt").read().split(",")
print("part1", sum(hash(s) for s in input))

boxes, focals = [[] for _ in range(256)], {}
for step in input:
  label, focal = split(r"\W", step)
  box = boxes[hash(label)]
  if focal:
    focals[label] = int(focal)
    if label not in box:
      box.append(label)
  elif label in box:
    box.remove(label)

box_powers = (
  i * sum(j * focals[label] for j, label in enumerate(lenses, 1))
  for i, lenses in enumerate(boxes, 1)
)

print("part2", sum(box_powers))
