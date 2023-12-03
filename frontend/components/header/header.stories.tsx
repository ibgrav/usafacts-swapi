import { within, expect } from "@storybook/test";
import { Meta, StoryObj } from "@storybook/react";
import { Header } from "./header";

const meta = {
  title: "Components/Header",
  component: Header
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

const title = "Star Wars Ship Cost Over Time";

export const _default: Story = {
  args: {
    title
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByRole("heading", { level: 1 });

    expect(element).toBeVisible();
    expect(element.innerText).toEqual(title);
  }
};
