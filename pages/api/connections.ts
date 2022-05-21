// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../libs/apollo';
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
  follower: {
    nodes: User[];
  };
}

interface Data {
  data: User & Connection;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }
  const { login } = req.body;
  const response = await client.query<User & Connection>({
    query: gql`
      query GetUserConnections {
        user(login: ${login}) {
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
    `,
  });
  res.status(200).json(response);
}
