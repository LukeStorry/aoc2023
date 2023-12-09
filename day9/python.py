input = [[int(i) for i in line.split(" ")] for line in open("day9/input.txt").readlines()]
predict = lambda row: 0 if not row else row[-1] + predict([b - a for a, b in zip(row, row[1:])])
print(sum(predict(r) for r in input), sum(predict([*reversed(r)]) for r in input))
