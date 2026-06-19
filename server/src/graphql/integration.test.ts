import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import type { ApolloServer } from '@apollo/server';
import { db } from '../db/index.ts';

vi.mock('../db/index.ts');

let app: Express;
let apolloServer: ApolloServer;

beforeAll(async () => {
  const mod = await import('../server.ts');
  apolloServer = mod.server;
  app = await mod.startServer();
}, 10_000);

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(async () => {
  await apolloServer?.stop();
  vi.restoreAllMocks();
});

describe('GraphQL API — Integration', () => {
  describe('health check', () => {
    it('GET /health returns OK', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 'OK',
        service: 'Kanban Board Service',
      });
    });
  });

  describe('boards query', () => {
    it('POST /graphql { boards } returns a list of boards', async () => {
      const mockBoards = [
        { id: 'board-1', title: 'My Board', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
      ];
      const orderByChain = vi.fn().mockResolvedValue(mockBoards);
      const fromChain = vi.fn().mockReturnValue({ orderBy: orderByChain });
      vi.mocked(db.select).mockReturnValue({ from: fromChain } as any);

      const res = await request(app)
        .post('/graphql')
        .send({ query: '{ boards { id title } }' });

      expect(res.status).toBe(200);
      expect(res.body.data.boards).toHaveLength(1);
      expect(res.body.data.boards[0].title).toBe('My Board');
    });
  });

  describe('createBoard mutation', () => {
    it('POST /graphql { createBoard } creates a board and returns it', async () => {
      const newBoard = {
        id: 'board-new', title: 'New Board',
        createdAt: '2026-06-19T00:00:00.000Z',
        updatedAt: '2026-06-19T00:00:00.000Z',
      };
      const returning = vi.fn().mockResolvedValue([newBoard]);
      const values = vi.fn().mockReturnValue({ returning });
      vi.mocked(db.insert).mockReturnValue({ values } as any);

      const res = await request(app)
        .post('/graphql')
        .send({ query: `mutation { createBoard(title: "New Board") { id title } }` });

      expect(res.status).toBe(200);
      expect(res.body.data.createBoard.title).toBe('New Board');
    });
  });

  describe('error handling', () => {
    it('POST /graphql returns errors for invalid queries', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query: '{ nonExistentField }' });

      expect(res.status).toBe(400);
    });
  });
});
