import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';
import env from 'dotenv';

env.config();

console.log('Starting in-memory MongoDB...');
const mongod = await MongoMemoryServer.create({
  instance: {
    launchTimeout: 120000,
  },
});
const uri = mongod.getUri();

console.log('In-memory MongoDB started at:', uri);

process.env.MONGODB_URI = uri;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-key-2026';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
process.env.PORT = process.env.PORT || '5174';

const server = spawn('npx', ['tsx', 'server/index.ts'], {
  env: { ...process.env },
  stdio: 'inherit',
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  mongod.stop();
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  mongod.stop();
  process.exit(0);
});
