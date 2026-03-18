import { useEffect, useState } from "react"
import axios from "axios"

function Logs() {

  const [logs, setLogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    const token = localStorage.getItem("token")

    try {
      const res = await axios.get("http://127.0.0.1:8000/logs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // logs are already parsed JSON objects from backend
      setLogs(res.data.logs.reverse())
    } catch (error) {
      console.error("Error fetching logs:", error)
      setLogs([])
    }
  }

  const totalPages = Math.ceil(logs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = logs.slice(startIndex, endIndex)

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

return (
  <div className="logs-wrapper">
    <div className="logs-card">
      <h2>📊 System Activity Logs</h2>
      <p className="logs-summary">Total Logs: {logs.length} | Page {currentPage} of {totalPages}</p>

      <div className="table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>🕒 Time</th>
              <th>📋 Type</th>
              <th>👤 User / 🌐 IP</th>
              <th>📝 Details</th>
            </tr>
          </thead>

          <tbody>
            {currentLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.time.split(" ")[1]}</td>
                <td className={log.type === "prediction" ? "ai" : "req"}>
                  {log.type === "prediction" ? "🤖 AI Prediction" : "🌐 API Request"}
                </td>
                <td>{log.user || log.ip}</td>
                <td>
                  {log.type === "prediction"
                    ? `Result: ${log.result} (${log.confidence}%)`
                    : `Endpoint: ${log.endpoint}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1} className="page-btn">
            ⬅️ Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="page-btn">
            Next ➡️
          </button>
        </div>
      )}
    </div>
  </div>
)
}

export default Logs