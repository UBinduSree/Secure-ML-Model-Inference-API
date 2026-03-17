function Welcome({setPage}){

return(

<div className="welcome">

<h1>🤖 AI Spam Detection System</h1>

<p>
Protect your messages using intelligent machine learning.
Our AI analyzes text and detects spam instantly.
</p>

<div className="welcome-buttons">

<button onClick={()=>setPage("register")}>
Create Account
</button>

<button onClick={()=>setPage("login")}>
Login
</button>

</div>

</div>

)

}

export default Welcome;