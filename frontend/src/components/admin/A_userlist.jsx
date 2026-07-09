import React, { useEffect, useState } from "react";
import './A_userlist.css';
import axios from "axios";
import API_URL from "../../config/api";

const A_userlist=()=>{
    const[users,setUsers]=useState([]);
    const [currentPage,setCurrentPage]=useState(1);
    const itemsPerPage=5;

    useEffect(()=>{
            // axios.get('http://localhost:5000/api/v1/cust/featch')
             axios.get(`${API_URL}/api/v1/cust/featch`)
            .then(users=>setUsers(users.data))
            .catch(err=>console.log(err))
    },[])

   const toggleUser = async (id) => {
  // await axios.put(`http://localhost:5000/api/v1/cust/toggle/${id}`);
   await axios.put(`${API_URL}/api/v1/cust/toggle/${id}`);
  //  const updated = await axios.get("http://localhost:5000/api/v1/cust/featch");
    const updated = await axios.get(`${API_URL}/api/v1/cust/featch`);
  setUsers(updated.data);
}

    //pagination logic
    const totalPages=Math.ceil(users.length/itemsPerPage);
    const indexOfLast=currentPage * itemsPerPage;
    const indexOfFirst=indexOfLast-itemsPerPage;
    const currentItems=users.slice(indexOfFirst,indexOfLast);
    return(
        <>
            <div className="table-container"> 
                <table border="1">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Phone No</th>
                            <th>Action</th> 
                        </tr>
                         </thead>
                        <tbody>
                            {
                                currentItems.map((user,i)=>{
                                    return <tr key={user._id}>
                                            <td>{indexOfFirst+i+1}</td>
                                            <td><img src={user.avatar } alt="profile" height={50} style={{borderRadius:"30px"}}/></td>
                                            <td>{user.fnm}</td>
                                            <td>{user.email}</td>
                                            <td>{user.gender}</td>
                                            <td>{user.phone_no}</td>
                                
                                            <td><button 
                                                    onClick={() => toggleUser(user._id)} 
                                                     className={user.isblocked ? "unblock-btn" : "block-btn"}
                                                    >
                                                    {user.isblocked ? "Unblock" : "Block"}
                                                    </button>
                                            </td>
                                     </tr>
                                })
                            }
                           
                            
                        </tbody>
                   
                </table>

                {/*----Pagination Buttons----*/}

                 <div style={{ marginTop: "10px", display: "flex", gap: "8px",justifyContent:"center" }}>

                     <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
          style={{
            padding:"10px",
            paddingRight:"20px",
            paddingLeft:"20px",
            background:"green",
            color:"white",
            borderRadius:"15px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
  opacity: currentPage === 1 ? 0.6 : 1
          }}
        >
        <i class="fa fa-arrow-left" aria-hidden="true"></i>  Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              background: currentPage === i + 1 ? "black" : "white",
              color: currentPage === i + 1 ? "white" : "black",
              border: "1px solid black",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius:"10px"
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding:"10px",
            paddingRight:"20px",
            paddingLeft:"20px",
            background:"green",
            color:"white",
            borderRadius:"15px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
  opacity: currentPage === totalPages ? 0.6 : 1
          }}
        >
          Next <i class="fa fa-arrow-right" aria-hidden="true"></i>
        </button>
                 </div>
                  <p style={{marginTop:10,textAlign:"center"}}>Page {currentPage} of {totalPages}</p>
            </div>
        </>
    )
}

export default A_userlist;