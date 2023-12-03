import "../frontend/styles/global.css";

import { Loader, Parameters } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import { mswParameters } from "./msw";

// Initialize MSW
initialize();

export const loaders: Loader[] = [mswLoader];

export const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
  ...mswParameters
};
