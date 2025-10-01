import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';
import 'dotenv/config';
import wordsRouter from './routes/words.js';
import reviewRouter from './routes/review.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/words', wordsRouter);
app.use('/api/review', reviewRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


