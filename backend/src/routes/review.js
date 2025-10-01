import { Router } from 'express';
import { readWords } from '../utils/store.js';

const router = Router();

router.get('/', async (_req, res) => {
  const words = await readWords();
  const cards = words.map(w => ({
    id: w.id,
    front: w.term,
    back: { meaning: w.meaning },
    language: w.language || 'en',
    pronunciation: w.pronunciation || ''
  }));
  res.json({ cards });
});

export default router;


