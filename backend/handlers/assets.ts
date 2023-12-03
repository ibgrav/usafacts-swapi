import sirv from "sirv";
import { ServerRoute } from "../../types/backend";

export const assetsHandler: ServerRoute = (req, res, next) => {
  sirv("public", { maxAge: 31536000, immutable: true })(req, res, next);
};
