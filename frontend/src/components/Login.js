import { useState } from "react"
import axios from "axios"

function Login({ setPage, setToken, setRole }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const login = async () => {

    if (!email || !password) {
      setError("Please fill all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        username: email,
        password: password
      })

      const role = (res.data.role || "user").toLowerCase()

      // ✅ Save properly
      localStorage.setItem("token", res.data.access_token)
      localStorage.setItem("role", role)

      setToken(res.data.access_token)
      setRole(role)

      // ✅ redirect
      setPage(role === "admin" ? "logs" : "spam")

    } catch (err) {
      console.log(err)
      setError("Invalid email or password")
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2>Welcome Back 👋</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p onClick={() => setPage("register")} className="link">
          Don't have an account? Register
        </p>

      </div>

    </div>
  )
}

export default Login