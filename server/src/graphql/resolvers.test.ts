import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '../db/index.ts';
import { resolvers } from './resolvers.ts';

vi.mock('../db/index.ts');

const mockBoards = [
  { id: 'board-1', title: 'My Board', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') },
  { id: 'board-2', title: 'Second Board', createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02') },
];

const mockColumns = [
  { id: 'col-1', boardId: 'board-1', title: 'Todo', position: 0 },
  { id: 'col-2', boardId: 'board-1', title: 'In Progress', position: 1 },
];

const mockCards = [
  { id: 'card-1', columnId: 'col-1', title: 'Task 1', description: 'Do thing', position: 0, createdAt: new Date('2026-01-01') },
  { id: 'card-2', columnId: 'col-1', title: 'Task 2', description: null, position: 1, createdAt: new Date('2026-01-02') },
];

beforeEach(() => {
  vi.clearAllMocks();
});

function mockSelectResult(result: unknown) {
  const chain = {
    where: vi.fn().mockResolvedValue(result),
    orderBy: vi.fn().mockResolvedValue(result),
  };
  const from = vi.fn().mockReturnValue(chain);
  vi.mocked(db.select).mockReturnValue({ from } as any);
  return { from, chain };
}

function mockSelectWithWhereThenOrderBy(result: unknown) {
  const chain = {
    where: vi.fn().mockReturnValue({
      orderBy: vi.fn().mockResolvedValue(result),
    }),
    orderBy: vi.fn().mockResolvedValue(result),
  };
  const from = vi.fn().mockReturnValue(chain);
  vi.mocked(db.select).mockReturnValue({ from } as any);
  return { from, chain };
}

describe('Query', () => {
  describe('boards', () => {
    it('returns all boards ordered by creation date', async () => {
      const { chain } = mockSelectResult(mockBoards);

      const result = await resolvers.Query.boards();

      expect(result).toEqual(mockBoards);
      expect(chain.orderBy).toHaveBeenCalledOnce();
    });
  });

  describe('board', () => {
    it('returns a board by id', async () => {
      const { chain } = mockSelectResult([mockBoards[0]]);

      const result = await resolvers.Query.board(null, { id: 'board-1' });

      expect(result).toEqual(mockBoards[0]);
      expect(chain.where).toHaveBeenCalledOnce();
    });

    it('returns null when board not found', async () => {
      mockSelectResult([]);

      const result = await resolvers.Query.board(null, { id: 'nonexistent' });

      expect(result).toBeNull();
    });
  });

  describe('card', () => {
    it('returns a card by id', async () => {
      const mockCard = {
        id: 'card-1',
        columnId: 'col-1',
        title: 'Test Card',
        description: 'A test card',
        position: 0,
        createdAt: new Date('2026-01-01'),
      };
      const { chain } = mockSelectResult([mockCard]);

      const result = await resolvers.Query.card(null, { id: 'card-1' });

      expect(result).toEqual(mockCard);
      expect(chain.where).toHaveBeenCalledOnce();
    });

    it('returns null when card not found', async () => {
      mockSelectResult([]);

      const result = await resolvers.Query.card(null, { id: 'nonexistent' });

      expect(result).toBeNull();
    });
  });
});

describe('Board', () => {
  describe('columns', () => {
    it('returns columns for a board', async () => {
      const { chain } = mockSelectWithWhereThenOrderBy(mockColumns);

      const result = await resolvers.Board.columns(mockBoards[0] as any);

      expect(result).toEqual(mockColumns);
      expect(chain.where).toHaveBeenCalledOnce();
    });

    it('returns empty array when board has no columns', async () => {
      const { chain } = mockSelectWithWhereThenOrderBy([]);

      const result = await resolvers.Board.columns(mockBoards[0] as any);

      expect(result).toEqual([]);
      expect(chain.where).toHaveBeenCalledOnce();
    });
  });
});

describe('Column', () => {
  describe('cards', () => {
    it('returns cards for a column', async () => {
      const { chain } = mockSelectWithWhereThenOrderBy(mockCards);

      const result = await resolvers.Column.cards({ id: 'col-1' } as any);

      expect(result).toEqual(mockCards);
      expect(chain.where).toHaveBeenCalledOnce();
    });

    it('returns empty array when column has no cards', async () => {
      const { chain } = mockSelectWithWhereThenOrderBy([]);

      const result = await resolvers.Column.cards({ id: 'col-1' } as any);

      expect(result).toEqual([]);
      expect(chain.where).toHaveBeenCalledOnce();
    });
  });
});
