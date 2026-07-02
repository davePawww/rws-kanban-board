import { Moon02Icon, Sun02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useTheme } from '@/hooks/use-theme';

export default function ThemeToggle() {
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
      className="cursor-pointer text-white"
      onClick={handleThemeChange}
    />
  );
}
