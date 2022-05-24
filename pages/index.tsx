import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useLazyQuery } from '@apollo/client';
import { Canvas } from '@react-three/fiber';
import Sphere from '../components/Sphere';
import Tube from '../components/Tube';
import {
  useEffect,
  useState,
  ChangeEvent,
  useTransition,
  useCallback,
  Suspense,
  KeyboardEvent,
} from 'react';
import { OrbitControls } from '@react-three/drei';
import {
  UserConnectionsQuery,
  USER_CONNECTIONS,
} from '../services/userConnections';
import Particle from '../components/Particle';

const Home: NextPage = () => {
  // input states
  const [username, setUsername] = useState<string>('');
  const [isPending, setPending] = useState(false);

  // trigger particles to recompute position and color
  const [trigger, setTrigger] = useState(false);

  // coordinates to render curves
  const [locs, setLocs] = useState<{
    origin: number[];
    destinations: { id: string; coordinates: number[] }[];
  }>({ origin: [], destinations: [] });

  const [, startTransition] = useTransition();

  // fetch GitHub user's followers and following users
  const [fetchUserConnections, { data, loading }] = useLazyQuery<
    UserConnectionsQuery
  >(USER_CONNECTIONS);

  // input handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleClick = useCallback(() => {
    if (username !== '') {
      fetchUserConnections({ variables: { login: username } });
    }
  }, [username]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && username !== '') {
        fetchUserConnections({ variables: { login: username } });
      }
    },
    [username],
  );

  // fetch coordinates when user connection data is updated
  useEffect(() => {
    if (data) {
      setPending(true);

      const origin = data.user.location || '';
      const destinations = [
        ...(data.user.followers?.nodes.map((n) => ({
          id: `flr-${n.id}`,
          location: n.location || '',
        })) ?? []),
        ...(data.user.following?.nodes.map((n) => ({
          id: `flg-${n.id}`,
          location: n.location || '',
        })) ?? []),
      ];

      fetch('/api/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destinations,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setLocs(json);
          setPending(false);
        });
    }
  }, [data]);

  // send a trigger to the particles to recompute in every second
  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => {
        setTrigger(!trigger);
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [trigger]);

  return (
    <div className={styles.container}>
      <Head>
        <title>React 18 Stress Test</title>
        <meta
          name="description"
          content="Stress testing React 18's concurrent features"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Input Field */}
        <div className={styles.inputContainer}>
          <input
            onChange={handleChange}
            value={username}
            className={styles.input}
            placeholder="Enter GitHub username"
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleClick}
            className={loading || isPending ? styles.animate : undefined}
          >
            {loading ||
              (isPending && (
                <span role="img" aria-label="Hourglass with flowing sand">
                  ⏳
                </span>
              ))}
            {!loading && !isPending && (
              <span role="img" aria-label="Telescope">
                🔭
              </span>
            )}
          </button>
        </div>
        {/* 3D Rendering */}
        <Canvas>
          <OrbitControls />
          <hemisphereLight args={['#ffffff', '#ffffff', 3]} />
          <Sphere position={[0, 0, 0]} />
          <Suspense fallback={null}>
            <mesh>
              {locs.destinations.map((dest, i) => (
                <Tube
                  key={dest.id}
                  coords={[...locs.origin, ...dest.coordinates]}
                />
              ))}
            </mesh>
            <Particle trigger={trigger} />
          </Suspense>
        </Canvas>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://dawchihliou.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          {'Build with 💙 by Daw-Chih Liou'}
        </a>
      </footer>
    </div>
  );
};

export default Home;
