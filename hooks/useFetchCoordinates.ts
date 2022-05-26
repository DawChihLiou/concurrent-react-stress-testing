import { useEffect, useState } from 'react';
import { UserConnectionsQuery } from '../services/userConnections';

type Coordinates = {
  origin: number[];
  destinations: { id: string; coordinates: number[] }[];
};

export function useFetchCoordinates(data: UserConnectionsQuery | undefined) {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    origin: [],
    destinations: [],
  });

  useEffect(() => {
    if (data) {
      setLoading(true);

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
          setCoordinates(json);
          setLoading(false);
        });
    }
  }, [data]);

  return { loading, coordinates };
}
