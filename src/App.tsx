import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Splash from './components/pages/Splash';
import BaseLayout from './components/BaseLayout';
import './index.css';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<BaseLayout childComp={Login} />} />
          <Route path="/register" element={<BaseLayout childComp={Register} />} />
          <Route path="/dash" element={<BaseLayout childComp={Dashboard} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
