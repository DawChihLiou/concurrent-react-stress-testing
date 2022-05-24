import { gql } from '@apollo/client';

interface User {
  id: string;
  location: string | null;
}

interface Connection {
  following: {
    nodes: User[];
  };
  followers: {
    nodes: User[];
  };
}

export interface UserConnectionsQuery {
  user: User & Connection;
}

export const USER_CONNECTIONS = gql`
  query GetUserConnections($login: String!) {
    user(login: $login) {
      id
      location
      following(first: 100) {
        nodes {
          id
          location
        }
      }
      followers(first: 100) {
        nodes {
          id
          location
        }
      }
    }
  }
`;
