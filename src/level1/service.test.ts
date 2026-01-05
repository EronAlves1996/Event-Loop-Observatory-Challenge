import { execute, SOURCE } from "./service";
import { describe, expect, it } from "@jest/globals";

describe("test the return from event loop", () => {
  it("should return logs correctly", async () => {
    const [sync, nextTick, resolve, timeout] = await execute();
    expect(sync?.source).toBe(SOURCE.SYNC);
    expect(nextTick?.source).toBe(SOURCE.NEXT_TICK);
    expect(resolve?.source).toBe(SOURCE.PROMISE_RESOLVE);
    expect(timeout?.source).toBe(SOURCE.TIMEOUT);
  });
});
