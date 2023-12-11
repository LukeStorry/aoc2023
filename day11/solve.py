from runner.python import solve
from itertools import combinations


def parse(input: str) -> list[tuple[int, int]]:
  return [
    (x, y)
    for y, line in enumerate(input.split("\n"))
    for x, char in enumerate(line)
    if char == "#"
  ]


def find_distance(stars: list[tuple[int, int]], expansion: int) -> int:
  xs, ys = {x for x, _ in stars}, {y for _, y in stars}

  return sum(
    abs(by - ay)
    + abs(bx - ax)
    + (expansion - 1) * len(set(range(ay, by)) - ys)
    + (expansion - 1) * len(set(range(*sorted([ax, bx]))) - xs)
    for (ax, ay), (bx, by) in combinations(stars, 2)
  )


def part1(input):
  return find_distance(parse(input), 2)


def part2(input):
  return find_distance(parse(input), 1000000)


testInput = "...#......\n.......#..\n#.........\n..........\n......#...\n.#........\n.........#\n..........\n.......#..\n#...#....."
solve(
  part1,
  testInput,
  374,
  part2,
  testInput,
  82000210,
)
