import { useEffect, useState } from 'react'

export default function Review(){
  const [cards, setCards] = useState([])
  const [flippedIds, setFlippedIds] = useState(() => {
    try {
      const raw = localStorage.getItem('review_flipped_ids')
      if (!raw) return new Set()
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return new Set(arr)
      return new Set()
    } catch { return new Set() }
  })

  async function load(){
    let attempt = 0
    const max = 5
    const delay = (ms)=> new Promise(r=>setTimeout(r, ms))
    while (attempt < max) {
      try {
        const res = await fetch('/api/review')
        const data = await res.json()
        setCards(data.cards)
        setFlippedIds(prev => {
          const next = new Set()
          data.cards.forEach(c => { if (prev.has(c.id)) next.add(c.id) })
          return next
        })
        return
      } catch (e) {
        attempt += 1
        await delay(300)
      }
    }
  }
  useEffect(()=>{ load() },[])
  useEffect(()=>{
    const onFocus = () => load()
    const onVisibility = () => { if (document.visibilityState === 'visible') load() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  },[])

  function toggle(id){
    setFlippedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem('review_flipped_ids', JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }

  // render grid of all cards

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.length === 0 ? (
        <div className="text-center col-span-full text-gray-500">단어가 없습니다. 챗봇에서 단어를 추가해 보세요.</div>
      ) : null}
      {cards.map(card => {
        const flipped = flippedIds.has(card.id)
        return (
          <div key={card.id} className="relative w-full h-48 [perspective:1000px]" onClick={()=>toggle(card.id)}>
            <div className={`absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${flipped? '[transform:rotateY(180deg)]':''}`}>
              <div className="card absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center text-2xl font-semibold">
                <div>{card.front}</div>
                {card.pronunciation && (
                  <div className="text-sm text-gray-500 mt-1">{card.pronunciation}</div>
                )}
              </div>
              <div className="card absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] flex items-center justify-center">
                <div className="text-center text-lg font-semibold">{card.back.meaning || ''}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


