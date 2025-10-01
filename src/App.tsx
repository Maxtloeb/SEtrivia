import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/layouts/Layout'
import Quiz from '@/pages/Quiz'
import Debug from '@/pages/Debug' // ← make sure this line exists

const Page = (name: string, el: React.ReactNode) =>
  <Layout currentPageName={name}>{el}</Layout>

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={Page('Home', <div className="p-8">Home</div>)} />
        <Route path="/Home" element={Page('Home', <div className="p-8">Home</div>)} />
        <Route path="/Quiz" element={Page('Quiz', <Quiz />)} />
        <Route path="/Debug" element={Page('Debug', <Debug />)} />  {/* ← this line */}
      </Routes>
    </BrowserRouter>
  )
}
