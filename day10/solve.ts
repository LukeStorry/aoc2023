import { solve } from "../runner/typescript";
import { max, sum, groupBy } from "lodash";

type Parsed = {};

function printPath(grid: string[][], path: (readonly [number, number])[]) {
  for (let row = 0; row < grid.length; row += 1) {
    let rowString = "";
    for (let col = 0; col < grid[row].length; col += 1) {
      const pathPoint = path.findIndex(([r, c]) => r === row && c === col);
      if (pathPoint >= 0) {
        rowString += "■"; //pathPoint.toString();
      } else {
        rowString += grid[row][col];
      }
    }
    // console.log(rowString);
  }
  // console.log();
}

function findPath(maze: string[][]) {
  const startingRow = maze.findIndex((row) => row.includes("S"));
  const startingCol = maze[startingRow].indexOf("S");

  const path = [[startingRow, startingCol] as const];
  while (true) {
    // printGrid(maze, path);
    const [nextRow, nextCol] = getNextStep(maze, path);
    if (maze[nextRow][nextCol] === "S") {
      break;
    }
    path.push([nextRow, nextCol]);
    // console.log("path", path);
  }
  return path;
}

function getNextStep(
  maze: string[][],
  path: (readonly [number, number])[]
): readonly [number, number] {
  // | is a vertical pipe connecting north and south.
  // - is a horizontal pipe connecting east and west.
  // L is a 90-degree bend connecting north and east.
  // J is a 90-degree bend connecting north and west.
  // 7 is a 90-degree bend connecting south and west.
  // F is a 90-degree bend connecting south and east.
  // . is ground; there is no pipe in this tile.
  // S can move in any direction
  const [row, col] = path.at(-1);
  const nextSteps = getValidNeighbors(row, col, maze);

  return (
    nextSteps.find(
      ([nextRow, nextCol]) =>
        !path.some(([r, c]) => r === nextRow && c === nextCol)
    ) ?? path[0]
  );
}

function getValidNeighbors(row: number, col: number, maze: string[][]) {
  const possibilities = [
    // can move down if down has a connector, in 'LJ|' and current is in 'SF7|'
    [[row + 1, col], "SF7|", "LJ|"] as const,
    // can move left if left has a connector, in 'FL-', and current is in 'S7J-'
    [[row, col - 1], "S7J-", "FL-"] as const,
    // can move right if right has a connector, in '7J-' and current is in 'SFL-'
    [[row, col + 1], "SFL-", "7J-"] as const,
    // can move up if up has a connector, in 'F7|' and current is in 'SLJ|'
    [[row - 1, col], "SLJ|", "F7|"] as const,
  ];

  return possibilities
    .filter(([[nextRow, nextCol], from, to]) => {
      const validFrom = from.includes(maze[row][col]);
      const validTo = to.includes(maze[nextRow]?.[nextCol] ?? "EDGE");
      return validFrom && validTo;
    })
    .map(([nextStep]) => nextStep);
}

function part1(maze: string[][]): number {
  const path = findPath(maze);
  return path.length / 2;
}

// function part2(maze: string[][]): number {
//   const insides = maze.flatMap((row, rowI) => {
//     return row
//       .map((cell, colI) => {
//         if (cell !== ".") return null;
//         const verticalsToLeft = row
//           .slice(0, colI)
//           .filter((c) => "S|FJL7".includes(c));
//         const verticalsToRight = row
//           .slice(colI + 1)
//           .filter((c) => "S|FJL7".includes(c));

//         const horizontalsAbove = maze
//           .slice(0, rowI)
//           .map((r) => r[colI])
//           .filter((c) => "S-FJL7".includes(c));
//         const horizontalsBelow = maze
//           .slice(rowI + 1)
//           .map((r) => r[colI])
//           .filter((c) => "S-FJL7".includes(c));

//         const isInsideVertically =
//           verticalsToLeft.length % 2 !== 0 || verticalsToRight.length % 2 !== 0;

//         const isInsideHorizontally =
//           horizontalsAbove.length % 2 !== 0 ||
//           horizontalsBelow.length % 2 !== 0;

//         const isInsideNormally = isInsideVertically && isInsideHorizontally;
//         const isInsideBackwards =
//           horizontalsAbove.length > 1 &&
//           horizontalsBelow.length > 1 &&
//           verticalsToLeft.length > 1 &&
//           verticalsToRight.length > 1 &&
//           !isInsideVertically &&
//           !isInsideHorizontally;

//         return isInsideNormally //|| isInsideBackwards
//           ? ([rowI, colI] as const)
//           : null;
//       })
//       .filter(Boolean);
//   });
//   printPath(maze, insides);

//   // start at the start, putting left and right into buckets
//   // follow the path, putting

//   return insides.length;
// }
function part2(maze: string[][]): number {
  const doubledGrid = maze.flatMap((row, rowI) => {
    const doubledRow = row.flatMap((cell, colI) => {
      // const above = maze[rowI - 1]?.[colI] ?? "EDGE";
      // const below = maze[rowI + 1]?.[colI] ?? "EDGE";
      // const left = row[colI - 1] ?? "EDGE";
      // const right = row[colI + 1] ?? "EDGE";

      // const leftOrRightHorizontal = left === "-"; //|| right === "-";
      // const aboveOrBelowVertical = above === "|" || below === "|";

      // if (leftOrRightHorizontal) return ["-", cell];
      // if (aboveOrBelowVertical) return ["V", cell];
      return [".", "."];
      // if (cell === ".") return [cell, cell];
      // const pathIndex = path.findIndex(([r, c]) => r === rowI && c === colI);
      // if (pathIndex < 0)
      return [cell, "."];

      // const [prevRow, prevCol] = path.at(pathIndex - 1);
      // const [nextRow, nextCol] = path[pathIndex + 1] ?? path[0]

      // // | is a vertical pipe connecting north and south.
      // if (prevRow === nextRow) return [cell, '-'];
      // if (prevCol === nextCol) return [cell, '|'];
      // if (prevRow < nextRow) return [cell, 'L'];
      // if (prevRow > nextRow) return [cell, '7'];
      // if (prevCol < nextCol) return [cell, 'F'];
      // if (prevCol > nextCol) return [cell, 'J'];

      // // - is a horizontal pipe connecting east and west.
      // // L is a 90-degree bend connecting north and east.
      // // J is a 90-degree bend connecting north and west.
      // // 7 is a 90-degree bend connecting south and west.
      // // F is a 90-degree bend connecting south and east.

      // return ["X", cell];
    });
    const newRow = row.flatMap((cell) => [".", "."]);
    return [newRow.concat(["."]), doubledRow.concat(["."])];
  });

  const newRow = Array(doubledGrid[0].length).fill(".");
  doubledGrid.push(newRow);

  const path = findPath(maze);

  path.forEach(([rowI, colI]) => {
    const cell = maze[rowI][colI];
    switch (cell) {
      case "|": {
        doubledGrid[rowI * 2][colI * 2 + 1] = "|";
        doubledGrid[rowI * 2 + 2][colI * 2 + 1] = "|";
        break;
      }
      case "-": {
        doubledGrid[rowI * 2 + 1][colI * 2] = "-";
        doubledGrid[rowI * 2 + 1][colI * 2 + 2] = "-";
        break;
      }
      case "L": {
        doubledGrid[rowI * 2][colI * 2 + 1] = "|";
        doubledGrid[rowI * 2 + 1][colI * 2 + 2] = "-";
        break;
      }
      case "J": {
        doubledGrid[rowI * 2][colI * 2 + 1] = "|";
        doubledGrid[rowI * 2 + 1][colI * 2] = "-";
        break;
      }
      case "7": {
        doubledGrid[rowI * 2 + 2][colI * 2 + 1] = "|";
        doubledGrid[rowI * 2 + 1][colI * 2] = "-";
        break;
      }
      case "F": {
        doubledGrid[rowI * 2 + 2][colI * 2 + 1] = "|";
        doubledGrid[rowI * 2 + 1][colI * 2 + 2] = "-";
        break;
      }
    }
    doubledGrid[rowI * 2 + 1][colI * 2 + 1] = cell;

    // return;
    // const [prevRow, prevCol] = path.at(pathIndex - 1);
    // const [nextRow, nextCol] = path[pathIndex + 1] ?? path[0];

    // // | is a vertical pipe connecting north and south.
    // if (prevRow === nextRow) return [cell, "-"];
    // if (prevCol === nextCol) return [cell, "|"];
    // if (prevRow < nextRow) return [cell, "L"];
    // if (prevRow > nextRow) return [cell, "7"];
    // if (prevCol < nextCol) return [cell, "F"];
    // if (prevCol > nextCol) return [cell, "J"];

    // // - is a horizontal pipe connecting east and west.
    // // L is a 90-degree bend connecting north and east.
    // // J is a 90-degree bend connecting north and west.
    // // 7 is a 90-degree bend connecting south and west.
    // // F is a 90-degree bend connecting south and east.

    // return ["X", cell];
  });

  printPath(maze, []);
  printPath(doubledGrid, []);

  const outsides: [number, number][] = [[0, 0] as const];
  const queue: [number, number][] = [[0, 0] as const];
  while (queue.length > 0) {
    const [row, col] = queue.pop();
    const neighbors = [
      [row + 1, col],
      [row, col + 1],
      [row - 1, col],
      [row, col - 1],
    ] as const;
    for (const [row, col] of neighbors) {
      if (doubledGrid[row]?.[col] !== ".") continue;
      if (queue.some(([r, c]) => r === row && c === col)) continue;
      if (outsides.some(([r, c]) => r === row && c === col)) continue;
      outsides.push([row, col]);
      queue.push([row, col]);
    }
  }
  printPath(doubledGrid, outsides);

  const insides = maze.flatMap((row, rowI) => {
    return row
      .map((cell, colI) => {
        const cellOnPath = path.some(([r, c]) => r === rowI && c === colI);
        if (cellOnPath) return null;

        const isOutside = outsides.some(
          ([r, c]) => r / 2 === rowI && c / 2 === colI
        );

        if (isOutside) return null;
        return [rowI, colI] as const;
      })
      .filter(Boolean);
  });
  printPath(maze, insides);

  return insides.length;
  const countOfDotsOnEvenRows = outsides.filter(
    ([r, c]) => r % 2 === 0 && c % 2 === 0
  ).length;

  const dotsOnOriginalGrid = maze.flat().filter((c) => c === ".").length;
  // console.log(dotsOnOriginalGrid, countOfDotsOnEvenRows);

  return dotsOnOriginalGrid - countOfDotsOnEvenRows;
}

solve({
  parser: (input) => input.split("\n").map((row) => row.split("")),
  // part1: part1,
  part2: part2,

  // part1Tests: [
  //   [".....\n.S-7.\n.|.|.\n.L-J.\n.....", 4],
  //   ["..F7.\n.FJ|.\nSJ.L7\n|F--J\nLJ...", 8],
  // ],
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
