import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (method === "login") {
        const response = await api.post(route, { username, password });
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        localStorage.setItem("username", username);
        navigate("/");
      } else if (method === "register") {
        console.log(`route: ${route}\tusername: ${username}, email: ${email}`);
        const response = await api.post(route, { username, email });
        setMessage(
          response.data.message ||
            "Registration successful. Please check your email for your initial password."
        );
        setIsRegistered(true);
      }
    } catch (error) {
      // ... (error handling remains the same)
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="form-container">
        <div className="success-message">{message}</div>
        <button className="form-input" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

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
          required
        />
        {method === "register" ? (
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        ) : (
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button className="form-input" type="submit" disabled={loading}>
          {loading ? "Processing..." : name}
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
