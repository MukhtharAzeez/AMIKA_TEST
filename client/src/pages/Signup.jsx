import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:4000/signup", {
        name,
        password,
      });
      if (response.data.status) {
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <p style={{ color: "red" }}>{error}</p>
      <input
        type="text"
        placeholder="usernmae"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
}

export default Signup;
