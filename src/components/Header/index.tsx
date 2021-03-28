/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router';
import styles from './header.module.scss';

export const Header = (): JSX.Element => {
  const router = useRouter();

  return (
    <header className={styles.headerContainer}>
      <img src="/Logo.svg" alt="Logo" onClick={() => router.push('/')} />
    </header>
  );
};
