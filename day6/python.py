from math import prod
from re import findall, sub

input = open("input.txt").read()
part1 = prod(
    sum(1 for hold in range(0, time) if ((time - hold) * hold) > record)
    for time, record in zip(
        *((int(x) for x in findall(r"\d+", line)) for line in input.splitlines())
    )
)
part2 = sum(
    1
    for time, record in [(int(sub(r"[^0-9]", "", line)) for line in input.splitlines())]
    for hold in range(0, time)
    if ((time - hold) * hold) > record
)
print(part1, part2)
