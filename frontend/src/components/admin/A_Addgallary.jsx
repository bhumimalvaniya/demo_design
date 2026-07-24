
import React,{useEffect, useState} from "react";
import './A_Addgalary.css';
import axios from 'axios';
import API_URL from "../../config/api";
import { getImageUrl } from "../../../../backend/Utils/Imagehelper.js";

const A_Addgalary=()=>{
        const[updateId,setUpdateId]=useState(null);
        const[updateName,setUpdateName]=useState("");
        const[updateImage,setUpdateImage]=useState(null);
        const[image,setImage]=useState(null);
        const[photo_name,setPhotoName]=useState("");
        const[currentPage,setCurrentPage]=useState(1);
        const itemsPerPage=5;
       
         const handelsubmit=async(e)=>{
        e.preventDefault();

        if(!image )
        {
          alert("image is required");
          return;
        }
        if(!image.type.startsWith("image/"))
        {
          alert("only image files allowed");
          return;
        }
        if(!photo_name)
        {
          alert("photo name is required");
          return;
        }

        if(photo_name.length<3)
        {
          alert("photo name must be at least 3 characters")
          return;
        }

        const formData=new FormData();
        formData.append("image",image);
        formData.append("photo_name",photo_name);
       

        try{
          // const res=await axios.post("http://localhost:5000/api/v1/gallary/upload",formData,
           const res=await axios.post(`${API_URL}/api/v1/gallary/upload`,formData,
            {
            headers:{
              "Content-Type":"multipart/form-data",
            },
          });
          alert("gallary uploaded successfully");
          console.log(res.data);
          featchgallary();
        }
        catch(error){
           const errorMessage = error.response?.data?.message || error.message || "Upload failed";
    alert("Upload failed: " + errorMessage);
    console.log("Status:", error.response?.status);
    console.log("Backend message:", error.response?.data);
        }
             
      }
      //featch data
      const[gallaries,setGallaries]=useState([]);

      const featchgallary=()=>{
        // axios.get('http://localhost:5000/api/v1/gallary/featch')
        axios.get(`${API_URL}/api/v1/gallary/featch`)
                  .then(gallaries=>setGallaries(gallaries.data))
                  .catch(err=>console.log(err))
      }
      useEffect(()=>{
        featchgallary();
      },[]);

      //pagination logic
      const totalPages=Math.ceil(gallaries.length/itemsPerPage);
      const indexOfLast=currentPage*itemsPerPage;
      const indexOfFirst=indexOfLast-itemsPerPage;
      const currentItems=gallaries.slice(indexOfFirst,indexOfLast);

      //delete data

      const handleDelete=async(id)=>{
        try{
            // await axios.delete(`http://localhost:5000/api/v1/gallary/delete/${id}`);
             await axios.delete(`${API_URL}/api/v1/gallary/delete/${id}`);
            setGallaries(gallaries.filter(c=>c._id !== id));
        }
        catch(err)
        {
          console.log(err);
        }
      }

      //update data
      const handleEdit=(item)=>{
        setUpdateId(item._id);
        setUpdateName(item.photo_name);
      }

      const handleUpdate=async(id)=>{
    try{
      const formdata=new FormData();
      
      formdata.append("photo_name",updateName);

      if(updateImage){
        formdata.append("image",updateImage);
      }

      // const res=await axios.put(`http://localhost:5000/api/v1/gallary/updategallary/${id}`,formdata,
       const res=await axios.put(`${API_URL}/api/v1/gallary/updategallary/${id}`,formdata,
        {
        headers:{
          "Content-Type":"multipart/form-data"
        }
    });
      console.log(res.data);

      featchgallary();

    
      alert("update successfully");
        setUpdateId(null);

      setUpdateImage(null);

      setUpdateName("");
    }
    catch(error)
    {
        console.log(error);
        alert(error.response?.data?.message||"update failed");
    }
  }

    return(
        <>
             <div className="galary-page">
                    
                         <h2 className="lockgallary">🔒 </h2>
                         <h3 className="galary">Add Gallary</h3>
                     <form className="galary-form" onSubmit={handelsubmit} >
                    <div className="file-upload2">
                         <input 
                         type="file" 
                         id="file"
                         name="image"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                     <label htmlFor="file" className="choose-pic2">Choose Pic</label>
                     
                    </div>
                      <input
                       type="text" 
                       placeholder="Photos Name *"
                       name="photo_name"
                    
                        onChange={(e) => setPhotoName(e.target.value)}/>   
                       <button type="submit" className="submit-btn2">POST</button> 
                </form>
                </div>


                  <div className="table-container2">
                      <table border="1">
                          <thead>
                              <tr>
                                <th rowSpan={2}>No</th>
                                <th rowSpan={2}>Image</th>
                                <th rowSpan={2}>Name</th>
                                <th colSpan={2}>Action</th>
                              </tr>
                              <th>Update</th>
                              <th>Delete</th>
                          </thead>
                           <tbody>
                            {
                                currentItems.map((c,i)=>(
                                     <tr key={c._id}>
                                           <td>{indexOfFirst+i+1}</td>
                                           
                                    <td>{/*{c.image &&(<img src={`http://localhost:5000${c.image}`} width="50" alt="category"/>)}*/}
                                      {updateId===c._id?(
                                        <input
                                          type="file"
                                          className="edit-file"
                                          onChange={(e)=>setUpdateImage(e.target.files[0])}
                                        />
                                      ):(
                                        // <img src={`http://localhost:5000${c.image.replace("/public", "")}`} width="50" alt="gallary"/>
                                        //  <img src={`${API_URL}${c.image.replace("/public", "")}`} width="50" alt="gallary"/>
                                          <img src={getImageUrl(c.image)} width="50" alt="gallary"/>
                                      )}
                                    </td>
                                      
                                    <td>{/*{c.cate_nm}*/}
                                                  {updateId === c._id ? (

          <input
            type="text"
            className="edit-input"
            value={updateName}
            onChange={(e) =>
              setUpdateName(e.target.value)
            }
          />

        ) : (

          c.photo_name

        )}
                                    </td>
                                    <td>{/*<i className="fa fa-edit" onClick={() => handleUpdate(c._id)}></i>*/}
                                      {updateId === c._id ? (

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
          opacity: currentPage === 1 ? 0.6 : 1,
            
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

export default A_Addgalary;