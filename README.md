# 📂 Challenge: The Event Loop Observatory

## 📝 Description

Welcome to the **Event Loop Observatory**. Your mission is to build a TypeScript/Node.js HTTP server from scratch that exposes specific endpoints to demonstrate and diagnose the internal behavior of the JavaScript Runtime.

As a senior engineer coming from a multi-threaded background (Java), you must prove you can handle the single-threaded nature of Node.js by managing the Event Loop effectively.

## 🎯 The Mission

You have **7 days** to complete this challenge, with a strict timebox of **2 hours per day** (~14 hours total). The project is divided into **5 Levels** (Dojos). You must start from an empty directory each day if you wish, or build upon the previous day's work.

### 🛠 Tech Stack

- **Runtime:** Node.js (Latest LTS)
- **Language:** TypeScript (strict mode enabled)
- **HTTP Server:** You may use `http` (native), `express`, or `fastify`. _Recommendation: Use `fastify` for its low overhead, but `http` module is acceptable for pure learning._
- **Testing:** Jest or Vitest.
- **No external logic libraries** (e.g., do not use `async` utility libraries like `async.js`).

---

## 🥋 Levels of Development

### 🟢 Level 1: The Order of Operations (The Basics)

_Goal: Prove you understand the difference between the Call Stack, Macrotasks, and Microtasks._

1.  **Requirement:** Create a server with a single endpoint: `GET /level1`.
2.  **Behavior:** When hit, this endpoint must execute a specific sequence of operations mixing synchronous code, `setTimeout` (Macrotask), `Promise.resolve` (Microtask), and `process.nextTick` (Microtask).
3.  **Output:** The endpoint must return a JSON object representing the exact order of execution logs.
4.  **Constraint:** You must force the execution order to be exactly: `Start -> NextTick -> Promise -> Timeout -> End`.
5.  **Acceptance Criteria:**
    - Unit test proves the array order in the JSON response matches the required sequence.

### 🟡 Level 2: The Puzzle of Phases

_Goal: Demonstrate deep understanding of the Event Loop phases (Timers vs. Poll vs. Check) and how dynamic scheduling affects execution order._

1.  **Requirement:** Create an endpoint `GET /level2`.
2.  **Behavior:** This endpoint must orchestrate three distinct operations and guarantee they log/execute in this specific order:
    1.  **`setTimeout`** (Timers Phase)
    2.  **`readFile`** (Poll Phase)
    3.  **`setImmediate`** (Check Phase)
3.  **Constraints:**
    - You **MUST** use `fs.readFile` (Callback style), **NOT** `fs.promises`.
    - You are strictly forbidden from using `await readFile()`. The file read must be asynchronous.
    - You **MUST NOT** schedule the `setImmediate` at the very beginning of the function execution.
4.  **The Challenge:**
    - In a standard loop, `setImmediate` often runs before `setTimeout`. You must manipulate the scheduling context to force `setImmediate` to wait until _after_ the file I/O cycle completes.
    - **Hint:** Think about _where_ you call `setImmediate()`. If you schedule it inside a specific callback, you can move it from the "current" check phase to the "next" check phase.
5.  **Acceptance Criteria:**
    - The endpoint returns a JSON array (e.g., `["TIMEOUT", "READ_FILE", "IMMEDIATE"]`).
    - The order is deterministic and matches the requirement exactly.
    - The solution does not block the main thread (no synchronous `fs.readFileSync`).

### 🟠 Level 3: The "Freeze" (The Senior Java Context)

_Goal: Experience and measure the pain of blocking the Event Loop._

1.  **Requirement:** Create two endpoints:
    - `GET /health`: A simple endpoint returning `{ status: 'ok', latency: <ms> }` instantly.
    - `GET /compute`: Calculates a large Fibonacci number (e.g., fib(45)) **synchronously** (blocking the main thread).
2.  **Behavior:**
    - Send a request to `/compute`.
    - Immediately send a request to `/health` (within the same second).
3.  **Constraint:** Do not use Workers yet. Let the block happen.
4.  **Acceptance Criteria:**
    - The `/health` endpoint must report a latency higher than 100ms (proving it was blocked by the `/compute` request).
    - A written explanation in the README on how this compares to a Java `ThreadPerRequest` model.

### 🔴 Level 4: The Lag Monitor (Diagnostics)

_Goal: Build a real-world tool to monitor Event Loop health._

1.  **Requirement:** Create a mechanism to track "Event Loop Lag" (the delay between scheduled timer execution and actual execution).
2.  **Behavior:** Expose an endpoint `GET /stats` that returns:
    ```json
    {
      "loopLagMs": 45,
      "status": "degraded"
    }
    ```
3.  **Constraint:** You cannot use external libraries like `event-loop-lag`. You must implement the logic using a simple `setInterval` or recursive `setTimeout` and measuring time drift.
4.  **Acceptance Criteria:**
    - Hitting the `/compute` (blocking) endpoint from Level 3 should cause the `/stats` endpoint to spike in `loopLagMs`.
    - If lag > 50ms, status is "degraded". If < 50ms, status is "healthy".

### 🟣 Level 5: The Liberation (Worker Threads)

_Goal: Fix the blocking issue using Node.js parallelism._

1.  **Requirement:** Refactor `/compute` from Level 3.
2.  **Behavior:** Offload the Fibonacci calculation to a **Worker Thread** (`worker_threads`).
3.  **Constraint:** The main thread must remain free. The `/health` endpoint must remain instant even while `/compute` is running.
4.  **Acceptance Criteria:**
    - Test proves concurrent requests to `/compute` and `/health` result in `/health` latency < 5ms.
    - The solution handles errors in the worker thread gracefully (500 error returned to client if worker crashes).

---

## 📋 General Rules & Constraints

1.  **Clean Code:** Principles (SOLID) apply. TypeScript interfaces must be used.
2.  **No `any`:** Strict typing is required.
3.  **Git History:** Commit frequently with meaningful messages (e.g., "feat: implement level 1 blocking endpoint").
4.  **Documentation:** Use JSDoc for complex functions involving timers or async logic.

## 🧪 Evaluation Criteria (For the Interviewer)

- **Understanding of Phases:** Does the candidate know why `setImmediate` runs after I/O but `setTimeout` might run before?
- **Microtask Priority:** Do they correctly identify that `process.nextTick` jumps the queue?
- **Blocking Awareness:** Do they recognize that CPU-intensive tasks require different handling in Node.js compared to Java?
- **Code Quality:** Is the TypeScript code clean, or is it a mess of nested callbacks (callback hell)?

## 🚀 How to Start

```bash
mkdir event-loop-observatory
cd event-loop-observatory
npm init -y
npm install typescript ts-node @types/node
npx tsc --init
# Create your src/index.ts and start Level 1!
```

---

## 🧠 Developer's Note (The "Aha!" Moment)

> _In Java, you might throw a `Runnable` into an `ExecutorService` to handle heavy load. In Node.js, the Event Loop is the executor, but it only has one thread. If you block it, the server freezes. This challenge forces you to learn when to let the Loop run (Microtasks vs Macrotasks) and when to get out of the Loop (Workers)._
