import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '.';

const meta = {
  title: 'Atom/Button',
  component: Button,
  parameters: { },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { 
    theme: 'dark',
    children: 'Button'
  },
};

export const Light: Story = {
  args: { 
    theme: 'light',
    children: 'Button'
  },
};
