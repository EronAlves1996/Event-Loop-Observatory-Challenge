import { parentPort } from "worker_threads";

for (let i = 1; i <= 100000; i++) {
  for (let k = 2; k <= i; k++) {}
}

console.log("BEFORE");

parentPort?.postMessage("OK");
