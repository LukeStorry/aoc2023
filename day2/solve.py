from math import prod
from re import findall
from runner.python import solve


def parseGames(input: str):
    return [
        (
            max(map(int, findall(r"(\d+) red", line))),
            max(map(int, findall(r"(\d+) green", line))),
            max(map(int, findall(r"(\d+) blue", line))),
        )
        for line in input.split("\n")
    ]


def part1(input: str):
    games = parseGames(input)
    part1 = sum(
        i if (game[0] <= 12 and game[1] <= 13 and game[2] <= 14) else 0
        for i, game in enumerate(games, 1)
    )

    return part1


def part2(input):
    games = parseGames(input)
    part2 = sum(prod(g) for g in games)
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
