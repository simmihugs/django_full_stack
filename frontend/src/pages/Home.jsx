import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <HeaderBar username={username} onLogout={handleLogout} />
      <div>
        <h1>Welcome to the Home page</h1>
      </div>
    </>
  );
}

export default Home;
