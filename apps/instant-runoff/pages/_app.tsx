import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import PollIcon from '@mui/icons-material/Poll';
import { Tooltip } from '@chakra-ui/react';

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
          <Tooltip label="Home">
            <PollIcon
              sx={{ scale: '2', color: 'black', filter: 'invert(1)' }}
            />
          </Tooltip>
        </Link>
      </nav>
      <main className="app">
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </main>
    </>
  );
}

export default CustomApp;
