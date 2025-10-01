import { Router } from 'express';
import OpenAI from 'openai';
import { getLanguageTag, localizedLabels } from '../utils/lang.js';

const router = Router();

const dummySystemPrompts = {
  en: {
    free: 'Let\'s practice English freely. I\'ll correct grammar and suggest alternatives.',
    scenario: 'Practice situational English conversations. I\'ll play roles and guide you.',
    exam: 'Prepare for exams. I\'ll ask questions and correct your answers.'
  },
  ja: {
    free: '自由に日本語を練習しましょう。文法を直して別の表現も提案します。',
    scenario: '状況別会話を練習しましょう。ロールプレイで案内します。',
    exam: '試験対策をしましょう。質問して答えを添削します。'
  },
  cn: {
    free: '我们自由练习中文。我会纠正语法并提供替代表达。必要时我会把你的句子翻译成中文。',
    scenario: '练习中文情景对话。我会进行角色扮演并引导你。如有需要会先翻译成中文。',
    exam: '进行中文考试准备。我会提问、必要时先翻译成中文，并纠正你的答案。'
  }
};

function buildDummyReply(userText, language, mode) {
  const system = dummySystemPrompts[language]?.[mode] || dummySystemPrompts.en.free;
  const correction = userText
    .replace(/\s+/g, ' ')
    .trim();
  const alt = userText.length > 0 ? `${userText} (alt)` : 'Hello!';
  return { system, correction, alternatives: [alt] };
}

router.post('/', async (req, res) => {
  const { message, language = 'en', mode = 'free' } = req.body || {};
  const useAI = Boolean(process.env.OPENAI_API_KEY);
  if (!useAI) {
    const result = buildDummyReply(String(message || ''), language, mode);
    let reply;
  switch (language) {
      case 'ja':
        reply = `訂正: ${result.correction}\n別表現: ${result.alternatives[0]}\n発音: `;
        break;
    case 'cn':
        reply = `纠正: ${result.correction}\n替代表达: ${result.alternatives[0]}\n拼音: `;
        break;
      default:
        reply = `Correction: ${result.correction}\nAlternative: ${result.alternatives[0]}`;
    }
    return res.json({ system: result.system, reply, correction: result.correction, alternatives: result.alternatives, pronunciation: '' });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const systemPrompt = dummySystemPrompts[language]?.[mode] || dummySystemPrompts.en.free;
    const langTag = getLanguageTag(language);
    const pronNote = language === 'ja' ? 'Provide pronunciation in Hiragana only.' : language === 'cn' ? 'Provide pronunciation in Hanyu Pinyin only (no tone marks acceptable, but tone numbers preferred).' : 'Do not include pronunciation.';
    const userInstruction = `You are a language tutor. Always respond in ${langTag}.
If the user's input is not in ${langTag}, first translate it into natural ${langTag} and then provide: 1) a corrected ${langTag} sentence; 2) one alternative ${langTag} expression. Never refuse; just translate then correct.
Also include a pronunciation line appropriate for the language. ${pronNote}
Format strictly as:\nCorrection: <text>\nAlternative: <text>\nPronunciation: <text or empty>`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `${systemPrompt}` },
        { role: 'user', content: `${userInstruction}\n\nUser: ${String(message || '')}` }
      ],
      temperature: 0.5
    });
    const content = completion.choices?.[0]?.message?.content || '';
    // Try to parse structured fields
    let correction = '';
    let alternative = '';
    let pronunciation = '';
    const corrMatch = content.match(/Correction:\s*([\s\S]*?)(?:\n|$)/i);
    const altMatch = content.match(/Alternative:\s*([\s\S]*?)(?=\nPronunciation:|\n$|$)/i);
    const pronMatch = content.match(/Pronunciation:\s*([\s\S]*?)(?:\n|$)/i);
    if (corrMatch) correction = corrMatch[1].trim();
    if (altMatch) alternative = altMatch[1].trim();
    if (pronMatch) pronunciation = pronMatch[1].trim();
    const alternatives = alternative ? [alternative] : [];
    // Build localized reply without any Translation lines
    const labels = localizedLabels(language);
    const parts = [`${labels.corr}: ${correction}`, `${labels.alt}: ${alternative || ''}`];
    if (labels.pron) parts.push(`${labels.pron}: ${pronunciation || ''}`);
    const reply = parts.join('\n').trim();
    return res.json({ system: systemPrompt, reply, correction, alternatives, pronunciation });
  } catch (err) {
    console.error('OpenAI error', err?.message);
    const result = buildDummyReply(String(message || ''), language, mode);
    const reply = `AI unavailable. Fallback.\nCorrection: ${result.correction}\nAlternative: ${result.alternatives[0]}`;
    return res.json({ system: result.system, reply, correction: result.correction, alternatives: result.alternatives });
  }
});

export default router;


