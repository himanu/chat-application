import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LoaderContextProvider } from './Contexts/LoaderContext';
import { AuthContextProvider } from './Contexts/AuthContext';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoaderContextProvider>
      <AuthContextProvider>
        <App />
        <ToastContainer />
      </AuthContextProvider>
    </LoaderContextProvider>
  </React.StrictMode>
);

