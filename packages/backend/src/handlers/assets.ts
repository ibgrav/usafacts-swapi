import sirv from "sirv";
import { IS_PROD } from "../lib/constants";
import { ServerRoute } from "../types/backend";

export const assetsHandler: ServerRoute = (req, res, next) => {
  if (IS_PROD) {
    // if this is a production server, serve static assets from the public dir
    sirv("public", { maxAge: 31536000, immutable: true })(req, res, next);
  } else if (next) {
    // during development, expectation is that frontend assets are served by the vite server
    next();
  }
};
