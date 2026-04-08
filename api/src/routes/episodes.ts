import { Router, Request, Response } from 'express';
import { episodes } from '../data/episodes';

const router = Router();

// GET /api/episodes?page=1&limit=12
router.get('/', (_req: Request, res: Response) => {
  const page = parseInt(_req.query.page as string) || 1;
  const limit = parseInt(_req.query.limit as string) || 12;
  const start = (page - 1) * limit;
  const paginated = episodes.slice(start, start + limit);
  res.json({
    episodes: paginated,
    total: episodes.length,
    page,
    limit,
  });
});

// GET /api/episodes/:slug
router.get('/:slug', (req: Request, res: Response) => {
  const episode = episodes.find((e) => e.slug === req.params.slug);
  if (!episode) {
    res.status(404).json({ error: 'Episode not found' });
    return;
  }
  res.json(episode);
});

export default router;
