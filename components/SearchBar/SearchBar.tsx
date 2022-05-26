import { memo, MouseEvent, useState, ChangeEventHandler, useRef } from 'react';
import styles from './SearchBar.module.css';

type SearchBarProps = {
  value: string;
  loading?: boolean;
  onChange: (value: string) => void;
  onSearch?: (event: MouseEvent<HTMLButtonElement>) => void;
};

function SearchBar({ value, loading, onChange, onSearch }: SearchBarProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.container}>
      <input
        value={value}
        onChange={handleChange}
        className={styles.input}
        placeholder="Enter GitHub username"
      />
      <button
        onClick={onSearch}
        className={loading ? styles.animate : undefined}
      >
        {loading && (
          <span role="img" aria-label="Hourglass with flowing sand">
            ⏳
          </span>
        )}
        {!loading && (
          <span role="img" aria-label="Telescope">
            🔭
          </span>
        )}
      </button>
    </div>
  );
}

export default memo(SearchBar);
