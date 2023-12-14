grid = [
  (x, y, cell)
  for y, row in enumerate(open("day14/input.txt").readlines())
  for x, cell in enumerate(row)
]
height = max(x for (x, _, _) in grid)
circles = {(x, y) for (x, y, cell) in (grid) if cell == "O"}
clear = {(x, y) for (x, y, cell) in (grid) if cell != "#"}
print_score = lambda x: print(x, sum(height - y for _, y in circles))
rotate = lambda coords: {(height - 1 - y, x) for x, y in coords}

spin, end, previous = 0, 1000000000, {}
while spin < end:
  spin += 1
  for d in ["n", "w", "s", "e"]:
    rolled_circles = set()
    for x, y in sorted(list(circles)):
      while y and (x, y - 1) in clear and (x, y - 1) not in rolled_circles:
        y -= 1
      rolled_circles.add((x, y))
    circles = rolled_circles
    if spin == 1 and d == "n":
      print_score("part 1")
    circles = rotate(circles)
    clear = rotate(clear)

  circles_hash = hash(tuple(circles))
  if lastSeen := previous.get(circles_hash):
    spin += ((end - spin) // (spin - lastSeen)) * (spin - lastSeen)
  previous[circles_hash] = spin

print_score("part 2")
