import { useState } from "react"
import axios from "axios"

function Register({ setPage }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [strength, setStrength] = useState("")

  // 🔐 Password Strength Checker
  const checkStrength = (pass) => {
    let score = 0

    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 1) return "Weak"
    if (score === 2 || score === 3) return "Medium"
    return "Strong"
  }

  const handlePassword = (value) => {
    setPassword(value)
    setStrength(checkStrength(value))
  }

  const register = async () => {

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (strength === "Weak") {
      setError("Password is too weak")
      return
    }

    try {
      await axios.post("http://127.0.0.1:8000/register", {
        username: email,
        password: password
      })

      alert("Registration successful!")
      setPage("login")

    } catch (err) {
      setError("Registration failed")
    }
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>Create Account</h2>

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => handlePassword(e.target.value)}
        />

       <p className={`strength ${strength ? strength.toLowerCase() : ""}`}>
          Strength: {strength}
        </p>

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={register}>Register</button>

        <p onClick={() => setPage("login")} className="link">
          Already have an account? Login
        </p>

      </div>

    </div>
  )
}

export default Register