import { Request, Response } from "express";
import { readFile } from "node:fs/promises";

type Phase = "IMMEDIATE" | "TIMEOUT" | "READ_FILE";

const expectedPhases: Array<Phase> = ["TIMEOUT", "READ_FILE", "IMMEDIATE"];

// The function is handled as part of poll phase, because, the callback
// is invoked as a result of 'connection arrived' event
export async function level2(_: Request, res: Response) {
  console.log("Executing level 2");
  const phases: Array<Phase> = [];

  // When we setImmediate here, we force the event loop
  // to go right to the next cycle. This callback here
  // will be executed on the 'check' phase. The next
  // event loop cycle will start on 'timers' phase, making
  // the timeout be logged first
  setImmediate(async () => {
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
  });
}
