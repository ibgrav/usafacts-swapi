import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../frontend/**/*.stories.@(ts|tsx)"],
  staticDirs: ["../public", "./public-dev"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: "@storybook/react-vite",
  core: {
    disableTelemetry: true,
    builder: "@storybook/builder-vite"
  },
  typescript: {
    check: false
  },
  docs: {
    autodocs: true
  }
};

export default config;
