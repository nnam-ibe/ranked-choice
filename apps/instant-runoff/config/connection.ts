import getConfig from 'next/config';

const { database } = getConfig().serverRuntimeConfig;

const dbConnect = database.dbConnect;

export { dbConnect };
