from re import findall
from runner.python import solve
import z3
from itertools import combinations
from collections import namedtuple

Hailstone = namedtuple("Hailstone", ["x", "y", "z", "dx", "dy", "dz"])


def parse(input: str) -> list[Hailstone]:
  return [
    Hailstone(*[int(i) for i in findall(r"[-0-9]+", line)])
    for line in input.splitlines()
  ]


def has_intersection(
  stone_a: Hailstone, stone_b: Hailstone, min_val: int, max_val: int
) -> bool:
  slope_a = stone_a.dy / stone_a.dx
  slope_b = stone_b.dy / stone_b.dx

  if slope_a == slope_b:
    return False

  intercept_a = stone_a.y - slope_a * stone_a.x
  intercept_b = stone_b.y - slope_b * stone_b.x

  intersection_x = (intercept_b - intercept_a) / (slope_a - slope_b)
  intersection_y = slope_a * intersection_x + intercept_a

  future_a = (intersection_x - stone_a.x) / stone_a.dx >= 0
  future_b = (intersection_x - stone_b.x) / stone_b.dx >= 0

  is_inside_zone = (
    min_val <= intersection_x <= max_val
    and min_val <= intersection_y <= max_val
  )

  return future_a and future_b and is_inside_zone


def part1(input):
  min = 7 if len(input) < 200 else 200000000000000
  max = 27 if len(input) < 200 else 400000000000000
  hailstones = parse(input)
  return sum(
    has_intersection(h1, h2, min, max)
    for h1, h2 in combinations(hailstones, 2)
  )


def part2(input):
  hailstones = parse(input)
  solver = z3.Solver()
  x, y, z, dx, dy, dz = z3.Reals("x y z dx dy dz")
  for index, stone in enumerate(hailstones):
    time = z3.Real(f"time_{index}")
    solver.add(time > 0)
    solver.add(x + time * dx == stone.x + time * stone.dx)
    solver.add(y + time * dy == stone.y + time * stone.dy)
    solver.add(z + time * dz == stone.z + time * stone.dz)
  solver.check()
  position = [solver.model()[dim].as_long() for dim in [x, y, z]]

  return sum(position)


solve(
  part1,
  "19, 13, 30 @ -2,  1, -2\n18, 19, 22 @ -1, -1, -2\n20, 25, 34 @ -2, -2, -4\n12, 31, 28 @ -1, -2, -1\n20, 19, 15 @  1, -5, -3",
  2,
  part2,
  "19, 13, 30 @ -2,  1, -2\n18, 19, 22 @ -1, -1, -2\n20, 25, 34 @ -2, -2, -4\n12, 31, 28 @ -1, -2, -1\n20, 19, 15 @  1, -5, -3",
  47,
)
