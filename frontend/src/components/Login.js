import axios from "axios";
import { useState } from "react";

function Login({setToken}){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const login = async ()=>{

const res = await axios.post(
"http://127.0.0.1:8000/login?username="+username+"&password="+password
);

setToken(res.data.access_token);

alert("Login Successful");

}

return(

<div className="card">

<h2>Login</h2>

<input placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}/>

<input type="password" placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}/>

<button onClick={login}>Login</button>

</div>

)

}

export default Login;