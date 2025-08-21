import type { Request, Response } from 'express';
let promClient: typeof import('prom-client') | null = null;
try {
    // optionally require prom-client if installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    promClient = require('prom-client');
} catch (err) {
    promClient = null;
}

const USE_PROM = process.env.PROMETHEUS_ENABLED === 'true' && !!promClient;

const counters: Record<string, number> = {};

// Prom client counters map
const promCounters: Record<string, any> = {};

if (USE_PROM && promClient) {
    promClient.collectDefaultMetrics();
}

export function incMetric(name: string, by = 1) {
    if (USE_PROM && promClient) {
        if (!promCounters[name]) {
            promCounters[name] = new promClient.Counter({ name: `app_${name}`, help: name });
        }
        promCounters[name].inc(by);
    } else {
        counters[name] = (counters[name] || 0) + by;
    }
}

export function getMetric(name: string) {
    if (USE_PROM && promClient) {
        // prom client doesn't expose simple get, return 0 as fallback
        return 0;
    }
    return counters[name] || 0;
}

export function dumpMetrics() {
    return { ...counters };
}

export async function metricsHandler(_req: Request, res: Response) {
    if (USE_PROM && promClient) {
        const registry = promClient.register;
        res.set('Content-Type', registry.contentType);
        res.send(await registry.metrics());
        return;
    }
    res.json(dumpMetrics());
}

export default { incMetric, getMetric, dumpMetrics, metricsHandler };
