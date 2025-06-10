import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from "react-router-dom";

import './App.css';
import HomePage from './pages/HomePage';
import MultiPlayer from './pages/Multiplayer'
import Learn from"./pages/Learn"
import WebSocketProvider from './context/WebSocketProvider';


const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/multiPlayer",
    element: <MultiPlayer />,
  },
  {
    path: "/learn",
    element: <Learn />,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>

  <WebSocketProvider>
  <RouterProvider router ={router} />

  </WebSocketProvider>

  </React.StrictMode>
);
