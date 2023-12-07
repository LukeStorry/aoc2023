import caller from "caller";
import { config } from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { exit } from "process";

config();

type SolveArgs<T, TResult1, TResult2> = {
  parser?: (input: string) => T;
  part1?: (input: T, isTest?: boolean) => TResult1;
  part1Tests?: [string, TResult1][];
  part2?: (input: T, isTest?: boolean) => TResult2;
  part2Tests?: [string, TResult2][];
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
  part1Tests,
  part2,
  part2Tests,
  parser = (x) => x as T,
}: SolveArgs<T, TResult1, TResult2>) {
  const dir = dirname(caller());
  const day = dir.replace(/.*day/, "");

  const solutionsFile = JSON.parse(
    readFileSync(`${dir}/solutions.json`, "utf8")
  ) as Solutions;

  for (const [part, solver, tests] of [
    [1, part1, part1Tests],
    [2, part2, part2Tests],
  ] as const) {
    if (!solver) continue;

    for (const [testInput, testExpectedOutput] of tests || []) {
      const parsedTestInput = parser(testInput);
      const testOutput = solver(parsedTestInput, true)?.toString();
      if (testOutput !== testExpectedOutput.toString()) {
        console.error(
          `Test failed for day ${day} part ${part}:\nExpected\n${testExpectedOutput}\nGot\n${testOutput}\n`
        );
        return;
      }
    }

    console.log(
      `${tests?.length ?? 0} tests passed for day ${day} part ${part}`
    );
    // exit();
    const input = parser(read(`${dir}/input.txt`));
    const answer = solver(input, false)?.toString();

    console.log(`Final answer: ${answer}`);

    const { attemptedSolutions, correctSolution } =
      solutionsFile[`part${part}`];

    const alreadyCorrectlySubmitted = correctSolution != null;
    if (attemptedSolutions.includes(answer) || alreadyCorrectlySubmitted) {
      if (!alreadyCorrectlySubmitted) {
        console.log("Incorrect previously tried answer");
      } else {
        const prefix =
          answer === correctSolution ? "Matches" : "Does not match";
        console.log(`${prefix} correctly submitted ${correctSolution}!`);
      }
      continue;
    } else {
      attemptedSolutions.push(answer);
    }

    const isCorrect = await checkAnswer(part, day, answer || "");
    if (isCorrect) {
      solutionsFile[`part${part}`].correctSolution = answer;
    }

    writeFileSync(
      `${dir}/solutions.json`,
      JSON.stringify(solutionsFile, null, 2)
    );
  }
}

async function checkAnswer(part: number, day: string, answer: string) {
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

  if (body.includes(" already complete ")) {
    console.log("Something's gone wrone - this part is already complete!?");
    return false;
  }
  if (body.includes("too recently")) {
    console.error(`RETRY SUBMITTING`);
    console.error(`RETRY SUBMITTING`);
    console.error(`RETRY SUBMITTING`);
    console.error(`RETRY SUBMITTING`);
    console.error(`RETRY SUBMITTING`);
    console.error(`RETRY SUBMITTING`);
    console.error(`RETRY SUBMITTING`);
    console.error(`RETRY SUBMITTING`);
    return false;
    throw new Error(`Wait before submitting\n${body}`);
  }
  if (body.includes("not the right answer")) {
    console.log(`Wrong answer\n${body}`);
    return false;
  }
  console.log("Correct answer!");
  return true;
}
