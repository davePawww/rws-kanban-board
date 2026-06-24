export const queryKeys = {
  boards: ['boards'] as const,
  board: (id: string) => ['boards', id] as const,
  card: (id: string) => ['cards', id] as const,
};
