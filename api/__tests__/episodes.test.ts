import request from 'supertest';
import app from '../src/index';

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /api/episodes', () => {
  it('returns 200 with episodes array', async () => {
    const res = await request(app).get('/api/episodes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('episodes');
    expect(Array.isArray(res.body.episodes)).toBe(true);
  });

  it('returns pagination metadata', async () => {
    const res = await request(app).get('/api/episodes');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('limit');
  });

  it('returns 12 episodes by default', async () => {
    const res = await request(app).get('/api/episodes');
    expect(res.body.episodes).toHaveLength(12);
  });

  it('respects limit query param', async () => {
    const res = await request(app).get('/api/episodes?limit=5');
    expect(res.body.episodes.length).toBeLessThanOrEqual(5);
  });

  it('each episode has required fields', async () => {
    const res = await request(app).get('/api/episodes');
    const episode = res.body.episodes[0];
    expect(episode).toHaveProperty('id');
    expect(episode).toHaveProperty('slug');
    expect(episode).toHaveProperty('title');
    expect(episode).toHaveProperty('type');
    expect(episode).toHaveProperty('streamUrl');
    expect(episode).toHaveProperty('thumbnailUrl');
    expect(['podcast', 'video']).toContain(episode.type);
  });
});

describe('GET /api/episodes/:slug', () => {
  it('returns 200 for a valid slug', async () => {
    const res = await request(app).get('/api/episodes/future-of-central-banking');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('slug', 'future-of-central-banking');
    expect(res.body).toHaveProperty('title', 'The Future of Central Banking');
  });

  it('returns 404 for a nonexistent slug', async () => {
    const res = await request(app).get('/api/episodes/nonexistent-episode');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Episode not found');
  });

  it('returns a video episode', async () => {
    const res = await request(app).get('/api/episodes/semiconductor-decade');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('video');
  });

  it('returns a podcast episode', async () => {
    const res = await request(app).get('/api/episodes/inside-the-ai-arms-race');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('podcast');
  });
});
