import { Request, Response } from "express";
import { execute } from "./service";

export async function level2(_: Request, res: Response) {
  console.log("Executing level 1");

  res.statusCode = 200;
  res.send(await execute());
}
