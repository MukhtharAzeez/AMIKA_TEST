import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllBlogs from "./AllBlogs";

function AdminHome() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const navigate = useNavigate();
  const [request, setRequests] = useState([]);
  const [seeBlogs, setSeeBlogs] = useState(false);
  const [image, setImage] = useState("");

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:4000/all-blogs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.status) {
        setRequests(response.data.blogs);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    if(request.length>0) return
    fetchBlogs();
  }, [request]);

  const handleSubmit = async () => {
    if (title.length == 0) return;
    if (content.length == 0) return;
    if (image.length == 0) return;
    const formData = new FormData();
    formData.append("upload_preset", "fetovrfe");
    formData.append("file", image);
    const imageLink = await axios.post(`https://api.cloudinary.com/v1_1/dr2hks7gt/image/upload`,formData);

    try {
      const response = await axios.post(
        "http://localhost:4000/createBlog",
        {
          title,
          content,
          image: imageLink.data.secure_url,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.status) {
        setMessageColor("green");
        setError(response.data.message);
        setRequests([]);
      } else {
        setMessageColor("red");
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <p style={{ color: messageColor }}>{error}</p>
      {seeBlogs ? (
        <>
          <div style={{display: 'flex', gap: '40px', maxWidth: '1400px', overflowX: 'scroll'}}>
            {request.map((blog) => {
              return <AllBlogs key={blog._id} blog={blog} />;
            })}
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button onClick={handleSubmit}>Create</button>
        </>
      )}
      <button
        style={{ position: "absolute", top: "20px", right: "20px" }}
        onClick={handleLogout}
      >
        {" "}
        Logout
      </button>
      <button
        onClick={() => {
          setSeeBlogs(!seeBlogs);
        }}
      >
        {" "}
        {!seeBlogs ? "See All Blogs" : "Create Blog"}
      </button>
    </div>
  );
}

export default AdminHome;
