import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Header.css";
import { Link } from "react-router-dom";

export default function Header() {
  const [activeUsername, setActiveUsername] = useState(
    localStorage.getItem("activeUsername")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const updateActiveUser = () => {
      const username = localStorage.getItem("activeUsername");
      setActiveUsername(username);
    };

    // This function checks the current session status directly from the backend.
    const checkIfUserIsLoggedIn = async () => {
      try {
        const response = await axios.get("/api/users/isLoggedIn");
        if (response.data.username) {
          localStorage.setItem("activeUsername", response.data.username);
          updateActiveUser();
        }
      } catch (error) {
        console.error("Failed to verify login status", error);
      }
    };

    // Initial check on mount and setting up listeners
    checkIfUserIsLoggedIn();
    window.addEventListener("storage", updateActiveUser);
    window.addEventListener("storageUpdated", updateActiveUser);

    // Cleanup the event listeners
    return () => {
      window.removeEventListener("storage", updateActiveUser);
      window.removeEventListener("storageUpdated", updateActiveUser);
    };
  }, []);

  async function logOutUser() {
    try {
      await axios.post("/api/users/logOut");
      localStorage.removeItem("activeUsername");
      setActiveUsername(null);
      navigate("/home");
      return;
    } catch (error) {
      console.log("Log out failed: ", error);
    }
  }

  if (!activeUsername) {
    return (
      <header className="header">
        <nav>
          <ul>
            <li>
              <Link to="/login" className="button">
                Log in
              </Link>
            </li>
            <li>
              <Link to="/register" className="button">
                Register
              </Link>
            </li>
            <li>
              <Link to="/home" className="button">
                HomePage
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }

  return (
    <div className="header">
      <div className="welcome-message">Welcome, {activeUsername}</div>

      <div>
        <Link to="/home" className="button">
          HomePage
        </Link>
      </div>

      <button className="button" onClick={logOutUser}>
        Log Out
      </button>
    </div>
  );
}
