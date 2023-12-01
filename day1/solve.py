from re import findall
from runner.python import solve


def part1(input):
    return sum(
        int(digits[0] + digits[-1])
        for line in input.split("\n")
        if (digits := findall(r"\d", line))
    )


words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]


def part2(input):
    return sum(
        int(
            (first if first.isdigit() else str(words.index(first)))
            + (last if last.isdigit() else str(words.index(last)))
        )
        for line in input.split("\n")
        if (digits := findall(f"\d|{'|'.join(words)}", line))
        and (first := digits[0])
        and (last := digits[-1])
    )


solve(
    part1,
    "1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet",
    142,
    part2,
    "two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen",
    281,
)
