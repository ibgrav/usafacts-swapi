import { test, expect } from "vitest";
import { Server } from "node:http";
import { inject } from "light-my-request";
import { createServer } from "./create-server";

test("create server", async () => {
  const { dispatch, server } = createServer();

  expect(server).toBeInstanceOf(Server);

  const res = await inject(dispatch, { method: "GET", url: "/" });

  expect(res.statusCode).toBe(404);
});
