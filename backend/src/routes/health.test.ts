import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';

describe('GET /api/health', () => {
  it('returns 200 with the process status and uptime', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toEqual({
      status: 'ok',
      uptime: expect.any(Number),
    });
  });
});
