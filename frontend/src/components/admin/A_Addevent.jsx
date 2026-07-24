import React, { useEffect, useState } from "react";
import "./A_Addevent.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import { getImageUrl } from "../../../../backend/Utils/Imagehelper.js";

const A_Addevent = () => {
  const [image, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [start_date, setStartdate] = useState("");
  const [end_date, setEnddate] = useState("");
  const [start_time, setStarttime] = useState("");
  const [end_time, setEndtime] = useState("");
  const [price, setPrice] = useState("");
  const [cate_nm, setCategory] = useState("");
  const [cate_id, setCategoryid] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [categories, setCategories] = useState([]);
  const [event, setEvent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (time12) => {
    if (!time12) return "";
    if (!time12.includes("AM") && !time12.includes("PM")) return time12;

    const [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/admin/featchdata`);
      setEvent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/v1/admin/featch`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));

    fetchData();
  }, []);

  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/v1/admin/deleteevent/${id}`);
      alert("Event Deleted");
      fetchData();
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  
  const handelsubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Image is required");
      return;
    }
    if (!image.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (title.length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }
    if (!start_date) {
      alert("Start date is required");
      return;
    }
    if (!end_date) {
      alert("End date is required");
      return;
    }
    if (new Date(end_date) < new Date(start_date)) {
      alert("End date cannot be before start date");
      return;
    }
    if (!start_time) {
      alert("Start time is required");
      return;
    }
    if (!end_time) {
      alert("End time is required");
      return;
    }
    if (start_date === end_date && end_time <= start_time) {
      alert("End time must be after start time");
      return;
    }
    if (!price) {
      alert("Price is required");
      return;
    }
    if (isNaN(price) || Number(price) < 0) {
      alert("Price must be a valid positive number");
      return;
    }
    if (!cate_id || !cate_nm) {
      alert("Please select a category");
      return;
    }
    if (!location.trim()) {
      alert("Location is required");
      return;
    }
    if (!description.trim()) {
      alert("Description is required");
      return;
    }
    if (description.length < 10) {
      alert("Description must be at least 10 characters");
      return;
    }

    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("title", title);
    formdata.append("start_date", start_date);
    formdata.append("end_date", end_date);
    formdata.append("start_time", convertTo12Hour(start_time));
    formdata.append("end_time", convertTo12Hour(end_time));
    formdata.append("price", price);
    formdata.append("cate_nm", cate_nm);
    formdata.append("cate_id", cate_id);
    formdata.append("location", location);
    formdata.append("description", description);

    try {
      const res = await axios.post(`${API_URL}/api/v1/admin/addevent`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Event posted successfully!");
      fetchData();
      setCurrentPage(1);

      setFile(null);
      setTitle("");
      setStartdate("");
      setEnddate("");
      setStarttime("");
      setEndtime("");
      setPrice("");
      setCategory("");
      setCategoryid("");
      setLocation("");
      setDescription("");

      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert(`Error posting event: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditStartDate(item.start_date);
    setEditEndDate(item.end_date);
    setEditStartTime(convertTo24Hour(item.start_time));
    setEditEndTime(convertTo24Hour(item.end_time));
    setEditPrice(item.price);
    setEditLocation(item.location);
    setEditCategory(item.cate_nm);
    setEditImage(null);
  };

  const handelUpdate = async (id) => {
    try {
      const formdata = new FormData();
      formdata.append("title", editTitle);
      formdata.append("start_date", editStartDate);
      formdata.append("end_date", editEndDate);
      formdata.append("start_time", convertTo12Hour(editStartTime));
      formdata.append("end_time", convertTo12Hour(editEndTime));
      formdata.append("price", editPrice);
      formdata.append("location", editLocation);
      formdata.append("cate_nm", editCategory);

      if (editImage) {
        formdata.append("image", editImage);
      }

      const res = await axios.put(`${API_URL}/api/v1/admin/updateevent/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      alert("Update successfully");
      fetchData();
      setCurrentPage(1);
      setEditId(null);
      setEditImage(null);
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  const totalPages = Math.ceil(event.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = event.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <div className="add-event">
        <h2 className="lock1">🔒</h2>
        <h2 className="form-title">Post Event</h2>

        <form className="event-form" onSubmit={handelsubmit} encType="multipart/form-data">
          <label>Image</label>
          <div className="file-upload">
            <input
              type="file"
              id="file"
              name="image"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file" className="choose-pic">Choose Pic</label>
          </div>

          <label>Title</label>
          <input
            type="text"
            placeholder="Enter Title *"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            min={today}
            value={start_date}
            onChange={(e) => setStartdate(e.target.value)}
          />

          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            min={start_date || today}
            value={end_date}
            onChange={(e) => setEnddate(e.target.value)}
          />

          <label>Start Time</label>
          <input
            type="time"
            name="start_time"
            value={start_time}
            onChange={(e) => setStarttime(e.target.value)}
          />

          <label>End Time</label>
          <input
            type="time"
            name="end_time"
            value={end_time}
            onChange={(e) => setEndtime(e.target.value)}
          />

          <label>Price</label>
          <input
            type="text"
            placeholder="Enter Price"
            name="price"
            value={price}
            autoComplete="off"
            onChange={(e) => setPrice(e.target.value)}
          />

          <label>Select Category</label>
          <select
            value={cate_id}
            onChange={(e) => {
              const selectedCat = categories.find((cat) => cat._id === e.target.value);
              if (selectedCat) {
                setCategoryid(selectedCat._id);
                setCategory(selectedCat.cate_nm);
              }
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.cate_nm}
              </option>
            ))}
          </select>

          <label>Location</label>
          <input
            type="text"
            placeholder="Enter Location"
            name="location"
            value={location}
            autoComplete="off"
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter Description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" className="submit-btn">POST</button>
        </form>
      </div>

      <div className="event-table-container">
        <table className="event-table" border={1}>
          <thead>
            <tr>
              <th rowSpan={2}>No</th>
              <th rowSpan={2}>Image</th>
              <th rowSpan={2}>Title</th>
              <th rowSpan={2}>Start Date</th>
              <th rowSpan={2}>End Date</th>
              <th rowSpan={2}>Start Time</th>
              <th rowSpan={2}>End Time</th>
              <th rowSpan={2}>Price</th>
              <th rowSpan={2}>Category</th>
              <th rowSpan={2}>Location</th>
              <th colSpan={2}>Action</th>
            </tr>
            <tr>
              <td>Update</td>
              <td>Delete</td>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((c, i) => (
              <tr key={c._id}>
                <td>{indexOfFirst + i + 1}</td>

                <td>
                  {editId === c._id ? (
                    <input
                      type="file"
                      className="edit-file"
                      accept="image/*"
                      onChange={(e) => setEditImage(e.target.files[0])}
                    />
                  ) : (
                    
                    <img
                      src={getImageUrl(c.image)}
                      alt={c.title || "event"}
                      height={50}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                    />
                  )}
                </td>

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
                      type="date"
                      className="edit-input"
                      value={editStartDate}
                      min={today}
                      onChange={(e) => setEditStartDate(e.target.value)}
                    />
                  ) : (
                    c.start_date
                  )}
                </td>

                <td>
                  {editId === c._id ? (
                    <input
                      type="date"
                      className="edit-input"
                      value={editEndDate}
                      min={today}
                      onChange={(e) => setEditEndDate(e.target.value)}
                    />
                  ) : (
                    c.end_date
                  )}
                </td>

                <td>
                  {editId === c._id ? (
                    <input
                      type="time"
                      className="edit-input"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                    />
                  ) : (
                    c.start_time
                  )}
                </td>

                <td>
                  {editId === c._id ? (
                    <input
                      type="time"
                      className="edit-input"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                    />
                  ) : (
                    c.end_time
                  )}
                </td>

                <td>
                  {editId === c._id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  ) : (
                    c.price
                  )}
                </td>

                <td>
                  {editId === c._id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    />
                  ) : (
                    c.cate_nm
                  )}
                </td>

                <td>
                  {editId === c._id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                    />
                  ) : (
                    c.location
                  )}
                </td>

                <td>
                  {editId === c._id ? (
                    <button
                      type="button"
                      className="save-btn"
                      onClick={() => handelUpdate(c._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <i className="fa fa-edit" onClick={() => handleEdit(c)}></i>
                  )}
                </td>

                <td>
                  <i className="fa fa-trash" onClick={() => deleteEvent(c._id)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "10px", display: "flex", gap: "8px", justifyContent: "center" }}>
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "10px 20px",
              background: "green",
              color: "white",
              borderRadius: "15px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.6 : 1,
            }}
          >
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Prev
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
                borderRadius: "10px",
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "10px 20px",
              background: "green",
              color: "white",
              borderRadius: "15px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.6 : 1,
            }}
          >
            Next <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>

        <p style={{ marginTop: 10, textAlign: "center" }}>
          Page {currentPage} of {totalPages}
        </p>
      </div>
    </>
  );
};

export default A_Addevent;