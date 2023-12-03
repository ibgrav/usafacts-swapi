import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../frontend/**/*.stories.@(ts|tsx)"],
  // public-dev is for storybook-only public assets (such as msw or mocks)
  staticDirs: ["../public", "./public"],
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
