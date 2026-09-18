import { Router, type Response } from 'express';

interface HealthResponse {
  status: 'ok';
  uptime: number;
}

export const healthRouter = Router();

healthRouter.get('/', (_req, res: Response<HealthResponse>) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
  });
});
