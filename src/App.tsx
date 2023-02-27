import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Splash from './components/pages/Splash';
import './index.css';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Profile';
import LoadingPage from './components/pages/Loading';
import AboutPage from './components/pages/About';
import NotFound from './components/pages/NotFound';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/user" element={<Profile />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
