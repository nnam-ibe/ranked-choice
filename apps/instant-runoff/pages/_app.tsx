import React from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react';
import Head from 'next/head';
import Script from 'next/script';

import './styles.css';
import { AppLink } from '../components/app-link/app-link';
import { VisuallyHidden } from '../components/visually-hidden/visually-hidden';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Polls Polls Polls!</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Script
        src="https://kit.fontawesome.com/f941b82a31.js"
        crossOrigin="anonymous"
      ></Script>
      <nav>
        <AppLink href="/">
          <VisuallyHidden>Home</VisuallyHidden>
          <Tooltip label="Home">
            <i className="fa-solid fa-square-poll-vertical home-icon"></i>
          </Tooltip>
        </AppLink>
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
