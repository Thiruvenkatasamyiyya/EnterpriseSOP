import React from 'react'
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import Upload from './pages/Upload'
import Chat from './pages/Chat'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
const App = () => {
  return (
    <Router>
      <div>
        <Toaster/>
        <Routes>
          <Route path='/admin' element={<Upload/>}/>
          <Route path='/' element={<Chat/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </div>

    </Router>
  )
}

export default App