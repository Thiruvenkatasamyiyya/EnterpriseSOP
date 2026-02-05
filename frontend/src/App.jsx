import React from 'react'
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import Upload from './pages/Upload'
const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Upload/>}/>
        </Routes>
      </div>

    </Router>
  )
}

export default App