import z3
from re import findall
from itertools import combinations
from collections import namedtuple

Hailstone = namedtuple("Hailstone", ["x", "y", "z", "dx", "dy", "dz"])


def has_intersection(stone_1: Hailstone, stone_2: Hailstone):
  # Convert into y=mx+c format
  m1 = stone_1.dy / stone_1.dx
  m2 = stone_2.dy / stone_2.dx
  c1 = stone_1.y - m1 * stone_1.x
  c2 = stone_2.y - m2 * stone_2.x

  if m1 == m2:  # Parallel
    return False

  x = (c2 - c1) / (m1 - m2)
  y = m1 * x + c1

  in_future_1 = (x - stone_1.x) / stone_1.dx >= 0
  in_future_2 = (x - stone_2.x) / stone_2.dx >= 0
  min, max = 200000000000000, 400000000000000
  is_inside_zone = min <= x <= max and min <= y <= max

  return in_future_1 and in_future_2 and is_inside_zone


hailstones = [
  Hailstone(*[int(i) for i in findall(r"[-0-9]+", line)])
  for line in open("day24/input.txt").readlines()
]

intersections = [
  (a, b) for a, b in combinations(hailstones, 2) if has_intersection(a, b)
]
print("Part 1", len(intersections))

solver = z3.Solver()
x, y, z, dx, dy, dz = z3.Reals("x y z dx dy dz")
for index, stone in enumerate(hailstones):
  time = z3.Real(f"time_{index}")
  solver.add(x + time * dx == stone.x + time * stone.dx)
  solver.add(y + time * dy == stone.y + time * stone.dy)
  solver.add(z + time * dz == stone.z + time * stone.dz)

solver.check()
position = [solver.model()[var].as_long() for var in [x, y, z]]
print("Part 2", sum(position))
