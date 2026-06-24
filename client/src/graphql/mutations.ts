import { gql } from '@/util/graphql';

export const CREATE_BOARD = gql`
  mutation CreateBoard($title: String!) {
    createBoard(title: $title) {
      id
      title
    }
  }
`;

export const CREATE_COLUMN = gql`
  mutation CreateColumn($boardId: ID!, $title: String!) {
    createColumn(boardId: $boardId, title: $title) {
      id
      boardId
      title
      position
    }
  }
`;

export const CREATE_CARD = gql`
  mutation CreateCard($columnId: ID!, $title: String!, $description: String) {
    createCard(columnId: $columnId, title: $title, description: $description) {
      id
      columnId
      title
      description
      position
      createdAt
    }
  }
`;

export const UPDATE_CARD_POSITION = gql`
  mutation UpdateCardPosition($id: ID!, $columnId: ID!, $position: Int!) {
    updateCardPosition(id: $id, columnId: $columnId, position: $position) {
      id
      columnId
      position
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`;
