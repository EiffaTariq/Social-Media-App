import React from 'react'
import ReactDOM from 'react-dom/client'
import { PostsProvider } from "./context/PostsContext.jsx";
import { StatusProvider } from "./context/StatusContext.jsx";
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <PostsProvider>
  <StatusProvider>
  <App />
  </StatusProvider>
  </PostsProvider>
  </React.StrictMode>,
)
