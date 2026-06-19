import App from '@/App';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'App',
  component: App,
  tags: ['autodocs'],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
