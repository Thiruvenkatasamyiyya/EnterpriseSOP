import React from 'react'
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import Upload from './pages/Upload'
import Chat from './pages/Chat'
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/admin' element={<Upload/>}/>
          <Route path='/' element={<Chat/>}/>
        </Routes>
      </div>

    </Router>
  )
}

export default App