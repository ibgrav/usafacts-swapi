import { within, expect } from "@storybook/test";
import { Meta, StoryObj } from "@storybook/react";
import { Loading } from "./loading";

const meta = {
  title: "Components/Loading",
  component: Loading
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const _default: Story = {
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByRole("alert");

    expect(element).toBeVisible();
  }
};
