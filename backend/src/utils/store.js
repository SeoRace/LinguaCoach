import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');
const wordsFile = path.join(dataDir, 'words.json');

export async function ensureDataFile() {
  await fs.ensureDir(dataDir);
  if (!(await fs.pathExists(wordsFile))) {
    await fs.writeJSON(wordsFile, { words: [] }, { spaces: 2 });
  }
}

export async function readWords() {
  await ensureDataFile();
  const data = await fs.readJSON(wordsFile);
  return data.words || [];
}

export async function writeWords(words) {
  await ensureDataFile();
  await fs.writeJSON(wordsFile, { words }, { spaces: 2 });
}



