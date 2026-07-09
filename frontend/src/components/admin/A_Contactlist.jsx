import React, {useState,useEffect}from "react";
import './A_Contactlist.css'
import axios from "axios";
import API_URL from "../../config/api";

const A_Contactliist=()=>{
    const[cntus,setCntus]=useState([]);
    const [currentPage,setCurrentPage]=useState(1);
    const itemsPerPage=5;

    useEffect(()=>{
            // axios.get('http://localhost:5000/api/v1/cont/featch')
             axios.get(`${API_URL}/api/v1/cont/featch`)
            .then(users=>setCntus(users.data))
            .catch(err=>console.log(err))
    },[])
    const totalPages = Math.ceil(cntus.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;

  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems = cntus.slice(indexOfFirst, indexOfLast);
    return(
        <>
                 <div className="table-container2"> 
                <table border="1">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Mobile No</th>
                            <th>Message</th>
                           
                        </tr>
                         </thead>
                        <tbody>
                            {
                                cntus.map((user,i)=>{
                                    return <tr key={user._id}>
                                            <td>{i+1}</td>
                                            
                                            <td>{user.fullname}</td>
                                            <td>{user.email}</td>
                                            
                                            <td>{user.phone}</td>
                                            <td>{user.message}</td>

                                            
                                     </tr>
                                })
                             
                            }
                            
                            
                        </tbody>
                   
                </table>

            </div>
            {/* --- Pagination Buttons --- */}
      <div style={{ marginTop: "10px", display: "flex", gap: "8px" ,justifyContent:"center"}}>
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
              padding: "10px 10px",
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
        </>
    )
}


export default A_Contactliist;