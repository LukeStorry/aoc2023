import re
from functools import reduce
from runner.python import solve
from typing import NamedTuple


def hash(s: str) -> int:
  return reduce(lambda h, v: ((h + ord(v)) * 17) % 256, s, 0)


def part1(input: str) -> int:
  return sum(hash(s) for s in input.split(","))


Lens = NamedTuple("Lens", [("label", str), ("focal_length", str)])


def calculate_slots(lenses: list[Lens]):
  all_labels = {label if focal else None for label, focal in lenses}

  latest_focal_point = lambda label: next(
    focal_length for l, focal_length in reversed(lenses) if l == label
  )

  label_indexes = [
    [(l, f, i) for i, (l, f) in enumerate(lenses) if l == label]
    for label in {lens.label for lens in lenses}
  ]

  last_empty_index = lambda label: next(
    (
      i
      for i, (l, f) in reversed(list(enumerate(lenses)))
      if l == label and not f
    ),
    -1,
  )

  first_valid_index_per_label = {
    label: i
    for i, (label, focal) in enumerate(lenses)
    if focal and i > last_empty_index(label)
  }

  last_valid_index = lambda label: next(
    (
      i
      for i, (l, f) in enumerate(lenses)
      if l == label and f and i > last_empty_index(label)
    ),
    -1,
  )

  slots = [
    Lens(label, latest_focal_point(label))
    for label in first_valid_index_per_label.keys()
  ]

  return slots


test_input1 = [Lens("rn", "1"), Lens("cm", ""), Lens("cm", "2")]
expected_result1 = [
  Lens(label="rn", focal_length="1"),
  Lens(label="cm", focal_length="2"),
]
test_input2 = [Lens("qp", "3"), Lens("qp", "")]
expected_result2 = []
test_input3 = [
  Lens("pc", "4"),
  Lens("ot", "9"),
  Lens("ab", "5"),
  Lens("pc", ""),
  Lens("pc", "6"),
  Lens("ot", "7"),
]
expected_result3 = [
  Lens(label="ot", focal_length="7"),
  Lens(label="ab", focal_length="5"),
  Lens(label="pc", focal_length="6"),
]


result1 = calculate_slots(test_input1)
result2 = calculate_slots(test_input2)
result3 = calculate_slots(test_input3)
# print(1, result1)
# print(2, result2)
# print(3, result3)
assert result1 == expected_result1
assert result2 == expected_result2
assert result3 == expected_result3


def part2(input: str) -> int:
  lenses = [
    Lens(*re.split(r"-|=", step)) for step in input.split(",")
  ]
  lens_per_box = [
    [lens for lens in lenses if hash(lens[0]) == box]
    for box in {hash(lens[0]) for lens in lenses}
  ]

  box_powers = [
    (hash(lenses[0].label) + 1)
    * sum(
      int(f) * (i + 1)
      for i, (_, f) in enumerate(calculate_slots(lenses))
    )
    for lenses in lens_per_box
  ]

  return sum(box_powers)


testInput = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7"
solve(part1, testInput, 1320, part2, testInput, 145)
