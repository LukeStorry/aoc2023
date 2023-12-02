from math import prod
from re import findall

input = open("day2/input.txt").read().strip()
games = [
    (
        max(map(int, findall(r"(\d+) red", line))),
        max(map(int, findall(r"(\d+) green", line))),
        max(map(int, findall(r"(\d+) blue", line))),
    )
    for line in input.split("\n")
]
part1 = sum(
    i
    for i, game in enumerate(games, 1)
    if (game[0] <= 12 and game[1] <= 13 and game[2] <= 14)
)
part2 = sum(prod(g) for g in games)
print(part1, part2)
