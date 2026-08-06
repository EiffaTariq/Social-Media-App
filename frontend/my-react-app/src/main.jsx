import React from 'react'
import ReactDOM from 'react-dom/client'
import { PostsProvider } from "./context/PostsContext.jsx";
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostsProvider>
      <App />
    </PostsProvider>
  </React.StrictMode>,
)
