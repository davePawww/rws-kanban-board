import BoardSelect from '@/components/layout/board-select';
import ThemeToggle from '@/components/layout/theme-toggle';

export default function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between bg-gray-900 px-4 py-2 shadow">
      <BoardSelect />
      <ThemeToggle />
    </header>
  );
}
