import SearchPage from "./components/SearchPage"
import LoginForm from "./components/LoginForm"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import React from "react"


function App(): React.ReactElement {
  return (
    <Router>
      <>
        <div>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
      </>
    </Router>
  )
}

export default App
