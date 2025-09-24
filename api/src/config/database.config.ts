const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const host = process.env.MONGODB_HOST || 'localhost';
const port = process.env.MONGODB_PORT || '27017';
const database = process.env.MONGODB_DATABASE || 'xiaoYoung';

const uri =
  username && password
    ? `mongodb://${username}:${password}@${host}:${port}/${database}`
    : `mongodb://${host}:${port}/${database}`;

export const databaseConfig = {
  uri,
  options: {
    authSource: 'admin',
  },
};
