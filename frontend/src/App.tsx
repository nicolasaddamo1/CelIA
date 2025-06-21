import './App.css'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import { PrivateRoute } from './routes/PrivateRoute';
import Dashboard from './features/dashboard/Dashboard';

function App() {
  return (
    <div className="bg-purple-600">

      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* <Route path="/" element={<Login />} /> */}
        </Routes>
      </Router>    </div>
  )
}

export default App
