import { mkdirSync, writeFileSync, existsSync, cp, cpSync } from "fs";
import { config } from "dotenv";
import { forEach, map } from "lodash";
config();

const YEAR = process.env.YEAR || 2023;

async function aocFetch(path: string) {
  const res = await fetch(`https://adventofcode.com/${YEAR}/${path}`, {
    headers: {
      cookie: `session=${process.env.SESSION}`,
    },
  });
  return res.text();
}

if (!process.env.SESSION) {
  throw new Error(
    "Missing SESSION environment variable." +
      "Copy the session cookie from the browser to .env."
  );
}

async function setupDir(day: number) {
  const folder = `day${day}`;
  if (!existsSync(folder)) {
    console.log(`Setting up ${folder}`);
    cpSync("_template", folder, { recursive: true });
  }

  const inputPath = `${folder}/input.txt`;
  if (!existsSync(inputPath)) {
    console.log(`Fetching inputs for ${folder}`);
    const input = await aocFetch(`day/${day}/input`);
    if (!input.includes("Please don't repeatedly request"))
      writeFileSync(inputPath, input);
    else {
      console.log("Puzzle not released yet!");
    }
  }
}

// Just set up all folders every time - it takes a fraction of a second
const today = new Date();
const lastDay = today.getFullYear() === YEAR ? today.getDate() : 25;
if (process.argv[2]) {
  setupDir(parseInt(process.argv[2], 10));
} else {
  const daysToSetup = map(Array.from({ length: lastDay }), (_, i) => i + 1);
  forEach(daysToSetup, (day) => setupDir(day));
}
