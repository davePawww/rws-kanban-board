import type { QueryClient } from '@tanstack/react-query';

export type RouterContext = {
  queryClient: QueryClient;
};

export type Theme = 'dark' | 'light' | 'system';
