import * as os from 'node:os';

export function getBenchmarkEnvironment(): {
  nodeVersion: string;
  cpu: string;
} {
  return {
    nodeVersion: process.version,
    cpu: `${os.cpus()[0].model} (${os.cpus().length} cores, ${os.cpus()[0].speed} MHz)`,
  };
}

export function showBenchmarkEnvironment(): void {
  const {nodeVersion, cpu} = getBenchmarkEnvironment();
  console.log('[Benchmark Environment]');
  console.log(`  Node.js: ${nodeVersion}`);
  console.log(`  CPU: ${cpu}`);
  console.log('');
}
