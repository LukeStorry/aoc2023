import { solve } from "../runner/typescript";
import {
  max,
  sum,
  groupBy,
  fromPairs,
  every,
  values,
  tail,
  keys,
  multiply,
} from "lodash";
import { lowestCommonMultiple } from "../utils";

type Parsed = {};

type Module = {
  name: string;
  destinations: string[];
} & (
  | { type: "broadcast" }
  | {
      type: "flip-flop";
      memory: boolean;
    }
  | {
      type: "conjunction";
      memory: { [key: string]: boolean }; // high = true, low = false
    }
);

function createModule(line: string): Module {
  let [name, output] = line.split(" -> ");
  const destinations = output.split(", ");

  if (name.startsWith("%")) {
    name = name.slice(1);
    return { name, type: "flip-flop", destinations, memory: false };
  }
  if (name.startsWith("&")) {
    name = name.slice(1);
    return { name, type: "conjunction", destinations, memory: {} };
  }
  return { name, type: "broadcast", destinations };
}

type ModuleMap = { [name: string]: Module };

function parser(input: string): ModuleMap {
  const allModules = input.split("\n").map<Module>(createModule);
  // Initialise the memory arrays
  allModules.forEach((module) => {
    if (module.type !== "conjunction") return;
    const incoming = allModules
      .filter(({ destinations: d }) => d.includes(module.name))
      .map(({ name }) => [name, false]);
    module.memory = fromPairs(incoming);
  });
  return fromPairs(allModules.map((module) => [module.name, module]));
}

function part1(moduleMap: ModuleMap): number {
  const [highs, lows] = run(moduleMap, 1000);
  return highs * lows;
}

function run(
  moduleMap: ModuleMap,
  maxButtonPresses: number,
  monitorHighPulseCycle?: string
) {
  let [highs, lows, buttonPresses] = [0, 0, 0];
  const pulseQueue: [string, string, boolean][] = [];
  let monitorHighPulseCycleStart: number;

  while (buttonPresses <= maxButtonPresses) {
    if (!pulseQueue.length) {
      buttonPresses++;
      pulseQueue.push(["button", "broadcaster", false]);
      continue;
    }
    const [from, to, isHigh] = pulseQueue.shift();

    if (isHigh) highs += 1;
    if (!isHigh) lows += 1;

    const module = moduleMap[to];
    if (!module) continue;
    
    let sendHigh;
    if (module.type === "flip-flop") {
      if (isHigh) continue;
      module.memory = !module.memory;
      sendHigh = module.memory;
    } else if (module.type === "conjunction") {
      module.memory = { ...module.memory, [from]: isHigh };
      sendHigh = !every(values(module.memory));
    } else if (module.type === "broadcast") {
      sendHigh = isHigh;
    }

    if (module.name == monitorHighPulseCycle && sendHigh) {
      if (monitorHighPulseCycleStart)
        return [monitorHighPulseCycleStart, buttonPresses];
      else monitorHighPulseCycleStart = buttonPresses;
    }

    module.destinations.forEach((to) =>
      pulseQueue.push([module.name, to, sendHigh])
    );
  }
  return [highs, lows];
}

function part2(moduleMap: ModuleMap): number {
  const final = values(moduleMap).find(({ destinations }) =>
    destinations.includes("rx")
  );
  if (!final || final.type !== "conjunction")
    throw new Error("No final conjunction");

  const triggerCycles = keys(final.memory)
    .map((trigger) => run(moduleMap, Infinity, trigger))
    .map(([start, end]) => end - start);

  return triggerCycles.reduce(lowestCommonMultiple);
}

solve({
  parser,
  part1,
  part2,
  part1Tests: [
    [
      "broadcaster -> a, b, c\n%a -> b\n%b -> c\n%c -> inv\n&inv -> a",
      32000000,
    ],
    [
      "broadcaster -> a\n%a -> inv, con\n&inv -> b\n%b -> con\n&con -> output",
      11687500,
    ],
  ],
});
