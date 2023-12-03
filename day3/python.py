from math import prod
from re import finditer

input = open("day3/input.txt").read().strip()
numbers_with_points = [
    (int(match.group()), [(x, y) for x in range(match.start(), match.end())])
    for y, line in enumerate(input.splitlines())
    for match in finditer(r"[0-9]+", line)
]
symbols_with_neighbors = [
    (
        match.group(),
        [
            (_x, _y)
            for _x in range(match.start() - 1, match.end() + 1)
            for _y in range(y - 1, y + 2)
        ],
    )
    for y, line in enumerate(input.splitlines())
    for match in finditer(r"[^0-9.]", line)
]
part1 = sum(
    number
    for number, number_coords in numbers_with_points
    if any(
        coord in symbol_neighbors
        for _, symbol_neighbors in symbols_with_neighbors
        for coord in number_coords
    )
)
part2 = sum(
    prod(adjacent_numbers) if len(adjacent_numbers) == 2 else 0
    for symbol, symbol_neighbors in symbols_with_neighbors
    if symbol == "*"
    if (
        adjacent_numbers := [
            number
            for number, number_coords in numbers_with_points
            if any(coord in symbol_neighbors for coord in number_coords)
        ]
    )
)

print(part1, part2)
