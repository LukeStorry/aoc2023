from runner.python import solve


def find_score([grid, isRotated], isPart2=False) -> int:
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
      return possibleMirror * 100 if isRotated else 1
    return 0


def part1(input):
  grids = [
    [[c for c in line] for line in grid.splitlines()]
    for grid in input.split("\n\n")
  ]
  grids_with_rotations = [
    g
    for grid in grids
    for g in [(list(map(list(zip(*grid)))), True), (grid, False)]
  ]

  return sum(find_score(grid) for grid in grids_with_rotations)


def part2(input):
  grids = [
    [[c for c in line] for line in grid.splitlines()]
    for grid in input.split("\n\n")
  ]
  grids_with_rotations = [
    g
    for grid in grids
    for g in [(list(map(list(zip(*grid)))), 100), (grid, 1)]
  ]

  return sum(find_score(grid, True) for grid in grids)


testInput = "#.##..##.\n..#.##.#.\n##......#\n##......#\n..#.##.#.\n..##..##.\n#.#.##.#.\n\n#...##..#\n#....#..#\n..##..###\n#####.##.\n#####.##.\n..##..###\n#....#..#"
solve(
  part1,
  testInput,
  405,
  # part2,
  # testInput,
  # 400,
)
