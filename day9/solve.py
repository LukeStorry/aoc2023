from runner.python import solve


def parse(input: str) -> list[list[int]]:
    return [[int(i) for i in line.split(" ")] for line in input.splitlines()]


def predict(row: list[int]) -> int:
    if not row:
        return 0
    return row[-1] + predict([b - a for a, b in zip(row, row[1:])])


def part1(input):
    return sum(predict(h) for h in parse(input))


def part2(input):
    return sum(predict([*reversed(h)]) for h in parse(input))


solve(
    part1,
    "0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45",
    114,
    part2,
    "0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45",
    2,
)
