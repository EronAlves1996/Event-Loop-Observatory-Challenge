import { Router } from "express";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { health } from "./health";
import { compute } from "./compute";
import { stats } from "./stats";

export const router = Router();

router.get("/level1", level1);
router.get("/level2", level2);

// The order of the routes are crucial for route matching and success of the test.
// Because Express uses sequential, regex matching against a list, a request resolution
// For health or stats can arrive can match before the compute match if they are last on
// route declaration
router.get("/stats", stats);
router.get("/health", health);
router.get("/compute", compute);
