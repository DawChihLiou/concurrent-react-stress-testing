import { gql } from '@apollo/client';

interface User {
  name: string;
  avatarUrl: string;
  bio: string;
  url: string;
  login: string;
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
      name
      avatarUrl
      bio
      url
      login
      location
      following(first: 100) {
        nodes {
          name
          avatarUrl
          bio
          url
          login
          location
        }
      }
      followers(first: 100) {
        nodes {
          name
          avatarUrl
          bio
          url
          login
          location
        }
      }
    }
  }
`;
