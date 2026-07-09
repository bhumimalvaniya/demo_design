import React, { useState, useEffect } from "react";
import './A_Addcategory.css';
import axios from "axios";
import API_URL from "../../config/api";

const A_Addaboutus = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState(""); 
  const itemsPerPage = 5;

  // ADD DATA
  const handelsubmit = async (e) => {

    e.preventDefault();

    if (!title) {
      alert("Title is required");
      return;
    }

    if (!description) {
      alert("Description is required");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      const res = await axios.post(
       // "http://localhost:5000/api/v1/admin/addabout",
        `${API_URL}/api/v1/admin/addabout`,
        {
            title,description
        }
      );

      alert("Data uploaded successfully");

      console.log(res.data);

      fetchData();

      setTitle("");
      setDescription("");

    } catch (error) {

      console.log(error);

    }

  };

  // FETCH DATA
  const fetchData = async () => {

    try {

      const res = await axios.get(
       // "http://localhost:5000/api/v1/admin/getabout"
        `${API_URL}/api/v1/admin/getabout`
      );

      console.log(res.data);

      setData(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  // PAGINATION
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;

  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems = data.slice(indexOfFirst, indexOfLast);

  // DELETE
  const handleDelete = async (id) => {

    try {

     const res= await axios.delete(
        // `http://localhost:5000/api/v1/admin/deleteabout/${id}`
         `${API_URL}/api/v1/admin/deleteabout/${id}`
      );

       console.log(res.data);

  
    setData((prevData) =>
      prevData.filter((item) => item._id !== id)
    );

    alert("Deleted Successfully");

    } catch (error) {

      console.log(error);

    }

  };
  const handleEdit = (item) => {

  setEditId(item._id);

  setEditTitle(item.title);

  setEditDescription(item.description);

};
 const handleUpdate = async (id) => {

  try {

    const res = await axios.put(

      //`http://localhost:5000/api/v1/admin/updateabout/${id}`,
      `${API_URL}/api/v1/admin/updateabout/${id}`,

      {
        title: editTitle,
        description: editDescription
      }

    );

    console.log(res.data);

    setData((prevData) =>
      prevData.map((item) =>
        item._id === id
          ? {
              ...item,
              title: editTitle,
              description: editDescription
            }
          : item
      )
    );

    setEditId(null);

    alert("Updated Successfully");

  } catch (error) {

    console.log(error);

  }

};
  return (
    <>

      <div className="post-page">

        <h2 className="locks">🔒</h2>

        <h3 className="cates">About Us</h3>

        <form className="cat-form" onSubmit={handelsubmit}>

          <div className="file-upload1">

            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

          </div>

          <textarea
            placeholder="Enter Description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" className="submit-btn1">
            POST
          </button>

        </form>

      </div>

      <div className="table-container1">

        <table border="1">

          <thead>

            <tr>
              <th rowSpan={2}>No</th>
              <th rowSpan={2}>Title</th>
              <th rowSpan={2}>Description</th>
              <th colSpan={2}>Action</th>
            </tr>

            <tr>
              <th>Update</th>
              <th>Delete</th>
            </tr>

          </thead>

         <tbody>

  {currentItems.map((c, i) => (

    <tr key={c._id}>

      <td>{indexOfFirst + i + 1}</td>

      <td>

        {editId === c._id ? (

          <input
            type="text"
            className="edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

        ) : (

          c.title

        )}

      </td>

      <td>

        {editId === c._id ? (

          <input
            type="text"
            value={editDescription}
            className="edit-input"
            onChange={(e) =>
              setEditDescription(e.target.value)
            }
          />

        ) : (

          c.description

        )}

      </td>

      <td>

        {editId === c._id ? (

          <button 
          className="save-btn"
          onClick={() => handleUpdate(c._id)}>
            Save
          </button>

        ) : (

          <i
            className="fa fa-edit"
            onClick={() => handleEdit(c)}
          ></i>

        )}

      </td>

      <td>

        <i
          className="fa fa-trash"
          onClick={() => handleDelete(c._id)}
        ></i>

      </td>

    </tr>

  ))}

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
            
      </div>

    </>
  );

};

export default A_Addaboutus;