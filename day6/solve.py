from math import prod
from re import findall, sub
from runner.python import solve


def part1(input: str) -> int:
    parsed = ((int(x) for x in findall(r"\d+", line)) for line in input.splitlines())
    part1 = prod(
        sum(1 for hold in range(0, time) if ((time - hold) * hold) > record)
        for time, record in zip(*parsed)
    )
    return part1


def part2(input: str) -> int:
    time, record = (int(sub(r"[^0-9]", "", line)) for line in input.splitlines())
    part2 = sum(1 for hold in range(0, time) if ((time - hold) * hold) > record)
    return part2


solve(
    part1,
    "Time:      7  15   30\n    Distance:  9  40  200",
    288,
    part2,
    "Time:      7  15   30\n    Distance:  9  40  200",
    71503,
)
