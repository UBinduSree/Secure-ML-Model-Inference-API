import { useState, useEffect } from "react"

import Welcome from "./components/Welcome"
import Register from "./components/Register"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import SpamDetector from "./components/SpamDetector"

import "./index.css"

function App(){

const [page,setPage] = useState("welcome")
const [token,setToken] = useState("")
const [role,setRole] = useState("")

// ✅ Load token + role from localStorage (important after refresh)
useEffect(()=>{
  const savedToken = localStorage.getItem("token")
  const savedRole = localStorage.getItem("role")

  if(savedToken){
    setToken(savedToken)
    setRole(savedRole || "user")
    setPage(savedRole === "admin" ? "analytics" : "detector")
  }
},[])


// 🔹 Public Pages
if(page==="welcome")
return <Welcome setPage={setPage}/>

if(page==="register")
return <Register setPage={setPage}/>

if(page==="login")
return <Login setPage={setPage} setToken={setToken} setRole={setRole}/>


// 🔹 Protected Layout
if(token){

return(

<div className="layout">

<div className="sidebar">

<h2>AI System</h2>

{/* USER → only detector */}
{role === "user" && (
<button onClick={()=>setPage("detector")}>
Spam Detector
</button>
)}

{/* ADMIN → both options */}
{role === "admin" && (
<>
<button onClick={()=>setPage("detector")}>
Spam Detector
</button>

<button onClick={()=>setPage("analytics")}>
AI Analytics
</button>
</>
)}

<button onClick={()=>{
localStorage.clear()
setToken("")
setRole("")
setPage("welcome")
}}>
Logout
</button>

</div>

<div className="main">

{page==="detector" && <SpamDetector token={token}/>}

{page==="analytics" && role==="admin" && <Dashboard/>}

</div>

</div>

)

}

}

export default App