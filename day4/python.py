from re import findall

input = open("day4/input.txt").read().strip()
wins = [
    len(cards) - len(set(cards))
    for line in input.split("\n")
    if (cards := findall(r"\d+", line.split(":")[1]))
]

part1 = sum(2 ** (win - 1) if win else 0 for win in wins)

cards = [1 for _ in range(len(wins))]
for card, won in enumerate(wins):
    for next_card in range(card + 1, card + won + 1):
        cards[next_card] += cards[card]
part2 = sum(cards)

print(part1, part2)
