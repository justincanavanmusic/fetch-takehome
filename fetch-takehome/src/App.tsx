import SearchPage from "./components/SearchPage"
import LoginForm from "./components/LoginForm"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { createContext, useState } from "react"
export const GlobalContext = createContext({} as GlobalContextType)
export type GlobalContextType = {
  areYouLoggedIn: boolean
  setAreYouLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

function App() {
 

  const [areYouLoggedIn, setAreYouLoggedIn] = useState<boolean>(false)
  console.log('areYouLoggedIn', areYouLoggedIn)

  return (
    <GlobalContext.Provider value={{
      areYouLoggedIn,
      setAreYouLoggedIn
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
