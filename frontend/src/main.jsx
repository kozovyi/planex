import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { store } from './redux/app/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter> {/* ✅ Обгортає App */}
          <App />
        </BrowserRouter>
      </DndProvider>
    </Provider>
  </React.StrictMode>
)
