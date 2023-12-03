import { Meta, StoryObj } from "@storybook/react";
import { Main } from "./main";

const meta = {
  title: "Components/Main",
  component: Main
} satisfies Meta<typeof Main>;

export default meta;

type Story = StoryObj<typeof meta>;

export const _default: Story = {
  args: {}
};
