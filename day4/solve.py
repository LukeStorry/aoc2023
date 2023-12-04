from re import findall
from runner.python import solve


def part1(input):
    wins = [
        len(cards) - len(set(cards))
        for line in input.split("\n")
        if (cards := findall(r"\d+", line.split(":")[1]))
    ]

    part1 = sum(2 ** (win - 1) if win else 0 for win in wins)

    return part1


def part2(input):
    wins = [
        len(cards) - len(set(cards))
        for line in input.split("\n")
        if (cards := findall(r"\d+", line.split(":")[1]))
    ]

    cards = [1 for _ in range(len(wins))]

    for card, won in enumerate(wins):
        for next_card in range(card + 1, card + won + 1):
            cards[next_card] += cards[card]

    return sum(cards)


solve(
    part1,
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\n    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\n    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\n    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\n    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\n    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
    13,
    part2,
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\n    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\n    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\n    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\n    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\n    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
    30,
)
