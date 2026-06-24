import { gql } from '@/util/graphql';

export const BOARDS_QUERY = gql`
  query Boards {
    boards {
      id
      title
      createdAt
      columns {
        id
        boardId
        title
        position
        cards {
          id
          columnId
          title
          description
          position
          createdAt
        }
      }
    }
  }
`;

export const BOARD_QUERY = gql`
  query Board($id: ID!) {
    board(id: $id) {
      id
      title
      createdAt
      columns {
        id
        boardId
        title
        position
        cards {
          id
          columnId
          title
          description
          position
          createdAt
        }
      }
    }
  }
`;

export const CARD_QUERY = gql`
  query Card($id: ID!) {
    card(id: $id) {
      id
      columnId
      title
      description
      position
      createdAt
    }
  }
`;
