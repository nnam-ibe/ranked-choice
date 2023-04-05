import Script from 'next/script';

export default function Head() {
  return (
    <>
      <title>Polls Polls Polls!</title>
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
      <Script
        src="https://kit.fontawesome.com/f941b82a31.js"
        crossOrigin="anonymous"
      ></Script>
    </>
  );
}
