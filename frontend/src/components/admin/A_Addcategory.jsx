import React from "react";
import './A_Addcategory.css'
import axios from "axios";
import { useState,useEffect } from "react";
import API_URL from "../../config/api";
import { getImageUrl } from "../../../../backend/Utils/Imagehelper.js";


const A_Addcategory=()=>{
    const [editId,setEditId]=useState(null);
    const[editName,setEditName]=useState("");
    const[editImage,setEditImage]=useState(null);
    
    const [image,setFile]=useState(null);                               
    const[cate_nm,setCategory]=useState();
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
    
    const handelsubmit=async(e)=>{
        e.preventDefault();

        if(!image )
        {
          alert("image is required");
          return;
        }
       
        if (!image.type.startsWith("image/")) {
           alert("Only image files are allowed");
           return;
           }

           if (!cate_nm) {
               alert("cate name is required");
                return;
             }
           if (cate_nm.length < 3) {
               alert("cate name must be at least 3 characters");
                return;


              }
        const formData=new FormData();
        formData.append("image",image);
        formData.append("cate_nm",cate_nm);

        try{
          // const res=await axios.post("http://localhost:5000/api/v1/admin/uplodcategory",formData,
           const res=await axios.post(`${API_URL}/api/v1/admin/uplodcategory`,formData,
            {
              headers:{
                "Content-Type":"multipart/form-data",
              },
            });
            alert("category uploaded successfully");
            console.log(res.data);

            featchCategories();

        }
       catch(error){
         const errorMessage = error.response?.data?.message || error.message || "Upload failed";
    alert("Upload failed: " + errorMessage);
    console.log("Status:", error.response?.status);
    console.log("Backend message:", error.response?.data);
       }
      }
    //featch data
     const[categories,setCategories]=useState([]);

     const featchCategories=()=>{
      //axios.get('http://localhost:5000/api/v1/admin/featch')
      axios.get(`${API_URL}/api/v1/admin/featch`)
                .then(categories=>setCategories(categories.data))
                .catch(err=>console.log(err))
     }
        useEffect(()=>{
                featchCategories();
        },[])

         // --- pagination logic ---
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = categories.slice(indexOfFirst, indexOfLast);
        //delete data
          const handleDelete = async (id) =>{
            try {
    // await axios.delete(`http://localhost:5000/api/v1/admin/delete/${id}`);
     await axios.delete(`${API_URL}/api/v1/admin/delete/${id}`);
    setCategories(categories.filter(c => c._id !== id));
            }
            catch(error)
            {
              console.log(error);
            }
  };
    
  const handleEdit=(item)=>{
    setEditId(item._id);
    setEditName(item.cate_nm);
  }

  const handleUpdate=async(id)=>{
    try{
      const formdata=new FormData();
      
      formdata.append("cate_nm",editName);

      if(editImage){
        formdata.append("image",editImage);
      }

     // const res=await axios.put(`http://localhost:5000/api/v1/admin/updatecate/${id}`,formdata,
      const res=await axios.put(`${API_URL}/api/v1/admin/updatecate/${id}`,formdata,
        {
        headers:{
          "Content-Type":"multipart/form-data"
        }
    });
      console.log(res.data);

      featchCategories();

      setEditId(null);

      alert("update successfully");
    }
    catch(error)
    {
        console.log(error);
    }
  }
        return(
            <>
                <div className="post-page">
                    
                         <h2 className="locks">🔒 </h2>
                         <h3 className="cates">Post Category</h3>
                     <form className="cat-form" onSubmit={handelsubmit}>
                    <div className="file-upload1">
                         <input
                          type="file" 
                          id="file"
                          name="image"
                          onChange={(e)=>setFile(e.target.files[0])}/>
                     <label htmlFor="file" className="choose-pic1">Choose Pic</label>
                     
                    </div>
                      <input 
                      type="text" 
                      placeholder="Category Name *" 
                      name="cate_nm"
                      onChange={(e)=>setCategory(e.target.value)}/>   
                       <button type="submit" className="submit-btn1">POST</button> 
                </form>
                </div>

                 <div className="table-container1"> 
                <table border="1">
                    <thead>
                        <tr>
                            <th rowSpan={2}>No</th>
                            <th rowSpan={2}>Image</th>
                            <th rowSpan={2}>Name</th>
                            <th colSpan={3}>Action</th>
                           
                        </tr>
                        <tr>
                          <td>Update</td>
                          <td>Delete</td>
                        </tr>
                         </thead>
                        <tbody>
                            {
                                currentItems.map((c,i)=>(
                                     <tr key={c._id}>
                                           <td>{indexOfFirst+i+1}</td>
                                           
                                    <td>{/*{c.image &&(<img src={`http://localhost:5000${c.image}`} width="50" alt="category"/>)}*/}
                                      {editId===c._id?(
                                        <input
                                          type="file"
                                          className="edit-file"
                                          onChange={(e)=>setEditImage(e.target.files[0])}
                                        />
                                      ):(
                                        // <img src={`http://localhost:5000${c.image}`} width="50" alt="category"/>
                                        // <img src={`${API_URL}${c.image}`} width="50" alt="category"/>
                                         <img src={getImageUrl(c.image)} width="50" alt="category"/>
                                      )}
                                    </td>
                                      
                                    <td>{/*{c.cate_nm}*/}
                                                  {editId === c._id ? (

          <input
            type="text"
            className="edit-input"
            value={editName}
            onChange={(e) =>
              setEditName(e.target.value)
            }
          />

        ) : (

          c.cate_nm

        )}
                                    </td>
                                    <td>{/*<i className="fa fa-edit" onClick={() => handleUpdate(c._id)}></i>*/}
                                      {editId === c._id ? (

          <button
            className="save-btn"
            onClick={() => handleUpdate(c._id)}
          >
            Save
          </button>

        ) : (

          <i
            className="fa fa-edit"
            onClick={() => handleEdit(c)}
          ></i>

        )}
                                    </td>
                                    <td><i className="fa fa-trash" onClick={() => handleDelete(c._id)}></i></td>
                                     </tr>
                                ))
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

export default A_Addcategory;