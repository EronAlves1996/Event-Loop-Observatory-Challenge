import express from "express";

const app = express();

type Source = "SYNC" | "TIMEOUT" | "PROMISE_RESOLVE" | "NEXT_TICK";

const SOURCE: Record<Source, Source> = {
  NEXT_TICK: "NEXT_TICK",
  TIMEOUT: "TIMEOUT",
  PROMISE_RESOLVE: "PROMISE_RESOLVE",
  SYNC: "SYNC",
};

function createLog(source: Source, log: string) {
  return {
    timestamp: Date.now(),
    source,
    log,
  };
}

app.get("/level1", async (req, res) => {
  const logAggregator: Array<ReturnType<typeof createLog>> = [];
  logAggregator.push(createLog(SOURCE.SYNC, "executing sync code"));

  const p1 = new Promise<void>((res) =>
    setTimeout(() => {
      logAggregator.push(
        createLog(SOURCE.TIMEOUT, "executing from set timeout")
      );
      res();
    }, 0)
  );
  const p2 = new Promise<void>((res) => {
    res();
  }).then(() => {
    logAggregator.push(
      createLog(SOURCE.PROMISE_RESOLVE, "executing from promise resolve")
    );
  });
  const p3 = new Promise<void>((res) => {
    process.nextTick(() => {
      logAggregator.push(
        createLog(SOURCE.NEXT_TICK, "executing from next tick")
      );
      res();
    });
  });

  await Promise.all([p1, p2, p3]);

  res.statusCode = 200;
  res.write(logAggregator);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
