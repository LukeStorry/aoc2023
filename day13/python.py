def find_score(grid: list[list[str]], isPart2=False) -> int:
  for possibleMirror in range(1, len(grid)):
    errors = sum(
      c1 != c2
      for left, right in zip(
        range(possibleMirror - 1, -1, -1),
        range(possibleMirror, len(grid)),
      )
      for c1, c2 in zip(grid[left], grid[right])
    )
    if errors == (1 if isPart2 else 0):
      return possibleMirror * 100

  return find_score([list(row) for row in zip(*grid)], isPart2) // 100


grids = [
  [[c for c in line] for line in grid.splitlines()]
  for grid in open("day13/input.txt").read().split("\n\n")
]
part1 = sum(find_score(grid) for grid in grids)
part2 = sum(find_score(grid, True) for grid in grids)

print(part1, part2)
