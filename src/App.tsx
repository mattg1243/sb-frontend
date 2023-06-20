import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Splash from './components/pages/Splash';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Profile';
import LoadingPage from './components/pages/Loading';
import AboutPage from './components/pages/About';
import NotFound from './components/pages/NotFound';
import BaseLayout from './components/BaseLayout';
import AccountPage from './components/pages/Account';
import MobileRedirect from './components/pages/MobileRedirect';
import Contact from './components/pages/Contact';
import './index.css';
import VerifyEmail from './components/pages/VerifyEmail';
import Subscription from './components/pages/Subscription';
import UnderConstruction from './components/pages/UnderConstruction';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} index />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* MobileRedirect */}
          <Route path="/MobileRedirect" element={<MobileRedirect />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/subscriptions" element={<Subscription />} />
          <Route path="/underconstruction" element={<UnderConstruction />} />
          {/* this route handles the main single page app, with navbar and layout */}
          <Route path="/app" element={<BaseLayout />}>
            {/* TODO: disable invalid nav bar links in public routes */}
            {/* public routes */}
            <Route path="about" element={<AboutPage />} />
            <Route path="user" element={<Profile />} />
            {/* protected routes */}
            <Route path="dash" element={<Dashboard />} index />
            <Route path="loading" element={<LoadingPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
