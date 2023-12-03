import { Meta, StoryObj } from "@storybook/react";
import { App } from "./app";

const meta = {
  title: "Components/App",
  component: App
} satisfies Meta<typeof App>;

export default meta;

type Story = StoryObj<typeof meta>;

export const _default: Story = {
  args: {}
};
