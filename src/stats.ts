import { Request, Response } from "express";
import { getLag } from "./get-lag";

export function stats(_: Request, res: Response) {
  const lag = getLag();

  res.send({
    loopLagMs: lag,
    status: lag > 50 ? "degraded" : "healthy",
  });
}
