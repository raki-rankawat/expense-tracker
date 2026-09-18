import type { ErrorRequestHandler } from 'express';

interface ErrorResponse {
  error: string;
}

// The one place errors become responses. Every error body has the same shape:
// { "error": "<message>" }.
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // Too late to send our own response; let Express close the connection.
  if (res.headersSent) {
    next(err);
    return;
  }

  // Client errors raised by Express and its body parser (malformed JSON, body
  // too large) carry a 4xx status and a message marked safe to expose.
  if (err.expose === true && typeof err.status === 'number') {
    const body: ErrorResponse = { error: err.message };
    res.status(err.status).json(body);
    return;
  }

  // Anything else is unexpected: log it, keep the details off the wire.
  console.error(err);
  const body: ErrorResponse = { error: 'Internal server error' };
  res.status(500).json(body);
};
