import SearchPage from "./components/SearchPage"
import LoginForm from "./components/LoginForm"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { createContext, useState } from "react"
export const GlobalContext = createContext({} as GlobalContextType)
export type GlobalContextType = {
  // areYouLoggedIn: boolean
  // setAreYouLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

function App() {


  return (
    <GlobalContext.Provider value={{

    }}>
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
    </GlobalContext.Provider>
  )
}

export default App
