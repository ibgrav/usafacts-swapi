// import { within, expect } from "@storybook/test";
import { Meta, StoryObj } from "@storybook/react";
import { CostChart } from "./cost-chart";
import { mockCostChartProps } from "./cost-chart.mock";

const meta = {
  title: "Components/Cost Chart",
  component: CostChart
} satisfies Meta<typeof CostChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const _default: Story = {
  args: mockCostChartProps
  // play: ({ canvasElement }) => {
  // const canvas = within(canvasElement);
  // }
};
