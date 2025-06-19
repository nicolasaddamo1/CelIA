import './App.css'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="bg-purple-600">

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>    </div>
  )
}

export default App
