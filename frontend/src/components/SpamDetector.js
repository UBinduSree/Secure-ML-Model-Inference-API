import { useState, useRef, useEffect } from "react"
import axios from "axios"

function SpamDetector({ token }) {

  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([
    {
      type: "ai",
      result: "Welcome! Enter a message to analyze for spam.",
      confidence: ""
    }
  ])
  const [loading, setLoading] = useState(false)

  // 🔽 Auto scroll
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  const predict = async () => {

    if (!message.trim()) return

    const userMsg = {
      type: "user",
      text: message
    }

    setChat(prev => [...prev, userMsg])
    setMessage("")
    setLoading(true)

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log("API RESPONSE:", res.data)

      const aiMsg = {
        type: "ai",
        result: res.data.prediction || res.data.result || "Unknown",
        confidence: res.data.confidence || 0
      }

      setChat(prev => [...prev, aiMsg])

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message)

      setChat(prev => [
        ...prev,
        {
          type: "ai",
          result: "⚠️ Error connecting to server",
          confidence: 0
        }
      ])
    }

    setLoading(false)
  }

  return (
    <div className="chat-container">

      <div className="chat-wrapper">

        {/* 💬 CHAT AREA */}
        <div className="chat-box">

          {chat.map((msg, index) => (

            msg.type === "user" ? (

              <div key={index} className="chat user">
                {msg.text}
              </div>

            ) : (

              <div key={index} className="chat ai">

                <p>
                  {msg.result === "Spam"
                    ? "🚨 Spam Detected"
                    : msg.result === "Not Spam"
                    ? "✅ Not Spam"
                    : msg.result}
                </p>

                {msg.confidence !== "" && (
                  <span>Confidence: {msg.confidence}%</span>
                )}

              </div>

            )

          ))}

          {loading && <p className="loading">Analyzing...</p>}

          {/* 🔽 Auto scroll target */}
          <div ref={chatEndRef}></div>

        </div>

        {/* ✍️ INPUT */}
        <div className="input-box">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message to analyze..."
          />

          <button onClick={predict}>
            Analyze
          </button>

        </div>

      </div>

    </div>
  )
}

export default SpamDetector