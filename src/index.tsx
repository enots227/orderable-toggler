import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App groups={[
      { title: 'Active', value: 1 },
      { title: 'Inactive', value: 0 }
    ]} items={[
      { title: 'a', value: 'a' },
      { title: 'b', value: 'b' },
      { title: 'c', value: 'c' },
      { title: 'd', value: 'a' },
      { title: 'e', value: 'e' },
      { title: 'f', value: 'f' },
      { title: 'g', value: 'g' },
      { title: 'h', value: 'h' },
      { title: 'i', value: 'i' },
    ]} defaultValue={[['a','b','c','g','h'],['d','e','f','i']]} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
