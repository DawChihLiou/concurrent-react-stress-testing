import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { gql, useQuery } from '@apollo/client';
import { Canvas } from '@react-three/fiber';
import Sphere from '../components/sphere';

const USER_CONNECTIONS = gql`
  query GetUserConnections {
    user(login: "DawChihLiou") {
      name
      avatarUrl
      bio
      url
      login
      following(first: 100) {
        nodes {
          name
          avatarUrl
          bio
          url
          login
        }
      }
      followers(first: 100) {
        nodes {
          name
          avatarUrl
          bio
          url
          login
        }
      }
    }
  }
`;

const Home: NextPage = () => {
  const { loading, error, data } = useQuery(USER_CONNECTIONS);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Canvas>
          <hemisphereLight args={['#ffffff', '#ffffff', 3]} />
          <Sphere position={[0, 0, 0]} />
        </Canvas>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;