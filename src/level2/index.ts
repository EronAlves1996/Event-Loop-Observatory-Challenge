import { Request, Response } from "express";
import { readFile } from "node:fs/promises";

type Phase = "IMMEDIATE" | "TIMEOUT" | "READ_FILE";

const expectedPhases: Array<Phase> = ["TIMEOUT", "READ_FILE", "IMMEDIATE"];

export async function level2(_: Request, res: Response) {
  console.log("Executing level 2");
  const phases: Array<Phase> = [];

  setImmediate(() => {
    console.log("set immediate file read");
    phases.push("IMMEDIATE");
  });

  setTimeout(() => {
    console.log("set timeout on file read");
    phases.push("TIMEOUT");
  });

  const fullfill = readFile("./README.md").then(() => {
    console.log("file readed");
    phases.push("READ_FILE");
  });

  await fullfill;

  res.statusCode = 200;
  res.send(
    JSON.stringify(phases) === JSON.stringify(expectedPhases)
      ? "File read completed in the expected phase"
      : "File completed in unexpected phase"
  );
}
