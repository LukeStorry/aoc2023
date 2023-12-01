import { readFileSync, writeFileSync } from "fs";
import { config } from "dotenv";
import { dirname } from "path";
import caller from "caller";

config();

type SolveArgs<T, TResult1, TResult2> = {
  parser: (input: string) => T;
  part1: (input: T, isTest?: boolean) => TResult1;
  part2: (input: T, isTest?: boolean) => TResult2;
  test1Input?: string;
  test1Output?: TResult1;
  test2Input?: string;
  test2Output?: TResult2;
};

type Solutions = {
  part1: {
    attemptedSolutions: string[];
    correctSolution: string | null;
  };
  part2: {
    attemptedSolutions: string[];
    correctSolution: string | null;
  };
};

function read(fileName: string): string {
  return readFileSync(fileName, "utf8").replace(/\n$/, "").replace(/\r/g, "");
}

export async function solve<T, TResult1, TResult2>({
  part1,
  test1Input,
  test1Output,
  part2,
  test2Input,
  test2Output,
  parser = (x) => x as T,
}: SolveArgs<T, TResult1, TResult2>) {
  const dir = dirname(caller());
  const day = dir.replace(/.*day/, "");

  const solutionsFile = JSON.parse(
    readFileSync(`${dir}/solutions.json`, "utf8")
  ) as Solutions;

  const part1Solved = solutionsFile.part1.correctSolution !== null;
  const part = part1Solved ? 2 : 1;

  const [solver, test, testInput] = part1Solved
    ? [part2, test2Output, test2Input]
    : [part1, test1Output, test1Input];

  if (test && testInput) {
    const parsedTestInput = parser(testInput);
    const testOutput = solver(parsedTestInput, true)?.toString();
    if (testOutput !== test.toString()) {
      console.error(
        `Test failed for day ${day} part ${part}:\nExpected\n${test}\nGot\n${testOutput}\n`
      );
      process.exit(1);
    }
    console.log(`Test passed for day ${day} part ${part}`);
  }

  const fileName = `${dir}/input.txt`;
  const input = parser(read(fileName));
  const answer = solver(input, false)?.toString();
  console.log(`Attempting ${answer}`);

  const { attemptedSolutions, correctSolution } = solutionsFile[`part${part}`];
  if (attemptedSolutions.includes(answer || "") && !correctSolution) {
    console.log("Solution already attempted!");
    return;
  }
  attemptedSolutions.push(answer || "");
  const isCorrect = await checkAnswer(part, day, answer || "", correctSolution);
  if (isCorrect) {
    solutionsFile[`part${part}`].correctSolution = answer;
  }

  writeFileSync(`${dir}/solutions.json`, JSON.stringify(solutionsFile));
}

async function checkAnswer(
  part: number,
  day: string,
  answer: string,
  previous: string | null
) {
  if (previous !== null) {
    const prefix = answer === previous ? "Matches" : "Does not match";
    console.log(`${prefix} previous answer!`);
    return answer === previous;
  }
  const result = await fetch(
    `https://adventofcode.com/2023/day/${day}/answer`,
    {
      method: "POST",
      headers: {
        cookie: `session=${process.env.SESSION}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `level=${part}&answer=${answer}`,
    }
  );
  const body = await result.text();
  if (body.includes("not the right answer")) {
    console.log(`Wrong answer\n${body}`);
    return false;
  }
  console.log("Correct answer!");
  return true;
}
