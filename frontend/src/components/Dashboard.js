import { useEffect, useState } from "react"
import axios from "axios"

function Dashboard({ token }) {

  const [data, setData] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setData(res.data)
    } catch (err) {
      console.log("Stats fetch failed", err)
    }
  }

  if (!data) return <p>Loading...</p>

  return (
    <div className="dashboard-wrapper">

      {/* 🔥 TOP CARDS */}
      <div className="cards">

        <div className="card total">
          <h3>Total Checked</h3>
          <p>{data.total}</p>
        </div>

        <div className="card spam">
          <h3>Spam</h3>
          <p>{data.spam}</p>
        </div>

        <div className="card safe">
          <h3>Not Spam</h3>
          <p>{data.safe}</p>
        </div>

      </div>

      {/* 🔥 HISTORY TABLE */}
      <div className="history-card">

        <h2>📜 Message History</h2>

        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Result</th>
              <th>Confidence</th>
            </tr>
          </thead>

          <tbody>
            {data.history.map((item, index) => (
              <tr key={index}>
                <td>{item.message}</td>

                <td className={item.result === "Spam" ? "spam-text" : "safe-text"}>
                  {item.result}
                </td>

                <td>{item.confidence}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Dashboard