import { config } from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

config();

type SolveArgs<T, TResult1, TResult2> = {
  parser?: (input: string) => T;
  part1?: (input: T, isTest?: boolean) => TResult1 | Promise<TResult1>;
  testInput?: string;
  part1Tests?: [string | null, TResult1][];
  part2?: (input: T, isTest?: boolean) => TResult2 | Promise<TResult2>;
  part2Tests?: [string | null, TResult2][];
  onlyTests?: boolean;
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
  parser = (x) => x as T,
  part1,
  part1Tests,
  part2,
  testInput,
  part2Tests,
  onlyTests = false,
}: SolveArgs<T, TResult1, TResult2>) {
  const day = process.argv[2] ?? new Date().getDate().toString();
  const dir = `day${day}/`;

  for (const [part, solver, tests] of [
    [1, part1, part1Tests],
    [2, part2, part2Tests],
  ] as const) {
    if (!solver) continue;

    for (const [specificTestInput, testExpectedOutput] of tests || []) {
      const parsedTestInput = parser(specificTestInput ?? testInput);
      let testOutput = await solver(parsedTestInput, true);
      if (testOutput?.toString() !== testExpectedOutput.toString()) {
        console.error(
          `Test failed for day ${day} part ${part}:\nExpected\n${testExpectedOutput}\nGot\n${testOutput}\n`
        );
        return;
      }
    }
    console.log(
      `${tests?.length || "NO"} tests passed for day ${day} part ${part}`
    );

    if (onlyTests) continue;
    const input = parser(read(`${dir}/input.txt`));
    const answer = (await solver(input, false))?.toString();

    console.log(`Final answer: ${answer}`);

    const solutionsFile = JSON.parse(
      readFileSync(`${dir}/solutions.json`, "utf8")
    ) as Solutions;
    const { attemptedSolutions, correctSolution } =
      solutionsFile[`part${part}`];

    const alreadyCorrectlySubmitted = correctSolution != null;
    if (attemptedSolutions.includes(answer.toString()) || alreadyCorrectlySubmitted) {
      if (!alreadyCorrectlySubmitted) {
        console.log("Incorrect previously tried answer");
      } else {
        const prefix =
          answer === correctSolution.toString() ? "Matches" : "Does not match";
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
