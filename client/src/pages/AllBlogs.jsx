/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useState } from "react";

function AllBlogs({ blog }) {
  const [approved, setApproved] = useState(blog.approved);
  const [deleted, setDeleted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [error, setError] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const handleApprove = async (id) => {
    await axios.get("http://localhost:4000/approveBlog/" + id,{
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
    setApproved(!approved);
  };

  const handleDelete = async (id) => {
    await axios.get("http://localhost:4000/deleteBlog/" + id,{
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
    setDeleted(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/editBlog",
        {
          title,
          content,
          id:blog._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      if (response.data.status) {
        setMessageColor("green");
        setError(response.data.message);
        setEdit(false);
      } else {
        setMessageColor("red");
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return deleted ? (
    <></>
  ) : !edit ? (
    <div key={blog._id} style={{ display: "flex" }}>
      <p>{title} - </p>
      <p>{content} - </p>
      <p>{blog.author}</p>
      <button onClick={() => handleApprove(blog._id)}>
        {approved ? "Unapprove" : "Approve"}
      </button>
      <button onClick={() => setEdit(true)}>Edit</button>
      <button onClick={() => handleDelete(blog._id)}>Delete</button>
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
      <button onClick={handleSubmit}>Edit</button>
    </>
  );
}

export default AllBlogs;
