import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import DropDownProfile from "./DropDownProfile";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Header = () => {

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const[search,setSearch]=useState("");
  const [user, setUser] = useState(null);   // FIXED
  const navigate=useNavigate();

  const[menus,setMenus]=useState([]);


  const [suggestions, setSuggestions] = useState([]);


  useEffect(()=>{
    
    const featchmenu=async()=>{
      try{
          const res=await axios.get("http://localhost:5000/api/v1/admin/getmenu");
          console.log("Menu:",res.data);
          setMenus(res.data.menus);
      }
      catch(error)
      {
        console.log(error);
      }
    }
    featchmenu();
  },[])

  useEffect(() => {

  if (!search.trim()) {
    setSuggestions([]);
    return;
  }

  const fetchSearch = async () => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/v1/admin/search/${search}`
      );

      setSuggestions(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const timer = setTimeout(fetchSearch, 300);

  return () => clearTimeout(timer);

}, [search]);

  const handelSearch=(e)=>{
        e.preventDefault();

        if(search.trim()!=="")
        {
            //const formattedSearch = search.trim();
          //window.location.href=`/events/${formattedSearch}`;
          navigate(`/events/${search.trim()}`);
          
        }
    }

  useEffect(() => {

    const updateUser = () => {

      const user = JSON.parse(sessionStorage.getItem("user"));
      console.log(sessionStorage.getItem("user"));
      console.log("User Data:", user);   // check avatar value
      
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      

    };

    updateUser();

    window.addEventListener("userChanged", updateUser);

    return () => {
      window.removeEventListener("userChanged", updateUser);
    };


    

  }, []);

  return (
    <header>

      <div className="logo">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO_VFkI-2gpSUH6fMfYghI7YTt40LFvKHTdg&s"
          alt="logo"
        />
      </div>

      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <nav className={menuOpen ? "nav-active" : ""}>
        <ul>
          {/* <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/event">Event</a></li>
          <li><a href="/gallary">Gallery</a></li>
          <li><a href="/contectus">Contact</a></li> */}
          {
            menus.map((item)=>{
              return(
              <li key={item._id}>
                <a href={item.menulink}>
                  {item.menuname}
                </a>
              </li>
             ) })
          }
        </ul>
      </nav>

  <form
  className="search-box"
  onSubmit={handelSearch}
>

  <input
    type="text"
    placeholder="Search events..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <button type="submit">
    <i className="fa fa-search"></i>
  </button>
 {suggestions.length > 0 && (
      <ul className="search-dropdown">

        {suggestions.map((item) => (
          <li
            key={item._id}
            onClick={() => {
              navigate(`/details/${item._id}`);
              setSearch("");
              setSuggestions([]);
            }}
          >
            {item.title}
          </li>
        ))}

      </ul>
    )}
 {suggestions.length > 0 && (
      <ul className="search-dropdown">

        {suggestions.map((item) => (
          <li
            key={item._id}
            onClick={() => {
              navigate(`/details/${item._id}`);
              setSearch("");
              setSuggestions([]);
            }}
          >
            {item.title}
          </li>
        ))}

      </ul>
    )}
</form>
      {/* Login or profile */}
      {!user ? (

        <div className="login-btn1">
          <a href="/login">Login</a>
        </div>

      ) : (

        <div className="spark" ref={profileRef}>
          <img
            src={
    user?.avatar
      ? user.avatar.startsWith("blob:")
        ? user.avatar
        : user.avatar.startsWith("http")
        ? user.avatar
        : `http://localhost:5000/uploads/${user.avatar}`
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
            width="60"
            alt="profile"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              setOpenProfile((prev) => !prev);
            }}
          />

          <p>{user?.fnm}</p>

          {openProfile && <DropDownProfile />}
        </div>

      )}

    </header>
  );
};

export default Header;