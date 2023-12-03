// import { within, expect } from "@storybook/test";
import { Meta, StoryObj } from "@storybook/react";
import { CostChart } from "./cost-chart";

const meta = {
  title: "Components/Cost Chart",
  component: CostChart
} satisfies Meta<typeof CostChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const _default: Story = {};
