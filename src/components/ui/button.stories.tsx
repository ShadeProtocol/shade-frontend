import type { Meta, StoryObj } from "@storybook/nextjs";
import { ChevronRight, Trash2 } from "lucide-react";

import { Button } from "./button";

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

const sizes = ["default", "sm", "lg", "icon"] as const;

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    size: {
      control: "select",
      options: sizes,
    },
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          {size === "icon" ? <Trash2 /> : size}
        </Button>
      ))}
    </div>
  ),
};

export const AllCombinations: Story = {
  name: "All variants x sizes",
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="grid gap-6">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-2">
          <p className="text-sm font-semibold text-muted-foreground">
            {variant}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {sizes.map((size) => (
              <Button
                key={`${variant}-${size}`}
                {...args}
                variant={variant}
                size={size}
              >
                {size === "icon" ? <Trash2 /> : size}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { layout: "padded" },
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  args: { children: undefined },
  render: (args) => (
    <Button {...args}>
      Continue
      <ChevronRight />
    </Button>
  ),
};

export const AsChildLink: Story = {
  name: "asChild (renders an anchor)",
  args: { variant: "link", children: undefined },
  render: (args) => (
    <Button {...args} asChild>
      <a href="https://example.com">Visit the docs</a>
    </Button>
  ),
};
