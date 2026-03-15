import axios from "axios";
import { useState } from "react";

function Register(){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const register = async () => {

const res = await axios.post(
"http://127.0.0.1:8000/register?username="+username+"&password="+password
);

alert(res.data.message);

}

return(

<div className="card">

<h2>Register</h2>

<input placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}/>

<input type="password" placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}/>

<button onClick={register}>Register</button>

</div>

)

}

export default Register;