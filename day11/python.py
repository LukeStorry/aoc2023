from itertools import combinations

stars = [
  (x, y)
  for y, line in enumerate(open("day11/input.txt").readlines())
  for x, char in enumerate(line)
  if char == "#"
]

xs, ys = set(x for x, _ in stars), set(y for _, y in stars)

distances = lambda n: sum(
  abs(by - ay)
  + abs(bx - ax)
  + sum(n for y in range(min(ay, by), max(ay, by)) if y not in ys)
  + sum(n for x in range(min(ax, bx), max(ax, bx)) if x not in xs)
  for (ax, ay), (bx, by) in combinations(stars, 2)
)

print([distances(expansion - 1) for expansion in (2, 1000000)])
