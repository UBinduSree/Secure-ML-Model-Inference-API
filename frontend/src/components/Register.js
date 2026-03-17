import { useState } from "react"
import axios from "axios"

function Register({setPage}){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [role,setRole] = useState("user")   // ✅ NEW
const [msg,setMsg] = useState("")

const register = async()=>{

try{

await axios.post(
"http://127.0.0.1:8000/register",
{
username: username,
password: password,
role: role   // ✅ SEND ROLE
}
)

setMsg("Account created successfully!")

setTimeout(()=>{
setPage("login")
},1500)

}catch(error){

console.log(error.response)

setMsg("Registration failed")

}

}

return(

<div className="auth-card">

<h2>Create Account</h2>

<input
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

{/* ✅ ROLE DROPDOWN */}
<select onChange={(e)=>setRole(e.target.value)}>

<option value="user">User</option>
<option value="admin">Admin</option>

</select>

<button onClick={register}>
Register
</button>

<p>{msg}</p>

</div>

)

}

export default Register