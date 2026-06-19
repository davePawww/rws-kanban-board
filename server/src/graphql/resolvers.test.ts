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

function mockInsertResult(result: unknown) {
  const returning = vi.fn().mockResolvedValue(result);
  const values = vi.fn().mockReturnValue({ returning });
  vi.mocked(db.insert).mockReturnValue({ values } as any);
  return { values, returning };
}

function mockUpdateResult(result: unknown) {
  const returning = vi.fn().mockResolvedValue(result);
  const where = vi.fn().mockReturnValue({ returning });
  const set = vi.fn().mockReturnValue({ where });
  vi.mocked(db.update).mockReturnValue({ set } as any);
  return { set, where, returning };
}

function mockDeleteResult() {
  const where = vi.fn().mockResolvedValue(undefined);
  vi.mocked(db.delete).mockReturnValue({ where } as any);
  return { where };
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

describe('Mutation', () => {
  describe('createBoard', () => {
    it('inserts a board with the given title', async () => {
      const newBoard = { id: 'board-3', title: 'New Board', createdAt: new Date('2026-01-03'), updatedAt: new Date('2026-01-03') };
      const { values } = mockInsertResult([newBoard]);

      const result = await resolvers.Mutation.createBoard(null, { title: 'New Board' });

      expect(values).toHaveBeenCalledWith({ title: 'New Board' });
      expect(result).toEqual(newBoard);
    });
  });

  describe('createColumn', () => {
    it('inserts a column with auto-calculated position', async () => {
      const existingColumns = [
        { id: 'col-1', boardId: 'board-1', title: 'Todo', position: 0 },
      ];
      const newColumn = { id: 'col-3', boardId: 'board-1', title: 'Done', position: 1 };
      mockSelectResult(existingColumns);
      const { values } = mockInsertResult([newColumn]);

      const result = await resolvers.Mutation.createColumn(null, { boardId: 'board-1', title: 'Done' });

      expect(values).toHaveBeenCalledWith({ boardId: 'board-1', title: 'Done', position: 1 });
      expect(result).toEqual(newColumn);
    });

    it('inserts first column at position 0 when board has no columns', async () => {
      const newColumn = { id: 'col-1', boardId: 'board-1', title: 'Todo', position: 0 };
      mockSelectResult([]);
      const { values } = mockInsertResult([newColumn]);

      const result = await resolvers.Mutation.createColumn(null, { boardId: 'board-1', title: 'Todo' });

      expect(values).toHaveBeenCalledWith({ boardId: 'board-1', title: 'Todo', position: 0 });
      expect(result).toEqual(newColumn);
    });
  });

  describe('createCard', () => {
    it('inserts a card with auto-calculated position', async () => {
      const existingCards = [
        { id: 'card-1', columnId: 'col-1', title: 'Task 1', description: null, position: 0, createdAt: new Date('2026-01-01') },
      ];
      const newCard = { id: 'card-3', columnId: 'col-1', title: 'Task 3', description: 'More work', position: 1, createdAt: new Date('2026-01-03') };
      mockSelectResult(existingCards);
      const { values } = mockInsertResult([newCard]);

      const result = await resolvers.Mutation.createCard(null, { columnId: 'col-1', title: 'Task 3', description: 'More work' });

      expect(values).toHaveBeenCalledWith({ columnId: 'col-1', title: 'Task 3', description: 'More work', position: 1 });
      expect(result).toEqual(newCard);
    });

    it('inserts first card at position 0 when column has no cards', async () => {
      const newCard = { id: 'card-1', columnId: 'col-1', title: 'First Card', description: null, position: 0, createdAt: new Date('2026-01-01') };
      mockSelectResult([]);
      const { values } = mockInsertResult([newCard]);

      const result = await resolvers.Mutation.createCard(null, { columnId: 'col-1', title: 'First Card', description: null });

      expect(values).toHaveBeenCalledWith({ columnId: 'col-1', title: 'First Card', description: null, position: 0 });
      expect(result).toEqual(newCard);
    });
  });

  describe('updateCardPosition', () => {
    it('updates card column and position', async () => {
      const updatedCard = { id: 'card-1', columnId: 'col-2', title: 'Task 1', description: 'Do thing', position: 0, createdAt: new Date('2026-01-01') };
      const { set, where } = mockUpdateResult([updatedCard]);

      const result = await resolvers.Mutation.updateCardPosition(null, { id: 'card-1', columnId: 'col-2', position: 0 });

      expect(set).toHaveBeenCalledWith({ columnId: 'col-2', position: 0 });
      expect(where).toHaveBeenCalledOnce();
      expect(result).toEqual(updatedCard);
    });

    it('returns undefined when card does not exist', async () => {
      const { set } = mockUpdateResult([]);

      const result = await resolvers.Mutation.updateCardPosition(null, { id: 'nonexistent', columnId: 'col-1', position: 0 });

      expect(set).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('deleteCard', () => {
    it('deletes a card and returns true', async () => {
      const { where } = mockDeleteResult();

      const result = await resolvers.Mutation.deleteCard(null, { id: 'card-1' });

      expect(where).toHaveBeenCalledOnce();
      expect(result).toBe(true);
    });
  });
});
