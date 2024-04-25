import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.css";

export default function Login() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [error, setErrorValue] = useState("");
  const navigate = useNavigate();

  function setUsername(event) {
    const username = event.target.value;
    setUsernameInput(username);
  }

  function setPassword(event) {
    const pswd = event.target.value;
    setPasswordInput(pswd);
  }

  async function submit() {
    setErrorValue("");
    try {
      const response = await axios.post("/api/users/login", {
        username: usernameInput,
        password: passwordInput,
      });
      // console.log(response.data);
      if (response.data && response.data.username) {
        localStorage.setItem("activeUsername", response.data.username);
        window.dispatchEvent(new Event("storageUpdated"));

        navigate("/");

        return;
      } else if (!response.data.username) {
        setErrorValue("This username doesn't exist");
      } else {
        setErrorValue("username not match password");
      }
    } catch (e) {
      setErrorValue("username not match password");
    }
  }

  return (
    <div className="login-container">
      <h1>Log in</h1>
      {!!error && <h2>{error}</h2>}
      <div>
        <span>Username: </span>
        <input type="text" value={usernameInput} onInput={setUsername}></input>
      </div>
      <div>
        <span>Password: </span>
        <input type="text" value={passwordInput} onInput={setPassword}></input>
      </div>

      <button onClick={submit}>Log in</button>
    </div>
  );
}
