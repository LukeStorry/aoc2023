from math import prod
from re import findall

input = open("day2/input.txt").read().strip()

games = [
    [
        (
            int(next(iter(findall(r"(\d+) red", set)), 0)),
            int(next(iter(findall(r"(\d+) green", set)), 0)),
            int(next(iter(findall(r"(\d+) blue", set)), 0)),
        )
        for set in line.split(";")
    ]
    for line in input.split("\n")
]


part1 = sum(
    i
    for i, game in enumerate(games, 1)
    if all(s[0] <= 12 and s[1] <= 13 and s[2] <= 14 for s in game)
)

part2 = sum(prod(max(s) for s in zip(*game)) for game in games)


print(part1, part2)
