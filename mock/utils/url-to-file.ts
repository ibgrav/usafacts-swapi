import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * This function is used to create mock data from an api call.
 * Will create a directory structure based on the url and write the data to a json file.
 */
export async function urlToFile(url: string, data: unknown) {
  let path = url.replace("https://", "");
  if (path.startsWith("/")) path = path.slice(1);
  if (path.endsWith("/")) path = path.slice(0, -1);

  const paths = path.split("/");
  const filename = paths.pop();
  const dir = join(process.cwd(), "mock", ...paths);

  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/${filename}.json`, JSON.stringify(data, null, 2), "utf-8");
}
