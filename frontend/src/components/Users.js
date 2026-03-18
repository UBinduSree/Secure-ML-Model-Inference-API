import { useEffect, useState } from "react"
import axios from "axios"

function Users(){

const [users, setUsers] = useState([])
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 20
const token = localStorage.getItem("token")

useEffect(()=>{
    fetchUsers()
},[])

const fetchUsers = async () => {

try{

const res = await axios.get(
"http://127.0.0.1:8000/users",
{
headers:{
Authorization: `Bearer ${token}`
}
}
)

setUsers(res.data)

}catch(err){
console.log(err)
}

}

const deleteUser = async(username) => {

if(!window.confirm("Delete this user?")) return

try{

await axios.delete(
`http://127.0.0.1:8000/delete_user/${username}`,
{
headers:{
Authorization: `Bearer ${token}`
}
}
)

fetchUsers() // refresh

}catch(err){
console.log(err)
}

}

const indexOfLastUser = currentPage * itemsPerPage
const indexOfFirstUser = indexOfLastUser - itemsPerPage
const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
const totalPages = Math.ceil(users.length / itemsPerPage)

const paginate = (pageNumber) => setCurrentPage(pageNumber)

return(

<div className="users-wrapper">

<div className="users-card">

<h2>👥 User Management</h2>

<table className="users-table">

<thead>
<tr>
<th>Username</th>
<th>Role</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{currentUsers.map((u,index)=>(
<tr key={index}>

<td>{u.username}</td>
<td>
  <span className={u.role === "admin" ? "admin" : "user"}>
    {u.role.toUpperCase()}
  </span>
</td>

<td>
{u.role !== "admin" && (
<button
className="delete-btn"
onClick={()=>deleteUser(u.username)}
>
Delete
</button>
)}
</td>

</tr>
))}

</tbody>

</table>

<div className="pagination">
  <button 
    className="page-btn" 
    onClick={() => setCurrentPage(currentPage - 1)} 
    disabled={currentPage === 1}
  >
    Previous
  </button>
  {Array.from({ length: totalPages }, (_, i) => (
    <button 
      key={i + 1} 
      className="page-btn" 
      onClick={() => paginate(i + 1)}
      disabled={currentPage === i + 1}
    >
      {i + 1}
    </button>
  ))}
  <button 
    className="page-btn" 
    onClick={() => setCurrentPage(currentPage + 1)} 
    disabled={currentPage === totalPages}
  >
    Next
  </button>
  <div className="page-info">
    Page {currentPage} of {totalPages}
  </div>
</div>

</div>

</div>

)

}

export default Users