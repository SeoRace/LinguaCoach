import { useEffect, useState } from 'react'

export default function Vocab(){
  const [words, setWords] = useState([])

  async function load(){
    const res = await fetch('/api/words')
    const data = await res.json()
    setWords(data.words)
  }

  useEffect(()=>{ load() },[])

  async function remove(id){
    await fetch(`/api/words/${id}`, { method: 'DELETE' })
    setWords(prev => prev.filter(w=>w.id!==id))
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">내 단어장</h2>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-2">언어</th>
              <th className="py-2 px-2">단어</th>
              <th className="py-2 px-2">뜻</th>
              <th className="py-2 px-2">발음</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {words.map(w => (
              <tr key={w.id} className="border-b">
                <td className="py-2 px-2">{w.language}</td>
                <td className="py-2 px-2 font-medium">{w.term}</td>
                <td className="py-2 px-2">{w.meaning}</td>
                <td className="py-2 px-2 text-gray-500 text-xs">{w.pronunciation}</td>
                <td className="py-2 px-2 text-right">
                  <button className="text-red-600" onClick={()=>remove(w.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


