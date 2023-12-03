import { $, type ProcessPromise } from "zx";
import { exit } from "node:process";

testStorybook().catch((error) => {
  console.error(error);
  exit(1);
});

async function testStorybook() {
  const processes: ProcessPromise[] = [];

  // generate storybook-static
  await $`pnpm build.storybook`;

  // these processes should run in the background, and be killed after testing is complete
  processes.push($`pnpm preview.storybook`);

  try {
    // wait for the static server to be ready
    await $`pnpm exec wait-on tcp:6006`;
    await $`pnpm exec test-storybook --url http://0.0.0.0:6006`;
    // catch promises to ensure the processes are killed
  } catch (e) {
    console.error(e);
  }

  // kill all stored processes
  await Promise.all(processes.map((p) => p.kill()));

  exit(0);
}
