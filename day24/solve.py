import z3
from re import findall
from runner.python import solve
from itertools import combinations
from collections import namedtuple

Hailstone = namedtuple("Hailstone", ["x", "y", "z", "dx", "dy", "dz"])


def parse(input: str) -> list[Hailstone]:
  return [
    Hailstone(*[int(i) for i in findall(r"[-0-9]+", line)])
    for line in input.splitlines()
  ]


def intersects(
  stone_1: Hailstone, stone_2: Hailstone, min_val: int, max_val: int
) -> bool:
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
  is_inside_zone = min_val <= x <= max_val and min_val <= y <= max_val

  return in_future_1 and in_future_2 and is_inside_zone


def part1(input):
  stones = parse(input)
  min = 7 if len(input) < 200 else 200000000000000
  max = 27 if len(input) < 200 else 400000000000000
  return sum(
    intersects(h1, h2, min, max) for h1, h2 in combinations(stones, 2)
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
