import { Router } from 'express';
import { nanoid } from 'nanoid';
import { readWords, writeWords, ensureDataFile } from '../utils/store.js';

const router = Router();

router.get('/', async (_req, res) => {
  const words = await readWords();
  res.json({ words });
});

router.post('/', async (req, res) => {
  const { term, meaning, language = 'en', tags, pronunciation } = req.body || {};
  if (!term) {
    return res.status(400).json({ error: 'term is required' });
  }
  const words = await readWords();
  const newWord = {
    id: nanoid(),
    term,
    meaning: meaning || '',
    language,
    pronunciation: pronunciation || '',
    tags: Array.isArray(tags) ? tags : []
  };
  words.push(newWord);
  await writeWords(words);
  res.status(201).json(newWord);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const words = await readWords();
  const next = words.filter(w => w.id !== id);
  if (next.length === words.length) {
    return res.status(404).json({ error: 'Not found' });
  }
  await writeWords(next);
  res.json({ ok: true });
});

export default router;


