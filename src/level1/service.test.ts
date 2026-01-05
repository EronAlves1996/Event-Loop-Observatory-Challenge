import { SOURCE } from "./service";
import { describe, expect, it } from "@jest/globals";
import express from "express";
import { router } from "../routes";
import request from "supertest";

const app = express();
app.use(router);

// This test should occure in supertest because microtasks
// are executed differently in IO cycles and outside IO cycles
describe("test the return from event loop", () => {
  it("should return logs correctly", async () => {
    await request(app)
      .get("/level1")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        const arr = res.body;
        expect(Array.isArray(arr)).toBeTruthy();
        expect(arr.length).toBe(4);
        const [sync, nextTick, resolve, timeout] = arr;
        expect(sync?.source).toBe(SOURCE.SYNC);
        expect(nextTick?.source).toBe(SOURCE.NEXT_TICK);
        expect(resolve?.source).toBe(SOURCE.PROMISE_RESOLVE);
        expect(timeout?.source).toBe(SOURCE.TIMEOUT);
      });
  });
});
