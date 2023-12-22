from re import findall

Brick = set[tuple[int, int, int]]

def fall(brick: Brick, stable: set, unstable: set) -> Brick:
  stable -= brick
  unstable -= brick
  while (
    (fallen := {(x, y, z - 1) for x, y, z in brick})
    and not len(fallen & stable)
    and all(z > 0 for _, _, z in fallen)
  ):
    brick = fallen
  stable |= brick
  return brick

brick_ends = [
  list(map(int, findall(r"\d+", row)))
  for row in open("day22/input.txt").readlines()
]
brick_ends = sorted(brick_ends, key=lambda brick: brick[2])

bricks: list[Brick] = [
  {
    (x, y, z)
    for x in range(x1, x2 + 1)
    for y in range(y1, y2 + 1)
    for z in range(z1, z2 + 1)
  }
  for x1, y1, z1, x2, y2, z2 in brick_ends
]

stable, unstable = set(), {p for brick in bricks for p in brick}
bricks = [fall(brick, stable, unstable) for brick in bricks]
disintegratable, totalFalls = set(range(len(bricks))), 0

for brick_index, brick in enumerate(bricks):
  stable_backup = set(stable)
  stable -= brick
  for other_brick in bricks[brick_index + 1 :]:
    stable -= other_brick
    if other_brick != fall(other_brick, stable, unstable):
      disintegratable.discard(brick_index)
      totalFalls += 1
  stable = stable_backup

print(len(disintegratable), totalFalls)
