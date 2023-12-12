import React, { useState } from "react"
import axios from "axios"
import { AxiosResponse } from "axios"
import { useNavigate } from "react-router-dom"

const LoginForm: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  //email validation

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const startDomainRegex = /^[a-zA-Z0-9!#$%&'*+-/=?^_`]/
  const endDomainRegex = /@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i
  const [emailMessagesState, setEmailMessagesState] = useState<string[]>([])
  const emailMessagesArr: string[] = []
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false)
  const [emailDisplay, setEmailDisplay] = useState<boolean>(false)
  const emailMessageObj = {
    noInput: "-Email required.",
    startDomain: "-Email must include email name",
    endDomain: `-Email must include domain ("gmail.com", "yahoo.com").`,
    atSymbol: "-Email must include @.",
    tld: `-Email must include domain ext (".com", ".net", etc)`,
  }
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false)
  const [usernameDisplay, setUsernameDisplay] = useState<boolean>(false)

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

      if (response.status) {
        navigate("/search")
      } else {
        console.error("Login failed")
      }
    } catch (error) {
      console.error("Error during login:", error)
    }
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (e.target.value.length === 0) {
      emailMessagesArr.push(emailMessageObj.noInput)
      setEmailMessagesState(emailMessagesArr)
    }
    if (e.target.value.length > 0) {
      let filteredArr = emailMessagesArr.filter(
        (message) => message !== "-Email required."
      )
      setEmailMessagesState(filteredArr)

      if (!e.target.value.includes("@")) {
        emailMessagesArr.push(emailMessageObj.atSymbol)
        setEmailMessagesState(emailMessagesArr)
      }
      if (e.target.value.includes("@")) {
        let filteredArr = emailMessagesArr.filter(
          (message) => message === "-Email must include @."
        )
        setEmailMessagesState(filteredArr)
      }
      if (!startDomainRegex.test(e.target.value)) {
        emailMessagesArr.push(emailMessageObj.startDomain)
        setEmailMessagesState(emailMessagesArr)
      }
      if (startDomainRegex.test(e.target.value)) {
        let filteredArr = emailMessagesArr.filter(
          (message) => message !== "Must include email name"
        )
        setEmailMessagesState(filteredArr)
      }
      if (!endDomainRegex.test(e.target.value)) {
        emailMessagesArr.push(emailMessageObj.endDomain)
        setEmailMessagesState(emailMessagesArr)
      }
      if (endDomainRegex.test(e.target.value)) {
        let filteredArr = emailMessagesArr.filter(
          (message) =>
            message !== `-Email must include domain ("gmail.com", "yahoo.com").`
        )
        setEmailMessagesState(filteredArr)
      }
    }

    if (!e.target.value.match(emailRegex)) {
      setIsEmailValid(false)
    } else {
      setIsEmailValid(true)
    }
  }

  const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)

    if (e.target.value.length === 0) {
      setIsUsernameValid(false)
    } else {
      setIsUsernameValid(true)
    }
  }
  const handleUsernameDisplay = () => {
    setUsernameDisplay(true)
  }

  const handleEmailDisplay = () => {
    if (!isEmailValid) {
      emailMessagesArr.push(emailMessageObj.noInput)
    }
    setEmailMessagesState(emailMessagesArr)
    setEmailDisplay(true)
  }

  return (
    <div className="flex flex-col items-center mt-8 min-h-screen">
      <div className="w-[80%] border-2 border-black flex flex-col items-center xs:w-[400px] sm:w-[500px] xs:text-[1.2rem] sm:text-[1.4rem] md:w-[600px] md:text-[1.5rem] lg:w-[750px] lg:text-[1.8rem]">
        <h2 className="mb-4">Login</h2>
        <label>Name:</label>
        <input
          className="border-2 border-black"
          type="text"
          value={name}
          onChange={(e) => handleUserName(e)}
          onFocus={handleUsernameDisplay}
        />
        <br />
        <label>Email:</label>
        <input
          onChange={(e) => handleEmail(e)}
          onFocus={handleEmailDisplay}
          value={email}
          className="border-2 border-black"
          type="email"
        />
        <br />
        <button
          className="border-2 px-1 mb-2 border-black"
          onClick={handleLogin}
        >
          Submit
        </button>
      </div>
      {!isUsernameValid && usernameDisplay && (
        <span
          className={` ${!isUsernameValid ? "" : "md:mb-3"}`}
        >
          -Name required.
        </span>
      )}
      {emailDisplay &&
        emailMessagesState.map((message, index) => (
          <p
          key={`message ${index}`}
            className={` ${
              index < emailMessagesState.length - 1 ? "md:mb-3" : ""
            } `}
          >
            {message}
          </p>
        ))}
    </div>
  )
}

export default LoginForm
