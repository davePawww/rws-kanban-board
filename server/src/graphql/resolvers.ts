import { eq, asc } from "drizzle-orm";
import { db, boards, columns, cards } from "../db/index.ts";

type Board = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

type Column = {
  id: string;
  boardId: string;
  title: string;
  position: number;
};

type Card = {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  createdAt: Date;
};

export const resolvers = {
  Query: {
    boards: async (): Promise<Board[]> =>
      db.select().from(boards).orderBy(asc(boards.createdAt)),

    board: async (_: unknown, { id }: { id: string }): Promise<Board | null> =>
      db
        .select()
        .from(boards)
        .where(eq(boards.id, id))
        .then((r) => r[0] ?? null),

    card: async (_: unknown, { id }: { id: string }): Promise<Card | null> =>
      db
        .select()
        .from(cards)
        .where(eq(cards.id, id))
        .then((r) => r[0] ?? null),
  },

  Mutation: {
    createBoard: async (
      _: unknown,
      { title }: { title: string },
    ): Promise<Board> =>
      db
        .insert(boards)
        .values({ title })
        .returning()
        .then((r) => r[0]),

    createColumn: async (
      _: unknown,
      { boardId, title }: { boardId: string; title: string },
    ): Promise<Column> => {
      const tally = await db
        .select()
        .from(columns)
        .where(eq(columns.boardId, boardId));
      const position = tally.length;
      return db
        .insert(columns)
        .values({ boardId, title, position })
        .returning()
        .then((r) => r[0]);
    },

    createCard: async (
      _: unknown,
      {
        columnId,
        title,
        description,
      }: { columnId: string; title: string; description?: string | null },
    ): Promise<Card> => {
      const tally = await db
        .select()
        .from(cards)
        .where(eq(cards.columnId, columnId));
      const position = tally.length;
      return db
        .insert(cards)
        .values({ columnId, title, description, position })
        .returning()
        .then((r) => r[0]);
    },

    updateCardPosition: async (
      _: unknown,
      {
        id,
        columnId,
        position,
      }: { id: string; columnId: string; position: number },
    ): Promise<Card> =>
      db
        .update(cards)
        .set({ columnId, position })
        .where(eq(cards.id, id))
        .returning()
        .then((r) => r[0]),

    deleteCard: async (
      _: unknown,
      { id }: { id: string },
    ): Promise<boolean> => {
      await db.delete(cards).where(eq(cards.id, id));
      return true;
    },
  },

  Board: {
    columns: async (parent: Board): Promise<Column[]> =>
      db
        .select()
        .from(columns)
        .where(eq(columns.boardId, parent.id))
        .orderBy(asc(columns.position)),
  },

  Column: {
    cards: async (parent: Column): Promise<Card[]> =>
      db
        .select()
        .from(cards)
        .where(eq(cards.columnId, parent.id))
        .orderBy(asc(cards.position)),
  },
};
