import type { Theme } from '@/types/shared.types';
import { createContext, useContext } from 'react';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
  const ctx = useContext(ThemeProviderContext);

  if (ctx === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return ctx;
};
