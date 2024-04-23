import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { ConfigProvider } from 'antd';
// import useWebSocket from 'react-use-websocket';
// import { socketUrl } from './config/routing';
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
import ResetPasswordPage from './components/pages/ResetPassword';
import FAQ from './components/pages/FAQ';
// import { WebSocketMessage } from 'react-use-websocket/dist/lib/types';
// import { getUserIdFromLocalStorage } from './utils/localStorageParser';
import LicensedBeatsPage from './components/pages/LicensedBeats';
import BeatPage from './components/pages/Beat';
import SearchPage from './components/pages/Search';

function App() {
  // const userId = getUserIdFromLocalStorage();
  // websocket connection
  // const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
  //   onOpen: () => {
  //     console.log('Websocket communication established!');
  //     if (userId) {
  //       sendMessage(userId as WebSocketMessage);
  //     }
  //   },
  //   onClose: () => {
  //     console.log('Websocket connection closed.');
  //   },
  //   onMessage: (event) => {
  //     console.log(event);
  //     // processMessages(event);
  //   },
  // });

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
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/subscriptions" element={<Subscription />} />
          <Route path="/underconstruction" element={<UnderConstruction />} />
          <Route path="/faq" element={<FAQ />} />
          {/* this route handles the main single page app, with navbar and layout */}
          <Route path="/app" element={<BaseLayout />}>
            {/* TODO: disable invalid nav bar links in public routes */}
            {/* public routes */}
            <Route path="about" element={<AboutPage />} />
            <Route path="user" element={<Profile />} />
            <Route path="beat" element={<BeatPage />} />
            {/* protected routes */}
            <Route path="dash" element={<Dashboard />} index />
            <Route path="search" element={<SearchPage />} />
            <Route path="loading" element={<LoadingPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="licensed-beats" element={<LicensedBeatsPage />} />
          </Route>
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
