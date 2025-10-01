export function getLanguageTag(code) {
  if (code === 'ja') return 'Japanese';
  if (code === 'cn') return 'Chinese';
  return 'English';
}

export function localizedLabels(code) {
  if (code === 'ja') return { corr: '訂正', alt: '別表現', pron: '発音' };
  if (code === 'cn') return { corr: '纠正', alt: '替代表达', pron: '拼音' };
  return { corr: 'Correction', alt: 'Alternative', pron: '' };
}



