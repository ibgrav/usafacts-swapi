import { test, expect } from "vitest";
import { Server } from "node:http";
import { createServer } from "./create-server";

test("create server", () => {
  const { server } = createServer();

  expect(server).toBeInstanceOf(Server);
});
