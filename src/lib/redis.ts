import { Queue, Worker } from "bullmq";
import { pool } from "./db"

export const connection = {
    host: "localhost",
    port: 6379,
};

// Queue example
export const matchQueue = new Queue("matches", {connection});

// Delayed/retry jobs
let matchQueueScheduler: any;
try {
    const { QueueScheduler } = require("bullmq");
    matchQueueScheduler = new QueueScheduler("matches", { connection });
} catch (err) {
    console.warn("QueueScheduler not loaded in this environment", err);
}

// Worker example
export const matchWorker = new Worker(
    "matches",
    async (job) => {
        console.log("Processing job:", job.id, job.data);
    },
    { connection }
)