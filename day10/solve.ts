import { solve } from "../runner/typescript";
type Point = readonly [number, number];

function printPath(grid: string[][], path: Point[]) {
  for (let row = 0; row < grid.length; row += 1) {
    let rowString = "";
    for (let col = 0; col < grid[row].length; col += 1) {
      const pathPoint = path.findIndex(([r, c]) => r === row && c === col);
      if (pathPoint >= 0) {
        rowString += pathPoint.toString();
      } else {
        rowString += grid[row][col];
      }
    }
    console.log(rowString);
  }
  console.log();
}

function findPath(maze: string[][]): Point[] {
  const startRow = maze.findIndex((row) => row.includes("S"));
  const startCol = maze[startRow].indexOf("S");
  const path = [[startRow, startCol] as const];
  while (true) {
    const [row, col] = path.at(-1);
    const next = [
      [[row + 1, col], "SF7|", "LJ|"] as const,
      [[row, col - 1], "S7J-", "FL-"] as const,
      [[row, col + 1], "SFL-", "7J-"] as const,
      [[row - 1, col], "SLJ|", "F7|"] as const,
    ].find(
      ([[nextRow, nextCol], from, to]) =>
        from.includes(maze[row][col]) &&
        to.includes(maze[nextRow]?.[nextCol]) &&
        !path.some(([r, c]) => r === nextRow && c === nextCol)
    )?.[0];

    if (!next) return path;

    path.push(next);
  }
}

function part1(maze: string[][]): number {
  const path = findPath(maze);
  return path.length / 2;
}

function createMazeWithJustPath_Doubled(maze: string[][], path: Point[]) {
  const doubledMaze: string[][] = Array(maze.length * 2 + 2)
    .fill(null)
    .map(() => Array(maze[0].length * 2 + 1).fill("."));

  for (const [row, col] of path) {
    const [newRow, newCol] = [row * 2 + 1, col * 2 + 1];
    const cell = maze[row][col];
    doubledMaze[newRow][newCol] = cell;
    if (cell === "|") {
      doubledMaze[newRow - 1][newCol] = "|";
      doubledMaze[newRow + 1][newCol] = "|";
    }
    if (cell === "-") {
      doubledMaze[newRow][col * 2] = "-";
      doubledMaze[newRow][col * 2 + 2] = "-";
    }
    if (cell === "L") {
      doubledMaze[newRow - 1][newCol] = "|";
      doubledMaze[newRow][col * 2 + 2] = "-";
    }
    if (cell === "J") {
      doubledMaze[newRow - 1][newCol] = "|";
      doubledMaze[newRow][col * 2] = "-";
    }
    if (cell === "7") {
      doubledMaze[newRow + 1][newCol] = "|";
      doubledMaze[newRow][col * 2] = "-";
    }
    if (cell === "F") {
      doubledMaze[newRow + 1][newCol] = "|";
      doubledMaze[newRow][col * 2 + 2] = "-";
    }
  }
  return doubledMaze;
}

function getOutsides(maze: string[][], path: Point[]) {
  const doubledMaze: string[][] = createMazeWithJustPath_Doubled(maze, path);

  const start: Point = [0, 0] as const;
  const outsides = [start];
  const queue = [start];
  while (queue.length > 0) {
    const [row, col] = queue.pop();
    const neighbors = [
      [row + 1, col],
      [row, col + 1],
      [row - 1, col],
      [row, col - 1],
    ];

    for (const [row, col] of neighbors) {
      if (doubledMaze[row]?.[col] !== ".") continue;
      if (queue.some(([r, c]) => r === row && c === col)) continue;
      if (outsides.some(([r, c]) => r === row && c === col)) continue;
      outsides.push([row, col]);
      queue.push([row, col]);
    }
  }
  return outsides.map(([row, col]) => [row / 2, col / 2] as const);
}

function part2(maze: string[][]): number {
  const path = findPath(maze);
  const outsides = getOutsides(maze, path);

  const insides = maze
    .flatMap((row, rowI) => row.map((_, colI) => [rowI, colI] as const))
    .filter(([rowI, colI]) => !path.some(([r, c]) => r === rowI && c === colI))
    .filter(
      ([rowI, colI]) => !outsides.some(([r, c]) => r === rowI && c === colI)
    );

  return insides.length;
}

solve({
  parser: (input) => input.split("\n").map((row) => row.split("")),
  part1: part1,
  part2: part2,

  part1Tests: [
    [".....\n.S-7.\n.|.|.\n.L-J.\n.....", 4],
    ["..F7.\n.FJ|.\nSJ.L7\n|F--J\nLJ...", 8],
  ],
  part2Tests: [
    [".....\n.S-7.\n.|.|.\n.L-J.\n.....", 1],
    [
      "...........\n.S-------7.\n.|F-----7|.\n.||.....||.\n.||.....||.\n.|L-7.F-J|.\n.|..|.|..|.\n.L--J.L--J.\n...........",
      4,
    ],
    [
      ".F----7F7F7F7F-7....\n.|F--7||||||||FJ....\n.||.FJ||||||||L7....\nFJL7L7LJLJ||LJ.L-7..\nL--J.L7...LJS7F-7L7.\n....F-J..F7FJ|L7L7L7\n....L7.F7||L7|.L7L7|\n.....|FJLJ|FJ|F7|.LJ\n....FJL-7.||.||||...\n....L---J.LJ.LJLJ...",
      8,
    ],
    [
      "FF7FSF7F7F7F7F7F---7\nL|LJ||||||||||||F--J\nFL-7LJLJ||||||LJL-77\nF--JF--7||LJLJ7F7FJ-\nL---JF-JLJ.||-FJLJJ7\n|F|F-JF---7F7-L7L|7|\n|FFJF7L7F-JF7|JL---7\n7-L-JL7||F7|L7F-7F7|\nL.L7LFJ|||||FJL7||LJ\nL7JLJL-JLJLJL--JLJ.L",
      10,
    ],
  ],
});
