import { PropsWithChildren } from 'react';
import Head from 'next/head';
import styles from './Container.module.css';

const Container = ({ children }: PropsWithChildren<{}>) => {
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

      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <a
          href="https://dawchihliou.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          {'Built with 💙 by Daw-Chih Liou'}
        </a>
      </footer>
    </div>
  );
};

export default Container;
