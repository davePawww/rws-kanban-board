export const typeDefs = `#graphql
  type Board {
    id: ID!
    title: String!
    createdAt: String!
    columns: [Column!]!
  }

  type Column {
    id: ID!
    boardId: ID!
    title: String!
    position: Int!
    cards: [Card!]!
  }

  type Card {
    id: ID!
    columnId: ID!
    title: String!
    description: String
    position: Int!
    createdAt: String!
  }

  type Query {
    boards: [Board!]!
    board(id: ID!): Board
    card(id: ID!): Card
  }

  type Mutation {
    createBoard(title: String!): Board!
    createColumn(boardId: ID!, title: String!): Column!
    createCard(columnId: ID!, title: String!, description: String): Card!
    updateCardPosition(id: ID!, columnId: ID!, position: Int!): Card!
    deleteCard(id: ID!): Boolean!
  }
`;
