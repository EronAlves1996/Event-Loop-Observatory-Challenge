import { Request, Response } from "express";

let lag = 0;
let checkpoint = performance.now();

setInterval(() => {
  const secondCheck = performance.now();
  lag = secondCheck - checkpoint;
  checkpoint = secondCheck;
}, 0);

export function health(req: Request, res: Response) {
  return res.send({
    status: "ok",
    latency: lag,
  });
}
