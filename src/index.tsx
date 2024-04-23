import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4';

// extend window object to include Cypress / Redux store for testing
declare global {
  interface Window {
    Cypress: any;
    store: object;
  }
}

ReactGA.initialize('G-ENBBTLTVNT', { gaOptions: { debug: process.env.NODE_ENV !== 'production' } });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// expose store when run in Cypress
if (window.Cypress) {
  window.store = store;
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
