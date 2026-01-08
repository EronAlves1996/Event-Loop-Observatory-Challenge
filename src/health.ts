import { Request, Response } from "express";

// We cannot measure the exact time a request has arrived.
// So, we measure the event loop lag to tell approximately
// the request latency. It's better measured by the client,
// but some factors might influence, like network or OS

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
