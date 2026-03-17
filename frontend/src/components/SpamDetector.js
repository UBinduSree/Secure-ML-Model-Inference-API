import axios from "axios";
import { useState } from "react";

function SpamDetector({token,onPredict}){

const [message,setMessage] = useState("");
const [result,setResult] = useState("");

const predict = async () => {

try {

const res = await axios.post(
"http://127.0.0.1:8000/predict",
{ message: message },
{
headers:{
Authorization: "Bearer " + token
}
}
)
console.log(token)
setResult(res.data.prediction + " (" + res.data.confidence + ")")

}
catch(error){

console.log(error)
setResult("Error connecting to AI server")

}

}
return(

<div className="detector-container">

<div className="detector-card">

<h2>Spam Detector</h2>

<textarea
placeholder="Enter message..."
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<button onClick={predict}>
Analyze Message
</button>

<div className={`result-card ${result.includes("Spam") ? "spam" : "safe"}`}>
<h3>{result}</h3>
</div>

</div>

</div>

)

}

export default SpamDetector;