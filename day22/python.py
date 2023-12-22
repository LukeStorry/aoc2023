from re import findall

Brick = set[tuple[int, int, int]]


def fall(brick: Brick, stable_points=set()) -> Brick:
  stable_points -= brick
  while (
    (fallen := {(x, y, z - 1) for x, y, z in brick})
    and not len(fallen & stable_points)
    and all(z > 0 for _, _, z in fallen)
  ):
    brick = fallen
  stable_points |= brick
  return brick


brick_ends = sorted(
  (list(map(int, findall(r"\d+", row)))
    for row in open("day22/input.txt").readlines()
  ), key=lambda b: b[2],
)

bricks: list[Brick] = [
  set((x, y, z) for x in range(x1, x2 + 1)
                for y in range(y1, y2 + 1)
                for z in range(z1, z2 + 1)
  ) for x1, y1, z1, x2, y2, z2 in brick_ends
]

bricks = [fall(brick) for brick in bricks]
disintegratable, totalFalls = set(range(len(bricks))), 0
for brick_index, brick in enumerate(bricks):
  stable_points = set.union(*bricks)
  stable_points -= brick
  for other_brick in bricks[brick_index + 1 :]:
    stable_points -= other_brick
    if other_brick != fall(other_brick, stable_points):
      disintegratable.discard(brick_index)
      totalFalls += 1

print(len(disintegratable), totalFalls)
