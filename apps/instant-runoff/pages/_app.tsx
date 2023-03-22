import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import PollIcon from '@mui/icons-material/Poll';
import Tooltip from '@mui/joy/Tooltip';

import './styles.css';
import VisuallyHidden from '../components/visually-hidden/visually-hidden';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Polls Polls Polls!</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <nav>
        <Link href="/">
          <VisuallyHidden>Home</VisuallyHidden>
          <Tooltip title="Home">
            <PollIcon
              sx={{ scale: '2', color: 'black', filter: 'invert(1)' }}
            />
          </Tooltip>
        </Link>
      </nav>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
