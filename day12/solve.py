from runner.python import solve
from functools import cache


def parse(input: str) -> list[tuple[str, tuple[int, ...]]]:
  return [
    (line.split()[0], tuple(map(int, line.split()[1].split(","))))
    for line in input.splitlines()
  ]


@cache
def count_arrangements(springs: str, groups: tuple[int, ...], current_group_length=0):
  # When at end of given groups, each group after is 0 length
  group = groups[0] if groups else 0

  if not springs:  # base case - end of possible spring string
    if len(groups) > 1 or group != current_group_length:
      return 0  # leftover groups or leftover group length
    return 1

  # parse each char of the string recursively
  spring, springs = springs[0], springs[1:]
  match spring:
    case "?":
      damaged = count_arrangements("#" + springs, groups, current_group_length)
      operational = count_arrangements("." + springs, groups, current_group_length)
      return damaged + operational

    case "#":
      if current_group_length > group:  # group too long
        return 0

      return count_arrangements(springs, groups, current_group_length + 1)

    case ".":
      if current_group_length:  # end of group
        if current_group_length == group:
          return count_arrangements(springs, tuple(groups[1:]), 0)
        return 0

      return count_arrangements(springs, groups, 0)


def part1(input):
  counts = [count_arrangements(*row) for row in parse(input)]
  return sum(counts)


def part2(input):
  unfolded = [("?".join([s] * 5), g * 5) for s, g in parse(input)]
  counts = [count_arrangements(*row) for row in unfolded]
  return sum(counts)


testInput = "???.### 1,1,3\n.??..??...?##. 1,1,3\n?#?#?#?#?#?#?#? 1,3,1,6\n????.#...#... 4,1,1\n????.######..#####. 1,6,5\n?###???????? 3,2,1"
solve(
  part1,
  testInput,
  21,
  part2,
  testInput,
  525152,
)
