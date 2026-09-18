import { app } from './app';

const DEFAULT_PORT = 4000;

const port = Number(process.env.PORT) || DEFAULT_PORT;

app.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Backend listening on port ${port}`);
});
