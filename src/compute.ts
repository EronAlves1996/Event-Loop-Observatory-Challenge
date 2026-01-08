import { Request, Response } from "express";

export function compute(_: Request, res: Response) {
  const fib = [0, 1];

  // In thread per request, this would not block the event loop,
  // because it gonna run on its own thread and gonna be managed by the
  // kernel preemptively.
  // Here, all the jobs are cooperative, so, the user have to be
  // sure that this will not block the event loop
  for (let i = 1; i <= 100000; i++) {
    for (let k = 2; k <= i; k++) {}
  }

  res.send("OK");
}
