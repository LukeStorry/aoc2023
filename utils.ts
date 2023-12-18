export function lowestCommonMultiple(a, b) {
  const gcd = (a, b) => (a ? gcd(b % a, a) : b);
  return (a * b) / gcd(a, b);
}

type Grid = (string | number)[][];
type Point = [number, number];
type Node = { x: number; y: number };

export function printGrid(
  grid: Grid,
  highlight: Point[] | Node[],
  current?: Point
) {
  const highlightHash = highlight.map((h) => {
    const [x, y] = h instanceof Array ? h : [h.x, h.y];
    return `${x},${y}`;
  });

  function lineToStr(line: (string | number)[], y: number): string {
    const chars = line.map((cell, x) => {
      if (x === current?.[0] && y === current?.[1]) return "☆";
      if (highlightHash.includes(`${x},${y}`)) return "#";
      if (cell === ".") return " ";
      return cell;
    });
    return chars.join("");
  }
  const asString = grid.map((line, y) => lineToStr(line, y)).join("\n");

  console.log();
  // console.clear();
  console.log(asString);
  console.log();
}
