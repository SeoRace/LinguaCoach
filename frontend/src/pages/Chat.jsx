import { useEffect, useRef, useState } from 'react'

// modes removed (unused)

const languages = [
  { id: 'en', label: '영어' },
  { id: 'ja', label: '일본어' },
  { id: 'cn', label: '중국어' },
]

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem('chat_messages')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  // mode removed (unused)
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('chat_language') || 'en' } catch { return 'en' }
  })
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    try { localStorage.setItem('chat_messages', JSON.stringify(messages)) } catch {}
  }, [messages])

  useEffect(() => {
    try { localStorage.setItem('chat_language', language) } catch {}
  }, [language])

  async function send() {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    const res = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg.text, language })
    })
    const data = await res.json()
    const botMsg = { role: 'assistant', text: data.reply, system: data.system, correction: data.correction, alternatives: data.alternatives, pronunciation: data.pronunciation || '', userKorean: userMsg.text }
    setMessages(prev => [...prev, botMsg])
  }

  async function addToVocabFromBot(m){
    const term = m.correction || (Array.isArray(m.alternatives) ? m.alternatives[0] : '') || extractFront(m.text, language)
    const meaning = m.userKorean || ''
    if (!term) return
    // Save pronunciation only for cn/ja; ignore for en
    const pronunciation = language === 'cn' || language === 'ja' ? (m.pronunciation || '') : ''
    await fetch('/api/words', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ term, meaning, language, pronunciation }) })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 card h-[75vh] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1" value={language} onChange={e=>setLanguage(e.target.value)}>
            {languages.map(l=> <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
          <span className="text-sm text-gray-500">{languages.find(l=>l.id===language)?.label}로 단어를 번역해드립니다.</span>
          </div>
          <button className="text-sm text-gray-600 hover:text-red-600" onClick={()=> setMessages([])}>초기화</button>
        </div>
        <div className="flex-1 overflow-auto space-y-3 pr-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
              <div className={`max-w-[80%] whitespace-pre-wrap px-3 py-2 rounded-lg ${m.role==='user'?'bg-blue-600 text-white':'bg-gray-100'}`}>
                {m.text}
                {m.role==='assistant' && (
                  <div className="mt-2 text-xs text-gray-700">
                    <button className="underline" onClick={()=> addToVocabFromBot(m)}>단어 추가</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <input className="flex-1 border rounded px-3 py-2" placeholder="메시지를 입력하세요" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter') send() }} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={send}>전송</button>
        </div>
      </div>
      <div className="card h-[75vh] overflow-auto">
        <h3 className="font-semibold mb-2">시스템 안내</h3>
        <p className="text-sm text-gray-600">선택한 언어와 모드에 따라 문법 교정과 대체 표현을 제공합니다.</p>
      </div>
    </div>
  )
}

function extractFront(text, lang){
  // naive pick first word as term
  const word = text.split(/\s+/)[0]?.replace(/[^\p{L}\p{N}-]/gu,'') || 'word'
  return word
}

function extractMeaning(text, lang){
  // naive meaning extraction based on labels
  if (lang==='ja') return '意味(임시)'
  if (lang==='zh') return '意思(临时)'
  return 'meaning (temp)'
}


