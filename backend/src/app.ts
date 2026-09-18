import express from 'express';
import { errorHandler } from './middleware/error-handler';
import { healthRouter } from './routes/health';

// Builds the app without listening, so tests can import it without binding a
// port. src/server.ts is what starts it.
export const app = express();

app.use(express.json());

app.use('/api/health', healthRouter);

app.use(errorHandler);
