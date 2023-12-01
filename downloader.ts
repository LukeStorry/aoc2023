import fs from "fs";
const download = async (day: number) => {
  await new Promise((resolve) => setTimeout(resolve, day * 100));
  const data = await fetch(`https://adventofcode.com/2022/day/${day}`).then(
    (res) => res.text()
  );
  const heading = /<h2>---(.*) ---<\/h2>/.exec(data)![1];
  const question = /<p>(.*)<\/p>\n<\/article>/.exec(data)![1];
  const filePath = `./day${day.toString().padStart(2, "0")}/README.md`;
  console.log(filePath);
  const file = fs.readFileSync(filePath).toString();
  var result = file
    .slice(file.indexOf("\n") + 2)
    .replace("# Info", heading)
    .replace("link", "Full Question")
    .replace("Task description: ", question + "\n\n");
  fs.writeFileSync(filePath, result);
};


for (let i = 1; i <= 25; i++) {
  download(i);
}
