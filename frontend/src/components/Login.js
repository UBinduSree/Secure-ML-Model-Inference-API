import {useState} from "react"
import axios from "axios"

function Login({setPage,setToken}){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [msg,setMsg] = useState("")

const login = async()=>{

try{

const res = await axios.post(
"http://127.0.0.1:8000/login",
{
  username,
  password
}
)

const token = res.data.access_token

// Decode token
const payload = JSON.parse(atob(token.split('.')[1]))

localStorage.setItem("token", token)
localStorage.setItem("role", payload.role)

// Redirect
if(payload.role === "admin"){
    setPage("admin")
}else{
    setPage("dashboard")
}
// ✅ FORCE UI REFRESH (fix blank screen)
window.location.reload()
}catch(error){

console.log(error)

setMsg("Invalid credentials or server error")

}

}

return(

<div className="auth-card">

<h2>Login</h2>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>
Login
</button>

<p>{msg}</p>

</div>

)

}

export default Login