import json
import inspect
import os
from pathlib import Path
import re
from typing import Callable
from urllib import request


def solve(
    part1: Callable[[str], str],
    test1_input: str,
    test1_output: str | int,
    part2: Callable[[str], str] | None = None,
    test2_input: str | None = None,
    test2_output: str | int | None = None,
):
    abs_path = os.path.abspath((inspect.stack()[1])[1])
    dir = os.path.dirname(abs_path)
    if test1_input and test1_output:
        test_1_answer = part1(test1_input)
        if test_1_answer != test1_output:
            print(
                f"Part 1: Wrong test answer! Expected {test1_output}, got {test_1_answer}"
            )
            return False
        else:
            print(f"Part 1: Right test answer! Got {test_1_answer}")
    input_text = open(dir + "/input.txt").read().strip()
    attempt(part1(input_text), 1, dir)
    if not part2:
        return
    if test2_input and test2_output:
        test_2_answer = part2(test2_input)
        if test_2_answer != test2_output:
            print(
                f"Part 2: Wrong test answer! Expected {test2_output}, got {test_2_answer}"
            )
            return False
        else:
            print(f"Part 2: Right test answer! Got {test_1_answer}")

    attempt(part2(input_text), 2, dir)


def get_session():
    envFile = Path(os.path.dirname(os.path.abspath(__file__))).parent.joinpath(".env")
    with open(envFile) as f:
        return f.read().split("=")[1].split("\n")[0]


def check_solution(answer, day, part):
    url = f"https://adventofcode.com/2023/day/{day}/answer"
    query = f"level={part}&answer={answer}"
    print(query)
    print(get_session())
    headers = {
        "cookie": f"session={get_session()}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    req = request.Request(url, query.encode("utf-8"), headers=headers)
    resp = request.urlopen(req)
    response_text = resp.read().decode("utf-8")
    print(response_text)
    return "not the right answer" not in response_text


def attempt(solution, part, dir):
    solutions = json.loads(open(dir + "/solutions.json").read())
    solution_part = solutions[f"part{part}"]
    if solution_part["correctSolution"]:
        if solution_part["correctSolution"] == str(solution):
            print(f"Part {part} correct!")
            return True
        else:
            print(
                f"Wrong final answer! Expected {solution_part['correctSolution']}, got {solution}"
            )
            return False

    if solution in solution_part["attemptedSolutions"]:
        print("Already attempted this solution!")
        return False

    solution_part["attemptedSolutions"].append(solution)
    day = re.match(r".*day(\d+).*", dir).group(1)
    if check_solution(solution, day, part):
        solution_part["correctSolution"] = solution
        print("Correct!")
    else:
        print(f"Wrong answer ({solution}!")

    with open(Path(dir).joinpath("solutions.json"), "w") as outfile:
        outfile.write(json.dumps(solutions, indent=4))

    return solution_part["correctSolution"] == solution
