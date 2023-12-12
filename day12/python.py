from functools import cache


def parseLine(line: str) -> tuple[str, tuple[int, ...]]:
  springs, groupsStr = line.split(" ")
  return (springs, tuple(int(i) for i in groupsStr.split(",")))


@cache
def count_arrangements(springs: str, groups: tuple[int, ...], current_group_length=0):
  group = groups[0] if groups else 0  # When out of given groups, each is 0 length

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


input = [parseLine(line) for line in open("day12/input.txt").readlines()]

part1 = sum(count_arrangements(*row) for row in input)

unfolded = [("?".join([s] * 5), g * 5) for s, g in input]
part2 = sum(count_arrangements(*row) for row in unfolded)

print(part1, part2)
