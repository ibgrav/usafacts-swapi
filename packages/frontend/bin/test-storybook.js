//@ts-check

import { $ } from "zx";
import { exit } from "node:process";

/**
 * @type {import('zx').ProcessPromise[]}
 */
const processes = [];

// generate storybook-static
await $`pnpm -F frontend build.storybook`;

// these processes should run in the background, and be killed after testing is complete
processes.push($`pnpm -F frontend serve.storybook`);

try {
  // wait for the static server to be ready
  await $`pnpm -F frontend exec wait-on tcp:6006`;
  await $`pnpm -F frontend exec test-storybook --url http://0.0.0.0:6006`;
  // catch promises to ensure the processes are killed
} catch (e) {
  console.error(e);
}

// kill all stored processes
await Promise.all(processes.map((p) => p.kill()));

exit(0);
