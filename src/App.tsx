import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from './pages/Home'
import StoryCreator from './pages/StoryCreator'
import StoryReader from './pages/StoryReader'
import VoiceSettings from './pages/VoiceSettings'
import TextSettings from './pages/TextSettings'
import CharacterSelection from './pages/CharacterSelection'
import MobileVoiceTest from './pages/MobileVoiceTest'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-pink-50 to-yellow-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<StoryCreator />} />
          <Route path="/story" element={<StoryReader />} />
          <Route path="/voice-settings" element={<VoiceSettings />} />
          <Route path="/text-settings" element={<TextSettings />} />
          <Route path="/character-selection" element={<CharacterSelection />} />
          <Route path="/mobile-voice-test" element={<MobileVoiceTest />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  )
}

export default App
