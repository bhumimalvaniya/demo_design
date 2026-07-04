import React from 'react'
import "./A_Addmenu.css";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';



const A_Addmenu = () => {
    const[menuname,setMenuName]=useState("");
    const[menulink,setMenuLink]=useState("");

    const[menus,setMenus]=useState([]);
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
    
    const [editId, setEditId] = useState(null);
    const[editMenuName,setEditMenuName]=useState("");
    const[editMenuLink,setEditMenuLink]=useState("");

    const handelsubmit=async(e)=>{
        e.preventDefault();

        console.log("SEND DATA:", {
   menuname,
   menulink
 });
        if(!menuname)
        {
            alert("menuname is required");
            return;
        }

        if(!menulink)
        {
            alert("menulink is required");
            return;
        }

        // const formdata=new FormData();
        // formdata.append("menuname",menuname);
        // formdata.append("menulink",menulink);

         try{
          const res=await axios.post("http://localhost:5000/api/v1/admin/addmenu",
            {
            menuname: menuname,
            menulink:menulink
         },
        {
      headers:{
        "Content-Type":"application/json"
      }
    });
            alert("menu uploaded successfully");
            console.log(res.data);
                setMenuName("");
                setMenuLink("");

            featchmenu();

        }
       catch(error){
         const errorMessage = error.response?.data?.message || error.message || "Upload failed";
    alert("Upload failed: " + errorMessage);
    console.log("Status:", error.response?.status);
    console.log("Backend message:", error.response?.data);
       }
    }
    const featchmenu=async()=>{
        try{
                  const res=await axios.get("http://localhost:5000/api/v1/admin/getmenu");
                    console.log(res.data.menus);
                  setMenus(res.data.menus);
        }
        catch(error)
        {
                console.log(error);
        }
      
    }

    useEffect(()=>{
        featchmenu();
    },[])

    
         // --- pagination logic ---
   const totalPages = Math.ceil(menus.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
   const currentItems = menus.slice(indexOfFirst, indexOfLast);
    /*const currentItems = Array.isArray(menus)
    ? menus.slice(indexOfFirst,indexOfLast)
    : [];*/

    const handleDelete=async(id)=>{
        try{
            await axios.delete(`http://localhost:5000/api/v1/admin/deletemenu/${id}`)
            setMenus(menus.filter(c=>c._id !== id));
        }
        catch(error)
        {
            console.log(error);
        }
    }

    const handleEdit=(item)=>{
             setEditId(item._id);
            setEditMenuName(item.menuname);
            setEditMenuLink(item.menulink);
    }

     const handleUpdate=async(id)=>{
    try{
      const formdata=new FormData();
      
      formdata.append("menuname",editMenuName);
      formdata.append("menulink",editMenuLink);

      const res=await axios.put(`http://localhost:5000/api/v1/admin/updatemenu/${id}`,
        {
            menuname:editMenuName,
            menulink:editMenuLink
        });
      console.log(res.data);

      featchmenu();

      setEditId(null);

      alert("update successfully");
    }
    catch(error)
    {
        console.log(error);
    }
  }
    return (
    <>
        <div className='post-menu'>
            <h2 className='locks'>🔒</h2>
              <h3 className="add-menu">Add Menu</h3>
            <form className='menu-form' onSubmit={handelsubmit}>
                
                    <input 
                    type="text"
                    placeholder="Menu Name"
                    name="menuname"
                    value={menuname}
                    onChange={(e)=>setMenuName(e.target.value)}
                    />

                     <input 
                    type="text"
                    placeholder="Menu Link"
                    name="menulink"
                    value={menulink}
                    onChange={(e)=>setMenuLink(e.target.value)}
                    />

                    <button type="submit" className="submit-btn2">Post</button>
            </form>
        </div>

        <div className="table-container3">
            <table border={1}>
                <thead>
                    <tr>
                        <th rowSpan={2}>No</th>
                        <th rowSpan={2}>Menu Name</th>
                        <th rowSpan={2}>Menu Link</th>
                        <th colSpan={3}>Action</th>
                    </tr>
                    <tr>
                        <td>Update</td>
                        <td>Delete</td>
                        
                    </tr>
                    
                </thead>
                <tbody>
                    {
                        
                        currentItems.map((c,i)=>{
                            return(<tr key={c._id}>
                                <td>{indexOfFirst+i+1}</td>
                                {/* <td>{c.menuname}</td> */}
                                <td>
                                  {editId === c._id ? (

                                 <input
                                     type="text"
                                     className="edit-input"
                                        value={editMenuName}
                                         onChange={(e) =>
                                      setEditMenuName(e.target.value)
                                        }
                                     />

                                  ) : (

                                    c.menuname

                                    )}</td>

                                    <td>
                                        {editId === c._id ? (

                                 <input
                                     type="text"
                                     className="edit-input"
                                        value={editMenuLink}
                                         onChange={(e) =>
                                      setEditMenuLink(e.target.value)
                                        }
                                     />

                                  ) : (

                                    c.menulink

                                    )}
                                    </td>
                              <td>{/*<i className="fa fa-edit" onClick={() => handleUpdate(c._id)}></i>*/}
                                      {editId === c._id ? (

                                 <button className="save-btn" onClick={() => handleUpdate(c._id)}>Save</button>
                                  ) : (
                                  <i className="fa fa-edit" onClick={() => handleEdit(c)}></i>
                                   )}
                                    </td>
                                <td><i className="fa fa-trash" onClick={() => handleDelete(c._id)}></i></td>
                            </tr>)
                        })
                    }
                    

                </tbody>
            </table>
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
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius:"10px",
              
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

export default A_Addmenu;