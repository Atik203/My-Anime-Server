/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`App listening on port ${config.port}`);
    });
    seedSuperAdmin();
  } catch (error) {
    console.error('Error occurred: ', error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log('Shutting down the server due to Unhandled Promise Rejection');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('Shutting down the server due to Unhandled Promise Rejection');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
