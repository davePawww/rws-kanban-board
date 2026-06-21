import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/use-theme';
import { Moon02Icon, Sun02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2">
      <BoardSelect />
      <ThemeToggle />
    </header>
  );
}

function BoardSelect() {
  return (
    <Select defaultValue="Board 1">
      <SelectTrigger className="border-none text-xs">
        <div className="-space-y-1">
          <h1 className="text-foreground scroll-m-20 text-base font-semibold tracking-tight">rws-kanban-board</h1>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectGroup>
        <SelectContent position="popper">
          <SelectItem value="Board 1">Board 1</SelectItem>
          <SelectItem value="2">Board 2</SelectItem>
          <SelectItem value="3">Board 3</SelectItem>
        </SelectContent>
      </SelectGroup>
    </Select>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    if (theme === 'light') setTheme('dark');
    if (theme === 'dark') setTheme('light');
  };

  return (
    <HugeiconsIcon
      icon={theme === 'light' ? Moon02Icon : Sun02Icon}
      size={20}
      strokeWidth={1.5}
      className="cursor-pointer"
      onClick={handleThemeChange}
    />
  );
}
