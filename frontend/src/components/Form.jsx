import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      const response = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        localStorage.setItem("username", username);
        navigate("/");
      } else if (method === "register") {
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid username or password");
        } else if (error.response.data && error.response.data.detail) {
          setError(error.response.data.detail);
        } else {
          setError("An error occurred. Please try again.");
        }
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-label">
        <h1>{name}</h1>
        {error && <div className="error-message">{error}</div>}
        <input
          className="form-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form-input" type="submit" disabled={loading}>
          {name}
        </button>
      </form>
      <p className="form-hint">
        {method === "login" ? (
          <>
            Don't have an account? <Link to="/register">Register here</Link>
          </>
        ) : (
          <>
            Already have an account? <Link to="/login">Login here</Link>
          </>
        )}
      </p>
    </div>
  );
}

export default Form;
