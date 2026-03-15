import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import SpamDetector from "./components/SpamDetector";
import "./index.css";

function App(){

const [token,setToken] = useState("");

return(

<div className="container">

<h1>AI Spam Detection System</h1>

{!token && (
<>
<Register/>
<Login setToken={setToken}/>
</>
)}

{token && <SpamDetector token={token}/>}

</div>

)

}

export default App;