import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from "./context/AuthContext.jsx";
import { PostsProvider } from "./context/PostsContext.jsx";
import { StatusProvider } from "./context/StatusContext.jsx";
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <AuthProvider>
  <PostsProvider>
  <StatusProvider>
  <App />
  </StatusProvider>
  </PostsProvider>
  </AuthProvider>
  </React.StrictMode>,
)