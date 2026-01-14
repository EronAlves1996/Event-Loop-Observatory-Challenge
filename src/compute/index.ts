import { Request, Response } from "express";
import path from "path";
import { Worker } from "worker_threads";

export async function compute(_: Request, res: Response) {
  // We need to made sure it works in ts-node, however, it won't
  // work in production on compiled environment
  const jsWorker = new Worker(path.resolve(__dirname, "./worker.js"));

  const message = await promisifyWorker(jsWorker).catch(async (err) => {
    if ("code" in err && err.code === "MODULE_NOT_FOUND") {
      const tsWorker = new Worker(path.resolve(__dirname, "./worker.ts"));
      return await promisifyWorker(tsWorker);
    }

    return Promise.reject(err);
  });

  res.send(message);
}

function promisifyWorker(w: Worker) {
  return new Promise((res, rej) => {
    w.on("message", res);
    w.on("error", rej);
    w.on("exit", (code) => {
      if (code !== 0) {
        rej(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}
