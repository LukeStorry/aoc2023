from itertools import combinations

stars = [
  (x, y)
  for y, line in enumerate(open("day11/input.txt").readlines())
  for x, char in enumerate(line)
  if char == "#"
]

xs, ys = {x for x, _ in stars}, {y for _, y in stars}

distances = lambda expand: sum(
  abs(by - ay)
  + abs(bx - ax)
  + (expand - 1) * len(set(range(ay, by)) - ys)
  + (expand - 1) * len(set(range(*sorted([ax, bx]))) - xs)
  for (ax, ay), (bx, by) in combinations(stars, 2)
)

print(distances(2), distances(1000000))
