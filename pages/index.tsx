import type { NextPage } from 'next';
import { useLazyQuery } from '@apollo/client';
import { useState, useCallback, useMemo, startTransition } from 'react';
import {
  UserConnectionsQuery,
  USER_CONNECTIONS,
} from '../services/userConnections';
import Container from '../components/Container';
import SearchBar from '../components/SearchBar';
import Scene from '../components/Scene';
import { useFetchCoordinates } from '../hooks/useFetchCoordinates';
import { computeCoordinates } from '../utils/geo';

type FastSearchBarProps = {
  defaultValue: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
};

function FastSearchBar({
  defaultValue,
  loading,
  onChange,
  onSearch,
}: FastSearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (value: string) => {
    setValue(value);
    onChange(value);
  };

  return (
    <SearchBar
      value={value}
      loading={loading}
      onChange={handleChange}
      onSearch={onSearch}
    />
  );
}

const Home: NextPage = () => {
  const [username, setUsername] = useState<string>('');

  const vertices = useMemo(() => computeCoordinates(username.length), [
    username,
  ]);

  // fetch GitHub user's followers and following users
  const [
    fetchUserConnections,
    { data, loading: isUserConnectionsLoading },
  ] = useLazyQuery<UserConnectionsQuery>(USER_CONNECTIONS);

  // coordinates to render curves
  const { coordinates, loading: isCoordinatesLoading } = useFetchCoordinates(
    data,
  );

  const loading = useMemo(
    () => isUserConnectionsLoading || isCoordinatesLoading,
    [isUserConnectionsLoading, isCoordinatesLoading],
  );

  const handleChange = (username: string) => {
    startTransition(() => {
      setUsername(username);
    });
  };

  const handleSearch = useCallback(() => {
    if (username !== '') {
      fetchUserConnections({ variables: { login: username } });
    }
  }, [username]);

  return (
    <Container>
      <FastSearchBar
        defaultValue={username}
        loading={loading}
        onChange={handleChange}
        onSearch={handleSearch}
      />
      <Scene curveCoordinates={coordinates} vertices={vertices} />
    </Container>
  );
};

export default Home;
