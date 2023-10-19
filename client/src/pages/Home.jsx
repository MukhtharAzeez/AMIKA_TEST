import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [blogCreate, setBlogCreate] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:4000/blogs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.status) {
        setBlogs(response.data.blogs);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

   const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

  useEffect(() => {
    if(!localStorage.getItem("token")) navigate('/login')
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
      if (title.length == 0) return;
      if (content.length == 0) return;
      if (image.length == 0) return;
      const formData = new FormData();
      formData.append("upload_preset", "fetovrfe");
      formData.append("file", image);
      const imageLink = await axios.post(
        `https://api.cloudinary.com/v1_1/dr2hks7gt/image/upload`,
        formData
      );
      try {
        const response = await axios.post(
          "http://localhost:4000/createBlog",
          {
            title,
            content,
            image: imageLink.data.secure_url,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response)
        if (response.data.status) {
            setMessageColor('green')
            setError(response.data.message);
        } else {
            setMessageColor('red')
            setError(response.data.message);
        }
      } catch (error) {
        console.log(error)
        setError("Something went wrong");
      }
    };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <button onClick={() => setBlogCreate(!blogCreate)}>
        {blogCreate ? "See All Blogs" : "Create a Blog"}
      </button>
      <p style={{ color: messageColor }}>{error}</p>

      {!blogCreate ? (
        <div style={{display: 'flex', gap: '40px'}}>
          {blogs.map((blog) => {
            return (
              <div
                key={blog._id}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <img
                  style={{ width: "100px", height: "100px" }}
                  src={blog.image}
                />

                <p>{blog.title} - </p>
                <p>{blog.content} - </p>
                <p>{blog.author}</p>
              </div>
            );
          })}
        </div>
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
    </div>
  );
}

export default Home;
