import { Request, Response } from "express";
import { getLag } from "./get-lag";

export function health(req: Request, res: Response) {
  return res.send({
    status: "ok",
    latency: getLag(),
  });
}
