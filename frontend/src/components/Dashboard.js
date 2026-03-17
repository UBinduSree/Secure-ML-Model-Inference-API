import {useEffect,useState} from "react"
import axios from "axios"

function Dashboard({refresh}){

const [stats,setStats] = useState({
total_messages:0,
spam_detected:0,
safe_messages:0,
spam_rate:"0%"
})

const fetchStats = async()=>{

try{

const res = await axios.get("http://127.0.0.1:8000/stats")

setStats(res.data)

}catch{
console.log("Stats fetch failed")
}

}

useEffect(()=>{

fetchStats()

},[refresh])

return(

<div className="analytics">

<h2 style={{ color: "blue" }}>AI Analytics Dashboard</h2>

<div className="stats">

<div className="card">
<h3>Total Messages</h3>
<p>{stats.total_messages}</p>
</div>

<div className="card">
<h3>Spam Detected</h3>
<p>{stats.spam_detected}</p>
</div>

<div className="card">
<h3>Safe Messages</h3>
<p>{stats.safe_messages}</p>
</div>

<div className="card">
<h3>Spam Rate</h3>
<p>{stats.spam_rate}</p>
</div>

</div>

</div>

)

}

export default Dashboard