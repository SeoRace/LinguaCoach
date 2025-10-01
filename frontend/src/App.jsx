import { NavLink, Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat.jsx'
import Vocab from './pages/Vocab.jsx'
import Review from './pages/Review.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">LinguaCoach</div>
          <div className="flex gap-4">
            <NavLink to="/" end className={({isActive})=>`px-3 py-1 rounded ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100'}`}>챗봇</NavLink>
            <NavLink to="/vocab" className={({isActive})=>`px-3 py-1 rounded ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100'}`}>단어장</NavLink>
            <NavLink to="/review" className={({isActive})=>`px-3 py-1 rounded ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100'}`}>복습</NavLink>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/vocab" element={<Vocab />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </main>
    </div>
  )
}



