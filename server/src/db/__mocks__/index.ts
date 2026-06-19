import { vi } from 'vitest';
import { boards, columns, cards } from '../schema.ts';
import type { Board, Column, Card } from '../schema.ts';

export { boards, columns, cards };
export type { Board, Column, Card };

export const db = {
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve([])),
      orderBy: vi.fn(() => Promise.resolve([])),
      limit: vi.fn(() => Promise.resolve([])),
      offset: vi.fn(() => Promise.resolve([])),
    })),
  })),
  insert: vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn(() => Promise.resolve([])),
    })),
  })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([])),
      })),
    })),
  })),
  delete: vi.fn(() => ({
    where: vi.fn(() => Promise.resolve([])),
  })),
};
