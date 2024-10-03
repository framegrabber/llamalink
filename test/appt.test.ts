import request from 'supertest';
import app from '../src/app';

describe('File Sharing App', () => {
  it('should return 200 OK for the root path', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

