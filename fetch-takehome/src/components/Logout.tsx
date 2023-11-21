import axios from "axios"
import { useNavigate } from "react-router-dom"
// import { useContext } from "react"
// import { GlobalContext } from "../App"

const LogOut = () => {
  const navigate = useNavigate()
  const handleLogout = async () => {
    // const navigate = useNavigate()
    // console.log('hello')
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.status) {
        console.log("Logout successful!")
        navigate("/")
        return response
      }
    } catch (error) {
      console.error("Logout unsuccessful!", error)
    }
  }

  return (
    <div className="absolute right-4">
      <button className="inline-block border-2 border-black px-2" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default LogOut
