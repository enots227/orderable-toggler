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
      { title: 'd', value: 'd' },
      { title: 'e', value: 'e' },
      { title: 'f', value: 'f' },
      { title: 'g', value: 'g' },
      { title: 'h', value: 'h' },
      { title: 'i', value: 'i' },
      { title: 'a2', value: 'a2' },
      { title: 'b2', value: 'b2' },
      { title: 'c2', value: 'c2' },
      { title: 'd2', value: 'd2' },
      { title: 'e2', value: 'e2' },
      { title: 'f2', value: 'f2' },
      { title: 'g2', value: 'g2' },
      { title: 'h2', value: 'h2' },
      { title: 'i2', value: 'i2' },
    ]} defaultValue={[['a','b','c','g','h','a2','b2','c2','d2','e2','f2','g2','h2','i2'],['d','e','f','i']]} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
