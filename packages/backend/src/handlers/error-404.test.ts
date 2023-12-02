import { expect, test } from "vitest";
import { inject } from "light-my-request";
import { error404Handler } from "./error-404";

test("404 Handler", async () => {
  const response = await inject(error404Handler, {
    method: "GET",
    url: "/404"
  });

  expect(response.statusCode).toBe(404);
  expect(response.body).toBe(JSON.stringify({ error: "not found" }));
});
