import React from 'react'
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import Upload from './pages/Upload'
import Chat from './pages/Chat'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import { useSelector } from 'react-redux'
import ProtectRouter from './components/ProtectRouter'
const App = () => {
    const {user} = useSelector((state) => state.auth)
  
  return (
    <Router>
      <div>
        <Toaster/>
        <Routes>
          <Route path='/admin' element={
           <ProtectRouter>
              <Upload/>
           </ProtectRouter>
           }/>
          <Route path='/' element={<Chat/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </div>

    </Router>
  )
}

export default App