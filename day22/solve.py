from re import findall
from runner.python import solve


Point = tuple[int, int, int]
Brick = set[Point]


def parse(input: str) -> list[Brick]:
  brick_ends = [
    list(map(int, findall(r"\d+", row))) for row in input.split("\n")
  ]
  brick_ends = sorted(brick_ends, key=lambda brick: brick[2])

  return [
    {
      (x, y, z)
      for x in range(x1, x2 + 1)
      for y in range(y1, y2 + 1)
      for z in range(z1, z2 + 1)
    }
    for x1, y1, z1, x2, y2, z2 in brick_ends
  ]


def fall(brick: Brick, stable: set[Point]) -> Brick:
  stable -= brick
  while True:
    fallen = {(x, y, z - 1) for x, y, z in brick}
    if len(fallen & stable) or any(z < 1 for _, _, z in fallen):
      stable |= brick
      return brick
    brick = fallen


def run(input):
  bricks, stable, falls = parse(input), set(), []
  bricks = [fall(b, stable) for b in bricks]

  falls = [
    brick_index
    for brick_index, brick in enumerate(bricks)
    if (stable := {p for b in bricks for p in b if b != brick})
    for other_brick in bricks[brick_index + 1 :]
    if other_brick != fall(other_brick, stable)
  ]

  return len(bricks) - len(set(falls)), len(falls)


def part1(input: str) -> int:
  return run(input)[0]


def part2(input: str) -> int:
  return run(input)[1]


solve(
  part1,
  "1,0,1~1,2,1\n0,0,2~2,0,2\n0,2,3~2,2,3\n0,0,4~0,2,4\n2,0,5~2,2,5\n0,1,6~2,1,6\n1,1,8~1,1,9",
  5,
  part2,
  "1,0,1~1,2,1\n0,0,2~2,0,2\n0,2,3~2,2,3\n0,0,4~0,2,4\n2,0,5~2,2,5\n0,1,6~2,1,6\n1,1,8~1,1,9",
  7,
)
