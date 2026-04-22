import Signup from './pages/Signup'
import Login from './pages/login'
import './App.css'
import Dashboard from './pages/dashboard'
import {Route,Routes} from 'react-router-dom'
import PrivateRoute from './components/privateroute'
function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  )
}

export default App;
