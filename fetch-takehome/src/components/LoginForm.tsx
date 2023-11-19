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
    <div>
      <h2>Login</h2>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default LoginForm
