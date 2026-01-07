import { Request, Response } from "express";
import { readFile } from "node:fs";

type Phase = "IMMEDIATE" | "TIMEOUT" | "READ_FILE";

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
  const { promise: filePoromise, resolve: resolveFile } =
    Promise.withResolvers<void>();
  const { promise: immediatePromise, resolve: resolveImmediate } =
    Promise.withResolvers<void>();

  const { promise: timeoutProm, resolve: resolveTimeout } =
    Promise.withResolvers<void>();

  performance.clearMeasures();
  const p1 = performance.mark("before_file_reading");

  // In some cases, the file reading can happen under 1 ms. The measurements
  // marks was put to view this perspective
  setTimeout(() => {
    console.log("set timeout on file read");
    phases.push("TIMEOUT");
    resolveTimeout();
  }, 0);

  readFile("./package.json", (err, data) => {
    console.log("file readed");
    performance.mark("after_file_reading");
    console.log(
      "Elapsed time: " +
        performance.measure(
          "duration",
          "before_file_reading",
          "after_file_reading"
        ).duration
    );
    phases.push("READ_FILE");
    resolveFile();

    setImmediate(() => {
      console.log("set immediate file read");
      phases.push("IMMEDIATE");
      resolveImmediate();
    });
  });

  await Promise.all([immediatePromise, timeoutProm, filePoromise]);
  res.statusCode = 200;
  res.send(phases);
}
