import { useState, useEffect } from "react"

import Welcome from "./components/Welcome"
import Register from "./components/Register"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import SpamDetector from "./components/SpamDetector"
import Logs from "./components/Logs"
import Users from "./components/Users"
import "./index.css"

function App() {

  const [page, setPage] = useState("welcome")
  const [token, setToken] = useState("")
  const [role, setRole] = useState("")

  // ✅ Load from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedRole = localStorage.getItem("role")

    if (savedToken) {
      setToken(savedToken)

      const normalizedRole = (savedRole || "user").toLowerCase()
      setRole(normalizedRole)

      setPage(normalizedRole === "admin" ? "logs" : "spam")
    }
  }, [])

  // 🔹 Public Pages
  if (page === "welcome") return <Welcome setPage={setPage} />
  if (page === "register") return <Register setPage={setPage} />
  if (page === "login") return <Login setPage={setPage} setToken={setToken} setRole={setRole} />

  // 🔹 Protected Layout
  if (token) {
    return (
      <div className="layout">

        {/* HEADER */}
        <header className="header">
          <div className="header-content">
            <h1>AI Spam Detection System</h1>
            <button onClick={() => {
              localStorage.clear()
              setToken("")
              setRole("")
              setPage("welcome")
            }}>
              Logout
            </button>
          </div>
        </header>

        <div className="content">

          {/* SIDEBAR */}
          <div className="sidebar">
            <h2>AI System</h2>

            {role === "user" && (
              <>
                <button 
                  className={page === "spam" ? "active" : ""} 
                  onClick={() => setPage("spam")}
                >
                  🔍 Spam Detector
                </button>
                <button 
                  className={page === "analytics" ? "active" : ""} 
                  onClick={() => setPage("analytics")}
                >
                  📊 My Analytics
                </button>
              </>
            )}

            {role === "admin" && (
              <>
                <button 
                  className={page === "logs" ? "active" : ""} 
                  onClick={() => setPage("logs")}
                >
                  📜 System Logs
                </button>
                <button 
                  className={page === "users" ? "active" : ""} 
                  onClick={() => setPage("users")}
                >
                  👥 User Management
                </button>
              </>
            )}
          </div>

          {/* MAIN CONTENT */}
          <div className="main">

            {/* 🔥 REMOVE ROLE CHECK HERE */}
            {page === "spam" && <SpamDetector token={token} />}
            {page === "analytics" && <Dashboard token={token} />}

            {page === "logs" && <Logs />}
            {page === "users" && <Users />}

          </div>

        </div>

      </div>
    )
  }

  // ✅ Fallback (VERY IMPORTANT)
  return <h2>Loading...</h2>
}

export default App