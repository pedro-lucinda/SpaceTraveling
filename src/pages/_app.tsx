import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
