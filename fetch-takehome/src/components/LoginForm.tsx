import { useState } from "react"
import axios from "axios"
import { AxiosResponse } from "axios"
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response: AxiosResponse<any, any> = await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          name: name,
          email: email,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      console.log("response", response)
      if (response.status) {
        console.log("Login successful!")
        navigate("/search")
      } else {
        console.error("Login failed")
      }
    } catch (error) {
      console.error("Error during login:", error)
    }
  }

  return (
    <div className="flex flex-col items-center mt-8 min-h-screen">
      <div className="w-[80%] border-2 border-black flex flex-col items-center xs:w-[400px]">
      <h2 className="mb-4">Login</h2>
      <label>Name:</label>
      <input
      className="border-2 border-black"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <label>Email:</label>
      <input
         className="border-2 border-black"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button
      className="border-2 px-1 mb-2 border-black"
       onClick={handleLogin}>Submit</button>
      </div>
    </div>
  )
}

export default LoginForm
