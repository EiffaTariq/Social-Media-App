import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from "./context/AuthContext.jsx";
import { PostsProvider } from "./context/PostsContext.jsx";
import { StatusProvider } from "./context/StatusContext.jsx";
import PostUpdateLoader from "./components/PostUpdateLoader";

import { UIProvider } from "./context/UIContext.jsx";
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <AuthProvider>
  <PostsProvider>
  <PostUpdateLoader />
  <StatusProvider>
  <UIProvider>
  <App />
  </UIProvider>
  </StatusProvider>
  </PostsProvider>
  </AuthProvider>
  </React.StrictMode>,
)