import { Router } from "express";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { health } from "./health";
import { compute } from "./compute";

export const router = Router();

router.get("/level1", level1);
router.get("/level2", level2);
router.get("/health", health);
router.get("/compute", compute);
