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
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
      try {
        const response = await axios.post("http://localhost:4000/createBlog", {
          title,
          content,
        },{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });
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
        <div>
          {blogs.map((blog) => {
            return (
              <div key={blog._id} style={{ display: "flex" }}>
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
          <button onClick={handleSubmit}>Create</button>
        </>
      )}
    <button style={{position:'absolute', top: '20px', right: '20px'}} onClick={handleLogout}> Logout</button>
    </div>
  );
}

export default Home;
