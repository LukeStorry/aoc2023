type Grid = string[][];
type Point = [number, number];

export function printGrid(grid: Grid, highlight: Point[], current?: Point) {
  const highlightHash = highlight.map(([x, y]) => `${x},${y}`);

  function lineToStr(line: string[], y: number): string {
    const chars = line.map((cell, x) => {
      if (x === current?.[0] && y === current?.[1]) return "☆";
      if (highlightHash.includes(`${x},${y}`)) return "#";
      if (cell === ".") return " ";
      return cell;
    });
    return chars.join("");
  }
  const asString = grid.map((line, y) => lineToStr(line, y)).join("\n");

  console.clear();
  console.log(asString);
  console.log();
}
