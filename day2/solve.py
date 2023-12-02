from math import prod
from re import findall
from runner.python import solve


def parseGames(input: str):
    return [
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


def part1(input: str):
    part1 = sum(
        i + 1
        for i, game in enumerate(parseGames(input))
        if all(s[0] <= 12 and s[1] <= 13 and s[2] <= 14 for s in game)
    )

    return part1


def part2(input):
    games = parseGames(input)
    part2 = sum(prod(max(s) for s in zip(*game)) for game in games)
    return part2


testData = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"

solve(
    part1,
    testData,
    8,
    part2,
    testData,
    2286,
)
