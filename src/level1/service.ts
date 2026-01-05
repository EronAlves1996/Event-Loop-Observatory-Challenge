type Source = "SYNC" | "TIMEOUT" | "PROMISE_RESOLVE" | "NEXT_TICK";

export const SOURCE: Record<Source, Source> = {
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

export async function execute() {
  const logAggregator: Array<ReturnType<typeof createLog>> = [];
  logAggregator.push(createLog(SOURCE.SYNC, "executing sync code"));

  const p1 = new Promise<void>((res) =>
    setTimeout(() => {
      console.log("executing timers phase");
      logAggregator.push(
        createLog(SOURCE.TIMEOUT, "executing from set timeout")
      );
      res();
    }, 0)
  );
  const p2 = new Promise<void>((res) => {
    res();
  }).then(() => {
    console.log("executing pending callbacks phase");

    logAggregator.push(
      createLog(SOURCE.PROMISE_RESOLVE, "executing from promise resolve")
    );
  });
  const p3 = new Promise<void>((res) => {
    process.nextTick(() => {
      console.log("executing on next tick phase");

      logAggregator.push(
        createLog(SOURCE.NEXT_TICK, "executing from next tick")
      );
      res();
    });
  });

  await Promise.all([p1, p2, p3]);
  return logAggregator;
}
