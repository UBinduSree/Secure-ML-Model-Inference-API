import axios from "axios";
import { useState } from "react";

function SpamDetector({token}){

const [message,setMessage] = useState("");
const [result,setResult] = useState("");

const predict = async () => {

try{

const res = await axios.post(
"http://127.0.0.1:8000/predict",
{message:message},
{
headers:{
Authorization:"Bearer "+token
}
}
);

setResult(res.data.prediction + " (" + res.data.confidence + ")");

}

catch(error){

setResult("Error connecting to AI server");

}

}

return(

<div className="card">

<h2>Spam Detector</h2>

<textarea
placeholder="Enter message"
onChange={(e)=>setMessage(e.target.value)}
></textarea>

<button onClick={predict}>Analyze</button>

<h3 className="result">{result}</h3>

</div>

)

}

export default SpamDetector;