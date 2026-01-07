import { Router } from "express";
import { level1 } from "./level1";

export const router = Router();

router.get("/level1", level1);
