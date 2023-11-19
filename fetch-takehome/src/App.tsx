import SearchPage from "./components/SearchPage"
import LoginForm from "./components/LoginForm"
// import './App.css'
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"

function App() {
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
