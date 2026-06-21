import Home from '@/pages/home.page';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Home',
  component: Home,
  tags: ['autodocs'],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
